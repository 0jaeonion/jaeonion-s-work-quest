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
    <header className="pixel-box p-3 sm:p-3.5 bg-white mb-5 flex items-center justify-between">
      {/* Left: Mobile hamburger & Date */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden p-2 rounded-xl bg-[#f7eef1] hover:bg-[#fbe3ed] text-[#a25a7b] border border-[#ead8df] transition-colors"
          aria-label="메뉴 열기"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xl hidden sm:inline">🐰</span>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#fff2f5] text-[#a8587e] border border-[#f2cad9] font-pixel text-[11px] font-bold">
            <Calendar className="w-3.5 h-3.5 text-pink-500" />
            <span>{todayFormatted}</span>
          </div>
        </div>
      </div>

      {/* Right: Quick Stats & Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Streak */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#fff4dc] text-[#9c7134] border border-[#f0dba9] text-[11px] font-pixel font-bold shadow-sm">
          <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
          <span>{profile.streak} DAY</span>
        </div>

        {/* Level badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#f1ecfb] text-[#76619f] border border-[#ddd2f1] text-[11px] font-pixel font-bold">
          <Zap className="w-3.5 h-3.5 text-purple-500" />
          <span>Lv.{profile.level}</span>
        </div>

        {/* Sound toggle button */}
        <button
          onClick={toggleSound}
          title={settings.soundEnabled ? '사운드 끄기' : '사운드 켜기'}
          className={`p-2 rounded-xl border shadow-sm transition-all ${
            settings.soundEnabled
              ? 'bg-[#fff2f5] text-[#c46691] border-[#f2cad9]'
              : 'bg-[#f5f0f1] text-[#aaa1aa] border-[#e7dfe2]'
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
          className="p-2 rounded-xl bg-[#f7f3f7] hover:bg-[#f1e8f0] text-[#716979] border border-[#e6dfe5] shadow-sm transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
