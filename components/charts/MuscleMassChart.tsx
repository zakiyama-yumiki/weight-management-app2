'use client'

import { WeightRecord } from '@/types'
import { BaseChart } from './BaseChart'
import { formatChartData } from '@/lib/chart-utils'

interface MuscleMassChartProps {
  records: WeightRecord[]
  height?: number
}

export function MuscleMassChart({ records, height = 400 }: MuscleMassChartProps) {
  const chartData = formatChartData(records)

  const lines = [
    {
      key: 'muscleMass',
      color: '#f59e0b',
      name: '筋肉量',
    },
  ]

  return (
    <BaseChart
      data={chartData}
      lines={lines}
      xAxisKey="date"
      yAxisLabel="kg"
      height={height}
    />
  )
}