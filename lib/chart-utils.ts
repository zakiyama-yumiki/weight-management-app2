import { WeightRecord } from '@/types'
import { startOfWeek, startOfMonth, startOfYear, subDays, subMonths, subYears, isAfter } from 'date-fns'

export type DateRange = '1week' | '1month' | '6months' | '1year'

export function filterRecordsByDateRange(
  records: WeightRecord[],
  range: DateRange
): WeightRecord[] {
  const now = new Date()
  let startDate: Date

  switch (range) {
    case '1week':
      startDate = subDays(now, 7)
      break
    case '1month':
      startDate = subMonths(now, 1)
      break
    case '6months':
      startDate = subMonths(now, 6)
      break
    case '1year':
      startDate = subYears(now, 1)
      break
    default:
      startDate = subMonths(now, 1)
  }

  return records.filter((record) => isAfter(new Date(record.date), startDate))
}

export function formatChartData(records: WeightRecord[]) {
  return records
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((record) => ({
      date: record.date,
      weight: record.weight,
      bmi: record.bmi,
      muscleMass: record.muscleWeight,
      bodyFatPercentage: record.bodyFatPercentage,
    }))
}

export function calculateTrend(records: WeightRecord[], field: keyof WeightRecord) {
  if (records.length < 2) return 0

  const sortedRecords = [...records].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  const firstValue = Number(sortedRecords[0][field])
  const lastValue = Number(sortedRecords[sortedRecords.length - 1][field])

  return lastValue - firstValue
}

export function getDateRangeLabel(range: DateRange): string {
  switch (range) {
    case '1week':
      return '1週間'
    case '1month':
      return '1ヶ月'
    case '6months':
      return '6ヶ月'
    case '1year':
      return '1年'
    default:
      return '1ヶ月'
  }
}