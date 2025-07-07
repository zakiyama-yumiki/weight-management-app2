import { z } from "zod"

export const userSettingsSchema = z.object({
  height: z.number().min(100).max(250),
  initialWeight: z.number().min(30).max(300),
  targetWeight: z.number().min(30).max(300),
  targetDate: z.string().datetime(),
})

export const weightRecordSchema = z.object({
  date: z.string().datetime(),
  weight: z.number().min(30).max(300),
  muscleWeight: z.number().min(10).max(150).optional(),
  bodyFatPercentage: z.number().min(1).max(60).optional(),
})

export const goalSchema = z.object({
  type: z.enum(['weight', 'bmi', 'weekly', 'monthly']),
  targetValue: z.number().positive(),
  targetDate: z.string().datetime().optional(),
})

export type UserSettingsInput = z.infer<typeof userSettingsSchema>
export type WeightRecordInput = z.infer<typeof weightRecordSchema>
export type GoalInput = z.infer<typeof goalSchema>