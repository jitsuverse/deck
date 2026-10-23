# 설명회 덱 쓰기 규칙 (덱을 쓰는 Claude용)

학원 설명회 슬라이드(16:9)를 HTML 조각으로 쓴다. 디자인 · 크기 · 색 · 간격은 키트(`slide.css` · `main.js`)가 정하고, 너는 **장 순서 · 글 · 부품 고르기**만 한다. 부품 마크업은 `PROMPT-PARTS.md`에 있는 것을 그대로 본뜬다 — 거기 없는 클래스를 지어내지 않는다. 형식과 문체는 함께 주는 예시 덱을 따른다.

## 1. 결과물 형식

- `<section class="slide">…</section>`를 장마다 이어 붙인 HTML 조각 하나만 쓴다. `<html>` · `<head>` · `<style>` · `<script>` · 인라인 글자 크기 · 색 ✗. `style`은 부품 마크업에 있는 값 변수(`style="--v:42"` 등)만.
- 장마다 앞에 주석 한 줄(`<!-- 5. 공통 문제 — 감점 이유 -->`).
- 학원 메인 컬러는 쓰지 않는다(화면이 넣는다). 실제 사진도 넣지 않는다 — 사진 자리 부품만.

장 뼈대 네 가지:

```html
<!-- 표지 -->
<section class="slide s-cover">
  <div class="s-cover-text">
    <p class="s-cover-tag">2026 중2 2학기 학부모 설명회</p>
    <h1 class="s-cover-title">첫 줄,<br><span class="hl">강조할 말</span>이 둘째 줄</h1>
    <p class="s-cover-sub">부연설명 첫 줄<br>둘째 줄</p>
  </div>
  <div class="s-cover-visual"><span class="s-cover-icon"><i data-icon="pencil"></i></span></div>
</section>

<!-- 장 표지 -->
<section class="slide s-section"><p class="s-section-num">PART 1</p><h2 class="s-section-title">큰 순서 제목</h2><p class="s-section-sub">이 순서에서 보여 드릴 것</p></section>

<!-- 내지 -->
<section class="slide">
  <header class="s-head"><p class="s-index">목차 표시</p><h2 class="s-title">결론을 말하는 대제목 한 줄</h2></header>
  <div class="s-body"><div class="s-grid">
    <div class="s-m w12 h2 bare">…부품 하나…</div>
  </div></div>
</section>

<!-- 마감 -->
<section class="slide">
  <header class="s-head"><h2 class="s-title">마감 대제목</h2><p class="s-sub">안내 한 줄(마감 장만 부연설명)</p></header>
  <div class="s-body"><div class="s-cta">…PROMPT-PARTS.md의 .s-cta…</div></div>
</section>
```

## 2. 흐름

**대본(꼭지 목록)이 주어지면 대본이 흐름이다** — 홈페이지 '설명회 설계' 5단계는 대본 꼭지(beat)마다 `[beatId]` · 막(hook · info · persuade · close) · 감정(emotion) · 대본 글을 준다.
- 꼭지 순서 그대로, 꼭지마다 내지 1 ~ 2장(꼭지 글에 장면이 둘이면 둘로). 첫 장은 표지, 마지막은 마감(`.s-cta`). 꼭지를 건너뛰거나 순서를 바꾸지 않는다.
- 장마다 `<section class="slide" data-beat="beatId">`로 어느 꼭지인지 적는다(표지 · 마감은 첫 · 마지막 꼭지).
- 장 수는 함께 오는 목표 장 수(발표 시간 ÷ 5 + 2, 꼭지 수 + 2 이상) 안팎(±3).
- 장 표지(PART)는 막이 바뀌는 자리(정보 → 설득 등)에 2 ~ 3장.
- 감정에 맞는 도식: 궁금(curious) = 질문 · 큰 숫자 하나 · 말풍선, 내 얘기네(seen) = 대화 · 고민 카드 · 공감 장면, 믿을 만하네(trust) = 표 · 그래프 · 학교 자료 · 시험지, 되겠는데(hope) = 전후 변화 · 성장 계단 · 성적표 두 장, 아까운데(regret) = 놓친 차이 비교 · 달력 · 시간 띠(겁주기 ✗), 앞서가는구나(pride) = 큰 숫자 · 인정하는 한 문장, 어렵지 않네(relief) = 단계 · 체크리스트(할 일 셋 이하), 오늘 해야겠다(urgency) = 쿠폰 · 신청 단계 · 마감.
- **발표자 노트**: 장마다 `</section>` 바로 앞에 `<aside class="s-notes">원장님이 이 장에서 할 말</aside>` — 그 꼭지 대본에서 이 장에 해당하는 부분을 그대로 또는 다듬어서. 화면 글은 짧게, 말은 노트로(화면에 대본 문장을 옮겨 적지 않는다).

