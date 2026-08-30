import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  Flame,
  Volume2,
  VolumeX,
  Settings,
  Sparkles,
  Zap,
  Calendar,
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

export const Header: React.FC<{ onOpenMobileNav: () => void }> = ({ onOpenMobileNav }) => {
  const { profile, settings, updateSettings, setActiveTab } = useApp();

  // Korean Date string (e.g., "2026년 8월 30일 (일)")
  const todayFormatted = (() => {
    const d = new Date();
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${days[d.getDay()]})`;
  })();

  const toggleSound = () => {
    const nextVal = !settings.soundEnabled;
    updateSettings({ soundEnabled: nextVal });
    soundManager.setEnabled(nextVal);
    if (nextVal) soundManager.playClick();
  };

  return (
    <header className="pixel-box p-3 bg-white mb-4 flex items-center justify-between">
      {/* Left: Mobile hamburger & Date */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
          aria-label="메뉴 열기"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xl hidden sm:inline">🐰</span>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-pink-50 text-pink-700 border border-pink-200 font-pixel text-xs font-bold">
            <Calendar className="w-3.5 h-3.5 text-pink-500" />
            <span>{todayFormatted}</span>
          </div>
        </div>
      </div>

      {/* Right: Quick Stats & Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Streak */}
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-orange-50 text-orange-700 border border-orange-200 text-xs font-pixel font-bold shadow-xs">
          <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
          <span>{profile.streak} DAY</span>
        </div>

        {/* Level badge */}
        <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 text-xs font-pixel font-bold">
          <Zap className="w-3.5 h-3.5 text-purple-500" />
          <span>Lv.{profile.level}</span>
        </div>

        {/* Sound toggle button */}
        <button
          onClick={toggleSound}
          title={settings.soundEnabled ? '사운드 끄기' : '사운드 켜기'}
          className={`p-2 rounded-xl border transition-all ${
            settings.soundEnabled
              ? 'bg-pink-50 text-pink-600 border-pink-200'
              : 'bg-slate-100 text-slate-400 border-slate-200'
          }`}
        >
          {settings.soundEnabled ? (
            <Volume2 className="w-4 h-4" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
        </button>

        {/* Settings button */}
        <button
          onClick={() => {
            soundManager.playClick();
            setActiveTab('settings');
          }}
          title="설정"
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
