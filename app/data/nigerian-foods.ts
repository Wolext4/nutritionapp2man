export interface NigerianFood {
  id: string
  name: string
  category: string
  calories: number
  protein: number
  carbs: number
  fats: number
  fiber: number
  iron: number
  vitaminA: number
  description: string
  servingSize: string
  servingWeight: number
}

export const nigerianFoods: NigerianFood[] = []

export function getFoodById(id: string): NigerianFood | undefined {
  return nigerianFoods.find((food) => food.id === id)
}

export function getFoodsByCategory(category: string): NigerianFood[] {
  return nigerianFoods.filter((food) => food.category === category)
}

export function searchFoods(query: string): NigerianFood[] {
  const lowercaseQuery = query.toLowerCase()
  return nigerianFoods.filter(
    (food) =>
      food.name.toLowerCase().includes(lowercaseQuery) ||
      food.category.toLowerCase().includes(lowercaseQuery) ||
      food.description.toLowerCase().includes(lowercaseQuery),
  )
}
