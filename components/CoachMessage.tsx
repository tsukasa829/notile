'use client';

import { useEffect, useState } from 'react';

type Props = {
  message: string;
  xpGain: number | null;
};

export default function CoachMessage({ message, xpGain }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // アニメーション用に少し遅延
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`
        bg-gradient-to-r from-yellow-500/20 to-orange-500/20 
        border border-yellow-500/30 rounded-xl p-6 mb-6
        transform transition-all duration-500
        ${visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
      `}
    >
      <div className="flex items-start gap-4">
        <div className="text-4xl">🧑‍🏫</div>
        <div className="flex-1">
          <div className="text-yellow-300 font-semibold mb-1">コーチより</div>
          <p className="text-white text-lg">{message}</p>
          {xpGain && (
            <div className="mt-3 inline-block px-3 py-1 bg-blue-500/30 rounded-full">
              <span className="text-blue-300 font-semibold">+{xpGain} XP</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
