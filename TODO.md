# TODO

## Phase 1: 프로젝트 초기화
- [ ] Next.js 프로젝트 생성 (App Router, TypeScript, Tailwind CSS)
- [ ] 불필요한 보일러플레이트 정리
- [ ] 기본 레이아웃 설정 (layout.tsx - 메타데이터, 폰트, 다크 배경)

## Phase 2: 엔진 시스템 구축
- [ ] GenerativeEngine 인터페이스 정의 (lib/engines/types.ts)
- [ ] Canvas 컨테이너 컴포넌트 구현 (components/Canvas.tsx)
  - 전체 화면 캔버스
  - requestAnimationFrame 루프
  - 리사이즈 핸들링
  - 마우스/터치 이벤트 전달
  - 엔진 교체 로직

## Phase 3: v1 - Conway's Game of Life
- [ ] Game of Life 엔진 구현 (lib/engines/gameOfLife.ts)
  - 그리드 초기화 (랜덤 시드)
  - 셀 업데이트 로직 (Birth/Survival 규칙)
  - 셀 상태를 색상 그라데이션으로 렌더링
  - 마우스 인터랙션 (호버/클릭으로 셀 활성화)
  - 부드러운 페이드 효과

## Phase 4: v2 - Flow Field
- [ ] Perlin noise 구현 (lib/noise.ts)
- [ ] Flow Field 엔진 구현 (lib/engines/flowField.ts)
  - 벡터 필드 생성
  - 파티클 시스템 (수천 개)
  - 파티클 궤적 렌더링 (반투명 누적)
  - 마우스 위치 → noise offset 영향
  - 시간에 따른 필드 변화

## Phase 5: v3 - Reaction-Diffusion
- [ ] Reaction-Diffusion 엔진 구현 (lib/engines/reactionDiffusion.ts)
  - Gray-Scott 모델 구현
  - 이중 버퍼링
  - 픽셀 단위 렌더링
  - 마우스 클릭으로 시드 포인트 추가
  - 컬러 매핑

## Phase 6: UI 오버레이
- [ ] Overlay 컴포넌트 (components/Overlay.tsx)
  - "WorldWideWoo" 타이틀 (좌측 하단)
  - 미니멀 스타일링
- [ ] VersionToggle 컴포넌트 (components/VersionToggle.tsx)
  - Pill 형태 버튼 그룹 (우측 하단)
  - 현재 활성 버전 표시
  - 버전 전환 시 fade transition
- [ ] 랜딩페이지 조합 (app/page.tsx)

## Phase 7: 폴리싱
- [ ] 모바일 터치 인터랙션 테스트 & 최적화
- [ ] 브라우저 리사이즈 대응 확인
- [ ] 성능 최적화 (프레임 레이트 체크)
- [ ] 전환 애니메이션 부드러움 확인
- [ ] favicon 설정

## Phase 8: 배포
- [ ] Git 저장소 초기화
- [ ] GitHub 저장소 생성 & 푸시
- [ ] Vercel 연결 & 배포
- [ ] 배포 후 동작 확인

---

## Future (향후 확장)
- [ ] 포트폴리오 섹션 추가
- [ ] 블로그 (MDX) 추가
- [ ] 비공개 섹션 (비밀번호 보호) 추가
- [ ] 리소스 모음 추가
- [ ] About 페이지 추가
- [ ] 커스텀 도메인 연결
- [ ] 새로운 제너러티브 아트 버전 추가
