export const KV_KEYS = {
  USER_SETTINGS: 'user:settings',
  WEIGHT_RECORDS: 'user:weight:records',
  GOALS: 'user:goals',
  LATEST_WEIGHT: 'user:weight:latest',
} as const

export const DEFAULT_USER_ID = 'default-user'

export const BMI_CATEGORIES = {
  UNDERWEIGHT: { max: 18.5, label: '低体重' },
  NORMAL: { min: 18.5, max: 25, label: '普通体重' },
  OVERWEIGHT: { min: 25, max: 30, label: '肥満（1度）' },
  OBESE: { min: 30, label: '肥満（2度以上）' },
} as const