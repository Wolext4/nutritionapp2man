"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, MapPin, Target, Activity, Shield, Globe } from "lucide-react"

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "Adunni Okafor",
    age: 28,
    gender: "female",
    height: 165,
    weight: 68,
    location: "Lagos",
    state: "Lagos State",
    activityLevel: "moderate",
    goal: "balanced",
    dietaryRestrictions: ["none"],
    culturalPreferences: ["yoruba", "general-nigerian"],
    notifications: true,
    dataSharing: false,
  })

  const nigerianStates = [
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "FCT",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara",
  ]

  const culturalGroups = [
    { id: "yoruba", name: "Yoruba", description: "Western Nigeria cuisine" },
    { id: "igbo", name: "Igbo", description: "Eastern Nigeria cuisine" },
    { id: "hausa", name: "Hausa", description: "Northern Nigeria cuisine" },
    { id: "general-nigerian", name: "General Nigerian", description: "Pan-Nigerian dishes" },
    { id: "middle-belt", name: "Middle Belt", description: "Central Nigeria cuisine" },
    { id: "south-south", name: "South-South", description: "Niger Delta cuisine" },
  ]

  const healthGoals = [
    { id: "weight-loss", name: "Weight Loss", description: "Reduce body weight safely" },
    { id: "weight-gain", name: "Weight Gain", description: "Increase healthy weight" },
    { id: "balanced", name: "Balanced Nutrition", description: "Maintain optimal health" },
    { id: "muscle-gain", name: "Muscle Building", description: "Increase muscle mass" },
    { id: "diabetes-management", name: "Diabetes Management", description: "Control blood sugar" },
    { id: "heart-health", name: "Heart Health", description: "Cardiovascular wellness" },
  ]

  const calculateBMI = () => {
    const heightInM = profile.height / 100
    return (profile.weight / (heightInM * heightInM)).toFixed(1)
  }

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: "Underweight", color: "text-blue-600" }
    if (bmi < 25) return { category: "Normal", color: "text-green-600" }
    if (bmi < 30) return { category: "Overweight", color: "text-orange-600" }
    return { category: "Obese", color: "text-red-600" }
  }

  const bmi = Number.parseFloat(calculateBMI())
  const bmiInfo = getBMICategory(bmi)

  return (
    <div className="space-y-6">
      {/* Profile Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-green-600" />
            Profile Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/placeholder.svg?height=80&width=80" />
              <AvatarFallback className="bg-green-600 text-white text-lg">AO</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <h3 className="text-xl font-semibold">{profile.name}</h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{profile.age} years old</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {profile.location}, {profile.state}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline">BMI: {calculateBMI()}</Badge>
                <Badge variant="outline" className={bmiInfo.color}>
                  {bmiInfo.category}
                </Badge>
                <Badge variant="outline">Goal: {healthGoals.find((g) => g.id === profile.goal)?.name}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Update your personal details for better nutrition recommendations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={profile.age}
                onChange={(e) => setProfile({ ...profile, age: Number.parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={profile.gender} onValueChange={(value) => setProfile({ ...profile, gender: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Select value={profile.state} onValueChange={(value) => setProfile({ ...profile, state: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {nigerianStates.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                value={profile.height}
                onChange={(e) => setProfile({ ...profile, height: Number.parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={profile.weight}
                onChange={(e) => setProfile({ ...profile, weight: Number.parseInt(e.target.value) })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-orange-600" />
            Health Goals
          </CardTitle>
          <CardDescription>Choose your primary health and nutrition objective</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {healthGoals.map((goal) => (
              <div
                key={goal.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  profile.goal === goal.id ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setProfile({ ...profile, goal: goal.id })}
              >
                <h4 className="font-medium">{goal.name}</h4>
                <p className="text-sm text-muted-foreground">{goal.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cultural Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-600" />
            Cultural Food Preferences
          </CardTitle>
          <CardDescription>Select your cultural background for personalized food recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {culturalGroups.map((group) => (
              <div
                key={group.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  profile.culturalPreferences.includes(group.id)
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => {
                  const updated = profile.culturalPreferences.includes(group.id)
                    ? profile.culturalPreferences.filter((p) => p !== group.id)
                    : [...profile.culturalPreferences, group.id]
                  setProfile({ ...profile, culturalPreferences: updated })
                }}
              >
                <h4 className="font-medium">{group.name}</h4>
                <p className="text-sm text-muted-foreground">{group.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity Level */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-purple-600" />
            Activity Level
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={profile.activityLevel}
            onValueChange={(value) => setProfile({ ...profile, activityLevel: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sedentary">Sedentary (Little to no exercise)</SelectItem>
              <SelectItem value="light">Light (Light exercise 1-3 days/week)</SelectItem>
              <SelectItem value="moderate">Moderate (Moderate exercise 3-5 days/week)</SelectItem>
              <SelectItem value="active">Active (Hard exercise 6-7 days/week)</SelectItem>
              <SelectItem value="very-active">Very Active (Physical job + exercise)</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-gray-600" />
            Privacy & Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="notifications">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive meal reminders and nutrition tips</p>
            </div>
            <Switch
              id="notifications"
              checked={profile.notifications}
              onCheckedChange={(checked) => setProfile({ ...profile, notifications: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="data-sharing">Anonymous Data Sharing</Label>
              <p className="text-sm text-muted-foreground">Help improve Nigerian nutrition research</p>
            </div>
            <Switch
              id="data-sharing"
              checked={profile.dataSharing}
              onCheckedChange={(checked) => setProfile({ ...profile, dataSharing: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Button className="w-full bg-green-600 hover:bg-green-700">Save Profile Changes</Button>
    </div>
  )
}
