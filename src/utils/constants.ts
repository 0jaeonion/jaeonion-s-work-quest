import { Achievement, Category, CharacterItem, Quest, QuestChain, QuestTemplate, RecurringQuest } from '../types';

export const LEVEL_TITLES: { minLevel: number; title: string }[] = [
  { minLevel: 1, title: '업무 새싹 🐰' },
  { minLevel: 2, title: '업무 초보 🐣' },
  { minLevel: 3, title: '업무 적응자 📋' },
  { minLevel: 5, title: '업무 숙련자 ☕' },
  { minLevel: 7, title: '일잘러 도전자 🚀' },
  { minLevel: 10, title: '업무 마스터 ⭐' },
  { minLevel: 12, title: '업무자동화 마스터 ⚡' },
  { minLevel: 15, title: '행정 고수 👑' },
  { minLevel: 20, title: '프로덕티비티 챔피언 🏆' },
  { minLevel: 25, title: '자동화 전문가 🤖' },
  { minLevel: 30, title: '신속정확의 지배자 🎯' },
  { minLevel: 40, title: '전설의 칼퇴 장인 🌙' },
  { minLevel: 50, title: '전설의 행정인 🌟' },
];

export const getLevelTitle = (level: number): string => {
  for (let i = LEVEL_TITLES.length - 1; i >= 0; i--) {
    if (level >= LEVEL_TITLES[i].minLevel) {
      return LEVEL_TITLES[i].title;
    }
  }
  return '업무 새싹 🐰';
};

// Experience needed for level N:
// Level 1: 100 XP, Level 2: 150 XP, Level 3: 220 XP, etc.
export const getXpForNextLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(1.18, level - 1));
};

export const DIFFICULTY_INFO = {
  EASY: { label: '쉬움', xp: 10, color: 'text-emerald-600 bg-emerald-50 border-emerald-300', dot: '🟢', star: '⭐' },
  NORMAL: { label: '보통', xp: 20, color: 'text-blue-600 bg-blue-50 border-blue-300', dot: '🔵', star: '⭐⭐' },
  HARD: { label: '어려움', xp: 40, color: 'text-purple-600 bg-purple-50 border-purple-300', dot: '🟣', star: '⭐⭐⭐' },
  VERY_HARD: { label: '매우 어려움', xp: 70, color: 'text-rose-600 bg-rose-50 border-rose-300', dot: '🔴', star: '⭐⭐⭐⭐' },
};

export const IMPORTANCE_INFO = {
  LOW: { label: '낮음', color: 'text-slate-500 bg-slate-100 border-slate-200' },
  NORMAL: { label: '보통', color: 'text-sky-600 bg-sky-50 border-sky-200' },
  HIGH: { label: '높음', color: 'text-amber-600 bg-amber-50 border-amber-200' },
  URGENT: { label: '긴급 🚨', color: 'text-red-600 bg-red-50 border-red-300 animate-pulse' },
};

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-settlement', name: '정산', icon: '📊', color: '#F472B6', badgeBg: 'bg-pink-100', badgeText: 'text-pink-700' },
  { id: 'cat-doc', name: '문서', icon: '📄', color: '#60A5FA', badgeBg: 'bg-blue-100', badgeText: 'text-blue-700' },
  { id: 'cat-inquiry', name: '문의/전화', icon: '📞', color: '#34D399', badgeBg: 'bg-emerald-100', badgeText: 'text-emerald-700' },
  { id: 'cat-file', name: '파일관리', icon: '📁', color: '#FBBF24', badgeBg: 'bg-amber-100', badgeText: 'text-amber-800' },
  { id: 'cat-auto', name: '자동화', icon: '🤖', color: '#A78BFA', badgeBg: 'bg-purple-100', badgeText: 'text-purple-700' },
  { id: 'cat-meeting', name: '회의/협의', icon: '☕', color: '#FB923C', badgeBg: 'bg-orange-100', badgeText: 'text-orange-700' },
  { id: 'cat-dev', name: '개발/코딩', icon: '💻', color: '#38BDF8', badgeBg: 'bg-sky-100', badgeText: 'text-sky-700' },
  { id: 'cat-etc', name: '기타', icon: '✨', color: '#94A3B8', badgeBg: 'bg-slate-100', badgeText: 'text-slate-700' },
];

