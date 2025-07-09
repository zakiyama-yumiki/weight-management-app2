import { redirect } from "next/navigation"
import Link from "next/link"
import { kvClient } from "@/lib/kv-client"
import { UserSettings, WeightRecord } from "@/types"
import { KV_KEYS } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import { getBMICategory } from "@/lib/calculations"
import { ProgressCard } from "@/components/ProgressCard"
import { calculateProgress, getProgressMessage } from "@/lib/progress-utils"

async function checkInitialSetup() {
  try {
    const settings = await kvClient.get<UserSettings>(KV_KEYS.USER_SETTINGS)
    return !!settings
  } catch (error) {
    console.error("設定の確認エラー:", error)
    return false
  }
}

async function getLatestRecord() {
  try {
    const record = await kvClient.get<WeightRecord>(KV_KEYS.LATEST_WEIGHT)
    return record
  } catch (error) {
    console.error("最新記録の取得エラー:", error)
    return null
  }
}

async function getRecordsAndSettings() {
  try {
    const [settings, records] = await Promise.all([
      kvClient.get<UserSettings>(KV_KEYS.USER_SETTINGS),
      kvClient.get<WeightRecord[]>(KV_KEYS.WEIGHT_RECORDS)
    ])
    return { settings, records: records || [] }
  } catch (error) {
    console.error("データ取得エラー:", error)
    return { settings: null, records: [] }
  }
}

export default async function Home() {
  const isSetupComplete = await checkInitialSetup()
  
  if (!isSetupComplete) {
    redirect("/setup")
  }
  
  const latestRecord = await getLatestRecord()
  const { settings, records } = await getRecordsAndSettings()
  
  let progressData = null
  if (settings && records.length > 0) {
    const progress = calculateProgress(records, settings)
    const message = getProgressMessage(progress.progressPercentage, progress.isOnTrack)
    progressData = { ...progress, message }
  }
  
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <section className="text-center">
        <h2 className="text-3xl font-bold mb-4">ダッシュボード</h2>
        <p className="text-muted-foreground">
          体重管理の進捗状況を確認できます。
        </p>
      </section>

      {progressData && settings && (
        <ProgressCard
          currentWeight={progressData.currentWeight}
          targetWeight={settings.targetWeight}
          progressPercentage={progressData.progressPercentage}
          remainingWeight={progressData.remainingWeight}
          weeklyPace={progressData.weeklyPace}
          monthlyPace={progressData.monthlyPace}
          expectedCompletionDate={progressData.expectedCompletionDate}
          daysRemaining={progressData.daysRemaining}
          isOnTrack={progressData.isOnTrack}
          message={progressData.message}
        />
      )}

      <div className="space-y-6 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>最新記録</CardTitle>
            <CardDescription>
              最後に記録された体重データ
            </CardDescription>
          </CardHeader>
          <CardContent>
            {latestRecord ? (
              <div className="space-y-2">
                <div className="text-2xl font-bold">{latestRecord.weight.toFixed(1)} kg</div>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(latestRecord.date), "yyyy/MM/dd (E)", { locale: ja })}
                </div>
                <Badge variant={latestRecord.bmi < 18.5 ? "secondary" : latestRecord.bmi < 25 ? "default" : "destructive"}>
                  BMI {latestRecord.bmi} ({getBMICategory(latestRecord.bmi)})
                </Badge>
              </div>
            ) : (
              <p className="text-muted-foreground">まだ記録がありません</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>クイックアクション</CardTitle>
            <CardDescription>
              よく使う機能にすばやくアクセス
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/record" className="block">
              <Button className="w-full">体重を記録</Button>
            </Link>
            <Link href="/history" className="block">
              <Button variant="outline" className="w-full">記録履歴</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}