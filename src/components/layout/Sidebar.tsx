import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Home,
  CheckSquare,
  Calendar,
  BarChart3,
  Trophy,
  Smile,
  Layers,
  Repeat,
  Settings,
  Sparkles,
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, emoji: '🏠' },
  { id: 'today', label: 'Today Quest', icon: CheckSquare, emoji: '🎮' },
  { id: 'calendar', label: 'Calendar', icon: Calendar, emoji: '📅' },
  { id: 'stats', label: 'Statistics', icon: BarChart3, emoji: '📊' },
  { id: 'achievements', label: 'Achievements', icon: Trophy, emoji: '🏆' },
  { id: 'character', label: 'Character', icon: Smile, emoji: '🐰' },
  { id: 'templates', label: 'Templates', icon: Layers, emoji: '📦' },
  { id: 'recurring', label: 'Recurring Quest', icon: Repeat, emoji: '🔄' },
  { id: 'settings', label: 'Settings', icon: Settings, emoji: '⚙️' },
];

export const Sidebar: React.FC<{ onCloseMobile?: () => void }> = ({ onCloseMobile }) => {
  const { activeTab, setActiveTab } = useApp();

  return (
    <aside className="w-full room-sidebar pixel-box p-4 flex flex-col justify-between h-full">
      <div className="space-y-4">
        {/* Brand Logo */}
        <div
          onClick={() => {
            setActiveTab('dashboard');
            onCloseMobile?.();
          }}
          className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-gradient-to-r from-[#fff0f5] to-[#f2ecfb] border border-pink-200 cursor-pointer shadow-sm transition-transform hover:-translate-y-0.5"
        >
          <div className="w-10 h-10 rounded-xl bg-[#fffdf9] border border-pink-200 flex items-center justify-center text-2xl shadow-sm">
            🐰
          </div>
          <div>
            <h1 className="font-pixel text-xs font-bold text-slate-800 tracking-wider">
              WORK QUEST
            </h1>
            <p className="text-[10px] text-pink-600 font-bold font-pixel">
              오늘의 업무를 게임으로
            </p>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="space-y-1">
          {NAV_ITEMS.map(item => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => {
                  soundManager.playClick();
                  setActiveTab(item.id);
                  onCloseMobile?.();
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'sidebar-nav-item is-active'
                    : 'sidebar-nav-item text-slate-600'
                }`}
              >
                <span className="text-base">{item.emoji}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Tagline */}
      <div className="pt-3 border-t border-slate-200 text-center">
        <div className="text-[10px] font-pixel text-slate-400">
          WORK QUEST v1.0
        </div>
        <div className="text-[10px] text-pink-500 font-bold mt-0.5">
          "오늘의 업무를 퀘스트로, 완료를 성장으로."
        </div>
      </div>
    </aside>
  );
};
