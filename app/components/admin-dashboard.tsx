"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LocalDatabase, type User, type Meal } from "@/lib/local-storage"
import { Upload, Users, FileText, BarChart3, Download, Eye, AlertCircle, CheckCircle } from "lucide-react"

export default function AdminDashboard() {
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importStatus, setImportStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [userMeals, setUserMeals] = useState<Meal[]>([])

  const users = LocalDatabase.getUsers().filter((u) => u.role === "user")
  const appStats = LocalDatabase.getAppStats()

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImportFile(file)
    }
  }

  const processImport = async () => {
    if (!importFile) return

    try {
      const text = await importFile.text()
      const result = await LocalDatabase.importUserData(text)

      if (result.success) {
        setImportStatus({ type: "success", message: "User data imported successfully!" })
        setImportFile(null)
      } else {
        setImportStatus({ type: "error", message: result.error || "Import failed" })
      }
    } catch (error) {
      setImportStatus({ type: "error", message: "Invalid file format" })
    }
  }

  const viewUserData = (user: User) => {
    setSelectedUser(user)
    const meals = LocalDatabase.getUserMeals(user.id)
    setUserMeals(meals)
  }

  const exportUserData = (user: User) => {
    const data = LocalDatabase.exportUserData(user.id)
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${user.fullName.replace(/\s+/g, "_")}_nutrition_data.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <Users className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users and import nutrition data</p>
        </div>
      </div>

      {/* App Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{appStats.totalUsers}</p>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{appStats.totalMeals}</p>
                <p className="text-sm text-muted-foreground">Total Meals</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{appStats.activeUsers}</p>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Upload className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{appStats.totalProfiles}</p>
                <p className="text-sm text-muted-foreground">User Profiles</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="import" className="space-y-4">
        <TabsList>
          <TabsTrigger value="import">Import Data</TabsTrigger>
          <TabsTrigger value="users">Manage Users</TabsTrigger>
        </TabsList>

        <TabsContent value="import" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Import User Data
              </CardTitle>
              <CardDescription>Upload exported user nutrition data files to import into the system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="import-file">Select JSON file</Label>
                <Input
                  id="import-file"
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="cursor-pointer"
                />
              </div>

              {importFile && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    Selected file: {importFile.name}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    Size: {(importFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              )}

              {importStatus && (
                <div
                  className={`flex items-center gap-2 p-4 rounded-lg ${
                    importStatus.type === "success"
                      ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-300"
                      : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300"
                  }`}
                >
                  {importStatus.type === "success" ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  {importStatus.message}
                </div>
              )}

              <Button onClick={processImport} disabled={!importFile} className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Import Data
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Users List */}
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View and manage user accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {users.map((user) => (
                      <div key={user.id} className="p-4 border rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{user.fullName}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                          <Badge variant="outline">{user.role}</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Last login: {new Date(user.lastLoginAt).toLocaleDateString()}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => viewUserData(user)}>
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => exportUserData(user)}>
                            <Download className="h-3 w-3 mr-1" />
                            Export
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* User Details */}
            <Card>
              <CardHeader>
                <CardTitle>User Details</CardTitle>
                <CardDescription>
                  {selectedUser ? `Viewing data for ${selectedUser.fullName}` : "Select a user to view details"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedUser ? (
                  <ScrollArea className="h-96">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium">Age</p>
                          <p className="text-muted-foreground">{selectedUser.age} years</p>
                        </div>
                        <div>
                          <p className="font-medium">Gender</p>
                          <p className="text-muted-foreground capitalize">{selectedUser.gender}</p>
                        </div>
                        <div>
                          <p className="font-medium">Height</p>
                          <p className="text-muted-foreground">{selectedUser.height} cm</p>
                        </div>
                        <div>
                          <p className="font-medium">Weight</p>
                          <p className="text-muted-foreground">{selectedUser.weight} kg</p>
                        </div>
                      </div>

                      <div>
                        <p className="font-medium mb-2">Recent Meals ({userMeals.length} total)</p>
                        <div className="space-y-2">
                          {userMeals.slice(0, 5).map((meal) => (
                            <div key={meal.id} className="p-3 bg-muted rounded-lg">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium capitalize">{meal.type}</p>
                                  <p className="text-sm text-muted-foreground">{meal.date}</p>
                                </div>
                                <Badge variant="secondary">{meal.totalNutrition.calories} cal</Badge>
                              </div>
                              <div className="mt-2">
                                <p className="text-xs text-muted-foreground">
                                  Foods: {meal.foods.map((f) => f.name).join(", ")}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="h-96 flex items-center justify-center text-muted-foreground">
                    Select a user from the list to view their details
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
