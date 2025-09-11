"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "../contexts/auth-context"
import { LocalDatabase, type Meal } from "@/lib/local-storage"

export function useMeals(date?: string, startDate?: string, endDate?: string) {
  const { user } = useAuth()
  const [meals, setMeals] = useState<Meal[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMeals = useCallback(async () => {
    if (!user) {
      setMeals([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      let userMeals: Meal[]

      if (date) {
        userMeals = LocalDatabase.getMealsByDate(user.id, date)
      } else {
        userMeals = LocalDatabase.getUserMeals(user.id, startDate, endDate)
      }

      // Sort meals by creation time (newest first)
      userMeals.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

      setMeals(userMeals)
    } catch (err) {
      setError("Failed to fetch meals")
      console.error("Error fetching meals:", err)
    } finally {
      setIsLoading(false)
    }
  }, [user, date, startDate, endDate])

  const addMeal = async (mealData: {
    type: "breakfast" | "lunch" | "dinner" | "snack"
    date: string
    time: string
    foods: any[]
  }) => {
    if (!user) {
      return { success: false, error: "No user logged in" }
    }

    try {
      // Calculate total nutrition
      const totalNutrition = mealData.foods.reduce(
        (total, food) => ({
          calories: total.calories + (food.nutrition?.calories || 0),
          protein: total.protein + (food.nutrition?.protein || 0),
          carbs: total.carbs + (food.nutrition?.carbs || 0),
          fats: total.fats + (food.nutrition?.fats || 0),
          fiber: total.fiber + (food.nutrition?.fiber || 0),
          iron: total.iron + (food.nutrition?.iron || 0),
          vitaminA: total.vitaminA + (food.nutrition?.vitaminA || 0),
        }),
        {
          calories: 0,
          protein: 0,
          carbs: 0,
          fats: 0,
          fiber: 0,
          iron: 0,
          vitaminA: 0,
        },
      )

      const result = await LocalDatabase.createMeal({
        userId: user.id,
        type: mealData.type,
        date: mealData.date,
        time: mealData.time,
        foods: mealData.foods,
        totalNutrition,
      })

      if (result.success && result.meal) {
        setMeals((prev) => [result.meal!, ...prev])
        return { success: true, meal: result.meal }
      } else {
        return { success: false, error: result.error || "Failed to add meal" }
      }
    } catch (err) {
      console.error("Error adding meal:", err)
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  const deleteMeal = async (mealId: string) => {
    if (!user) {
      return { success: false, error: "No user logged in" }
    }

    try {
      const result = await LocalDatabase.deleteMeal(mealId, user.id)

      if (result.success) {
        setMeals((prev) => prev.filter((meal) => meal.id !== mealId))
        return { success: true }
      } else {
        return { success: false, error: result.error || "Failed to delete meal" }
      }
    } catch (err) {
      console.error("Error deleting meal:", err)
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  useEffect(() => {
    fetchMeals()
  }, [fetchMeals])

  return {
    meals,
    isLoading,
    error,
    addMeal,
    deleteMeal,
    refetch: fetchMeals,
  }
}
