"use client"

import { useState } from "react"
import { useAuth } from "../contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Clock, CheckCircle, AlertCircle, Hand, Search, Minus, ShoppingCart } from "lucide-react"
import PortionSizingGuide from "./portion-sizing-guide"
import { nigerianFoods, calculatePortionNutrition, getAllCategories, type NigerianFood } from "../data/nigerian-foods"
import { LocalDatabase } from "@/lib/local-storage"

interface MealLoggerProps {
  onMealLogged?: () => void
}

interface FoodItem {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fats: number
  serving: string
  isNigerianFood: boolean
  quantity: number
  caloriesPerServing: number
  proteinPerServing: number
  carbsPerServing: number
  fatsPerServing: number
}

interface CartItem {
  food: NigerianFood
  servings: number
  quantity: number
}

export default function MealLogger({ onMealLogged }: MealLoggerProps = {}) {
  const { user } = useAuth()
  const [showPortionGuide, setShowPortionGuide] = useState(false)
  const [mealType, setMealType] = useState<"breakfast" | "lunch" | "dinner" | "snack">("breakfast")

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const [foodCart, setFoodCart] = useState<CartItem[]>([])
  const [selectedFoods, setSelectedFoods] = useState<FoodItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  if (!user) return null

  const filteredFoods = nigerianFoods.filter((food) => {
    const matchesSearch =
      food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || food.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = getAllCategories()

  const addToCart = (food: NigerianFood) => {
    const existingCartItem = foodCart.find((item) => item.food.id === food.id)

    if (existingCartItem) {
      setFoodCart(foodCart.map((item) => (item.food.id === food.id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setFoodCart([...foodCart, { food, servings: 1, quantity: 1 }])
    }
    setMessage({ type: "success", text: `${food.name} added to selection` })
    setTimeout(() => setMessage(null), 2000)
  }

  const updateCartServings = (foodId: string, servings: number) => {
    setFoodCart(
      foodCart.map((item) => (item.food.id === foodId ? { ...item, servings: Math.max(0.5, servings) } : item)),
    )
  }

  const updateCartQuantity = (foodId: string, change: number) => {
    setFoodCart(
      foodCart.map((item) => {
        if (item.food.id === foodId) {
          const newQuantity = Math.max(1, item.quantity + change)
          return { ...item, quantity: newQuantity }
        }
        return item
      }),
    )
  }

  const removeFromCart = (foodId: string) => {
    setFoodCart(foodCart.filter((item) => item.food.id !== foodId))
  }

  const addAllToMeal = () => {
    if (foodCart.length === 0) {
      setMessage({ type: "error", text: "No foods selected" })
      return
    }

    const newFoodItems: FoodItem[] = []

    foodCart.forEach((cartItem) => {
      const nutrition = calculatePortionNutrition(cartItem.food, cartItem.servings)
      const foodId = `${cartItem.food.name}-${cartItem.servings}`

      // Check if this exact food and serving size already exists in meal
      const existingFoodIndex = selectedFoods.findIndex((f) => f.id === foodId)

      if (existingFoodIndex >= 0) {
        // Update existing food quantity
        const updatedFoods = [...selectedFoods]
        updatedFoods[existingFoodIndex].quantity += cartItem.quantity
        updatedFoods[existingFoodIndex].calories =
          updatedFoods[existingFoodIndex].caloriesPerServing * updatedFoods[existingFoodIndex].quantity
        updatedFoods[existingFoodIndex].protein =
          updatedFoods[existingFoodIndex].proteinPerServing * updatedFoods[existingFoodIndex].quantity
        updatedFoods[existingFoodIndex].carbs =
          updatedFoods[existingFoodIndex].carbsPerServing * updatedFoods[existingFoodIndex].quantity
        updatedFoods[existingFoodIndex].fats =
          updatedFoods[existingFoodIndex].fatsPerServing * updatedFoods[existingFoodIndex].quantity
        setSelectedFoods(updatedFoods)
      } else {
        // Create new food item
        const newFood: FoodItem = {
          id: foodId,
          name: cartItem.food.name,
          calories: nutrition.calories * cartItem.quantity,
          protein: nutrition.protein * cartItem.quantity,
          carbs: nutrition.carbs * cartItem.quantity,
          fats: nutrition.fats * cartItem.quantity,
          serving: `${cartItem.servings} serving${cartItem.servings !== 1 ? "s" : ""} (${cartItem.food.servingSize})`,
          isNigerianFood: true,
          quantity: cartItem.quantity,
          caloriesPerServing: nutrition.calories,
          proteinPerServing: nutrition.protein,
          carbsPerServing: nutrition.carbs,
          fatsPerServing: nutrition.fats,
        }
        newFoodItems.push(newFood)
      }
    })

    if (newFoodItems.length > 0) {
      setSelectedFoods([...selectedFoods, ...newFoodItems])
    }

    // Clear cart after adding to meal
    setFoodCart([])
    setMessage({ type: "success", text: `Added ${foodCart.length} food${foodCart.length > 1 ? "s" : ""} to meal` })
    setTimeout(() => setMessage(null), 3000)
  }

  const increaseQuantity = (foodId: string) => {
    const updatedFoods = selectedFoods.map((food) => {
      if (food.id === foodId) {
        const newQuantity = food.quantity + 1
        return {
          ...food,
          quantity: newQuantity,
          calories: food.caloriesPerServing * newQuantity,
          protein: food.proteinPerServing * newQuantity,
          carbs: food.carbsPerServing * newQuantity,
          fats: food.fatsPerServing * newQuantity,
        }
      }
      return food
    })
    setSelectedFoods(updatedFoods)
  }

  const saveMeal = async () => {
    if (selectedFoods.length === 0) {
      setMessage({ type: "error", text: "Please add at least one food item" })
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      const now = new Date()
      const currentDate = now.toISOString().split("T")[0]
      const currentTime = now.toTimeString().split(" ")[0].substring(0, 5)

      // Convert selected foods to the format expected by LocalDatabase
      const mealFoods = selectedFoods.map((food) => ({
        id: food.id,
        name: food.name,
        grams: 100, // Default serving size
        nutrition: {
          calories: food.caloriesPerServing,
          protein: food.proteinPerServing,
          carbs: food.carbsPerServing,
          fats: food.fatsPerServing,
          fiber: 2, // Default values for missing nutrients
          iron: 1,
          vitaminA: 50,
        },
      }))

      // Repeat foods based on quantity
      const expandedFoods = selectedFoods.flatMap((food) =>
        Array(food.quantity)
          .fill(null)
          .map(() => ({
            id: `${food.id}-${Math.random()}`,
            name: food.name,
            grams: 100,
            nutrition: {
              calories: food.caloriesPerServing,
              protein: food.proteinPerServing,
              carbs: food.carbsPerServing,
              fats: food.fatsPerServing,
              fiber: 2,
              iron: 1,
              vitaminA: 50,
            },
          })),
      )

      const result = await LocalDatabase.createMeal({
        userId: user.id,
        type: mealType,
        date: currentDate,
        time: currentTime,
        foods: expandedFoods,
        totalNutrition: {
          calories: selectedFoods.reduce((sum, food) => sum + food.calories * food.quantity, 0),
          protein: selectedFoods.reduce((sum, food) => sum + food.protein * food.quantity, 0),
          carbs: selectedFoods.reduce((sum, food) => sum + food.carbs * food.quantity, 0),
          fats: selectedFoods.reduce((sum, food) => sum + food.fats * food.quantity, 0),
          fiber: selectedFoods.length * 2, // Estimated
          iron: selectedFoods.length * 1, // Estimated
          vitaminA: selectedFoods.length * 50, // Estimated
        },
      })

      if (result.success) {
        setSelectedFoods([])
        setMessage({ type: "success", text: "Meal logged successfully!" })

        if (onMealLogged) {
          onMealLogged()
        }

        setTimeout(() => setMessage(null), 3000)
      } else {
        setMessage({ type: "error", text: result.error || "Failed to log meal" })
      }
    } catch (error) {
      console.error("Error saving meal:", error)
      setMessage({ type: "error", text: "An error occurred while saving the meal" })
    } finally {
      setIsLoading(false)
    }
  }

  const totalCalories = selectedFoods.reduce((sum, food) => sum + food.calories * food.quantity, 0)
  const totalProtein = selectedFoods.reduce((sum, food) => sum + food.protein * food.quantity, 0)
  const totalCarbs = selectedFoods.reduce((sum, food) => sum + food.carbs * food.quantity, 0)
  const totalFats = selectedFoods.reduce((sum, food) => sum + food.fats * food.quantity, 0)

  const cartTotalCalories = foodCart.reduce((sum, item) => {
    const nutrition = calculatePortionNutrition(item.food, item.servings)
    return sum + nutrition.calories * item.quantity
  }, 0)

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
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Plus className="h-5 w-5 text-green-600 dark:text-green-400" />
            Log Your Meal
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Track your Nigerian meals using our food database and portion sizing guide
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="space-y-2 flex-1">
              <Label htmlFor="meal-type">Meal Type</Label>
              <Select value={mealType} onValueChange={(value: any) => setMealType(value)}>
                <SelectTrigger className="w-full sm:max-w-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">🌅 Breakfast</SelectItem>
                  <SelectItem value="lunch">☀️ Lunch</SelectItem>
                  <SelectItem value="dinner">🌙 Dinner</SelectItem>
                  <SelectItem value="snack">🍎 Snack</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowPortionGuide(true)}
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              <Hand className="h-4 w-4" />
              Portion Guide
            </Button>
          </div>

          <div className="border rounded-lg p-3 sm:p-4 space-y-4 bg-green-50 dark:bg-green-950/20">
            <h3 className="font-medium flex items-center gap-2 text-sm sm:text-base">
              <Search className="h-4 w-4" />
              Nigerian Food Database
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="food-search" className="text-sm">
                  Search Foods
                </Label>
                <Input
                  id="food-search"
                  placeholder="Search for Nigerian foods..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm">
                  Category
                </Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {filteredFoods.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm">Select Foods (Click to add to selection)</Label>
                <div className="max-h-32 sm:max-h-40 overflow-y-auto border rounded-md">
                  {filteredFoods.map((food) => (
                    <div
                      key={food.id}
                      className="p-2 sm:p-3 cursor-pointer hover:bg-muted/50 border-b last:border-b-0 flex justify-between items-center"
                      onClick={() => addToCart(food)}
                    >
                      <div className="flex-1">
                        <div className="font-medium text-xs sm:text-sm">{food.name}</div>
                        <div className="text-xs text-muted-foreground">{food.description}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {food.calories} cal per {food.servingSize} • {food.category}
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" className="text-green-600 hover:text-green-700">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {message && (
            <div
              className={`flex items-center gap-2 p-3 rounded-lg border text-sm ${
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

      {foodCart.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <ShoppingCart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Food Selection ({foodCart.length} items)
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Adjust servings and quantities, then add all to your meal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {foodCart.map((item) => {
              const nutrition = calculatePortionNutrition(item.food, item.servings)
              const totalCals = nutrition.calories * item.quantity

              return (
                <div key={item.food.id} className="p-3 bg-muted/50 rounded-lg border space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.food.name}</h4>
                      <p className="text-xs text-muted-foreground">{item.food.description}</p>
                      <p className="text-xs text-green-600 font-medium mt-1">
                        {totalCals.toFixed(0)} cal total ({nutrition.calories.toFixed(0)} cal each)
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.food.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      ×
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-xs">Servings</Label>
                      <Input
                        type="number"
                        min="0.5"
                        step="0.5"
                        value={item.servings}
                        onChange={(e) => updateCartServings(item.food.id, Number.parseFloat(e.target.value) || 0.5)}
                        className="text-sm h-8"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs">Quantity</Label>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateCartQuantity(item.food.id, -1)}
                          className="h-8 w-8 p-0"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium min-w-[2rem] text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateCartQuantity(item.food.id, 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}

            <div className="border-t pt-3 mt-4">
              <div className="flex justify-between items-center mb-3">
                <span className="font-medium text-sm">Selection Total:</span>
                <span className="font-bold text-green-600">{cartTotalCalories.toFixed(0)} calories</span>
              </div>
              <Button onClick={addAllToMeal} className="w-full bg-blue-600 hover:bg-blue-700 text-sm">
                <Plus className="h-4 w-4 mr-2" />
                Add All to Meal ({foodCart.length} items)
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected Foods */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            {mealType.charAt(0).toUpperCase() + mealType.slice(1)} Items
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Total: {totalCalories.toFixed(0)} calories, {totalProtein.toFixed(1)}g protein
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedFoods.length === 0 ? (
            <div className="text-center py-6 sm:py-8">
              <p className="text-muted-foreground text-sm sm:text-base">
                No foods added yet. Use the Nigerian food database above to add foods.
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                Use the Portion Guide to help estimate serving sizes!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedFoods.map((food) => (
                <div
                  key={food.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-muted/50 rounded-lg border gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm flex flex-wrap items-center gap-2">
                      <span className="truncate">{food.name}</span>
                      <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded font-medium whitespace-nowrap">
                        x{food.quantity}
                      </span>
                      {food.isNigerianFood && (
                        <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded whitespace-nowrap">
                          Nigerian Food
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {food.calories.toFixed(0)} cal total ({food.caloriesPerServing.toFixed(0)} cal each),{" "}
                      {food.protein.toFixed(1)}g protein per {food.serving}
                    </p>
                    <div className="flex flex-wrap gap-2 sm:gap-4 text-xs text-muted-foreground mt-1">
                      <span>Carbs: {food.carbs.toFixed(1)}g</span>
                      <span>Fats: {food.fats.toFixed(1)}g</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 justify-end sm:justify-start">
                    <span className="text-sm font-medium min-w-[2rem] text-center">{food.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => increaseQuantity(food.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}

              {/* Nutrition Summary */}
              <div className="border-t pt-3 mt-4">
                <h4 className="font-medium mb-2 text-sm sm:text-base">Meal Summary</h4>
                <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
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
                className="w-full mt-4 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-sm sm:text-base"
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
