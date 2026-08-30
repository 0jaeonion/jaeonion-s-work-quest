import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { QuestItem } from './QuestItem';
import { Difficulty, Quest, SortOption } from '../../types';
import {
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Sparkles,
  Layers,
  CheckCircle2,
  ListTodo,
  Smile,
  Zap,
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

export const TodayQuestList: React.FC = () => {
  const {
    quests,
    categories,
    addQuest,
    setIsAddModalOpen,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedStatus,
    setSelectedStatus,
    sortBy,
    setSortBy,
    todayQuests,
    todayCompletedQuests,
    todayProgressPercentage,
    isTodayPerfect,
  } = useApp();

  const [quickTitle, setQuickTitle] = useState('');
  const [quickCategory, setQuickCategory] = useState(categories[0]?.name || '문서');

  // Quick Add handler (1-second creation)
  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    addQuest({
      title: quickTitle.trim(),
      category: quickCategory,
      difficulty: 'NORMAL',
      xp: 20,
      estimatedMinutes: 15,
      importance: 'NORMAL',
      dueDate: new Date().toISOString().split('T')[0],
    });

    setQuickTitle('');
  };

  // Filter & Sort Logic
  const filteredAndSortedQuests = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];

    // Filter
    const result = quests.filter(q => {
      // Date: Show today's quests or pending past-due quests
      // For Today Quest view, we show all quests with dueDate === today or pending
      const matchesSearch =
        searchQuery === '' ||
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (q.notes && q.notes.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'ALL' || q.category === selectedCategory;

      const matchesStatus =
        selectedStatus === 'ALL' ||
        (selectedStatus === 'TODO' && (q.status === 'TODO' || q.status === 'IN_PROGRESS')) ||
        (selectedStatus === 'IN_PROGRESS' && q.status === 'IN_PROGRESS') ||
        (selectedStatus === 'DONE' && q.status === 'DONE');

      return matchesSearch && matchesCategory && matchesStatus;
    });

    // Sort
    return result.sort((a, b) => {
      // Completed items always go to bottom unless explicitly filtering
      if (a.status === 'DONE' && b.status !== 'DONE') return 1;
      if (a.status !== 'DONE' && b.status === 'DONE') return -1;

      if (sortBy === 'SMART') {
        // Smart sort: In progress first, then Urgency + High importance + short times
        const impWeight = { URGENT: 40, HIGH: 30, NORMAL: 20, LOW: 10 };
        const scoreA =
          (a.status === 'IN_PROGRESS' ? 100 : 0) +
          (impWeight[a.importance] || 20) +
          (a.isBonusQuest ? 15 : 0) +
          (a.estimatedMinutes <= 15 ? 10 : 0);
        const scoreB =
          (b.status === 'IN_PROGRESS' ? 100 : 0) +
          (impWeight[b.importance] || 20) +
          (b.isBonusQuest ? 15 : 0) +
          (b.estimatedMinutes <= 15 ? 10 : 0);
        return scoreB - scoreA;
      } else if (sortBy === 'DUE_DATE') {
        return a.dueDate.localeCompare(b.dueDate);
      } else if (sortBy === 'XP') {
        return (b.xp || 20) - (a.xp || 20);
      } else if (sortBy === 'DIFFICULTY') {
        const diffWeight: Record<Difficulty, number> = { VERY_HARD: 4, HARD: 3, NORMAL: 2, EASY: 1 };
        return diffWeight[b.difficulty] - diffWeight[a.difficulty];
      } else if (sortBy === 'TIME') {
        return a.estimatedMinutes - b.estimatedMinutes;
      } else if (sortBy === 'IMPORTANCE') {
        const impWeight = { URGENT: 4, HIGH: 3, NORMAL: 2, LOW: 1 };
        return impWeight[b.importance] - impWeight[a.importance];
      }
      return 0;
    });
  }, [quests, searchQuery, selectedCategory, selectedStatus, sortBy]);

  const pendingCount = filteredAndSortedQuests.filter(q => q.status !== 'DONE').length;
  const doneCount = filteredAndSortedQuests.filter(q => q.status === 'DONE').length;

  return (
    <div className="space-y-5">
      {/* Quick Add Bar */}
      <div className="pixel-box p-4 sm:p-5 bg-white">
        <form onSubmit={handleQuickAdd} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={quickTitle}
              onChange={e => setQuickTitle(e.target.value)}
              placeholder="🐰 새 퀘스트 입력 후 Enter (예: 정산 파일 검토)..."
              className="w-full pl-3 pr-24 py-3 rounded-xl bg-[#fcf7f7] border border-[#e7dce1] text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white transition-all font-sans"
            />
            {/* Quick Category Selector */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <select
                value={quickCategory}
                onChange={e => setQuickCategory(e.target.value)}
                className="text-[11px] bg-[#fff2f5] text-[#a8587e] font-bold border border-[#f2cad9] rounded-lg px-2 py-1.5 focus:outline-none cursor-pointer"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.name}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!quickTitle.trim()}
              className="pixel-btn px-4 py-2.5 rounded-xl bg-[#ed93b8] hover:bg-[#df7faa] text-white font-pixel text-xs font-bold disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>빠른 추가</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setIsAddModalOpen(true);
              }}
              className="pixel-btn px-3 py-2.5 rounded-xl bg-[#4b465b] hover:bg-[#3e3a4f] text-white font-pixel text-xs font-bold flex items-center justify-center gap-1 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>＋ NEW QUEST</span>
            </button>
          </div>
        </form>
      </div>

      {/* Filter & Sort Controls Bar */}
      <div className="quest-surface flex flex-wrap items-center justify-between gap-3 p-3.5">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="퀘스트 이름 검색..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#fffdf9] border border-[#e8dfe2] text-xs focus:outline-none focus:ring-2 focus:ring-pink-200"
          />
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 max-w-full">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              selectedCategory === 'ALL'
                ? 'bg-[#3e3a4f] text-white font-bold shadow-sm'
                : 'bg-[#f7f2f3] text-[#726a78] border border-[#e8dfe2] hover:bg-[#fbe3ed]'
            }`}
          >
            전체
          </button>
          {categories.slice(0, 5).map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.name)}
              className={`px-2 py-1 rounded-lg text-xs flex items-center gap-1 whitespace-nowrap transition-all ${
                selectedCategory === c.name
                  ? `${c.badgeBg} ${c.badgeText} ring-2 ring-pink-200 font-bold`
                  : 'bg-[#f7f2f3] text-[#726a78] border border-[#e8dfe2] hover:bg-[#fbe3ed]'
              }`}
            >
              <span>{c.icon}</span>
              <span>{c.name}</span>
            </button>
          ))}
        </div>

        {/* Status & Sort Dropdowns */}
        <div className="flex items-center gap-2">
          {/* Status filter */}
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="text-xs bg-[#fffdf9] border border-[#e8dfe2] rounded-lg px-2.5 py-2 font-medium text-[#665f70] focus:outline-none cursor-pointer"
          >
            <option value="ALL">상태: 전체 ({filteredAndSortedQuests.length})</option>
            <option value="TODO">미완료 ({pendingCount})</option>
            <option value="IN_PROGRESS">진행중만</option>
            <option value="DONE">완료됨 ({doneCount})</option>
          </select>

          {/* Sort Option */}
          <div className="flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortOption)}
              className="text-xs bg-[#fffdf9] border border-[#e8dfe2] rounded-lg px-2 py-2 font-medium text-[#665f70] focus:outline-none cursor-pointer"
            >
              <option value="SMART">🎯 스마트 추천순</option>
              <option value="IMPORTANCE">🚨 중요도순</option>
              <option value="DUE_DATE">📅 마감일순</option>
              <option value="XP">⭐ 높은 XP순</option>
              <option value="DIFFICULTY">💪 난이도순</option>
              <option value="TIME">⏱️ 소요시간순</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quest Section Header */}
      <div className="flex items-center justify-between px-1 pt-1">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎮</span>
          <h2 className="font-pixel text-sm font-bold text-slate-800">
            TODAY QUEST ({pendingCount}개 남음)
          </h2>
        </div>

        {isTodayPerfect && (
          <div className="flex items-center gap-1 text-xs text-pink-600 font-pixel font-bold animate-bounce-short">
            <span>🎉 PERFECT DAY 100%!</span>
          </div>
        )}
      </div>

      {/* Quest List */}
      {filteredAndSortedQuests.length > 0 ? (
        <div className="space-y-3">
          {filteredAndSortedQuests.map(quest => (
            <QuestItem key={quest.id} quest={quest} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="pixel-box p-8 sm:p-10 bg-[#fffdf9] text-center flex flex-col items-center justify-center">
          <div className="text-5xl mb-3 animate-soft-bounce">🐰</div>
          {searchQuery ? (
            <>
              <h3 className="font-bold text-slate-800 text-sm mb-1">
                검색 결과와 일치하는 퀘스트가 없어요!
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                다른 검색어를 입력하거나 필터를 초기화해보세요.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('ALL');
                  setSelectedStatus('ALL');
                }}
                className="pixel-btn px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
              >
                필터 초기화
              </button>
            </>
          ) : todayCompletedQuests.length > 0 && todayCompletedQuests.length === todayQuests.length ? (
            <>
              <h3 className="font-pixel text-base font-bold text-pink-600 mb-1">
                🎉 오늘의 모든 퀘스트를 클리어했습니다!
              </h3>
              <p className="text-xs text-slate-600 max-w-sm mb-4">
                대단해요! 오늘 하루도 퀘스트를 완벽하게 정복하셨습니다. 뿌듯한 마음으로 휴식을 취하거나 새 퀘스트를 등록해보세요!
              </p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="pixel-btn px-4 py-2.5 rounded-xl bg-pink-400 hover:bg-pink-500 text-white font-pixel text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>＋ 보너스 퀘스트 만들기</span>
              </button>
            </>
          ) : (
            <>
              <h3 className="font-pixel text-base font-bold text-slate-800 mb-1">
                오늘의 퀘스트가 아직 없어요!
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mb-4">
                새로운 업무를 등록하고 퀘스트를 하나씩 클리어하며 토끼 캐릭터를 레벨업시켜보세요! ✨
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="pixel-btn px-4 py-2.5 rounded-xl bg-pink-400 hover:bg-pink-500 text-white font-pixel text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>＋ 첫 번째 퀘스트 만들기</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
