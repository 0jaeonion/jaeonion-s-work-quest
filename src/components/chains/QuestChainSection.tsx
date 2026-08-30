import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DIFFICULTY_INFO } from '../../utils/constants';
import {
  Link2,
  CheckCircle2,
  Circle,
  Sparkles,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Gift,
  Wand2,
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

export const QuestChainSection: React.FC = () => {
  const { questChains, toggleChainStep, deleteQuestChain, addQuestChain, setIsAiDecomposeOpen } = useApp();
  const [expandedChainId, setExpandedChainId] = useState<string | null>(questChains[0]?.id || null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('정산');
  const [newBonusXp, setNewBonusXp] = useState(50);
  const [stepInputs, setStepInputs] = useState<string[]>(['1단계 작업', '2단계 작업', '3단계 마무리']);

  const handleStepInputChange = (index: number, val: string) => {
    const updated = [...stepInputs];
    updated[index] = val;
    setStepInputs(updated);
  };

  const handleAddStepInput = () => {
    setStepInputs(prev => [...prev, `${prev.length + 1}단계 추가 작업`]);
  };

  const handleRemoveStepInput = (index: number) => {
    if (stepInputs.length <= 2) return;
    setStepInputs(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreateChain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addQuestChain({
      title: newTitle.trim(),
      category: newCategory,
      bonusXp: newBonusXp,
      steps: stepInputs
        .filter(s => s.trim())
        .map((s, idx) => ({
          id: `step-${Date.now()}-${idx}`,
          title: s.trim(),
          xp: 20,
          difficulty: idx === stepInputs.length - 1 ? 'HARD' : 'NORMAL',
          completed: false,
        })),
    });

    setIsCreatingNew(false);
    setNewTitle('');
  };

  return (
    <div className="pixel-box p-4 sm:p-5 bg-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">⛓️</span>
          <div>
            <h2 className="font-pixel text-sm font-bold text-slate-800">
              QUEST CHAIN (단계별 대형 퀘스트)
            </h2>
            <p className="text-[11px] text-slate-500">
              큰 업무를 단계별로 완수하고 전체 클리어 보너스 XP를 획득하세요!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAiDecomposeOpen(true)}
            className="pixel-btn px-2.5 py-1.5 rounded-lg bg-[#e7f4f8] hover:bg-[#d9eef3] text-[#4c7887] text-xs font-bold flex items-center gap-1 border border-[#c8e3eb]"
          >
            <Wand2 className="w-3.5 h-3.5 text-sky-600" />
            <span>AI 분해</span>
          </button>
          <button
            onClick={() => setIsCreatingNew(!isCreatingNew)}
            className="pixel-btn px-3 py-1.5 rounded-lg bg-[#ed93b8] hover:bg-[#df7faa] text-white text-xs font-pixel font-bold flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>체인 생성</span>
          </button>
        </div>
      </div>

      {/* Chain Creation Form */}
      {isCreatingNew && (
        <form onSubmit={handleCreateChain} className="p-3.5 mb-4 rounded-2xl bg-[#f3edfb] border border-[#ddd2f1] space-y-3">
          <div className="font-bold text-xs text-purple-900 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>새로운 퀘스트 체인 등록</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">대형 업무 목표</label>
              <input
                type="text"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="예: 3분기 결산 보고서 완성 대작전"
                className="w-full px-3 py-1.5 rounded-lg border border-purple-200 text-xs focus:outline-none focus:ring-1 focus:ring-purple-400"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">올클리어 보너스 XP</label>
              <input
                type="number"
                value={newBonusXp}
                onChange={e => setNewBonusXp(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-lg border border-purple-200 text-xs focus:outline-none focus:ring-1 focus:ring-purple-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">세부 단계 목록</label>
            <div className="space-y-1.5">
              {stepInputs.map((step, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="text-xs font-pixel text-purple-700 w-6 font-bold">{idx + 1}.</span>
                  <input
                    type="text"
                    value={step}
                    onChange={e => handleStepInputChange(idx, e.target.value)}
                    className="flex-1 px-2.5 py-1 rounded-md border border-purple-200 text-xs"
                    placeholder={`단계 ${idx + 1} 설명`}
                  />
                  {stepInputs.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveStepInput(idx)}
                      className="text-slate-400 hover:text-rose-500 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddStepInput}
              className="mt-2 text-xs text-purple-700 hover:text-purple-900 font-bold flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>단계 추가하기</span>
            </button>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-purple-200">
            <button
              type="button"
              onClick={() => setIsCreatingNew(false)}
              className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-700 text-xs font-bold"
            >
              취소
            </button>
            <button
              type="submit"
              className="pixel-btn px-4 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-bold font-pixel"
            >
              생성 완료
            </button>
          </div>
        </form>
      )}

      {/* Quest Chains Accordion List */}
      <div className="space-y-3">
        {questChains.map(chain => {
          const isExpanded = expandedChainId === chain.id;
          const completedStepsCount = chain.steps.filter(s => s.completed).length;
          const progressPercent = Math.round((completedStepsCount / chain.steps.length) * 100);

          return (
            <div
              key={chain.id}
              className={`rounded-2xl border transition-all overflow-hidden ${
                chain.isCompleted
                  ? 'bg-[#eef8f1] border-[#cfe9d9]'
                  : 'bg-[#fffaf1] border-[#eadfcd]'
              }`}
            >
              {/* Header bar */}
              <div
                onClick={() => setExpandedChainId(isExpanded ? null : chain.id)}
                className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-white/45 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">{chain.isCompleted ? '🏆' : '🎯'}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-slate-800">
                        {chain.title}
                      </span>
                      {chain.isCompleted && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold font-pixel">
                          CLEARED! 🎉
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-pixel mt-0.5">
                      <span>
                        진행도: {completedStepsCount}/{chain.steps.length} ({progressPercent}%)
                      </span>
                      <span className="text-purple-600 font-bold">
                        🎁 보너스 +{chain.bonusXp} XP
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-24 hidden sm:block">
                    <div className="pixel-progress-outer h-2.5 w-full bg-slate-200">
                      <div
                        className="pixel-progress-inner h-full bg-purple-500 rounded-full"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  <button
                    onClick={e => {
                      e.stopPropagation();
                      if (window.confirm('이 퀘스트 체인을 삭제하시겠습니까?')) {
                        deleteQuestChain(chain.id);
                      }
                    }}
                    className="p-1 text-slate-400 hover:text-rose-500 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                </div>
              </div>

              {/* Steps expansion */}
              {isExpanded && (
                <div className="p-3 pt-1 border-t border-[#eadfdf] bg-[#fffdf9]/70 space-y-2">
                  {chain.steps.map((step, idx) => (
                    <div
                      key={step.id}
                      onClick={() => toggleChainStep(chain.id, step.id)}
                      className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                        step.completed
                          ? 'bg-[#eef8f1] border-[#cfe9d9] opacity-70'
                          : 'bg-[#fffdf9] border-[#e8dfe2] hover:border-[#d5b8ca]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                            step.completed
                              ? 'bg-emerald-500 border-emerald-600 text-white'
                              : 'bg-slate-100 border-slate-300'
                          }`}
                        >
                          {step.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3 h-3 text-slate-300" />}
                        </div>
                        <span className={`text-xs font-medium ${step.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                          {step.title}
                        </span>
                      </div>

                      <span className="text-[11px] font-pixel font-bold text-[#76619f] px-2 py-0.5 rounded-lg bg-[#f1ecfb] border border-[#ddd2f1]">
                        +{step.xp} XP
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
