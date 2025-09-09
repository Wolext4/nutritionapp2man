"use client"

import { useState } from "react"
import { useAuth } from "../contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Clock, CheckCircle, AlertCircle, Hand } from "lucide-react"
import PortionSizingGuide from "./portion-sizing-guide"

interface MealLoggerProps {
  onMealLogged?: () => void
}

export default function MealLogger({ onMealLogged }: MealLoggerProps = {}) {
  const { user } = useAuth()
  const [showPortionGuide, setShowPortionGuide] = useState(false)
  const [mealType, setMealType] = useState<"breakfast" | "lunch" | "dinner" | "snack">("breakfast")
  const [customFoodName, setCustomFoodName] = useState("")
  const [customFoodCalories, setCustomFoodCalories] = useState("")
  const [customFoodProtein, setCustomFoodProtein] = useState("")
  const [customFoodCarbs, setCustomFoodCarbs] = useState("")
  const [customFoodFats, setCustomFoodFats] = useState("")
  const [selectedFoods, setSelectedFoods] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  if (!user) return null

  const addCustomFood = () => {
    if (!customFoodName || !customFoodCalories) {
      setMessage({ type: "error", text: "Please enter food name and calories" })
      return
    }

    const newFood = {
      id: Date.now(),
      name: customFoodName,
      calories: Number.parseFloat(customFoodCalories) || 0,
      protein: Number.parseFloat(customFoodProtein) || 0,
      carbs: Number.parseFloat(customFoodCarbs) || 0,
      fats: Number.parseFloat(customFoodFats) || 0,
      serving: "1 portion (hand-sized)",
    }

    setSelectedFoods([...selectedFoods, newFood])
    setCustomFoodName("")
    setCustomFoodCalories("")
    setCustomFoodProtein("")
    setCustomFoodCarbs("")
    setCustomFoodFats("")
    setMessage(null)
  }

  const removeFood = (foodId: number) => {
    setSelectedFoods(selectedFoods.filter((f) => f.id !== foodId))
  }

  const saveMeal = async () => {
    if (selectedFoods.length === 0) {
      setMessage({ type: "error", text: "Please add at least one food item" })
      return
    }

    setIsLoading(true)
    setMessage(null)

    // Simulate saving meal
    setTimeout(() => {
      setSelectedFoods([])
      setMessage({ type: "success", text: "Meal logged successfully!" })

      if (onMealLogged) {
        onMealLogged()
      }

      setTimeout(() => setMessage(null), 3000)
      setIsLoading(false)
    }, 1000)
  }

  const totalCalories = selectedFoods.reduce((sum, food) => sum + food.calories, 0)
  const totalProtein = selectedFoods.reduce((sum, food) => sum + food.protein, 0)
  const totalCarbs = selectedFoods.reduce((sum, food) => sum + food.carbs, 0)
  const totalFats = selectedFoods.reduce((sum, food) => sum + food.fats, 0)

  if (showPortionGuide) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => setShowPortionGuide(false)} className="mb-4">
          ← Back to Meal Logger
        </Button>
        <PortionSizingGuide />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-green-600 dark:text-green-400" />
            Log Your Meal
          </CardTitle>
          <CardDescription>Track your Nigerian meals using portion sizing guide</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-2 flex-1">
              <Label htmlFor="meal-type">Meal Type</Label>
              <Select value={mealType} onValueChange={(value: any) => setMealType(value)}>
                <SelectTrigger className="max-w-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="dinner">Dinner</SelectItem>
                  <SelectItem value="snack">Snack</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" onClick={() => setShowPortionGuide(true)} className="flex items-center gap-2">
              <Hand className="h-4 w-4" />
              Portion Guide
            </Button>
          </div>

          {/* Custom Food Entry */}
          <div className="border rounded-lg p-4 space-y-4">
            <h3 className="font-medium">Add Food Item</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="food-name">Food Name</Label>
                <Input
                  id="food-name"
                  placeholder="e.g., Jollof Rice, Egusi Soup"
                  value={customFoodName}
                  onChange={(e) => setCustomFoodName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="calories">Calories (per portion)</Label>
                <Input
                  id="calories"
                  type="number"
                  placeholder="e.g., 200"
                  value={customFoodCalories}
                  onChange={(e) => setCustomFoodCalories(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="protein">Protein (g)</Label>
                <Input
                  id="protein"
                  type="number"
                  placeholder="e.g., 15"
                  value={customFoodProtein}
                  onChange={(e) => setCustomFoodProtein(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="carbs">Carbs (g)</Label>
                <Input
                  id="carbs"
                  type="number"
                  placeholder="e.g., 30"
                  value={customFoodCarbs}
                  onChange={(e) => setCustomFoodCarbs(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fats">Fats (g)</Label>
                <Input
                  id="fats"
                  type="number"
                  placeholder="e.g., 5"
                  value={customFoodFats}
                  onChange={(e) => setCustomFoodFats(e.target.value)}
                />
              </div>
            </div>
            <Button onClick={addCustomFood} className="w-full bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Food Item
            </Button>
          </div>

          {message && (
            <div
              className={`flex items-center gap-2 p-3 rounded-lg border ${
                message.type === "success"
                  ? "bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
                  : "bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800"
              }`}
            >
              {message.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              {message.text}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected Foods */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            {mealType.charAt(0).toUpperCase() + mealType.slice(1)} Items
          </CardTitle>
          <CardDescription>
            Total: {totalCalories.toFixed(0)} calories, {totalProtein.toFixed(1)}g protein
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedFoods.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No foods added yet. Use the form above to add your Nigerian foods.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Use the Portion Guide to help estimate serving sizes!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedFoods.map((food) => (
                <div key={food.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{food.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {food.calories} cal, {food.protein}g protein per {food.serving}
                    </p>
                    <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                      <span>Carbs: {food.carbs}g</span>
                      <span>Fats: {food.fats}g</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFood(food.id)}
                    className="h-8 px-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Remove
                  </Button>
                </div>
              ))}

              {/* Nutrition Summary */}
              <div className="border-t pt-3 mt-4">
                <h4 className="font-medium mb-2">Meal Summary</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    Calories: <span className="font-medium">{totalCalories.toFixed(0)}</span>
                  </div>
                  <div>
                    Protein: <span className="font-medium">{totalProtein.toFixed(1)}g</span>
                  </div>
                  <div>
                    Carbs: <span className="font-medium">{totalCarbs.toFixed(1)}g</span>
                  </div>
                  <div>
                    Fats: <span className="font-medium">{totalFats.toFixed(1)}g</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={saveMeal}
                className="w-full mt-4 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                disabled={selectedFoods.length === 0 || isLoading}
              >
                {isLoading ? "Logging..." : `Log ${mealType.charAt(0).toUpperCase() + mealType.slice(1)}`}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
