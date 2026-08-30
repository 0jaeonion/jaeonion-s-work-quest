export type Difficulty = 'EASY' | 'NORMAL' | 'HARD' | 'VERY_HARD';
export type Importance = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
export type QuestStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';
export type SortOption = 'SMART' | 'DUE_DATE' | 'XP' | 'DIFFICULTY' | 'TIME' | 'IMPORTANCE';
export type RecurringFrequency = 'DAILY' | 'WEEKDAYS' | 'WEEKLY' | 'MONTHLY';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  badgeBg: string;
  badgeText: string;
}

export interface Quest {
  id: string;
  title: string;
  category: string;
  difficulty: Difficulty;
  xp: number;
  estimatedMinutes: number;
  importance: Importance;
  status: QuestStatus;
  dueDate: string; // YYYY-MM-DD
  notes?: string;
  completedAt?: string; // ISO string
  createdAt: string; // ISO string
  chainId?: string;
  chainStep?: number;
  chainTotalSteps?: number;
  isBonusQuest?: boolean; // 2x XP
  recurringId?: string;
}

export interface ChainStep {
  id: string;
  title: string;
  xp: number;
  difficulty: Difficulty;
  completed: boolean;
  completedAt?: string;
}

export interface QuestChain {
  id: string;
  title: string;
  description?: string;
  bonusXp: number;
  category: string;
  steps: ChainStep[];
  isCompleted: boolean;
  createdAt: string;
}

export interface TemplateTask {
  title: string;
  category: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  importance: Importance;
  xp: number;
  notes?: string;
}

export interface QuestTemplate {
  id: string;
  name: string;
  icon: string;
  description: string;
  tasks: TemplateTask[];
}

export interface RecurringQuest {
  id: string;
  title: string;
  category: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  importance: Importance;
  xp: number;
  frequency: RecurringFrequency;
  dayOfWeek?: number; // 0: Sun, 1: Mon, ..., 6: Sat
  dayOfMonth?: number; // 1 ~ 31
  lastGeneratedDate?: string;
  notes?: string;
}

export interface CharacterEquip {
  head: string;
  face: string;
  prop: string;
  room: string;
}

export interface UserProfile {
  nickname: string;
  title: string;
  level: number;
  currentXp: number;
  totalXp: number;
  streak: number;
  maxStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  character: CharacterEquip;
  unlockedItems: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'STREAK' | 'LEVEL' | 'QUEST' | 'CATEGORY' | 'SPECIAL';
  targetCount: number;
  currentCount: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  rewardXp: number;
  rewardItem?: {
    id: string;
    name: string;
    type: 'head' | 'face' | 'prop' | 'room';
    icon: string;
  };
}

export interface AppSettings {
  soundEnabled: boolean;
  soundVolume: number;
  animationsEnabled: boolean;
  weekendStreakIncluded: boolean;
  defaultSort: SortOption;
  theme: 'pastel-pink' | 'cozy-cream' | 'lavender' | 'mint';
}

export interface CharacterItem {
  id: string;
  name: string;
  type: 'head' | 'face' | 'prop' | 'room';
  icon: string;
  description: string;
  unlockLevel?: number;
  requiredAchievementId?: string;
  previewColor?: string;
}
