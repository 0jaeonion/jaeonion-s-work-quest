import { Difficulty, Importance, Quest, QuestChain, UserProfile } from '../types';

export interface ParsedAiTask {
  title: string;
  category: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  importance: Importance;
  xp: number;
  notes?: string;
}

export interface RecommendedQuestResult {
  quest: Quest | null;
  headline: string;
  reason: string;
  tag: string;
}

export interface WeeklyReportData {
  totalTasksThisWeek: number;
  completedTasksThisWeek: number;
  completionRate: number;
  xpEarnedThisWeek: number;
  topCategory: string;
  busiestDay: string;
  streak: number;
  aiCommentary: string;
}

// 1. Natural Language Quest Parser
export const parseNaturalLanguageTask = (input: string): ParsedAiTask[] => {
  const trimmed = input.trim();
  if (!trimmed) return [];

  // Split by conjunctions, commas, linebreaks, numbers, or bullet points
  const segments = trimmed
    .split(/(?:\n|\r\n| 그리고 | 및 | 그 다음 | 다음에 |->|→|,|\/|\d+\.\s*)/g)
    .map(s => s.trim())
    .filter(s => s.length > 1);

  if (segments.length === 0) {
    segments.push(trimmed);
  }

  const today = new Date().toISOString().split('T')[0];

  return segments.map((seg) => {
    let category = '기타';
    let difficulty: Difficulty = 'NORMAL';
    let estimatedMinutes = 20;
    let importance: Importance = 'NORMAL';

    const lower = seg.toLowerCase();

    // Category detection
    if (lower.includes('정산') || lower.includes('금액') || lower.includes('회계') || lower.includes('영수증') || lower.includes('비용') || lower.includes('결산')) {
      category = '정산';
    } else if (lower.includes('문서') || lower.includes('보고서') || lower.includes('기획안') || lower.includes('작성') || lower.includes('서식') || lower.includes('슬라이드')) {
      category = '문서';
    } else if (lower.includes('전화') || lower.includes('문의') || lower.includes('회신') || lower.includes('메일') || lower.includes('이메일') || lower.includes('발송') || lower.includes('연락')) {
      category = '문의/전화';
    } else if (lower.includes('파일') || lower.includes('폴더') || lower.includes('다운로드') || lower.includes('백업') || lower.includes('드라이브') || lower.includes('정리')) {
      category = '파일관리';
    } else if (lower.includes('자동화') || lower.includes('쿼리') || lower.includes('매크로') || lower.includes('스크립트') || lower.includes('파이썬') || lower.includes('엑셀수식')) {
      category = '자동화';
    } else if (lower.includes('회의') || lower.includes('미팅') || lower.includes('협의') || lower.includes('논의')) {
      category = '회의/협의';
    } else if (lower.includes('개발') || lower.includes('코딩') || lower.includes('버그') || lower.includes('오류') || lower.includes('배포')) {
      category = '개발/코딩';
    }

    // Importance detection
    if (lower.includes('긴급') || lower.includes('당장') || lower.includes('오늘까지') || lower.includes('빨리') || lower.includes('오류')) {
      importance = 'URGENT';
    } else if (lower.includes('중요') || lower.includes('핵심') || lower.includes('반드시')) {
      importance = 'HIGH';
    }

    // Time estimate & Difficulty detection
    if (lower.includes('간단') || lower.includes('5분') || lower.includes('확인') || lower.includes('체크') || lower.includes('발송')) {
      estimatedMinutes = 5;
      difficulty = 'EASY';
    } else if (lower.includes('10분') || lower.includes('검토') || lower.includes('답변')) {
      estimatedMinutes = 10;
      difficulty = 'EASY';
    } else if (lower.includes('30분') || lower.includes('분석') || lower.includes('정리') || lower.includes('통합')) {
      estimatedMinutes = 30;
      difficulty = 'HARD';
    } else if (lower.includes('1시간') || lower.includes('대작전') || lower.includes('전수') || lower.includes('재작성')) {
      estimatedMinutes = 60;
      difficulty = 'VERY_HARD';
    }

    const xpMap: Record<Difficulty, number> = {
      EASY: 10,
      NORMAL: 20,
      HARD: 40,
      VERY_HARD: 70,
    };

    return {
      title: seg,
      category,
      difficulty,
      estimatedMinutes,
      importance,
      xp: xpMap[difficulty],
    };
  });
};

