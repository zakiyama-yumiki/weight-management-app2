'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { calculateBMI } from '@/lib/calculations'

interface Goals {
  targetWeight?: number
  targetDate?: string
  weeklyWeightLossGoal?: number
  monthlyWeightLossGoal?: number
  targetBMI?: number
}

export default function GoalsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [height, setHeight] = useState<number>(0)
  const [goals, setGoals] = useState<Goals>({})

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settingsResponse = await fetch('/api/settings')
        if (settingsResponse.ok) {
          const settings = await settingsResponse.json()
          setHeight(settings.height)
        }

        const goalsResponse = await fetch('/api/goals')
        if (goalsResponse.ok) {
          const goalsData = await goalsResponse.json()
          setGoals(goalsData)
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const response = await fetch('/api/goals', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goals),
      })

      if (response.ok) {
        router.push('/')
      } else {
        console.error('Failed to update goals')
      }
    } catch (error) {
      console.error('Failed to update goals:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const calculateWeightFromBMI = (bmi: number) => {
    if (height > 0 && bmi > 0) {
      return Number((bmi * Math.pow(height / 100, 2)).toFixed(1))
    }
    return 0
  }

  const calculateBMIFromWeight = (weight: number) => {
    if (height > 0 && weight > 0) {
      return Number(calculateBMI(weight, height).toFixed(1))
    }
    return 0
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">読み込み中...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">目標設定</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>体重目標</CardTitle>
              <CardDescription>
                目標体重と達成期限を設定してください
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="targetWeight">目標体重 (kg)</Label>
                <Input
                  id="targetWeight"
                  type="number"
                  step="0.1"
                  value={goals.targetWeight || ''}
                  onChange={(e) => setGoals({ ...goals, targetWeight: Number(e.target.value) })}
                  required
                />
                {goals.targetWeight && (
                  <p className="text-sm text-muted-foreground">
                    BMI: {calculateBMIFromWeight(goals.targetWeight)}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="targetDate">目標達成日</Label>
                <Input
                  id="targetDate"
                  type="date"
                  value={goals.targetDate ? goals.targetDate.split('T')[0] : ''}
                  onChange={(e) => setGoals({ ...goals, targetDate: `${e.target.value}T00:00:00.000Z` })}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>減量ペース目標</CardTitle>
              <CardDescription>
                健康的な減量ペースを設定してください
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="weeklyGoal">週間減量目標 (kg/週)</Label>
                <Input
                  id="weeklyGoal"
                  type="number"
                  step="0.1"
                  min="0"
                  max="2"
                  value={goals.weeklyWeightLossGoal || ''}
                  onChange={(e) => setGoals({ ...goals, weeklyWeightLossGoal: Number(e.target.value) })}
                  placeholder="推奨: 0.5-1.0 kg/週"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="monthlyGoal">月間減量目標 (kg/月)</Label>
                <Input
                  id="monthlyGoal"
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={goals.monthlyWeightLossGoal || ''}
                  onChange={(e) => setGoals({ ...goals, monthlyWeightLossGoal: Number(e.target.value) })}
                  placeholder="推奨: 2-4 kg/月"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>BMI目標</CardTitle>
              <CardDescription>
                目標BMIを設定してください（標準: 18.5-24.9）
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="targetBMI">目標BMI</Label>
                <Input
                  id="targetBMI"
                  type="number"
                  step="0.1"
                  min="15"
                  max="40"
                  value={goals.targetBMI || ''}
                  onChange={(e) => setGoals({ ...goals, targetBMI: Number(e.target.value) })}
                />
                {goals.targetBMI && (
                  <p className="text-sm text-muted-foreground">
                    体重換算: {calculateWeightFromBMI(goals.targetBMI)} kg
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4 flex-col sm:flex-row">
            <Button type="submit" disabled={isSaving} className="w-full sm:flex-1">
              {isSaving ? '保存中...' : '保存'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/')}
              className="w-full sm:flex-1"
            >
              キャンセル
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}