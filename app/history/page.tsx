"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { WeightRecord } from "@/types"
import { getBMICategory } from "@/lib/calculations"

export default function HistoryPage() {
  const [records, setRecords] = useState<WeightRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await fetch("/api/records")
        if (response.ok) {
          const data = await response.json()
          setRecords(data)
        }
      } catch (error) {
        console.error("記録の取得エラー:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchRecords()
  }, [])

  const handleDelete = async (recordId: string) => {
    if (!confirm("この記録を削除しますか？")) return

    try {
      const response = await fetch(`/api/records/${recordId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setRecords(records.filter(record => record.id !== recordId))
      }
    } catch (error) {
      console.error("記録の削除エラー:", error)
    }
  }

  const getBMIVariant = (bmi: number): "default" | "secondary" | "destructive" => {
    if (bmi < 18.5) return "secondary"
    if (bmi < 25) return "default"
    return "destructive"
  }

  if (isLoading) {
    return (
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">記録履歴</h2>
        </div>
        <p className="text-center">読み込み中...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">記録履歴</h2>
        <p className="text-muted-foreground">
          これまでの体重記録を確認できます。
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>記録一覧</CardTitle>
          <CardDescription>
            過去の記録を新しい順に表示しています。
          </CardDescription>
        </CardHeader>
        <CardContent>
          {records.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              まだ記録がありません。
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>日付</TableHead>
                  <TableHead>体重 (kg)</TableHead>
                  <TableHead>BMI</TableHead>
                  <TableHead>筋肉量 (kg)</TableHead>
                  <TableHead>体脂肪率 (%)</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">
                      {format(new Date(record.date), "yyyy/MM/dd (E)", { locale: ja })}
                    </TableCell>
                    <TableCell>{record.weight.toFixed(1)}</TableCell>
                    <TableCell>
                      <Badge variant={getBMIVariant(record.bmi)}>
                        {record.bmi} ({getBMICategory(record.bmi)})
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {record.muscleWeight ? `${record.muscleWeight.toFixed(1)}` : "-"}
                    </TableCell>
                    <TableCell>
                      {record.bodyFatPercentage ? `${record.bodyFatPercentage.toFixed(1)}` : "-"}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(record.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        削除
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}