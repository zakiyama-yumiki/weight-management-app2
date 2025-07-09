'use client'

import { WeightRecord } from '@/types'
import { BaseChart } from './BaseChart'
import { formatChartData } from '@/lib/chart-utils'
import { useEffect, useState } from 'react'

interface WeightChartProps {
  records: WeightRecord[]
  height?: number
}

export function WeightChart({ records, height = 400 }: WeightChartProps) {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])
  
  const chartHeight = isMobile ? 300 : height
  const chartData = formatChartData(records)

  const lines = [
    {
      key: 'weight',
      color: '#3b82f6',
      name: '体重',
    },
  ]

  return (
    <BaseChart
      data={chartData}
      lines={lines}
      xAxisKey="date"
      yAxisLabel="kg"
      height={chartHeight}
    />
  )
}