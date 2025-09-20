export interface BMIResult {
  bmi: number
  category: "Underweight" | "Normal" | "Overweight" | "Obese"
  description: string
  recommendations: string[]
}

export interface WaistToHeightResult {
  ratio: number
  category: "Healthy" | "Increased Risk" | "High Risk"
  description: string
  recommendations: string[]
}

export function calculateBMI(weight: number, height: number): BMIResult {
  const heightInMeters = height / 100
  const bmi = weight / (heightInMeters * heightInMeters)

  let category: BMIResult["category"]
  let description: string
  let recommendations: string[]

  if (bmi < 18.5) {
    category = "Underweight"
    description = "You are underweight. Focus on gaining healthy weight through nutritious foods."
    recommendations = [
      "Increase calorie intake with healthy Nigerian foods like Moi Moi and nuts",
      "Add protein-rich foods like fish, chicken, and beans to your meals",
      "Include healthy fats from palm oil, groundnuts, and avocados",
      "Eat frequent small meals throughout the day",
      "Consider adding Akamu (pap) with milk for extra calories",
    ]
  } else if (bmi >= 18.5 && bmi < 25) {
    category = "Normal"
    description = "You have a healthy weight. Maintain your current lifestyle with balanced nutrition."
    recommendations = [
      "Continue eating a balanced diet with variety of Nigerian foods",
      "Maintain regular physical activity",
      "Include plenty of vegetables like Ugwu and waterleaf",
      "Keep portion sizes moderate",
      "Stay hydrated and limit processed foods",
    ]
  } else if (bmi >= 25 && bmi < 30) {
    category = "Overweight"
    description = "You are overweight. Focus on gradual weight loss through diet and exercise."
    recommendations = [
      "Reduce portion sizes, especially of starchy foods like rice and yam",
      "Choose grilled or boiled foods over fried options",
      "Increase vegetable intake with soups like Efo Riro",
      "Limit high-calorie foods like fried plantain and reduce oil usage",
      "Include more fiber-rich foods like beans and vegetables",
    ]
  } else {
    category = "Obese"
    description = "You are obese. Consult a healthcare provider for a comprehensive weight management plan."
    recommendations = [
      "Significantly reduce calorie intake under medical supervision",
      "Focus on lean proteins like grilled fish and chicken",
      "Prioritize vegetables and limit starchy staples",
      "Avoid fried foods and reduce oil consumption",
      "Consider professional nutritional counseling",
    ]
  }

  return {
    bmi: Number(bmi.toFixed(1)),
    category,
    description,
    recommendations,
  }
}

export function calculateWaistToHeightRatio(waistCircumference: number, height: number): WaistToHeightResult {
  const ratio = waistCircumference / height

  let category: WaistToHeightResult["category"]
  let description: string
  let recommendations: string[]

  if (ratio < 0.5) {
    category = "Healthy"
    description = "Your waist-to-height ratio indicates a healthy distribution of body fat."
    recommendations = [
      "Maintain your current healthy lifestyle",
      "Continue regular physical activity",
      "Keep eating a balanced Nigerian diet",
      "Monitor your measurements regularly",
    ]
  } else if (ratio >= 0.5 && ratio < 0.6) {
    category = "Increased Risk"
    description = "Your waist-to-height ratio suggests increased health risks. Consider lifestyle changes."
    recommendations = [
      "Focus on reducing abdominal fat through exercise",
      "Increase fiber intake with vegetables and beans",
      "Reduce refined carbohydrates and sugary foods",
      "Include more physical activity in your daily routine",
      "Consider strength training exercises",
    ]
  } else {
    category = "High Risk"
    description = "Your waist-to-height ratio indicates high health risks. Consult a healthcare provider."
    recommendations = [
      "Seek professional medical advice immediately",
      "Focus on significant lifestyle changes",
      "Prioritize cardiovascular exercise",
      "Drastically reduce processed foods and sugar",
      "Consider working with a nutritionist",
    ]
  }

  return {
    ratio: Number(ratio.toFixed(2)),
    category,
    description,
    recommendations,
  }
}

