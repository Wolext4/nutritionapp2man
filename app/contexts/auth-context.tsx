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
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const currentUser = LocalDatabase.getCurrentUser()
      setUser(currentUser)
      if (currentUser) {
        const tutorialCompleted = localStorage.getItem(`tutorial_completed_${currentUser.id}`) === "true"
        const isAdmin = currentUser.role === "admin"

        // Show tutorial if not completed OR if user is admin (admin always sees tutorial)
        if (!tutorialCompleted || isAdmin) {
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
      const result = await LocalDatabase.loginUser(email, password)

      if (result.success && result.user) {
        setUser(result.user)
        const isAdmin = result.user.role === "admin"
        if (isAdmin) {
          setShowTutorial(true)
        }
        return { success: true }
      } else {
        return { success: false, error: result.error || "Login failed" }
      }
    } catch (error) {
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
    // Store tutorial completion in localStorage
    localStorage.setItem(`tutorial_completed_${user?.id}`, "true")
  }

  const skipTutorial = () => {
    setShowTutorial(false)
    // Store tutorial skip in localStorage
    localStorage.setItem(`tutorial_completed_${user?.id}`, "true")
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
