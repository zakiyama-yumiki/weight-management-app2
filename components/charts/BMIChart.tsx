'use client'

import { WeightRecord } from '@/types'
import { BaseChart } from './BaseChart'
import { formatChartData } from '@/lib/chart-utils'

interface BMIChartProps {
  records: WeightRecord[]
  height?: number
}

export function BMIChart({ records, height = 400 }: BMIChartProps) {
  const chartData = formatChartData(records)

  const lines = [
    {
      key: 'bmi',
      color: '#10b981',
      name: 'BMI',
    },
  ]

  return (
    <BaseChart
      data={chartData}
      lines={lines}
      xAxisKey="date"
      yAxisLabel=""
      height={height}
    />
  )
}