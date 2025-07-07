export function calculateBMI(weight: number, heightCm: number): number {
  const heightM = heightCm / 100
  return Number((weight / (heightM * heightM)).toFixed(1))
}

export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return '低体重'
  if (bmi < 25) return '普通体重'
  if (bmi < 30) return '肥満（1度）'
  return '肥満（2度以上）'
}

export function calculateWeightLossRate(
  currentWeight: number,
  initialWeight: number
): number {
  return Number(((1 - currentWeight / initialWeight) * 100).toFixed(1))
}

export function calculateProgressPercentage(
  currentWeight: number,
  initialWeight: number,
  targetWeight: number
): number {
  const totalWeightToLose = initialWeight - targetWeight
  const weightLost = initialWeight - currentWeight
  
  if (totalWeightToLose <= 0) return 0
  
  const percentage = (weightLost / totalWeightToLose) * 100
  return Number(Math.max(0, Math.min(100, percentage)).toFixed(1))
}

export function calculateExpectedCompletionDate(
  weeklyAverage: number,
  remainingWeight: number
): Date | null {
  if (weeklyAverage <= 0 || remainingWeight <= 0) return null
  
  const weeksNeeded = remainingWeight / weeklyAverage
  const expectedDate = new Date()
  expectedDate.setDate(expectedDate.getDate() + weeksNeeded * 7)
  
  return expectedDate
}