import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Trophy, Gift, ArrowRight } from 'lucide-react';
import { soundManager } from '../../utils/audio';

export const LevelUpModal: React.FC = () => {
  const { isLevelUpOpen, setIsLevelUpOpen, levelUpData, setActiveTab } = useApp();

  if (!isLevelUpOpen || !levelUpData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3e3a4f]/55 backdrop-blur-sm animate-fadeIn">
      <div className="pixel-box w-full max-w-sm bg-white overflow-hidden text-center p-6 space-y-4 shadow-xl border-2 border-[#efb2cb]">
        {/* Celebration Banner */}
        <div className="text-5xl animate-bounce-short">🎉</div>

        <div className="space-y-1">
          <h2 className="font-pixel text-xl font-bold text-[#b45f89] tracking-wider">
            LEVEL UP!
          </h2>
          <p className="text-xs text-slate-500 font-pixel">
            업무 레벨이 한 단계 성장했습니다!
          </p>
        </div>

        {/* Level Transition Pill */}
        <div className="flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-[#fff2f5] border border-[#f2cad9]">
          <div className="font-pixel text-lg font-bold text-slate-500">
            Lv.{levelUpData.oldLevel}
          </div>
          <ArrowRight className="w-5 h-5 text-pink-500 stroke-[3]" />
          <div className="font-pixel text-2xl font-bold text-pink-600 animate-pulse">
            Lv.{levelUpData.newLevel}
          </div>
        </div>

        {/* New Title */}
        <div className="p-2.5 rounded-xl bg-[#f1ecfb] border border-[#ddd2f1]">
          <div className="text-[10px] text-[#8e78b7] font-pixel font-bold">새로운 칭호 획득</div>
          <div className="text-sm font-bold text-[#66527f] mt-0.5">
            {levelUpData.newTitle}
          </div>
        </div>

        {/* Unlocked Items announcement if any */}
        {levelUpData.unlockedItems.length > 0 && (
          <div className="p-2.5 rounded-xl bg-[#fff7df] border border-[#f1ddae] text-xs font-medium text-[#806c4b] flex items-center justify-center gap-1.5">
            <Gift className="w-4 h-4 text-amber-600" />
            <span>새로운 토끼 꾸미기 아이템이 해금되었습니다! 🎁</span>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          {levelUpData.unlockedItems.length > 0 && (
            <button
              onClick={() => {
                setIsLevelUpOpen(false);
                setActiveTab('character');
              }}
              className="pixel-btn flex-1 py-2.5 rounded-xl bg-[#c8b7e8] hover:bg-[#b8a5df] text-[#59486e] font-pixel text-xs font-bold"
            >
              드레스룸 가기 🐰
            </button>
          )}

          <button
            onClick={() => setIsLevelUpOpen(false)}
            className="pixel-btn flex-1 py-2.5 rounded-xl bg-[#ed93b8] hover:bg-[#df7faa] text-white font-pixel text-xs font-bold"
          >
            확인 ✨
          </button>
        </div>
      </div>
    </div>
  );
};
