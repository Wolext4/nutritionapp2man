"use client"

import { useState } from "react"
import { useAuth } from "../contexts/auth-context"
import { useMeals } from "../hooks/use-meals"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, ChevronLeft, ChevronRight, Plus, Utensils, Clock, Target } from "lucide-react"
import MealLogger from "./meal-logger"

interface DailyMealTrackerProps {
  onMealLogged?: () => void
}

export default function DailyMealTracker({ onMealLogged }: DailyMealTrackerProps = {}) {
  const { user } = useAuth()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [showMealLogger, setShowMealLogger] = useState(false)
  const [selectedMealType, setSelectedMealType] = useState<"breakfast" | "lunch" | "dinner" | "snack">("breakfast")

  const { meals, refetch } = useMeals(selectedDate)

  const handleMealLogged = () => {
    refetch()
    setShowMealLogger(false)
    if (onMealLogged) {
      onMealLogged()
    }
  }

  const navigateDate = (direction: "prev" | "next") => {
    const currentDate = new Date(selectedDate)
    if (direction === "prev") {
      currentDate.setDate(currentDate.getDate() - 1)
    } else {
      currentDate.setDate(currentDate.getDate() + 1)
    }
    setSelectedDate(currentDate.toISOString().split("T")[0])
  }

  const getMealsByType = (type: string) => {
    return meals.filter((meal) => meal.type === type)
  }

  const getTotalCaloriesForMealType = (type: string) => {
    return getMealsByType(type).reduce((total, meal) => total + meal.totalNutrition.calories, 0)
  }

  const getTotalDailyCalories = () => {
    return meals.reduce((total, meal) => total + meal.totalNutrition.calories, 0)
  }

  const getDailyCalorieTarget = () => {
    if (!user) return 2000
    // Simple calculation based on user data
    const bmr =
      user.gender === "male"
        ? 88.362 + 13.397 * user.weight + 4.799 * user.height - 5.677 * user.age
        : 447.593 + 9.247 * user.weight + 3.098 * user.height - 4.33 * user.age
    return Math.round(bmr * 1.5) // Assuming moderate activity
  }

  const mealTypes = [
    { type: "breakfast", icon: "🌅", label: "Breakfast", time: "7:00 AM" },
    { type: "lunch", icon: "☀️", label: "Lunch", time: "12:00 PM" },
    { type: "dinner", icon: "🌙", label: "Dinner", time: "7:00 PM" },
    { type: "snack", icon: "🍎", label: "Snacks", time: "Anytime" },
  ]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date().toISOString().split("T")[0]
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0]

    if (dateString === today) return "Today"
    if (dateString === yesterday) return "Yesterday"

    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    })
  }

  if (!user) return null

  if (showMealLogger) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setShowMealLogger(false)} className="flex items-center gap-2">
            ← Back to Daily Tracker
          </Button>
          <div className="text-sm text-muted-foreground">
            Adding {selectedMealType} for {formatDate(selectedDate)}
          </div>
        </div>
        <MealLogger onMealLogged={handleMealLogged} />
      </div>
    )
  }

  const dailyCalories = getTotalDailyCalories()
  const calorieTarget = getDailyCalorieTarget()
  const calorieProgress = (dailyCalories / calorieTarget) * 100

  return (
    <div className="space-y-3 xs:space-y-4 sm:space-y-6">
      {/* Date Navigation */}
      <Card>
        <CardHeader>
          <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 xs:gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-base xs:text-lg sm:text-xl">
                <Calendar className="h-4 w-4 xs:h-5 xs:w-5 text-blue-600" />
                Daily Meal Tracker
              </CardTitle>
              <CardDescription className="text-xs xs:text-sm sm:text-base">
                Track your meals throughout the day
              </CardDescription>
            </div>
            <div className="flex items-center justify-center gap-3 xs:gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateDate("prev")}
                className="h-8 w-8 xs:h-9 xs:w-9 p-0"
              >
                <ChevronLeft className="h-3 w-3 xs:h-4 xs:w-4" />
              </Button>
              <div className="text-sm xs:text-base font-medium min-w-[140px] xs:min-w-[160px] text-center px-2">
                {formatDate(selectedDate)}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateDate("next")}
                className="h-8 w-8 xs:h-9 xs:w-9 p-0"
                disabled={selectedDate >= new Date().toISOString().split("T")[0]}
              >
                <ChevronRight className="h-3 w-3 xs:h-4 xs:w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Daily Progress */}
          <div className="space-y-2 xs:space-y-3">
            <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1 xs:gap-2">
              <div className="flex items-center gap-2">
                <Target className="h-3 w-3 xs:h-4 xs:w-4 text-green-600" />
                <span className="text-xs xs:text-sm font-medium">Daily Progress</span>
              </div>
              <div className="text-xs xs:text-sm text-muted-foreground">
                {dailyCalories.toFixed(0)} / {calorieTarget} calories
              </div>
            </div>
            <div className="w-full bg-secondary rounded-full h-2 xs:h-3">
              <div
                className={`h-2 xs:h-3 rounded-full transition-all ${
                  calorieProgress < 70
                    ? "bg-red-500"
                    : calorieProgress < 90
                      ? "bg-orange-500"
                      : calorieProgress > 110
                        ? "bg-red-500"
                        : "bg-green-500"
                }`}
                style={{ width: `${Math.min(calorieProgress, 100)}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground">
              {calorieProgress < 70 && "You're below your daily calorie target"}
              {calorieProgress >= 70 && calorieProgress <= 110 && "Great! You're on track with your daily goals"}
              {calorieProgress > 110 && "You've exceeded your daily calorie target"}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meal Types */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4">
        {mealTypes.map((mealType) => {
          const mealTypeKey = mealType.type as "breakfast" | "lunch" | "dinner" | "snack"
          const mealsForType = getMealsByType(mealType.type)
          const totalCalories = getTotalCaloriesForMealType(mealType.type)

          return (
            <Card key={mealType.type} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2 xs:pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base xs:text-lg">{mealType.icon}</span>
                    <div>
                      <CardTitle className="text-xs xs:text-sm sm:text-base">{mealType.label}</CardTitle>
                      <CardDescription className="text-xs">
                        <Clock className="h-2 w-2 xs:h-3 xs:w-3 inline mr-1" />
                        {mealType.time}
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedMealType(mealTypeKey)
                      setShowMealLogger(true)
                    }}
                    className="h-7 w-7 xs:h-8 xs:w-8 p-0 bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="h-3 w-3 xs:h-4 xs:w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {mealsForType.length === 0 ? (
                  <div className="text-center py-3 xs:py-4">
                    <Utensils className="h-6 w-6 xs:h-8 xs:w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">No meals logged</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedMealType(mealTypeKey)
                        setShowMealLogger(true)
                      }}
                      className="mt-2 text-xs h-7"
                    >
                      Add {mealType.label}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {mealsForType.length} meal{mealsForType.length !== 1 ? "s" : ""}
                      </Badge>
                      <div className="text-xs xs:text-sm font-medium text-green-600">
                        {totalCalories.toFixed(0)} cal
                      </div>
                    </div>
                    <div className="space-y-1">
                      {mealsForType.slice(0, 3).map((meal) => (
                        <div key={meal.id} className="text-xs text-muted-foreground">
                          <div className="flex justify-between gap-1">
                            <span className="truncate flex-1">{meal.foods.map((f) => f.name).join(", ")}</span>
                            <span className="flex-shrink-0">{meal.totalNutrition.calories.toFixed(0)} cal</span>
                          </div>
                        </div>
                      ))}
                      {mealsForType.length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          +{mealsForType.length - 3} more meal{mealsForType.length - 3 !== 1 ? "s" : ""}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Meals */}
      {meals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base xs:text-lg">Today's Meals</CardTitle>
            <CardDescription className="text-xs xs:text-sm">
              {meals.length} meal{meals.length !== 1 ? "s" : ""} logged • {dailyCalories.toFixed(0)} total calories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 xs:space-y-3">
              {meals.map((meal) => (
                <div
                  key={meal.id}
                  className="flex flex-col xs:flex-row xs:items-center justify-between p-2 xs:p-3 border rounded-lg gap-2"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Badge variant="outline" className="text-xs">
                        {meal.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{meal.time}</span>
                    </div>
                    <div className="text-xs xs:text-sm font-medium">{meal.foods.map((f) => f.name).join(", ")}</div>
                    <div className="text-xs text-muted-foreground">
                      {meal.foods.length} item{meal.foods.length !== 1 ? "s" : ""}
                    </div>
                  </div>
                  <div className="text-right xs:text-left">
                    <div className="text-xs xs:text-sm font-medium">{meal.totalNutrition.calories.toFixed(0)} cal</div>
                    <div className="text-xs text-muted-foreground">
                      {meal.totalNutrition.protein.toFixed(1)}g protein
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