export const ENCOURAGING_QUOTES = [
  "조금만 더 하면 오늘 퀘스트 올클리어! ✨",
  "오늘도 꽤 많이 해냈어요! 대단해요 🐰",
  "절반 넘었어요! 끝까지 파이팅 💪",
  "마지막 퀘스트까지 가볼까요? 🚀",
  "오늘의 업무 마스터에 가까워지고 있어요! 👑",
  "한 걸음씩 성장하는 멋진 토끼 모험가! 🌱",
  "차근차근 해내면 어느새 칼퇴 완료! 🌙",
  "경험치가 쑥쑥 오르고 있어요! ⭐",
];

export const CHARACTER_ITEMS: CharacterItem[] = [
  // HEAD
  { id: 'head_none', name: '기본 귀', type: 'head', icon: '🐰', description: '순수한 기본 토끼 귀입니다.' },
  { id: 'head_ribbon', name: '핑크 리본', type: 'head', icon: '🎀', description: '사랑스러운 분홍색 리본' },
  { id: 'head_cap', name: '모험가 모자', type: 'head', icon: '👒', description: '햇볕을 막아주는 여름 모자', unlockLevel: 2 },
  { id: 'head_bear', name: '아기곰 모자', type: 'head', icon: '🐻', description: '포근하고 따뜻한 곰돌이 탈', unlockLevel: 5 },
  { id: 'head_crown', name: '황금 왕관', type: 'head', icon: '👑', description: '업무 마스터에게 주어지는 영예의 관', unlockLevel: 10 },
  { id: 'head_party', name: '파티 꼬깔모자', type: 'head', icon: '🎉', description: '축제 분위기 가득한 꼬깔모자', unlockLevel: 15 },
  
  // FACE
  { id: 'face_none', name: '기본 표정', type: 'face', icon: '😊', description: '맑고 초롱초롱한 눈망울' },
  { id: 'face_blush', name: '발그레 볼터치', type: 'face', icon: '🌸', description: '수줍고 귀여운 핑크빛 볼' },
  { id: 'face_glasses', name: '지적인 뿔테안경', type: 'face', icon: '👓', description: '꼼꼼한 검토력을 200% 올려주는 안경', unlockLevel: 3 },
  { id: 'face_sunglasses', name: '칼퇴 선글라스', type: 'face', icon: '😎', description: '당당하게 칼퇴할 때 쓰는 힙한 선글라스', unlockLevel: 8 },
  { id: 'face_sparkle', name: '반짝반짝 눈빛', type: 'face', icon: '✨', description: '의욕이 불타오르는 반짝이는 표정', unlockLevel: 12 },

  // PROP
  { id: 'prop_none', name: '맨손', type: 'prop', icon: '🐾', description: '가벼운 빈손입니다.' },
  { id: 'prop_laptop', name: '최신형 노트북', type: 'prop', icon: '💻', description: '업무 효율을 극대화하는 컴팩트 랩탑' },
  { id: 'prop_coffee', name: '아이스 아메리카노', type: 'prop', icon: '☕', description: '직장인의 생명수 포션' },
  { id: 'prop_pencil', name: '행운의 노란 연필', type: 'prop', icon: '✏️', description: '아이디어가 솟아나는 필기구', unlockLevel: 4 },
  { id: 'prop_book', name: '업무 매뉴얼 비급서', type: 'prop', icon: '📚', description: '모든 행정 규칙이 적힌 책', unlockLevel: 6 },
  { id: 'prop_gameboy', name: '레트로 게임기', type: 'prop', icon: '🎮', description: '휴식 시간에 몰래 켜는 포켓 게임기', unlockLevel: 9 },
  { id: 'prop_smartphone', name: '스마트폰', type: 'prop', icon: '📱', description: '알림 확인용 최신 스마트폰', unlockLevel: 11 },

  // ROOM
  { id: 'room_cozy', name: '아늑한 내 방', type: 'room', icon: '🏠', description: '따뜻한 원목 가구와 화분이 있는 아지트' },
  { id: 'room_office', name: '현대적인 스마트 오피스', type: 'room', icon: '🏢', description: '넓은 듀얼 모니터가 있는 깔끔한 사무실', unlockLevel: 3 },
  { id: 'room_sakura', name: '벚꽃 피는 공원 테라스', type: 'room', icon: '🌸', description: '봄바람이 살랑이는 야외 테이블', unlockLevel: 7 },
  { id: 'room_night', name: '야경이 멋진 심야 오피스', type: 'room', icon: '🌙', description: '도시 불빛이 수놓인 창가 뷰', unlockLevel: 12 },
  { id: 'room_retro', name: '8비트 사이버 룸', type: 'room', icon: '🕹️', description: '네온사인이 반짝이는 픽셀 아케이드 룸', unlockLevel: 18 },
];

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-first-quest',
    title: '첫 번째 모험',
    description: '첫 번째 퀘스트를 성공적으로 완료했습니다.',
    icon: '🌱',
    category: 'QUEST',
    targetCount: 1,
    currentCount: 0,
    isUnlocked: false,
    rewardXp: 30,
    rewardItem: { id: 'head_ribbon', name: '핑크 리본', type: 'head', icon: '🎀' }
  },
  {
    id: 'ach-quest-10',
    title: '퀘스트 입문자',
    description: '누적 퀘스트 10개를 완료했습니다.',
    icon: '⭐',
    category: 'QUEST',
    targetCount: 10,
    currentCount: 0,
    isUnlocked: false,
    rewardXp: 50,
  },
  {
    id: 'ach-quest-50',
    title: '업무의 달인',
    description: '누적 퀘스트 50개를 완료했습니다.',
    icon: '⚡',
    category: 'QUEST',
    targetCount: 50,
    currentCount: 0,
    isUnlocked: false,
    rewardXp: 150,
    rewardItem: { id: 'head_crown', name: '황금 왕관', type: 'head', icon: '👑' }
  },
  {
    id: 'ach-quest-master-day',
    title: '하루 10 클리어',
    description: '하루에 퀘스트 10개 이상을 완료했습니다.',
    icon: '💥',
    category: 'SPECIAL',
    targetCount: 10,
    currentCount: 0,
    isUnlocked: false,
    rewardXp: 80,
  },
  {
    id: 'ach-streak-3',
    title: '3일 연속 모험가',
    description: '3일 연속으로 퀘스트를 완료했습니다.',
    icon: '🔥',
    category: 'STREAK',
    targetCount: 3,
    currentCount: 0,
    isUnlocked: false,
    rewardXp: 50,
  },
  {
    id: 'ach-streak-7',
    title: '작심삼일 탈출! 7 DAYS',
    description: '일주일 연속으로 퀘스트를 클리어했습니다.',
    icon: '🏆',
    category: 'STREAK',
    targetCount: 7,
    currentCount: 0,
    isUnlocked: false,
    rewardXp: 100,
    rewardItem: { id: 'face_sunglasses', name: '칼퇴 선글라스', type: 'face', icon: '😎' }
  },
  {
    id: 'ach-streak-30',
    title: '한 달의 기적',
    description: '30일 연속 달성 기록을 세웠습니다.',
    icon: '💎',
    category: 'STREAK',
    targetCount: 30,
    currentCount: 0,
    isUnlocked: false,
    rewardXp: 300,
    rewardItem: { id: 'room_retro', name: '8비트 사이버 룸', type: 'room', icon: '🕹️' }
  },
  {
    id: 'ach-perfect-day',
    title: 'PERFECT DAY',
    description: '오늘 배정된 모든 퀘스트를 100% 올클리어했습니다.',
    icon: '💯',
    category: 'SPECIAL',
    targetCount: 1,
    currentCount: 0,
    isUnlocked: false,
    rewardXp: 50,
  },
  {
    id: 'ach-cat-auto-10',
    title: '자동화의 마법사',
    description: '자동화 카테고리 퀘스트 10개를 완료했습니다.',
    icon: '🤖',
    category: 'CATEGORY',
    targetCount: 10,
    currentCount: 0,
    isUnlocked: false,
    rewardXp: 70,
  },
  {
    id: 'ach-cat-settle-20',
    title: '정산의 신',
    description: '정산 관련 퀘스트 20개를 완료했습니다.',
    icon: '📊',
    category: 'CATEGORY',
    targetCount: 20,
    currentCount: 0,
    isUnlocked: false,
    rewardXp: 80,
  },
  {
    id: 'ach-early-bird',
    title: '부지런한 얼리버드',
    description: '오전 8시 이전에 퀘스트를 완료했습니다.',
    icon: '🌅',
    category: 'SPECIAL',
    targetCount: 1,
    currentCount: 0,
    isUnlocked: false,
    rewardXp: 40,
  },
  {
    id: 'ach-night-worker',
    title: '심야의 수호자',
    description: '밤 10시(22시) 이후에 퀘스트를 완료했습니다.',
    icon: '🌙',
    category: 'SPECIAL',
    targetCount: 1,
    currentCount: 0,
    isUnlocked: false,
    rewardXp: 40,
  },
  {
    id: 'ach-chain-master',
    title: '퀘스트 체인 마스터',
    description: '대형 퀘스트 체인을 1개 이상 끝까지 완수했습니다.',
    icon: '⛓️',
    category: 'SPECIAL',
    targetCount: 1,
    currentCount: 0,
    isUnlocked: false,
    rewardXp: 60,
  },
];

