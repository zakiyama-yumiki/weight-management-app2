'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { TrendingDown, Calendar, Target, Activity } from 'lucide-react'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

interface ProgressCardProps {
  currentWeight: number
  targetWeight: number
  progressPercentage: number
  remainingWeight: number
  weeklyPace: number
  monthlyPace: number
  expectedCompletionDate: string | null
  daysRemaining: number
  isOnTrack: boolean
  message: string
}

export function ProgressCard({
  currentWeight,
  targetWeight,
  progressPercentage,
  remainingWeight,
  weeklyPace,
  monthlyPace,
  expectedCompletionDate,
  daysRemaining,
  isOnTrack,
  message,
}: ProgressCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>目標達成状況</CardTitle>
          <Badge variant={isOnTrack ? 'default' : 'secondary'}>
            {isOnTrack ? '順調' : '要改善'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">進捗率</span>
            <span className="text-sm font-medium">{progressPercentage.toFixed(1)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
          <p className="text-sm text-muted-foreground mt-2">{message}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">現在の体重</p>
                <p className="text-2xl font-bold">{currentWeight} kg</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">残り</p>
                <p className="text-2xl font-bold">{remainingWeight.toFixed(1)} kg</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">現在のペース</p>
                <p className="text-sm">週間: {weeklyPace} kg/週</p>
                <p className="text-sm">月間: {monthlyPace} kg/月</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">達成予想日</p>
                <p className="text-sm">
                  {expectedCompletionDate
                    ? format(new Date(expectedCompletionDate), 'yyyy年M月d日', { locale: ja })
                    : '計算中...'}
                </p>
                <p className="text-xs text-muted-foreground">
                  残り {daysRemaining} 日
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}