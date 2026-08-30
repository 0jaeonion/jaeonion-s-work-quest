# 🐰 WORK QUEST — 개인 업무 RPG 생산성 웹앱

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

<h3>"오늘의 업무를 퀘스트로, 완료를 성장으로."</h3>
<p>직장인의 반복적인 일상 업무를 귀여운 픽셀 & 파스텔 감성의 RPG 게임처럼 즐길 수 있는 개인 생산성 웹앱</p>

</div>

---

## ✨ 핵심 기능 (Features)

- **🎮 대시보드 & TODAY QUEST**: 1초 만에 등록하는 빠른 추가, 카테고리 태그, 난이도별 경험치(XP), 중요도/마감일 관리.
- **✨ 퀘스트 완료 & 레벨업 연출**: 체크박스 클릭 시 8비트 승리 사운드 + `+XP` 플로팅 애니메이션 + 🎉 LEVEL UP 팡파레와 캔버스 폭죽(Confetti) 연출.
- **🐰 토끼 캐릭터 미니룸 & 드레스룸**: 레벨업과 업적으로 해금되는 모자, 안경, 업무 소품(노트북, 커피 등), 룸 배경(코지룸, 오피스, 야경 등) 커스터마이징.
- **⛓️ 퀘스트 체인 (Quest Chain)**: 큰 업무를 단계별로 쪼개어 단계별 경험치와 올클리어 보너스 XP 획득.
- **📦 업무 템플릿 (Templates)**: 월말 정산, 주간 보고 등 반복 세트 업무를 클릭 한 번에 일괄 등록.
- **🔄 반복 퀘스트 (Recurring Quests)**: 매일, 평일, 매주 특정 요일, 매월 특정 날짜 자동 반복 스케줄링.
- **📅 캘린더 & 활동 잔디 히트맵**: 월별 달력과 활동량에 따른 4단계 잔디 히트맵 시각화.
- **📊 통계 대시보드**: 카테고리별 비중, 요일별 업무량, 시간대별 집중도 분석.
- **🤖 스마트 AI 도우미**:
  - `🎲 오늘 뭐 하지?`: 긴급도/소요시간 기반 최적의 다음 업무 추천.
  - `자연어 업무 등록`: 한 줄 자연어 문장을 여러 개의 퀘스트로 자동 분해.
  - `AI 퀘스트 분해기`: 대형 프로젝트를 단계별 퀘스트 체인으로 자동 설계.
  - `AI 주간 리포트`: 한 주간의 업무 통계 요약 및 칭찬 코멘트.
- **💾 완벽한 데이터 영속화 & 백업**: LocalStorage 자동 저장 및 JSON 파일 내보내기/가져오기 지원.

---

## 🚀 빠른 시작 (Getting Started)

### 1. 패키지 설치
```bash
npm install
```

### 2. 로컬 개발 서버 실행
```bash
npm run dev
```

### 3. 프로덕션 빌드
```bash
npm run build
```

---

## 📁 프로젝트 구조 (Project Structure)

```
src/
├── components/
│   ├── layout/        # Header, Sidebar
│   ├── dashboard/     # DashboardMain, TodayProgressWidget
│   ├── quests/        # QuestItem, TodayQuestList
│   ├── chains/        # QuestChainSection
│   ├── character/     # BunnyMiniroom, CharacterWardrobeView
│   ├── calendar/      # CalendarView
│   ├── stats/         # StatisticsView
│   ├── achievements/  # AchievementsView
│   ├── templates/     # TemplatesView
│   ├── recurring/     # RecurringQuestView
│   ├── settings/      # SettingsView
│   └── modals/        # AddQuest, EditQuest, WhatShouldIDo, AiDecompose, LevelUp, etc.
├── context/
│   └── AppContext.tsx # 통합 상태 관리 및 LocalStorage 동기화
├── utils/
│   ├── constants.ts   # 레벨, 카테고리, 업적, 코스튬 상수 데이터
│   ├── audio.ts       # Web Audio API 8비트 사운드 신시사이저
│   └── aiAssistant.ts # 자연어 파서 및 추천 알고리즘
└── types/
    └── index.ts       # TypeScript 인터페이스 정의
```
