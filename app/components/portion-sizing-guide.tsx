"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Hand, Eye } from "lucide-react"

interface PortionSize {
  id: string
  foodType: string
  handMethod: string
  imagePlaceholder: string
}

const portionSizes: PortionSize[] = [
  {
    id: "small-portion",
    foodType: "Small Portion",
    handMethod: "Cupped palm",
    imagePlaceholder: "ADD_SMALL_PORTION_IMAGE_HERE",
  },
  {
    id: "medium-portion",
    foodType: "Medium Portion",
    handMethod: "Closed fist",
    imagePlaceholder: "ADD_MEDIUM_PORTION_IMAGE_HERE",
  },
  {
    id: "large-portion",
    foodType: "Large Portion",
    handMethod: "Two cupped palms",
    imagePlaceholder: "ADD_LARGE_PORTION_IMAGE_HERE",
  },
]

export default function PortionSizingGuide() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hand className="h-5 w-5 text-blue-600" />
            Grains & Swallows Portion Guide
          </CardTitle>
          <CardDescription>
            Learn to estimate proper portion sizes for grains and swallows using your hands
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {portionSizes.map((portion) => (
              <Card key={portion.id} className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-center">{portion.foodType}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-square bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center p-6 text-center">
                    <Eye className="h-12 w-12 text-muted-foreground/50 mb-3" />
                    <p className="text-sm text-muted-foreground font-medium">{portion.imagePlaceholder}</p>
                    <p className="text-xs text-muted-foreground/70 mt-2">Add your fist sizing image here</p>
                  </div>

                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <Hand className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-sm">Hand Method</span>
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">{portion.handMethod}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">How to Add Your Portion Images</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Replace the placeholder text in each card with actual images showing the hand sizing methods for your
              grains and swallows portions.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
