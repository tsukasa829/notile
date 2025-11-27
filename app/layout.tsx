import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NextQuest - 目標達成支援プラットフォーム",
  description: "AIとコミュニティの力で人生をゲームのように攻略する",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 min-h-screen text-white">
        <nav className="border-b border-primary-700/50 bg-primary-900/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
                  NextQuest
                </h1>
              </div>
              <div className="flex gap-4">
                <a href="/" className="px-4 py-2 text-sm font-medium text-blue-100 hover:text-white transition-colors">
                  ホーム
                </a>
                <a href="/dashboard" className="px-4 py-2 text-sm font-medium bg-blue-gradient rounded-lg hover:opacity-90 transition-opacity">
                  はじめる
                </a>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
