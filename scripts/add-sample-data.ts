import { LocalDatabase } from "../lib/local-storage"

// Add sample meal data for the demo user
const addSampleData = () => {
  // Initialize the database first
  LocalDatabase.initialize()

  const users = LocalDatabase.getUsers()
  const demoUser = users.find((u) => u.email === "test@naijafit.com")

  if (!demoUser) {
    console.log("Demo user not found")
    return
  }

  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const sampleMeals = [
    {
      userId: demoUser.id,
      type: "breakfast" as const,
      date: today.toISOString().split("T")[0],
      time: "08:00",
      foods: [
        {
          id: "1",
          name: "Akamu (Pap) with Milk",
          grams: 250,
          nutrition: {
            calories: 180,
            protein: 8,
            carbs: 32,
            fats: 3,
            fiber: 2,
            iron: 1.2,
            vitaminA: 150,
          },
        },
        {
          id: "2",
          name: "Fried Plantain",
          grams: 100,
          nutrition: {
            calories: 158,
            protein: 1.3,
            carbs: 40,
            fats: 0.4,
            fiber: 2.3,
            iron: 0.6,
            vitaminA: 1127,
          },
        },
      ],
      totalNutrition: {
        calories: 338,
        protein: 9.3,
        carbs: 72,
        fats: 3.4,
        fiber: 4.3,
        iron: 1.8,
        vitaminA: 1277,
      },
      mood: "good" as const,
      notes: "Traditional Nigerian breakfast",
    },
    {
      userId: demoUser.id,
      type: "lunch" as const,
      date: today.toISOString().split("T")[0],
      time: "13:30",
      foods: [
        {
          id: "3",
          name: "Jollof Rice",
          grams: 200,
          nutrition: {
            calories: 292,
            protein: 6,
            carbs: 58,
            fats: 4,
            fiber: 1.8,
            iron: 2.1,
            vitaminA: 420,
          },
        },
        {
          id: "4",
          name: "Grilled Chicken",
          grams: 120,
          nutrition: {
            calories: 231,
            protein: 43,
            carbs: 0,
            fats: 5,
            fiber: 0,
            iron: 1.3,
            vitaminA: 48,
          },
        },
        {
          id: "5",
          name: "Coleslaw",
          grams: 80,
          nutrition: {
            calories: 41,
            protein: 1,
            carbs: 9,
            fats: 0.1,
            fiber: 2.5,
            iron: 0.4,
            vitaminA: 316,
          },
        },
      ],
      totalNutrition: {
        calories: 564,
        protein: 50,
        carbs: 67,
        fats: 9.1,
        fiber: 4.3,
        iron: 3.8,
        vitaminA: 784,
      },
      mood: "great" as const,
      notes: "Delicious lunch with friends",
    },
    {
      userId: demoUser.id,
      type: "dinner" as const,
      date: yesterday.toISOString().split("T")[0],
      time: "19:00",
      foods: [
        {
          id: "6",
          name: "Pounded Yam",
          grams: 150,
          nutrition: {
            calories: 188,
            protein: 2.3,
            carbs: 47,
            fats: 0.2,
            fiber: 4.1,
            iron: 0.8,
            vitaminA: 138,
          },
        },
        {
          id: "7",
          name: "Egusi Soup",
          grams: 200,
          nutrition: {
            calories: 298,
            protein: 18,
            carbs: 12,
            fats: 22,
            fiber: 6,
            iron: 3.2,
            vitaminA: 892,
          },
        },
      ],
      totalNutrition: {
        calories: 486,
        protein: 20.3,
        carbs: 59,
        fats: 22.2,
        fiber: 10.1,
        iron: 4.0,
        vitaminA: 1030,
      },
      mood: "great" as const,
      notes: "Family dinner - homemade egusi",
    },
  ]

  // Add sample meals
  sampleMeals.forEach(async (mealData) => {
    await LocalDatabase.createMeal(mealData)
  })

  console.log("Sample data added successfully!")
}

// Run the script
addSampleData()
