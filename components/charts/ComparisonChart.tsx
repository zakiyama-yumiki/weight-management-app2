'use client'

import { WeightRecord, UserSettings } from '@/types'
import { BaseChart } from './BaseChart'
import { formatChartData } from '@/lib/chart-utils'
import { differenceInDays, parseISO } from 'date-fns'

interface ComparisonChartProps {
  records: WeightRecord[]
  settings: UserSettings
  height?: number
}

export function ComparisonChart({ records, settings, height = 400 }: ComparisonChartProps) {
  const chartData = formatChartData(records)
  
  // 目標ラインを計算
  const startDate = parseISO(chartData[0]?.date || new Date().toISOString())
  const targetDate = parseISO(settings.targetDate)
  const totalDays = differenceInDays(targetDate, startDate)
  const totalWeightToLose = settings.initialWeight - settings.targetWeight
  
  // 各データポイントに目標値を追加
  const dataWithTarget = chartData.map((point) => {
    const daysFromStart = differenceInDays(parseISO(point.date), startDate)
    const expectedWeightLoss = (totalWeightToLose / totalDays) * daysFromStart
    const targetWeight = settings.initialWeight - expectedWeightLoss
    
    return {
      ...point,
      targetWeight: Number(targetWeight.toFixed(1)),
    }
  })

  const lines = [
    {
      key: 'weight',
      color: '#3b82f6',
      name: '実績',
    },
    {
      key: 'targetWeight',
      color: '#ef4444',
      name: '目標',
    },
  ]

  return (
    <BaseChart
      data={dataWithTarget}
      lines={lines}
      xAxisKey="date"
      yAxisLabel="kg"
      height={height}
    />
  )
}