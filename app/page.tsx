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

export default async function Home() {
  const isSetupComplete = await checkInitialSetup()
  
  if (!isSetupComplete) {
    redirect("/setup")
  }
  
  const latestRecord = await getLatestRecord()
  
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-3xl font-bold mb-4">ダッシュボード</h2>
        <p className="text-muted-foreground">
          体重管理の進捗状況を確認できます。
        </p>
      </section>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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