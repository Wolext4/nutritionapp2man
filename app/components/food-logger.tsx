"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Clock, Hand } from "lucide-react"
import PortionSizingGuide from "./portion-sizing-guide"

export default function FoodLogger() {
  const [showPortionGuide, setShowPortionGuide] = useState(false)
  const [selectedMeal, setSelectedMeal] = useState("breakfast")
  const [customFoodName, setCustomFoodName] = useState("")
  const [customFoodCalories, setCustomFoodCalories] = useState("")
  const [customFoodProtein, setCustomFoodProtein] = useState("")
  const [selectedFoods, setSelectedFoods] = useState<any[]>([])

  const addCustomFood = () => {
    if (!customFoodName || !customFoodCalories) return

    const newFood = {
      id: Date.now(),
      name: customFoodName,
      calories: Number.parseFloat(customFoodCalories) || 0,
      protein: Number.parseFloat(customFoodProtein) || 0,
      serving: "1 portion (hand-sized)",
    }

    setSelectedFoods([...selectedFoods, newFood])
    setCustomFoodName("")
    setCustomFoodCalories("")
    setCustomFoodProtein("")
  }

  const removeFood = (foodId: number) => {
    setSelectedFoods(selectedFoods.filter((f) => f.id !== foodId))
  }

  const totalCalories = selectedFoods.reduce((sum, food) => sum + food.calories, 0)
  const totalProtein = selectedFoods.reduce((sum, food) => sum + food.protein, 0)

  if (showPortionGuide) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => setShowPortionGuide(false)} className="mb-4">
          ← Back to Food Logger
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
            <Plus className="h-5 w-5 text-green-600" />
            Log Your Meal
          </CardTitle>
          <CardDescription>Add your Nigerian meals manually using portion sizing guide</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-2 flex-1">
              <Label htmlFor="meal-type">Meal Type</Label>
              <Select value={selectedMeal} onValueChange={setSelectedMeal}>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            </div>
            <Button onClick={addCustomFood} className="w-full bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Food Item
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Selected Foods */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-600" />
            {selectedMeal.charAt(0).toUpperCase() + selectedMeal.slice(1)} Items
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
                <div key={food.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{food.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {food.calories} cal, {food.protein}g protein per {food.serving}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFood(food.id)}
                    className="h-8 px-2 text-red-600 hover:text-red-700"
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
                Log {selectedMeal.charAt(0).toUpperCase() + selectedMeal.slice(1)}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
