"use client"

import { useState } from "react"
import { useAuth } from "../contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { calculateBMI, calculateEnhancedHealthMetrics, getDailyCalorieRecommendation } from "../utils/calculations"
import { Calculator, TrendingUp, Target, AlertCircle, Activity } from "lucide-react"

export default function BMICalculator() {
  const { user, updateProfile } = useAuth()
  const [height, setHeight] = useState(user?.height.toString() || "")
  const [weight, setWeight] = useState(user?.weight.toString() || "")
  const [waistCircumference, setWaistCircumference] = useState(user?.waistCircumference?.toString() || "")
  const [isUpdating, setIsUpdating] = useState(false)

  if (!user) return null

  const currentBMI = calculateBMI(user.weight, user.height)
  const currentEnhanced = calculateEnhancedHealthMetrics(user.weight, user.height, user.waistCircumference)
  const newMetrics =
    height && weight
      ? calculateEnhancedHealthMetrics(
          Number.parseFloat(weight),
          Number.parseFloat(height),
          waistCircumference ? Number.parseFloat(waistCircumference) : undefined,
        )
      : null
  const dailyCalories = getDailyCalorieRecommendation(user.age, user.gender, user.weight, user.height)

  const updateUserProfile = async () => {
    if (!height || !weight) return

    setIsUpdating(true)
    try {
      updateProfile({
        height: Number.parseFloat(height),
        weight: Number.parseFloat(weight),
        waistCircumference: waistCircumference ? Number.parseFloat(waistCircumference) : undefined,
      })
      alert("Profile updated successfully!")
    } catch (error) {
      alert("Failed to update profile")
    } finally {
      setIsUpdating(false)
    }
  }

  const getBMIColor = (category: string) => {
    switch (category) {
      case "Underweight":
        return "text-blue-600"
      case "Normal":
        return "text-green-600"
      case "Overweight":
        return "text-orange-600"
      case "Obese":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getBMIBadgeVariant = (category: string) => {
    switch (category) {
      case "Normal":
        return "default"
      case "Underweight":
        return "secondary"
      default:
        return "destructive"
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "text-green-600"
      case "Moderate":
        return "text-yellow-600"
      case "High":
        return "text-orange-600"
      case "Very High":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="space-y-6">
      {/* Current Health Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-green-600" />
            Your Current Health Metrics
          </CardTitle>
          <CardDescription>Based on your profile information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{currentBMI.bmi}</div>
              <Badge variant={getBMIBadgeVariant(currentBMI.category)} className="mb-2">
                {currentBMI.category}
              </Badge>
              <p className="text-sm text-muted-foreground">
                Height: {user.height}cm, Weight: {user.weight}kg
              </p>
              {user.waistCircumference && currentEnhanced.waistToHeight && (
                <div className="mt-4">
                  <div className="text-2xl font-bold mb-1">{currentEnhanced.waistToHeight.ratio}</div>
                  <Badge
                    variant={currentEnhanced.waistToHeight.category === "Healthy" ? "default" : "destructive"}
                    className="mb-2"
                  >
                    {currentEnhanced.waistToHeight.category}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Waist-to-Height Ratio: {user.waistCircumference}cm waist
                  </p>
                </div>
              )}
            </div>

            <div>
              <div className="mb-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Overall Health Risk:
                  <Badge className={getRiskColor(currentEnhanced.overallRisk)}>{currentEnhanced.overallRisk}</Badge>
                </h4>
                <p className="text-sm text-muted-foreground mb-3">{currentBMI.description}</p>
              </div>

              <div className="space-y-2">
                <h5 className="font-medium text-sm">Key Recommendations:</h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {currentEnhanced.combinedRecommendations.slice(0, 4).map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Metrics Calculator */}
      <Card>
        <CardHeader>
          <CardTitle>Update Your Measurements</CardTitle>
          <CardDescription>Recalculate your health metrics with new measurements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                placeholder="170"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                placeholder="70"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                step="0.1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="waist">Waist Circumference (cm)</Label>
              <Input
                id="waist"
                type="number"
                placeholder="80"
                value={waistCircumference}
                onChange={(e) => setWaistCircumference(e.target.value)}
                step="0.1"
              />
              <p className="text-xs text-muted-foreground">Optional: Measure at narrowest point</p>
            </div>
          </div>

          {newMetrics &&
            (height !== user.height.toString() ||
              weight !== user.weight.toString() ||
              waistCircumference !== (user.waistCircumference?.toString() || "")) && (
              <div className="border rounded-lg p-4 bg-muted/50">
                <h4 className="font-medium mb-2">New Health Calculation:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="text-2xl font-bold">{newMetrics.bmi.bmi}</div>
                      <Badge variant={getBMIBadgeVariant(newMetrics.bmi.category)}>{newMetrics.bmi.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">BMI Category</p>
                  </div>
                  {newMetrics.waistToHeight && (
                    <div>
                      <div className="flex items-center gap-4 mb-3">
                        <div className="text-2xl font-bold">{newMetrics.waistToHeight.ratio}</div>
                        <Badge variant={newMetrics.waistToHeight.category === "Healthy" ? "default" : "destructive"}>
                          {newMetrics.waistToHeight.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Waist-to-Height Ratio</p>
                    </div>
                  )}
                </div>
                <div className="mt-3">
                  <Badge className={getRiskColor(newMetrics.overallRisk)}>Overall Risk: {newMetrics.overallRisk}</Badge>
                </div>
              </div>
            )}

          <Button
            onClick={updateUserProfile}
            disabled={
              !height ||
              !weight ||
              isUpdating ||
              (height === user.height.toString() &&
                weight === user.weight.toString() &&
                waistCircumference === (user.waistCircumference?.toString() || ""))
            }
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {isUpdating ? "Updating..." : "Update Profile"}
          </Button>
        </CardContent>
      </Card>

      {/* BMI Categories Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            BMI Categories (WHO Standards)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium text-blue-600">Underweight</div>
                <div className="text-sm text-muted-foreground">BMI less than 18.5</div>
              </div>
              <div className="text-sm text-muted-foreground">May need to gain weight</div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50 dark:bg-green-950">
              <div>
                <div className="font-medium text-green-600">Normal Weight</div>
                <div className="text-sm text-muted-foreground">BMI 18.5 - 24.9</div>
              </div>
              <div className="text-sm text-muted-foreground">Healthy weight range</div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium text-orange-600">Overweight</div>
                <div className="text-sm text-muted-foreground">BMI 25.0 - 29.9</div>
              </div>
              <div className="text-sm text-muted-foreground">May need to lose weight</div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium text-red-600">Obese</div>
                <div className="text-sm text-muted-foreground">BMI 30.0 and above</div>
              </div>
              <div className="text-sm text-muted-foreground">Consult healthcare provider</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Calorie Recommendation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600" />
            Daily Calorie Recommendation
          </CardTitle>
          <CardDescription>Based on your current profile</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">{dailyCalories}</div>
            <div className="text-muted-foreground mb-4">calories per day</div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-3 border rounded-lg">
                <div className="font-medium">For Weight Loss</div>
                <div className="text-muted-foreground">{dailyCalories - 500} calories</div>
              </div>
              <div className="p-3 border rounded-lg bg-green-50 dark:bg-green-950">
                <div className="font-medium">For Maintenance</div>
                <div className="text-muted-foreground">{dailyCalories} calories</div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="font-medium">For Weight Gain</div>
                <div className="text-muted-foreground">{dailyCalories + 500} calories</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Note */}
      <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-1">Important Note</h4>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                BMI is a general indicator and may not account for muscle mass, bone density, and other factors. For
                personalized health advice, especially if you're in the underweight or obese categories, consult with a
                healthcare professional or registered dietitian.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
