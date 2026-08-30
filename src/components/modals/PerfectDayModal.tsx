import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Flame, CheckCircle2, Trophy } from 'lucide-react';

export const PerfectDayModal: React.FC = () => {
  const { isPerfectDayOpen, setIsPerfectDayOpen, todayEarnedXp, profile } = useApp();

  if (!isPerfectDayOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="pixel-box w-full max-w-sm bg-white overflow-hidden text-center p-6 space-y-4 shadow-pixel-lg border-4 border-emerald-400">
        <div className="text-5xl animate-bounce-short">💯</div>

        <div className="space-y-1">
          <h2 className="font-pixel text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 tracking-wider">
            PERFECT DAY!
          </h2>
          <p className="text-xs text-slate-600 font-medium">
            오늘 배정된 모든 퀘스트를 100% 완료했습니다!
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
            <div className="text-[10px] text-amber-700 font-bold">오늘 획득 XP</div>
            <div className="font-pixel text-lg font-bold text-amber-800">
              +{todayEarnedXp} XP
            </div>
          </div>
          <div className="p-3 rounded-xl bg-orange-50 border border-orange-200">
            <div className="text-[10px] text-orange-700 font-bold">연속 스트릭</div>
            <div className="font-pixel text-lg font-bold text-orange-800 flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              <span>{profile.streak}일 달성</span>
            </div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-emerald-50 text-xs text-emerald-900 font-medium border border-emerald-200 flex items-center gap-2 text-left">
          <span className="text-2xl">🐰</span>
          <span>토끼가 펄쩍 뛰며 당신의 칼퇴를 응원하고 있어요! 정말 고생 많으셨습니다! ✨</span>
        </div>

        <button
          onClick={() => setIsPerfectDayOpen(false)}
          className="pixel-btn w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-pixel text-xs font-bold"
        >
          기분 좋게 마무리하기 🌙
        </button>
      </div>
    </div>
  );
};
