# WorldWideWoo

## Project Overview

미디어아트 느낌의 인터랙티브 제너러티브 아트 랜딩페이지. 셀룰러 오토마타/제너러티브 아트 기반으로, 여러 버전의 비주얼을 토글 버튼으로 전환할 수 있는 실험적인 개인 웹사이트.

향후 포트폴리오, 블로그, 개인 연구/테스트, API/기술 모음, 리소스 모음 등으로 확장 예정.

## Tech Stack

- **Framework**: Next.js (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **Rendering**: Canvas API (HTML5 Canvas, no WebGL required)
- **Deployment**: Vercel
- **Domain**: 추후 구매 예정 (우선 xxx.vercel.app)

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
├── 좌측 하단: "WorldWideWoo" 타이틀 (미니멀)
├── 우측 하단: 버전 토글 버튼 (v1 / v2 / v3)
└── 마우스/터치 인터랙션으로 아트에 영향
```

### File Structure (Target)

```
WorldWideWoo/
├── app/
│   ├── layout.tsx          # 루트 레이아웃 (메타데이터, 폰트)
│   └── page.tsx            # 랜딩페이지 (캔버스 + UI 오버레이)
├── components/
│   ├── Canvas.tsx           # 메인 캔버스 컨테이너
│   ├── VersionToggle.tsx    # 버전 전환 토글 UI
│   └── Overlay.tsx          # 타이틀 + UI 오버레이
├── lib/
│   ├── engines/
│   │   ├── types.ts         # 공통 엔진 인터페이스
│   │   ├── gameOfLife.ts    # v1: Conway's Game of Life
│   │   ├── flowField.ts    # v2: Flow Field (Perlin noise)
│   │   └── reactionDiffusion.ts  # v3: Reaction-Diffusion
│   └── noise.ts             # Perlin noise 구현 (v2용)
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

## Future Plans

- 포트폴리오 섹션 (/projects)
- 블로그 (MDX 기반, /blog)
- 비공개 섹션 (비밀번호 보호, /private)
  - 개인 연구/실험 노트
  - API/기술 스니펫 모음
  - 비공개 리소스/북마크
- 공개 리소스 모음 (/resources)
- About 페이지 (/about)
