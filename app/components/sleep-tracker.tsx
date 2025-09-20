"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Moon, Sun, TrendingUp, Clock } from "lucide-react"

interface SleepEntry {
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

export default function SleepTracker() {
  const { user } = useAuth()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [sleepEntries, setSleepEntries] = useState<SleepEntry[]>([])
  const [hoursSlept, setHoursSlept] = useState<string>("")
  const [sleepQuality, setSleepQuality] = useState<"poor" | "fair" | "good" | "excellent">("good")
  const [bedTime, setBedTime] = useState<string>("")
  const [wakeTime, setWakeTime] = useState<string>("")
  const [notes, setNotes] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      loadSleepEntries()
    }
  }, [user, selectedDate])

  const loadSleepEntries = () => {
    if (!user) return

    // Get sleep entries from localStorage
    const entries = JSON.parse(localStorage.getItem("naijafit_sleep_entries") || "[]") as SleepEntry[]
    const userEntries = entries.filter((entry) => entry.userId === user.id)
    setSleepEntries(userEntries)
  }

  const saveSleepEntry = async () => {
    if (!user || !hoursSlept) return

    setIsLoading(true)

    try {
      const existingEntries = JSON.parse(localStorage.getItem("naijafit_sleep_entries") || "[]") as SleepEntry[]

      // Check if entry already exists for this date
      const existingEntryIndex = existingEntries.findIndex(
        (entry) => entry.userId === user.id && entry.date === selectedDate,
      )

      const sleepEntry: SleepEntry = {
        id: existingEntryIndex >= 0 ? existingEntries[existingEntryIndex].id : `sleep_${Date.now()}`,
        userId: user.id,
        date: selectedDate,
        hoursSlept: Number.parseFloat(hoursSlept),
        sleepQuality,
        bedTime: bedTime || undefined,
        wakeTime: wakeTime || undefined,
        notes: notes || undefined,
        createdAt: existingEntryIndex >= 0 ? existingEntries[existingEntryIndex].createdAt : new Date().toISOString(),
      }

      if (existingEntryIndex >= 0) {
        existingEntries[existingEntryIndex] = sleepEntry
      } else {
        existingEntries.push(sleepEntry)
      }

      localStorage.setItem("naijafit_sleep_entries", JSON.stringify(existingEntries))

      // Reset form
      setHoursSlept("")
      setSleepQuality("good")
      setBedTime("")
      setWakeTime("")
      setNotes("")

      loadSleepEntries()
    } catch (error) {
      console.error("Error saving sleep entry:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const navigateDate = (direction: "prev" | "next") => {
    const currentDate = new Date(selectedDate)
    if (direction === "prev") {
      currentDate.setDate(currentDate.getDate() - 1)
    } else {
      currentDate.setDate(currentDate.getDate() + 1)
    }
    setSelectedDate(currentDate.toISOString().split("T")[0])
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date().toISOString().split("T")[0]
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0]

    if (dateString === today) return "Today"
    if (dateString === yesterday) return "Yesterday"

    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    })
  }

  const getTodaysSleepEntry = () => {
    return sleepEntries.find((entry) => entry.date === selectedDate)
  }

  const getWeeklyAverage = () => {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const weekAgoString = weekAgo.toISOString().split("T")[0]

    const weekEntries = sleepEntries.filter((entry) => entry.date >= weekAgoString)
    if (weekEntries.length === 0) return 0

    const totalHours = weekEntries.reduce((sum, entry) => sum + entry.hoursSlept, 0)
    return totalHours / weekEntries.length
  }

  const getSleepQualityColor = (quality: string) => {
    switch (quality) {
      case "excellent":
        return "text-green-600 bg-green-50"
      case "good":
        return "text-blue-600 bg-blue-50"
      case "fair":
        return "text-orange-600 bg-orange-50"
      case "poor":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getSleepRecommendation = (hours: number) => {
    if (hours < 6) return { message: "You need more sleep! Aim for 7-9 hours.", color: "text-red-600" }
    if (hours < 7) return { message: "A bit more sleep would be beneficial.", color: "text-orange-600" }
    if (hours <= 9) return { message: "Great! You're getting adequate sleep.", color: "text-green-600" }
    return { message: "You might be sleeping too much. 7-9 hours is ideal.", color: "text-orange-600" }
  }

  if (!user) return null

  const todaysSleep = getTodaysSleepEntry()
  const weeklyAverage = getWeeklyAverage()

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Date Navigation */}
      <Card>
        <CardHeader>
          <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 xs:gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-base xs:text-lg sm:text-xl">
                <Moon className="h-4 w-4 xs:h-5 xs:w-5 text-purple-600" />
                Sleep Tracker
              </CardTitle>
              <CardDescription className="text-xs xs:text-sm sm:text-base">
                Monitor your sleep patterns and quality
              </CardDescription>
            </div>
            <div className="flex items-center justify-center gap-3 xs:gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateDate("prev")}
                className="h-8 w-8 xs:h-9 xs:w-9 p-0"
              >
                <ChevronLeft className="h-3 w-3 xs:h-4 xs:w-4" />
              </Button>
              <div className="text-sm xs:text-base font-medium min-w-[140px] xs:min-w-[160px] text-center px-2">
                {formatDate(selectedDate)}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateDate("next")}
                className="h-8 w-8 xs:h-9 xs:w-9 p-0"
                disabled={selectedDate >= new Date().toISOString().split("T")[0]}
              >
                <ChevronRight className="h-3 w-3 xs:h-4 xs:w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Sleep Entry Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base xs:text-lg">
            {todaysSleep ? "Update" : "Log"} Sleep for {formatDate(selectedDate)}
          </CardTitle>
          <CardDescription className="text-xs xs:text-sm">Track your sleep duration and quality</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Hours Slept</label>
                <Select value={hoursSlept} onValueChange={setHoursSlept}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select hours" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 25 }, (_, i) => i * 0.5 + 3).map((hours) => (
                      <SelectItem key={hours} value={hours.toString()}>
                        {hours} hours
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Sleep Quality</label>
                <Select
                  value={sleepQuality}
                  onValueChange={(value: "poor" | "fair" | "good" | "excellent") => setSleepQuality(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="poor">😴 Poor</SelectItem>
                    <SelectItem value="fair">😐 Fair</SelectItem>
                    <SelectItem value="good">😊 Good</SelectItem>
                    <SelectItem value="excellent">😁 Excellent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Bed Time (Optional)</label>
                <input
                  type="time"
                  value={bedTime}
                  onChange={(e) => setBedTime(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Wake Time (Optional)</label>
                <input
                  type="time"
                  value={wakeTime}
                  onChange={(e) => setWakeTime(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Notes (Optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How did you sleep? Any factors affecting your sleep?"
                className="w-full px-3 py-2 border border-input rounded-md text-sm resize-none"
                rows={2}
              />
            </div>

            <Button
              onClick={saveSleepEntry}
              disabled={!hoursSlept || isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isLoading ? "Saving..." : todaysSleep ? "Update Sleep Entry" : "Log Sleep"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sleep Stats */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm xs:text-base flex items-center gap-1 xs:gap-2">
              <Clock className="h-3 w-3 xs:h-4 xs:w-4 text-purple-600" />
              Today's Sleep
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todaysSleep ? (
              <div className="space-y-2">
                <div className="text-lg xs:text-xl font-bold">{todaysSleep.hoursSlept}h</div>
                <Badge className={`text-xs ${getSleepQualityColor(todaysSleep.sleepQuality)}`}>
                  {todaysSleep.sleepQuality}
                </Badge>
                {todaysSleep.hoursSlept && (
                  <div className={`text-xs ${getSleepRecommendation(todaysSleep.hoursSlept).color}`}>
                    {getSleepRecommendation(todaysSleep.hoursSlept).message}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No sleep logged</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm xs:text-base flex items-center gap-1 xs:gap-2">
              <TrendingUp className="h-3 w-3 xs:h-4 xs:w-4 text-blue-600" />
              Weekly Average
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-lg xs:text-xl font-bold">
                {weeklyAverage > 0 ? `${weeklyAverage.toFixed(1)}h` : "No data"}
              </div>
              <div className="text-xs text-muted-foreground">Last 7 days</div>
              {weeklyAverage > 0 && (
                <div className={`text-xs ${getSleepRecommendation(weeklyAverage).color}`}>
                  {getSleepRecommendation(weeklyAverage).message}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm xs:text-base flex items-center gap-1 xs:gap-2">
              <Sun className="h-3 w-3 xs:h-4 xs:w-4 text-orange-600" />
              Sleep Goal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-lg xs:text-xl font-bold">7-9h</div>
              <div className="text-xs text-muted-foreground">Recommended</div>
              {todaysSleep && (
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      todaysSleep.hoursSlept >= 7 && todaysSleep.hoursSlept <= 9 ? "bg-green-500" : "bg-orange-500"
                    }`}
                    style={{ width: `${Math.min((todaysSleep.hoursSlept / 9) * 100, 100)}%` }}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sleep History */}
      {sleepEntries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base xs:text-lg">Recent Sleep History</CardTitle>
            <CardDescription className="text-xs xs:text-sm">Your sleep patterns over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sleepEntries
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 7)
                .map((entry) => (
                  <div
                    key={entry.id}
                    className="flex flex-col xs:flex-row xs:items-center justify-between p-3 border rounded-lg gap-2"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">{formatDate(entry.date)}</span>
                        <Badge className={`text-xs ${getSleepQualityColor(entry.sleepQuality)}`}>
                          {entry.sleepQuality}
                        </Badge>
                      </div>
                      {entry.bedTime && entry.wakeTime && (
                        <div className="text-xs text-muted-foreground">
                          {entry.bedTime} - {entry.wakeTime}
                        </div>
                      )}
                      {entry.notes && <div className="text-xs text-muted-foreground italic mt-1">"{entry.notes}"</div>}
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{entry.hoursSlept}h</div>
                      <div className={`text-xs ${getSleepRecommendation(entry.hoursSlept).color}`}>
                        {entry.hoursSlept >= 7 && entry.hoursSlept <= 9 ? "Good" : "Needs improvement"}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
