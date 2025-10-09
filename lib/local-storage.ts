import { v4 as uuidv4 } from "uuid"

// Types
export interface User {
  id: string
  email: string
  fullName: string
  age: number
  gender: "male" | "female" | "other"
  height: number
  weight: number
  waistCircumference?: number // Added optional waist circumference field
  location?: string
  occupation?: string
  healthConditions?: string[]
  fitnessGoals?: string[]
  role: "user" | "admin"
  createdAt: string
  updatedAt: string
  lastLoginAt: string
}

export interface UserProfile {
  userId: string
  preferences: {
    culturalBackground: string[]
    dietaryRestrictions: string[]
    activityLevel: "sedentary" | "light" | "moderate" | "active"
    healthGoals: string[]
    favoriteNigerianFoods: string[]
    mealPreferences: {
      breakfast: string[]
      lunch: string[]
      dinner: string[]
      snacks: string[]
    }
  }
  settings: {
    notifications: boolean
    dataSharing: boolean
    units: "metric" | "imperial"
    reminderTimes: {
      breakfast: string
      lunch: string
      dinner: string
    }
    weeklyGoals: {
      calorieTarget: number
      proteinTarget: number
      exerciseDays: number
    }
  }
  personalizedRecommendations: {
    suggestedFoods: string[]
    avoidFoods: string[]
    mealPlanPreferences: string
    supplementSuggestions: string[]
  }
  updatedAt: string
}

export interface Meal {
  id: string
  userId: string
  type: "breakfast" | "lunch" | "dinner" | "snack"
  date: string
  time: string
  foods: {
    id: string
    name: string
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
  }[]
  totalNutrition: {
    calories: number
    protein: number
    carbs: number
    fats: number
    fiber: number
    iron: number
    vitaminA: number
  }
  mood?: "great" | "good" | "okay" | "poor"
  notes?: string
  createdAt: string
}

export interface UserStats {
  userId: string
  totalMealsLogged: number
  averageDailyCalories: number
  favoriteFood: string
  longestStreak: number
  currentStreak: number
  weightProgress: {
    date: string
    weight: number
  }[]
  achievements: string[]
  lastUpdated: string
}

export interface SleepEntry {
  id: string
  userId: string
  date: string
  hoursSlept: number
  sleepQuality: "poor" | "fair" | "good" | "excellent"
  bedTime?: string
  wakeTime?: string
  notes?: string
  createdAt: string
}

// Storage keys
const STORAGE_KEYS = {
  USERS: "naijafit_users",
  CURRENT_USER: "naijafit_current_user",
  MEALS: "naijafit_meals",
  PROFILES: "naijafit_profiles",
  USER_STATS: "naijafit_user_stats",
  PASSWORDS: "naijafit_passwords",
  INITIALIZED: "naijafit_initialized",
  APP_SETTINGS: "naijafit_app_settings",
  SLEEP_ENTRIES: "naijafit_sleep_entries",
} as const

// -----------------------------------------------------------------------------
// FOOD DATABASE (Locally Available Foods in Ibadan)
// - English names only
// - Static IDs
// - Calorie values taken exactly from your provided table
// - Placeholder zeros for other macros so app logic continues to work
// -----------------------------------------------------------------------------

