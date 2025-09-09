"use client"

import { useAuth } from "../contexts/auth-context"
import { useProfile } from "../hooks/use-profile"
import { LocalDatabase } from "@/lib/local-storage"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { calculateBMI } from "../utils/calculations"
import { User, MapPin, Briefcase, Target, Trophy, TrendingUp, Heart, Calendar, Star } from "lucide-react"

export default function PersonalizedWelcome() {
  const { user } = useAuth()
  const { profile } = useProfile()

  if (!user) return null

  const userStats = LocalDatabase.getUserStatsById(user.id)
  const bmiResult = calculateBMI(user.weight, user.height)

  // Get personalized greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  // Get personalized message based on user's goals and progress
  const getPersonalizedMessage = () => {
    if (!userStats) return "Welcome to your nutrition journey!"

    if (userStats.currentStreak > 0) {
      return `You're on a ${userStats.currentStreak}-day logging streak! Keep it up!`
    }

    if (userStats.totalMealsLogged === 0) {
      return "Ready to start tracking your Nigerian meals? Let's begin!"
    }

    return `You've logged ${userStats.totalMealsLogged} meals so far. Great progress!`
  }

  // Get health condition specific message
  const getHealthMessage = () => {
    if (!user.healthConditions || user.healthConditions.length === 0) {
      return null
    }

    if (user.healthConditions.includes("diabetes")) {
      return "Managing diabetes with proper nutrition - you're doing great!"
    }

    return "Your health journey is personalized to your specific needs."
  }

  const healthMessage = getHealthMessage()

  return (
    <div className="space-y-6">
      {/* Personalized Welcome Header */}
      <Card className="bg-gradient-to-r from-green-50 to-orange-50 dark:from-green-950 dark:to-orange-950 border-green-200">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl text-green-800 dark:text-green-200">
                {getGreeting()}, {user.fullName.split(" ")[0]}! 👋
              </CardTitle>
              <CardDescription className="text-green-700 dark:text-green-300 text-base">
                {getPersonalizedMessage()}
              </CardDescription>
              {healthMessage && (
                <div className="flex items-center gap-2 mt-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-700 dark:text-red-300">{healthMessage}</span>
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Last login</div>
              <div className="text-sm font-medium">{new Date(user.lastLoginAt).toLocaleDateString()}</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Location & Occupation */}
            <div className="space-y-2">
              {user.location && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <span>{user.location}</span>
                </div>
              )}
              {user.occupation && (
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="h-4 w-4 text-purple-600" />
                  <span>{user.occupation}</span>
                </div>
              )}
            </div>

            {/* Health Goals */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Target className="h-4 w-4 text-orange-600" />
                <span>Your Goals</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {user.fitnessGoals?.slice(0, 2).map((goal) => (
                  <Badge key={goal} variant="outline" className="text-xs">
                    {goal.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </Badge>
                ))}
              </div>
            </div>

            {/* BMI Status */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span>Health Status</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">{bmiResult.bmi}</span>
                <Badge variant={bmiResult.category === "Normal" ? "default" : "secondary"} className="text-xs">
                  {bmiResult.category}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress & Achievements */}
      {userStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Progress Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Your Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Meals Logged</span>
                  <span className="font-medium">{userStats.totalMealsLogged}</span>
                </div>
                <Progress value={Math.min((userStats.totalMealsLogged / 50) * 100, 100)} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Current Streak</span>
                  <span className="font-medium">{userStats.currentStreak} days</span>
                </div>
                <Progress value={Math.min((userStats.currentStreak / 30) * 100, 100)} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Favorite Food</span>
                  <span className="font-medium text-green-600">{userStats.favoriteFood}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Avg Daily Calories</span>
                  <span className="font-medium">{userStats.averageDailyCalories.toFixed(0)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-600" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {userStats.achievements.slice(0, 4).map((achievement, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">{achievement}</span>
                  </div>
                ))}
                {userStats.achievements.length > 4 && (
                  <div className="text-center text-sm text-muted-foreground">
                    +{userStats.achievements.length - 4} more achievements
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Personalized Recommendations */}
      {profile?.personalizedRecommendations && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-green-600" />
              Personalized for You
            </CardTitle>
            <CardDescription>
              Based on your profile: {profile.preferences.culturalBackground.join(", ")} cuisine preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-green-700">Recommended Foods</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.personalizedRecommendations.suggestedFoods.slice(0, 4).map((food) => (
                    <Badge key={food} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {food.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-orange-700">Your Meal Plan Style</h4>
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                  {profile.personalizedRecommendations.mealPlanPreferences
                    .replace("_", " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </Badge>
              </div>
            </div>

            {profile.personalizedRecommendations.supplementSuggestions.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2">Supplement Suggestions</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.personalizedRecommendations.supplementSuggestions.map((supplement) => (
                    <Badge key={supplement} variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                      {supplement.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
