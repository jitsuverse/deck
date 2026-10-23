# 바뀐 것

## v1.0.0 — 2026-10-23 (첫 전달)

- 설명회 슬라이드 키트 첫 묶음: 스튜디오 · 디자인 규칙(`CLAUDE.md`) · 부품 210여 종(`slide/PARTS.md`) · 2D 아이콘 85종 · 예시 덱 27벌(주제별 — 국어 · 수학 · 영어 · 과학 · 사회 · 역사 · 독서 · 논술 · 입시 · 수능 대비 · 수시 · 정시 · 정시 원서 · 내신 · 습관 · 입학 준비 · 코딩 · 경제) + 견본 덱.
- 학원 메인 컬러: 밝은 색(흰 글자 대비 3 : 1 미만)은 글자를 진하게, 파스텔은 밝기만 낮춰 사용, 거의 흰색만 기본 색. 검정 · 회색의 한계는 `docs/BRAND-COLOR.md`.
- 검사: 넘침 · 정렬(잉크 기준) · 도식 크기 45% · 반복 도식 · 글자 대비(2.5 : 1) · PPT에서 깨지는 모양(모서리 · 가상 요소 등), 눈에 보이는 무게 중심은 후보로(`--weights 1`).
- PPT 내보내기: 편집 가능한 글상자(자동 줄바꿈 끔 · 상자 크기 자동 맞춤), 그래프 값은 그림 밖 글상자, 사진 자리는 칸 크기 그대로 + 대체 텍스트, Pretendard 포함(하위 집합).
- 덱 쓰기 전용 프롬프트: 규칙 `slide/PROMPT.md` + 부품 마크업 표 `slide/PROMPT-PARTS.md`(예시 덱에서 자동 생성, `npm run prompt-parts`) · 프롬프트용 예시 표 `slide/examples/deck-types.json` · 이식 안내 `docs/HOMEPAGE-GUIDE.md`.
- 4단계 덱 쓰기(① 장 구성표 → ② 덱 HTML → ③ 걸린 장만 다시 쓰기 → ④ 장별 사진 점검): 장 구성표 검사(`slide/plan.js checkPlan` + `PROMPT-PLAN.md`) · 걸린 장만 다시 쓰기(`buildFixRequest` · `replaceSections` + `PROMPT-FIX.md`) · 시험 스크립트 `slide-plan-check.mjs` · `slide-fix.mjs`.
- 완성도 맞추기: 구성표에 그림 도식 비율(절반 이상) · 마크업 표에 부품 분류(그림 · 정보 · 사진)와 쓰인 덱 주제 · 약한 장 검사(부품별 예시 덱 항목 개수 `part-ranges.js`) · 메모가 도식 글자를 가리는지 검사 · 사진 보고 다듬기(`PROMPT-REVIEW.md`, `slide-fix.mjs --shots/--review`) · 주간 계획 칸 수 자동.
- 설명회 설계 5단계 연결: 대본 꼭지 순서(`section[data-beat]`) · 발표자 노트(`aside.s-notes` → PPTX 노트) · 목표 장 수(`checkPlan` opts) · 감정별 도식 · 안내 `docs/STEP5-INTEGRATION.md`(레이아웃 13종 · 3D 오브젝트 대응표).
