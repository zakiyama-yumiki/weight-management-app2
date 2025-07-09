'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { useEffect, useState } from 'react'

interface BaseChartProps {
  data: any[]
  lines: {
    key: string
    color: string
    name: string
  }[]
  xAxisKey: string
  yAxisLabel?: string
  height?: number
}

export function BaseChart({
  data,
  lines,
  xAxisKey,
  yAxisLabel,
  height = 400,
}: BaseChartProps) {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])
  const formatXAxis = (tickItem: string) => {
    return format(new Date(tickItem), 'M/d', { locale: ja })
  }

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-2 shadow-md">
          <p className="text-sm font-medium">
            {format(new Date(label), 'yyyy年M月d日', { locale: ja })}
          </p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
              {yAxisLabel}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: isMobile ? 10 : 30,
          left: isMobile ? 10 : 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey={xAxisKey}
          tickFormatter={formatXAxis}
          stroke="#888888"
        />
        <YAxis
          label={!isMobile ? {
            value: yAxisLabel,
            angle: -90,
            position: 'insideLeft',
          } : undefined}
          stroke="#888888"
          width={isMobile ? 40 : 60}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        {lines.map((line) => (
          <Line
            key={line.key}
            type="monotone"
            dataKey={line.key}
            stroke={line.color}
            name={line.name}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}