export const DEFAULT_TEMPLATES: QuestTemplate[] = [
  {
    id: 'tpl-settlement',
    name: '📦 월말 정산 패키지',
    icon: '📊',
    description: '월말 정산 시 필수적인 6단계 통합 퀘스트 세트',
    tasks: [
      { title: '각 부서 원본 엑셀/데이터 파일 수합 확인', category: '정산', difficulty: 'EASY', estimatedMinutes: 10, importance: 'NORMAL', xp: 10 },
      { title: '데이터 통합 및 공통 서식 병합', category: '정산', difficulty: 'NORMAL', estimatedMinutes: 20, importance: 'HIGH', xp: 20 },
      { title: '금액 검증 및 불일치 항목 전수 조사', category: '정산', difficulty: 'HARD', estimatedMinutes: 30, importance: 'URGENT', xp: 40 },
      { title: '변동 명단 및 예외 사항 확인', category: '정산', difficulty: 'NORMAL', estimatedMinutes: 15, importance: 'HIGH', xp: 20 },
      { title: '최종 정산 결과 파일 생성 및 백업', category: '정산', difficulty: 'NORMAL', estimatedMinutes: 10, importance: 'NORMAL', xp: 20 },
      { title: '부서별/기관별 최종 정산서 발송', category: '문서', difficulty: 'EASY', estimatedMinutes: 5, importance: 'NORMAL', xp: 10 },
    ]
  },
  {
    id: 'tpl-weekly-report',
    name: '📝 주간 업무 보고',
    icon: '📋',
    description: '금요일 주간 업무 요약 및 차주 계획 수립',
    tasks: [
      { title: '금주 완료 퀘스트 및 실적 정리', category: '문서', difficulty: 'EASY', estimatedMinutes: 15, importance: 'NORMAL', xp: 10 },
      { title: '부서 공유용 주간 보고서 슬라이드 작성', category: '문서', difficulty: 'NORMAL', estimatedMinutes: 25, importance: 'HIGH', xp: 20 },
      { title: '차주 핵심 마일스톤 및 퀘스트 등록', category: '기타', difficulty: 'EASY', estimatedMinutes: 10, importance: 'NORMAL', xp: 10 },
    ]
  },
  {
    id: 'tpl-morning-routine',
    name: '☕ 활기찬 아침 루틴',
    icon: '☀️',
    description: '출근 후 30분 만에 끝내는 아침 점검 세트',
    tasks: [
      { title: '긴급 수신 메일 및 메신저 확인', category: '문의/전화', difficulty: 'EASY', estimatedMinutes: 5, importance: 'URGENT', xp: 10 },
      { title: '오늘의 우선순위 TOP 3 퀘스트 지정', category: '기타', difficulty: 'EASY', estimatedMinutes: 5, importance: 'NORMAL', xp: 10 },
      { title: '캘린더 회의 일정 및 자료 사전 검토', category: '문서', difficulty: 'EASY', estimatedMinutes: 10, importance: 'NORMAL', xp: 10 },
    ]
  },
  {
    id: 'tpl-drive-cleanup',
    name: '📁 공유 드라이브 정리',
    icon: '🗄️',
    description: '어질러진 폴더와 임시 파일들을 깔끔하게 정리',
    tasks: [
      { title: '바탕화면 다운로드 폴더 임시파일 삭제', category: '파일관리', difficulty: 'EASY', estimatedMinutes: 5, importance: 'LOW', xp: 10 },
      { title: '공유 드라이브 버전별 폴더 아카이빙', category: '파일관리', difficulty: 'NORMAL', estimatedMinutes: 20, importance: 'NORMAL', xp: 20 },
      { title: '팀 공용 템플릿 최신본 동기화', category: '파일관리', difficulty: 'EASY', estimatedMinutes: 10, importance: 'NORMAL', xp: 10 },
    ]
  }
];

