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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 xl:gap-6">
      {/* Center 2 Columns: Progress, Quests, and Chains */}
      <div className="lg:col-span-2 space-y-5">
        {/* Welcome Greeting Banner */}
        <div className="pixel-box dashboard-welcome p-5 sm:p-6 min-h-[116px] flex items-center justify-between">
          <div>
            <div className="section-kicker font-pixel mb-1">
              🐰 WORK QUEST
            </div>
            <h2 className="font-bold text-base sm:text-lg text-slate-800 tracking-tight">
              안녕하세요, <span className="text-pink-600">{profile.nickname}</span>님!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
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
      <div className="space-y-5">
        {/* Bunny Avatar & Room */}
        <BunnyMiniroom />

        {/* Recent Achievement / Motivation Card */}
        <div className="pixel-box p-4 sm:p-5 bg-white space-y-4">
          <div className="flex items-center justify-between border-b border-[#eee3e6] pb-3">
            <div className="flex items-center gap-1.5 font-pixel text-xs font-bold text-slate-800 tracking-wide">
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

          <div className="p-3.5 rounded-2xl bg-[#fff7df] border border-[#f1ddae] flex items-center gap-3">
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
        <div className="pixel-box p-4 sm:p-5 bg-[#f3edfb] text-xs text-slate-700 space-y-2">
          <div className="font-pixel text-[11px] text-[#76619f] font-bold flex items-center gap-1">
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
