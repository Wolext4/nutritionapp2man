"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dumbbell, Flame } from "lucide-react"
import Image from "next/image"

interface Activity {
  id: string
  name: string
  image: string
  description: string
  caloriesPerHour: number
  intensity: "light" | "moderate" | "vigorous"
}

const activities: Activity[] = [
  {
    id: "drawing-water",
    name: "Drawing Water",
    image: "/images/activities/drawing-water.png",
    description: "Fetching water from wells or large containers, a common daily activity",
    caloriesPerHour: 180,
    intensity: "moderate",
  },
  {
    id: "walking",
    name: "Walking",
    image: "/images/activities/walking.png",
    description: "Regular walking for transportation or leisure",
    caloriesPerHour: 150,
    intensity: "light",
  },
  {
    id: "car-wash",
    name: "Car Wash",
    image: "/images/activities/car-wash.png",
    description: "Washing and cleaning vehicles manually",
    caloriesPerHour: 200,
    intensity: "moderate",
  },
  {
    id: "cleaning-outside",
    name: "Cleaning Outside",
    image: "/images/activities/cleaning-outside.png",
    description: "Sweeping and cleaning outdoor areas",
    caloriesPerHour: 170,
    intensity: "moderate",
  },
  {
    id: "cleaning-house",
    name: "Cleaning House",
    image: "/images/activities/cleaning-house.png",
    description: "Indoor housework including mopping and tidying",
    caloriesPerHour: 160,
    intensity: "light",
  },
  {
    id: "outdoor-house-work",
    name: "Outdoor House Work",
    image: "/images/activities/outdoor-house-work.png",
    description: "Various outdoor household tasks and maintenance",
    caloriesPerHour: 220,
    intensity: "vigorous",
  },
]

const getIntensityColor = (intensity: string) => {
  switch (intensity) {
    case "light":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    case "moderate":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
    case "vigorous":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function PhysicalActivities() {
  return (
    <div className="space-y-3 xs:space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base xs:text-lg flex items-center gap-2">
            <Dumbbell className="h-4 w-4 xs:h-5 xs:w-5 text-green-600" />
            Physical Activities
          </CardTitle>
          <CardDescription className="text-xs xs:text-sm">
            Common daily activities and their estimated calorie burn rates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4">
            {activities.map((activity) => (
              <Card key={activity.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative w-full h-72 xs:h-80 bg-muted">
                  <Image
                    src={activity.image || "/placeholder.svg"}
                    alt={activity.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority={activity.id === "walking"}
                  />
                </div>
                <CardHeader className="pb-2 xs:pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-sm xs:text-base font-semibold leading-tight">{activity.name}</CardTitle>
                    <Badge className={`text-[10px] xs:text-xs shrink-0 ${getIntensityColor(activity.intensity)}`}>
                      {activity.intensity}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-xs xs:text-sm text-muted-foreground">{activity.description}</p>
                  <div className="flex items-center gap-1 xs:gap-2 text-xs xs:text-sm font-semibold text-orange-600">
                    <Flame className="h-3 w-3 xs:h-4 xs:w-4" />
                    <span>{activity.caloriesPerHour} cal/hour</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm xs:text-base">Activity Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 xs:space-y-3">
            <div className="flex items-start gap-2 xs:gap-3 p-2 xs:p-3 bg-muted/50 rounded-lg">
              <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 bg-green-600 rounded-full mt-1.5 xs:mt-2 flex-shrink-0" />
              <p className="text-xs xs:text-sm">
                Incorporate these daily activities into your routine to increase your overall physical activity level
              </p>
            </div>
            <div className="flex items-start gap-2 xs:gap-3 p-2 xs:p-3 bg-muted/50 rounded-lg">
              <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 bg-green-600 rounded-full mt-1.5 xs:mt-2 flex-shrink-0" />
              <p className="text-xs xs:text-sm">
                Calorie burn estimates are based on average body weight and may vary by individual
              </p>
            </div>
            <div className="flex items-start gap-2 xs:gap-3 p-2 xs:p-3 bg-muted/50 rounded-lg">
              <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 bg-green-600 rounded-full mt-1.5 xs:mt-2 flex-shrink-0" />
              <p className="text-xs xs:text-sm">
                Aim for at least 150 minutes of moderate-intensity activity per week for optimal health
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
