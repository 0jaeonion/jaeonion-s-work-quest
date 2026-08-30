import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Layers, Play } from 'lucide-react';
import { soundManager } from '../../utils/audio';

export const TemplatesModal: React.FC = () => {
  const { isTemplateModalOpen, setIsTemplateModalOpen, templates, applyTemplate, setActiveTab } = useApp();

  if (!isTemplateModalOpen) return null;

  const handleApply = (id: string, name: string) => {
    applyTemplate(id);
    soundManager.playQuestComplete();
    setIsTemplateModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="pixel-box w-full max-w-lg bg-white overflow-hidden shadow-pixel-lg">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 border-b-2 border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📦</span>
            <h2 className="font-pixel text-sm font-bold text-slate-800">
              업무 템플릿 불러오기 (TEMPLATES)
            </h2>
          </div>
          <button
            onClick={() => setIsTemplateModalOpen(false)}
            className="p-1 rounded-lg hover:bg-white/60 text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto">
          {templates.map(tpl => (
            <div
              key={tpl.id}
              className="p-3.5 rounded-xl border-2 border-slate-300 hover:border-purple-400 bg-slate-50 hover:bg-purple-50/40 transition-all flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{tpl.icon}</span>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-slate-800">
                    {tpl.name}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium line-clamp-1">
                    {tpl.description} ({tpl.tasks.length}개 업무 포함)
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleApply(tpl.id, tpl.name)}
                className="pixel-btn px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-pixel text-xs font-bold flex items-center gap-1 whitespace-nowrap"
              >
                <Play className="w-3 h-3 fill-white" />
                <span>적용</span>
              </button>
            </div>
          ))}
        </div>

        <div className="p-3 bg-slate-50 border-t flex items-center justify-between text-xs">
          <span className="text-slate-500">템플릿을 직접 추가하거나 수정하고 싶으신가요?</span>
          <button
            onClick={() => {
              setIsTemplateModalOpen(false);
              setActiveTab('templates');
            }}
            className="text-purple-600 font-bold hover:underline"
          >
            템플릿 관리 탭으로 이동 →
          </button>
        </div>
      </div>
    </div>
  );
};
