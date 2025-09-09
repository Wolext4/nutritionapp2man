"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/auth-context"
import { LocalDatabase, type UserProfile } from "@/lib/local-storage"

export function useProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = async () => {
    if (!user) {
      setProfile(null)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const userProfile = LocalDatabase.getUserProfile(user.id)
      setProfile(userProfile)
    } catch (err) {
      setError("Failed to fetch profile")
      console.error("Error fetching profile:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const updateProfile = async (profileData: Omit<UserProfile, "userId" | "updatedAt">) => {
    if (!user) {
      return { success: false, error: "No user logged in" }
    }

    try {
      const result = await LocalDatabase.updateUserProfile(user.id, profileData)

      if (result.success && result.profile) {
        setProfile(result.profile)
        return { success: true, profile: result.profile }
      } else {
        return { success: false, error: result.error || "Failed to update profile" }
      }
    } catch (err) {
      console.error("Error updating profile:", err)
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [user])

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    refetch: fetchProfile,
  }
}
