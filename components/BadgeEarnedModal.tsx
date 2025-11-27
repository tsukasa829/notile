// バッジ獲得モーダル
// コース完了時などにバッジ獲得を祝うモーダル

'use client';

import { useEffect, useState } from 'react';

interface Badge {
  id: string;
  name: string;
  description: string | null;
  iconUrl: string | null;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface BadgeEarnedModalProps {
  badge: Badge;
  onClose: () => void;
}

const rarityColors = {
  common: 'from-gray-400 to-gray-600',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-yellow-400 to-yellow-600',
};

const rarityLabels = {
  common: 'コモン',
  rare: 'レア',
  epic: 'エピック',
  legendary: 'レジェンダリー',
};

const rarityGlow = {
  common: 'shadow-gray-400/50',
  rare: 'shadow-blue-400/50',
  epic: 'shadow-purple-400/50',
  legendary: 'shadow-yellow-400/50',
};

export default function BadgeEarnedModal({ badge, onClose }: BadgeEarnedModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // アニメーション開始
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleClose}
    >
      {/* オーバーレイ */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      {/* モーダルコンテンツ */}
      <div 
        className={`relative bg-white rounded-2xl p-8 max-w-sm w-full mx-4 transform transition-all duration-500 ${
          isVisible ? 'scale-100 translate-y-0' : 'scale-75 translate-y-10'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* キラキラエフェクト */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          <div className="absolute -top-2 -left-2 text-4xl animate-ping opacity-50">✨</div>
          <div className="absolute -top-1 -right-3 text-3xl animate-ping opacity-50" style={{ animationDelay: '0.5s' }}>✨</div>
          <div className="absolute -bottom-1 -left-1 text-3xl animate-ping opacity-50" style={{ animationDelay: '1s' }}>✨</div>
          <div className="absolute -bottom-2 -right-2 text-4xl animate-ping opacity-50" style={{ animationDelay: '0.3s' }}>✨</div>
        </div>

        {/* タイトル */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">🎉 バッジ獲得！</h2>
          <p className="text-gray-500 text-sm mt-1">新しいバッジを手に入れました</p>
        </div>

        {/* バッジ表示 */}
        <div className={`mx-auto w-32 h-32 rounded-full bg-gradient-to-br ${rarityColors[badge.rarity]} p-1 shadow-2xl ${rarityGlow[badge.rarity]} animate-bounce`}>
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
            <span className="text-6xl">{badge.iconUrl || '🎖️'}</span>
          </div>
        </div>

        {/* バッジ情報 */}
        <div className="text-center mt-6">
          <h3 className="text-xl font-bold text-gray-800">{badge.name}</h3>
          <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${rarityColors[badge.rarity]} text-white`}>
            {rarityLabels[badge.rarity]}
          </span>
          {badge.description && (
            <p className="text-gray-600 text-sm mt-3">{badge.description}</p>
          )}
        </div>

        {/* 閉じるボタン */}
        <button
          onClick={handleClose}
          className="w-full mt-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          やったね！
        </button>
      </div>
    </div>
  );
}
