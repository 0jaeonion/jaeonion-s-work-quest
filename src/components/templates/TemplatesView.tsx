import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Difficulty, Importance, QuestTemplate, TemplateTask } from '../../types';
import { Layers, Plus, Trash2, CheckCircle2, Sparkles, ArrowRight, Play } from 'lucide-react';
import { soundManager } from '../../utils/audio';

export const TemplatesView: React.FC = () => {
  const { templates, applyTemplate, addTemplate, deleteTemplate, categories, setActiveTab } = useApp();
  const [isCreating, setIsCreating] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateIcon, setTemplateIcon] = useState('📦');
  const [templateDesc, setTemplateDesc] = useState('');
  const [tasks, setTasks] = useState<TemplateTask[]>([
    { title: '1단계 업무', category: '문서', difficulty: 'EASY', estimatedMinutes: 10, importance: 'NORMAL', xp: 10 },
    { title: '2단계 업무', category: '문서', difficulty: 'NORMAL', estimatedMinutes: 20, importance: 'HIGH', xp: 20 },
  ]);

  const handleApply = (tplId: string, tplName: string) => {
    applyTemplate(tplId);
    soundManager.playQuestComplete();
    alert(`[${tplName}] 템플릿의 모든 퀘스트가 오늘의 퀘스트에 즉시 추가되었습니다! ✨`);
    setActiveTab('dashboard');
  };

  const handleTaskChange = (idx: number, field: keyof TemplateTask, val: any) => {
    const updated = [...tasks];
    updated[idx] = { ...updated[idx], [field]: val };
    setTasks(updated);
  };

  const handleAddTaskRow = () => {
    setTasks(prev => [
      ...prev,
      {
        title: `추가 업무 ${prev.length + 1}`,
        category: categories[0]?.name || '문서',
        difficulty: 'NORMAL',
        estimatedMinutes: 15,
        importance: 'NORMAL',
        xp: 20,
      },
    ]);
  };

  const handleRemoveTaskRow = (idx: number) => {
    if (tasks.length <= 1) return;
    setTasks(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateName.trim()) return;

    addTemplate({
      name: templateName.trim(),
      icon: templateIcon,
      description: templateDesc,
      tasks,
    });

    setIsCreating(false);
    setTemplateName('');
    setTemplateDesc('');
    soundManager.playClick();
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="pixel-box p-4 bg-gradient-to-r from-purple-100 via-pink-100 to-yellow-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-4xl animate-bounce-short">📦</span>
          <div>
            <h2 className="font-pixel text-base font-bold text-slate-800">
              업무 템플릿 (QUEST TEMPLATES)
            </h2>
            <p className="text-xs text-slate-600">
              월말 정산, 주간 보고 등 반복되는 대형 세트 업무를 클릭 한 번으로 등록하세요!
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="pixel-btn px-4 py-2 rounded-xl bg-purple-600 text-white font-pixel text-xs font-bold flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>새 템플릿 만들기</span>
        </button>
      </div>

      {/* Template Creation Form */}
      {isCreating && (
        <form onSubmit={handleSaveTemplate} className="pixel-box p-4 bg-white space-y-4 border-2 border-purple-400">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="font-pixel text-xs font-bold text-purple-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>새로운 업무 템플릿 생성</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              닫기
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">아이콘</label>
              <input
                type="text"
                value={templateIcon}
                onChange={e => setTemplateIcon(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border text-center text-lg"
                maxLength={2}
              />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-xs font-bold text-slate-700 mb-1">템플릿 이름</label>
              <input
                type="text"
                value={templateName}
                onChange={e => setTemplateName(e.target.value)}
                placeholder="예: 분기 결산 루틴 세트"
                className="w-full px-3 py-1.5 rounded-lg border text-xs"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">설명</label>
            <input
              type="text"
              value={templateDesc}
              onChange={e => setTemplateDesc(e.target.value)}
              placeholder="템플릿에 대한 간단한 설명을 입력하세요"
              className="w-full px-3 py-1.5 rounded-lg border text-xs"
            />
          </div>

          {/* Subtasks List */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-700">포함될 퀘스트 목록 ({tasks.length}개)</label>
              <button
                type="button"
                onClick={handleAddTaskRow}
                className="text-xs text-purple-600 font-bold flex items-center gap-1 hover:text-purple-800"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>업무 추가</span>
              </button>
            </div>

            <div className="space-y-2">
              {tasks.map((task, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border">
                  <span className="font-pixel text-xs text-purple-700 font-bold w-5">{idx + 1}.</span>
                  <input
                    type="text"
                    value={task.title}
                    onChange={e => handleTaskChange(idx, 'title', e.target.value)}
                    placeholder="업무명"
                    className="flex-1 px-2.5 py-1 rounded border text-xs bg-white"
                    required
                  />
                  <select
                    value={task.category}
                    onChange={e => handleTaskChange(idx, 'category', e.target.value)}
                    className="text-xs px-2 py-1 rounded border bg-white"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>
                        {c.icon} {c.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={task.estimatedMinutes}
                    onChange={e => handleTaskChange(idx, 'estimatedMinutes', Number(e.target.value))}
                    className="w-16 px-2 py-1 rounded border text-xs bg-white text-center"
                    placeholder="분"
                  />
                  <span className="text-[10px] text-slate-500">분</span>

                  {tasks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTaskRow(idx)}
                      className="p-1 text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
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
              className="pixel-btn px-4 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-bold font-pixel"
            >
              저장하기
            </button>
          </div>
        </form>
      )}

      {/* Templates Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map(tpl => (
          <div key={tpl.id} className="pixel-box p-4 bg-white flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{tpl.icon}</span>
                  <h3 className="font-bold text-sm text-slate-800">{tpl.name}</h3>
                </div>

                <button
                  onClick={() => {
                    if (window.confirm(`"${tpl.name}" 템플릿을 삭제하시겠습니까?`)) {
                      deleteTemplate(tpl.id);
                    }
                  }}
                  className="text-slate-400 hover:text-rose-500 p-1"
                  title="템플릿 삭제"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-xs text-slate-500 mb-3">{tpl.description}</p>

              {/* Subtasks Preview */}
              <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <div className="text-[10px] font-pixel font-bold text-slate-500 mb-1">
                  포함 퀘스트 ({tpl.tasks.length}개 세트)
                </div>
                {tpl.tasks.map((task, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs text-slate-700">
                    <span className="truncate flex-1">
                      ☐ {task.title}
                    </span>
                    <span className="font-pixel text-[10px] text-pink-600 ml-2 font-bold whitespace-nowrap">
                      +{task.xp || 20} XP
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Apply Button */}
            <button
              onClick={() => handleApply(tpl.id, tpl.name)}
              className="pixel-btn w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-pixel text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>오늘의 퀘스트로 일괄 적용하기</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
