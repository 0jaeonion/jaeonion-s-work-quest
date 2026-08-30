import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Trophy, Lock, Sparkles, CheckCircle2, Gift, Filter } from 'lucide-react';

export const AchievementsView: React.FC = () => {
  const { achievements, profile } = useApp();
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;
  const progressPercent = Math.round((unlockedCount / achievements.length) * 100);

  const filteredAchievements = achievements.filter(ach => {
    if (filterCategory === 'ALL') return true;
    if (filterCategory === 'UNLOCKED') return ach.isUnlocked;
    if (filterCategory === 'LOCKED') return !ach.isUnlocked;
    return ach.category === filterCategory;
  });

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="pixel-box p-4 bg-gradient-to-r from-amber-100 via-yellow-100 to-pink-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-4xl animate-bounce-short">🏆</span>
          <div>
            <h2 className="font-pixel text-base font-bold text-slate-800">
              업적 퀘스트 & 트로피 룸
            </h2>
            <p className="text-xs text-slate-600">
              다양한 업무 챌린지를 달성하고 특별한 보너스 XP와 토끼 코스튬을 획득하세요!
            </p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xs px-4 py-2 rounded-xl border border-amber-300 text-center font-pixel">
          <div className="text-[10px] text-amber-800 font-bold">업적 해금 달성률</div>
          <div className="text-base font-bold text-amber-900">
            {unlockedCount} / {achievements.length} ({progressPercent}%)
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'ALL', label: '전체' },
          { id: 'UNLOCKED', label: '달성 완료 🌟' },
          { id: 'LOCKED', label: '도전 중 🔒' },
          { id: 'QUEST', label: '업무 퀘스트' },
          { id: 'STREAK', label: '스트릭' },
          { id: 'SPECIAL', label: '스페셜' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilterCategory(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-pixel whitespace-nowrap transition-all ${
              filterCategory === tab.id
                ? 'bg-slate-800 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredAchievements.map(ach => (
          <div
            key={ach.id}
            className={`pixel-box p-3.5 transition-all relative ${
              ach.isUnlocked
                ? 'bg-white border-amber-400 pixel-box-yellow shadow-pixel'
                : 'bg-slate-50 border-slate-300 opacity-60'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl border-2 flex-shrink-0 ${
                  ach.isUnlocked
                    ? 'bg-amber-50 border-amber-400 shadow-sm'
                    : 'bg-slate-200 border-slate-300 grayscale'
                }`}
              >
                {ach.isUnlocked ? ach.icon : '🔒'}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <h3
                    className={`font-bold text-xs truncate ${
                      ach.isUnlocked ? 'text-slate-800' : 'text-slate-500'
                    }`}
                  >
                    {ach.title}
                  </h3>
                  {ach.isUnlocked && (
                    <span className="text-[10px] font-pixel text-emerald-600 font-bold px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                      달성 ✨
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-600 leading-tight mb-2">
                  {ach.description}
                </p>

                {/* Rewards & Unlock Date */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] font-pixel">
                  <div className="flex items-center gap-1 text-amber-600 font-bold">
                    <span>⭐ +{ach.rewardXp} XP</span>
                    {ach.rewardItem && (
                      <span className="text-pink-600 ml-1">
                        🎁 {ach.rewardItem.icon} {ach.rewardItem.name}
                      </span>
                    )}
                  </div>

                  {ach.isUnlocked && ach.unlockedAt && (
                    <span className="text-slate-400">
                      {ach.unlockedAt.split('T')[0]}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
