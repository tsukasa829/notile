// バッジ一覧コンポーネント
// プロフィールページなどで使用

'use client';

import { useEffect, useState } from 'react';

interface BadgeItem {
  id: string;
  earnedAt: string;
  badge: {
    id: string;
    name: string;
    description: string | null;
    iconUrl: string | null;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
  };
  program: {
    id: string;
    title: string;
  } | null;
}

const rarityColors = {
  common: 'bg-gray-100 border-gray-300 text-gray-700',
  rare: 'bg-blue-100 border-blue-400 text-blue-700',
  epic: 'bg-purple-100 border-purple-400 text-purple-700',
  legendary: 'bg-yellow-100 border-yellow-400 text-yellow-700',
};

const rarityLabels = {
  common: 'コモン',
  rare: 'レア',
  epic: 'エピック',
  legendary: 'レジェンダリー',
};

const rarityIcons = {
  common: '🥉',
  rare: '🥈',
  epic: '🥇',
  legendary: '💎',
};

interface BadgeListProps {
  showEmpty?: boolean;
}

export default function BadgeList({ showEmpty = true }: BadgeListProps) {
  const [badges, setBadges] = useState<BadgeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const res = await fetch('/api/badges');
        if (res.ok) {
          const data = await res.json();
          setBadges(data);
        }
      } catch (error) {
        console.error('Failed to fetch badges:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500" />
      </div>
    );
  }

  if (badges.length === 0) {
    if (!showEmpty) return null;
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="text-4xl mb-2">🎖️</div>
        <p>まだバッジを獲得していません</p>
        <p className="text-sm mt-1">コースを完了するとバッジがもらえます</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {badges.map((item) => (
        <div
          key={item.id}
          className={`relative p-4 rounded-lg border-2 ${rarityColors[item.badge.rarity]} transition-transform hover:scale-105`}
        >
          {/* レアリティラベル */}
          <div className="absolute -top-2 -right-2 text-lg">
            {rarityIcons[item.badge.rarity]}
          </div>

          {/* バッジアイコン */}
          <div className="text-4xl text-center mb-2">
            {item.badge.iconUrl || '🎖️'}
          </div>

          {/* バッジ名 */}
          <h4 className="font-bold text-sm text-center truncate">
            {item.badge.name}
          </h4>

          {/* コース名（あれば） */}
          {item.program && (
            <p className="text-xs text-center mt-1 truncate opacity-70">
              {item.program.title}
            </p>
          )}

          {/* レアリティ */}
          <p className="text-xs text-center mt-2 opacity-60">
            {rarityLabels[item.badge.rarity]}
          </p>

          {/* 獲得日 */}
          <p className="text-xs text-center mt-1 opacity-50">
            {new Date(item.earnedAt).toLocaleDateString('ja-JP')}
          </p>
        </div>
      ))}
    </div>
  );
}
