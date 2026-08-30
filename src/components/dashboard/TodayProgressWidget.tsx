import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ENCOURAGING_QUOTES } from '../../utils/constants';
import { Sparkles, Dices, Layers, Wand2, CheckCircle2, Zap } from 'lucide-react';
import { soundManager } from '../../utils/audio';

export const TodayProgressWidget: React.FC = () => {
  const {
    todayQuests,
    todayCompletedQuests,
    todayProgressPercentage,
    todayEarnedXp,
    setIsWhatShouldIDoOpen,
    setIsTemplateModalOpen,
    setIsAiDecomposeOpen,
  } = useApp();

  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    // Change quote randomly on mount
    setQuoteIndex(Math.floor(Math.random() * ENCOURAGING_QUOTES.length));
  }, [todayCompletedQuests.length]);

  return (
    <div className="pixel-box p-4 bg-white relative overflow-hidden">
      {/* Background soft decorative sparkle */}
      <div className="absolute top-2 right-2 text-pink-200/40 text-4xl select-none pointer-events-none">
        🌱
      </div>

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌱</span>
          <h2 className="font-pixel text-sm font-bold text-slate-800 tracking-wider">
            TODAY PROGRESS
          </h2>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold font-pixel">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          {todayCompletedQuests.length} / {todayQuests.length} 완료 ({todayProgressPercentage}%)
        </div>
      </div>

      {/* Progress Bar */}
      <div className="my-3">
        <div className="pixel-progress-outer h-4 w-full bg-slate-100 p-0.5">
          <div
            className="pixel-progress-inner h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400 rounded-full flex items-center justify-end pr-1"
            style={{ width: `${Math.max(todayProgressPercentage, 2)}%` }}
          >
            {todayProgressPercentage >= 15 && (
              <span className="text-[9px] font-pixel text-white font-bold drop-shadow">
                {todayProgressPercentage}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Encouraging Quote Bubble */}
      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 font-medium mb-3">
        <span className="text-sm">🐰</span>
        <span className="italic flex-1">{ENCOURAGING_QUOTES[quoteIndex]}</span>
        <span className="text-[11px] font-pixel font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">
          +{todayEarnedXp} XP 획득
        </span>
      </div>

      {/* Action Quick Launchers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {/* "오늘 뭐 하지?" Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            setIsWhatShouldIDoOpen(true);
          }}
          className="pixel-btn flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-200 via-yellow-200 to-orange-200 text-slate-800 font-bold text-xs hover:brightness-105"
        >
          <Dices className="w-4 h-4 text-amber-700 animate-spin" style={{ animationDuration: '6s' }} />
          <span>오늘 뭐 하지? 🎲</span>
        </button>

        {/* Quest Templates Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            setIsTemplateModalOpen(true);
          }}
          className="pixel-btn flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-100 to-pink-100 text-purple-900 font-bold text-xs hover:brightness-105"
        >
          <Layers className="w-4 h-4 text-purple-600" />
          <span>업무 템플릿 📦</span>
        </button>

        {/* AI Task Decomposer Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            setIsAiDecomposeOpen(true);
          }}
          className="pixel-btn flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-sky-100 to-indigo-100 text-sky-900 font-bold text-xs hover:brightness-105"
        >
          <Wand2 className="w-4 h-4 text-sky-600" />
          <span>AI 퀘스트 분해 🤖</span>
        </button>
      </div>
    </div>
  );
};
