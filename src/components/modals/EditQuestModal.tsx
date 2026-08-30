import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Difficulty, Importance, QuestStatus } from '../../types';
import { DIFFICULTY_INFO } from '../../utils/constants';
import { X, Check, Trash2 } from 'lucide-react';
import { soundManager } from '../../utils/audio';

export const EditQuestModal: React.FC = () => {
  const { editingQuest, setEditingQuest, updateQuest, deleteQuest, categories } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('NORMAL');
  const [xp, setXp] = useState<number>(20);
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(15);
  const [importance, setImportance] = useState<Importance>('NORMAL');
  const [status, setStatus] = useState<QuestStatus>('TODO');
  const [dueDate, setDueDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isBonusQuest, setIsBonusQuest] = useState<boolean>(false);

  useEffect(() => {
    if (editingQuest) {
      setTitle(editingQuest.title);
      setCategory(editingQuest.category);
      setDifficulty(editingQuest.difficulty);
      setXp(editingQuest.xp || 20);
      setEstimatedMinutes(editingQuest.estimatedMinutes || 15);
      setImportance(editingQuest.importance || 'NORMAL');
      setStatus(editingQuest.status);
      setDueDate(editingQuest.dueDate);
      setNotes(editingQuest.notes || '');
      setIsBonusQuest(editingQuest.isBonusQuest || false);
    }
  }, [editingQuest]);

  if (!editingQuest) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    updateQuest(editingQuest.id, {
      title: title.trim(),
      category,
      difficulty,
      xp: Number(xp),
      estimatedMinutes: Number(estimatedMinutes),
      importance,
      status,
      dueDate,
      notes,
      isBonusQuest,
    });

    soundManager.playClick();
    setEditingQuest(null);
  };

  const handleDelete = () => {
    if (window.confirm('이 퀘스트를 삭제하시겠습니까?')) {
      deleteQuest(editingQuest.id);
      setEditingQuest(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="pixel-box w-full max-w-lg bg-white overflow-hidden shadow-pixel-lg">
        {/* Header */}
        <div className="p-4 bg-slate-100 border-b-2 border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">✏️</span>
            <h2 className="font-pixel text-sm font-bold text-slate-800">
              퀘스트 세부정보 수정
            </h2>
          </div>
          <button
            onClick={() => setEditingQuest(null)}
            className="p-1 rounded-lg hover:bg-white text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">퀘스트 이름</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">카테고리</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border text-xs bg-white"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.name}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">상태</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as QuestStatus)}
                className="w-full px-3 py-2 rounded-xl border text-xs bg-white font-medium"
              >
                <option value="TODO">대기 (TODO)</option>
                <option value="IN_PROGRESS">진행중 (IN PROGRESS)</option>
                <option value="DONE">완료 (DONE)</option>
                <option value="CANCELLED">취소됨</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">난이도</label>
              <select
                value={difficulty}
                onChange={e => {
                  const d = e.target.value as Difficulty;
                  setDifficulty(d);
                  setXp(DIFFICULTY_INFO[d].xp);
                }}
                className="w-full px-3 py-2 rounded-xl border text-xs bg-white"
              >
                <option value="EASY">🟢 쉬움</option>
                <option value="NORMAL">🔵 보통</option>
                <option value="HARD">🟣 어려움</option>
                <option value="VERY_HARD">🔴 매우 어려움</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">XP</label>
              <input
                type="number"
                value={xp}
                onChange={e => setXp(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border text-xs font-pixel text-center text-pink-600 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">소요시간</label>
              <input
                type="number"
                value={estimatedMinutes}
                onChange={e => setEstimatedMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border text-xs text-center"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">마감일</label>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">메모</label>
            <textarea
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full p-2 rounded-xl border text-xs"
            ></textarea>
          </div>

          <div className="flex justify-between items-center pt-3 border-t">
            <button
              type="button"
              onClick={handleDelete}
              className="px-3 py-2 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold flex items-center gap-1 hover:bg-rose-100"
            >
              <Trash2 className="w-4 h-4" />
              <span>삭제</span>
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditingQuest(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
              >
                취소
              </button>
              <button
                type="submit"
                className="pixel-btn px-4 py-2 rounded-xl bg-pink-500 text-white text-xs font-pixel font-bold"
              >
                저장하기
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
