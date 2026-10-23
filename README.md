# 설명회 슬라이드 키트 (deck)

학원 설명회 PPT를 만드는 키트입니다. 덱은 HTML로 쓰고, 화면에서 디자인 규칙대로 그린 뒤 **편집 가능한 PPTX**로 내보냅니다. 디자인은 고정이고 학원마다 바뀌는 건 메인 컬러 하나입니다.

## 바로 보기

```bash
npm install          # 검사 · PPT 스크립트용(puppeteer-core) — 스튜디오만 볼 거면 필요 없음
npm run studio       # → http://localhost:5175/
```

- 예시 덱 보기: `http://localhost:5175/?deck=examples/seminar-korean` (위 목록에서 고를 수도 있음)
- 학원 색 바꿔 보기: `?brand=%23E03E3E` (스튜디오 '학원 설정'도 같음)
- 'PPT로 내보내기' 버튼 → PPTX 저장(브라우저에서 만들어짐)

## 폴더

| 폴더 | 내용 |
|---|---|
| `slide/` | 스튜디오(`index.html`) · 디자인(`slide.css`) · 부품 꾸미기 · 자동 맞춤 · 검사(`main.js`) · 부품 목록(`PARTS.md`) · 덱 쓰기 프롬프트(`PROMPT.md` · 자동 생성 `PROMPT-PARTS.md` · 구성표 `PROMPT-PLAN.md` · 다시 쓰기 `PROMPT-FIX.md` · 사진 점검 `PROMPT-REVIEW.md`) · 구성표 검사 · 다시 쓰기 도우미(`plan.js`) · 예시 덱 27벌과 견본(`examples/`) · 프롬프트용 예시 표(`examples/deck-types.json`) |
| `kit/` | PPTX 내보내기(`pptx.js`) · 글꼴 넣기(`pptx-fonts.js`) |
| `assets/` | 2D 아이콘 85종(`icons.js`) · 화살표 · 체크(`phosphor.js`) |
| `scripts/` | 스튜디오 서버(`serve.py`) · 사진 · 검사(`slide-shot.mjs`) · PPTX 만들기(`slide-pptx.mjs`) · 파워포인트로 열어 확인(`slide-ppt-check.mjs`, Mac) |
| `docs/` | 홈페이지 이식 안내 · 프롬프트(`HOMEPAGE-GUIDE.md`) · 학원 색(`BRAND-COLOR.md`) · 개발자에게(`DEV-MESSAGE.md`) · 5단계 연결(`STEP5-INTEGRATION.md`) |
| `CLAUDE.md` | 디자인 규칙 — 덱을 만드는 Claude가 지켜야 할 것 |

## 스크립트

```bash
node scripts/slide-shot.mjs --deck examples/seminar-korean --brand '#E03E3E' --sheet 시트.png   # 검사 + 사진
node scripts/slide-pptx.mjs --deck examples/seminar-korean --out 덱.pptx                       # PPTX 만들기
```

Chrome이 기본 위치에 없으면 `CHROME_PATH`로 지정합니다.

## 기준 덱

`slide/examples/seminar-korean.html` — 디자이너가 "이번 덱을 기준으로"라고 정한 덱입니다. 새 덱은 이 형식을 따릅니다.
