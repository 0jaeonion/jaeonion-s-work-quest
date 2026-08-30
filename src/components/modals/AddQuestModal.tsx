import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Difficulty, Importance } from '../../types';
import { DIFFICULTY_INFO, IMPORTANCE_INFO } from '../../utils/constants';
import { parseNaturalLanguageTask } from '../../utils/aiAssistant';
import { X, Sparkles, Wand2, Plus, Clock, Star, Calendar, AlertCircle } from 'lucide-react';
import { soundManager } from '../../utils/audio';

export const AddQuestModal: React.FC = () => {
  const { isAddModalOpen, setIsAddModalOpen, addQuest, addMultipleQuests, categories } = useApp();

  const [mode, setMode] = useState<'STANDARD' | 'NATURAL_AI'>('STANDARD');

  // Standard Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || '문서');
  const [difficulty, setDifficulty] = useState<Difficulty>('NORMAL');
  const [xp, setXp] = useState<number>(20);
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(15);
  const [importance, setImportance] = useState<Importance>('NORMAL');
  const [dueDate, setDueDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState<string>('');
  const [isBonusQuest, setIsBonusQuest] = useState<boolean>(false);

  // Natural AI State
  const [naturalText, setNaturalText] = useState('');
  const [parsedPreview, setParsedPreview] = useState<ReturnType<typeof parseNaturalLanguageTask>>([]);

  if (!isAddModalOpen) return null;

  const handleDifficultyChange = (d: Difficulty) => {
    setDifficulty(d);
    setXp(DIFFICULTY_INFO[d].xp);
  };

  const handleStandardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addQuest({
      title: title.trim(),
      category,
      difficulty,
      xp: Number(xp),
      estimatedMinutes: Number(estimatedMinutes),
      importance,
      dueDate,
      notes,
      isBonusQuest,
    });

    setIsAddModalOpen(false);
    resetForm();
  };

  const handleNaturalParse = () => {
    if (!naturalText.trim()) return;
    const parsed = parseNaturalLanguageTask(naturalText.trim());
    setParsedPreview(parsed);
    soundManager.playClick();
  };

  const handleApplyParsedTasks = () => {
    if (parsedPreview.length === 0) return;
    addMultipleQuests(
      parsedPreview.map(p => ({
        title: p.title,
        category: p.category,
        difficulty: p.difficulty,
        xp: p.xp,
        estimatedMinutes: p.estimatedMinutes,
        importance: p.importance,
        dueDate,
      }))
    );
    setIsAddModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setNotes('');
    setNaturalText('');
    setParsedPreview([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="pixel-box w-full max-w-lg bg-white overflow-hidden shadow-pixel-lg">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-pink-100 to-purple-100 border-b-2 border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐰</span>
            <h2 className="font-pixel text-sm font-bold text-slate-800">
              새로운 퀘스트 등록 (NEW QUEST)
            </h2>
          </div>
          <button
            onClick={() => setIsAddModalOpen(false)}
            className="p-1 rounded-lg hover:bg-white/60 text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="flex border-b text-xs font-pixel font-bold">
          <button
            onClick={() => setMode('STANDARD')}
            className={`flex-1 py-2.5 text-center transition-all ${
              mode === 'STANDARD'
                ? 'bg-white text-pink-600 border-b-2 border-pink-500'
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
            }`}
          >
            기본 등록
          </button>
          <button
            onClick={() => setMode('NATURAL_AI')}
            className={`flex-1 py-2.5 text-center flex items-center justify-center gap-1.5 transition-all ${
              mode === 'NATURAL_AI'
                ? 'bg-white text-purple-600 border-b-2 border-purple-500'
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>자연어 스마트 등록 (AI)</span>
          </button>
        </div>

        {/* Standard Form */}
        {mode === 'STANDARD' ? (
          <form onSubmit={handleStandardSubmit} className="p-4 space-y-3.5 max-h-[75vh] overflow-y-auto">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                업무명 (Quest Title) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="예: 정산파일 3개 검토 및 마감"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                required
                autoFocus
              />
            </div>

            {/* Category & DueDate Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">카테고리</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-pink-300 font-medium"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>
                      {c.icon} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">마감일</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>
            </div>

            {/* Difficulty Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">난이도 및 기본 경험치</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['EASY', 'NORMAL', 'HARD', 'VERY_HARD'] as Difficulty[]).map(d => {
                  const info = DIFFICULTY_INFO[d];
                  const isSelected = difficulty === d;
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => handleDifficultyChange(d)}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        isSelected
                          ? `${info.color} ring-2 ring-slate-700 font-bold shadow-sm`
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <div className="text-xs">{info.dot} {info.label}</div>
                      <div className="text-[10px] font-pixel text-slate-500 mt-0.5 font-bold">+{info.xp} XP</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Estimated Minutes & Importance & Custom XP */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">예상 소요시간</label>
                <select
                  value={estimatedMinutes}
                  onChange={e => setEstimatedMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                >
                  <option value={5}>⚡ 5분 (초스피드)</option>
                  <option value={10}>☕ 10분 (간단)</option>
                  <option value={20}>📋 20분 (집중)</option>
                  <option value={30}>🔥 30분 (본격)</option>
                  <option value={60}>🏆 1시간 (딥워크)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">중요도</label>
                <select
                  value={importance}
                  onChange={e => setImportance(e.target.value as Importance)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                >
                  <option value="LOW">낮음</option>
                  <option value="NORMAL">보통</option>
                  <option value="HIGH">높음 ⭐</option>
                  <option value="URGENT">긴급 🚨</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">획득 경험치(XP)</label>
                <input
                  type="number"
                  value={xp}
                  onChange={e => setXp(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-pixel font-bold text-pink-600 text-center"
                />
              </div>
            </div>

            {/* Bonus Quest Checkbox */}
            <div className="flex items-center gap-2 p-2 rounded-xl bg-amber-50 border border-amber-200">
              <input
                type="checkbox"
                id="bonusCheck"
                checked={isBonusQuest}
                onChange={e => setIsBonusQuest(e.target.checked)}
                className="w-4 h-4 text-amber-500 rounded cursor-pointer"
              />
              <label htmlFor="bonusCheck" className="text-xs text-amber-900 font-bold cursor-pointer flex items-center gap-1">
                <span>🌟 2배 보너스 퀘스트 지정 (DOUBLE XP)</span>
              </label>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">메모 (선택사항)</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="업무 수행 시 참고할 링크나 세부사항을 적어두세요."
                rows={2}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none"
              ></textarea>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
              >
                취소
              </button>
              <button
                type="submit"
                className="pixel-btn px-5 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-pixel text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>퀘스트 등록</span>
              </button>
            </div>
          </form>
        ) : (
          /* Natural Language AI Mode */
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                자연어로 한 번에 여러 업무 입력하기
              </label>
              <textarea
                rows={3}
                value={naturalText}
                onChange={e => setNaturalText(e.target.value)}
                placeholder="예: 오늘 정산파일 3개 만들고 검토한 다음 학교에 보내야 함"
                className="w-full p-3 rounded-xl border border-purple-300 text-xs focus:outline-none focus:ring-2 focus:ring-purple-300"
              ></textarea>
              <button
                type="button"
                onClick={handleNaturalParse}
                disabled={!naturalText.trim()}
                className="mt-2 pixel-btn w-full py-2 rounded-xl bg-purple-500 hover:bg-purple-600 text-white text-xs font-pixel font-bold flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>스마트 퀘스트 자동 분해 및 파싱</span>
              </button>
            </div>

            {/* Parsed Preview */}
            {parsedPreview.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700 font-pixel">
                  분석된 퀘스트 목록 ({parsedPreview.length}개)
                </div>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {parsedPreview.map((item, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-purple-50 border border-purple-200 text-xs flex items-center justify-between">
                      <span className="font-medium text-slate-800 truncate flex-1">
                        {idx + 1}. {item.title}
                      </span>
                      <div className="flex items-center gap-1.5 font-pixel text-[10px]">
                        <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 font-bold">
                          {item.category}
                        </span>
                        <span className="text-pink-600 font-bold">
                          +{item.xp} XP
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleApplyParsedTasks}
                  className="pixel-btn w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-pixel font-bold flex items-center justify-center gap-1.5 shadow-sm mt-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>위 {parsedPreview.length}개 퀘스트 일괄 추가하기</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
