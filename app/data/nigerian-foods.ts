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
  portionCalories: {
    small: number // 1 serving
    medium: number // 2 servings
    large: number // 3 servings
  }
}

export const nigerianFoods: NigerianFood[] = [
  {
    id: "jollof-rice",
    name: "Jollof Rice",
    category: "Grains & Starches",
    calories: 110.04,
    protein: 4.2,
    carbs: 22.8,
    fats: 1.1,
    fiber: 1.8,
    iron: 1.2,
    vitaminA: 45,
    description: "Traditional Nigerian rice dish cooked with tomatoes and spices",
    servingSize: "1 cup (small portion)",
    servingWeight: 150,
    portionCalories: {
      small: 110.04,
      medium: 226.68,
      large: 334.32,
    },
  },
  {
    id: "white-rice",
    name: "White Rice",
    category: "Grains & Starches",
    calories: 88.92,
    protein: 2.1,
    carbs: 20.4,
    fats: 0.2,
    fiber: 0.6,
    iron: 0.8,
    vitaminA: 0,
    description: "Plain cooked white rice",
    servingSize: "1 cup (small portion)",
    servingWeight: 140,
    portionCalories: {
      small: 88.92,
      medium: 184.95,
      large: 227.43,
    },
  },
  {
    id: "pounded-yam",
    name: "Pounded Yam",
    category: "Swallows",
    calories: 160.8,
    protein: 2.8,
    carbs: 38.2,
    fats: 0.3,
    fiber: 4.1,
    iron: 0.9,
    vitaminA: 138,
    description: "Traditional Nigerian swallow made from yam",
    servingSize: "1 wrap (small portion)",
    servingWeight: 120,
    portionCalories: {
      small: 160.8,
      medium: 332.66,
      large: 495.04,
    },
  },
  {
    id: "eba",
    name: "Eba",
    category: "Swallows",
    calories: 160.3,
    protein: 1.4,
    carbs: 37.8,
    fats: 0.5,
    fiber: 1.8,
    iron: 1.1,
    vitaminA: 13,
    description: "Cassava flour swallow, popular Nigerian staple",
    servingSize: "1 wrap (small portion)",
    servingWeight: 100,
    portionCalories: {
      small: 160.3,
      medium: 320.6,
      large: 485.48,
    },
  },
  {
    id: "semo",
    name: "Semo",
    category: "Swallows",
    calories: 176.58,
    protein: 6.2,
    carbs: 36.4,
    fats: 1.1,
    fiber: 2.1,
    iron: 1.8,
    vitaminA: 0,
    description: "Semolina swallow, smooth and filling",
    servingSize: "1 wrap (small portion)",
    servingWeight: 110,
    portionCalories: {
      small: 176.58,
      medium: 356.09,
      large: 546.34,
    },
  },
  {
    id: "amala",
    name: "Amala",
    category: "Swallows",
    calories: 123.18,
    protein: 2.1,
    carbs: 28.7,
    fats: 0.4,
    fiber: 3.2,
    iron: 2.1,
    vitaminA: 0,
    description: "Yam flour swallow with distinctive brown color",
    servingSize: "1 wrap (small portion)",
    servingWeight: 95,
    portionCalories: {
      small: 123.18,
      medium: 198.73,
      large: 298.92,
    },
  },
  {
    id: "starch",
    name: "Starch",
    category: "Swallows",
    calories: 145.73,
    protein: 0.8,
    carbs: 35.2,
    fats: 0.1,
    fiber: 1.4,
    iron: 0.6,
    vitaminA: 0,
    description: "Cassava starch swallow, light and smooth",
    servingSize: "1 wrap (small portion)",
    servingWeight: 105,
    portionCalories: {
      small: 145.73,
      medium: 303.6,
      large: 439.39,
    },
  },
  {
    id: "beans",
    name: "Beans",
    category: "Legumes",
    calories: 82.72,
    protein: 5.8,
    carbs: 14.2,
    fats: 0.6,
    fiber: 6.4,
    iron: 2.2,
    vitaminA: 7,
    description: "Cooked Nigerian brown beans, high in protein",
    servingSize: "1/2 cup (small portion)",
    servingWeight: 90,
    portionCalories: {
      small: 82.72,
      medium: 169.58,
      large: 258.24,
    },
  },
  {
    id: "orange",
    name: "Orange",
    category: "Fruits",
    calories: 203.46,
    protein: 4.1,
    carbs: 51.2,
    fats: 0.5,
    fiber: 12.8,
    iron: 0.4,
    vitaminA: 450,
    description: "Fresh Nigerian orange, rich in vitamin C",
    servingSize: "1 medium orange",
    servingWeight: 200,
    portionCalories: {
      small: 203.46,
      medium: 404.54,
      large: 670.24,
    },
  },
  {
    id: "carrot",
    name: "Carrot",
    category: "Vegetables",
    calories: 68.97,
    protein: 1.2,
    carbs: 16.1,
    fats: 0.3,
    fiber: 4.6,
    iron: 0.7,
    vitaminA: 1890,
    description: "Fresh carrot, excellent source of vitamin A",
    servingSize: "1 medium carrot",
    servingWeight: 120,
    portionCalories: {
      small: 68.97,
      medium: 121.77,
      large: 298.13,
    },
  },
  {
    id: "garden-egg",
    name: "Garden Egg",
    category: "Vegetables",
    calories: 161.32,
    protein: 4.8,
    carbs: 38.4,
    fats: 0.8,
    fiber: 14.2,
    iron: 1.4,
    vitaminA: 23,
    description: "Nigerian garden egg, similar to eggplant",
    servingSize: "2 medium pieces",
    servingWeight: 150,
    portionCalories: {
      small: 161.32,
      medium: 185,
      large: 248.16,
    },
  },
  {
    id: "water",
    name: "Water",
    category: "Beverages",
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    fiber: 0,
    iron: 0,
    vitaminA: 0,
    description: "Pure drinking water, essential for hydration",
    servingSize: "1 glass (250ml)",
    servingWeight: 250,
    portionCalories: {
      small: 0,
      medium: 0,
      large: 0,
    },
  },
]

export function calculatePortionCalories(food: NigerianFood, servings: number): number {
  if (servings <= 1) return food.portionCalories.small
  if (servings <= 2) return food.portionCalories.medium
  if (servings <= 3) return food.portionCalories.large

  // For servings > 3, calculate based on small portion as base
  return food.portionCalories.small * servings
}

export function calculatePortionNutrition(food: NigerianFood, servings: number) {
  const multiplier = servings
  return {
    calories: calculatePortionCalories(food, servings),
    protein: food.protein * multiplier,
    carbs: food.carbs * multiplier,
    fats: food.fats * multiplier,
    fiber: food.fiber * multiplier,
    iron: food.iron * multiplier,
    vitaminA: food.vitaminA * multiplier,
  }
}

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

export function getAllCategories(): string[] {
  const categories = new Set(nigerianFoods.map((food) => food.category))
  return Array.from(categories).sort()
}
