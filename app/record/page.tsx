"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { weightRecordSchema } from "@/lib/schemas"
import { UserSettings } from "@/types"

export default function RecordPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    weight: "",
    muscleWeight: "",
    bodyFatPercentage: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        const response = await fetch("/api/settings")
        if (response.ok) {
          const settings = await response.json()
          setUserSettings(settings)
        }
      } catch (error) {
        console.error("設定の取得エラー:", error)
      }
    }
    fetchUserSettings()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setIsLoading(true)

    try {
      const data = weightRecordSchema.parse({
        date: new Date(formData.date).toISOString(),
        weight: Number(formData.weight),
        muscleWeight: formData.muscleWeight ? Number(formData.muscleWeight) : undefined,
        bodyFatPercentage: formData.bodyFatPercentage ? Number(formData.bodyFatPercentage) : undefined,
      })

      const response = await fetch("/api/records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("記録の保存に失敗しました")
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
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-4">体重記録</h2>
        <p className="text-muted-foreground">
          今日の体重データを記録してください。
        </p>
      </div>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>記録を追加</CardTitle>
          <CardDescription>
            必要な項目を入力して、記録を保存してください。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="date">日付</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">体重 (kg)</Label>
              <Input
                id="weight"
                type="number"
                placeholder="70.5"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                required
                min="30"
                max="300"
                step="0.1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="muscleWeight">筋肉量 (kg) - 任意</Label>
              <Input
                id="muscleWeight"
                type="number"
                placeholder="30.0"
                value={formData.muscleWeight}
                onChange={(e) => setFormData({ ...formData, muscleWeight: e.target.value })}
                min="10"
                max="150"
                step="0.1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bodyFatPercentage">体脂肪率 (%) - 任意</Label>
              <Input
                id="bodyFatPercentage"
                type="number"
                placeholder="15.0"
                value={formData.bodyFatPercentage}
                onChange={(e) => setFormData({ ...formData, bodyFatPercentage: e.target.value })}
                min="1"
                max="60"
                step="0.1"
              />
            </div>

            {errors.general && (
              <p className="text-sm text-destructive">{errors.general}</p>
            )}

            <div className="flex gap-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "保存中..." : "記録を保存"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push("/")}>
                キャンセル
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}