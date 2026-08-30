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
    <div className="pixel-box today-focus p-5 sm:p-6 bg-white relative overflow-hidden">
      {/* Background soft decorative sparkle */}
      <div className="absolute top-3 right-4 text-[#edc6d5]/60 text-4xl select-none pointer-events-none">
        🌱
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌱</span>
          <h2 className="font-pixel text-sm font-bold text-slate-800 tracking-wider">
            TODAY PROGRESS
          </h2>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#eaf6ef] text-[#3e8161] border border-[#cfe9d9] text-[11px] font-bold font-pixel">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          {todayCompletedQuests.length} / {todayQuests.length} 완료 ({todayProgressPercentage}%)
        </div>
      </div>

      {/* Progress Bar */}
      <div className="my-3">
        <div className="pixel-progress-outer h-3.5 w-full bg-slate-100 p-0.5">
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
      <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#fff7df] border border-[#f1ddae] text-xs text-[#806c4b] font-medium mb-4">
        <span className="text-sm">🐰</span>
        <span className="italic flex-1">{ENCOURAGING_QUOTES[quoteIndex]}</span>
        <span className="text-[11px] font-pixel font-bold text-[#a45f80] bg-[#fce9f0] px-2 py-1 rounded-lg border border-[#f2cbd9]">
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
          className="pixel-btn group flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#fff2d4] text-[#80602a] border border-[#f0d9a0] font-bold text-xs"
        >
          <Dices className="w-4 h-4 text-amber-700 transition-transform group-hover:rotate-12" />
          <span>오늘 뭐 하지? 🎲</span>
        </button>

        {/* Quest Templates Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            setIsTemplateModalOpen(true);
          }}
          className="pixel-btn group flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#f2ecfb] text-[#75639a] border border-[#ddd2f1] font-bold text-xs"
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
          className="pixel-btn group flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#e7f4f8] text-[#4c7887] border border-[#c8e3eb] font-bold text-xs"
        >
          <Wand2 className="w-4 h-4 text-sky-600" />
          <span>AI 퀘스트 분해 🤖</span>
        </button>
      </div>
    </div>
  );
};
