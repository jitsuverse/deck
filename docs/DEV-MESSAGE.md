# 개발자님께 — 설명회 슬라이드 키트 v1.0 전달

안녕하세요. 학원 설명회 PPT를 만드는 키트를 전달드립니다. 카드뉴스 키트(jitsuverse/card)와는 따로 이 저장소(jitsuverse/deck)에 담았습니다.

## 무엇인가요
- 원장님 입력으로 Claude가 덱(HTML)을 쓰면, 이 키트가 디자인 규칙대로 그려서 **편집 가능한 PPTX**로 내보냅니다. PPT 내보내기는 브라우저에서 돕니다.
- 디자인은 고정이고, 학원마다 바뀌는 건 메인 컬러 하나(`?brand=#RRGGBB`)입니다.

## 먼저 읽어 주세요
1. `README.md` — 실행 방법(`npm run studio`)과 폴더.
2. `docs/STEP5-INTEGRATION.md` — '설명회 설계' 5단계(PPT 만들기)를 키트로 바꾸는 법(재료 · 발표자 노트 · 꼭지 연결 · 레이아웃 13종 대응표 · 진짜 대본 비교).
3. `docs/HOMEPAGE-GUIDE.md` — 이식 흐름, 덱 HTML 형식, 프롬프트 구성과 캐시, 검사, PPT 내보내기, 외부 CDN.
4. `docs/BRAND-COLOR.md` — 학원 색 처리와 검정 · 회색 학원 색 안내(학원 설정 화면에 안내 문구를 권장).
5. `slide/PROMPT.md` · `slide/PROMPT-PARTS.md` — 덱을 쓰는 Claude에게 넣을 규칙과 부품 마크업 표(자동 생성). `CLAUDE.md` · `slide/PARTS.md`는 키트를 고치는 사람용입니다.

## 부탁드리는 것
- 프롬프트에는 `slide/PROMPT.md` + `slide/PROMPT-PARTS.md` + 기준 덱 + 주제 예시 1벌(`slide/examples/deck-types.json`)을 넣고 캐시해 주세요(순서는 HOMEPAGE-GUIDE 3절).
- 덱은 4단계로 쓰게 해 주세요: ① 장 구성표(JSON) → `checkPlan` ② 덱 HTML ③ 그린 뒤 `slideCheck` → 걸린 장만 다시 쓰기 ④ 장별 사진을 보고 다듬기(`PROMPT-REVIEW.md`)(`slide/plan.js` 도우미 · `PROMPT-PLAN.md` · `PROMPT-FIX.md`, HOMEPAGE-GUIDE 1절). 여기서 만든 예시 덱과 같은 주제로 비교했을 때 도식 구성 · 그림 도식 비율이 거의 같았습니다(HOMEPAGE-GUIDE 1절).
- 수정 요청은 덱 전체를 다시 쓰지 말고 바뀐 장만 다시 쓰게 해 주세요.
- 학원 메인 컬러는 덱에 넣지 말고 화면을 열 때 `?brand=`로 넘겨 주세요.

## 아직 확인하지 못한 것
- 윈도우 파워포인트에서 PPTX 열기(글꼴 포함 · 글상자 자동 맞춤) — Mac 파워포인트로만 확인했습니다.
- PPT '그림 바꾸기' 뒤 사진 비율 · 모서리.

궁금한 점은 디자이너에게 말씀해 주세요. 감사합니다.