export const FOOD_DATABASE: {
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
}[] = [
  // 1. Whole Grains and Tubers
  {
    id: "cooked_rice",
    name: "Cooked rice (Iresi)",
    category: "Whole Grains and Tubers",
    portion: "1 fist (200g)",
    grams: 200,
    nutrition: { calories: 260, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },
  {
    id: "boiled_yam",
    name: "Boiled yam (Isu)",
    category: "Whole Grains and Tubers",
    portion: "1 fist (200g)",
    grams: 200,
    nutrition: { calories: 220, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },
  {
    id: "boiled_plantain",
    name: "Boiled plantain (Ogede dodo)",
    category: "Whole Grains and Tubers",
    portion: "1 fist (200g)",
    grams: 200,
    nutrition: { calories: 180, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },
  {
    id: "cooked_maize_pap",
    name: "Cooked maize (Pap/Ogi)",
    category: "Whole Grains and Tubers",
    portion: "1 cup (240ml)",
    grams: 240,
    nutrition: { calories: 150, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },
  {
    id: "cooked_garri_eba",
    name: "Cooked garri (Eba)",
    category: "Whole Grains and Tubers",
    portion: "1 fist (200g)",
    grams: 200,
    nutrition: { calories: 260, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },
  {
    id: "cooked_semovita_semo",
    name: "Cooked semovita (Semo)",
    category: "Whole Grains and Tubers",
    portion: "1 fist (200g)",
    grams: 200,
    nutrition: { calories: 250, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },
  {
    id: "cooked_wheat_swallow",
    name: "Cooked wheat (swallow)",
    category: "Whole Grains and Tubers",
    portion: "1 fist (200g)",
    grams: 200,
    nutrition: { calories: 230, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },
  {
    id: "boiled_irish_potatoes",
    name: "Boiled Irish potatoes",
    category: "Whole Grains and Tubers",
    portion: "1 fist (200g)",
    grams: 200,
    nutrition: { calories: 170, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },
  {
    id: "boiled_sweet_potatoes",
    name: "Boiled sweet potatoes",
    category: "Whole Grains and Tubers",
    portion: "1 fist (200g)",
    grams: 200,
    nutrition: { calories: 180, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },

  // 2. Legumes (Beans and Pulses)
  {
    id: "boiled_beans",
    name: "Boiled beans (Ewa)",
    category: "Legumes",
    portion: "1 fist (200g)",
    grams: 200,
    nutrition: { calories: 240, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },
  {
    id: "moinmoin",
    name: "Moin-moin (steamed bean pudding)",
    category: "Legumes",
    portion: "1 wrap (~200g)",
    grams: 200,
    nutrition: { calories: 230, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },
  {
    id: "akara",
    name: "Akara (bean cake)",
    category: "Legumes",
    portion: "3 balls (~200g)",
    grams: 200,
    nutrition: { calories: 300, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },
  {
    id: "okpa",
    name: "Boiled bambara nut (Okpa)",
    category: "Legumes",
    portion: "1 wrap (~200g)",
    grams: 200,
    nutrition: { calories: 250, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },
  {
    id: "lentils_cooked",
    name: "Lentils (cooked)",
    category: "Legumes",
    portion: "1 fist (200g)",
    grams: 200,
    nutrition: { calories: 230, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },
  {
    id: "soybeans_cooked",
    name: "Soybeans (cooked)",
    category: "Legumes",
    portion: "1 fist (200g)",
    grams: 200,
    nutrition: { calories: 250, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },

  // 3. Nuts and Seeds
  {
    id: "groundnut",
    name: "Groundnut (Epa)",
    category: "Nuts and Seeds",
    portion: "1 handful (40g)",
    grams: 40,
    nutrition: { calories: 250, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },
  {
    id: "cashew",
    name: "Cashew nuts (Kaju)",
    category: "Nuts and Seeds",
    portion: "1 handful (40g)",
    grams: 40,
    nutrition: { calories: 230, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },
  {
    id: "egusi",
    name: "Egusi (melon seed)",
    category: "Nuts and Seeds",
    portion: "1 handful (40g)",
    grams: 40,
    nutrition: { calories: 240, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },
  {
    id: "sesame_seed",
    name: "Sesame seed (Beniseed)",
    category: "Nuts and Seeds",
    portion: "1 handful (40g)",
    grams: 40,
    nutrition: { calories: 230, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },
  {
    id: "coconut_slice",
    name: "Coconut (Agbon)",
    category: "Nuts and Seeds",
    portion: "1 slice (~40g)",
    grams: 40,
    nutrition: { calories: 140, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },
  {
    id: "tiger_nut",
    name: "Tiger nut (Ofio)",
    category: "Nuts and Seeds",
    portion: "1 handful (40g)",
    grams: 40,
    nutrition: { calories: 120, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },

  // 4. Fruits
  {
    id: "orange",
    name: "Orange (Osan)",
    category: "Fruits",
    portion: "1 medium",
    grams: 130,
    nutrition: { calories: 60, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },
  {
    id: "banana",
    name: "Banana (Ogede)",
    category: "Fruits",
    portion: "1 medium (120g)",
    grams: 120,
    nutrition: { calories: 100, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },
  {
    id: "mango",
    name: "Mango (Mangoro)",
    category: "Fruits",
    portion: "1 small (150g)",
    grams: 150,
    nutrition: { calories: 90, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },
  {
    id: "apple",
    name: "Apple (Apù)",
    category: "Fruits",
    portion: "1 medium",
    grams: 150,
    nutrition: { calories: 80, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },
  {
    id: "watermelon",
    name: "Watermelon (Egunsi omi)",
    category: "Fruits",
    portion: "1 wedge (~200g)",
    grams: 200,
    nutrition: { calories: 60, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },
  {
    id: "pawpaw",
    name: "Pawpaw (Ibepe)",
    category: "Fruits",
    portion: "1 fist (200g)",
    grams: 200,
    nutrition: { calories: 80, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },
  {
    id: "pineapple",
    name: "Pineapple (Ope oyinbo)",
    category: "Fruits",
    portion: "1 fist (200g)",
    grams: 200,
    nutrition: { calories: 90, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },
  {
    id: "guava",
    name: "Guava (Gova)",
    category: "Fruits",
    portion: "2 small (200g)",
    grams: 200,
    nutrition: { calories: 100, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },

  // 5. Vegetables
  {
    id: "spinach",
    name: "Spinach (Efotete)",
    category: "Vegetables",
    portion: "1 fist (100g cooked)",
    grams: 100,
    nutrition: { calories: 35, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },
  {
    id: "fluted_pumpkin",
    name: "Fluted pumpkin leaves (Ugu)",
    category: "Vegetables",
    portion: "1 fist (100g cooked)",
    grams: 100,
    nutrition: { calories: 40, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },
  {
    id: "okra",
    name: "Okra (Ila)",
    category: "Vegetables",
    portion: "1 fist (100g cooked)",
    grams: 100,
    nutrition: { calories: 40, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },
  {
    id: "amaranthus",
    name: "Amaranthus leaves (Efo shoko)",
    category: "Vegetables",
    portion: "1 fist (100g cooked)",
    grams: 100,
    nutrition: { calories: 30, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },
  {
    id: "tomato",
    name: "Tomato (Tomati)",
    category: "Vegetables",
    portion: "1 medium (100g)",
    grams: 100,
    nutrition: { calories: 20, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },
  {
    id: "garden_egg",
    name: "Garden egg (Igba)",
    category: "Vegetables",
    portion: "2 pieces (100g)",
    grams: 100,
    nutrition: { calories: 35, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },
  {
    id: "cabbage",
    name: "Cabbage (Efo oyinbo)",
    category: "Vegetables",
    portion: "1 fist (100g)",
    grams: 100,
    nutrition: { calories: 25, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },
  {
    id: "carrot",
    name: "Carrot (Karooti)",
    category: "Vegetables",
    portion: "1 fist (100g)",
    grams: 100,
    nutrition: { calories: 45, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },

  // 6. Milk and Milk Products
  {
    id: "whole_milk",
    name: "Whole liquid milk",
    category: "Milk and Milk Products",
    portion: "1 cup (240ml)",
    grams: 240,
    nutrition: { calories: 150, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },
  {
    id: "lowfat_milk",
    name: "Low-fat milk",
    category: "Milk and Milk Products",
    portion: "1 cup (240ml)",
    grams: 240,
    nutrition: { calories: 100, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },
  {
    id: "nonfat_milk",
    name: "Non-fat milk",
    category: "Milk and Milk Products",
    portion: "1 cup (240ml)",
    grams: 240,
    nutrition: { calories: 80, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },
  {
    id: "evaporated_milk",
    name: "Evaporated milk",
    category: "Milk and Milk Products",
    portion: "1/2 cup (120ml)",
    grams: 120,
    nutrition: { calories: 150, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },
  {
    id: "yogurt_plain",
    name: "Yogurt (plain)",
    category: "Milk and Milk Products",
    portion: "1 cup (240ml)",
    grams: 240,
    nutrition: { calories: 120, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },

  // 7. Eggs and Substitutes
  {
    id: "boiled_egg",
    name: "Boiled egg (Eyin)",
    category: "Eggs and Substitutes",
    portion: "1 large",
    grams: 50,
    nutrition: { calories: 80, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },
  {
    id: "fried_egg",
    name: "Fried egg (Eyin din)",
    category: "Eggs and Substitutes",
    portion: "1 large",
    grams: 50,
    nutrition: { calories: 120, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },
  {
    id: "omelette",
    name: "Omelette (with tomato & onion)",
    category: "Eggs and Substitutes",
    portion: "1 serving (~120g)",
    grams: 120,
    nutrition: { calories: 150, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },
  {
    id: "tofu",
    name: "Tofu (Wara soy)",
    category: "Eggs and Substitutes",
    portion: "1 slice (100g)",
    grams: 100,
    nutrition: { calories: 90, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },

  // 8. Meat, Fish, and Poultry
  {
    id: "chicken",
    name: "Chicken (Adie)",
    category: "Meat, Fish, and Poultry",
    portion: "1 fist (90g)",
    grams: 90,
    nutrition: { calories: 180, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },
  {
    id: "beef",
    name: "Beef (Eran malu)",
    category: "Meat, Fish, and Poultry",
    portion: "1 fist (90g)",
    grams: 90,
    nutrition: { calories: 200, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },
  {
    id: "goat_meat",
    name: "Goat meat (Eran ewure)",
    category: "Meat, Fish, and Poultry",
    portion: "1 fist (90g)",
    grams: 90,
    nutrition: { calories: 190, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },
  {
    id: "fish",
    name: "Fish (Eja)",
    category: "Meat, Fish, and Poultry",
    portion: "1 fist (90g)",
    grams: 90,
    nutrition: { calories: 170, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },
  {
    id: "turkey",
    name: "Turkey (Tọki)",
    category: "Meat, Fish, and Poultry",
    portion: "1 fist (90g)",
    grams: 90,
    nutrition: { calories: 190, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },
  {
    id: "snail",
    name: "Snail (Igbin)",
    category: "Meat, Fish, and Poultry",
    portion: "1 fist (90g)",
    grams: 90,
    nutrition: { calories: 120, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },

  // 9. Oils and Fats
  {
    id: "palm_oil",
    name: "Palm oil (Epo pupa)",
    category: "Oils and Fats",
    portion: "1 tsp (5ml)",
    grams: 5,
    nutrition: { calories: 45, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },
  {
    id: "groundnut_oil",
    name: "Groundnut oil (Epo epa)",
    category: "Oils and Fats",
    portion: "1 tsp (5ml)",
    grams: 5,
    nutrition: { calories: 45, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },
  {
    id: "vegetable_oil",
    name: "Vegetable oil (Epo elepo)",
    category: "Oils and Fats",
    portion: "1 tsp (5ml)",
    grams: 5,
    nutrition: { calories: 45, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },
  {
    id: "margarine",
    name: "Margarine",
    category: "Oils and Fats",
    portion: "1 tsp (5g)",
    grams: 5,
    nutrition: { calories: 35, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },
  {
    id: "butter",
    name: "Butter",
    category: "Oils and Fats",
    portion: "1 tsp (5g)",
    grams: 5,
    nutrition: { calories: 35, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },

  // 10. Beverages and Others
  {
    id: "cocoa_without",
    name: "Cocoa beverage (without milk/sugar)",
    category: "Beverages and Others",
    portion: "1 cup (240ml)",
    grams: 240,
    nutrition: { calories: 80, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },
  {
    id: "cocoa_with",
    name: "Cocoa beverage (with milk and sugar)",
    category: "Beverages and Others",
    portion: "1 cup (240ml)",
    grams: 240,
    nutrition: { calories: 150, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },
  {
    id: "fruit_juice_unsweetened",
    name: "Fruit juice (unsweetened)",
    category: "Beverages and Others",
    portion: "1 cup (240ml)",
    grams: 240,
    nutrition: { calories: 100, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },
  {
    id: "zobo_unsweetened",
    name: "Zobo drink (unsweetened)",
    category: "Beverages and Others",
    portion: "1 cup (240ml)",
    grams: 240,
    nutrition: { calories: 50, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  },
]

// Utility functions
function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue

  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Error reading from localStorage key ${key}:`, error)
    return defaultValue
  }
}

function setToStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error writing to localStorage key ${key}:`, error)
  }
}

// Database operations
export class LocalDatabase {
  // Expose food database
  static getFoodDatabase() {
    return FOOD_DATABASE
  }

  // Initialize with demo data and personalized content
  static initialize(): void {
    if (typeof window === "undefined") return

    console.log("[v0] Initializing LocalDatabase...")

    const demoUsers: User[] = [
      {
        id: "demo-user-id-12345",
        email: "test@naijafit.com",
        fullName: "Demo User",
        age: 28,
        gender: "female",
        height: 165,
        weight: 68,
        waistCircumference: 75,
        location: "Nigeria",
        occupation: "User",
        healthConditions: [],
        fitnessGoals: ["weight_maintenance"],
        role: "user",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      },
      {
        id: "admin-user-id-67890",
        email: "admin@gluguide.com",
        fullName: "GluGuide Administrator",
        age: 35,
        gender: "other",
        height: 170,
        weight: 70,
        waistCircumference: 80,
        location: "Nigeria",
        occupation: "System Administrator",
        healthConditions: [],
        fitnessGoals: [],
        role: "admin",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      },
    ]

    const existingUsers = getFromStorage<User[]>(STORAGE_KEYS.USERS, [])
    const existingEmails = new Set(existingUsers.map((u) => u.email))

    const usersToAdd = demoUsers.filter((user) => !existingEmails.has(user.email))
    if (usersToAdd.length > 0) {
      const updatedUsers = [...existingUsers, ...usersToAdd]
      setToStorage(STORAGE_KEYS.USERS, updatedUsers)
      console.log(
        "[v0] Added missing demo users:",
        usersToAdd.map((u) => u.email),
      )
    }

    const existingPasswords = getFromStorage<Record<string, string>>(STORAGE_KEYS.PASSWORDS, {})
    const demoPasswords: Record<string, string> = {
      "demo-user-id-12345": "demo123",
      "admin-user-id-67890": "admin2024!",
    }

    let passwordsUpdated = false
    for (const [userId, password] of Object.entries(demoPasswords)) {
      if (!existingPasswords[userId]) {
        existingPasswords[userId] = password
        passwordsUpdated = true
      }
    }

    if (passwordsUpdated) {
      setToStorage(STORAGE_KEYS.PASSWORDS, existingPasswords)
      console.log("[v0] Updated demo user passwords")
    }

    const existingProfiles = getFromStorage<UserProfile[]>(STORAGE_KEYS.PROFILES, [])
    const existingProfileUserIds = new Set(existingProfiles.map((p) => p.userId))

    const profilesToAdd = demoUsers
      .filter((user) => !existingProfileUserIds.has(user.id))
      .map((user) => ({
        userId: user.id,
        preferences: {
          culturalBackground: user.id === "demo-user-id-12345" ? ["general-nigerian"] : ["general-nigerian"],
          dietaryRestrictions: [],
          activityLevel: "moderate" as const,
          healthGoals: user.id === "demo-user-id-12345" ? ["balanced"] : ["system_management"],
          favoriteNigerianFoods: [],
          mealPreferences: {
            breakfast: [],
            lunch: [],
            dinner: [],
            snacks: [],
          },
        },
        settings: {
          notifications: user.id === "demo-user-id-12345",
          dataSharing: false,
          units: "metric" as const,
          reminderTimes: {
            breakfast: "07:30",
            lunch: "12:30",
            dinner: "19:00",
          },
          weeklyGoals: {
            calorieTarget: 2000,
            proteinTarget: 100,
            exerciseDays: 3,
          },
        },
        personalizedRecommendations: {
          suggestedFoods: [],
          avoidFoods: [],
          mealPlanPreferences: "balanced_nigerian",
          supplementSuggestions: [],
        },
        updatedAt: new Date().toISOString(),
      }))

    if (profilesToAdd.length > 0) {
      const updatedProfiles = [...existingProfiles, ...profilesToAdd]
      setToStorage(STORAGE_KEYS.PROFILES, updatedProfiles)
      console.log("[v0] Added missing demo user profiles")
    }

    const existingMeals = getFromStorage<Meal[]>(STORAGE_KEYS.MEALS, [])
    if (existingMeals.length === 0) {
      setToStorage(STORAGE_KEYS.MEALS, [])
    }

    const demoUserId = "demo-user-id-12345"
    const existingStats = getFromStorage<UserStats[]>(STORAGE_KEYS.USER_STATS, [])
    const demoUserStats = existingStats.find((s) => s.userId === demoUserId)

    if (!demoUserStats) {
      const initialStats: UserStats = {
        userId: demoUserId,
        totalMealsLogged: 0,
        averageDailyCalories: 0,
        favoriteFood: "Not determined yet",
        longestStreak: 0,
        currentStreak: 0,
        weightProgress: [{ date: new Date().toISOString().split("T")[0], weight: 68 }],
        achievements: ["Welcome to GluGuide!"],
        lastUpdated: new Date().toISOString(),
      }
      existingStats.push(initialStats)
      setToStorage(STORAGE_KEYS.USER_STATS, existingStats)
      console.log("[v0] Added initial stats for demo user")
    }

    // Mark as initialized
    setToStorage(STORAGE_KEYS.INITIALIZED, true)
    console.log("[v0] LocalDatabase initialization complete")
  }

  static isInitialized(): boolean {
    return getFromStorage(STORAGE_KEYS.INITIALIZED, false)
  }

  // User operations
  static getUsers(): User[] {
    return getFromStorage<User[]>(STORAGE_KEYS.USERS, [])
  }

  static saveUsers(users: User[]): void {
    setToStorage(STORAGE_KEYS.USERS, users)
  }

  static async createUser(
    userData: Omit<User, "id" | "createdAt" | "updatedAt" | "lastLoginAt"> & { password: string },
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    const users = this.getUsers()

    // Check if user already exists
    if (users.find((u) => u.email === userData.email.toLowerCase())) {
      return { success: false, error: "User with this email already exists" }
    }

    const now = new Date().toISOString()
    const newUser: User = {
      id: uuidv4(),
      email: userData.email.toLowerCase(),
      fullName: userData.fullName,
      age: userData.age,
      gender: userData.gender,
      height: userData.height,
      weight: userData.weight,
      waistCircumference: userData.waistCircumference, // Include waist circumference in new user creation
      location: userData.location,
      occupation: userData.occupation,
      healthConditions: userData.healthConditions || [],
      fitnessGoals: userData.fitnessGoals || [],
      role: "user",
      createdAt: now,
      updatedAt: now,
      lastLoginAt: now,
    }

    users.push(newUser)
    this.saveUsers(users)

    // Save password
    const passwords = getFromStorage<Record<string, string>>(STORAGE_KEYS.PASSWORDS, {})
    passwords[newUser.id] = userData.password
    setToStorage(STORAGE_KEYS.PASSWORDS, passwords)

    // Create default profile for new user
    const defaultProfile: UserProfile = {
      userId: newUser.id,
      preferences: {
        culturalBackground: ["general-nigerian"],
        dietaryRestrictions: [],
        activityLevel: "moderate",
        healthGoals: ["balanced"],
        favoriteNigerianFoods: [],
        mealPreferences: {
          breakfast: [],
          lunch: [],
          dinner: [],
          snacks: [],
        },
      },
      settings: {
        notifications: true,
        dataSharing: false,
        units: "metric",
        reminderTimes: {
          breakfast: "07:00",
          lunch: "12:00",
          dinner: "19:00",
        },
        weeklyGoals: {
          calorieTarget: 2000,
          proteinTarget: 100,
          exerciseDays: 3,
        },
      },
      personalizedRecommendations: {
        suggestedFoods: [],
        avoidFoods: [],
        mealPlanPreferences: "balanced_nigerian",
        supplementSuggestions: [],
      },
      updatedAt: now,
    }

    const profiles = this.getProfiles()
    profiles.push(defaultProfile)
    this.saveProfiles(profiles)

    // Create initial user stats
    const initialStats: UserStats = {
      userId: newUser.id,
      totalMealsLogged: 0,
      averageDailyCalories: 0,
      favoriteFood: "Not determined yet",
      longestStreak: 0,
      currentStreak: 0,
      weightProgress: [{ date: now.split("T")[0], weight: newUser.weight }],
      achievements: ["Welcome to NaijaFit!"],
      lastUpdated: now,
    }

    const userStats = this.getUserStats()
    userStats.push(initialStats)
    this.saveUserStats(userStats)

    return { success: true, user: newUser }
  }

  static async loginUser(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    console.log("[v0] Login attempt for:", email)

    const users = this.getUsers()
    console.log(
      "[v0] Available users:",
      users.map((u) => ({ email: u.email, id: u.id })),
    )

    const user = users.find((u) => u.email === email.toLowerCase())

    if (!user) {
      console.log("[v0] User not found for email:", email)
      return { success: false, error: "Invalid email or password" }
    }

    // Check password
    const passwords = getFromStorage<Record<string, string>>(STORAGE_KEYS.PASSWORDS, {})
    console.log("[v0] Checking password for user:", user.id)
    console.log("[v0] Stored password:", passwords[user.id])
    console.log("[v0] Provided password:", password)

    if (passwords[user.id] !== password) {
      console.log("[v0] Password mismatch for user:", user.id)
      return { success: false, error: "Invalid email or password" }
    }

    // Update last login time
    user.lastLoginAt = new Date().toISOString()
    this.saveUsers(users)

    // Set current user
    setToStorage(STORAGE_KEYS.CURRENT_USER, user)

    console.log("[v0] Login successful for:", user.email)
    return { success: true, user }
  }

  static getCurrentUser(): User | null {
    return getFromStorage<User | null>(STORAGE_KEYS.CURRENT_USER, null)
  }

  static logoutUser(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
  }

  static async updateUser(
    id: string,
    updates: Partial<Omit<User, "id" | "createdAt">>,
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    const users = this.getUsers()
    const userIndex = users.findIndex((u) => u.id === id)

    if (userIndex === -1) {
      return { success: false, error: "User not found" }
    }

    const updatedUser = {
      ...users[userIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    users[userIndex] = updatedUser
    this.saveUsers(users)

    // Update current user if it's the same user
    const currentUser = this.getCurrentUser()
    if (currentUser && currentUser.id === id) {
      setToStorage(STORAGE_KEYS.CURRENT_USER, updatedUser)
    }

    return { success: true, user: updatedUser }
  }

  // Meal operations
  static getMeals(): Meal[] {
    return getFromStorage<Meal[]>(STORAGE_KEYS.MEALS, [])
  }

  static saveMeals(meals: Meal[]): void {
    setToStorage(STORAGE_KEYS.MEALS, meals)
  }

  static async createMeal(
    mealData: Omit<Meal, "id" | "createdAt">,
  ): Promise<{ success: boolean; meal?: Meal; error?: string }> {
    const meals = this.getMeals()

    const newMeal: Meal = {
      id: uuidv4(),
      ...mealData,
      createdAt: new Date().toISOString(),
    }

    meals.push(newMeal)
    this.saveMeals(meals)

    // Update user stats
    this.updateUserStatsAfterMeal(mealData.userId, newMeal)

    return { success: true, meal: newMeal }
  }

  static getUserMeals(userId: string, startDate?: string, endDate?: string): Meal[] {
    const meals = this.getMeals()
    let userMeals = meals.filter((m) => m.userId === userId)

    if (startDate) {
      userMeals = userMeals.filter((m) => m.date >= startDate)
    }

    if (endDate) {
      userMeals = userMeals.filter((m) => m.date <= endDate)
    }

    return userMeals.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  static getMealsByDate(userId: string, date: string): Meal[] {
    const meals = this.getMeals()
    return meals.filter((m) => m.userId === userId && m.date === date)
  }

  static async deleteMeal(id: string, userId: string): Promise<{ success: boolean; error?: string }> {
    const meals = this.getMeals()
    const mealIndex = meals.findIndex((m) => m.id === id && m.userId === userId)

    if (mealIndex === -1) {
      return { success: false, error: "Meal not found" }
    }

    meals.splice(mealIndex, 1)
    this.saveMeals(meals)

    // Update user stats
    this.recalculateUserStats(userId)

    return { success: true }
  }

  // Profile operations
  static getProfiles(): UserProfile[] {
    return getFromStorage<UserProfile[]>(STORAGE_KEYS.PROFILES, [])
  }

  static saveProfiles(profiles: UserProfile[]): void {
    setToStorage(STORAGE_KEYS.PROFILES, profiles)
  }

  static getUserProfile(userId: string): UserProfile | null {
    const profiles = this.getProfiles()
    return profiles.find((p) => p.userId === userId) || null
  }

  static async updateUserProfile(
    userId: string,
    profileData: Omit<UserProfile, "userId" | "updatedAt">,
  ): Promise<{ success: boolean; profile?: UserProfile; error?: string }> {
    const profiles = this.getProfiles()
    const profileIndex = profiles.findIndex((p) => p.userId === userId)

    const updatedProfile: UserProfile = {
      userId,
      ...profileData,
      updatedAt: new Date().toISOString(),
    }

    if (profileIndex === -1) {
      profiles.push(updatedProfile)
    } else {
      profiles[profileIndex] = updatedProfile
    }

    this.saveProfiles(profiles)
    return { success: true, profile: updatedProfile }
  }

  // User Stats operations
  static getUserStats(): UserStats[] {
    return getFromStorage<UserStats[]>(STORAGE_KEYS.USER_STATS, [])
  }

  static saveUserStats(stats: UserStats[]): void {
    setToStorage(STORAGE_KEYS.USER_STATS, stats)
  }

  static getUserStatsById(userId: string): UserStats | null {
    const stats = this.getUserStats()
    return stats.find((s) => s.userId === userId) || null
  }

  static updateUserStatsAfterMeal(userId: string, meal: Meal): void {
    const allStats = this.getUserStats()
    const userStatsIndex = allStats.findIndex((s) => s.userId === userId)

    if (userStatsIndex === -1) return

    const userStats = allStats[userStatsIndex]
    userStats.totalMealsLogged += 1

    // Recalculate average daily calories
    const userMeals = this.getUserMeals(userId)
    const totalCalories = userMeals.reduce((sum, m) => sum + m.totalNutrition.calories, 0)
    const uniqueDays = new Set(userMeals.map((m) => m.date)).size
    userStats.averageDailyCalories = uniqueDays > 0 ? totalCalories / uniqueDays : 0

    // Update favorite food (most logged food)
    const foodCounts: Record<string, number> = {}
    userMeals.forEach((m) => {
      m.foods.forEach((f) => {
        foodCounts[f.name] = (foodCounts[f.name] || 0) + 1
      })
    })
    const mostLoggedFood = Object.entries(foodCounts).sort(([, a], [, b]) => b - a)[0]
    if (mostLoggedFood) {
      userStats.favoriteFood = mostLoggedFood[0]
    }

    // Update streaks
    const sortedDates = [...new Set(userMeals.map((m) => m.date))].sort()
    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 1

    for (let i = sortedDates.length - 1; i >= 0; i--) {
      const currentDate = new Date(sortedDates[i])
      const expectedDate = new Date()
      expectedDate.setDate(expectedDate.getDate() - (sortedDates.length - 1 - i))

      if (currentDate.toDateString() === expectedDate.toDateString()) {
        currentStreak = tempStreak
        tempStreak++
      } else {
        break
      }
    }

    // Calculate longest streak
    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i - 1])
      const currDate = new Date(sortedDates[i])
      const diffTime = currDate.getTime() - prevDate.getTime()
      const diffDays = diffTime / (1000 * 60 * 60 * 24)

      if (diffDays === 1) {
        tempStreak++
      } else {
        longestStreak = Math.max(longestStreak, tempStreak)
        tempStreak = 1
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak)

    userStats.currentStreak = currentStreak
    userStats.longestStreak = Math.max(userStats.longestStreak, longestStreak)
    userStats.lastUpdated = new Date().toISOString()

    // Add achievements
    if (userStats.totalMealsLogged === 1 && !userStats.achievements.includes("First Meal Logged")) {
      userStats.achievements.push("First Meal Logged")
    }
    if (userStats.totalMealsLogged === 10 && !userStats.achievements.includes("Consistent Logger")) {
      userStats.achievements.push("Consistent Logger")
    }
    if (userStats.currentStreak >= 7 && !userStats.achievements.includes("Week Warrior")) {
      userStats.achievements.push("Week Warrior")
    }
    if (userStats.longestStreak >= 30 && !userStats.achievements.includes("Monthly Master")) {
      userStats.achievements.push("Monthly Master")
    }

    allStats[userStatsIndex] = userStats
    this.saveUserStats(allStats)
  }

  static recalculateUserStats(userId: string): void {
    const userMeals = this.getUserMeals(userId)
    const allStats = this.getUserStats()
    const userStatsIndex = allStats.findIndex((s) => s.userId === userId)

    if (userStatsIndex === -1) return

    const userStats = allStats[userStatsIndex]
    userStats.totalMealsLogged = userMeals.length

    // Recalculate everything
    if (userMeals.length > 0) {
      const totalCalories = userMeals.reduce((sum, m) => sum + m.totalNutrition.calories, 0)
      const uniqueDays = new Set(userMeals.map((m) => m.date)).size
      userStats.averageDailyCalories = uniqueDays > 0 ? totalCalories / uniqueDays : 0

      // Recalculate favorite food
      const foodCounts: Record<string, number> = {}
      userMeals.forEach((m) => {
        m.foods.forEach((f) => {
          foodCounts[f.name] = (foodCounts[f.name] || 0) + 1
        })
      })
      const mostLoggedFood = Object.entries(foodCounts).sort(([, a], [, b]) => b - a)[0]
      userStats.favoriteFood = mostLoggedFood ? mostLoggedFood[0] : "Not determined yet"
    } else {
      userStats.averageDailyCalories = 0
      userStats.favoriteFood = "Not determined yet"
      userStats.currentStreak = 0
    }

    userStats.lastUpdated = new Date().toISOString()
    allStats[userStatsIndex] = userStats
    this.saveUserStats(allStats)
  }

  // Data export/import
  static exportUserData(userId: string): string {
    const user = this.getCurrentUser()
    const meals = this.getUserMeals(userId)
    const profile = this.getUserProfile(userId)
    const stats = this.getUserStatsById(userId)

    const exportData = {
      user,
      meals,
      profile,
      stats,
      exportDate: new Date().toISOString(),
    }

    return JSON.stringify(exportData, null, 2)
  }

  static async importUserData(jsonData: string): Promise<{ success: boolean; error?: string }> {
    try {
      const data = JSON.parse(jsonData)

      if (data.user) {
        const users = this.getUsers()
        const existingIndex = users.findIndex((u) => u.id === data.user.id)

        if (existingIndex >= 0) {
          users[existingIndex] = data.user
        } else {
          users.push(data.user)
        }

        this.saveUsers(users)
      }

      if (data.meals && Array.isArray(data.meals)) {
        const allMeals = this.getMeals()
        const existingMealIds = new Set(allMeals.map((m) => m.id))

        const newMeals = data.meals.filter((meal: Meal) => !existingMealIds.has(meal.id))
        this.saveMeals([...allMeals, ...newMeals])
      }

      if (data.profile) {
        const profiles = this.getProfiles()
        const profileIndex = profiles.findIndex((p) => p.userId === data.profile.userId)

        if (profileIndex >= 0) {
          profiles[profileIndex] = data.profile
        } else {
          profiles.push(data.profile)
        }

        this.saveProfiles(profiles)
      }

      if (data.stats) {
        const allStats = this.getUserStats()
        const statsIndex = allStats.findIndex((s) => s.userId === data.stats.userId)

        if (statsIndex >= 0) {
          allStats[statsIndex] = data.stats
        } else {
          allStats.push(data.stats)
        }

        this.saveUserStats(allStats)
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: "Invalid data format" }
    }
  }

  // Get app statistics
  static getAppStats() {
    const users = this.getUsers()
    const meals = this.getMeals()
    const profiles = this.getProfiles()

    return {
      totalUsers: users.length,
      totalMeals: meals.length,
      totalProfiles: profiles.length,
      activeUsers: users.filter((u) => {
        const lastLogin = new Date(u.lastLoginAt)
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        return lastLogin > weekAgo
      }).length,
    }
  }

  // Clear all data (for testing/reset)
  static clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key)
    })
  }

  // Sleep operations
  static getSleepEntries(): SleepEntry[] {
    return getFromStorage<SleepEntry[]>(STORAGE_KEYS.SLEEP_ENTRIES, [])
  }

  static saveSleepEntries(entries: SleepEntry[]): void {
    setToStorage(STORAGE_KEYS.SLEEP_ENTRIES, entries)
  }

  static getUserSleepEntries(userId: string, startDate?: string, endDate?: string): SleepEntry[] {
    const entries = this.getSleepEntries()
    let userEntries = entries.filter((e) => e.userId === userId)

    if (startDate) {
      userEntries = userEntries.filter((e) => e.date >= startDate)
    }

    if (endDate) {
      userEntries = userEntries.filter((e) => e.date <= endDate)
    }

    return userEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  static async createSleepEntry(
    entryData: Omit<SleepEntry, "id" | "createdAt">,
  ): Promise<{ success: boolean; entry?: SleepEntry; error?: string }> {
    const entries = this.getSleepEntries()

    // Check if entry already exists for this date
    const existingIndex = entries.findIndex((e) => e.userId === entryData.userId && e.date === entryData.date)

    const newEntry: SleepEntry = {
      id: existingIndex >= 0 ? entries[existingIndex].id : `sleep_${Date.now()}`,
      ...entryData,
      createdAt: existingIndex >= 0 ? entries[existingIndex].createdAt : new Date().toISOString(),
    }

    if (existingIndex >= 0) {
      entries[existingIndex] = newEntry
    } else {
      entries.push(newEntry)
    }

    this.saveSleepEntries(entries)
    return { success: true, entry: newEntry }
  }
}
