import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardMain } from './components/dashboard/DashboardMain';
import { TodayQuestList } from './components/quests/TodayQuestList';
import { CalendarView } from './components/calendar/CalendarView';
import { StatisticsView } from './components/stats/StatisticsView';
import { AchievementsView } from './components/achievements/AchievementsView';
import { CharacterWardrobeView } from './components/character/CharacterWardrobeView';
import { TemplatesView } from './components/templates/TemplatesView';
import { RecurringQuestView } from './components/recurring/RecurringQuestView';
import { SettingsView } from './components/settings/SettingsView';

// Modals
import { AddQuestModal } from './components/modals/AddQuestModal';
import { EditQuestModal } from './components/modals/EditQuestModal';
import { WhatShouldIDoModal } from './components/modals/WhatShouldIDoModal';
import { AiDecomposeModal } from './components/modals/AiDecomposeModal';
import { WeeklyReportModal } from './components/modals/WeeklyReportModal';
import { LevelUpModal } from './components/modals/LevelUpModal';
import { PerfectDayModal } from './components/modals/PerfectDayModal';
import { TemplatesModal } from './components/modals/TemplatesModal';

const AppContent: React.FC = () => {
  const { activeTab, floatingXpList } = useApp();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'today':
        return (
          <div className="space-y-4">
            <div className="pixel-box p-4 bg-gradient-to-r from-pink-100 to-yellow-100 flex items-center justify-between">
              <div>
                <h2 className="font-pixel text-base font-bold text-slate-800">
                  🎮 TODAY QUEST (오늘의 퀘스트 목록)
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  오늘 해결해야 할 모든 업무를 확인하고 완수하여 경험치를 획득하세요!
                </p>
              </div>
            </div>
            <TodayQuestList />
          </div>
        );
      case 'calendar':
        return <CalendarView />;
      case 'stats':
        return <StatisticsView />;
      case 'achievements':
        return <AchievementsView />;
      case 'character':
        return <CharacterWardrobeView />;
      case 'templates':
        return <TemplatesView />;
      case 'recurring':
        return <RecurringQuestView />;
      case 'settings':
        return <SettingsView />;
      case 'dashboard':
      default:
        return <DashboardMain />;
    }
  };

  return (
    <div className="min-h-screen quest-shell text-slate-800 flex flex-col antialiased">
      {/* Floating XP Particles Overlay */}
      {floatingXpList.map(item => (
        <div
          key={item.id}
          className="fixed pointer-events-none z-50 font-pixel font-bold text-sm text-pink-600 drop-shadow-md animate-float-xp bg-white/90 px-2 py-0.5 rounded-full border border-pink-300"
          style={{ left: item.x, top: item.y }}
        >
          +{item.xp} XP ⭐
        </div>
      ))}

      <div className="flex-1 flex max-w-[1540px] w-full mx-auto p-3 sm:p-5 lg:p-6 gap-5">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-[236px] flex-shrink-0">
          <Sidebar />
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileNavOpen && (
          <div
            className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex lg:hidden"
            onClick={() => setIsMobileNavOpen(false)}
          >
            <div
              className="w-72 max-w-[82%] h-full room-sidebar p-3"
              onClick={e => e.stopPropagation()}
            >
              <Sidebar onCloseMobile={() => setIsMobileNavOpen(false)} />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 flex flex-col">
          <Header onOpenMobileNav={() => setIsMobileNavOpen(true)} />
          <div className="flex-1">{renderTabContent()}</div>
        </main>
      </div>

      {/* Global Modals */}
      <AddQuestModal />
      <EditQuestModal />
      <WhatShouldIDoModal />
      <AiDecomposeModal />
      <WeeklyReportModal />
      <LevelUpModal />
      <PerfectDayModal />
      <TemplatesModal />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
