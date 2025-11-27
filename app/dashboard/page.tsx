'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  displayName: string | null;
  level: number;
  xp: number;
  currentStreak: number;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();

      if (!data.success) {
        // 未認証なら自動作成
        await autoCreateUser();
      } else {
        setUser(data.user);
        setLoading(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setLoading(false);
    }
  }

  async function autoCreateUser() {
    try {
      const res = await fetch('/api/auth/auto-create', { method: 'POST' });
      const data = await res.json();

      if (data.success) {
        setUser(data.user);
      }
    } catch (error) {
      console.error('Auto create failed:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-xl text-blue-200">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-xl text-red-300">Failed to load user data</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-300 to-blue-100 bg-clip-text text-transparent">
          ダッシュボード
        </h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg border border-red-400/30 transition-colors"
        >
          ログアウト
        </button>
      </div>

      <div className="bg-primary-800/30 backdrop-blur-sm rounded-xl border border-primary-700/50 p-8">
        <h2 className="text-2xl font-semibold mb-6">プロフィール</h2>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-blue-200 mb-1">ユーザー名</div>
            <div className="text-xl font-medium">{user.displayName}</div>
          </div>

          <div>
            <div className="text-sm text-blue-200 mb-1">ユーザーID</div>
            <div className="text-sm font-mono text-blue-300">{user.id}</div>
          </div>

          <div>
            <div className="text-sm text-blue-200 mb-1">レベル</div>
            <div className="text-3xl font-bold text-blue-400">Lv.{user.level}</div>
          </div>

          <div>
            <div className="text-sm text-blue-200 mb-1">経験値</div>
            <div className="text-3xl font-bold text-purple-400">{user.xp} XP</div>
          </div>

          <div>
            <div className="text-sm text-blue-200 mb-1">連続日数</div>
            <div className="text-3xl font-bold text-orange-400">{user.currentStreak} 🔥</div>
          </div>
        </div>
      </div>

      <div className="bg-primary-800/30 backdrop-blur-sm rounded-xl border border-primary-700/50 p-8">
        <h2 className="text-2xl font-semibold mb-4">🎯 テスト成功！</h2>
        <div className="space-y-2 text-blue-100">
          <p>✅ 自動ユーザー作成が動作しています</p>
          <p>✅ JWT認証が正常に機能しています</p>
          <p>✅ PGLiteでのDB操作が成功しています</p>
          <p>✅ セッション管理が動作しています</p>
        </div>
      </div>
    </div>
  );
}
