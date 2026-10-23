# 설명회 설계 5단계(PPT 만들기)에 키트 붙이기

홈페이지 '설명회 설계'(주제 → 자료 → 순서 → 대본 → PPT)의 5단계를 이 키트로 바꾸는 안내입니다. 1 ~ 4단계는 그대로 두고, `app/api/marketing/seminar/generate-slides`가 만들던 JSON 덱(레이아웃 13종) 대신 키트 덱 HTML을 만듭니다. 홈페이지 코드는 개발자가 고칩니다 — 여기엔 키트 쪽에서 맞춰 둔 것만 적습니다. (2026-10-23, 홈페이지 dev 브랜치 기준)

## 1. 재료는 지금 5단계가 받는 것 그대로

`generate-slides`가 `seminar-slides.md`에 넣던 값을 그대로 이번 요청 글(프롬프트 맨 뒤, 캐시 ✗)에 넣습니다.

```
## 이번 설명회
- 학원: {academyName} · 주제: "{topic}" · 대상: {gradeLabel} 학부모 · 지금 시기: {seasonLabel}
- 발표 시간: {durationMin}분 → 목표 {slideCountTarget(durationMin, beats.length)}장 안팎
- 진행 방식: {deliveryStyleNote}
### 이 학년 학부모가 궁금해하는 학교
{schoolAxisBlock}
## 원본 대본 (꼭지 순서 = 장 순서)
{buildScriptDigest(script)}     ← '## n. 꼭지 이름 (act) · n분' + '[beatId: …][emotion: …]' + 대본 글
## 이 설명회의 기둥
{strengthBlock}
## 학원 실데이터 (숫자는 여기 있는 것만)
{dataBlock}
{userPromptLine}
```

- 프롬프트 앞부분(캐시): `slide/PROMPT.md` → `slide/PROMPT-PARTS.md` → 기준 덱 + 주제 예시 1벌(`slide/examples/deck-types.json`) → `slide/PROMPT-PLAN.md`. 다시 쓰기 · 사진 점검 때는 `PROMPT-FIX.md` · `PROMPT-REVIEW.md`를 이어서.
- `emotionLayoutHints`는 넣지 않아도 됩니다 — 감정별 도식은 `PROMPT.md` 2절에 있습니다(레이아웃 13종이 아니라 키트 부품 기준).

## 2. 흐름 (HOMEPAGE-GUIDE 1절의 ① ~ ④와 같음)

1. **장 구성표**: `checkPlan(plan, 요청 글, parts, { beats: script.beats.map(b => b.id), target })` — 꼭지 순서 · 빠진 꼭지 · 목표 장 수 ±3 · 그림 도식 비율 · 지어낸 숫자를 봅니다.
2. **덱 HTML**: 장마다 `section.slide[data-beat]` + `aside.s-notes`(원장님이 그 장에서 할 말).
3. **그려서 검사** → 걸린 장만 다시 쓰기.
4. **장별 사진 점검** → 고칠 장만 다시 쓰기.

## 3. 지금 5단계와 달라지는 것

| | 지금(JSON 덱) | 키트 |
|---|---|---|
| 결과 | `{ slides: [{ layout, title, …, notes }] }` | 덱 HTML(`section.slide` 이어 붙임) |
| 레이아웃 | 13종 | 부품 210여 종(`PROMPT-PARTS.md`) |
| 발표자 노트 | `notes` | `aside.s-notes` → PPTX 노트(`kit/pptx.js` `addNotes`) |
| 꼭지 연결 | `beatId` | `section[data-beat]` |
| 그림 | 3D 오브젝트 16종(`object`) | 2D 아이콘 85종(`data-icon`) |
| 강조 | `titleAccent`(제목 한 어절 색) | 표지 제목만 `.hl` — 내지 대제목엔 메인 컬러 ✗(디자이너 규칙) |
| 부연설명 | `subtitle` | 내지엔 없음(마감 장만) |
| PPTX | `lib/seminar/pptx.js` | `kit/pptx.js deckToPptx(slides)` — 브라우저에서, 글꼴 포함 |

