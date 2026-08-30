import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Achievement,
  AppSettings,
  Category,
  Difficulty,
  Importance,
  Quest,
  QuestChain,
  QuestStatus,
  QuestTemplate,
  RecurringQuest,
  SortOption,
  UserProfile,
} from '../types';
import {
  CHARACTER_ITEMS,
  DEFAULT_ACHIEVEMENTS,
  DEFAULT_CATEGORIES,
  DEFAULT_RECURRING,
  DEFAULT_TEMPLATES,
  DIFFICULTY_INFO,
  getLevelTitle,
  getXpForNextLevel,
  INITIAL_CHAINS,
  getInitialQuests,
} from '../utils/constants';
import { soundManager } from '../utils/audio';

interface LevelUpEvent {
  oldLevel: number;
  newLevel: number;
  newTitle: string;
  unlockedItems: string[];
}

interface AppContextType {
  // State
  quests: Quest[];
  categories: Category[];
  questChains: QuestChain[];
  templates: QuestTemplate[];
  recurringQuests: RecurringQuest[];
  profile: UserProfile;
  achievements: Achievement[];
  settings: AppSettings;
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Filters & Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;

  // Modals & UI Events
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  editingQuest: Quest | null;
  setEditingQuest: (quest: Quest | null) => void;
  isAiDecomposeOpen: boolean;
  setIsAiDecomposeOpen: (open: boolean) => void;
  isWhatShouldIDoOpen: boolean;
  setIsWhatShouldIDoOpen: (open: boolean) => void;
  isWeeklyReportOpen: boolean;
  setIsWeeklyReportOpen: (open: boolean) => void;
  isTemplateModalOpen: boolean;
  setIsTemplateModalOpen: (open: boolean) => void;
  isLevelUpOpen: boolean;
  setIsLevelUpOpen: (open: boolean) => void;
  levelUpData: LevelUpEvent | null;
  isPerfectDayOpen: boolean;
  setIsPerfectDayOpen: (open: boolean) => void;
  floatingXpList: { id: string; xp: number; x: number; y: number }[];

  // Actions
  addQuest: (data: Omit<Quest, 'id' | 'createdAt' | 'status'> & { status?: QuestStatus }) => Quest;
  addMultipleQuests: (tasks: Array<Omit<Quest, 'id' | 'createdAt' | 'status'>>) => void;
  updateQuest: (id: string, updates: Partial<Quest>) => void;
  deleteQuest: (id: string) => void;
  completeQuest: (id: string, clickPos?: { x: number; y: number }) => void;
  reopenQuest: (id: string) => void;
  startQuest: (id: string) => void;

  // Categories
  addCategory: (cat: Omit<Category, 'id'>) => void;

  // Quest Chains
  addQuestChain: (chain: Omit<QuestChain, 'id' | 'createdAt' | 'isCompleted'>) => void;
  toggleChainStep: (chainId: string, stepId: string) => void;
  deleteQuestChain: (id: string) => void;

  // Templates
  applyTemplate: (templateId: string) => void;
  addTemplate: (tpl: Omit<QuestTemplate, 'id'>) => void;
  deleteTemplate: (templateId: string) => void;

  // Recurring Quests
  addRecurringQuest: (req: Omit<RecurringQuest, 'id'>) => void;
  deleteRecurringQuest: (id: string) => void;

  // Profile & Customization
  updateNickname: (nick: string) => void;
  equipItem: (type: 'head' | 'face' | 'prop' | 'room', itemId: string) => void;

  // Settings & Data
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  exportDataJson: () => string;
  importDataJson: (json: string) => boolean;
  resetAllData: () => void;

