'use client';

import { useEffect, useState } from 'react';
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

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          setCourses(data.courses);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">📚 コース一覧</h1>
        
        {courses.length === 0 ? (
          <div className="bg-white/10 backdrop-blur rounded-xl p-8 text-center">
            <p className="text-white/70 text-lg">コースがまだありません</p>
            <p className="text-white/50 mt-2">管理者がコースを追加するまでお待ちください</p>
          </div>
        ) : (
          <div className="space-y-4">
            {courses.map(course => (
              <Link 
                key={course.id} 
                href={`/courses/${course.id}`}
                className="block"
              >
                <div className="bg-white/10 backdrop-blur rounded-xl p-6 hover:bg-white/20 transition-all cursor-pointer border border-white/10 hover:border-white/30">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-xl font-semibold text-white">{course.title}</h2>
                        {course.isFree && (
                          <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-sm rounded-full border border-green-500/30">
                            Free
                          </span>
                        )}
                      </div>
                      {course.description && (
                        <p className="text-white/70 mb-3">{course.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-white/50">
                        <span>👥 {course.enrollmentCount}人が受講中</span>
                        {course.category && (
                          <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded">
                            {course.category}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-white/30 text-2xl">→</div>
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
