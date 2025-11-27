'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Confetti from '@/components/Confetti';
import CoachMessage from '@/components/CoachMessage';

type Mission = {
  id: string;
  programId: string;
  orderIndex: number;
  title: string;
  content: string | null;
  resourceUrl: string | null;
  estimatedMinutes: number | null;
  isCompleted: boolean;
};

export default function MissionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [mission, setMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [coachMessage, setCoachMessage] = useState<string | null>(null);
  const [xpGain, setXpGain] = useState<number | null>(null);

  useEffect(() => {
    if (!params.id || !params.missionId) return;

    fetch(`/api/courses/${params.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          const foundMission = data.missions.find(
            (m: Mission) => m.id === params.missionId
          );
          setMission(foundMission || null);
        }
      })
      .finally(() => setLoading(false));
  }, [params.id, params.missionId]);

  const handleComplete = useCallback(async () => {
    if (completing || !mission) return;

    setCompleting(true);
    try {
      const res = await fetch(
        `/api/courses/${params.id}/missions/${params.missionId}/complete`,
        { method: 'POST' }
      );
      const data = await res.json();

      if (data.ok && !data.alreadyCompleted) {
        // 🎉 演出開始
        setShowConfetti(true);
        setCoachMessage(data.coachMessage);
        setXpGain(data.xpGain);
        setMission(prev => prev ? { ...prev, isCompleted: true } : null);

        // 3秒後にコンフェッティを停止
        setTimeout(() => setShowConfetti(false), 3000);

        // コース完了時
        if (data.isCourseCompleted) {
          setTimeout(() => {
            alert('🎊 コースを完了しました！おめでとうございます！');
            router.push(`/courses/${params.id}`);
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Complete failed:', error);
    } finally {
      setCompleting(false);
    }
  }, [completing, mission, params.id, params.missionId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">読み込み中...</div>
      </div>
    );
  }

  if (!mission) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">ミッションが見つかりません</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8">
      {/* コンフェッティ */}
      {showConfetti && <Confetti />}

      <div className="max-w-3xl mx-auto">
        {/* 戻るリンク */}
        <Link 
          href={`/courses/${params.id}`} 
          className="text-blue-400 hover:text-blue-300 mb-6 inline-block"
        >
          ← コースに戻る
        </Link>

        {/* ミッションヘッダー */}
        <div className="bg-white/10 backdrop-blur rounded-xl p-8 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className={`
              w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold
              ${mission.isCompleted 
                ? 'bg-green-500 text-white' 
                : 'bg-blue-500 text-white'}
            `}>
              {mission.isCompleted ? '✓' : mission.orderIndex + 1}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{mission.title}</h1>
              {mission.estimatedMinutes && (
                <span className="text-white/50 text-sm">
                  ⏱ 約{mission.estimatedMinutes}分
                </span>
              )}
            </div>
          </div>

          {mission.isCompleted && (
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 mb-4">
              <span className="text-green-400">✨ このミッションは完了済みです</span>
            </div>
          )}
        </div>

        {/* ミッション内容 */}
        <div className="bg-white/10 backdrop-blur rounded-xl p-8 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">📝 ミッション内容</h2>
          {mission.content ? (
            <div className="text-white/80 whitespace-pre-wrap">
              {mission.content}
            </div>
          ) : (
            <p className="text-white/50">内容がありません</p>
          )}

          {mission.resourceUrl && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <h3 className="text-white/70 text-sm mb-2">📚 参考リソース</h3>
              <a 
                href={mission.resourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                {mission.resourceUrl}
              </a>
            </div>
          )}
        </div>

        {/* コーチメッセージ */}
        {coachMessage && (
          <CoachMessage message={coachMessage} xpGain={xpGain} />
        )}

        {/* 完了ボタン */}
        {!mission.isCompleted && (
          <button
            onClick={handleComplete}
            disabled={completing}
            className={`
              w-full py-4 rounded-xl text-lg font-semibold transition-all
              ${completing 
                ? 'bg-gray-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white shadow-lg hover:shadow-green-500/25'}
            `}
          >
            {completing ? '処理中...' : '✓ ミッション完了！'}
          </button>
        )}
      </div>
    </div>
  );
}