export const DEFAULT_RECURRING: RecurringQuest[] = [
  {
    id: 'rec-daily-email',
    title: '매일 아침 이메일 및 긴급 문의 확인',
    category: '문의/전화',
    difficulty: 'EASY',
    estimatedMinutes: 10,
    importance: 'HIGH',
    xp: 10,
    frequency: 'WEEKDAYS',
  },
  {
    id: 'rec-weekly-plan',
    title: '월요일 주간 업무 계획 수립',
    category: '문서',
    difficulty: 'NORMAL',
    estimatedMinutes: 20,
    importance: 'NORMAL',
    xp: 20,
    frequency: 'WEEKLY',
    dayOfWeek: 1, // Monday
  },
  {
    id: 'rec-monthly-close',
    title: '매월 25일 정산 마감 파일 준비',
    category: '정산',
    difficulty: 'HARD',
    estimatedMinutes: 40,
    importance: 'URGENT',
    xp: 40,
    frequency: 'MONTHLY',
    dayOfMonth: 25,
  }
];

export const INITIAL_CHAINS: QuestChain[] = [
  {
    id: 'chain-august-settlement',
    title: '🎯 8월 정산파일 완성 대작전',
    description: '체인 전체 완료 시 +60 BONUS XP 지급!',
    category: '정산',
    bonusXp: 60,
    isCompleted: false,
    createdAt: new Date().toISOString(),
    steps: [
      { id: 'cs-1', title: '① 원본 파일 수합 및 무결성 확인', xp: 10, difficulty: 'EASY', completed: true, completedAt: new Date(Date.now() - 3600000).toISOString() },
      { id: 'cs-2', title: '② 데이터 통합 및 Power Query 처리', xp: 20, difficulty: 'NORMAL', completed: true, completedAt: new Date(Date.now() - 1800000).toISOString() },
      { id: 'cs-3', title: '③ 금액 검토 및 수식 오류 체크', xp: 20, difficulty: 'NORMAL', completed: false },
      { id: 'cs-4', title: '④ 변동 명단 예외 대조', xp: 20, difficulty: 'NORMAL', completed: false },
      { id: 'cs-5', title: '⑤ 최종 파일 생성 및 결재 상신', xp: 30, difficulty: 'HARD', completed: false },
      { id: 'cs-6', title: '⑥ 관련 기관 최종 발송', xp: 10, difficulty: 'EASY', completed: false },
    ]
  }
];

