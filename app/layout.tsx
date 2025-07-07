import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Link from "next/link"
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
          <header className="bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold hover:opacity-80">
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
                </nav>
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