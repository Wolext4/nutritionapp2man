"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Database } from "lucide-react"
import { LocalDatabase } from "@/lib/local-storage"

export default function FoodsDatabase() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const foodDatabase = LocalDatabase.getFoodDatabase()

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(foodDatabase.map((food) => food.category))
    return ["all", ...Array.from(cats).sort()]
  }, [foodDatabase])

  // Filter foods based on search and category
  const filteredFoods = useMemo(() => {
    let foods = foodDatabase

    // Filter by category
    if (selectedCategory !== "all") {
      foods = foods.filter((food) => food.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      foods = foods.filter(
        (food) =>
          food.name.toLowerCase().includes(query) ||
          food.category.toLowerCase().includes(query) ||
          food.portion.toLowerCase().includes(query),
      )
    }

    return foods
  }, [foodDatabase, selectedCategory, searchQuery])

  return (
    <div className="space-y-3 xs:space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base xs:text-lg flex items-center gap-2">
            <Database className="h-4 w-4 xs:h-5 xs:w-5 text-green-600" />
            Nigerian Foods Database
          </CardTitle>
          <CardDescription className="text-xs xs:text-sm">
            Browse {foodDatabase.length} locally available foods in Ibadan with calorie information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 xs:space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-2 xs:left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 xs:h-4 xs:w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search foods..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 xs:pl-10 text-xs xs:text-sm h-8 xs:h-10"
            />
          </div>

          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="w-full h-auto flex-wrap justify-start gap-1 p-1 bg-muted/50">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="text-[10px] xs:text-xs px-2 xs:px-3 py-1 xs:py-1.5 data-[state=active]:bg-background"
                >
                  {category === "all" ? "All Foods" : category}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={selectedCategory} className="mt-3 xs:mt-4">
              {filteredFoods.length === 0 ? (
                <div className="text-center py-6 xs:py-8">
                  <Database className="h-8 w-8 xs:h-10 xs:w-10 text-muted-foreground mx-auto mb-2 xs:mb-3" />
                  <p className="text-muted-foreground text-xs xs:text-sm">No foods found</p>
                  <p className="text-muted-foreground text-[10px] xs:text-xs mt-1">
                    Try a different search or category
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 xs:gap-3">
                  {filteredFoods.map((food) => (
                    <Card key={food.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2 xs:pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-xs xs:text-sm font-semibold leading-tight">{food.name}</CardTitle>
                          <Badge variant="secondary" className="text-[10px] xs:text-xs shrink-0">
                            {food.nutrition.calories} cal
                          </Badge>
                        </div>
                        <CardDescription className="text-[10px] xs:text-xs">{food.category}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-1 xs:space-y-2">
                        <div className="flex items-center justify-between text-[10px] xs:text-xs">
                          <span className="text-muted-foreground">Portion:</span>
                          <span className="font-medium">{food.portion}</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] xs:text-xs">
                          <span className="text-muted-foreground">Weight:</span>
                          <span className="font-medium">{food.grams}g</span>
                        </div>
                        <div className="pt-1 xs:pt-2 border-t">
                          <div className="text-[10px] xs:text-xs font-semibold text-green-600 mb-1">
                            Nutrition per serving
                          </div>
                          <div className="grid grid-cols-2 gap-1 text-[10px] xs:text-xs">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Calories:</span>
                              <span className="font-medium">{food.nutrition.calories}</span>
                            </div>
                            {food.nutrition.protein > 0 && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Protein:</span>
                                <span className="font-medium">{food.nutrition.protein}g</span>
                              </div>
                            )}
                            {food.nutrition.carbs > 0 && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Carbs:</span>
                                <span className="font-medium">{food.nutrition.carbs}g</span>
                              </div>
                            )}
                            {food.nutrition.fats > 0 && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Fats:</span>
                                <span className="font-medium">{food.nutrition.fats}g</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
