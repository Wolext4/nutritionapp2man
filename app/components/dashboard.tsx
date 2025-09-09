"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/auth-context"
import { useMeals } from "../hooks/use-meals"
import { useTheme } from "../contexts/theme-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LogOut,
  Moon,
  Sun,
  Activity,
  Target,
  TrendingUp,
  Apple,
  Calculator,
  BookOpen,
  PlusCircle,
  Trash2,
  User,
} from "lucide-react"
import { calculateBMI, getDailyCalorieRecommendation } from "../utils/calculations"
import MealLogger from "./meal-logger"
import BMICalculator from "./bmi-calculator"
import NutritionSummary from "./nutrition-summary"
import Recommendations from "./recommendations"
import PersonalizedWelcome from "./personalized-welcome"
import ProfileSettings from "./profile-settings"

export default function Dashboard() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [activeTab, setActiveTab] = useState("overview")

  const today = new Date().toISOString().split("T")[0]
  const { meals: todaysMeals, deleteMeal, isLoading: mealsLoading, refetch } = useMeals(today)

  // Add useEffect to refetch meals when tab changes back to overview
  useEffect(() => {
    if (activeTab === "overview") {
      refetch()
    }
  }, [activeTab, refetch])

  if (!user) return null

  const bmiResult = calculateBMI(user.weight, user.height)
  const dailyCalories = getDailyCalorieRecommendation(user.age, user.gender, user.weight, user.height)

  const totalCaloriesToday = todaysMeals?.reduce((sum, meal) => sum + (meal.totalNutrition?.calories || 0), 0) || 0
  const totalProteinToday = todaysMeals?.reduce((sum, meal) => sum + (meal.totalNutrition?.protein || 0), 0) || 0

  const handleDeleteMeal = async (mealId: string) => {
    if (confirm("Are you sure you want to delete this meal?")) {
      const result = await deleteMeal(mealId)
      if (result.success) {
        // Refresh the data after successful deletion
        refetch()
      }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Apple className="h-8 w-8 text-green-600" />
              <h1 className="text-2xl font-bold text-green-800">GluGuide</h1>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
                {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </Button>

              <Button
                variant="ghost"
                onClick={() => setActiveTab("profile")}
                className="flex items-center gap-3 hover:bg-muted/50 rounded-lg p-2"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback className="bg-green-600 text-white text-sm">
                    {user.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium">{user.fullName}</p>
                  <p className="text-xs text-muted-foreground">
                    BMI: {bmiResult.bmi} ({bmiResult.category})
                  </p>
                </div>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="rounded-full text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-fit lg:grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="log-meal" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Log Meal</span>
            </TabsTrigger>
            <TabsTrigger value="bmi" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              <span className="hidden sm:inline">BMI</span>
            </TabsTrigger>
            <TabsTrigger value="nutrition" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Nutrition</span>
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Tips</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Personalized Welcome Section */}
            <PersonalizedWelcome />

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-600" />
                    Today's Calories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold">{totalCaloriesToday.toFixed(0)}</div>
                    <div className="text-sm text-muted-foreground">of {dailyCalories} recommended</div>
                    <div className="text-xs text-muted-foreground">
                      {totalProteinToday.toFixed(1)}g protein • {todaysMeals.length} meals
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min((totalCaloriesToday / dailyCalories) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-600" />
                    BMI Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold">{bmiResult.bmi}</div>
                    <Badge
                      variant={
                        bmiResult.category === "Normal"
                          ? "default"
                          : bmiResult.category === "Underweight"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {bmiResult.category}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Apple className="h-5 w-5 text-orange-600" />
                    Meals Today
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold">{todaysMeals.length}</div>
                    <div className="text-sm text-muted-foreground">
                      {todaysMeals.length === 0
                        ? "No meals logged"
                        : todaysMeals.length === 1
                          ? "meal logged"
                          : "meals logged"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {todaysMeals.filter((m) => m.type === "breakfast").length > 0 && "🌅 "}
                      {todaysMeals.filter((m) => m.type === "lunch").length > 0 && "🌞 "}
                      {todaysMeals.filter((m) => m.type === "dinner").length > 0 && "🌙 "}
                      {todaysMeals.filter((m) => m.type === "snack").length > 0 && "🍎 "}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    Weight Goal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-lg font-bold">
                      {bmiResult.category === "Underweight"
                        ? "Gain Weight"
                        : bmiResult.category === "Overweight" || bmiResult.category === "Obese"
                          ? "Lose Weight"
                          : "Maintain"}
                    </div>
                    <div className="text-sm text-muted-foreground">Current: {user.weight}kg</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Meals */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Meals</CardTitle>
                <CardDescription>Your food intake for today</CardDescription>
              </CardHeader>
              <CardContent>
                {mealsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                    <p className="text-muted-foreground mt-2">Loading meals...</p>
                  </div>
                ) : todaysMeals.length === 0 ? (
                  <div className="text-center py-8">
                    <Apple className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No meals logged today</p>
                    <Button onClick={() => setActiveTab("log-meal")} className="mt-4 bg-green-600 hover:bg-green-700">
                      Log Your First Meal
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {todaysMeals.map((meal) => (
                      <div key={meal.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline">{meal.type}</Badge>
                            <span className="text-sm text-muted-foreground">{meal.time}</span>
                            {meal.mood && (
                              <Badge variant="outline" className="text-xs">
                                {meal.mood === "great"
                                  ? "😊"
                                  : meal.mood === "good"
                                    ? "🙂"
                                    : meal.mood === "okay"
                                      ? "😐"
                                      : "😔"}{" "}
                                {meal.mood}
                              </Badge>
                            )}
                          </div>
                          <div className="font-medium">{meal.foods.map((food) => food.name).join(", ")}</div>
                          {meal.notes && (
                            <div className="text-sm text-muted-foreground italic mt-1">"{meal.notes}"</div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <div className="font-bold">{meal.totalNutrition.calories.toFixed(0)} cal</div>
                            <div className="text-sm text-muted-foreground">
                              {meal.totalNutrition.protein.toFixed(1)}g protein
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteMeal(meal.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Health Tips</CardTitle>
                <CardDescription>Based on your BMI and today's intake</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bmiResult.recommendations.slice(0, 3).map((rec, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-sm">{rec}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="log-meal">
            <MealLogger onMealLogged={() => refetch()} />
          </TabsContent>

          <TabsContent value="bmi">
            <BMICalculator />
          </TabsContent>

          <TabsContent value="nutrition">
            <NutritionSummary />
          </TabsContent>

          <TabsContent value="recommendations">
            <Recommendations />
          </TabsContent>

          <TabsContent value="profile">
            <ProfileSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
