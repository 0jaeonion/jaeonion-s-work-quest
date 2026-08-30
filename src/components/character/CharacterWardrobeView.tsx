import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CHARACTER_ITEMS, LEVEL_TITLES } from '../../utils/constants';
import { BunnyMiniroom } from './BunnyMiniroom';
import { Sparkles, Check, Lock, Edit3, UserCheck } from 'lucide-react';
import { soundManager } from '../../utils/audio';

export const CharacterWardrobeView: React.FC = () => {
  const { profile, equipItem, updateNickname } = useApp();
  const [activeSlot, setActiveSlot] = useState<'head' | 'face' | 'prop' | 'room'>('head');
  const [editingNick, setEditingNick] = useState(false);
  const [nicknameInput, setNicknameInput] = useState(profile.nickname);

  const slotItems = CHARACTER_ITEMS.filter(item => item.type === activeSlot);

  const handleSaveNickname = (e: React.FormEvent) => {
    e.preventDefault();
    if (nicknameInput.trim()) {
      updateNickname(nicknameInput.trim());
      setEditingNick(false);
      soundManager.playClick();
    }
  };

  const isUnlocked = (item: (typeof CHARACTER_ITEMS)[0]) => {
    if (profile.unlockedItems.includes(item.id)) return true;
    if (item.unlockLevel && profile.level >= item.unlockLevel) return true;
    return false;
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="pixel-box p-4 bg-gradient-to-r from-pink-100 via-purple-100 to-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-4xl animate-bounce-short">🐰</span>
          <div>
            <h2 className="font-pixel text-base font-bold text-slate-800">
              토끼 아바타 & 미니룸 드레스룸
            </h2>
            <p className="text-xs text-slate-600">
              레벨업과 업적으로 획득한 귀여운 아이템으로 나만의 직장인 토끼를 꾸며보세요!
            </p>
          </div>
        </div>

        {/* Edit Nickname Form */}
        <div className="bg-white/90 p-2 rounded-xl border border-pink-200">
          {editingNick ? (
            <form onSubmit={handleSaveNickname} className="flex items-center gap-1.5">
              <input
                type="text"
                value={nicknameInput}
                onChange={e => setNicknameInput(e.target.value)}
                className="px-2 py-1 text-xs border rounded-lg focus:outline-none"
                placeholder="새 닉네임"
                maxLength={12}
                autoFocus
              />
              <button
                type="submit"
                className="pixel-btn px-2.5 py-1 bg-pink-500 text-white text-xs font-pixel rounded-lg"
              >
                저장
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-slate-800">{profile.nickname}</span>
              <button
                onClick={() => setEditingNick(true)}
                className="p-1 text-slate-400 hover:text-slate-700"
                title="닉네임 변경"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Avatar Preview + Wardrobe Catalog */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left Column: Interactive Miniroom Preview */}
        <div className="md:col-span-1">
          <BunnyMiniroom />
        </div>

        {/* Right 2 Columns: Items Wardrobe */}
        <div className="md:col-span-2 pixel-box p-4 bg-white space-y-4">
          {/* Wardrobe Slot Category Tabs */}
          <div className="flex items-center gap-2 border-b pb-3">
            {[
              { id: 'head', label: '머리 장식 🎀' },
              { id: 'face', label: '얼굴/표정 👓' },
              { id: 'prop', label: '업무 소품 💻' },
              { id: 'room', label: '룸 배경 🏠' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  soundManager.playClick();
                  setActiveSlot(tab.id as typeof activeSlot);
                }}
                className={`px-3 py-1.5 rounded-xl font-pixel text-xs font-bold transition-all ${
                  activeSlot === tab.id
                    ? 'bg-pink-400 text-white shadow-pixel-pink'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {slotItems.map(item => {
              const unlocked = isUnlocked(item);
              const isEquipped = profile.character[activeSlot] === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (unlocked) {
                      equipItem(activeSlot, item.id);
                    }
                  }}
                  className={`pixel-box p-3 rounded-xl border-2 transition-all text-center flex flex-col items-center justify-between cursor-pointer ${
                    isEquipped
                      ? 'bg-pink-50 border-pink-400 pixel-box-pink'
                      : unlocked
                      ? 'bg-white border-slate-200 hover:border-pink-300'
                      : 'bg-slate-100 border-slate-300 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-2xl mb-1.5 border border-slate-200 relative">
                    {item.icon}
                    {isEquipped && (
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-pink-500 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                        ✓
                      </span>
                    )}
                    {!unlocked && (
                      <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[0.5px] rounded-xl flex items-center justify-center">
                        <Lock className="w-4 h-4 text-slate-700" />
                      </div>
                    )}
                  </div>

                  <div className="font-bold text-xs text-slate-800 truncate w-full mb-0.5">
                    {item.name}
                  </div>
                  <p className="text-[10px] text-slate-500 line-clamp-1 mb-2">
                    {item.description}
                  </p>

                  {/* Status button / text */}
                  {isEquipped ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-pink-500 text-white text-[10px] font-pixel font-bold">
                      착용 중
                    </span>
                  ) : unlocked ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-pixel font-bold hover:bg-pink-100 hover:text-pink-700">
                      착용하기
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 text-[10px] font-pixel font-bold">
                      Lv.{item.unlockLevel || 1} 해금
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
