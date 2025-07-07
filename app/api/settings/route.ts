import { NextRequest, NextResponse } from "next/server"
import { kvClient } from "@/lib/kv-client"
import { userSettingsSchema } from "@/lib/schemas"
import { UserSettings } from "@/types"
import { KV_KEYS, DEFAULT_USER_ID } from "@/lib/constants"

export async function GET() {
  try {
    const settings = await kvClient.get<UserSettings>(KV_KEYS.USER_SETTINGS)
    
    if (!settings) {
      return NextResponse.json({ error: "設定が見つかりません" }, { status: 404 })
    }
    
    return NextResponse.json(settings)
  } catch (error) {
    console.error("設定の取得エラー:", error)
    return NextResponse.json(
      { error: "設定の取得に失敗しました" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = userSettingsSchema.parse(body)
    
    const settings: UserSettings = {
      id: DEFAULT_USER_ID,
      height: validatedData.height,
      initialWeight: validatedData.initialWeight,
      targetWeight: validatedData.targetWeight,
      targetDate: validatedData.targetDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    await kvClient.set(KV_KEYS.USER_SETTINGS, settings)
    
    return NextResponse.json(settings)
  } catch (error) {
    console.error("設定の保存エラー:", error)
    return NextResponse.json(
      { error: "設定の保存に失敗しました" },
      { status: 500 }
    )
  }
}