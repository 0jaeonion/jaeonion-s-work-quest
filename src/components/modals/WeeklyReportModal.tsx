import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { generateWeeklyReport } from '../../utils/aiAssistant';
import { X, Sparkles, Trophy, Flame, CheckCircle2, Calendar, Zap, Bot } from 'lucide-react';

export const WeeklyReportModal: React.FC = () => {
  const { isWeeklyReportOpen, setIsWeeklyReportOpen, quests, profile } = useApp();

  const report = useMemo(() => {
    return generateWeeklyReport(quests, profile);
  }, [quests, profile, isWeeklyReportOpen]);

  if (!isWeeklyReportOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="pixel-box w-full max-w-md bg-white overflow-hidden shadow-pixel-lg">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-pink-100 via-purple-100 to-sky-100 border-b-2 border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📊</span>
            <h2 className="font-pixel text-sm font-bold text-slate-800">
              AI 주간 업무 리포트 (WEEKLY REPORT)
            </h2>
          </div>
          <button
            onClick={() => setIsWeeklyReportOpen(false)}
            className="p-1 rounded-lg hover:bg-white/60 text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Report Content */}
        <div className="p-4 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-pink-50 border border-pink-200 text-center">
              <div className="text-[11px] text-pink-700 font-bold">주간 완료 퀘스트</div>
              <div className="font-pixel text-xl font-bold text-pink-900 mt-0.5">
                {report.completedTasksThisWeek}개
              </div>
              <div className="text-[10px] text-pink-600 font-pixel">
                완료율 {report.completionRate}%
              </div>
            </div>

            <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-center">
              <div className="text-[11px] text-purple-700 font-bold">주간 획득 XP</div>
              <div className="font-pixel text-xl font-bold text-purple-900 mt-0.5">
                +{report.xpEarnedThisWeek.toLocaleString()} XP
              </div>
              <div className="text-[10px] text-purple-600 font-pixel">
                레벨 {profile.level} 성장 중
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-slate-500 font-medium">가장 많은 업무:</span>
              <div className="font-bold text-slate-800 mt-0.5 flex items-center gap-1">
                <span>📊</span>
                <span>{report.topCategory}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-slate-500 font-medium">가장 바빴던 요일:</span>
              <div className="font-bold text-slate-800 mt-0.5 flex items-center gap-1">
                <span>🔥</span>
                <span>{report.busiestDay}</span>
              </div>
            </div>
          </div>

          {/* AI Bunny Commentary Box */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-b from-amber-50 to-orange-50 border-2 border-amber-300 space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs text-amber-900 font-pixel">
              <Bot className="w-4 h-4 text-amber-600" />
              <span>AI 토끼 어드바이저의 주간 코멘트 🐰</span>
            </div>
            <p className="text-xs text-amber-950 whitespace-pre-line leading-relaxed font-sans font-medium">
              {report.aiCommentary}
            </p>
          </div>

          <button
            onClick={() => setIsWeeklyReportOpen(false)}
            className="pixel-btn w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-pixel text-xs font-bold"
          >
            확인 및 퀘스트 계속하기
          </button>
        </div>
      </div>
    </div>
  );
};
