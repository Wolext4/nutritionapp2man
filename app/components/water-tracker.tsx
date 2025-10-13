"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Droplets, Plus, Minus, CheckCircle, AlertCircle } from "lucide-react"
import { LocalDatabase } from "@/lib/local-storage"

interface WaterTrackerProps {
  onWaterLogged?: () => void
}

export default function WaterTracker({ onWaterLogged }: WaterTrackerProps = {}) {
  const { user } = useAuth()
  const [waterIntake, setWaterIntake] = useState(0)
  const [customAmount, setCustomAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const today = new Date().toISOString().split("T")[0]

  // Load today's water intake
  useEffect(() => {
    if (user) {
      loadTodaysWater()
    }
  }, [user])

  const loadTodaysWater = () => {
    const waterData = LocalDatabase.getWaterIntake(user!.id, today)
    setWaterIntake(waterData?.amount || 0)
  }

  const addWater = async (amount: number) => {
    if (!user) return

    setIsLoading(true)
    const newTotal = waterIntake + amount

    const result = await LocalDatabase.logWaterIntake({
      userId: user.id,
      date: today,
      amount: newTotal,
    })

    if (result.success) {
      setWaterIntake(newTotal)
      setMessage({ type: "success", text: `Added ${amount}ml of water!` })
      if (onWaterLogged) onWaterLogged()
    } else {
      setMessage({ type: "error", text: result.error || "Failed to log water" })
    }

    setIsLoading(false)
    setTimeout(() => setMessage(null), 2000)
  }

  const removeWater = async (amount: number) => {
    if (!user || waterIntake === 0) return

    setIsLoading(true)
    const newTotal = Math.max(0, waterIntake - amount)

    const result = await LocalDatabase.logWaterIntake({
      userId: user.id,
      date: today,
      amount: newTotal,
    })

    if (result.success) {
      setWaterIntake(newTotal)
      setMessage({ type: "success", text: `Removed ${amount}ml of water` })
      if (onWaterLogged) onWaterLogged()
    } else {
      setMessage({ type: "error", text: result.error || "Failed to update water" })
    }

    setIsLoading(false)
    setTimeout(() => setMessage(null), 2000)
  }

  const addCustomAmount = async () => {
    const amount = Number.parseInt(customAmount)
    if (isNaN(amount) || amount <= 0) {
      setMessage({ type: "error", text: "Please enter a valid amount" })
      setTimeout(() => setMessage(null), 2000)
      return
    }

    await addWater(amount)
    setCustomAmount("")
  }

  const recommendedIntake = 2000 // 2 liters recommended daily
  const progress = Math.min((waterIntake / recommendedIntake) * 100, 100)

  if (!user) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplets className="h-5 w-5 text-blue-600" />
          Water Intake Tracker
        </CardTitle>
        <CardDescription>Track your daily water consumption (Goal: {recommendedIntake}ml / 2L)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Display */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-blue-600">{waterIntake}ml</span>
            <span className="text-sm text-muted-foreground">{progress.toFixed(0)}% of goal</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-4">
            <div
              className="bg-blue-600 h-4 rounded-full transition-all flex items-center justify-end pr-2"
              style={{ width: `${progress}%` }}
            >
              {progress > 10 && <Droplets className="h-3 w-3 text-white" />}
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            {waterIntake >= recommendedIntake
              ? "Great job! You've reached your daily goal!"
              : `${recommendedIntake - waterIntake}ml more to reach your goal`}
          </p>
        </div>

        {/* Quick Add Buttons */}
        <div className="space-y-2">
          <Label>Quick Add</Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Button
              variant="outline"
              onClick={() => addWater(250)}
              disabled={isLoading}
              className="flex flex-col h-auto py-3"
            >
              <Droplets className="h-4 w-4 mb-1 text-blue-600" />
              <span className="text-xs">1 Cup</span>
              <span className="text-xs font-bold">250ml</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => addWater(500)}
              disabled={isLoading}
              className="flex flex-col h-auto py-3"
            >
              <Droplets className="h-4 w-4 mb-1 text-blue-600" />
              <span className="text-xs">1 Sachet</span>
              <span className="text-xs font-bold">500ml</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => addWater(750)}
              disabled={isLoading}
              className="flex flex-col h-auto py-3"
            >
              <Droplets className="h-4 w-4 mb-1 text-blue-600" />
              <span className="text-xs">1 Bottle</span>
              <span className="text-xs font-bold">750ml</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => addWater(1000)}
              disabled={isLoading}
              className="flex flex-col h-auto py-3"
            >
              <Droplets className="h-4 w-4 mb-1 text-blue-600" />
              <span className="text-xs">1 Liter</span>
              <span className="text-xs font-bold">1000ml</span>
            </Button>
          </div>
        </div>

        {/* Custom Amount */}
        <div className="space-y-2">
          <Label htmlFor="custom-water">Custom Amount (ml)</Label>
          <div className="flex gap-2">
            <Input
              id="custom-water"
              type="number"
              placeholder="Enter amount in ml"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addCustomAmount()}
            />
            <Button onClick={addCustomAmount} disabled={isLoading || !customAmount}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Remove Water */}
        {waterIntake > 0 && (
          <div className="space-y-2">
            <Label>Remove Water</Label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeWater(250)}
                disabled={isLoading || waterIntake === 0}
              >
                <Minus className="h-3 w-3 mr-1" />
                250ml
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeWater(500)}
                disabled={isLoading || waterIntake === 0}
              >
                <Minus className="h-3 w-3 mr-1" />
                500ml
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeWater(waterIntake)}
                disabled={isLoading || waterIntake === 0}
              >
                Reset
              </Button>
            </div>
          </div>
        )}

        {/* Message */}
        {message && (
          <div
            className={`flex items-center gap-2 p-3 rounded-lg border text-sm ${
              message.type === "success"
                ? "bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
                : "bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800"
            }`}
          >
            {message.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            {message.text}
          </div>
        )}

        {/* Hydration Tips */}
        <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="font-medium text-blue-800 dark:text-blue-200 text-sm mb-2">Hydration Tips</h4>
          <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Drink water before, during, and after meals</li>
            <li>• Carry a water bottle with you throughout the day</li>
            <li>• Drink more water when exercising or in hot weather</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