// 2. AI Quest Decomposer (Breaking large complex project into Quest Chain steps)
export const decomposeBigTask = (goal: string): { title: string; bonusXp: number; steps: { title: string; xp: number; difficulty: Difficulty }[] } => {
  const trimmed = goal.trim();
  const lower = trimmed.toLowerCase();

  let steps: { title: string; xp: number; difficulty: Difficulty }[] = [];
  let bonusXp = 50;

  if (lower.includes('정산') || lower.includes('결산') || lower.includes('회계')) {
    steps = [
      { title: '① 부서별 원본 데이터 및 영수증 증빙 취합', xp: 10, difficulty: 'EASY' },
      { title: '② 전표 데이터 통합 및 서식 정규화', xp: 20, difficulty: 'NORMAL' },
      { title: '③ 차액 불일치 및 예외 항목 검증 대조', xp: 40, difficulty: 'HARD' },
      { title: '④ 수정 사항 반영 및 최종 결산 시트 생성', xp: 30, difficulty: 'NORMAL' },
      { title: '⑤ 관리자 결재 상신 및 담당부서 승인 요청', xp: 10, difficulty: 'EASY' },
    ];
    bonusXp = 60;
  } else if (lower.includes('보고서') || lower.includes('기획안') || lower.includes('제안서')) {
    steps = [
      { title: '① 요구사항 분석 및 핵심 목차/개요 구조화', xp: 10, difficulty: 'EASY' },
      { title: '② 레퍼런스 자료 및 시장 데이터 수집', xp: 20, difficulty: 'NORMAL' },
      { title: '③ 본문 슬라이드/문서 초안 작성', xp: 40, difficulty: 'HARD' },
      { title: '④ 수치 및 오탈자 피드백 반영 2차 검토', xp: 20, difficulty: 'NORMAL' },
      { title: '⑤ 최종 PDF 파일 추출 및 팀원 공유', xp: 10, difficulty: 'EASY' },
    ];
    bonusXp = 50;
  } else if (lower.includes('자동화') || lower.includes('프로그램') || lower.includes('개발')) {
    steps = [
      { title: '① 반복 수작업 프로세스 흐름도 작성', xp: 10, difficulty: 'EASY' },
      { title: '② 입출력 데이터 표준 규격 정의', xp: 20, difficulty: 'NORMAL' },
      { title: '③ 핵심 자동화 로직 스크립트 작성', xp: 40, difficulty: 'HARD' },
      { title: '④ 예외 케이스 및 오류 디버깅 테스트', xp: 30, difficulty: 'NORMAL' },
      { title: '⑤ 실행 매뉴얼 작성 및 실무 적용', xp: 10, difficulty: 'EASY' },
    ];
    bonusXp = 70;
  } else {
    // General 4-step smart decomposition
    steps = [
      { title: `① ${trimmed} 사전 준비 및 자료 확인`, xp: 10, difficulty: 'EASY' },
      { title: `② ${trimmed} 핵심 작업 수행 및 1차 완료`, xp: 40, difficulty: 'HARD' },
      { title: `③ 세부 사항 검토 및 누락 보완`, xp: 20, difficulty: 'NORMAL' },
      { title: `④ 결과 정리 및 최종 마무리/공유`, xp: 10, difficulty: 'EASY' },
    ];
  }

  return {
    title: `📦 ${trimmed} 단계별 정복 퀘스트`,
    bonusXp,
    steps,
  };
};

