"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Star, Heart } from "lucide-react"

interface RatingDialogProps {
  isOpen: boolean
  onClose: () => void
  userId: string
}

export default function RatingDialog({ isOpen, onClose, userId }: RatingDialogProps) {
  const [showThankYou, setShowThankYou] = useState(false)

  useEffect(() => {
    // Check if user just returned from rating
    const urlParams = new URLSearchParams(window.location.search)
    const fromRating = urlParams.get("from_rating")

    if (fromRating === "true") {
      setShowThankYou(true)
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname)

      // Auto close after showing thank you
      setTimeout(() => {
        handleRated()
      }, 3000)
    }
  }, [])

  const handleRateApp = () => {
    // Mark as rated in localStorage
    localStorage.setItem(`app_rated_${userId}`, "true")

    // Redirect to Google Forms with return URL
    const returnUrl = encodeURIComponent(`${window.location.origin}?from_rating=true`)
    const formsUrl = `https://docs.google.com/forms/d/e/1FAIpQLSdMOYA5vqqvMsUTUOwDd3O1cT9yb3YhXauSX59h0MGZF6tMfw/viewform?entry.return_url=${returnUrl}`

    window.open(formsUrl, "_blank")
    onClose()
  }

  const handleRated = () => {
    // Mark as rated in localStorage
    localStorage.setItem(`app_rated_${userId}`, "true")
    onClose()
  }

  const handleMaybeLater = () => {
    onClose()
  }

  if (showThankYou) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Heart className="h-12 w-12 text-red-500 fill-current" />
            </div>
            <DialogTitle className="text-2xl font-bold text-green-700">Thank You!</DialogTitle>
            <DialogDescription className="text-lg text-gray-600">
              We really appreciate you taking the time to rate GluGuide. Your feedback helps us make the app better for
              everyone!
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-6">
            <Button onClick={handleRated} className="bg-green-600 hover:bg-green-700 text-white px-8">
              Continue to App
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-6 w-6 text-yellow-400 fill-current" />
              ))}
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold text-green-700">Enjoying GluGuide?</DialogTitle>
          <DialogDescription className="text-gray-600">
            Help us improve by sharing your experience! Your feedback means the world to us and helps other users
            discover our nutrition monitoring app.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-6">
          <Button
            onClick={handleRateApp}
            className="bg-green-600 hover:bg-green-700 text-white h-12 text-base font-semibold"
          >
            Yes, Rate GluGuide
          </Button>
          <Button
            variant="outline"
            onClick={handleMaybeLater}
            className="h-12 text-base border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
          >
            Maybe Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
