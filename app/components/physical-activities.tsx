"use client"
import { useAuth } from "../contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

interface ActivityEntry {
  id: string
  userId: string
  date: string
  activityType: string
  duration: number // in minutes
  intensity: "light" | "moderate" | "vigorous"
  caloriesBurned: number
  notes?: string
  createdAt: string
}

const activityTypes = [
  {
    name: "Drawing Water",
    caloriesPerMinute: { light: 3, moderate: 5, vigorous: 7 },
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/file_1.PNG-hQIIxT5RenhxVXkJ95C0trdberZN6b.png",
    description: "Fetching water from well or storage",
  },
  {
    name: "Walking",
    caloriesPerMinute: { light: 3, moderate: 4, vigorous: 5 },
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/file_2.PNG-GPkiI37cW37NOsQGo7OR3knAijtVsx.png",
    description: "Walking for transportation or exercise",
  },
  {
    name: "Car Wash",
    caloriesPerMinute: { light: 3, moderate: 5, vigorous: 6 },
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/file_3.PNG-oHY8wJHBxoHkdiIPQlKy5u95O6XTKu.png",
    description: "Washing and cleaning vehicles",
  },
  {
    name: "Cleaning Outside",
    caloriesPerMinute: { light: 3, moderate: 4, vigorous: 5 },
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/file_4.PNG-ZRG7q14MbPt7JcAXaOuwXOLcxCch11.png",
    description: "Sweeping and cleaning outdoor areas",
  },
  {
    name: "Cleaning House",
    caloriesPerMinute: { light: 2, moderate: 4, vigorous: 5 },
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/file_5.PNG-MLSXWWfvr8MazdHU2Bc0e1olAIzrv6.png",
    description: "Mopping and cleaning indoor spaces",
  },
  {
    name: "Outdoor House Work",
    caloriesPerMinute: { light: 4, moderate: 6, vigorous: 8 },
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/file_6.PNG-coJrVC32qFqKq6h32WeUYEZE5tHw6j.png",
    description: "General outdoor household chores",
  },
]

export default function PhysicalActivities() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Activity Types Display */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base xs:text-lg">Activity Types</CardTitle>
          <CardDescription className="text-xs xs:text-sm">
            Common physical activities and household work
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {activityTypes.map((activity) => (
              <div
                key={activity.name}
                className="rounded-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="relative aspect-square">
                  <Image src={activity.image || "/placeholder.svg"} alt={activity.name} fill className="object-cover" />
                </div>
                <div className="p-2 bg-background">
                  <div className="font-medium text-xs text-center">{activity.name}</div>
                  <div className="text-[10px] text-muted-foreground text-center mt-0.5">{activity.description}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base xs:text-lg">Activity Tips</CardTitle>
          <CardDescription className="text-xs xs:text-sm">Recommendations for staying active</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-1.5 flex-shrink-0" />
              <p className="text-xs xs:text-sm">
                Household activities like drawing water, cleaning, and washing contribute significantly to your daily
                calorie burn.
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-1.5 flex-shrink-0" />
              <p className="text-xs xs:text-sm">
                Walking for 30 minutes daily can help maintain a healthy weight and improve cardiovascular health.
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-1.5 flex-shrink-0" />
              <p className="text-xs xs:text-sm">
                Break up long periods of sitting with short activity breaks throughout the day.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
