import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Trophy,
  Flame,
  CheckCircle2,
  TrendingUp,
  Clock,
  PieChart,
  Calendar,
  Sparkles,
  Award,
  Zap,
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

export const StatisticsView: React.FC = () => {
  const { quests, profile, categories, setIsWeeklyReportOpen } = useApp();

  const totalQuests = quests.length;
  const completedQuests = quests.filter(q => q.status === 'DONE');
  const completionRate = totalQuests > 0 ? Math.round((completedQuests.length / totalQuests) * 100) : 0;

  // Category distribution
  const categoryStats = useMemo(() => {
    const counts: Record<string, number> = {};
    completedQuests.forEach(q => {
      counts[q.category] = (counts[q.category] || 0) + 1;
    });

    const maxCount = Math.max(...Object.values(counts), 1);

    return categories.map(cat => ({
      ...cat,
      count: counts[cat.name] || 0,
      percent: Math.round(((counts[cat.name] || 0) / (completedQuests.length || 1)) * 100),
      relativeBar: Math.round(((counts[cat.name] || 0) / maxCount) * 100),
    }));
  }, [completedQuests, categories]);

  // Day of week distribution
  const dayStats = useMemo(() => {
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    const counts = [0, 0, 0, 0, 0, 0, 0];

    completedQuests.forEach(q => {
      if (q.completedAt) {
        const d = new Date(q.completedAt).getDay();
        counts[d] += 1;
      }
    });

    const max = Math.max(...counts, 1);

    return dayNames.map((name, idx) => ({
      name,
      count: counts[idx],
      barHeight: Math.max(15, Math.round((counts[idx] / max) * 100)),
      isWeekend: idx === 0 || idx === 6,
    }));
  }, [completedQuests]);

  // Time of Day distribution
  const timeOfDayStats = useMemo(() => {
    let morning = 0; // 06:00 ~ 11:59
    let afternoon = 0; // 12:00 ~ 17:59
    let evening = 0; // 18:00 ~ 05:59

    completedQuests.forEach(q => {
      if (q.completedAt) {
        const hour = new Date(q.completedAt).getHours();
        if (hour >= 6 && hour < 12) morning++;
        else if (hour >= 12 && hour < 18) afternoon++;
        else evening++;
      }
    });

    const total = completedQuests.length || 1;
    return [
      { label: '오전 (06:00~12:00)', count: morning, percent: Math.round((morning / total) * 100), icon: '🌅', color: 'bg-amber-400' },
      { label: '오후 (12:00~18:00)', count: afternoon, percent: Math.round((afternoon / total) * 100), icon: '☀️', color: 'bg-sky-400' },
      { label: '저녁/심야 (18:00~06:00)', count: evening, percent: Math.round((evening / total) * 100), icon: '🌙', color: 'bg-indigo-400' },
    ];
  }, [completedQuests]);

  return (
    <div className="space-y-4">
      {/* Top Banner & AI Report Trigger */}
      <div className="pixel-box p-4 bg-gradient-to-r from-pink-50 via-purple-50 to-sky-50 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl animate-bounce-short">📊</span>
          <div>
            <h2 className="font-pixel text-base font-bold text-slate-800">
              업무 통계 & 생산성 성장 리포트
            </h2>
            <p className="text-xs text-slate-600">
              차곡차곡 쌓인 나의 업무 패턴과 레벨업 기록을 한눈에 살펴보세요!
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            soundManager.playClick();
            setIsWeeklyReportOpen(true);
          }}
          className="pixel-btn px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-pixel text-xs font-bold flex items-center gap-2 shadow-sm whitespace-nowrap"
        >
          <Sparkles className="w-4 h-4 text-yellow-300" />
          <span>AI 주간 리포트 분석</span>
        </button>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="pixel-box p-3.5 bg-white text-center">
          <div className="flex items-center justify-center gap-1 text-slate-500 text-xs font-bold mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>완료율</span>
          </div>
          <div className="font-pixel text-xl font-bold text-slate-800">
            {completionRate}%
          </div>
          <div className="text-[11px] text-slate-500 font-pixel mt-0.5">
            {completedQuests.length} / {totalQuests} 완료
          </div>
        </div>

        <div className="pixel-box p-3.5 bg-white text-center">
          <div className="flex items-center justify-center gap-1 text-slate-500 text-xs font-bold mb-1">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span>누적 획득 XP</span>
          </div>
          <div className="font-pixel text-xl font-bold text-amber-600">
            {profile.totalXp.toLocaleString()} XP
          </div>
          <div className="text-[11px] text-slate-500 font-pixel mt-0.5">
            현재 Lv.{profile.level}
          </div>
        </div>

        <div className="pixel-box p-3.5 bg-white text-center">
          <div className="flex items-center justify-center gap-1 text-slate-500 text-xs font-bold mb-1">
            <Flame className="w-4 h-4 text-orange-500" />
            <span>연속 달성 스트릭</span>
          </div>
          <div className="font-pixel text-xl font-bold text-orange-600">
            {profile.streak} DAY
          </div>
          <div className="text-[11px] text-slate-500 font-pixel mt-0.5">
            최고 기록: {profile.maxStreak}일
          </div>
        </div>

        <div className="pixel-box p-3.5 bg-white text-center">
          <div className="flex items-center justify-center gap-1 text-slate-500 text-xs font-bold mb-1">
            <Trophy className="w-4 h-4 text-purple-500" />
            <span>현재 칭호</span>
          </div>
          <div className="font-bold text-xs text-purple-700 truncate px-1 mt-1">
            {profile.title}
          </div>
          <div className="text-[10px] text-slate-400 font-pixel mt-1">
            {profile.nickname}
          </div>
        </div>
      </div>

      {/* Middle 2 Columns: Category Breakdown & Day-of-Week Workload */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Category Breakdown */}
        <div className="pixel-box p-4 bg-white space-y-3">
          <div className="flex items-center gap-2 border-b pb-2">
            <PieChart className="w-4 h-4 text-pink-500" />
            <h3 className="font-pixel text-xs font-bold text-slate-800">
              카테고리별 업무 비중
            </h3>
          </div>

          <div className="space-y-2.5">
            {categoryStats.map(cat => (
              <div key={cat.id} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </span>
                  <span className="font-pixel text-slate-500">
                    {cat.count}건 ({cat.percent}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${cat.relativeBar}%`,
                      backgroundColor: cat.color || '#F472B6',
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Day of Week Workload Chart */}
        <div className="pixel-box p-4 bg-white space-y-3">
          <div className="flex items-center gap-2 border-b pb-2">
            <Calendar className="w-4 h-4 text-sky-500" />
            <h3 className="font-pixel text-xs font-bold text-slate-800">
              요일별 업무 처리량 (월~일)
            </h3>
          </div>

          <div className="flex items-end justify-between h-44 pt-4 px-2">
            {dayStats.map((d, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1.5 flex-1">
                <span className="text-[10px] font-pixel font-bold text-slate-600">
                  {d.count > 0 ? `${d.count}건` : '-'}
                </span>
                <div className="w-7 bg-slate-100 rounded-t-lg overflow-hidden flex flex-col justify-end h-28 border border-slate-200">
                  <div
                    className={`w-full transition-all rounded-t-md ${
                      d.isWeekend
                        ? 'bg-rose-300'
                        : d.count > 0
                        ? 'bg-gradient-to-t from-sky-400 to-indigo-400'
                        : 'bg-transparent'
                    }`}
                    style={{ height: `${d.barHeight}%` }}
                  ></div>
                </div>
                <span
                  className={`text-xs font-pixel font-bold ${
                    d.isWeekend ? 'text-rose-500' : 'text-slate-700'
                  }`}
                >
                  {d.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Time of Day Distribution */}
      <div className="pixel-box p-4 bg-white space-y-3">
        <div className="flex items-center gap-2 border-b pb-2">
          <Clock className="w-4 h-4 text-amber-500" />
          <h3 className="font-pixel text-xs font-bold text-slate-800">
            시간대별 업무 집중도 (오전 / 오후 / 야간)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {timeOfDayStats.map((item, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <span className="text-2xl">{item.icon}</span>
              <div className="flex-1">
                <div className="text-xs font-medium text-slate-700">{item.label}</div>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-pixel text-sm font-bold text-slate-800">
                    {item.count}건
                  </span>
                  <span className="font-pixel text-xs text-slate-500 font-bold">
                    {item.percent}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