export const getInitialQuests = (): Quest[] => {
  const today = new Date().toISOString().split('T')[0];
  return [
    {
      id: 'quest-demo-1',
      title: '학교 문의사항 답변 및 회신 발송',
      category: '문의/전화',
      difficulty: 'EASY',
      xp: 10,
      estimatedMinutes: 10,
      importance: 'NORMAL',
      status: 'DONE',
      dueDate: today,
      completedAt: new Date(Date.now() - 7200000).toISOString(),
      createdAt: new Date(Date.now() - 14400000).toISOString(),
      notes: '학교 행정실 요청 서식 첨부 완료'
    },
    {
      id: 'quest-demo-2',
      title: '정산파일 3개 처리 및 검산',
      category: '정산',
      difficulty: 'HARD',
      xp: 40,
      estimatedMinutes: 30,
      importance: 'URGENT',
      status: 'DONE',
      dueDate: today,
      completedAt: new Date(Date.now() - 3600000).toISOString(),
      createdAt: new Date(Date.now() - 14400000).toISOString(),
      notes: '부서별 오차 0원 확인'
    },
    {
      id: 'quest-demo-3',
      title: '신규 프로젝트 기획안 초안 파일 검토',
      category: '문서',
      difficulty: 'NORMAL',
      xp: 20,
      estimatedMinutes: 20,
      importance: 'HIGH',
      status: 'IN_PROGRESS',
      dueDate: today,
      createdAt: new Date(Date.now() - 14400000).toISOString(),
      notes: '3페이지 일정표 위주로 피드백 작성'
    },
    {
      id: 'quest-demo-4',
      title: '행정 지원 안내 자료 일괄 발송',
      category: '문서',
      difficulty: 'EASY',
      xp: 10,
      estimatedMinutes: 5,
      importance: 'NORMAL',
      status: 'TODO',
      dueDate: today,
      createdAt: new Date(Date.now() - 14400000).toISOString(),
    },
    {
      id: 'quest-demo-5',
      title: 'Power Query 자동화 스크립트 오류 수정',
      category: '자동화',
      difficulty: 'VERY_HARD',
      xp: 70,
      estimatedMinutes: 45,
      importance: 'HIGH',
      status: 'TODO',
      dueDate: today,
      isBonusQuest: true,
      createdAt: new Date(Date.now() - 14400000).toISOString(),
      notes: '날짜 컬럼 형식 변환 오류 해결 필요'
    },
  ];
};
