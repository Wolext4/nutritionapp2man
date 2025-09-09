"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "../contexts/auth-context"
import { useProfile } from "../hooks/use-profile"
import { LocalDatabase } from "@/lib/local-storage"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { calculateBMI } from "../utils/calculations"
import { Save, AlertCircle, Download, Upload, CheckCircle } from "lucide-react"
// At the top, add the import for UserProfileDetails
import UserProfileDetails from "./user-profile-details"
// Add the import for Tabs components at the top
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Replace the entire component with a tabbed interface
export default function ProfileSettings() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("details")

  if (!user) return null

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">Profile Details</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <UserProfileDetails />
        </TabsContent>

        <TabsContent value="settings">
          <ProfileSettingsForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Move the existing profile settings form to a separate component
function ProfileSettingsForm() {
  const { user, updateProfile } = useAuth()
  const { profile, updateProfile: updateUserProfile } = useProfile()
  const [isUpdating, setIsUpdating] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    age: user?.age.toString() || "",
    gender: user?.gender || "",
    height: user?.height.toString() || "",
    weight: user?.weight.toString() || "",
  })

  const [profileData, setProfileData] = useState({
    culturalBackground: profile?.preferences.culturalBackground || [],
    dietaryRestrictions: profile?.preferences.dietaryRestrictions || [],
    activityLevel: profile?.preferences.activityLevel || "moderate",
    healthGoals: profile?.preferences.healthGoals || [],
    notifications: profile?.settings.notifications ?? true,
    dataSharing: profile?.settings.dataSharing ?? false,
    units: profile?.settings.units || "metric",
  })

  if (!user) return null

  const currentBMI = calculateBMI(user.weight, user.height)
  const newBMI =
    formData.height && formData.weight
      ? calculateBMI(Number.parseFloat(formData.weight), Number.parseFloat(formData.height))
      : null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    setMessage(null)

    try {
      // Validation
      if (
        !formData.fullName ||
        !formData.email ||
        !formData.age ||
        !formData.gender ||
        !formData.height ||
        !formData.weight
      ) {
        setMessage({ type: "error", text: "Please fill in all required fields" })
        setIsUpdating(false)
        return
      }

      const age = Number.parseInt(formData.age)
      const height = Number.parseFloat(formData.height)
      const weight = Number.parseFloat(formData.weight)

      if (age < 13 || age > 120) {
        setMessage({ type: "error", text: "Age must be between 13 and 120" })
        setIsUpdating(false)
        return
      }

      if (height < 100 || height > 250) {
        setMessage({ type: "error", text: "Height must be between 100cm and 250cm" })
        setIsUpdating(false)
        return
      }

      if (weight < 30 || weight > 300) {
        setMessage({ type: "error", text: "Weight must be between 30kg and 300kg" })
        setIsUpdating(false)
        return
      }

      // Update user profile
      const userResult = await updateProfile({
        fullName: formData.fullName,
        email: formData.email,
        age,
        gender: formData.gender as "male" | "female" | "other",
        height,
        weight,
      })

      if (!userResult.success) {
        setMessage({ type: "error", text: userResult.error || "Failed to update profile" })
        setIsUpdating(false)
        return
      }

      // Update user preferences
      const profileResult = await updateUserProfile({
        preferences: {
          culturalBackground: profileData.culturalBackground,
          dietaryRestrictions: profileData.dietaryRestrictions,
          activityLevel: profileData.activityLevel as "sedentary" | "light" | "moderate" | "active",
          healthGoals: profileData.healthGoals,
          favoriteNigerianFoods: profile?.preferences.favoriteNigerianFoods || [],
          mealPreferences: profile?.preferences.mealPreferences || {
            breakfast: [],
            lunch: [],
            dinner: [],
            snacks: [],
          },
        },
        settings: {
          notifications: profileData.notifications,
          dataSharing: profileData.dataSharing,
          units: profileData.units as "metric" | "imperial",
          reminderTimes: profile?.settings.reminderTimes || {
            breakfast: "07:00",
            lunch: "12:00",
            dinner: "19:00",
          },
          weeklyGoals: profile?.settings.weeklyGoals || {
            calorieTarget: 2000,
            proteinTarget: 100,
            exerciseDays: 3,
          },
        },
        personalizedRecommendations: profile?.personalizedRecommendations || {
          suggestedFoods: [],
          avoidFoods: [],
          mealPlanPreferences: "balanced_nigerian",
          supplementSuggestions: [],
        },
      })

      if (profileResult.success) {
        setMessage({ type: "success", text: "Profile updated successfully!" })
        setTimeout(() => setMessage(null), 3000)
      } else {
        setMessage({ type: "error", text: profileResult.error || "Failed to update preferences" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An unexpected error occurred" })
    } finally {
      setIsUpdating(false)
    }
  }

  const exportData = () => {
    try {
      const data = LocalDatabase.exportUserData(user.id)
      const blob = new Blob([data], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `naijafit-data-${new Date().toISOString().split("T")[0]}.json`
      link.click()
      URL.revokeObjectURL(url)

      setMessage({ type: "success", text: "Data exported successfully!" })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: "error", text: "Failed to export data" })
    }
  }

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const jsonData = e.target?.result as string
        const result = await LocalDatabase.importUserData(jsonData)

        if (result.success) {
          setMessage({ type: "success", text: "Data imported successfully! Please refresh the page." })
          setTimeout(() => window.location.reload(), 2000)
        } else {
          setMessage({ type: "error", text: result.error || "Failed to import data" })
        }
      } catch (error) {
        setMessage({ type: "error", text: "Invalid file format" })
      }
    }
    reader.readAsText(file)
  }

  const hasChanges =
    formData.fullName !== user.fullName ||
    formData.email !== user.email ||
    formData.age !== user.age.toString() ||
    formData.gender !== user.gender ||
    formData.height !== user.height.toString() ||
    formData.weight !== user.weight.toString()

  const culturalGroups = [
    { id: "yoruba", name: "Yoruba", description: "Western Nigeria cuisine" },
    { id: "igbo", name: "Igbo", description: "Eastern Nigeria cuisine" },
    { id: "hausa", name: "Hausa", description: "Northern Nigeria cuisine" },
    { id: "general-nigerian", name: "General Nigerian", description: "Pan-Nigerian dishes" },
    { id: "middle-belt", name: "Middle Belt", description: "Central Nigeria cuisine" },
    { id: "south-south", name: "South-South", description: "Niger Delta cuisine" },
  ]

  const healthGoals = [
    { id: "weight-loss", name: "Weight Loss" },
    { id: "weight-gain", name: "Weight Gain" },
    { id: "balanced-nutrition", name: "Balanced Nutrition" },
    { id: "muscle-building", name: "Muscle Building" },
    { id: "diabetes-management", name: "Diabetes Management" },
    { id: "heart-health", name: "Heart Health" },
  ]

  const toggleCulturalBackground = (groupId: string) => {
    const updated = profileData.culturalBackground.includes(groupId)
      ? profileData.culturalBackground.filter((p) => p !== groupId)
      : [...profileData.culturalBackground, groupId]
    setProfileData({ ...profileData, culturalBackground: updated })
  }

  const toggleHealthGoal = (goalId: string) => {
    const updated = profileData.healthGoals.includes(goalId)
      ? profileData.healthGoals.filter((g) => g !== goalId)
      : [...profileData.healthGoals, goalId]
    setProfileData({ ...profileData, healthGoals: updated })
  }

  return (
    <div className="space-y-6">
      {/* Edit Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>Update your information to get more accurate recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="bg-background"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  type="number"
                  min="13"
                  max="120"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  required
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm) *</Label>
                <Input
                  id="height"
                  type="number"
                  min="100"
                  max="250"
                  step="0.1"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  required
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg) *</Label>
                <Input
                  id="weight"
                  type="number"
                  min="30"
                  max="300"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  required
                  className="bg-background"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {newBMI && hasChanges && (
              <div className="border rounded-lg p-4 bg-muted/50">
                <h4 className="font-medium mb-2">Updated BMI Preview:</h4>
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold">{newBMI.bmi}</div>
                  <div className="text-sm">
                    <div className="font-medium">{newBMI.category}</div>
                    <div className="text-muted-foreground">
                      {currentBMI.bmi !== newBMI.bmi && (
                        <span>
                          {newBMI.bmi > currentBMI.bmi ? "↑" : "↓"}
                          {Math.abs(newBMI.bmi - currentBMI.bmi).toFixed(1)} from current
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Cultural Food Preferences */}
            <div className="space-y-4">
              <h4 className="font-medium text-lg">Cultural Food Preferences</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {culturalGroups.map((group) => (
                  <div
                    key={group.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:border-primary/50 ${
                      profileData.culturalBackground.includes(group.id)
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                        : "border-border hover:bg-muted/50"
                    }`}
                    onClick={() => toggleCulturalBackground(group.id)}
                  >
                    <h5 className="font-medium text-base">{group.name}</h5>
                    <p className="text-sm text-muted-foreground mt-1">{group.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Health Goals */}
            <div className="space-y-4">
              <h4 className="font-medium text-lg">Health Goals</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {healthGoals.map((goal) => (
                  <div
                    key={goal.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:border-primary/50 ${
                      profileData.healthGoals.includes(goal.id)
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                        : "border-border hover:bg-muted/50"
                    }`}
                    onClick={() => toggleHealthGoal(goal.id)}
                  >
                    <h5 className="font-medium text-base">{goal.name}</h5>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Level */}
            <div className="space-y-2">
              <Label htmlFor="activity">Activity Level</Label>
              <Select
                value={profileData.activityLevel}
                onValueChange={(value) => setProfileData({ ...profileData, activityLevel: value })}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentary (Little to no exercise)</SelectItem>
                  <SelectItem value="light">Light (Light exercise 1-3 days/week)</SelectItem>
                  <SelectItem value="moderate">Moderate (Moderate exercise 3-5 days/week)</SelectItem>
                  <SelectItem value="active">Active (Hard exercise 6-7 days/week)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Settings */}
            <div className="space-y-4">
              <h4 className="font-medium text-lg">Settings</h4>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="notifications" className="text-base font-medium">
                      Push Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">Receive meal reminders and nutrition tips</p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={profileData.notifications}
                    onCheckedChange={(checked) => setProfileData({ ...profileData, notifications: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="data-sharing" className="text-base font-medium">
                      Anonymous Data Sharing
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">Help improve Nigerian nutrition research</p>
                  </div>
                  <Switch
                    id="data-sharing"
                    checked={profileData.dataSharing}
                    onCheckedChange={(checked) => setProfileData({ ...profileData, dataSharing: checked })}
                  />
                </div>
              </div>
            </div>

            {message && (
              <div
                className={`flex items-center gap-2 text-sm p-3 rounded-lg ${
                  message.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {message.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                {message.text}
              </div>
            )}

            <Button type="submit" disabled={isUpdating} className="w-full bg-green-600 hover:bg-green-700 h-12">
              <Save className="h-4 w-4 mr-2" />
              {isUpdating ? "Saving Changes..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>Export or import your nutrition data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button onClick={exportData} variant="outline" className="h-12 bg-background">
                <Download className="h-4 w-4 mr-2" />
                Export My Data
              </Button>

              <div>
                <Input type="file" accept=".json" onChange={importData} className="hidden" id="import-file" />
                <Button asChild variant="outline" className="w-full h-12 bg-background">
                  <label htmlFor="import-file" className="cursor-pointer flex items-center justify-center">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Data
                  </label>
                </Button>
              </div>
            </div>

            <div className="mt-4">
              <Button
                onClick={() => window.open("https://github.com/Wolext4/nigerian-nutrition-app--2-/releases", "_blank")}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Latest App Version
              </Button>
            </div>

            <div className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
              Export includes your profile information and meal logs. This data can be imported into other devices or
              used as a backup. Download the latest app version to get new features and improvements.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
