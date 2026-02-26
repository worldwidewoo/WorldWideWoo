# WorldWideWoo

## Project Overview

미디어아트 느낌의 인터랙티브 제너러티브 아트 랜딩페이지. 셀룰러 오토마타/제너러티브 아트 기반으로, 여러 버전의 비주얼을 토글 버튼으로 전환할 수 있는 실험적인 개인 웹사이트.

향후 포트폴리오, 블로그, 개인 연구/테스트, API/기술 모음, 리소스 모음 등으로 확장 예정.

## Tech Stack

- **Framework**: Next.js (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **Rendering**: Canvas API (HTML5 Canvas, no WebGL required)
- **Deployment**: Vercel
- **Domain**: world-wide-woo.vercel.app

## Architecture

### Generative Art Engine System

모든 비주얼 버전은 동일한 `GenerativeEngine` 인터페이스를 구현:

```typescript
interface GenerativeEngine {
  init(canvas: HTMLCanvasElement): void;
  update(): void;
  render(ctx: CanvasRenderingContext2D): void;
  onMouseMove(x: number, y: number): void;
  onMouseClick(x: number, y: number): void;
  resize(width: number, height: number): void;
  destroy(): void;
}
```

엔진 교체만으로 새로운 비주얼 버전을 추가할 수 있는 플러그인 구조.

### Site Structure

```
/ (랜딩페이지)
├── 전체 화면 제너러티브 아트 캔버스
├── 좌측 하단: "WorldWideWoo" 타이틀 + Lab 링크
├── 우측 하단: 버전 토글 버튼 (v1 / v2 / v3)
└── 마우스/터치 인터랙션으로 아트에 영향

/lab (비주얼 코딩 아카이브)
├── 반응형 그리드 갤러리 (실험 카드 나열)
├── 카드 클릭 → /lab/[slug] 개별 실험 페이지
└── 개별 실험: 캔버스(비율 유지) + 메타데이터 + 풀스크린
```

### Lab 시스템 (실험 아카이브)

OpenProcessing 스타일의 비주얼 코딩 실험 아카이브.

**새 실험 추가 방법:**
1. `lib/engines/`에 엔진 파일 생성 (GenerativeEngine 구현)
2. `lib/lab/registry.ts`에 메타데이터 등록

**데이터 모델:**
```typescript
interface LabExperiment {
  slug: string;              // URL 식별자
  title: string;             // 표시 이름
  description: string;       // 짧은 설명
  date: string;              // ISO 날짜
  tags: string[];            // 태그 목록
  aspectRatio: AspectRatio;  // 캔버스 비율 (1:1, 16:9, 4:3 등)
  thumbnail?: string;        // 정적 썸네일 경로
  createEngine: () => GenerativeEngine;
}
```

### File Structure

```
WorldWideWoo/
├── app/
│   ├── layout.tsx          # 루트 레이아웃 (메타데이터, 폰트)
│   ├── page.tsx            # 랜딩페이지 (캔버스 + UI 오버레이)
│   └── lab/
│       ├── layout.tsx      # Lab 레이아웃 (스크롤 허용)
│       ├── page.tsx        # 갤러리 페이지 (그리드)
│       └── [slug]/
│           └── page.tsx    # 개별 실험 페이지
├── components/
│   ├── Canvas.tsx           # 랜딩페이지 전체화면 캔버스
│   ├── LabCanvas.tsx        # Lab 컨테이너 기반 캔버스 (비율 유지)
│   ├── ExperimentCard.tsx   # 갤러리 카드
│   ├── ExperimentDetail.tsx # 디테일 뷰
│   ├── VersionToggle.tsx    # 버전 전환 토글 UI
│   └── Overlay.tsx          # 타이틀 + UI 오버레이
├── lib/
│   ├── engines/
│   │   ├── types.ts         # 공통 엔진 인터페이스
│   │   ├── gameOfLife.ts    # Conway's Game of Life
│   │   ├── flowField.ts    # Flow Field (Perlin noise)
│   │   └── reactionDiffusion.ts  # Reaction-Diffusion
│   ├── lab/
│   │   ├── types.ts         # LabExperiment 인터페이스, AspectRatio
│   │   └── registry.ts     # 실험 등록부
│   └── noise.ts             # Perlin noise 구현
├── public/
│   ├── favicon.svg
│   └── lab/                 # 실험 썸네일 이미지
├── CLAUDE.md
├── TODO.md
└── docs/
    └── PLAN.md
```

## Visual Versions

### v1: Conway's Game of Life
- 클래식 셀룰러 오토마타
- 셀 상태를 색상 그라데이션으로 표현 (살아있는 시간에 따라 색 변화)
- 마우스 호버/클릭으로 셀 활성화

### v2: Flow Field
- Perlin noise 기반 벡터 필드
- 수천 개 파티클이 필드를 따라 이동하며 궤적 생성
- 마우스 위치가 흐름의 방향에 영향

### v3: Reaction-Diffusion
- Gray-Scott 모델 기반
- 두 화학물질이 퍼지고 반응하며 유기적 패턴 생성
- 마우스 클릭으로 화학물질 주입

## Design Direction

- 전체 화면 캔버스 (viewport 100%)
- 다크 배경 기본
- 오버레이 UI는 미니멀 (캔버스 위에 반투명)
- 모노스페이스 또는 미니멀 서체
- 버전 토글: 작은 pill 형태 버튼 그룹
- 부드러운 버전 전환 (fade transition)
- 반응형 (모바일 터치 지원)

## Commands

```bash
npm run dev      # 개발 서버 (localhost:3000)
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버
npm run lint     # ESLint
```

## Deployment

- **GitHub**: github.com/worldwidewoo/WorldWideWoo
- **Vercel**: world-wide-woo.vercel.app (main 브랜치 자동 배포)

## Future Plans

- Lab에 새로운 비주얼 코딩 실험 지속 추가
- 포트폴리오 섹션 (/projects)
- 블로그 (MDX 기반, /blog)
- 비공개 섹션 (비밀번호 보호, /private)
  - 개인 연구/실험 노트
  - API/기술 스니펫 모음
  - 비공개 리소스/북마크
- 공개 리소스 모음 (/resources)
- About 페이지 (/about)
