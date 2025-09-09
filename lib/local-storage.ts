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
} as const

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
  // Initialize with demo data and personalized content
  static initialize(): void {
    if (this.isInitialized()) {
      return
    }

    // Create basic demo users without meal data
    const demoUsers: User[] = [
      {
        id: uuidv4(),
        email: "test@naijafit.com",
        fullName: "Adunni Okafor",
        age: 28,
        gender: "female",
        height: 165,
        weight: 68,
        location: "Lagos, Nigeria",
        occupation: "Software Developer",
        healthConditions: [],
        fitnessGoals: ["weight_maintenance", "muscle_building"],
        role: "user",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      },
    ]

    // Save demo users
    setToStorage(STORAGE_KEYS.USERS, demoUsers)

    // Create basic user profiles without food preferences
    const demoProfiles: UserProfile[] = [
      {
        userId: demoUsers[0].id,
        preferences: {
          culturalBackground: ["yoruba", "general-nigerian"],
          dietaryRestrictions: [],
          activityLevel: "moderate",
          healthGoals: ["balanced", "muscle-gain"],
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
            breakfast: "07:30",
            lunch: "12:30",
            dinner: "19:00",
          },
          weeklyGoals: {
            calorieTarget: 2000,
            proteinTarget: 120,
            exerciseDays: 4,
          },
        },
        personalizedRecommendations: {
          suggestedFoods: [],
          avoidFoods: [],
          mealPlanPreferences: "balanced_nigerian",
          supplementSuggestions: [],
        },
        updatedAt: new Date().toISOString(),
      },
    ]

    setToStorage(STORAGE_KEYS.PROFILES, demoProfiles)

    setToStorage(STORAGE_KEYS.MEALS, [])

    // Mark as initialized
    setToStorage(STORAGE_KEYS.INITIALIZED, true)
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
    const users = this.getUsers()
    const user = users.find((u) => u.email === email.toLowerCase())

    if (!user) {
      return { success: false, error: "Invalid email or password" }
    }

    // Check password
    const passwords = getFromStorage<Record<string, string>>(STORAGE_KEYS.PASSWORDS, {})
    if (passwords[user.id] !== password) {
      return { success: false, error: "Invalid email or password" }
    }

    // Update last login time
    user.lastLoginAt = new Date().toISOString()
    this.saveUsers(users)

    // Set current user
    setToStorage(STORAGE_KEYS.CURRENT_USER, user)

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
}
