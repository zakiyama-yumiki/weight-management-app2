import { NextRequest, NextResponse } from 'next/server'
import { kvClient } from '@/lib/kv-client'
import { userSettingsSchema } from '@/lib/schemas'
import { UserSettings } from '@/types'
import { KV_KEYS, DEFAULT_USER_ID } from '@/lib/constants'
import { z } from 'zod'

const updateGoalsSchema = z.object({
  weeklyWeightLossGoal: z.number().min(0).max(2).optional(),
  monthlyWeightLossGoal: z.number().min(0).max(10).optional(),
  targetBMI: z.number().min(15).max(40).optional(),
  targetWeight: z.number().min(30).max(300).optional(),
  targetDate: z.string().datetime().optional(),
})

export async function GET() {
  try {
    const settings = await kvClient.get<UserSettings>(KV_KEYS.USER_SETTINGS)

    if (!settings) {
      return NextResponse.json(
        { error: 'Settings not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      targetWeight: settings.targetWeight,
      targetDate: settings.targetDate,
      weeklyWeightLossGoal: settings.weeklyWeightLossGoal,
      monthlyWeightLossGoal: settings.monthlyWeightLossGoal,
      targetBMI: settings.targetBMI,
    })
  } catch (error) {
    console.error('Failed to fetch goals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch goals' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = updateGoalsSchema.parse(body)

    const currentSettings = await kvClient.get<UserSettings>(KV_KEYS.USER_SETTINGS)

    if (!currentSettings) {
      return NextResponse.json(
        { error: 'Settings not found' },
        { status: 404 }
      )
    }

    const updatedSettings: UserSettings = {
      ...currentSettings,
      ...validatedData,
      updatedAt: new Date().toISOString(),
    }

    await kvClient.set(KV_KEYS.USER_SETTINGS, updatedSettings)

    return NextResponse.json({
      message: 'Goals updated successfully',
      goals: {
        targetWeight: updatedSettings.targetWeight,
        targetDate: updatedSettings.targetDate,
        weeklyWeightLossGoal: updatedSettings.weeklyWeightLossGoal,
        monthlyWeightLossGoal: updatedSettings.monthlyWeightLossGoal,
        targetBMI: updatedSettings.targetBMI,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Failed to update goals:', error)
    return NextResponse.json(
      { error: 'Failed to update goals' },
      { status: 500 }
    )
  }
}