import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Difficulty, Importance, RecurringFrequency, RecurringQuest } from '../../types';
import { Repeat, Plus, Trash2, Calendar, Clock, Sparkles } from 'lucide-react';
import { soundManager } from '../../utils/audio';

export const RecurringQuestView: React.FC = () => {
  const { recurringQuests, addRecurringQuest, deleteRecurringQuest, categories } = useApp();
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || '문의/전화');
  const [frequency, setFrequency] = useState<RecurringFrequency>('DAILY');
  const [dayOfWeek, setDayOfWeek] = useState<number>(1); // Mon
  const [dayOfMonth, setDayOfMonth] = useState<number>(1);
  const [estimatedMinutes, setEstimatedMinutes] = useState(10);
  const [importance, setImportance] = useState<Importance>('NORMAL');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addRecurringQuest({
      title: title.trim(),
      category,
      difficulty: 'NORMAL',
      estimatedMinutes,
      importance,
      xp: 20,
      frequency,
      dayOfWeek: frequency === 'WEEKLY' ? dayOfWeek : undefined,
      dayOfMonth: frequency === 'MONTHLY' ? dayOfMonth : undefined,
    });

    setIsCreating(false);
    setTitle('');
    soundManager.playClick();
  };

  const getFrequencyLabel = (req: RecurringQuest) => {
    switch (req.frequency) {
      case 'DAILY':
        return '매일 (주말 포함)';
      case 'WEEKDAYS':
        return '매주 평일 (월~금)';
      case 'WEEKLY':
        const days = ['일', '월', '화', '수', '목', '금', '토'];
        return `매주 ${days[req.dayOfWeek || 0]}요일`;
      case 'MONTHLY':
        return `매월 ${req.dayOfMonth || 1}일`;
      default:
        return '반복';
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="pixel-box p-4 bg-gradient-to-r from-emerald-100 via-teal-100 to-sky-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-4xl animate-bounce-short">🔄</span>
          <div>
            <h2 className="font-pixel text-base font-bold text-slate-800">
              반복 퀘스트 (RECURRING QUESTS)
            </h2>
            <p className="text-xs text-slate-600">
              매일 아침 이메일 확인, 주간 보고, 매월 25일 정산 등 주기적인 업무를 자동으로 소환하세요!
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="pixel-btn px-4 py-2 rounded-xl bg-emerald-600 text-white font-pixel text-xs font-bold flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>반복 퀘스트 등록</span>
        </button>
      </div>

      {/* Creation Form */}
      {isCreating && (
        <form onSubmit={handleAdd} className="pixel-box p-4 bg-white space-y-3 border-2 border-emerald-400">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="font-pixel text-xs font-bold text-emerald-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>새로운 반복 퀘스트 설정</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              닫기
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">퀘스트 이름</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="예: 매일 오전 슬랙 및 메일 확인"
                className="w-full px-3 py-1.5 rounded-lg border text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">카테고리</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border text-xs bg-white"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.name}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">반복 주기</label>
              <select
                value={frequency}
                onChange={e => setFrequency(e.target.value as RecurringFrequency)}
                className="w-full px-3 py-1.5 rounded-lg border text-xs bg-white font-medium"
              >
                <option value="DAILY">매일 (월~일)</option>
                <option value="WEEKDAYS">평일만 (월~금)</option>
                <option value="WEEKLY">매주 특정 요일</option>
                <option value="MONTHLY">매월 특정 날짜</option>
              </select>
            </div>

            {frequency === 'WEEKLY' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">반복 요일</label>
                <select
                  value={dayOfWeek}
                  onChange={e => setDayOfWeek(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg border text-xs bg-white"
                >
                  <option value={1}>월요일</option>
                  <option value={2}>화요일</option>
                  <option value={3}>수요일</option>
                  <option value={4}>목요일</option>
                  <option value={5}>금요일</option>
                  <option value={6}>토요일</option>
                  <option value={0}>일요일</option>
                </select>
              </div>
            )}

            {frequency === 'MONTHLY' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">반복 날짜</label>
                <select
                  value={dayOfMonth}
                  onChange={e => setDayOfMonth(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg border text-xs bg-white"
                >
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                    <option key={day} value={day}>
                      매월 {day}일
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">예상 소요시간</label>
              <input
                type="number"
                value={estimatedMinutes}
                onChange={e => setEstimatedMinutes(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-lg border text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-700 text-xs font-bold"
            >
              취소
            </button>
            <button
              type="submit"
              className="pixel-btn px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold font-pixel"
            >
              등록하기
            </button>
          </div>
        </form>
      )}

      {/* Recurring Quests List */}
      <div className="space-y-2.5">
        {recurringQuests.map(req => (
          <div
            key={req.id}
            className="pixel-box p-3.5 bg-white flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-700 flex items-center justify-center flex-shrink-0">
                <Repeat className="w-5 h-5" />
              </div>

              <div>
                <div className="font-bold text-xs sm:text-sm text-slate-800 mb-0.5">
                  {req.title}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 font-pixel">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                    🔄 {getFrequencyLabel(req)}
                  </span>
                  <span>⏱️ {req.estimatedMinutes}분</span>
                  <span className="text-pink-600 font-bold">+{req.xp} XP</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if (window.confirm(`"${req.title}" 반복 퀘스트를 삭제하시겠습니까?`)) {
                  deleteRecurringQuest(req.id);
                }
              }}
              className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100"
              title="삭제"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
