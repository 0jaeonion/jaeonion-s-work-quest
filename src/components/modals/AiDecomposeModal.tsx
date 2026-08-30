import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { decomposeBigTask } from '../../utils/aiAssistant';
import { Difficulty } from '../../types';
import { X, Wand2, Sparkles, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../../utils/audio';

export const AiDecomposeModal: React.FC = () => {
  const { isAiDecomposeOpen, setIsAiDecomposeOpen, addQuestChain } = useApp();
  const [goalInput, setGoalInput] = useState('');
  const [decomposedResult, setDecomposedResult] = useState<ReturnType<typeof decomposeBigTask> | null>(null);

  if (!isAiDecomposeOpen) return null;

  const handleDecompose = () => {
    if (!goalInput.trim()) return;
    const result = decomposeBigTask(goalInput.trim());
    setDecomposedResult(result);
    soundManager.playClick();
  };

  const handleStepChange = (index: number, val: string) => {
    if (!decomposedResult) return;
    const updated = [...decomposedResult.steps];
    updated[index] = { ...updated[index], title: val };
    setDecomposedResult({ ...decomposedResult, steps: updated });
  };

  const handleRemoveStep = (index: number) => {
    if (!decomposedResult || decomposedResult.steps.length <= 2) return;
    const updated = decomposedResult.steps.filter((_, i) => i !== index);
    setDecomposedResult({ ...decomposedResult, steps: updated });
  };

  const handleAddStep = () => {
    if (!decomposedResult) return;
    setDecomposedResult({
      ...decomposedResult,
      steps: [
        ...decomposedResult.steps,
        { title: `추가 ${decomposedResult.steps.length + 1}단계 작업`, xp: 20, difficulty: 'NORMAL' },
      ],
    });
  };

  const handleCreateChain = () => {
    if (!decomposedResult) return;

    addQuestChain({
      title: decomposedResult.title,
      category: '자동화',
      bonusXp: decomposedResult.bonusXp,
      steps: decomposedResult.steps.map((s, idx) => ({
        id: `chain-step-${Date.now()}-${idx}`,
        title: s.title,
        xp: s.xp,
        difficulty: s.difficulty,
        completed: false,
      })),
    });

    soundManager.playLevelUp();
    setIsAiDecomposeOpen(false);
    setGoalInput('');
    setDecomposedResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="pixel-box w-full max-w-lg bg-white overflow-hidden shadow-pixel-lg">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-sky-100 via-indigo-100 to-purple-100 border-b-2 border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            <h2 className="font-pixel text-sm font-bold text-slate-800">
              AI 대형 업무 분해기 (QUEST DECOMPOSER)
            </h2>
          </div>
          <button
            onClick={() => setIsAiDecomposeOpen(false)}
            className="p-1 rounded-lg hover:bg-white/60 text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              분해할 대형 업무 또는 목표를 입력하세요:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={goalInput}
                onChange={e => setGoalInput(e.target.value)}
                placeholder="예: 다음 주까지 2026년 하반기 결산 보고서 작성"
                className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-sky-300"
              />
              <button
                type="button"
                onClick={handleDecompose}
                disabled={!goalInput.trim()}
                className="pixel-btn px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-pixel text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
              >
                <Wand2 className="w-4 h-4" />
                <span>분해 실행</span>
              </button>
            </div>
          </div>

          {/* Result preview */}
          {decomposedResult && (
            <div className="space-y-3 pt-2 border-t">
              <div className="flex items-center justify-between">
                <div className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>{decomposedResult.title}</span>
                </div>
                <span className="text-[10px] font-pixel text-purple-700 font-bold bg-purple-100 px-2 py-0.5 rounded">
                  올클리어 보너스 +{decomposedResult.bonusXp} XP
                </span>
              </div>

              <div className="space-y-2">
                {decomposedResult.steps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-pixel text-xs font-bold text-sky-700 w-5">{idx + 1}.</span>
                    <input
                      type="text"
                      value={step.title}
                      onChange={e => handleStepChange(idx, e.target.value)}
                      className="flex-1 px-2.5 py-1 rounded-lg border text-xs bg-white"
                    />
                    <span className="text-[10px] font-pixel font-bold text-pink-600 px-1.5">
                      +{step.xp} XP
                    </span>
                    {decomposedResult.steps.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveStep(idx)}
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
                onClick={handleAddStep}
                className="text-xs text-sky-600 hover:text-sky-800 font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>단계 추가하기</span>
              </button>

              <button
                type="button"
                onClick={handleCreateChain}
                className="pixel-btn w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-pixel text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm mt-3"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>퀘스트 체인으로 등록하기</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
