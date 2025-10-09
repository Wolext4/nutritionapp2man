"use client"

import { useEffect, useMemo, useState } from "react"
import { useAuth } from "../contexts/auth-context"
import { LocalDatabase } from "@/lib/local-storage"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Plus, Minus, X, Hand } from "lucide-react"

type FoodDbItem = {
  id: string
  name: string
  category: string
  portion: string
  grams: number
  nutrition: {
    calories: number
    protein: number
    carbs: number
    fats: number
    fiber: number
    iron: number
    vitaminA: number
  }
}

type SelectedEntry = {
  food: FoodDbItem
  servings: number // multiplier of the base portion
  quantity: number // the counter (how many times this item is included)
}

export default function MealLogger() {
  const { user } = useAuth()
  const [mealType, setMealType] = useState<"breakfast" | "lunch" | "dinner" | "snack">("breakfast")
  const [showPortionGuide, setShowPortionGuide] = useState(false)

  const [foods, setFoods] = useState<FoodDbItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [category, setCategory] = useState<string>("All Categories")

  const [selectedMap, setSelectedMap] = useState<Record<string, SelectedEntry>>({})
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Logged meals (for current user & selected date)
  const [todayMeals, setTodayMeals] = useState<any[]>([]) // meals as stored by LocalDatabase

  // Today's date string YYYY-MM-DD
  const todayDate = useMemo(() => new Date().toISOString().split("T")[0], [])

  useEffect(() => {
    // load food database from LocalDatabase
    const dbFoods = LocalDatabase.getFoodDatabase() || []
    setFoods(dbFoods)
  }, [])

  useEffect(() => {
    // refresh today's meals for the user whenever user or mealType changes
    if (!user) return
    const meals = LocalDatabase.getUserMeals ? LocalDatabase.getUserMeals(user.id) : []
    // filter to today's meals and by mealType
    const todays = meals.filter((m) => m.date === todayDate && m.type === mealType)
    setTodayMeals(todays)
  }, [user, mealType])

  // Derived lists
  const categories = useMemo(() => {
    return ["All Categories", ...Array.from(new Set(foods.map((f) => f.category)))]
  }, [foods])

  const filteredFoods = useMemo(() => {
    let out = foods
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      out = out.filter((f) => f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q))
    }
    if (category !== "All Categories") {
      out = out.filter((f) => f.category === category)
    }
    return out
  }, [foods, searchQuery, category])

  // Selection utilities
  const addOrIncrement = (food: FoodDbItem) => {
    setSelectedMap((prev) => {
      const prevEntry = prev[food.id]
      const newEntry: SelectedEntry = prevEntry
        ? { ...prevEntry, quantity: prevEntry.quantity + 1 }
        : { food, servings: 1, quantity: 1 }
      return { ...prev, [food.id]: newEntry }
    })
  }

  const decrement = (foodId: string) => {
    setSelectedMap((prev) => {
      const entry = prev[foodId]
      if (!entry) return prev
      const newQty = entry.quantity - 1
      if (newQty <= 0) {
        const copy = { ...prev }
        delete copy[foodId]
        return copy
      }
      return { ...prev, [foodId]: { ...entry, quantity: newQty } }
    })
  }

  const removeSelection = (foodId: string) => {
    setSelectedMap((prev) => {
      const copy = { ...prev }
      delete copy[foodId]
      return copy
    })
  }

  const updateServings = (foodId: string, servings: number) => {
    setSelectedMap((prev) => {
      const entry = prev[foodId]
      if (!entry) return prev
      return { ...prev, [foodId]: { ...entry, servings: Math.max(0.1, servings) } }
    })
  }

  const selectionArray = useMemo(() => Object.values(selectedMap), [selectedMap])

  const selectionTotalCalories = useMemo(() => {
    return selectionArray.reduce((sum, e) => {
      const perUnit = (e.food.nutrition?.calories || 0) * e.servings
      return sum + perUnit * e.quantity
    }, 0)
  }, [selectionArray])

  // Build expanded foods (repeats per quantity) and call LocalDatabase.createMeal
  const handleAddAllToMeal = async () => {
    if (!user) {
      setMessage({ type: "error", text: "You must be logged in to save a meal." })
      setTimeout(() => setMessage(null), 3000)
      return
    }

    if (selectionArray.length === 0) {
      setMessage({ type: "error", text: "No foods selected." })
      setTimeout(() => setMessage(null), 2000)
      return
    }

    setIsSaving(true)
    try {
      const now = new Date()
      const currentTime = now.toTimeString().split(" ")[0].substring(0, 5)
      const expandedFoods = selectionArray.flatMap((entry) => {
        const perServCalories = Math.round((entry.food.nutrition?.calories || 0) * entry.servings)
        // repeat per quantity so each logged food has its own id (keeps earlier logic consistent)
        return Array.from({ length: entry.quantity }).map((_, idx) => ({
          id: `${entry.food.id}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${idx}`,
          name: entry.food.name,
          grams: Math.round(entry.food.grams * entry.servings),
          nutrition: {
            calories: perServCalories,
            protein: Math.round((entry.food.nutrition?.protein || 0) * entry.servings),
            carbs: Math.round((entry.food.nutrition?.carbs || 0) * entry.servings),
            fats: Math.round((entry.food.nutrition?.fats || 0) * entry.servings),
            fiber: Math.round((entry.food.nutrition?.fiber || 0) * entry.servings),
            iron: Math.round((entry.food.nutrition?.iron || 0) * entry.servings),
            vitaminA: Math.round((entry.food.nutrition?.vitaminA || 0) * entry.servings),
          },
        }))
      })

      const totalNutrition = expandedFoods.reduce(
        (acc, f) => {
          acc.calories += f.nutrition.calories
          acc.protein += f.nutrition.protein
          acc.carbs += f.nutrition.carbs
          acc.fats += f.nutrition.fats
          acc.fiber += f.nutrition.fiber
          acc.iron += f.nutrition.iron
          acc.vitaminA += f.nutrition.vitaminA
          return acc
        },
        { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
      )

      const mealData = {
        userId: user.id,
        type: mealType,
        date: todayDate,
        time: currentTime,
        foods: expandedFoods,
        totalNutrition,
      }

      const result = await LocalDatabase.createMeal(mealData)
      if (result.success) {
        setMessage({ type: "success", text: "Meal logged successfully." })
        // clear selection
        setSelectedMap({})
        // refresh today's meals
        const meals = LocalDatabase.getUserMeals ? LocalDatabase.getUserMeals(user.id) : []
        const todays = meals.filter((m) => m.date === todayDate && m.type === mealType)
        setTodayMeals(todays)
      } else {
        setMessage({ type: "error", text: result.error || "Failed to save meal" })
      }
    } catch (err) {
      console.error(err)
      setMessage({ type: "error", text: "An error occurred while saving the meal" })
    } finally {
      setIsSaving(false)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  // remove a single logged meal entry (optional helper)
  const handleRemoveLoggedMeal = (mealId: string) => {
    // LocalDatabase.deleteMeal exists (accepts id, userId)
    if (!user) return
    LocalDatabase.deleteMeal(mealId, user.id)
    const meals = LocalDatabase.getUserMeals ? LocalDatabase.getUserMeals(user.id) : []
    const todays = meals.filter((m) => m.date === todayDate && m.type === mealType)
    setTodayMeals(todays)
  }

  return (
    <div className="p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>+ Log Your Meal</CardTitle>
          <CardDescription>Track your Nigerian meals using our food database and portion sizing guide</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4 gap-4">
            <div className="w-full max-w-xs">
              <Label htmlFor="meal-type">Meal Type</Label>
              <Select value={mealType} onValueChange={(v: any) => setMealType(v)}>
                <SelectTrigger id="meal-type" className="w-full bg-gray-900 border-gray-700 text-white">
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

            <div>
              <Button variant="outline" onClick={() => setShowPortionGuide((s) => !s)}>
                <Hand className="mr-2 h-4 w-4" /> Portion Guide
              </Button>
            </div>
          </div>

          {/* Food Database card */}
          <Card className="bg-[#0f1720] border-gray-700 mb-6">
            <CardContent>
              <h3 className="font-semibold mb-3 text-white">🍽 Nigerian Food Database</h3>

              <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-3">
                <div className="md:col-span-4">
                  <Label>Search Foods</Label>
                  <Input
                    placeholder="Search for Nigerian foods..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label>Category</Label>
                  <Select value={category} onValueChange={(v: any) => setCategory(v)}>
                    <SelectTrigger className="w-full bg-gray-900 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="text-sm text-gray-300 mb-2">
                Select Foods (Click or use the + button to increase quantity)
              </div>
              <ScrollArea className="h-[260px] border rounded-md bg-[#0b1b20] p-1">
                {filteredFoods.map((food) => {
                  const inSelection = !!selectedMap[food.id]
                  const qty = selectedMap[food.id]?.quantity ?? 0
                  const perUnitCalories = Math.round(food.nutrition.calories)
                  return (
                    <div key={food.id} className="flex items-center justify-between p-3 border-b border-gray-800">
                      <div>
                        <div className="font-medium text-white">{food.name}</div>
                        <div className="text-xs text-gray-400">
                          {food.portion} • {food.category}
                        </div>
                        <div className="text-xs text-emerald-400 mt-1">
                          {perUnitCalories} cal per {food.portion}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center rounded-md bg-gray-900 border border-gray-700">
                          <button
                            className="p-2"
                            title="Decrease"
                            onClick={(e) => {
                              e.stopPropagation()
                              if (inSelection) decrement(food.id)
                            }}
                          >
                            <Minus className="w-4 h-4 text-gray-200" />
                          </button>

                          <div className="px-3 text-sm font-medium text-white min-w-[2rem] text-center">{qty}</div>

                          <button
                            className="p-2"
                            title="Increase"
                            onClick={(e) => {
                              e.stopPropagation()
                              addOrIncrement(food)
                            }}
                          >
                            <Plus className="w-4 h-4 text-white" />
                          </button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            // also add one
                            addOrIncrement(food)
                          }}
                        >
                          + Add
                        </Button>
                      </div>
                    </div>
                  )
                })}
                {filteredFoods.length === 0 && <div className="p-3 text-sm text-gray-400">No foods found</div>}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Food Selection card (stacked below) */}
          <Card className="bg-[#0f1720] border-gray-700 mb-6">
            <CardHeader>
              <CardTitle>🛒 Food Selection ({selectionArray.length} items)</CardTitle>
              <CardDescription>Adjust servings and quantities, then add all to your meal</CardDescription>
            </CardHeader>
            <CardContent>
              {selectionArray.length === 0 ? (
                <div className="text-sm text-gray-400 p-6">No foods selected yet.</div>
              ) : (
                <div className="space-y-3">
                  <ScrollArea className="h-[260px] border rounded-md p-2 bg-[#08161a]">
                    {selectionArray.map((entry) => (
                      <div
                        key={entry.food.id}
                        className="p-3 mb-2 bg-gray-900 rounded-md flex flex-col md:flex-row md:items-center justify-between gap-3"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-white">{entry.food.name}</div>
                          <div className="text-xs text-gray-400">
                            {entry.food.portion} • {entry.food.category}
                          </div>
                          <div className="text-xs text-emerald-400 mt-1">
                            {Math.round(entry.food.nutrition.calories * entry.servings)} cal total (
                            {Math.round(entry.food.nutrition.calories)} cal per base)
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                          <div className="min-w-[140px]">
                            <Label className="text-xs">Servings</Label>
                            <Input
                              type="number"
                              value={entry.servings}
                              min={0.1}
                              step={0.1}
                              onChange={(e) =>
                                updateServings(entry.food.id, Math.max(0.1, Number.parseFloat(e.target.value) || 0.1))
                              }
                              className="h-8 text-sm bg-gray-800 border-gray-700"
                            />
                          </div>

                          <div>
                            <Label className="text-xs">Quantity</Label>
                            <div className="flex items-center gap-2 mt-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => decrement(entry.food.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <div className="min-w-[2rem] text-center">{entry.quantity}</div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addOrIncrement(entry.food)}
                                className="h-8 w-8 p-0"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeSelection(entry.food.id)}
                              className="text-red-500"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </ScrollArea>

                  <div className="flex items-center justify-between mt-3">
                    <div>
                      <div className="text-sm text-gray-400">Selection Total:</div>
                      <div className="text-emerald-400 font-semibold">
                        {Math.round(selectionTotalCalories)} calories
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-sm text-gray-400 mr-2">
                        Selected: {selectionArray.reduce((s, e) => s + e.quantity, 0)} items
                      </div>
                      <Button
                        onClick={handleAddAllToMeal}
                        disabled={isSaving}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Plus className="mr-2 h-4 w-4" /> Add All to Meal ({selectionArray.length} items)
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Meal Items card (saved meals for today & mealType) */}
          <Card className="bg-[#0f1720] border-gray-700">
            <CardHeader>
              <CardTitle>⏰ {mealType.charAt(0).toUpperCase() + mealType.slice(1)} Items</CardTitle>
              <CardDescription>
                Total: {todayMeals.reduce((acc, m) => acc + (m.totalNutrition?.calories || 0), 0)} calories
              </CardDescription>
            </CardHeader>
            <CardContent>
              {todayMeals.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No foods added yet. Use the Nigerian food database above to add foods.
                </div>
              ) : (
                <div className="space-y-3">
                  {todayMeals.map((meal) => (
                    <div key={meal.id} className="p-3 bg-gray-900 rounded-md border border-gray-800">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold text-white">
                            {meal.type.charAt(0).toUpperCase() + meal.type.slice(1)} • {meal.date} {meal.time}
                          </div>
                          <div className="text-sm text-gray-400">{meal.notes ?? ""}</div>
                          <div className="text-emerald-400 mt-1">
                            {Math.round(meal.totalNutrition?.calories || 0)} cal total
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveLoggedMeal(meal.id)}
                            className="text-red-500"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>

                      <Separator className="my-2" />
                      <div className="grid gap-2">
                        {meal.foods.map((f: any) => (
                          <div key={f.id} className="flex justify-between text-sm text-gray-300">
                            <span>{f.name}</span>
                            <span>{Math.round(f.nutrition?.calories || 0)} cal</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {message && (
            <div
              className={`mt-4 p-3 rounded-md text-sm ${
                message.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
              }`}
            >
              {message.text}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
