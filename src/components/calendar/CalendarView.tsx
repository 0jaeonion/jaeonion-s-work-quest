import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { QuestItem } from '../quests/QuestItem';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Sparkles, CheckCircle2, Flame } from 'lucide-react';
import { soundManager } from '../../utils/audio';

export const CalendarView: React.FC = () => {
  const { quests } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDayYmd, setSelectedDayYmd] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  // Month navigation
  const prevMonth = () => {
    soundManager.playClick();
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    soundManager.playClick();
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToday = () => {
    soundManager.playClick();
    const now = new Date();
    setCurrentDate(now);
    setSelectedDayYmd(now.toISOString().split('T')[0]);
  };

  // Group quests by date string YYYY-MM-DD
  const questsByDate = useMemo(() => {
    const map: Record<string, { total: number; completed: number; xp: number }> = {};
    quests.forEach(q => {
      const dateKey = q.dueDate;
      if (!map[dateKey]) {
        map[dateKey] = { total: 0, completed: 0, xp: 0 };
      }
      map[dateKey].total += 1;
      if (q.status === 'DONE') {
        map[dateKey].completed += 1;
        map[dateKey].xp += q.xp || 20;
      }
    });
    return map;
  }, [quests]);

  // Calendar matrix calculation
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 (Sun) to 6 (Sat)
    const daysInMonth = lastDayOfMonth.getDate();

    const days: Array<{
      date: Date;
      ymd: string;
      isCurrentMonth: boolean;
      isToday: boolean;
      dayNumber: number;
    }> = [];

    const todayStr = new Date().toISOString().split('T')[0];

    // Previous month filler days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthLastDay - i);
      const ymd = d.toISOString().split('T')[0];
      days.push({
        date: d,
        ymd,
        isCurrentMonth: false,
        isToday: ymd === todayStr,
        dayNumber: prevMonthLastDay - i,
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, month, day);
      const ymd = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push({
        date: d,
        ymd,
        isCurrentMonth: true,
        isToday: ymd === todayStr,
        dayNumber: day,
      });
    }

    // Next month filler days to complete grid (42 cells = 6 rows)
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      const ymd = d.toISOString().split('T')[0];
      days.push({
        date: d,
        ymd,
        isCurrentMonth: false,
        isToday: ymd === todayStr,
        dayNumber: i,
      });
    }

    return days;
  }, [year, month]);

  // Selected Day quests
  const selectedDayQuests = useMemo(() => {
    return quests.filter(q => q.dueDate === selectedDayYmd);
  }, [quests, selectedDayYmd]);

  // Heatmap background color calculator
  const getHeatmapColor = (completedCount: number, isSelected: boolean) => {
    if (isSelected) return 'ring-2 ring-pink-500 bg-pink-50/90 font-bold';
    if (completedCount === 0) return 'bg-white hover:bg-slate-50';
    if (completedCount <= 2) return 'bg-emerald-50 text-emerald-900 border-emerald-200';
    if (completedCount <= 4) return 'bg-emerald-100 text-emerald-900 border-emerald-300';
    return 'bg-emerald-200/90 text-emerald-950 border-emerald-400 font-bold';
  };

  const monthNames = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Calendar Grid Section */}
      <div className="lg:col-span-2 pixel-box p-4 bg-white space-y-4">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">📅</span>
            <h2 className="font-pixel text-base font-bold text-slate-800">
              {year}년 {monthNames[month]}
            </h2>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={goToday}
              className="pixel-btn px-2.5 py-1 rounded-lg bg-pink-50 text-pink-700 text-xs font-pixel font-bold"
            >
              오늘
            </button>
            <button
              onClick={prevMonth}
              className="pixel-btn p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMonth}
              className="pixel-btn p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 text-center font-pixel text-xs text-slate-500 font-bold border-b pb-2">
          <span className="text-rose-500">일</span>
          <span>월</span>
          <span>화</span>
          <span>수</span>
          <span>목</span>
          <span>금</span>
          <span className="text-sky-500">토</span>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1.5">
          {calendarDays.map((cell, idx) => {
            const data = questsByDate[cell.ymd] || { total: 0, completed: 0, xp: 0 };
            const isSelected = selectedDayYmd === cell.ymd;

            return (
              <div
                key={idx}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedDayYmd(cell.ymd);
                }}
                className={`min-h-[64px] p-1.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  !cell.isCurrentMonth ? 'opacity-35 bg-slate-50/50' : ''
                } ${getHeatmapColor(data.completed, isSelected)}`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-pixel ${
                      cell.isToday
                        ? 'w-5 h-5 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold'
                        : cell.date.getDay() === 0
                        ? 'text-rose-500'
                        : cell.date.getDay() === 6
                        ? 'text-sky-500'
                        : 'text-slate-700'
                    }`}
                  >
                    {cell.dayNumber}
                  </span>

                  {data.completed > 0 && (
                    <span className="text-[10px] font-pixel text-emerald-700 font-bold">
                      +{data.xp}
                    </span>
                  )}
                </div>

                {data.total > 0 && (
                  <div className="mt-1">
                    <div className="text-[10px] font-pixel text-slate-600 truncate">
                      {data.completed}/{data.total}
                    </div>
                    <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden mt-0.5">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${Math.round((data.completed / data.total) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Heatmap Legend */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t font-pixel">
          <span>잔디 활동량 (HEATMAP)</span>
          <div className="flex items-center gap-1.5">
            <span>적음</span>
            <span className="w-3.5 h-3.5 rounded bg-white border border-slate-300"></span>
            <span className="w-3.5 h-3.5 rounded bg-emerald-100 border border-emerald-300"></span>
            <span className="w-3.5 h-3.5 rounded bg-emerald-300 border border-emerald-400"></span>
            <span className="w-3.5 h-3.5 rounded bg-emerald-500 border border-emerald-600"></span>
            <span>많음</span>
          </div>
        </div>
      </div>

      {/* Selected Day Quests Sidebar */}
      <div className="pixel-box p-4 bg-white space-y-3 flex flex-col">
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">📌</span>
            <div>
              <h3 className="font-pixel text-xs font-bold text-slate-800">
                {selectedDayYmd} 퀘스트
              </h3>
              <p className="text-[11px] text-slate-500">
                총 {selectedDayQuests.length}개 업무
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[480px] pr-1">
          {selectedDayQuests.length > 0 ? (
            selectedDayQuests.map(q => <QuestItem key={q.id} quest={q} />)
          ) : (
            <div className="p-8 text-center text-slate-400 font-pixel text-xs">
              <div className="text-3xl mb-2">🐰</div>
              이 날짜에는 등록된 퀘스트가 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
