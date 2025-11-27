// バッジ一覧ページ
// /badges

'use client';

import BadgeList from '@/components/BadgeList';
import Link from 'next/link';

export default function BadgesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">🎖️ マイバッジ</h1>
        <p className="text-gray-600 mb-8">あなたが獲得したバッジコレクション</p>

        <div className="bg-white rounded-lg shadow-md p-6">
          <BadgeList showEmpty={true} />
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/courses"
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            ← コース一覧に戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
