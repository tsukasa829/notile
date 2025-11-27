// 修了証書表示ページ
// /certificates/[id]

'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';

interface CertificateData {
  id: string;
  certificateNumber: string;
  issuedAt: string;
  completionDate: string;
  user: {
    id: string;
    displayName: string | null;
  };
  program: {
    id: string;
    title: string;
    description: string | null;
    category: string | null;
  };
}

export default function CertificatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const res = await fetch(`/api/certificates/${id}`);
        if (!res.ok) {
          throw new Error('Certificate not found');
        }
        const data = await res.json();
        setCertificate(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load certificate');
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">証書が見つかりません</h1>
          <Link href="/courses" className="text-blue-500 hover:underline">
            コース一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  const completionDate = new Date(certificate.completionDate).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const issuedDate = new Date(certificate.issuedAt).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* 証書カード */}
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden border-4 border-yellow-400">
          {/* ヘッダー装飾 */}
          <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 h-2" />
          
          <div className="p-8 sm:p-12 text-center">
            {/* トップデコレーション */}
            <div className="text-6xl mb-4">🏆</div>
            
            {/* タイトル */}
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
              修了証書
            </h1>
            <p className="text-gray-500 mb-8">Certificate of Completion</p>
            
            {/* 証書番号 */}
            <p className="text-sm text-gray-400 mb-8">
              証書番号: {certificate.certificateNumber}
            </p>

            {/* 授与者名 */}
            <div className="mb-8">
              <p className="text-gray-600 mb-2">この証書は</p>
              <p className="text-2xl sm:text-3xl font-bold text-indigo-600">
                {certificate.user.displayName || '受講者'}
              </p>
              <p className="text-gray-600 mt-2">殿に授与します</p>
            </div>

            {/* コース名 */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <p className="text-gray-500 text-sm mb-2">修了コース</p>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                {certificate.program.title}
              </h2>
              {certificate.program.category && (
                <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {certificate.program.category}
                </span>
              )}
            </div>

            {/* 修了日 */}
            <div className="mb-8">
              <p className="text-gray-600">
                上記コースの全課程を修了したことを証します
              </p>
              <p className="text-lg font-semibold text-gray-700 mt-4">
                修了日: {completionDate}
              </p>
            </div>

            {/* 発行情報 */}
            <div className="border-t pt-6">
              <p className="text-sm text-gray-400">
                発行日: {issuedDate}
              </p>
              <p className="text-lg font-semibold text-indigo-600 mt-2">
                NextQuest
              </p>
            </div>
          </div>

          {/* フッター装飾 */}
          <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 h-2" />
        </div>

        {/* アクションボタン */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
          <button
            onClick={() => window.print()}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            🖨️ 印刷 / PDF保存
          </button>
          
          <button
            onClick={() => {
              const text = `${certificate.program.title}を修了しました！ #NextQuest`;
              const url = window.location.href;
              window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
            }}
            className="px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors flex items-center justify-center gap-2"
          >
            𝕏 シェア
          </button>

          <Link
            href="/courses"
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
          >
            ← コース一覧
          </Link>
        </div>
      </div>
    </div>
  );
}
