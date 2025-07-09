import { WeightRecord, UserSettings } from '@/types'
import { differenceInDays, addDays, parseISO } from 'date-fns'

export function calculateProgress(
  records: WeightRecord[],
  settings: UserSettings
): {
  currentWeight: number
  progressPercentage: number
  remainingWeight: number
  weeklyPace: number
  monthlyPace: number
  expectedCompletionDate: string | null
  daysElapsed: number
  daysRemaining: number
  isOnTrack: boolean
} {
  if (records.length === 0) {
    return {
      currentWeight: settings.initialWeight,
      progressPercentage: 0,
      remainingWeight: settings.initialWeight - settings.targetWeight,
      weeklyPace: 0,
      monthlyPace: 0,
      expectedCompletionDate: null,
      daysElapsed: 0,
      daysRemaining: differenceInDays(parseISO(settings.targetDate), new Date()),
      isOnTrack: true,
    }
  }

  // Sort records by date
  const sortedRecords = [...records].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  const currentWeight = sortedRecords[sortedRecords.length - 1].weight
  const totalWeightLoss = settings.initialWeight - currentWeight
  const remainingWeight = currentWeight - settings.targetWeight
  const totalWeightToLose = settings.initialWeight - settings.targetWeight

  const progressPercentage = 
    totalWeightToLose > 0 ? (totalWeightLoss / totalWeightToLose) * 100 : 0

  // Calculate days elapsed since first record
  const firstRecordDate = new Date(sortedRecords[0].date)
  const daysElapsed = differenceInDays(new Date(), firstRecordDate)

  // Calculate pace
  const weeklyPace = daysElapsed > 0 ? (totalWeightLoss / daysElapsed) * 7 : 0
  const monthlyPace = daysElapsed > 0 ? (totalWeightLoss / daysElapsed) * 30 : 0

  // Calculate expected completion date
  let expectedCompletionDate: string | null = null
  if (weeklyPace > 0 && remainingWeight > 0) {
    const weeksToCompletion = remainingWeight / weeklyPace
    const daysToCompletion = Math.ceil(weeksToCompletion * 7)
    expectedCompletionDate = addDays(new Date(), daysToCompletion).toISOString()
  }

  // Calculate remaining days to target
  const daysRemaining = differenceInDays(parseISO(settings.targetDate), new Date())

  // Check if on track
  const requiredPacePerWeek = 
    daysRemaining > 0 ? (remainingWeight / daysRemaining) * 7 : 0
  const isOnTrack = weeklyPace >= requiredPacePerWeek

  return {
    currentWeight,
    progressPercentage: Math.min(100, Math.max(0, progressPercentage)),
    remainingWeight: Math.max(0, remainingWeight),
    weeklyPace: Number(weeklyPace.toFixed(2)),
    monthlyPace: Number(monthlyPace.toFixed(2)),
    expectedCompletionDate,
    daysElapsed,
    daysRemaining: Math.max(0, daysRemaining),
    isOnTrack,
  }
}

export function getProgressMessage(
  progressPercentage: number,
  isOnTrack: boolean
): string {
  if (progressPercentage >= 100) {
    return '目標達成おめでとうございます！'
  } else if (progressPercentage >= 75) {
    return 'あと少しで目標達成です！'
  } else if (progressPercentage >= 50) {
    return '順調に進んでいます！'
  } else if (progressPercentage >= 25) {
    return '良いスタートです！'
  } else if (isOnTrack) {
    return '計画通りに進んでいます'
  } else {
    return 'ペースを上げましょう'
  }
}