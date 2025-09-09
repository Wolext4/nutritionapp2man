"use client"

import { useEffect } from "react"
import { useAuth } from "./contexts/auth-context"
import { LocalDatabase } from "@/lib/local-storage"
import AuthPage from "./components/auth-page"
import Dashboard from "./components/dashboard"
import LoadingSpinner from "./components/loading-spinner"

export default function Home() {
  const { user, isLoading } = useAuth()

  useEffect(() => {
    // Initialize the local database with demo data
    LocalDatabase.initialize()
  }, [])

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <AuthPage />
  }

  return <Dashboard />
}
