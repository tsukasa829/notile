'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

type Course = {
  id: string;
  title: string;
  description: string | null;
  isPublic: boolean;
  isFree: boolean;
  category: string | null;
  createdAt: string;
  enrollmentCount: number;
};

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

type Enrollment = {
  id: string;
  userId: string;
  programId: string;
  status: 'active' | 'completed' | 'dropped';
  startedAt: string;
  completedAt: string | null;
};

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [progressPercent, setProgressPercent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;

    fetch(`/api/courses/${params.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          setCourse(data.course);
          setMissions(data.missions);
          setEnrollment(data.enrollment);
          setProgressPercent(data.progressPercent);
        }
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleEnroll = async () => {
    const res = await fetch(`/api/courses/${params.id}/enroll`, {
      method: 'POST',
    });
    const data = await res.json();
    if (data.ok) {
      setEnrollment(data.enrollment);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">読み込み中...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">コースが見つかりません</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* 戻るリンク */}
        <Link href="/courses" className="text-blue-400 hover:text-blue-300 mb-6 inline-block">
          ← コース一覧に戻る
        </Link>

        {/* コースヘッダー */}
        <div className="bg-white/10 backdrop-blur rounded-xl p-8 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">{course.title}</h1>
                {course.isFree && (
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full border border-green-500/30">
                    Free
                  </span>
                )}
              </div>
              {course.description && (
                <p className="text-white/70 text-lg">{course.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6 text-white/60">
            <span>👥 {course.enrollmentCount}人が受講中</span>
            <span>📝 {missions.length}ミッション</span>
          </div>

          {/* 進捗バー */}
          {enrollment && (
            <div className="mt-6">
              <div className="flex justify-between text-sm text-white/60 mb-2">
                <span>進捗</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* 受講開始ボタン */}
          {!enrollment && (
            <button
              onClick={handleEnroll}
              className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors"
            >
              このコースを受講する
            </button>
          )}
        </div>

        {/* ミッション一覧 */}
        <h2 className="text-xl font-semibold text-white mb-4">📋 ミッション一覧</h2>
        <div className="space-y-3">
          {missions.map((mission, index) => (
            <Link 
              key={mission.id}
              href={enrollment ? `/courses/${course.id}/missions/${mission.id}` : '#'}
              className={`block ${!enrollment ? 'pointer-events-none opacity-50' : ''}`}
            >
              <div className={`
                bg-white/10 backdrop-blur rounded-xl p-5 border transition-all
                ${mission.isCompleted 
                  ? 'border-green-500/50 bg-green-500/10' 
                  : 'border-white/10 hover:border-white/30 hover:bg-white/15'}
              `}>
                <div className="flex items-center gap-4">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold
                    ${mission.isCompleted 
                      ? 'bg-green-500 text-white' 
                      : 'bg-white/20 text-white/70'}
                  `}>
                    {mission.isCompleted ? '✓' : index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-medium">{mission.title}</h3>
                    {mission.estimatedMinutes && (
                      <span className="text-white/50 text-sm">
                        ⏱ 約{mission.estimatedMinutes}分
                      </span>
                    )}
                  </div>
                  {mission.isCompleted && (
                    <span className="text-green-400 text-sm">完了 ✨</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {missions.length === 0 && (
          <div className="bg-white/10 backdrop-blur rounded-xl p-8 text-center">
            <p className="text-white/70">このコースにはまだミッションがありません</p>
          </div>
        )}
      </div>
    </div>
  );
}