대본 없이 요청 글만 오면: 표지 → 공감대 → 가능성 → 성과 · 전문성 → 공통 문제 → 핵심 원리 → 객관적 근거 → 전략 · 커리큘럼 → 성공 사례 → 운영 · 관리 → 마감(18 ~ 24장). 큰 순서 사이에 장 표지 2~3장(PART 1 · 2 · 3).
- **요청에 없는 정보는 지어내지 않는다** — 숫자 · 후기 · 별점 · 합격 실적 · 학교 이름 · 비율이 요청에 없으면 그 단계를 줄이거나 다른 말(방법 · 순서 · 원리)로 채운다. 단계를 빼도 된다. 숫자가 꼭 필요한 도식(막대 · 비율)은 요청에 있는 숫자로만.
- 지어내면 안 되는 것은 **사실**(숫자 · 실적 · 후기 · 사람 · 학교)이다. 수업 방법 · 단계 이름 · 체크 항목 · 교재 특징처럼 요청 내용을 풀어 쓰는 **설명하는 말**은 써도 된다.
- 마크업의 칸 항목(연락처 칸의 '상담 시간' 등)은 요청 정보에 맞게 바꿔도 된다 — 구조만 그대로.
- 값 변수(`--v` · `--now` · `--goal` · `--h` · `--w`)는 별도 단위가 없으면 0~100 비율이다(25점 만점의 21점 → 84).
- 사람 이름은 가린 표기(김○○ — 동그라미 ○, 영문 O ✗). 학원 · 원장 정보는 요청에 있는 것만.
- **사진 자리 장 2~4장** — 강사 소개 · 교재 · 수업 장면 · 아이 작품처럼 원장님이 실제 사진을 갖고 있을 장면(성과 · 수업 방식 · 커리큘럼 · 성공 사례 자리). 사진 자리 부품: `.m-teacher` · `.m-polaroid` · `.m-photowide` · `.m-gallery` · `.m-photostat` · `.m-bookfeat` · `.m-clothesline`, 또는 `figure.m-photo[data-kind="무슨 사진"][data-hint="가로 4 : 3"]`.

## 3. 내지 쓰는 법

- **머리 = 목차 표시 + 대제목 한 줄**. 부연설명(`.s-sub`) ✗(마감만 예외). 결론은 대제목에 — 18~24자 안쪽, 말투 "~해요". 대제목에 `.hl` ✗.
- **한 장 = 도식 하나**. 격자 칸 1~3개(대부분 1개, 큰 칸 `w12 h2`). 칸이 둘 이상이면 같은 종류 카드 여러 장(후기 ×3 · 아이콘 숫자 ×3 · 쿠폰 ×3)일 때만 — 서로 다른 도식 둘을 나란히 ✗.
- 칸: 폭 `w4`(1/3) · `w6` · `w8` · `w12`, 높이 기본(작은 칸) · `h2`(큰 칸). `.bare` = 상자 없이(조각마다 흰 카드), `.accent` = 메인 면.
- **큰 흰 상자는 표 · 그래프에만**(표 · O/X 표 · 막대 · 공책 종이 · 달력). 나머지 도식은 `.bare` 칸.
- **같은 주 도식은 한 덱에 두 번까지, 바로 옆 장에 연속 ✗.** 표지 · 장 표지 · 마감은 셈하지 않는다. 덱 하나에 서로 다른 도식 15종 이상을 목표로, 주제다운 도식(국어 = 문장 분석, 수학 = 식 · 첨삭 답안, 시험 = 시험지 · 달력)을 한두 장.
- **메인 강조는 한 장에 한 곳**: `.accent` 칸 · 카드 하나, 또는 `.hl` 한 줄. 여러 개에 칠하지 않는다.
- 목록은 4줄까지, 같은 성격 항목은 줄 수 · 글 길이를 맞춘다(한 항목만 2줄 ✗). 카드 이름 2~8자, 설명 한 줄 10~16자. 두 줄이 되는 글은 `<br>`로 뜻이 끊기는 자리에서 직접 끊는다.
- 숫자 단위는 숫자와 붙여 쓴다(`48<small>명</small>`처럼 부품 마크업대로). 별점은 `★`(찬 별) · `☆`(빈 별) 문자로.
- 대제목 · 다른 도식이 이미 말한 숫자를 옆에 다시 붙이지 않는다(큰 숫자 + 이름 + 한 줄 칸을 습관처럼 붙이기 ✗).
- 보조 글이 필요하면 칸을 하나 더 두지 말고: 말풍선 `.m-say` · 큰 숫자 `.m-bignum` · 도식 안 주석 `.m-note` · 메모 `.m-memo` · 도식 아래 한 줄 `.m-caption` · 그래프 제목(도식 위 `.s-label`) 중 하나. 같은 방식은 한 덱에 두 번까지.
- 문장에 화살표 글자(→) ✗(전후 수치 `12 → 21`만).

