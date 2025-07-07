import { NextRequest, NextResponse } from "next/server"
import { kvClient } from "@/lib/kv-client"
import { WeightRecord } from "@/types"
import { KV_KEYS } from "@/lib/constants"

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const recordId = params.id
    
    // 既存の記録を取得
    const existingRecords = await kvClient.get<WeightRecord[]>(KV_KEYS.WEIGHT_RECORDS) || []
    
    // 指定されたIDの記録を削除
    const updatedRecords = existingRecords.filter(record => record.id !== recordId)
    
    if (updatedRecords.length === existingRecords.length) {
      return NextResponse.json(
        { error: "記録が見つかりません" },
        { status: 404 }
      )
    }
    
    // 更新された記録を保存
    await kvClient.set(KV_KEYS.WEIGHT_RECORDS, updatedRecords)
    
    // 最新の記録も更新
    if (updatedRecords.length > 0) {
      const latestRecord = updatedRecords[0]
      await kvClient.set(KV_KEYS.LATEST_WEIGHT, latestRecord)
    } else {
      await kvClient.del(KV_KEYS.LATEST_WEIGHT)
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("記録の削除エラー:", error)
    return NextResponse.json(
      { error: "記録の削除に失敗しました" },
      { status: 500 }
    )
  }
}