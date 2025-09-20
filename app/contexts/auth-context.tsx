"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { LocalDatabase, type User } from "@/lib/local-storage"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (userData: {
    fullName: string
    email: string
    password: string
    age: number
    gender: "male" | "female" | "other"
    height: number
    weight: number
    waistCircumference?: number // Added optional waist circumference to signup interface
  }) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>
  isLoading: boolean
  refreshUser: () => Promise<void>
  showTutorial: boolean
  completeTutorial: () => void
  skipTutorial: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showTutorial, setShowTutorial] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Initialize database with demo users on client side
      LocalDatabase.initialize()
      checkAuth()
    } else {
      setIsLoading(false)
    }
  }, [])

  const checkAuth = async () => {
    try {
      if (typeof window === "undefined") {
        setIsLoading(false)
        return
      }

      const currentUser = LocalDatabase.getCurrentUser()
      setUser(currentUser)
      if (currentUser) {
        const tutorialCompleted = localStorage.getItem(`tutorial_completed_${currentUser.id}`) === "true"

        if (!tutorialCompleted) {
          setShowTutorial(true)
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      if (typeof window !== "undefined") {
        LocalDatabase.initialize()
      }

      console.log("[v0] Starting login process for:", email)
      const result = await LocalDatabase.loginUser(email, password)
      console.log("[v0] Login result:", result)

      if (result.success && result.user) {
        console.log("[v0] Setting user in auth context:", result.user.email)
        setUser(result.user)
        if (typeof window !== "undefined") {
          const tutorialCompleted = localStorage.getItem(`tutorial_completed_${result.user.id}`) === "true"
          if (!tutorialCompleted) {
            setShowTutorial(true)
          }
        }
        console.log("[v0] Login process completed successfully")
        return { success: true }
      } else {
        console.log("[v0] Login failed with error:", result.error)
        return { success: false, error: result.error || "Login failed" }
      }
    } catch (error) {
      console.error("[v0] Login error:", error)
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  const signup = async (userData: {
    fullName: string
    email: string
    password: string
    age: number
    gender: "male" | "female" | "other"
    height: number
    weight: number
    waistCircumference?: number // Added waist circumference parameter
  }) => {
    try {
      const result = await LocalDatabase.createUser(userData)

      if (result.success && result.user) {
        setUser(result.user)
        setShowTutorial(true)
        return { success: true }
      } else {
        return { success: false, error: result.error || "Signup failed" }
      }
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  const logout = async () => {
    try {
      LocalDatabase.logoutUser()
      setUser(null)
      setShowTutorial(false)
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) {
      return { success: false, error: "No user logged in" }
    }

    try {
      const result = await LocalDatabase.updateUser(user.id, updates)

      if (result.success && result.user) {
        setUser(result.user)
        return { success: true }
      } else {
        return { success: false, error: result.error || "Update failed" }
      }
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  const refreshUser = async () => {
    await checkAuth()
  }

  const completeTutorial = () => {
    setShowTutorial(false)
    if (typeof window !== "undefined") {
      localStorage.setItem(`tutorial_completed_${user?.id}`, "true")
    }
  }

  const skipTutorial = () => {
    setShowTutorial(false)
    if (typeof window !== "undefined") {
      localStorage.setItem(`tutorial_completed_${user?.id}`, "true")
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        updateProfile,
        isLoading,
        refreshUser,
        showTutorial,
        completeTutorial,
        skipTutorial,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
