import React, { useState } from 'react';
import { Quest } from '../../types';
import { useApp } from '../../context/AppContext';
import { DIFFICULTY_INFO, IMPORTANCE_INFO } from '../../utils/constants';
import {
  Check,
  Clock,
  Sparkles,
  Play,
  RotateCcw,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
  Flame,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

export const QuestItem: React.FC<{ quest: Quest }> = ({ quest }) => {
  const { completeQuest, reopenQuest, startQuest, deleteQuest, setEditingQuest, categories } = useApp();
  const [showNotes, setShowNotes] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const diff = DIFFICULTY_INFO[quest.difficulty] || DIFFICULTY_INFO.NORMAL;
  const imp = IMPORTANCE_INFO[quest.importance] || IMPORTANCE_INFO.NORMAL;

  const categoryObj = categories.find(c => c.name === quest.category) || {
    name: quest.category,
    icon: '📋',
    badgeBg: 'bg-slate-100',
    badgeText: 'text-slate-700',
  };

  const isDone = quest.status === 'DONE';
  const isInProgress = quest.status === 'IN_PROGRESS';

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDone) {
      soundManager.playClick();
      reopenQuest(quest.id);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      completeQuest(quest.id, { x: rect.left + 15, y: rect.top - 10 });
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`정말로 "${quest.title}" 퀘스트를 삭제하시겠습니까?`)) {
      deleteQuest(quest.id);
    }
  };

  return (
    <div
      className={`group pixel-box p-3.5 transition-all duration-200 relative ${
        isDone
          ? 'bg-slate-50/75 border-slate-300 opacity-65 shadow-none'
          : isInProgress
          ? 'bg-gradient-to-r from-amber-50/70 to-white border-amber-400 pixel-box-yellow'
          : 'bg-white hover:border-pink-300 hover:shadow-pixel-md'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Retro Pixel Checkbox */}
        <button
          onClick={handleCheckboxClick}
          aria-label={isDone ? '완료 취소' : '퀘스트 완료'}
          className={`flex-shrink-0 w-6 h-6 rounded-md border-2 transition-all flex items-center justify-center cursor-pointer mt-0.5 ${
            isDone
              ? 'bg-emerald-400 border-emerald-600 text-white shadow-inner'
              : isInProgress
              ? 'bg-amber-100 border-amber-500 text-amber-600 animate-pulse'
              : 'bg-white border-slate-400 hover:border-pink-400 hover:bg-pink-50'
          }`}
        >
          {isDone && <Check className="w-4 h-4 stroke-[3]" />}
          {!isDone && isInProgress && <span className="w-2.5 h-2.5 bg-amber-500 rounded-sm"></span>}
        </button>

        {/* Quest Main Body */}
        <div className="flex-1 min-w-0">
          {/* Title & Badges */}
          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
            <span
              className={`font-semibold text-sm leading-snug break-words ${
                isDone ? 'line-through text-slate-400' : 'text-slate-800'
              }`}
            >
              {quest.title}
            </span>

            {/* Bonus Quest Badge */}
            {quest.isBonusQuest && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-900 font-pixel text-[10px] font-bold shadow-xs animate-bounce-short">
                <Sparkles className="w-3 h-3 text-amber-800 fill-amber-700" />
                2X BONUS
              </span>
            )}

            {/* In Progress Badge */}
            {isInProgress && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300 font-pixel text-[10px] font-bold">
                <Play className="w-2.5 h-2.5 fill-amber-600 text-amber-600" />
                진행중
              </span>
            )}
          </div>

          {/* Metadata Badges Row */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {/* Category */}
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-medium text-[11px] ${categoryObj.badgeBg} ${categoryObj.badgeText} border border-black/5`}
            >
              <span>{categoryObj.icon}</span>
              <span>{quest.category}</span>
            </span>

            {/* Difficulty & XP */}
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-medium text-[11px] border ${diff.color}`}
            >
              <span>{diff.dot}</span>
              <span>{diff.label}</span>
              <span className="font-pixel font-bold">+{quest.xp || diff.xp} XP</span>
            </span>

            {/* Estimated Time */}
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px]">
              <Clock className="w-3 h-3" />
              <span>{quest.estimatedMinutes}분</span>
            </span>

            {/* Importance */}
            {quest.importance !== 'NORMAL' && (
              <span
                className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-semibold border ${imp.color}`}
              >
                {imp.label}
              </span>
            )}

            {/* Chain Step Indicator */}
            {quest.chainId && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-pixel">
                ⛓️ 체인 {quest.chainStep}/{quest.chainTotalSteps}
              </span>
            )}

            {/* Notes Button if available */}
            {quest.notes && (
              <button
                onClick={() => setShowNotes(!showNotes)}
                className="text-slate-500 hover:text-slate-800 text-[11px] flex items-center gap-0.5 px-1 py-0.5 rounded hover:bg-slate-100"
              >
                <FileText className="w-3 h-3 text-slate-400" />
                <span>메모</span>
                {showNotes ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            )}
          </div>

          {/* Notes Expandable Dropdown */}
          {showNotes && quest.notes && (
            <div className="mt-2 p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/80 text-xs text-slate-700 leading-relaxed font-sans">
              <div className="font-bold text-[10px] text-amber-800 mb-0.5">📌 메모</div>
              {quest.notes}
            </div>
          )}
        </div>

        {/* Right Hover Action Buttons */}
        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          {!isDone && !isInProgress && (
            <button
              onClick={() => startQuest(quest.id)}
              title="지금 시작하기"
              className="p-1.5 rounded-md hover:bg-amber-100 text-slate-500 hover:text-amber-700 transition-colors"
            >
              <Play className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => setEditingQuest(quest)}
            title="수정하기"
            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleDelete}
            title="삭제하기"
            className="p-1.5 rounded-md hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
