import React from 'react';
import { useApp } from '../../context/AppContext';
import { TodayProgressWidget } from './TodayProgressWidget';
import { TodayQuestList } from '../quests/TodayQuestList';
import { QuestChainSection } from '../chains/QuestChainSection';
import { BunnyMiniroom } from '../character/BunnyMiniroom';
import { Trophy, Flame, Sparkles, ArrowRight } from 'lucide-react';
import { soundManager } from '../../utils/audio';

export const DashboardMain: React.FC = () => {
  const { achievements, profile, setActiveTab } = useApp();

  // Find recent achievement
  const recentAchievement = achievements.find(a => a.isUnlocked) || achievements[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Center 2 Columns: Progress, Quests, and Chains */}
      <div className="lg:col-span-2 space-y-4">
        {/* Welcome Greeting Banner */}
        <div className="pixel-box p-4 bg-gradient-to-r from-pink-100 via-purple-100 to-sky-100 flex items-center justify-between">
          <div>
            <div className="font-pixel text-xs text-pink-600 font-bold mb-0.5">
              🐰 WORK QUEST
            </div>
            <h2 className="font-bold text-sm sm:text-base text-slate-800">
              안녕하세요, <span className="text-pink-600">{profile.nickname}</span>님!
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              오늘도 활기차게 퀘스트를 클리어하고 레벨업해볼까요? ✨
            </p>
          </div>
          <div className="text-3xl sm:text-4xl animate-bounce-short">
            🥕
          </div>
        </div>

        {/* Today Progress Widget */}
        <TodayProgressWidget />

        {/* Today Quest List */}
        <TodayQuestList />

        {/* Quest Chain Section */}
        <QuestChainSection />
      </div>

      {/* Right Column: Bunny Miniroom & Side Stats */}
      <div className="space-y-4">
        {/* Bunny Avatar & Room */}
        <BunnyMiniroom />

        {/* Recent Achievement / Motivation Card */}
        <div className="pixel-box p-4 bg-white space-y-3">
          <div className="flex items-center justify-between border-b pb-2">
            <div className="flex items-center gap-1.5 font-pixel text-xs font-bold text-slate-800">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>최근 업적 (ACHIEVEMENT)</span>
            </div>
            <button
              onClick={() => {
                soundManager.playClick();
                setActiveTab('achievements');
              }}
              className="text-[11px] text-pink-600 font-bold hover:underline flex items-center gap-0.5"
            >
              <span>전체보기</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center gap-3">
            <div className="text-2xl">{recentAchievement.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-xs text-slate-800 truncate">
                {recentAchievement.title}
              </div>
              <div className="text-[11px] text-slate-500 line-clamp-1">
                {recentAchievement.description}
              </div>
            </div>
          </div>
        </div>

        {/* Helpful RPG Productivity Tip */}
        <div className="pixel-box p-4 bg-gradient-to-br from-purple-50 to-pink-50 text-xs text-slate-700 space-y-1.5">
          <div className="font-pixel text-[11px] text-purple-800 font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>오늘의 모험 꿀팁</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-600">
            5~10분짜리 짧은 퀘스트를 먼저 2~3개 클리어하면 도파민이 분비되어 집중력이 급상승합니다! ⚡
          </p>
        </div>
      </div>
    </div>
  );
};
