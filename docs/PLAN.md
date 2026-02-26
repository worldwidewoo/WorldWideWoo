# Implementation Plan

## 개요

WorldWideWoo는 인터랙티브 제너러티브 아트 기반의 개인 웹사이트.
전체 화면 캔버스에 알고리즘 기반 비주얼을 렌더링하고, 토글 버튼으로 다양한 버전을 전환할 수 있다.

## 기술 결정 사항

### Why Next.js?
- 향후 블로그(MDX), 포트폴리오 등 페이지 추가가 용이
- Vercel 배포 최적화
- App Router로 모던 React 패턴 사용

### Why Canvas API (not WebGL/Three.js)?
- 셀룰러 오토마타와 2D 제너러티브 아트에 Canvas 2D가 적합
- Three.js 의존성 없이 가볍게 구현
- 향후 WebGL이 필요하면 특정 버전만 추가 가능

### 엔진 플러그인 시스템
모든 비주얼 버전은 `GenerativeEngine` 인터페이스를 구현:

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

이 구조로:
- 새 버전 추가 = 새 엔진 파일 하나 작성
- Canvas 컨테이너는 재사용
- 엔진 간 전환은 destroy() → init() 호출

## 각 엔진 구현 상세

### v1: Conway's Game of Life

**알고리즘:**
- 2D 그리드, 각 셀은 alive(1) 또는 dead(0)
- 매 프레임 규칙 적용: B3/S23 (3개 이웃이면 탄생, 2-3개면 생존)
- 셀 크기는 화면 크기에 따라 자동 조절 (약 4-8px)

**렌더링:**
- alive 셀: 살아있는 기간에 따라 색상 변화 (파랑 → 초록 → 노랑 → 빨강)
- dead 셀: 최근 죽은 셀은 잔상 (페이드 아웃)
- 배경: 짙은 남색/검정

**인터랙션:**
- 마우스 이동: 마우스 주변 반경에 랜덤 셀 활성화
- 클릭: 더 넓은 반경에 셀 활성화 (폭발 효과)

### v2: Flow Field

**알고리즘:**
- Perlin noise로 2D 벡터 필드 생성
- 시간(z축)에 따라 noise 값이 변화 → 필드 애니메이션
- 파티클 (2000-5000개): 위치에서 필드 벡터를 읽고 속도에 반영

**렌더링:**
- 매 프레임 캔버스를 완전히 지우지 않고 반투명 검정으로 덮음 → 궤적 효과
- 파티클은 1-2px 밝은 점으로 렌더링
- 파티클 색상: 속도 또는 방향에 따라 변화

**인터랙션:**
- 마우스 위치가 noise의 offset이나 frequency에 영향
- 마우스 주변에 회오리 또는 반발력 효과

### v3: Reaction-Diffusion

**알고리즘:**
- Gray-Scott 모델: 두 화학물질 A, B
- A + 2B → 3B (반응), 각각 고유 확산 속도
- 파라미터 f (feed rate), k (kill rate)로 패턴 결정
- 이중 버퍼: 현재 상태 읽기 → 새 상태 쓰기 → 스왑

**렌더링:**
- 픽셀 단위로 B 농도를 색상에 매핑
- 색상 팔레트: 검정(낮은 B) → 청록 → 흰색(높은 B) 등

**인터랙션:**
- 클릭: 해당 위치에 B 물질 주입 (시드 포인트)
- 마우스 드래그로 연속 주입

## UI 디자인 상세

### 레이아웃
```
┌─────────────────────────────┐
│                             │
│     (전체 화면 캔버스)        │
│                             │
│                             │
│                             │
│ WorldWideWoo    [v1][v2][v3]│
└─────────────────────────────┘
```

### 타이틀
- 위치: 좌측 하단, 패딩 24px
- 폰트: 모노스페이스 (JetBrains Mono 또는 시스템 모노)
- 크기: 14-16px
- 색상: rgba(255,255,255,0.6)
- letter-spacing: 0.1em

### 버전 토글
- 위치: 우측 하단, 패딩 24px
- 형태: pill 버튼 그룹 (가로 배치)
- 비활성: 반투명 배경, 흐린 텍스트
- 활성: 밝은 배경, 선명한 텍스트
- hover: 약간의 밝기 증가
- 전환: 0.3s ease transition

### 버전 전환 효과
- 현재 캔버스 fade out (opacity 0, 0.5s)
- 엔진 교체 (destroy → init)
- 새 캔버스 fade in (opacity 1, 0.5s)

---

## Lab 시스템 (비주얼 코딩 아카이브)

OpenProcessing 스타일의 개인 비주얼 코딩 실험 아카이브. 다양한 제너러티브 아트 실험을 연구하고 모아놓는 작업 공간.

### 아키텍처

**중앙 등록부 (Registry)** 방식:
- `lib/lab/registry.ts`에 모든 실험의 메타데이터 + 엔진 팩토리를 등록
- 새 실험 추가 = 엔진 파일 생성 + registry에 한 줄 추가
- 라우트/컴포넌트 자동 연결 (추가 작업 불필요)

**라우팅:**
- `/lab` — 갤러리 그리드 (모든 실험 카드)
- `/lab/[slug]` — 개별 실험 전체 뷰 (캔버스 + 메타데이터)
- `generateStaticParams`로 정적 생성

### 데이터 모델

```typescript
interface LabExperiment {
  slug: string;           // URL 식별자: "game-of-life"
  title: string;          // "Conway's Game of Life"
  description: string;    // 1-2문장 설명
  date: string;           // "2025-02-25"
  tags: string[];         // ["cellular-automata", "simulation"]
  aspectRatio: AspectRatio; // "16:9" | "1:1" | "4:3" 등
  thumbnail?: string;     // "/lab/game-of-life.png" (선택사항)
  createEngine: () => GenerativeEngine;
}
```

### 화면비율 처리
- 각 실험이 `aspectRatio` 선언
- 갤러리: 썸네일은 통일된 4:3 비율로 크롭 → 깔끔한 그리드
- 디테일: 뷰포트 안에서 선언된 비율 유지하며 최대 크기 표시

### 컴포넌트

**LabCanvas** (기존 Canvas.tsx와 분리):
- ResizeObserver로 컨테이너 크기 감지
- aspectRatio에 맞춰 캔버스 크기 계산 (fit-within)
- getBoundingClientRect 기준 상대 좌표 변환

**ExperimentCard**: 갤러리 카드 (썸네일 + 메타데이터)
**ExperimentDetail**: 디테일 뷰 (캔버스 + 메타 + 네비게이션 + 풀스크린)

### 기술 고려사항
- `createEngine` 함수는 직렬화 불가 → slug만 서버에서 전달, 클라이언트에서 registry 조회
- 썸네일: 정적 PNG (public/lab/), 없으면 다크 플레이스홀더
- 메모리 관리: 페이지 이동 시 engine.destroy() + cancelAnimationFrame 호출