  // Stats Helpers
  todayQuests: Quest[];
  todayCompletedQuests: Quest[];
  todayProgressPercentage: number;
  todayEarnedXp: number;
  isTodayPerfect: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  QUESTS: 'workquest_quests_v1',
  CATEGORIES: 'workquest_categories_v1',
  CHAINS: 'workquest_chains_v1',
  TEMPLATES: 'workquest_templates_v1',
  RECURRING: 'workquest_recurring_v1',
  PROFILE: 'workquest_profile_v1',
  ACHIEVEMENTS: 'workquest_achievements_v1',
  SETTINGS: 'workquest_settings_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from localStorage or defaults
  const [quests, setQuests] = useState<Quest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.QUESTS);
      return saved ? JSON.parse(saved) : getInitialQuests();
    } catch {
      return getInitialQuests();
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
    } catch {
      return DEFAULT_CATEGORIES;
    }
  });

  const [questChains, setQuestChains] = useState<QuestChain[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHAINS);
      return saved ? JSON.parse(saved) : INITIAL_CHAINS;
    } catch {
      return INITIAL_CHAINS;
    }
  });

  const [templates, setTemplates] = useState<QuestTemplate[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
      return saved ? JSON.parse(saved) : DEFAULT_TEMPLATES;
    } catch {
      return DEFAULT_TEMPLATES;
    }
  });

  const [recurringQuests, setRecurringQuests] = useState<RecurringQuest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RECURRING);
      return saved ? JSON.parse(saved) : DEFAULT_RECURRING;
    } catch {
      return DEFAULT_RECURRING;
    }
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      nickname: '일잘러 토끼',
      title: '업무자동화 마스터 ⚡',
      level: 12,
      currentXp: 820,
      totalXp: 4820,
      streak: 7,
      maxStreak: 12,
      lastActiveDate: new Date().toISOString().split('T')[0],
      character: {
        head: 'head_ribbon',
        face: 'face_blush',
        prop: 'prop_laptop',
        room: 'room_cozy',
      },
      unlockedItems: ['head_none', 'head_ribbon', 'head_cap', 'head_bear', 'head_crown', 'face_none', 'face_blush', 'face_glasses', 'face_sunglasses', 'face_sparkle', 'prop_none', 'prop_laptop', 'prop_coffee', 'prop_pencil', 'prop_book', 'prop_gameboy', 'prop_smartphone', 'room_cozy', 'room_office', 'room_sakura', 'room_night'],
    };
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      return saved ? JSON.parse(saved) : DEFAULT_ACHIEVEMENTS;
    } catch {
      return DEFAULT_ACHIEVEMENTS;
    }
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      soundEnabled: true,
      soundVolume: 0.7,
      animationsEnabled: true,
      weekendStreakIncluded: false,
      defaultSort: 'SMART',
      theme: 'pastel-pink',
    };
  });

  // Navigation & Filters
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<SortOption>(settings.defaultSort || 'SMART');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
  const [isAiDecomposeOpen, setIsAiDecomposeOpen] = useState<boolean>(false);
  const [isWhatShouldIDoOpen, setIsWhatShouldIDoOpen] = useState<boolean>(false);
  const [isWeeklyReportOpen, setIsWeeklyReportOpen] = useState<boolean>(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState<boolean>(false);
  const [isLevelUpOpen, setIsLevelUpOpen] = useState<boolean>(false);
  const [levelUpData, setLevelUpData] = useState<LevelUpEvent | null>(null);
  const [isPerfectDayOpen, setIsPerfectDayOpen] = useState<boolean>(false);
  const [floatingXpList, setFloatingXpList] = useState<{ id: string; xp: number; x: number; y: number }[]>([]);

  // Sync sound settings with synthesizer
  useEffect(() => {
    soundManager.setEnabled(settings.soundEnabled);
    soundManager.setVolume(settings.soundVolume);
  }, [settings.soundEnabled, settings.soundVolume]);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.QUESTS, JSON.stringify(quests));
  }, [quests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHAINS, JSON.stringify(questChains));
  }, [questChains]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
  }, [templates]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RECURRING, JSON.stringify(recurringQuests));
  }, [recurringQuests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  // Today helpers
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  const todayQuests = useMemo(() => {
    return quests.filter(q => q.dueDate === todayStr);
  }, [quests, todayStr]);

  const todayCompletedQuests = useMemo(() => {
    return todayQuests.filter(q => q.status === 'DONE');
  }, [todayQuests]);

  const todayProgressPercentage = useMemo(() => {
    if (todayQuests.length === 0) return 0;
    return Math.round((todayCompletedQuests.length / todayQuests.length) * 100);
  }, [todayQuests, todayCompletedQuests]);

  const todayEarnedXp = useMemo(() => {
    return todayCompletedQuests.reduce((sum, q) => sum + (q.xp || 10), 0);
  }, [todayCompletedQuests]);

  const isTodayPerfect = useMemo(() => {
    return todayQuests.length > 0 && todayCompletedQuests.length === todayQuests.length;
  }, [todayQuests, todayCompletedQuests]);

  // Check recurring quests generation
  useEffect(() => {
    const today = new Date();
    const todayYmd = today.toISOString().split('T')[0];
    const currentDayOfWeek = today.getDay(); // 0: Sun, 1: Mon, ...
    const currentDayOfMonth = today.getDate();

    const newQuestsToCreate: Quest[] = [];
    let recurringUpdated = false;

    const updatedRecurring = recurringQuests.map(req => {
      if (req.lastGeneratedDate === todayYmd) {
        return req;
      }

      let shouldGenerate = false;
      if (req.frequency === 'DAILY') {
        shouldGenerate = true;
      } else if (req.frequency === 'WEEKDAYS') {
        if (currentDayOfWeek >= 1 && currentDayOfWeek <= 5) shouldGenerate = true;
      } else if (req.frequency === 'WEEKLY') {
        if (req.dayOfWeek === currentDayOfWeek) shouldGenerate = true;
      } else if (req.frequency === 'MONTHLY') {
        if (req.dayOfMonth === currentDayOfMonth) shouldGenerate = true;
      }

      if (shouldGenerate) {
        recurringUpdated = true;
        newQuestsToCreate.push({
          id: `rec-${req.id}-${todayYmd}`,
          title: req.title,
          category: req.category,
          difficulty: req.difficulty,
          xp: req.xp,
          estimatedMinutes: req.estimatedMinutes,
          importance: req.importance,
          status: 'TODO',
          dueDate: todayYmd,
          createdAt: new Date().toISOString(),
          recurringId: req.id,
          notes: req.notes,
        });
        return { ...req, lastGeneratedDate: todayYmd };
      }
      return req;
    });

    if (recurringUpdated && newQuestsToCreate.length > 0) {
      setQuests(prev => [...prev, ...newQuestsToCreate]);
      setRecurringQuests(updatedRecurring);
    }
  }, []);

  // Level Up & XP Award Logic
  const awardXp = (amount: number, questName?: string) => {
    setProfile(prev => {
      let curXp = prev.currentXp + amount;
      let totalXp = prev.totalXp + amount;
      let curLevel = prev.level;
      let levelIncreased = false;
      const newlyUnlocked: string[] = [];

      let neededXp = getXpForNextLevel(curLevel);
      while (curXp >= neededXp) {
        curXp -= neededXp;
        curLevel += 1;
        levelIncreased = true;
        neededXp = getXpForNextLevel(curLevel);

        // Check if any items are unlocked at this level
        CHARACTER_ITEMS.forEach(item => {
          if (item.unlockLevel === curLevel && !prev.unlockedItems.includes(item.id)) {
            newlyUnlocked.push(item.id);
          }
        });
      }

      const newTitle = getLevelTitle(curLevel);

      if (levelIncreased) {
        soundManager.playLevelUp();
        if (settings.animationsEnabled) {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#F472B6', '#C084FC', '#FBBF24', '#38BDF8', '#34D399'],
          });
        }
        setLevelUpData({
          oldLevel: prev.level,
          newLevel: curLevel,
          newTitle,
          unlockedItems: newlyUnlocked,
        });
        setIsLevelUpOpen(true);
      }

      // Check streak
      const today = new Date().toISOString().split('T')[0];
      let newStreak = prev.streak;
      if (prev.lastActiveDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (prev.lastActiveDate === yesterdayStr) {
          newStreak += 1;
        } else if (!settings.weekendStreakIncluded && (yesterday.getDay() === 0 || yesterday.getDay() === 6)) {
          // If yesterday was weekend and weekendStreakIncluded is false, keep streak
          newStreak += 1;
        } else {
          newStreak = 1;
        }
      }

      return {
        ...prev,
        level: curLevel,
        title: newTitle,
        currentXp: curXp,
        totalXp,
        streak: newStreak,
        maxStreak: Math.max(prev.maxStreak, newStreak),
        lastActiveDate: today,
        unlockedItems: [...prev.unlockedItems, ...newlyUnlocked],
      };
    });
  };

  // Check achievements after any state changes
  const checkAchievements = (completedCount: number, currentStreak: number) => {
    setAchievements(prev =>
      prev.map(ach => {
        if (ach.isUnlocked) return ach;

        let currentCount = ach.currentCount;
        let unlocked = false;

        if (ach.id === 'ach-first-quest' && completedCount >= 1) {
          currentCount = completedCount;
          unlocked = true;
        } else if (ach.id === 'ach-quest-10' && completedCount >= 10) {
          currentCount = completedCount;
          unlocked = true;
        } else if (ach.id === 'ach-quest-50' && completedCount >= 50) {
          currentCount = completedCount;
          unlocked = true;
        } else if (ach.id === 'ach-streak-3' && currentStreak >= 3) {
          currentCount = currentStreak;
          unlocked = true;
        } else if (ach.id === 'ach-streak-7' && currentStreak >= 7) {
          currentCount = currentStreak;
          unlocked = true;
        } else if (ach.id === 'ach-streak-30' && currentStreak >= 30) {
          currentCount = currentStreak;
          unlocked = true;
        }

        if (unlocked) {
          soundManager.playAchievement();
          if (settings.animationsEnabled) {
            confetti({
              particleCount: 80,
              spread: 60,
              origin: { y: 0.7 },
              colors: ['#FBBF24', '#F472B6', '#A78BFA'],
            });
          }
          if (ach.rewardItem) {
            setProfile(p => ({
              ...p,
              unlockedItems: p.unlockedItems.includes(ach.rewardItem!.id)
                ? p.unlockedItems
                : [...p.unlockedItems, ach.rewardItem!.id],
            }));
          }
          return {
            ...ach,
            currentCount,
            isUnlocked: true,
            unlockedAt: new Date().toISOString(),
          };
        }

        return { ...ach, currentCount };
      })
    );
  };

  // Quest Actions
  const addQuest = (data: Omit<Quest, 'id' | 'createdAt' | 'status'> & { status?: QuestStatus }) => {
    const newQuest: Quest = {
      id: `quest-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: data.title,
      category: data.category,
      difficulty: data.difficulty,
      xp: data.xp || DIFFICULTY_INFO[data.difficulty]?.xp || 20,
      estimatedMinutes: data.estimatedMinutes || 15,
      importance: data.importance || 'NORMAL',
      status: data.status || 'TODO',
      dueDate: data.dueDate || todayStr,
      notes: data.notes || '',
      createdAt: new Date().toISOString(),
      chainId: data.chainId,
      chainStep: data.chainStep,
      chainTotalSteps: data.chainTotalSteps,
      isBonusQuest: data.isBonusQuest || false,
    };

    setQuests(prev => [newQuest, ...prev]);
    soundManager.playClick();
    return newQuest;
  };

  const addMultipleQuests = (tasks: Array<Omit<Quest, 'id' | 'createdAt' | 'status'>>) => {
    const newQuests: Quest[] = tasks.map(t => ({
      id: `quest-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: t.title,
      category: t.category,
      difficulty: t.difficulty,
      xp: t.xp || DIFFICULTY_INFO[t.difficulty]?.xp || 20,
      estimatedMinutes: t.estimatedMinutes || 15,
      importance: t.importance || 'NORMAL',
      status: 'TODO',
      dueDate: t.dueDate || todayStr,
      notes: t.notes || '',
      createdAt: new Date().toISOString(),
      chainId: t.chainId,
      chainStep: t.chainStep,
      chainTotalSteps: t.chainTotalSteps,
    }));

    setQuests(prev => [...newQuests, ...prev]);
    soundManager.playClick();
  };

  const updateQuest = (id: string, updates: Partial<Quest>) => {
    setQuests(prev => prev.map(q => (q.id === id ? { ...q, ...updates } : q)));
  };

  const deleteQuest = (id: string) => {
    setQuests(prev => prev.filter(q => q.id !== id));
  };

  const completeQuest = (id: string, clickPos?: { x: number; y: number }) => {
    const target = quests.find(q => q.id === id);
    if (!target || target.status === 'DONE') return;

    const completedAt = new Date().toISOString();
    const finalXp = target.isBonusQuest ? (target.xp || 20) * 2 : (target.xp || 20);

    // Audio & Particle effect
    soundManager.playQuestComplete();

    if (clickPos) {
      const floatId = `float-${Date.now()}`;
      setFloatingXpList(prev => [...prev, { id: floatId, xp: finalXp, x: clickPos.x, y: clickPos.y }]);
      setTimeout(() => {
        setFloatingXpList(prev => prev.filter(f => f.id !== floatId));
      }, 1200);
    }

    setQuests(prev =>
      prev.map(q => (q.id === id ? { ...q, status: 'DONE', completedAt } : q))
    );

    // Award XP
    awardXp(finalXp, target.title);

    // Total completed tally for achievements
    const completedCount = quests.filter(q => q.status === 'DONE').length + 1;
    checkAchievements(completedCount, profile.streak);

    // Check if this completes all today's quests
    const remainingToday = todayQuests.filter(q => q.id !== id && q.status !== 'DONE');
    if (remainingToday.length === 0 && todayQuests.length > 0) {
      // All done! Perfect Day!
      setTimeout(() => {
        setIsPerfectDayOpen(true);
        soundManager.playChainComplete();
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#F472B6', '#FEF08A', '#38BDF8', '#C084FC', '#34D399'],
        });
      }, 600);
    }
  };

  const reopenQuest = (id: string) => {
    setQuests(prev =>
      prev.map(q => (q.id === id ? { ...q, status: 'TODO', completedAt: undefined } : q))
    );
  };

  const startQuest = (id: string) => {
    setQuests(prev =>
      prev.map(q => (q.id === id ? { ...q, status: 'IN_PROGRESS' } : q))
    );
    soundManager.playClick();
  };

  // Categories
  const addCategory = (cat: Omit<Category, 'id'>) => {
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      ...cat,
    };
    setCategories(prev => [...prev, newCat]);
  };

  // Quest Chains
  const addQuestChain = (chain: Omit<QuestChain, 'id' | 'createdAt' | 'isCompleted'>) => {
    const newChain: QuestChain = {
      id: `chain-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isCompleted: false,
      ...chain,
    };
    setQuestChains(prev => [newChain, ...prev]);
    soundManager.playClick();
  };

  const toggleChainStep = (chainId: string, stepId: string) => {
    setQuestChains(prev =>
      prev.map(chain => {
        if (chain.id !== chainId) return chain;

        let stepXpAward = 0;
        const updatedSteps = chain.steps.map(step => {
          if (step.id !== stepId) return step;
          const nextCompleted = !step.completed;
          if (nextCompleted) {
            stepXpAward = step.xp;
          }
          return {
            ...step,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : undefined,
          };
        });

        const allDone = updatedSteps.every(s => s.completed);
        if (stepXpAward > 0) {
          awardXp(stepXpAward);
          soundManager.playQuestComplete();
        }

        if (allDone && !chain.isCompleted) {
          // Chain fully cleared! Bonus XP!
          awardXp(chain.bonusXp);
          soundManager.playChainComplete();
          if (settings.animationsEnabled) {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#F472B6', '#C084FC', '#FBBF24'],
            });
          }
        }

        return {
          ...chain,
          steps: updatedSteps,
          isCompleted: allDone,
        };
      })
    );
  };

  const deleteQuestChain = (id: string) => {
    setQuestChains(prev => prev.filter(c => c.id !== id));
  };

  // Templates
  const applyTemplate = (templateId: string) => {
    const tpl = templates.find(t => t.id === templateId);
    if (!tpl) return;

    const newQuests: Quest[] = tpl.tasks.map(task => ({
      id: `quest-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: task.title,
      category: task.category,
      difficulty: task.difficulty,
      xp: task.xp || DIFFICULTY_INFO[task.difficulty]?.xp || 20,
      estimatedMinutes: task.estimatedMinutes,
      importance: task.importance,
      status: 'TODO',
      dueDate: todayStr,
      notes: task.notes || `[템플릿: ${tpl.name}]`,
      createdAt: new Date().toISOString(),
    }));

    setQuests(prev => [...newQuests, ...prev]);
    soundManager.playClick();
  };

  const addTemplate = (tpl: Omit<QuestTemplate, 'id'>) => {
    const newTpl: QuestTemplate = {
      id: `tpl-${Date.now()}`,
      ...tpl,
    };
    setTemplates(prev => [...prev, newTpl]);
  };

  const deleteTemplate = (templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
  };

  // Recurring Quests
  const addRecurringQuest = (req: Omit<RecurringQuest, 'id'>) => {
    const newRec: RecurringQuest = {
      id: `rec-${Date.now()}`,
      ...req,
    };
    setRecurringQuests(prev => [...prev, newRec]);
    soundManager.playClick();
  };

  const deleteRecurringQuest = (id: string) => {
    setRecurringQuests(prev => prev.filter(r => r.id !== id));
  };

  // Profile & Customization
  const updateNickname = (nickname: string) => {
    setProfile(prev => ({ ...prev, nickname }));
  };

  const equipItem = (type: 'head' | 'face' | 'prop' | 'room', itemId: string) => {
    setProfile(prev => ({
      ...prev,
      character: {
        ...prev.character,
        [type]: itemId,
      },
    }));
    soundManager.playClick();
  };

  // Settings
  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Export / Import
  const exportDataJson = () => {
    const fullBackup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      quests,
      categories,
      questChains,
      templates,
      recurringQuests,
      profile,
      achievements,
      settings,
    };
    return JSON.stringify(fullBackup, null, 2);
  };

  const importDataJson = (json: string): boolean => {
    try {
      const data = JSON.parse(json);
      if (data.quests) setQuests(data.quests);
      if (data.categories) setCategories(data.categories);
      if (data.questChains) setQuestChains(data.questChains);
      if (data.templates) setTemplates(data.templates);
      if (data.recurringQuests) setRecurringQuests(data.recurringQuests);
      if (data.profile) setProfile(data.profile);
      if (data.achievements) setAchievements(data.achievements);
      if (data.settings) setSettings(data.settings);
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  };

  const resetAllData = () => {
    localStorage.clear();
    setQuests(getInitialQuests());
    setCategories(DEFAULT_CATEGORIES);
    setQuestChains(INITIAL_CHAINS);
    setTemplates(DEFAULT_TEMPLATES);
    setRecurringQuests(DEFAULT_RECURRING);
    setAchievements(DEFAULT_ACHIEVEMENTS);
    setProfile({
      nickname: '일잘러 토끼',
      title: '업무 새싹 🐰',
      level: 1,
      currentXp: 0,
      totalXp: 0,
      streak: 1,
      maxStreak: 1,
      lastActiveDate: todayStr,
      character: {
        head: 'head_none',
        face: 'face_none',
        prop: 'prop_none',
        room: 'room_cozy',
      },
      unlockedItems: ['head_none', 'face_none', 'prop_none', 'room_cozy'],
    });
  };

  return (
    <AppContext.Provider
      value={{
        quests,
        categories,
        questChains,
        templates,
        recurringQuests,
        profile,
        achievements,
        settings,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedStatus,
        setSelectedStatus,
        sortBy,
        setSortBy,
        isAddModalOpen,
        setIsAddModalOpen,
        editingQuest,
        setEditingQuest,
        isAiDecomposeOpen,
        setIsAiDecomposeOpen,
        isWhatShouldIDoOpen,
        setIsWhatShouldIDoOpen,
        isWeeklyReportOpen,
        setIsWeeklyReportOpen,
        isTemplateModalOpen,
        setIsTemplateModalOpen,
        isLevelUpOpen,
        setIsLevelUpOpen,
        levelUpData,
        isPerfectDayOpen,
        setIsPerfectDayOpen,
        floatingXpList,
        addQuest,
        addMultipleQuests,
        updateQuest,
        deleteQuest,
        completeQuest,
        reopenQuest,
        startQuest,
        addCategory,
        addQuestChain,
        toggleChainStep,
        deleteQuestChain,
        applyTemplate,
        addTemplate,
        deleteTemplate,
        addRecurringQuest,
        deleteRecurringQuest,
        updateNickname,
        equipItem,
        updateSettings,
        exportDataJson,
        importDataJson,
        resetAllData,
        todayQuests,
        todayCompletedQuests,
        todayProgressPercentage,
        todayEarnedXp,
        isTodayPerfect,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
