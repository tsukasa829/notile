// マイ修了証書一覧ページ
// /certificates

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface CertificateItem {
  id: string;
  certificateNumber: string;
  issuedAt: string;
  completionDate: string;
  program: {
    id: string;
    title: string;
    category: string | null;
  };
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await fetch('/api/certificates');
        if (res.ok) {
          const data = await res.json();
          setCertificates(data);
        }
      } catch (error) {
        console.error('Failed to fetch certificates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">🏆 修了証書</h1>
        <p className="text-gray-600 mb-8">あなたが取得した修了証書の一覧です</p>

        {certificates.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-6xl mb-4">📜</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              まだ修了証書がありません
            </h2>
            <p className="text-gray-500 mb-6">
              コースを完了すると修了証書が発行されます
            </p>
            <Link
              href="/courses"
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              コースを探す
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {certificates.map((cert) => (
              <Link
                key={cert.id}
                href={`/certificates/${cert.id}`}
                className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border-l-4 border-yellow-400"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-4xl">🏆</span>
                    {cert.program.category && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {cert.program.category}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {cert.program.title}
                  </h3>
                  
                  <p className="text-sm text-gray-500 mb-4">
                    修了日: {new Date(cert.completionDate).toLocaleDateString('ja-JP')}
                  </p>
                  
                  <div className="flex items-center text-indigo-600 text-sm font-medium">
                    証書を見る →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
