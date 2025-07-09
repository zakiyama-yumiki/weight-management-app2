import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Link from "next/link"
import { MobileNav } from "@/components/MobileNav"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "体重管理アプリ",
  description: "個人用体重管理アプリケーション",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <header className="bg-primary text-primary-foreground sticky top-0 z-40">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <Link href="/" className="text-xl md:text-2xl font-bold hover:opacity-80">
                  体重管理アプリ
                </Link>
                <nav className="hidden md:flex space-x-4">
                  <Link href="/" className="hover:underline">
                    ダッシュボード
                  </Link>
                  <Link href="/record" className="hover:underline">
                    記録
                  </Link>
                  <Link href="/history" className="hover:underline">
                    履歴
                  </Link>
                  <Link href="/charts" className="hover:underline">
                    グラフ
                  </Link>
                  <Link href="/goals" className="hover:underline">
                    目標
                  </Link>
                </nav>
                <MobileNav />
              </div>
            </div>
          </header>
          <main className="flex-1 container mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="bg-muted py-4">
            <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
              © 2024 体重管理アプリ
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}