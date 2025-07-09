'use client'

import dynamic from 'next/dynamic'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { WeightChart } from '@/components/charts/WeightChart'
import { BMIChart } from '@/components/charts/BMIChart'
import { MuscleMassChart } from '@/components/charts/MuscleMassChart'
import { BodyFatChart } from '@/components/charts/BodyFatChart'
import { ComparisonChart } from '@/components/charts/ComparisonChart'
import { WeightRecord } from '@/types'
import { DateRange, filterRecordsByDateRange, getDateRangeLabel } from '@/lib/chart-utils'

export default function ChartsPage() {
  const [records, setRecords] = useState<WeightRecord[]>([])
  const [settings, setSettings] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRange, setSelectedRange] = useState<DateRange>('1month')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recordsResponse, settingsResponse] = await Promise.all([
          fetch('/api/records'),
          fetch('/api/settings')
        ])
        
        if (recordsResponse.ok) {
          const data = await recordsResponse.json()
          setRecords(data)
        }
        
        if (settingsResponse.ok) {
          const settingsData = await settingsResponse.json()
          setSettings(settingsData)
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredRecords = filterRecordsByDateRange(records, selectedRange)

  const dateRanges: DateRange[] = ['1week', '1month', '6months', '1year']

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">読み込み中...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">グラフ</h1>

      <div className="mb-6 flex gap-2 flex-wrap justify-center md:justify-start">
        {dateRanges.map((range) => (
          <Button
            key={range}
            variant={selectedRange === range ? 'default' : 'outline'}
            onClick={() => setSelectedRange(range)}
            size="sm"
            className="text-xs md:text-sm"
          >
            {getDateRangeLabel(range)}
          </Button>
        ))}
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>体重推移</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredRecords.length > 0 ? (
              <WeightChart records={filteredRecords} />
            ) : (
              <p className="text-center text-muted-foreground py-8">
                選択期間のデータがありません
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>BMI推移</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredRecords.length > 0 ? (
              <BMIChart records={filteredRecords} />
            ) : (
              <p className="text-center text-muted-foreground py-8">
                選択期間のデータがありません
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>筋肉量推移</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredRecords.length > 0 ? (
              <MuscleMassChart records={filteredRecords} />
            ) : (
              <p className="text-center text-muted-foreground py-8">
                選択期間のデータがありません
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>体脂肪率推移</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredRecords.length > 0 ? (
              <BodyFatChart records={filteredRecords} />
            ) : (
              <p className="text-center text-muted-foreground py-8">
                選択期間のデータがありません
              </p>
            )}
          </CardContent>
        </Card>

        {settings && (
          <Card>
            <CardHeader>
              <CardTitle>目標との比較</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredRecords.length > 0 ? (
                <ComparisonChart records={filteredRecords} settings={settings} />
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  選択期間のデータがありません
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}