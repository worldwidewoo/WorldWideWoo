# TODO

## Phase 1: 프로젝트 초기화 ✅
- [x] Next.js 프로젝트 생성 (App Router, TypeScript, Tailwind CSS)
- [x] 불필요한 보일러플레이트 정리
- [x] 기본 레이아웃 설정 (layout.tsx - 메타데이터, 폰트, 다크 배경)

## Phase 2: 엔진 시스템 구축 ✅
- [x] GenerativeEngine 인터페이스 정의 (lib/engines/types.ts)
- [x] Canvas 컨테이너 컴포넌트 구현 (components/Canvas.tsx)

## Phase 3: v1 - Conway's Game of Life ✅
- [x] Game of Life 엔진 구현 (lib/engines/gameOfLife.ts)

## Phase 4: v2 - Flow Field ✅
- [x] Perlin noise 구현 (lib/noise.ts)
- [x] Flow Field 엔진 구현 (lib/engines/flowField.ts)

## Phase 5: v3 - Reaction-Diffusion ✅
- [x] Reaction-Diffusion 엔진 구현 (lib/engines/reactionDiffusion.ts)

## Phase 6: UI 오버레이 ✅
- [x] Overlay 컴포넌트 (components/Overlay.tsx)
- [x] VersionToggle 컴포넌트 (components/VersionToggle.tsx)
- [x] 랜딩페이지 조합 (app/page.tsx)

## Phase 7: 폴리싱 ✅
- [x] 모바일 터치 인터랙션 최적화
- [x] 브라우저 리사이즈 대응 (디바운스)
- [x] 성능 최적화 (FlowField 배치 렌더링, ReactionDiffusion OffscreenCanvas)
- [x] 전환 애니메이션 (0.5s fade)
- [x] favicon 설정 (SVG)
- [x] viewport 메타 (모바일 줌 방지)

## Phase 8: 배포 ✅
- [x] Git 저장소 초기화
- [x] GitHub 저장소 생성 & 푸시 (worldwidewoo/WorldWideWoo)
- [x] Vercel 연결 & 배포 (world-wide-woo.vercel.app)

## Phase 9: Lab 페이지 (비주얼 코딩 아카이브)
- [ ] Lab 타입 정의 (lib/lab/types.ts)
  - LabExperiment 인터페이스 (slug, title, description, date, tags, aspectRatio, createEngine)
  - AspectRatio 타입 + 유틸리티
- [ ] 실험 등록부 (lib/lab/registry.ts)
  - 기존 3개 엔진을 첫 아이템으로 등록
  - getExperiment(), getAllTags() 헬퍼
- [ ] globals.css overflow:hidden 제거 (랜딩페이지는 자체 처리)
- [ ] LabCanvas 컴포넌트 (components/LabCanvas.tsx)
  - 컨테이너 기반 사이징 (ResizeObserver)
  - aspectRatio 유지하며 최대 크기 계산
  - 상대 좌표 변환 (getBoundingClientRect 기준)
- [ ] ExperimentCard 컴포넌트 (components/ExperimentCard.tsx)
  - 갤러리 카드: 썸네일(4:3) + 제목 + 설명 + 태그
- [ ] 갤러리 페이지 (app/lab/layout.tsx + app/lab/page.tsx)
  - 반응형 그리드 (1/2/3 컬럼)
  - 최신순 정렬
- [ ] ExperimentDetail 컴포넌트 (components/ExperimentDetail.tsx)
  - 캔버스 + 메타데이터 + Back/Fullscreen 컨트롤
- [ ] 개별 실험 페이지 (app/lab/[slug]/page.tsx)
  - generateStaticParams로 정적 생성
  - slug만 전달, 클라이언트에서 registry 조회
- [ ] 랜딩페이지에 Lab 링크 추가 (Overlay.tsx)
- [ ] 빌드 확인 + 테스트

---

## Future (향후 확장)
- [ ] 포트폴리오 섹션 추가
- [ ] 블로그 (MDX) 추가
- [ ] 비공개 섹션 (비밀번호 보호) 추가
- [ ] 리소스 모음 추가
- [ ] About 페이지 추가
- [ ] 커스텀 도메인 연결
- [ ] 새로운 제너러티브 아트 실험 추가 (Lab에 등록)
