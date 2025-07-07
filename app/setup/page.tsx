"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { userSettingsSchema } from "@/lib/schemas"

export default function SetupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    height: "",
    initialWeight: "",
    targetWeight: "",
    targetDate: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setIsLoading(true)

    try {
      const data = userSettingsSchema.parse({
        height: Number(formData.height),
        initialWeight: Number(formData.initialWeight),
        targetWeight: Number(formData.targetWeight),
        targetDate: new Date(formData.targetDate).toISOString(),
      })

      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("設定の保存に失敗しました")
      }

      router.push("/")
    } catch (error) {
      if (error instanceof Error) {
        setErrors({ general: error.message })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>初期設定</CardTitle>
          <CardDescription>
            体重管理を始めるために、基本情報を入力してください。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="height">身長 (cm)</Label>
              <Input
                id="height"
                type="number"
                placeholder="170"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                required
                min="100"
                max="250"
                step="0.1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="initialWeight">現在の体重 (kg)</Label>
              <Input
                id="initialWeight"
                type="number"
                placeholder="70.5"
                value={formData.initialWeight}
                onChange={(e) => setFormData({ ...formData, initialWeight: e.target.value })}
                required
                min="30"
                max="300"
                step="0.1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetWeight">目標体重 (kg)</Label>
              <Input
                id="targetWeight"
                type="number"
                placeholder="65.0"
                value={formData.targetWeight}
                onChange={(e) => setFormData({ ...formData, targetWeight: e.target.value })}
                required
                min="30"
                max="300"
                step="0.1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetDate">目標期日</Label>
              <Input
                id="targetDate"
                type="date"
                value={formData.targetDate}
                onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                required
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            {errors.general && (
              <p className="text-sm text-destructive">{errors.general}</p>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "保存中..." : "設定を保存"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}