import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getLevelTitle, getXpForNextLevel } from '../../utils/constants';
import { Sparkles, Flame, Trophy, Award, Heart, Edit3 } from 'lucide-react';
import { soundManager } from '../../utils/audio';

export const BunnyMiniroom: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { profile, todayCompletedQuests, todayQuests, todayEarnedXp, setIsWhatShouldIDoOpen } = useApp();
  const [isJumping, setIsJumping] = useState(false);
  const [speechText, setSpeechText] = useState<string | null>(null);

  const neededXp = getXpForNextLevel(profile.level);
  const xpPercent = Math.min(100, Math.round((profile.currentXp / neededXp) * 100));

  const handleBunnyClick = () => {
    setIsJumping(true);
    soundManager.playClick();

    const quotes = [
      "오늘도 열일하는 당신이 최고예요! 🐰✨",
      "퀘스트 완료하고 렙업 가자~! ⭐",
      "커피 한 잔 마시고 또 힘내봐요! ☕",
      "칼퇴의 그 순간까지 파이팅! 🌙",
      "토끼는 당신의 성장을 응원해요! 🥕",
      "스트릭 유지 중! 멋져요 🔥",
    ];
    setSpeechText(quotes[Math.floor(Math.random() * quotes.length)]);

    setTimeout(() => {
      setIsJumping(false);
    }, 600);

    setTimeout(() => {
      setSpeechText(null);
    }, 4000);
  };

  // Background room styling
  const getRoomBackground = () => {
    switch (profile.character.room) {
      case 'room_office':
        return 'bg-gradient-to-b from-sky-100 to-indigo-50 border-sky-300';
      case 'room_sakura':
        return 'bg-gradient-to-b from-pink-100 to-rose-50 border-pink-300';
      case 'room_night':
        return 'bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-800 border-indigo-500 text-white';
      case 'room_retro':
        return 'bg-gradient-to-b from-purple-900 to-fuchsia-950 border-fuchsia-500 text-white';
      case 'room_cozy':
      default:
        return 'bg-gradient-to-b from-amber-50 to-orange-50/50 border-amber-200';
    }
  };

  const isNightOrRetro = profile.character.room === 'room_night' || profile.character.room === 'room_retro';

  return (
    <div className={`pixel-box p-4 bg-white relative transition-all duration-300 ${compact ? '' : 'w-full'}`}>
      {/* Top Banner Stats */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-pink-100 border border-pink-300 flex items-center justify-center font-pixel text-xs text-pink-600 font-bold shadow-sm">
            Lv.{profile.level}
          </div>
          <div>
            <div className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
              <span>{profile.nickname}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-pink-50 text-pink-600 border border-pink-200 font-medium">
                {profile.title || getLevelTitle(profile.level)}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-pixel">
              EXP {profile.currentXp.toLocaleString()} / {neededXp.toLocaleString()} XP
            </div>
          </div>
        </div>

        {/* Streak Badge */}
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-600 font-bold text-xs shadow-sm">
          <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-bounce" />
          <span className="font-pixel">{profile.streak} DAY</span>
        </div>
      </div>

      {/* Miniroom Display Area */}
      <div
        className={`relative rounded-xl border-2 overflow-hidden h-48 flex flex-col items-center justify-end p-3 transition-colors ${getRoomBackground()}`}
      >
        {/* Room scenery elements */}
        {profile.character.room === 'room_cozy' && (
          <>
            <div className="absolute top-2 left-3 text-lg opacity-80 select-none">🪴</div>
            <div className="absolute top-3 right-4 text-sm opacity-60 font-pixel text-amber-800/60">🖼️ MY ROOM</div>
            <div className="absolute bottom-2 left-4 text-xs opacity-70">🪑</div>
          </>
        )}
        {profile.character.room === 'room_office' && (
          <>
            <div className="absolute top-2 left-3 text-sm opacity-80 font-pixel text-sky-800">🖥️ DUAL MONITOR</div>
            <div className="absolute top-3 right-4 text-lg">🗄️</div>
          </>
        )}
        {profile.character.room === 'room_sakura' && (
          <>
            <div className="absolute top-2 left-2 text-xl animate-pulse">🌸</div>
            <div className="absolute top-4 right-3 text-xl animate-pulse">🍃</div>
            <div className="absolute top-1 left-1/2 text-sm">🌸</div>
          </>
        )}
        {profile.character.room === 'room_night' && (
          <>
            <div className="absolute top-2 left-3 text-lg">🌙</div>
            <div className="absolute top-3 right-4 text-xs font-pixel text-indigo-300">✨ NIGHT SHIFT</div>
            <div className="absolute top-6 left-1/3 text-xs opacity-70">⭐</div>
          </>
        )}
        {profile.character.room === 'room_retro' && (
          <>
            <div className="absolute top-2 left-3 text-xs font-pixel text-fuchsia-300">👾 8-BIT QUEST</div>
            <div className="absolute top-3 right-4 text-lg">🕹️</div>
            <div className="absolute top-7 left-1/4 text-xs text-yellow-300">★ ★ ★</div>
          </>
        )}

        {/* Speech Bubble */}
        {speechText && (
          <div className="absolute top-2 z-20 px-3 py-1.5 rounded-xl bg-white/95 text-slate-800 text-xs font-medium border border-slate-300 shadow-md animate-float-xp max-w-[85%] text-center">
            {speechText}
            <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45 border-r border-b border-slate-300"></div>
          </div>
        )}

        {/* Bunny Avatar Canvas & SVG */}
        <div
          onClick={handleBunnyClick}
          className={`cursor-pointer select-none relative z-10 flex flex-col items-center transition-transform duration-200 ${
            isJumping ? '-translate-y-4 scale-110' : 'hover:scale-105'
          }`}
          title="토끼를 클릭해보세요!"
        >
          {/* Head item overlay */}
          <div className="relative">
            {profile.character.head === 'head_ribbon' && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xl z-20 filter drop-shadow">🎀</div>
            )}
            {profile.character.head === 'head_cap' && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-2xl z-20 filter drop-shadow">👒</div>
            )}
            {profile.character.head === 'head_bear' && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xl z-20 filter drop-shadow">🐻</div>
            )}
            {profile.character.head === 'head_crown' && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-2xl z-20 filter drop-shadow animate-sparkle">👑</div>
            )}
            {profile.character.head === 'head_party' && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-2xl z-20 filter drop-shadow">🎉</div>
            )}

            {/* Bunny Base Body SVG */}
            <svg width="76" height="84" viewBox="0 0 76 84" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Ears */}
              <ellipse cx="26" cy="22" rx="7" ry="18" fill="#FFFFFF" stroke="#334155" strokeWidth="2.5" />
              <ellipse cx="26" cy="22" rx="4" ry="13" fill="#FCE7F3" />

              <ellipse cx="50" cy="22" rx="7" ry="18" fill="#FFFFFF" stroke="#334155" strokeWidth="2.5" />
              <ellipse cx="50" cy="22" rx="4" ry="13" fill="#FCE7F3" />

              {/* Head */}
              <ellipse cx="38" cy="46" rx="24" ry="20" fill="#FFFFFF" stroke="#334155" strokeWidth="2.5" />

              {/* Eyes */}
              {profile.character.face === 'face_sparkle' ? (
                <>
                  <text x="25" y="48" fontSize="12" fill="#F59E0B">✨</text>
                  <text x="43" y="48" fontSize="12" fill="#F59E0B">✨</text>
                </>
              ) : (
                <>
                  <ellipse cx="28" cy="44" rx="2.5" ry="3.5" fill="#334155" />
                  <circle cx="27" cy="43" r="1" fill="#FFFFFF" />
                  <ellipse cx="48" cy="44" rx="2.5" ry="3.5" fill="#334155" />
                  <circle cx="47" cy="43" r="1" fill="#FFFFFF" />
                </>
              )}

              {/* Nose & Mouth */}
              <polygon points="38,48 36,46 40,46" fill="#F472B6" />
              <path d="M35 50 Q38 53 41 50" stroke="#334155" strokeWidth="1.5" fill="none" strokeLinecap="round" />

              {/* Cheeks / Blush */}
              <ellipse cx="22" cy="50" rx="3.5" ry="2" fill="#FBCFE8" opacity="0.8" />
              <ellipse cx="54" cy="50" rx="3.5" ry="2" fill="#FBCFE8" opacity="0.8" />

              {/* Body */}
              <ellipse cx="38" cy="68" rx="19" ry="14" fill="#FFFFFF" stroke="#334155" strokeWidth="2.5" />
              <ellipse cx="38" cy="68" rx="12" ry="8" fill="#FFF1F2" />

              {/* Paws */}
              <ellipse cx="26" cy="65" rx="4" ry="4" fill="#FFFFFF" stroke="#334155" strokeWidth="2" />
              <ellipse cx="50" cy="65" rx="4" ry="4" fill="#FFFFFF" stroke="#334155" strokeWidth="2" />
              <ellipse cx="28" cy="79" rx="6" ry="3.5" fill="#FFFFFF" stroke="#334155" strokeWidth="2" />
              <ellipse cx="48" cy="79" rx="6" ry="3.5" fill="#FFFFFF" stroke="#334155" strokeWidth="2" />
            </svg>

            {/* Face item overlay */}
            {profile.character.face === 'face_glasses' && (
              <div className="absolute top-[35px] left-1/2 -translate-x-1/2 text-xl z-20 filter drop-shadow">👓</div>
            )}
            {profile.character.face === 'face_sunglasses' && (
              <div className="absolute top-[35px] left-1/2 -translate-x-1/2 text-xl z-20 filter drop-shadow">😎</div>
            )}

            {/* Prop item overlay */}
            {profile.character.prop === 'prop_laptop' && (
              <div className="absolute bottom-[-2px] -right-2 text-xl z-20 filter drop-shadow animate-soft-bounce">💻</div>
            )}
            {profile.character.prop === 'prop_coffee' && (
              <div className="absolute bottom-[-2px] -right-2 text-xl z-20 filter drop-shadow">☕</div>
            )}
            {profile.character.prop === 'prop_pencil' && (
              <div className="absolute bottom-[-2px] -right-2 text-xl z-20 filter drop-shadow">✏️</div>
            )}
            {profile.character.prop === 'prop_book' && (
              <div className="absolute bottom-[-2px] -right-2 text-xl z-20 filter drop-shadow">📚</div>
            )}
            {profile.character.prop === 'prop_gameboy' && (
              <div className="absolute bottom-[-2px] -right-2 text-xl z-20 filter drop-shadow">🎮</div>
            )}
            {profile.character.prop === 'prop_smartphone' && (
              <div className="absolute bottom-[-2px] -right-2 text-xl z-20 filter drop-shadow">📱</div>
            )}
          </div>
        </div>

        {/* Desk platform shadow */}
        <div className={`w-3/4 h-2 rounded-full ${isNightOrRetro ? 'bg-slate-700/60' : 'bg-amber-200/60'} -mt-1`}></div>
      </div>

      {/* XP Progress Bar */}
      <div className="mt-3">
        <div className="flex justify-between text-xs font-bold mb-1">
          <span className="text-slate-600 font-pixel">XP PROGRESS</span>
          <span className="text-pink-600 font-pixel">{xpPercent}%</span>
        </div>
        <div className="pixel-progress-outer h-3.5 w-full">
          <div
            className="pixel-progress-inner h-full bg-gradient-to-r from-pink-400 via-purple-400 to-pink-500 rounded-full"
            style={{ width: `${xpPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Quick Summary Pill Bar */}
      <div className="grid grid-cols-2 gap-2 mt-3 text-center">
        <div className="p-2 rounded-lg bg-pink-50/70 border border-pink-200">
          <div className="text-[10px] text-pink-600 font-bold">오늘 획득 XP</div>
          <div className="text-sm font-pixel font-bold text-pink-700">+{todayEarnedXp} XP</div>
        </div>
        <div className="p-2 rounded-lg bg-sky-50/70 border border-sky-200">
          <div className="text-[10px] text-sky-600 font-bold">오늘 완료</div>
          <div className="text-sm font-pixel font-bold text-sky-700">
            {todayCompletedQuests.length} / {todayQuests.length}
          </div>
        </div>
      </div>
    </div>
  );
};