// 3. "🎲 오늘 뭐 하지?" (What Should I Do?) Intelligent Next-Quest Recommender
export const recommendNextQuest = (quests: Quest[]): RecommendedQuestResult => {
  const pending = quests.filter(q => q.status === 'TODO' || q.status === 'IN_PROGRESS');

  if (pending.length === 0) {
    return {
      quest: null,
      headline: '모든 퀘스트를 클리어했어요! 🎉',
      reason: '오늘 예정된 모든 업무를 완료했습니다. 푹 쉬거나 새로운 보너스 퀘스트를 추가해볼까요?',
      tag: 'ALL_CLEAR',
    };
  }

  // Priority algorithm score
  // IN_PROGRESS gets immediate priority
  // Importance: URGENT (+100), HIGH (+50), NORMAL (+20), LOW (+0)
  // Due Date: Today or past (+40)
  // Short time (quick win): 5-10m (+25)
  // Bonus Quest: (+15)
  const today = new Date().toISOString().split('T')[0];

  const scored = pending.map(q => {
    let score = 0;
    if (q.status === 'IN_PROGRESS') score += 150;
    if (q.importance === 'URGENT') score += 100;
    else if (q.importance === 'HIGH') score += 50;
    else if (q.importance === 'NORMAL') score += 20;

    if (q.dueDate <= today) score += 40;
    if (q.estimatedMinutes <= 10) score += 30; // Quick-win momentum
    else if (q.estimatedMinutes <= 20) score += 15;

    if (q.isBonusQuest) score += 20;

    return { quest: q, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const best = scored[0].quest;

  let reason = '마감일과 중요도를 종합했을 때 지금 가장 먼저 처리하는 것을 강력 추천해요!';
  if (best.status === 'IN_PROGRESS') {
    reason = '이미 시작한 업무예요! 흐름이 끊기기 전에 마저 끝내고 XP를 획득해보세요!';
  } else if (best.importance === 'URGENT') {
    reason = '긴급도가 높은 최우선 업무예요. 먼저 해치우면 마음이 한결 가벼워집니다! 🚨';
  } else if (best.estimatedMinutes <= 10) {
    reason = `예상 소요시간이 ${best.estimatedMinutes}분으로 짧아서 빠르게 클리어하고 모멘텀을 타기 딱 좋아요! ⚡`;
  } else if (best.isBonusQuest) {
    reason = '2배 보너스 XP가 걸려있는 특별 퀘스트입니다! 지금 클리어하고 대량의 경험치를 챙기세요! 🌟';
  }

  return {
    quest: best,
    headline: `🐰 지금은 "${best.title}"을(를) 추천해요!`,
    reason,
    tag: best.importance === 'URGENT' ? 'URGENT' : best.estimatedMinutes <= 10 ? 'QUICK_WIN' : 'RECOMMENDED',
  };
};

// 4. AI Weekly Report Generator
export const generateWeeklyReport = (quests: Quest[], profile: UserProfile): WeeklyReportData => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const thisWeekQuests = quests.filter(q => new Date(q.createdAt) >= oneWeekAgo);
  const completed = thisWeekQuests.filter(q => q.status === 'DONE');
  const completionRate = thisWeekQuests.length > 0 ? Math.round((completed.length / thisWeekQuests.length) * 100) : 100;
  const xpEarned = completed.reduce((acc, q) => acc + (q.xp || 10), 0);

  // Category tally
  const catCount: Record<string, number> = {};
  completed.forEach(q => {
    catCount[q.category] = (catCount[q.category] || 0) + 1;
  });

  let topCategory = '문서';
  let topCount = 0;
  Object.entries(catCount).forEach(([cat, count]) => {
    if (count > topCount) {
      topCount = count;
      topCategory = cat;
    }
  });

  // Day of week tally
  const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const dayCount: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  completed.forEach(q => {
    if (q.completedAt) {
      const d = new Date(q.completedAt).getDay();
      dayCount[d] = (dayCount[d] || 0) + 1;
    }
  });

  let busiestDayIdx = 1;
  let maxDayCount = 0;
  Object.entries(dayCount).forEach(([day, count]) => {
    if (count > maxDayCount) {
      maxDayCount = count;
      busiestDayIdx = Number(day);
    }
  });
  const busiestDay = dayNames[busiestDayIdx];

  const aiCommentary = `이번 주에는 [${topCategory}] 관련 퀘스트를 가장 많이 해결하셨어요!
특히 ${busiestDay}에 집중력이 최고조에 달해 높은 업무 처리량을 보여주셨습니다.
현재 ${profile.streak}일 연속 달성 스트릭을 유지하고 계시며, 다음 레벨까지 얼마 남지 않았어요.
차곡차곡 쌓인 오늘의 성장이 멋진 결과로 이어지고 있습니다. 다음 주도 파이팅! 🐰✨`;

  return {
    totalTasksThisWeek: thisWeekQuests.length,
    completedTasksThisWeek: completed.length,
    completionRate,
    xpEarnedThisWeek: xpEarned,
    topCategory,
    busiestDay,
    streak: profile.streak,
    aiCommentary,
  };
};