export function calculateEnhancedHealthMetrics(
  weight: number,
  height: number,
  waistCircumference?: number,
): {
  bmi: BMIResult
  waistToHeight?: WaistToHeightResult
  overallRisk: "Low" | "Moderate" | "High" | "Very High"
  combinedRecommendations: string[]
} {
  const bmi = calculateBMI(weight, height)
  const waistToHeight = waistCircumference ? calculateWaistToHeightRatio(waistCircumference, height) : undefined

  // Determine overall risk based on both BMI and waist-to-height ratio
  let overallRisk: "Low" | "Moderate" | "High" | "Very High" = "Low"

  if (bmi.category === "Normal" && (!waistToHeight || waistToHeight.category === "Healthy")) {
    overallRisk = "Low"
  } else if (
    (bmi.category === "Normal" && waistToHeight?.category === "Increased Risk") ||
    (bmi.category === "Overweight" && (!waistToHeight || waistToHeight.category === "Healthy"))
  ) {
    overallRisk = "Moderate"
  } else if (
    (bmi.category === "Overweight" && waistToHeight?.category === "Increased Risk") ||
    (bmi.category === "Obese" && (!waistToHeight || waistToHeight.category === "Healthy")) ||
    (bmi.category === "Normal" && waistToHeight?.category === "High Risk")
  ) {
    overallRisk = "High"
  } else {
    overallRisk = "Very High"
  }

  // Combine recommendations from both metrics
  const combinedRecommendations = [
    ...bmi.recommendations.slice(0, 3),
    ...(waistToHeight?.recommendations.slice(0, 2) || []),
  ]

  return {
    bmi,
    waistToHeight,
    overallRisk,
    combinedRecommendations,
  }
}

export interface NutritionCalculation {
  calories: number
  protein: number
  carbs: number
  fats: number
  fiber: number
  iron: number
  vitaminA: number
}

export function calculateNutrition(
  caloriesPer100g: number,
  proteinPer100g: number,
  carbsPer100g: number,
  fatsPer100g: number,
  fiberPer100g: number,
  ironPer100g: number,
  vitaminAPer100g: number,
  grams: number,
): NutritionCalculation {
  const multiplier = grams / 100

  return {
    calories: Number((caloriesPer100g * multiplier).toFixed(1)),
    protein: Number((proteinPer100g * multiplier).toFixed(1)),
    carbs: Number((carbsPer100g * multiplier).toFixed(1)),
    fats: Number((fatsPer100g * multiplier).toFixed(1)),
    fiber: Number((fiberPer100g * multiplier).toFixed(1)),
    iron: Number((ironPer100g * multiplier).toFixed(2)),
    vitaminA: Number((vitaminAPer100g * multiplier).toFixed(1)),
  }
}

export function getDailyCalorieRecommendation(
  age: number,
  gender: "male" | "female" | "other",
  weight: number,
  height: number,
  activityLevel: "sedentary" | "light" | "moderate" | "active" = "moderate",
): number {
  // Using Mifflin-St Jeor Equation
  let bmr: number

  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161
  }

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
  }

  return Math.round(bmr * activityMultipliers[activityLevel])
}

export function analyzeNutritionIntake(
  totalCalories: number,
  recommendedCalories: number,
  bmiCategory: string,
): {
  status: "low" | "normal" | "high"
  message: string
  color: string
} {
  const percentage = (totalCalories / recommendedCalories) * 100

  if (bmiCategory === "Underweight") {
    if (percentage < 90) {
      return {
        status: "low",
        message: "Your calorie intake is too low. Try to eat more nutritious foods.",
        color: "text-red-600",
      }
    } else if (percentage > 110) {
      return {
        status: "normal",
        message: "Good calorie intake for healthy weight gain!",
        color: "text-green-600",
      }
    }
  } else if (bmiCategory === "Overweight" || bmiCategory === "Obese") {
    if (percentage > 110) {
      return {
        status: "high",
        message: "Your calorie intake is too high. Consider reducing portion sizes.",
        color: "text-red-600",
      }
    } else if (percentage < 80) {
      return {
        status: "normal",
        message: "Good calorie control for weight management!",
        color: "text-green-600",
      }
    }
  } else {
    if (percentage < 80 || percentage > 120) {
      return {
        status: percentage < 80 ? "low" : "high",
        message:
          percentage < 80 ? "Consider eating more to meet your energy needs." : "Consider reducing portion sizes.",
        color: "text-orange-600",
      }
    }
  }

  return {
    status: "normal",
    message: "Your calorie intake looks balanced!",
    color: "text-green-600",
  }
}
