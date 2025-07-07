import { NextRequest, NextResponse } from "next/server"
import { kvClient } from "@/lib/kv-client"
import { weightRecordSchema } from "@/lib/schemas"
import { WeightRecord, UserSettings } from "@/types"
import { KV_KEYS, DEFAULT_USER_ID } from "@/lib/constants"
import { calculateBMI } from "@/lib/calculations"

export async function GET() {
  try {
    const records = await kvClient.get<WeightRecord[]>(KV_KEYS.WEIGHT_RECORDS)
    
    if (!records) {
      return NextResponse.json([])
    }
    
    return NextResponse.json(records)
  } catch (error) {
    console.error("記録の取得エラー:", error)
    return NextResponse.json(
      { error: "記録の取得に失敗しました" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = weightRecordSchema.parse(body)
    
    // ユーザー設定を取得（身長が必要）
    const userSettings = await kvClient.get<UserSettings>(KV_KEYS.USER_SETTINGS)
    if (!userSettings) {
      return NextResponse.json(
        { error: "ユーザー設定が見つかりません" },
        { status: 400 }
      )
    }
    
    // 既存の記録を取得
    const existingRecords = await kvClient.get<WeightRecord[]>(KV_KEYS.WEIGHT_RECORDS) || []
    
    // 同じ日付の記録があるかチェック
    const dateStr = validatedData.date.split("T")[0]
    const existingRecordIndex = existingRecords.findIndex(
      record => record.date.split("T")[0] === dateStr
    )
    
    const bmi = calculateBMI(validatedData.weight, userSettings.height)
    
    const newRecord: WeightRecord = {
      id: `${DEFAULT_USER_ID}-${dateStr}`,
      userId: DEFAULT_USER_ID,
      date: validatedData.date,
      weight: validatedData.weight,
      muscleWeight: validatedData.muscleWeight,
      bodyFatPercentage: validatedData.bodyFatPercentage,
      bmi,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    // 既存の記録を更新するか新規追加
    if (existingRecordIndex >= 0) {
      existingRecords[existingRecordIndex] = newRecord
    } else {
      existingRecords.push(newRecord)
    }
    
    // 日付でソート（降順）
    existingRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    
    // 保存
    await kvClient.set(KV_KEYS.WEIGHT_RECORDS, existingRecords)
    
    // 最新の記録も保存
    await kvClient.set(KV_KEYS.LATEST_WEIGHT, newRecord)
    
    return NextResponse.json(newRecord)
  } catch (error) {
    console.error("記録の保存エラー:", error)
    return NextResponse.json(
      { error: "記録の保存に失敗しました" },
      { status: 500 }
    )
  }
}