## 4. 레이아웃 13종 ↔ 키트 부품 (예전 덱 옮기기 · 폴백용)

| 지금 layout | 키트 부품(먼저 쓸 것부터) |
|---|---|
| cover | `section.s-cover` |
| agenda | `.s-agenda` |
| bigNumber | `.m-bignum` · `.s-hero-center` · `.m-num` |
| stats | `.m-iconstat` 카드 2 ~ 4장 · `.s-kpis` |
| bars | `.m-bars` · `.m-hbars` · `.m-line`(시간 흐름) |
| compare | `.m-versus` · `.m-ba` · `.m-scorecard` · `.m-orbs`(같은 학생들 점수대 변화) |
| cards | `.m-feature` · `.m-icongrid` · `.m-quad` |
| steps | `.m-steps` · `.m-stepper` · `.s-roadmap.cards` |
| timeline | `.m-timeline` · `.m-timeband` · `.m-month`(달력) |
| quote | `.s-quote`(말풍선) · `.m-review` 카드 셋 · `.s-dialog`(대화) |
| table | `.m-table` · `table.m-ox` |
| cta | `.s-cta` + 혜택 `.m-coupon` |
| bullets | `ul.m-checkbox` · `ul.m-list` |

3D 오브젝트 → 2D 아이콘: growth → `trend` · time → `clock` · target → `target` · study → `book` · win → `trophy` · check → `check` · idea → `bulb` · calendar → `calendar` · folder → `folder` · milestone → `flag` · launch → `rocket` · talk → `chat` · key → `key` · solve → `puzzle` · star → `star` · money → `coin`.

## 5. 모델

- 지금 5단계는 `claude-sonnet-5` + adaptive thinking입니다. 키트 시험에서는 Opus가 그림 도식을 조금 더 많이 골랐습니다(HOMEPAGE-GUIDE 1절). 덱 쓰기(① · ②)는 Opus, 다시 쓰기(③ · ④)는 Sonnet으로 나누는 것을 권합니다.
- 실패하면(파싱 실패 · 시간 초과) 지금처럼 규칙 폴백 — 4절 표로 JSON 덱을 키트 부품으로 옮길 수 있습니다.

## 6. 진짜 대본으로 비교(2026-10-23)

홈페이지에 저장된 설명회 '상위권 고교 학생들의 특징'(중등 · 꼭지 13개 · 60분)의 대본을 보관함에서 읽어, 위 1절 형식 그대로 키트 방식으로 만들었습니다(감정은 지금 PPT의 장별 감정 표시를 꼭지에 옮김, 학원 실데이터는 비워 둠 — 대본의 숫자만).
- 지금 5단계 PPT: 15장 — 한 문장 3 · 좌우 대비 3 · 단계 2 · 막대 · 지표 카드 · 유형 카드 · 큰 숫자 · 타임라인 · 표지 · 마감. 글 상자 · 칩이 작고 화면 대부분이 비어 있음.
- 키트 방식: Sonnet · Opus 모두 17장(장 표지 2 포함), 13꼭지 순서대로, 장마다 발표자 노트(PPTX 노트 17장 확인). 도식: 대화 · 말풍선 · 3원 벤 · O/X 표 · 시험지 두 장 · 원 크기 비교 · 빙산 · 반원 게이지 · 로드맵 · 원인 결과 · 교재 사진 자리 · 레벨테스트 사진 자리 등. 구성표 첫 검사 통과(Opus는 학년 '고2'를 숫자 되풀이로 오검출 → 검사 고침), HTML 검사 2장씩 걸림 → 다시 쓰기, 사진 점검이 2 ~ 3장 더 고침.
- 남은 약점: Sonnet 덱 4장(시험 범위 1배 · 3배 원 두 개)은 두 번 고쳐도 도식이 작음(37 ~ 43%) — 숫자 둘뿐인 꼭지라 그림거리가 적음. 실데이터(학원 성적 · 학생 사례)가 들어가면 나아집니다.
