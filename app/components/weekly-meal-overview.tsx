"use client"

import { useState } from "react"
import { useAuth } from "../contexts/auth-context"
import { useMeals } from "../hooks/use-meals"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, ChevronLeft, ChevronRight, TrendingUp, Target } from "lucide-react"

export default function WeeklyMealOverview() {
  const { user } = useAuth()
  const [selectedWeek, setSelectedWeek] = useState(0) // 0 = current week, -1 = last week, etc.

  // Calculate week start and end dates
  const getWeekDates = (weekOffset: number) => {
    const today = new Date()
    const currentDay = today.getDay()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - currentDay - weekOffset * 7)

    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)

    return {
      start: startOfWeek.toISOString().split("T")[0],
      end: endOfWeek.toISOString().split("T")[0],
    }
  }

  const weekDates = getWeekDates(selectedWeek)
  const { meals, isLoading } = useMeals(undefined, weekDates.start, weekDates.end)

  const getDayOfWeek = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { weekday: "short" })
  }

  const getDateNumber = (dateString: string) => {
    const date = new Date(dateString)
    return date.getDate()
  }

  const getDailyMeals = (dateString: string) => {
    return meals.filter((meal) => meal.date === dateString)
  }

  const getDailyCalories = (dateString: string) => {
    return getDailyMeals(dateString).reduce((total, meal) => total + meal.totalNutrition.calories, 0)
  }

  const getWeekDays = () => {
    const days = []
    const startDate = new Date(weekDates.start)

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      days.push(date.toISOString().split("T")[0])
    }

    return days
  }

  const weekDays = getWeekDays()
  const totalWeeklyCalories = meals.reduce((total, meal) => total + meal.totalNutrition.calories, 0)
  const averageDailyCalories = meals.length > 0 ? totalWeeklyCalories / 7 : 0
  const daysWithMeals = new Set(meals.map((meal) => meal.date)).size

  const getDailyCalorieTarget = () => {
    if (!user) return 2000
    const bmr =
      user.gender === "male"
        ? 88.362 + 13.397 * user.weight + 4.799 * user.height - 5.677 * user.age
        : 447.593 + 9.247 * user.weight + 3.098 * user.height - 4.33 * user.age
    return Math.round(bmr * 1.5)
  }

  const dailyTarget = getDailyCalorieTarget()
  const weeklyTarget = dailyTarget * 7

  const formatWeekRange = () => {
    const startDate = new Date(weekDates.start)
    const endDate = new Date(weekDates.end)

    if (selectedWeek === 0) {
      return "This Week"
    } else if (selectedWeek === -1) {
      return "Last Week"
    }

    return `${startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${endDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
  }

  if (!user) return null

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Week Navigation */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Calendar className="h-5 w-5 text-purple-600" />
                Weekly Overview
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Your meal tracking progress for the week
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedWeek(selectedWeek - 1)}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-sm font-medium min-w-[120px] text-center">{formatWeekRange()}</div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedWeek(selectedWeek + 1)}
                className="h-8 w-8 p-0"
                disabled={selectedWeek >= 0}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Weekly Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{daysWithMeals}</div>
              <div className="text-sm text-muted-foreground">Days Logged</div>
              <div className="text-xs text-muted-foreground">out of 7 days</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{averageDailyCalories.toFixed(0)}</div>
              <div className="text-sm text-muted-foreground">Avg Daily Calories</div>
              <div className="text-xs text-muted-foreground">Target: {dailyTarget}</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{meals.length}</div>
              <div className="text-sm text-muted-foreground">Total Meals</div>
              <div className="text-xs text-muted-foreground">This week</div>
            </div>
          </div>

          {/* Weekly Progress */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4 text-green-600" />
                Weekly Calorie Progress
              </span>
              <span className="text-sm text-muted-foreground">
                {totalWeeklyCalories.toFixed(0)} / {weeklyTarget} calories
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-3">
              <div
                className="bg-green-500 h-3 rounded-full transition-all"
                style={{ width: `${Math.min((totalWeeklyCalories / weeklyTarget) * 100, 100)}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-orange-600" />
            Daily Breakdown
          </CardTitle>
          <CardDescription>Meal tracking for each day of the week</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading weekly data...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
              {weekDays.map((day) => {
                const dayMeals = getDailyMeals(day)
                const dayCalories = getDailyCalories(day)
                const isToday = day === new Date().toISOString().split("T")[0]
                const isFuture = new Date(day) > new Date()

                return (
                  <div
                    key={day}
                    className={`p-3 border rounded-lg ${
                      isToday ? "border-green-500 bg-green-50 dark:bg-green-950/20" : ""
                    } ${isFuture ? "opacity-50" : ""}`}
                  >
                    <div className="text-center">
                      <div className="text-sm font-medium">{getDayOfWeek(day)}</div>
                      <div className="text-lg font-bold">{getDateNumber(day)}</div>

                      {dayMeals.length > 0 ? (
                        <div className="mt-2 space-y-1">
                          <Badge
                            variant={dayCalories >= dailyTarget * 0.8 ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {dayCalories.toFixed(0)} cal
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            {dayMeals.length} meal{dayMeals.length !== 1 ? "s" : ""}
                          </div>

                          {/* Meal type indicators */}
                          <div className="flex justify-center gap-1 mt-2">
                            {["breakfast", "lunch", "dinner"].map((mealType) => {
                              const hasMealType = dayMeals.some((meal) => meal.type === mealType)
                              return (
                                <div
                                  key={mealType}
                                  className={`w-2 h-2 rounded-full ${
                                    hasMealType ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                                  }`}
                                  title={mealType}
                                />
                              )
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="mt-2">
                          {!isFuture && <div className="text-xs text-muted-foreground">No meals logged</div>}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
