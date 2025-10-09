"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/auth-context"
import { useMeals } from "../hooks/use-meals"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LogOut,
  Activity,
  Target,
  TrendingUp,
  Apple,
  Calculator,
  BookOpen,
  PlusCircle,
  Trash2,
  User,
  Utensils,
  Shield,
  SheetIcon as SleepIcon,
  Dumbbell,
  Hand,
} from "lucide-react"
import { calculateBMI, getDailyCalorieRecommendation } from "../utils/calculations"
import MealLogger from "./meal-logger"
import BMICalculator from "./bmi-calculator"
import NutritionSummary from "./nutrition-summary"
import Recommendations from "./recommendations"
import PersonalizedWelcome from "./personalized-welcome"
import ProfileSettings from "./profile-settings"
import AdminDashboard from "./admin-dashboard"
import SleepTracker from "./sleep-tracker"
import PhysicalActivities from "./physical-activities"
import PortionSizingGuide from "./portion-sizing-guide"

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  const today = new Date().toISOString().split("T")[0]
  const { meals: todaysMeals, deleteMeal, isLoading: mealsLoading, refetch } = useMeals(today)

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
        refetch()
      }
    }
  }

  const isAdmin = user.role === "admin"

  return (
    <div className="min-h-screen-safe bg-muted">
      <header className="border-b bg-card sticky top-0 z-50 pt-safe-top">
        <div className="max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-3">
              <Utensils className="h-6 w-6 sm:h-7 sm:w-7 text-green-600" />
              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-green-800">GluGuide</h1>
                <p className="hidden md:block text-xs text-muted-foreground">Your Personal Nutrition Companion</p>
              </div>
              {isAdmin && (
                <Badge variant="secondary" className="text-xs ml-2">
                  <Shield className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">Admin</span>
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="ghost"
                onClick={() => setActiveTab("profile")}
                className="flex items-center gap-2 hover:bg-muted/50 rounded-lg p-2"
              >
                <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback className="bg-green-600 text-white text-xs">
                    {user.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-medium">{user.fullName}</p>
                  <p className="text-xs text-muted-foreground">
                    {isAdmin ? "Administrator" : `BMI: ${bmiResult.bmi} (${bmiResult.category})`}
                  </p>
                </div>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="rounded-full text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 sm:h-9 sm:w-9"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 lg:px-6 py-3 xs:py-4 sm:py-6 pb-safe-bottom">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-3 xs:space-y-4">
          <TabsList
            className={`grid w-full ${isAdmin ? "grid-cols-5 sm:grid-cols-10" : "grid-cols-5 sm:grid-cols-9"} gap-1 h-auto p-1 bg-muted/50`}
          >
            <TabsTrigger
              value="overview"
              className="flex flex-col sm:flex-row items-center gap-1 py-2 px-2 text-xs sm:text-sm data-[state=active]:bg-background"
            >
              <Activity className="h-4 w-4 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Overview</span>
              <span className="xs:hidden">Home</span>
            </TabsTrigger>
            <TabsTrigger
              value="log-meal"
              className="flex flex-col sm:flex-row items-center gap-1 py-2 px-2 text-xs sm:text-sm data-[state=active]:bg-background"
            >
              <PlusCircle className="h-4 w-4 sm:h-4 sm:w-4" />
              <span className="hidden md:inline">Log Meal</span>
              <span className="md:hidden">Log</span>
            </TabsTrigger>
            <TabsTrigger
              value="bmi"
              className="flex flex-col sm:flex-row items-center gap-1 py-2 px-2 text-xs sm:text-sm data-[state=active]:bg-background"
            >
              <Calculator className="h-4 w-4 sm:h-4 sm:w-4" />
              <span>BMI</span>
            </TabsTrigger>
            <TabsTrigger
              value="nutrition"
              className="flex flex-col sm:flex-row items-center gap-1 py-2 px-2 text-xs sm:text-sm data-[state=active]:bg-background"
            >
              <TrendingUp className="h-4 w-4 sm:h-4 sm:w-4" />
              <span className="hidden md:inline">Nutrition</span>
              <span className="md:hidden">Stats</span>
            </TabsTrigger>
            <TabsTrigger
              value="activities"
              className="flex flex-col sm:flex-row items-center gap-1 py-2 px-2 text-xs sm:text-sm data-[state=active]:bg-background"
            >
              <Dumbbell className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-4 lg:w-4" />
              <span className="hidden lg:inline">Activities</span>
              <span className="lg:hidden">Fit</span>
            </TabsTrigger>
            <TabsTrigger
              value="portion-guide"
              className="flex flex-col sm:flex-row items-center gap-1 py-2 px-2 text-xs sm:text-sm data-[state=active]:bg-background"
            >
              <Hand className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden lg:inline">Portion</span>
              <span className="lg:hidden">Size</span>
            </TabsTrigger>
            <TabsTrigger
              value="recommendations"
              className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1 lg:gap-1.5 py-2 sm:py-2.5 px-1 sm:px-2 lg:px-3 text-[10px] sm:text-xs lg:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <BookOpen className="h-4 w-4 sm:h-4 sm:w-4" />
              <span className="hidden md:inline">Tips</span>
              <span className="md:hidden">Tips</span>
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className="flex flex-col sm:flex-row items-center gap-1 py-2 px-2 text-xs sm:text-sm data-[state=active]:bg-background"
            >
              <User className="h-4 w-4 sm:h-4 sm:w-4" />
              <span className="hidden md:inline">Profile</span>
              <span className="md:hidden">Me</span>
            </TabsTrigger>
            <TabsTrigger
              value="sleep"
              className="flex flex-col sm:flex-row items-center gap-1 py-2 px-2 text-xs sm:text-sm data-[state=active]:bg-background"
            >
              <SleepIcon className="h-4 w-4 sm:h-4 sm:w-4" />
              <span>Sleep</span>
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger
                value="admin"
                className="flex flex-col sm:flex-row items-center gap-1 py-2 px-2 text-xs sm:text-sm data-[state=active]:bg-background"
              >
                <Shield className="h-4 w-4 sm:h-4 sm:w-4" />
                <span>Admin</span>
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="overview" className="space-y-3 xs:space-y-4">
            <PersonalizedWelcome />

            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-2 xs:gap-3 sm:gap-4">
              <Card className="xs:col-span-2 lg:col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm xs:text-base flex items-center gap-1 xs:gap-2">
                    <Target className="h-3 w-3 xs:h-4 xs:w-4 text-green-600" />
                    Today's Calories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 xs:space-y-2">
                    <div className="text-lg xs:text-xl font-bold">{totalCaloriesToday.toFixed(0)}</div>
                    <div className="text-xs text-muted-foreground">of {dailyCalories} recommended</div>
                    <div className="text-xs text-muted-foreground">
                      {totalProteinToday.toFixed(1)}g protein • {todaysMeals.length} meals
                    </div>
                    <div className="w-full bg-secondary rounded-full h-1.5 xs:h-2">
                      <div
                        className="bg-green-600 h-1.5 xs:h-2 rounded-full transition-all"
                        style={{ width: `${Math.min((totalCaloriesToday / dailyCalories) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm xs:text-base flex items-center gap-1 xs:gap-2">
                    <Activity className="h-3 w-3 xs:h-4 xs:w-4 text-blue-600" />
                    BMI Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 xs:space-y-2">
                    <div className="text-lg xs:text-xl font-bold">{bmiResult.bmi}</div>
                    <Badge
                      variant={
                        bmiResult.category === "Normal"
                          ? "default"
                          : bmiResult.category === "Underweight"
                            ? "secondary"
                            : "destructive"
                      }
                      className="text-xs"
                    >
                      {bmiResult.category}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm xs:text-base flex items-center gap-1 xs:gap-2">
                    <Apple className="h-3 w-3 xs:h-4 xs:w-4 text-orange-600" />
                    Meals Today
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 xs:space-y-2">
                    <div className="text-lg xs:text-xl font-bold">{todaysMeals.length}</div>
                    <div className="text-xs text-muted-foreground">
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
                <CardHeader>
                  <CardTitle className="text-sm xs:text-base">Weight Goal</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 xs:space-y-2">
                    <div className="text-sm xs:text-base font-bold">
                      {bmiResult.category === "Underweight"
                        ? "Gain Weight"
                        : bmiResult.category === "Overweight" || bmiResult.category === "Obese"
                          ? "Lose Weight"
                          : "Maintain"}
                    </div>
                    <div className="text-xs text-muted-foreground">Current: {user.weight}kg</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm xs:text-base">Today's Meals</CardTitle>
                <CardDescription className="text-xs">Your food intake for today</CardDescription>
              </CardHeader>
              <CardContent>
                {mealsLoading ? (
                  <div className="text-center py-4 xs:py-6">
                    <div className="animate-spin rounded-full h-5 w-5 xs:h-6 xs:w-6 border-b-2 border-green-600 mx-auto"></div>
                    <p className="text-muted-foreground mt-2 text-xs">Loading meals...</p>
                  </div>
                ) : todaysMeals.length === 0 ? (
                  <div className="text-center py-4 xs:py-6">
                    <Apple className="h-6 w-6 xs:h-8 xs:w-8 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground text-xs">No meals logged today</p>
                    <Button
                      onClick={() => setActiveTab("log-meal")}
                      className="mt-3 bg-green-600 hover:bg-green-700 text-xs h-8"
                    >
                      Log Your First Meal
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2 xs:space-y-3">
                    {todaysMeals.map((meal) => (
                      <div
                        key={meal.id}
                        className="flex flex-col xs:flex-row xs:items-center justify-between p-2 xs:p-3 border rounded-lg gap-2 xs:gap-0"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-1 xs:gap-2 mb-1 flex-wrap">
                            <Badge variant="outline" className="text-xs">
                              {meal.type}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{meal.time}</span>
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
                          <div className="font-medium text-xs xs:text-sm">
                            {meal.foods.map((food) => food.name).join(", ")}
                          </div>
                          {meal.notes && (
                            <div className="text-xs text-muted-foreground italic mt-1">"{meal.notes}"</div>
                          )}
                        </div>
                        <div className="flex items-center justify-between xs:justify-end gap-2">
                          <div className="text-right">
                            <div className="font-bold text-xs xs:text-sm">
                              {meal.totalNutrition.calories.toFixed(0)} cal
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {meal.totalNutrition.protein.toFixed(1)}g protein
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteMeal(meal.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm xs:text-base">Quick Health Tips</CardTitle>
                <CardDescription className="text-xs">Based on your BMI and today's intake</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 xs:space-y-3">
                  {bmiResult.recommendations.slice(0, 3).map((rec, index) => (
                    <div key={index} className="flex items-start gap-2 xs:gap-3 p-2 xs:p-3 bg-muted/50 rounded-lg">
                      <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 bg-green-600 rounded-full mt-1.5 xs:mt-2 flex-shrink-0" />
                      <p className="text-xs xs:text-sm">{rec}</p>
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

          <TabsContent value="activities">
            <PhysicalActivities />
          </TabsContent>

          <TabsContent value="portion-guide">
            <PortionSizingGuide />
          </TabsContent>

          <TabsContent value="recommendations">
            <Recommendations />
          </TabsContent>

          <TabsContent value="profile">
            <ProfileSettings />
          </TabsContent>

          <TabsContent value="sleep">
            <SleepTracker />
          </TabsContent>

          {isAdmin && (
            <TabsContent value="admin">
              <AdminDashboard />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  )
}
