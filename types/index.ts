export interface UserSettings {
  id: string
  height: number // cm
  initialWeight: number // kg
  targetWeight: number // kg
  targetDate: string // ISO 8601 date string
  weeklyWeightLossGoal?: number // kg/week
  monthlyWeightLossGoal?: number // kg/month
  targetBMI?: number
  createdAt: string
  updatedAt: string
}

export interface WeightRecord {
  id: string
  userId: string
  date: string // ISO 8601 date string
  weight: number // kg
  muscleWeight?: number // kg
  bodyFatPercentage?: number // %
  bmi: number
  createdAt: string
  updatedAt: string
}

export interface Goal {
  id: string
  userId: string
  type: 'weight' | 'bmi' | 'weekly' | 'monthly'
  targetValue: number
  targetDate?: string
  createdAt: string
  updatedAt: string
}

export interface WeightStats {
  currentWeight: number
  initialWeight: number
  targetWeight: number
  weightLoss: number
  remainingWeight: number
  progressPercentage: number
  currentBMI: number
  targetBMI: number
  weeklyAverage: number
  monthlyAverage: number
  expectedCompletionDate: string | null
}