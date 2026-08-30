import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { recommendNextQuest } from '../../utils/aiAssistant';
import { DIFFICULTY_INFO, IMPORTANCE_INFO } from '../../utils/constants';
import { X, Dices, Play, CheckCircle2, Sparkles, Clock, Star, Zap } from 'lucide-react';
import { soundManager } from '../../utils/audio';

export const WhatShouldIDoModal: React.FC = () => {
  const { isWhatShouldIDoOpen, setIsWhatShouldIDoOpen, quests, startQuest, completeQuest, setIsAddModalOpen } = useApp();

  const recommendation = useMemo(() => {
    return recommendNextQuest(quests);
  }, [quests, isWhatShouldIDoOpen]);

  if (!isWhatShouldIDoOpen) return null;

  const quest = recommendation.quest;
  const diff = quest ? DIFFICULTY_INFO[quest.difficulty] : null;
  const imp = quest ? IMPORTANCE_INFO[quest.importance] : null;

  const handleStart = () => {
    if (!quest) return;
    startQuest(quest.id);
    setIsWhatShouldIDoOpen(false);
  };

  const handleComplete = (e: React.MouseEvent) => {
    if (!quest) return;
    const rect = e.currentTarget.getBoundingClientRect();
    completeQuest(quest.id, { x: rect.left + 20, y: rect.top });
    setIsWhatShouldIDoOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="pixel-box w-full max-w-md bg-white overflow-hidden shadow-pixel-lg">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-amber-100 via-yellow-100 to-orange-100 border-b-2 border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl animate-spin" style={{ animationDuration: '8s' }}>🎲</span>
            <h2 className="font-pixel text-sm font-bold text-slate-800">
              오늘 뭐 하지? (SMART ADVISOR)
            </h2>
          </div>
          <button
            onClick={() => setIsWhatShouldIDoOpen(false)}
            className="p-1 rounded-lg hover:bg-white/60 text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-center">
          {quest ? (
            <>
              {/* Bunny Avatar with speech */}
              <div className="flex flex-col items-center">
                <div className="text-4xl animate-bounce-short mb-2">🐰</div>
                <div className="p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-300 shadow-sm text-left w-full space-y-2 relative">
                  <div className="font-bold text-xs sm:text-sm text-amber-950 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600 fill-amber-500" />
                    <span>{recommendation.headline}</span>
                  </div>
                  <p className="text-xs text-amber-900 leading-relaxed font-medium">
                    {recommendation.reason}
                  </p>
                </div>
              </div>

              {/* Quest Detail Card */}
              <div className="p-4 rounded-xl border-2 border-slate-700 bg-slate-50 text-left space-y-2.5 shadow-pixel-sm">
                <div className="font-bold text-sm text-slate-800 flex items-center justify-between">
                  <span>{quest.title}</span>
                  <span className="font-pixel text-xs text-pink-600 font-bold bg-pink-100 px-2 py-0.5 rounded">
                    +{quest.xp || 20} XP
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-medium">
                    📂 {quest.category}
                  </span>
                  {diff && (
                    <span className={`px-2 py-0.5 rounded font-medium border ${diff.color}`}>
                      {diff.dot} {diff.label}
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{quest.estimatedMinutes}분</span>
                  </span>
                  {imp && quest.importance !== 'NORMAL' && (
                    <span className={`px-2 py-0.5 rounded font-semibold border ${imp.color}`}>
                      {imp.label}
                    </span>
                  )}
                </div>

                {quest.notes && (
                  <div className="text-[11px] text-slate-600 bg-white p-2 rounded border">
                    📌 {quest.notes}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleStart}
                  className="pixel-btn flex-1 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-pixel text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Play className="w-4 h-4 fill-slate-900" />
                  <span>지금 바로 시작하기</span>
                </button>

                <button
                  onClick={handleComplete}
                  className="pixel-btn flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-pixel text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>이미 완료했어요!</span>
                </button>
              </div>
            </>
          ) : (
            <div className="py-4 space-y-3">
              <div className="text-5xl">🎉</div>
              <h3 className="font-pixel text-sm font-bold text-slate-800">
                {recommendation.headline}
              </h3>
              <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                {recommendation.reason}
              </p>
              <button
                onClick={() => {
                  setIsWhatShouldIDoOpen(false);
                  setIsAddModalOpen(true);
                }}
                className="pixel-btn px-4 py-2 rounded-xl bg-pink-500 text-white font-pixel text-xs font-bold"
              >
                ＋ 새 퀘스트 추가하기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
