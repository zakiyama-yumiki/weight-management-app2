'use client'

import { WeightRecord } from '@/types'
import { BaseChart } from './BaseChart'
import { formatChartData } from '@/lib/chart-utils'

interface BodyFatChartProps {
  records: WeightRecord[]
  height?: number
}

export function BodyFatChart({ records, height = 400 }: BodyFatChartProps) {
  const chartData = formatChartData(records)

  const lines = [
    {
      key: 'bodyFatPercentage',
      color: '#ef4444',
      name: '体脂肪率',
    },
  ]

  return (
    <BaseChart
      data={chartData}
      lines={lines}
      xAxisKey="date"
      yAxisLabel="%"
      height={height}
    />
  )
}