## 4. 부품 고르기

- 정보 모양에서 출발한다: 숫자 하나 = 큰 숫자 · 아이콘 숫자 / 비교 = 전후 · 성적표 두 장 · O/X 표 / 순서 = 단계 · 로드맵 · 진행 단계 / 시간 = 타임라인 · 주간 계획 · 달력 · 수업 시간 띠 / 비율 = 도넛 · 쌓인 막대 · 와플 / 묶음 = 아이콘 격자 · 갈래 나누기 · 사분면 / 말 = 대화 · 말풍선 인용 · 후기 / 운영 = 체크리스트 · 질문과 답 / 혜택 = 쿠폰.
- **사진 장을 뺀 내지의 절반 이상은 그림 도식**(`PROMPT-PARTS.md` 분류 '그림' — 내용 자체를 보여 주는 그림: 시험지 · 첨삭 답안 · OMR · 원 크기 비교 · 문장 분석 · 달력). 카드 · 단계 · 목록 · 질문과 답 · 표(분류 '정보')는 그림으로 보일 게 없을 때만. 쓰인 덱 주제가 가까운 그림 도식부터 본다.
- 대제목이 말하는 것을 도식이 그대로 보여야 한다. 남는 부품을 끼워 넣지 않는다. 그림의 세부(시험지 안 줄 · 막대 모양)도 말하지 않은 차이를 암시하지 않게.
- 마크업은 `PROMPT-PARTS.md`의 예를 구조째 본뜬다 — 자식 순서 · 클래스 · `data-*` 속성을 바꾸지 않고 글 · 값만 바꾼다. 항목 개수는 예와 같게(±1) — 크게 줄이면 도식이 작아지고 늘리면 넘친다. 항목이 둘뿐이면 다른 부품(전후 비교 · 카드 둘)을 고른다.
- 문장 분석(`.m-sentence`) 같은 한 줄 문장 도식은 문장을 25자 안쪽으로. 번호 속성(`data-now` 등)은 1부터 센다. 칸 크기(`w12 h2 bare` 등)도 예에 있는 것을 쓴다.
- 아이콘(`<i data-icon="이름">`)은 이 85개 중에서만: bulb chart check heart star chat target doc book clock people cap rocket megaphone pencil trophy search flask globe calc gift loop branch compass house school flag medal crown trend clipboard note hourglass pin phone laptop shield stairs seedling key brain coin exam family quote bell calendar microscope atom headphones mic folder envelope ruler backpack alarm magnet tablet lightning palette music puzzle pie stopwatch board bus building apple hand percent ticket question smile sun moon video user lock glasses lamp eraser brush map ball books.

## 5. 마지막 점검 (쓰고 나서 스스로)

1. 모든 내지에 머리(목차 표시 + 대제목)가 있고 부연설명이 없다. 대본이 있으면 장마다 `data-beat` · `aside.s-notes`가 있고 꼭지 순서가 맞다.
2. 요청에 없는 숫자 · 후기 · 이름을 지어 넣지 않았다.
3. 같은 주 도식 세 번 이상 · 옆 장 연속이 없다.
4. 사진 자리 장이 2~4장이다.
5. 장마다 메인 강조가 한 곳이다.
6. 쓴 클래스가 모두 `PROMPT-PARTS.md`에 있다.
