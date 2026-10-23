# 설명회 덱 부품 마크업 (자동 생성 — 손으로 고치지 않는다)

`node scripts/slide-prompt.mjs`가 예시 덱에서 부품마다 실제로 쓰인 마크업 하나를 뽑은 표다. 덱을 쓸 때 이 마크업을 그대로 본떠 글자만 바꾼다 — 여기 없는 클래스는 만들지 않는다. 많이 쓰인 순서. 머리의 괄호 = (분류 · 예시 덱에서 쓰인 횟수 · 쓰인 덱 주제). 분류: **그림** = 내용 자체를 보여 주는 그림 도식(시험지 · 첨삭 답안 · 원 비교 · 문장 분석 …) · **정보** = 무난한 카드 · 단계 · 목록 · 표 · **사진** = 사진 자리. 사진 장을 뺀 내지의 절반 이상을 그림 도식으로 — 쓰인 덱 주제가 이번 주제와 가까운 그림 도식부터 본다.

## section.s-section (50 · korean admission apply coding credit csat)
`.s-section-num`

```html
<section class="slide s-section"><p class="s-section-num">PART 1</p><h2 class="s-section-title">논술은 이렇게 채점해요</h2><p class="s-section-sub">글솜씨보다 먼저 보는 것을 보여 드릴게요</p></section>
```

## .m-review (정보 · 42 · korean apply credit csat csat-eng history)
`.m-review`(`.s-stars` · `blockquote` · `.s-who` — 칸 2~3개로 나란히 · 별은 48px · 별 사이 0(평점 `.m-rating` 별은 56px,) · `.m-chips`(`span[.accent|.soft]`) · `.m-scale` > `.s-scale-row`(등급 눈금) + `p` · `.m-profile`(`.s-avatar` > 아이콘 또는 `img` · `.s-label` · `.s-h` · `p`) · `.m-dialog`(`div[.me]` > 아이콘 + `.s-say`) · `.m-pyramid`(위에서부터…

```html
<div class="s-m w4 h2"><div class="m-review"><p class="s-stars">★★★★★</p><blockquote>플래너를 먼저<br>보여 줘요</blockquote><p class="s-who">중1 학부모 · 1년째</p></div></div>
```

## .m-iconstat (정보 · 30 · korean admission coding entry essay perf)
`.m-iconstat`(아이콘 · `.s-big` · `.s-h` · `p`). → 칸용 조각 32종.

```html
<div class="s-m w4 h2"><div class="m-iconstat"><i data-icon="pencil"></i><p class="s-big">1:1</p><p class="s-h">과제 첨삭</p><p>제출 전 한 번 더</p></div></div>
```

## section.s-cover (25 · korean admission apply coding credit csat)
`.s-cover-text`(`.s-cover-tag` · `.s-cover-title` · `.s-cover-sub`) + `.s-cover-visual > .s-cover-icon > <i data-icon>` | 제목 2줄, 태그 · 제목은 왼쪽 위 · 부연설명 두 줄은 왼쪽 아래(학원 · 날짜 줄은 뺐다), 오른쪽 메인 면엔 주제 아이콘 하나를 기울여 크게 경계에 걸침(키워드 글자 ✗, |

```html
<section class="slide s-cover"><div class="s-cover-text"><p class="s-cover-tag">2027 고1 수능 영어 학부모 설명회</p><h1 class="s-cover-title">내신은 되는데<br><span class="hl">모의고사는 2등급</span>인 이유</h1><p class="s-cover-sub">90점까지 남은 8점,<br>어디서 찾는지 보여 드릴게요</p></div><div class="s-cover-visual"><span class="s-cover-icon"><i data-icon="globe"></i></span></div></section>
```

## .s-cta (25 · korean admission apply coding credit csat)
`.s-cta` > `.s-action` + `.s-contact` > `div`(`<i data-icon>` + `div`(`.s-label` · `.s-h`)) | 행동 하나 + 연락처 2~3칸 |

```html
<section class="slide"><header class="s-head"><h2 class="s-title">첫걸음은 역사 진단 한 번이에요</h2><p class="s-sub">30분이면 지금 수준과 1년 순서를 알려 드려요</p></header><div class="s-body"><div class="s-cta"><p class="s-action">무료 역사 진단 신청하기</p><div class="s-contact"><div><i data-icon="phone"></i><div><span class="s-label">상담 전화</span><p class="s-h">02-000-0000</p></div></div><div><i data-icon="clock"></i><div><span class="s-label">상담 시간</span><p class="s-h">평일 오후 2시부터</p></div></div><div><i data-icon="gift"></i><div><span class="s-label">오늘 신청하면</span><p class="s-h">연표 카드 증정</p></div></div></div></div></div></section>
```

## 보조 글 .m-memo (22 · korean csat csat-eng essay history perf)
`.m-memo`)

```html
<div class="s-grid"><div class="s-m w12 h2 bare"><div class="m-photowide"><div class="m-frame"><figure class="m-photo" data-kind="수업 사진" data-hint="가로 5 : 2"></figure></div></div><p class="m-memo"><b>한 반 10명</b>자료마다 한 명씩 설명</p></div></div>
```

## 보조 글 .m-caption (22 · korean apply coding jeongsi math phonics)

```html
<div class="s-grid"><div class="s-m w12 h2 bare"><div class="m-line" data-labels="2024년|2025년|2026년" data-values="71,66,62" data-unit="점"></div><p class="m-caption">가온고 고1 1학기 중간고사 평균 · 자료 해석 문항이 늘었어요</p></div></div>
```

## .m-coupon (정보 · 21 · admission apply coding credit csat csat-eng)
`.m-coupon`(혜택 쿠폰 — 흰 쿠폰 한 장, 안쪽 파란 면 없이 `.m-cp-main`(`.s-label` · `.s-big` 메인 큰 글자) + `.m-cp-body`(`.s-h` · `p` 짝, 짝마다 체크 동그라미 · 구분선 자동), 점선 · 홈 자동, 상자 없는 큰 칸). → 칸용 조각 48종.

```html
<div class="s-m w12 h2 bare"><div class="m-coupon"><div class="m-cp-main"><p class="s-label">오늘 신청하면</p><p class="s-big">무료</p></div><div class="m-cp-body"><p class="s-h">대학별 환산 점수표</p><p>관심 대학 5곳까지</p><p class="s-h">원서 조합 1차 상담</p><p>성적 발표 주에 40분</p></div></div></div>
```

## .m-faq (정보 · 15 · korean apply csat csat-eng essay history)
`.m-faq`(짝마다 `.m-q` · `.s-h` 질문 · `.m-a` · `p` 답, 2짝까지)

```html
<div class="s-m w8 h2 bare"><div class="m-faq"><div><span class="m-q">Q</span><p class="s-h">문법 수업은 따로 안 하나요?</p><span class="m-a">A</span><p>말하다 틀린 문장으로 문법을 짚어요.</p></div><div><span class="m-q">Q</span><p class="s-h">내성적인 아이도 괜찮을까요?</p><span class="m-a">A</span><p>짝 한 명과 먼저 말해서 부담이 적어요.</p></div></div></div>
```

## .m-feature (정보 · 15 · math science grid)
`.m-feature`(아이콘 + 이름 + 한 줄)

```html
<div class="s-m w4 h2 accent"><div class="m-feature"><i data-icon="hourglass"></i><div><span class="s-label">시간이 모자라요</span><p class="s-h">진도가 너무 빨라요</p><p>한 학기 만에<br>수학(상)을 다 나가요</p></div></div></div>
```

## .s-dialog (정보 · 13 · korean apply credit csat csat-eng history)
`.s-dialog` > `div[.me]`(`<i data-icon>` + `.s-say`(`.s-label` · `p`), 말은 24pt — | 대화 2~3줄(24pt라 4줄은 넘침), 한 줄 22자 안팎 |

```html
<section class="slide"><header class="s-head"><p class="s-index">학부모님의 고민</p><h2 class="s-title">상담은 늘 이렇게 시작해요</h2></header><div class="s-body"><div class="s-dialog"><div><i data-icon="family"></i><div class="s-say"><span class="s-label">학부모님</span><p>학원은 다 다니는데 성적이 그대로예요.</p></div></div><div class="me"><i data-icon="school"></i><div class="s-say"><span class="s-label">담당 선생님</span><p>혼자 복습하는 시간은 얼마나 되나요?</p></div></div><div><i data-icon="family"></i><div class="s-say"><span class="s-label">학부모님</span><p>숙제만 겨우 하고 끝나요.</p></div></div></div></div></section>
```

## ul.m-checkbox (정보 · 12 · korean coding credit csat-eng midterm money)

```html
<div class="s-m w8 h2 bare"><ul class="m-checkbox"><li class="on"><p class="s-h">2주 안 마감 과제</p><p>칸반에 옮겨 적기</p></li><li class="on"><p class="s-h">기준표 빠진 칸</p><p>제출 전 한 번 더</p></li><li><p class="s-h">학부모님 주간 문자</p><p>이번 주 마감과 진행</p></li></ul></div>
```

## .s-quote (정보 · 12 · admission coding entry essay jeongsi math)
`.s-quote`(따옴표 · 인용 글은 풍선 왼쪽 위, 잉크 기준 네 곳 약 76 · 말한 사람 줄은 풍선에서 72px 아래 —. 검사가 잡는다. 1/3 칸 도넛은 글이 아래로, 전체 칸 인용은 가운데로 자동.

```html
<section class="slide"><header class="s-head"><p class="s-index">학부모님의 고민</p><h2 class="s-title">상담에서 가장 많이 듣는 질문이에요</h2></header><div class="s-body"><div class="s-quote"><div class="s-bubble"><span class="s-qmark"><i data-icon="quote"></i></span><blockquote>내신이랑 모의고사,<br>둘 다 하려니 둘 다 어중간해요.</blockquote><span class="s-tail"></span></div><p class="s-who"><i data-icon="people"></i><span>고2 학부모 · 지난 학기 상담에서</span></p></div></div></section>
```

## .m-rating (그림 · 12 · admission coding entry essay math perf)
`.m-rating` 별은 56px,)

```html
<div class="s-m w8 h2 bare"><div class="m-rating"><div class="m-num"><p class="s-big hl">4.9</p><p class="m-stars">★★★★★</p><p>5점 만점</p></div><div class="m-dist"><div style="--v:88"><span>5점</span><p>88%</p></div><div style="--v:9"><span>4점</span><p>9%</p></div><div style="--v:3"><span>3점</span><p>3%</p></div><div style="--v:0"><span>2점</span><p>0%</p></div><div style="--v:0"><span>1점</span><p>0%</p></div></div></div></div>
```

## .m-hbars (그림 · 11 · korean entry essay reading sci-high speaking)
`.m-hbars[data-unit]`(막대 2 ~ 3개뿐이면 `.s-m.bare` — 흰 상자 없이 배경 위 굵은 막대 168px, 빈 트랙은 옅은 회색 띠 · 채움은 흰 막대, · `.m-list`(`li[.accent]` 아이콘/체크 + `.s-row-text` [+ `.s-value`]) · `.m-quote`(`.s-qmark` · `blockquote` · `.s-who`) · `.m-steps`(번호 + 이름, 화살표 자동) · `.m-feature`(아이콘 + 이름 + 한 줄) · `.m-meter[style="--v"]`(이름 · 값 · 막대 · 설명…

```html
<div class="s-m w12 h2"><div class="m-hbars" data-unit="%"><div style="--v:34">3월</div><div style="--v:57">7월</div><div style="--v:76" class="accent">11월</div></div><p class="m-memo"><b>34%에서 76%로</b>문제를 끝까지 읽게 됐어요</p></div>
```

## .m-bars (그림 · 11 · apply coding math midterm perf sci-high)
`.m-bars[data-unit]`(`div[style="--v"][.accent]` 이름, 칸 높이를 다 쓰는 세로 막대 — 값은 막대 꼭대기 바로 위, · `.m-hbars[data-unit]`(막대 2 ~ 3개뿐이면 `.s-m.bare` — 흰 상자 없이 배경 위 굵은 막대 168px, 빈 트랙은 옅은 회색 띠 · 채움은 흰 막대, · `.m-list`(`li[.accent]` 아이콘/체크 + `.s-row-text` [+ `.s-value`]) · `.m-quote`(`.s-qmark` · `blockquote` · `.s-who`) · `.m-steps`(…

```html
<div class="s-m w12 h2 bare"><div class="m-bars" data-unit="개" data-trend=""><div style="--v:12">2025 2학기</div><div style="--v:18">2026 1학기</div><div style="--v:26" class="accent">2026 2학기</div></div></div>
```

## ul.m-list (정보 · 10 · math science grid)
`.m-list`(`li[.accent]` 아이콘/체크 + `.s-row-text` [+ `.s-value`])

```html
<div class="s-m w6 h2 accent"><span class="s-label">고등학교 수학</span><ul class="m-list"><li><i class="s-check"></i><div class="s-row-text"><p class="s-h">서술형이 40%</p></div></li><li><i class="s-check"></i><div class="s-row-text"><p class="s-h">처음 보는 응용 문제</p></div></li><li><i class="s-check"></i><div class="s-row-text"><p class="s-h">범위가 두 배</p></div></li></ul></div>
```

## .m-line (그림 · 9 · admission credit csat csat-eng history midterm)
`.m-line`(꺾은선 추이 — `data-labels="2024년|2025년|2026년"` · `data-values="71,66,62"` · `data-unit`, 점은 흰 원(마지막만 메인 테두리 · 메인 값), 잇는 선만 SVG, 상자 없는 칸 — 해마다 변화 · 휑하지 않게 선 아래 옅은 메인 면 + 점마다 축까지 점선, `data-gain="3월보다"`면 왼쪽 위 흰 칩에 첫 값 → 마지막 값 차이(+29%p), 폭 1440 · 높이 380, · `.m-lab`(탐구 보고서 — 공책 종이, `.s-label` 보고서 제목 + `p[data-k="가설"]`…

```html
<div class="s-m w12 h2 bare"><div class="m-line" data-labels="3월|4월|5월|6월" data-values="30,52,74,92" data-unit="분" data-gain="3월보다"></div></div>
```

## .m-weekplan (정보 · 8 · entry history math sci-high science study)
`.m-weekplan`(주간 계획 — 요일 `.m-wd`는 카드 안 맨 위 칩(본문 크기 18pt — 15pt는 작아 보임, 월 → 월요일 자동, 잇는 선 ✗, + `.m-task`(`<i data-icon>` · `.s-h` · `p`) 세로 흰 카드 5칸, 강조 요일 `.accent`) · `.m-loop`(공부 순환 — 칸 `div` 4개 시계 방향, 번호 · 가운데 원형 순환 화살표 자동). → 칸용 조각 40종.

```html
<div class="s-m w12 h2 bare"><div class="m-weekplan"><div><p class="m-wd">월</p><div class="m-task"><i data-icon="bulb"></i><p class="s-h">개념 그림</p><p>막대 · 수직선</p></div></div><div><p class="m-wd">수</p><div class="m-task"><i data-icon="pencil"></i><p class="s-h">문장제 풀이</p><p>문장 나눠 읽기</p></div></div><div class="accent"><p class="m-wd">금</p><div class="m-task"><i data-icon="exam"></i><p class="s-h">주간 테스트</p><p>결과 문자</p></div></div></div></div>
```

## .m-climb (그림 · 7 · csat-eng history math science speaking study)
`.m-climb`(성장 계단 — 때마다 카드 `div[style="--h:42"]` 높이 %, `.s-big` 등급(24pt) · `.s-h` 때 · `p` 한 줄, 마지막 `.accent`, 상자 없는 큰 칸 `s-m w12 h2 bare` — 등급 · 점수가 오른 과정, 카드 글은 가로 가운데 정렬) → 49종. 새 클래스는 스튜디오 화면 이름(`.top` 등)과 겹치지 않게 `m-` 접두사로.

```html
<div class="s-m w12 h2 bare"><div class="m-climb"><div style="--h:62"><p class="s-big">62점</p><p class="s-h">3월</p><p>첫 진단</p></div><div style="--h:72"><p class="s-big">71점</p><p class="s-h">4월</p><p>이어 말하기</p></div><div style="--h:84"><p class="s-big">83점</p><p class="s-h">5월</p><p>수행평가</p></div><div style="--h:100" class="accent"><p class="s-big">92점</p><p class="s-h">6월</p><p>1분 발표</p></div></div></div>
```

## .m-stepper (정보 · 6 · admission entry jeongsi phonics social)
`.m-stepper[data-now]`(진행 단계 — 단계 `div`(`.s-h` · `p`), 지난 단계 체크 · 지금 단계 테두리 원 · 선 자동)

```html
<div class="s-m w12 h2 bare"><div class="m-stepper" data-now="1"><div><p class="s-h">설명회</p><p>오늘</p></div><div><p class="s-h">소리 진단</p><p>20분 · 무료</p></div><div><p class="s-h">결과 상담</p><p>15분</p></div><div><p class="s-h">첫 수업</p><p>1월 첫 주</p></div></div></div>
```

## .m-branch (그림 · 6 · coding jeongsi math science thinking)
`.m-branch`(갈래 나누기 — `.m-root`(`.s-h` · `p`) + `.m-leaves > div[.accent]` 2~4개, 잇는 선 자동, 상자 없는 큰 칸)

```html
<div class="s-m w12 h2 bare"><div class="m-branch"><div class="m-root"><p class="s-h">코딩 진단</p><p>순서 · 반복 · 조건 30분</p></div><div class="m-leaves"><div><p class="s-h">블록반</p><p>처음 시작</p></div><div class="accent"><p class="s-h">파이썬반</p><p>블록을 해 본 아이</p></div><div><p class="s-h">프로젝트반</p><p>앱 만들기 집중</p></div></div></div></div>
```

## .m-scorecard (그림 · 6 · csat entry essay perf sci-high social)
`.m-scorecard`(성적표 두 장,, 깎인 줄 `.down` = 메인, data-v 없는 줄은 빈 선 + 회색 값), 둘째 카드 `.accent` = 라벨 · 총점 메인, 가운데 차이 동그라미 `data-gap`

```html
<div class="s-m w12 h2 bare"><div class="m-scorecard" data-gap="+12" data-gap-label="한 학기"><div><span class="s-label">1학기 수행평가</span><p class="s-big">26점</p><ul><li data-v="8/14" class="down"><span>보고서</span><b>8</b></li><li data-v="9/14"><span>발표</span><b>9</b></li><li data-v="9/12"><span>포트폴리오</span><b>9</b></li></ul></div><div class="accent"><span class="s-label">2학기 수행평가</span><p class="s-big">38점</p><ul><li data-v="13/14"><span>보고서</span><b>13</b></li><li data-v="14/14"><span>발표</span><b>14</b></li><li data-v="11/12"><span>포트폴리오</span><b>11</b></li></ul></div></div></div>
```

## .m-quad (정보 · 5 · korean reading speaking thinking)
`.m-quad`(숫자 넷 2×2, 하나 `.accent`)

```html
<div class="s-m w12 h2 bare"><div class="m-quad"><div class="accent"><p class="s-big">9<small>년</small></p><p class="s-h">초등 수학 지도</p></div><div><p class="s-big">6<small>명</small></p><p class="s-h">한 반 정원</p></div><div><p class="s-big">93<small>%</small></p><p class="s-h">재등록률</p></div><div><p class="s-big">120<small>명</small></p><p class="s-h">지난해 여름반</p></div></div></div>
```

## table.m-ox (정보 · 5 · korean jeongsi phonics reading)

```html
<div class="s-m w12 h2"><table class="m-ox"><tbody><tr><th>평가 방식</th><th>초등 6학년</th><th class="accent">중학교 1학년</th></tr><tr><td>독서록 · 감상문</td><td class="o"></td><td class="o"></td></tr><tr><td>논술형 지필 문항</td><td class="x"></td><td class="o"></td></tr><tr><td>주제 글쓰기 수행평가</td><td class="x"></td><td class="o"></td></tr></tbody></table></div>
```

## .s-roadmap (정보 · 5 · korean perf reading vocab)
`.s-roadmap.s-panel-box` > `div[.accent]` > `.s-when-text`(`.s-label` · `.s-h` · `p`) · 순환 `.s-cycle` > `div[.accent]`(`.s-num` · `.s-h` · `p`) + `div.s-return` > `span` | 로드맵 4~6 · 순환 3~4 |

```html
<section class="slide"><header class="s-head"><p class="s-index">커리큘럼</p><h2 class="s-title">한 학기를 네 단계로 챙겨요</h2></header><div class="s-body"><div class="s-roadmap cards"><div><div class="s-when-text"><span class="s-label">3월</span><p class="s-h">과목별 일정표</p><p>학교 공지 정리</p></div></div><div><div class="s-when-text"><span class="s-label">4월</span><p class="s-h">1차 과제</p><p>기준표 읽기</p></div></div><div class="accent"><div class="s-when-text"><span class="s-label">5월</span><p class="s-h">발표 · 보고서</p><p>리허설 두 번</p></div></div><div><div class="s-when-text"><span class="s-label">6월</span><p class="s-h">2차 과제</p><p>지필과 겹치지 않게</p></div></div></div></div></section>
```

## .m-matrix (그림 · 5 · korean jeongsi reading speaking)
`.m-matrix`(유형 사분면 — 빈칸 · 열 머리 `.m-axis` 2 · (줄 머리 + 칸 `div` 2 · 상자 없는 형은 폭 1560 · 칸 안쪽 64, 줄 · 열 이름은 한 줄(`<br>` ✗, · 칸 안 글과 열 이름은 가운데 정렬)×2, 칸 하나 `.accent`) · `.m-pict[data-v][data-of]`(사람 그림 n명 중 v명 + 안에 `.m-num` — 숫자가 둘이면 사람 그림만 `s-m w4 h2 bare`(배경 위, 회색 사람 한 단계 짙게)에 두고 숫자는 옆 칸 카드 둘로, 큰 흰 상자 하나로 감싸지 않는다, · `.m-dday`…

```html
<div class="s-m w12 h2 bare"><div class="m-matrix"><span></span><p class="m-axis">많이 읽어요</p><p class="m-axis">적게 읽어요</p><p class="m-axis">잘 써요</p><div class="accent"><p class="s-h">논술반</p><p>주장 글쓰기</p></div><div><p class="s-h">독서반</p><p>읽기 습관부터</p></div><p class="m-axis">쓰기가 어려워요</p><div><p class="s-h">문단반</p><p>한 문단 쓰기</p></div><div><p class="s-h">기초반</p><p>읽기 · 쓰기 함께</p></div></div></div>
```

## .m-icongrid (정보 · 5 · admission math science speaking)
`.m-icongrid`(아이콘 격자 3×2 — `<i data-icon>` · `.s-h`, 하나 `.accent`; 감싸는 상자 없이 `.bare` 칸에 칸마다 흰 카드, · `ul.m-checkbox > li[.on]`(체크리스트 — `.s-h` · `p`, 네모 체크 상자 자동) · `.m-coupon`(혜택 쿠폰 — 흰 쿠폰 한 장, 안쪽 파란 면 없이 `.m-cp-main`(`.s-label` · `.s-big` 메인 큰 글자) + `.m-cp-body`(`.s-h` · `p` 짝, 짝마다 체크 동그라미 · 구분선 자동), 점선 · 홈 자동, 상자 없는 큰…

```html
<div class="s-m w12 h2 bare"><div class="m-icongrid"><div><i data-icon="doc"></i><p class="s-h">학생부 분석</p></div><div><i data-icon="trend"></i><p class="s-h">내신 추이</p></div><div><i data-icon="exam"></i><p class="s-h">모의고사</p></div><div class="accent"><i data-icon="target"></i><p class="s-h">수능 최저</p></div><div><i data-icon="chat"></i><p class="s-h">면접 준비</p></div><div><i data-icon="compass"></i><p class="s-h">원서 조합</p></div></div></div>
```

## .m-month (그림 · 5 · admission apply midterm speaking)
`.m-month[data-start 첫날 요일 0=일][data-days][data-mark][data-soft]`(한 달 달력 자동 + `.m-legend` · 상자 없는 칸이어도 달력은 흰 종이 한 장 — 머리 줄 = 왼쪽 `p.m-month-title` 달 이름 · 오른쪽 범례, 점검 날은 옅은 메인 동그라미, · `.m-split[style="--a;--b"]`(두 비율 대비 — `div` 둘 `.s-h` · `.s-big`, 강조 쪽 `.accent`, 막대 자동) · `.m-timeband[data-unit]`(수업 시간 띠 — 눈금 선 · 점은 로드맵 …

```html
<div class="s-m w12 h2 bare"><div class="m-month" data-start="0" data-days="31" data-mark="28" data-soft="7,14,21"><p class="m-month-title">2027년 8월</p><p class="m-legend"><span><i></i>원서 확정</span><span><i class="soft"></i>점검 상담</span></p></div></div>
```

## .m-road (그림 · 5 · apply csat entry sci-high social)
`.m-road`(굽은 길 — `div(.s-label 때 · .s-h)[.accent]` ×5, 왼쪽 아래 → 오른쪽 위로 굽이치는 굵은 회색 길 + 이정표 점, 카드는 위 · 아래 번갈아) → 127종. 가로 막대 줄 이름은 한 줄로(5자 안쪽).

```html
<div class="s-m w12 h2 bare"><div class="m-road"><div><span class="s-label">12월</span><p class="s-h">개념 다시</p></div><div class="accent"><span class="s-label">2월</span><p class="s-h">기출 1회독</p></div><div><span class="s-label">4월</span><p class="s-h">기출 2회독</p></div><div><span class="s-label">6월</span><p class="s-h">모평 점검</p></div><div><span class="s-label">9월</span><p class="s-h">실전 모의</p></div></div></div>
```

## table.m-table (정보 · 5 · apply math sci-high thinking grid)
`.m-table`(4줄 안쪽, `tr.accent` — 큰 칸은 `.bare`로 비교 카드(`.m-tcols` 자동 — 첫 줄 = 항목 이름, 다음 줄마다 세로 카드, `tr.accent` = 메인 면), 상자 안에 둘 땐 머리 줄 배경색 띠 · 강조 줄 메인 옅은 띠 · 안쪽 여백 네 곳 64px)

```html
<div class="s-m w12 h2 bare"><table class="m-table"><tbody><tr><th></th><th>한 반 정원</th><th>풀이 첨삭</th><th>학부모 리포트</th></tr><tr class="accent"><td>우리 학원</td><td>6명</td><td>매시간</td><td>매주</td></tr><tr><td>대형 학원</td><td>15명</td><td>주 1회</td><td>한 달에 한 번</td></tr></tbody></table></div>
```

## .m-steps (정보 · 5 · apply credit midterm grid)
`.m-steps`(번호 + 이름, 화살표 자동)

```html
<div class="s-m w12 h2 bare"><div class="m-steps"><div><span class="s-num">1</span><p class="s-h">진로 검사</p><p>관심 분야 찾기</p></div><div><span class="s-num">2</span><p class="s-h">성적 진단</p><p>강한 과목 보기</p></div><div class="accent"><span class="s-num">3</span><p class="s-h">과목 추천</p><p>진로별 꾸러미</p></div><div><span class="s-num">4</span><p class="s-h">시간표 확정</p><p>학교 신청 전</p></div></div></div>
```

## .m-polaroid (사진 · 5 · apply entry jeongsi money)
`.m-polaroid`(폴라로이드 셋 — 카드 530 · 사진 4 : 3(높이 368) + 아래 한 줄, 세 장 같은 높이로 나란히 — 가운데만 내리면 크기가 달라 보임,

```html
<div class="s-m w12 h2 bare"><div class="m-polaroid"><div><figure class="m-photo" data-kind="상담 사진" data-hint="가로 4 : 3"></figure><p>성적표 진단</p></div><div><figure class="m-photo" data-kind="상담 사진" data-hint="가로 4 : 3"></figure><p>갈래 정하기</p></div><div><figure class="m-photo" data-kind="상담 사진" data-hint="가로 4 : 3"></figure><p>원서 조합</p></div></div></div>
```

## .m-timeband (정보 · 5 · credit math phonics reading)
`.m-timeband[data-unit]`(수업 시간 띠 — 눈금 선 · 점은 로드맵 카드형과 같게(선 8px · 점 44 테두리 8, 끝 화살표 없음, · `div[style="--v"][.accent]` 이름 24pt · 분 18pt, 누적 눈금 자동, `s-m w12 bare` 한 줄 칸에 구간마다 흰 카드 / 큰 칸(`s-m w8 h2 bare` + 왼쪽 상자 없는 큰 숫자 `w4 h2 bare`, 또는 `w12 h2 bare`)이면 구간 카드에 `.s-h` 이름 · `p.s-big` 기간(숫자 · 단위 같은 크기) · `p` 하는 일 — 아이콘은 넣지 않는…

```html
<div class="s-m w12 h2 bare"><div class="m-timeband" data-unit="주"><div style="--v:3"><p class="s-h">개념 완성</p><p class="s-big">3<small>주</small></p><p>다항식 · 방정식</p></div><div style="--v:3" class="accent"><p class="s-h">유형 훈련</p><p class="s-big">3<small>주</small></p><p>단원별 대표 유형</p></div><div style="--v:2"><p class="s-h">실전 서술형</p><p class="s-big">2<small>주</small></p><p>풀이 쓰기 · 첨삭</p></div></div></div>
```

## .m-teacher (사진 · 5 · csat entry money social)
`.m-teacher`(세로 4 : 5 액자 + 약력 카드 — `.s-label` · `.s-h` 이름 64 · `ul > li > i` 점 + 한 줄)

```html
<div class="s-m w12 h2 bare"><div class="m-teacher"><div class="m-frame"><figure class="m-photo" data-kind="강사 사진" data-hint="세로 4 : 5"></figure></div><div class="m-tc-info"><span class="s-label">수능 국어 · 수학 담당</span><p class="s-h">김○○ 원장</p><ul><li><i></i>고3 수능 지도 13년</li><li><i></i>평가원 기출 13개년 분석</li><li><i></i>매달 모의고사 성적 상담</li></ul></div></div></div>
```

## .m-timeline (정보 · 5 · essay math money science grid)
`.m-timeline`(때 · 점 · 이름 · 한 줄, 4개 안쪽)

```html
<div class="s-m w12 h2 bare"><div class="m-timeline"><div><p class="s-value">12월</p><p class="s-h">개념 다지기</p><p>물질 · 힘 · 에너지</p></div><div class="accent"><p class="s-value">1월</p><p class="s-h">자료 해석</p><p>그래프 · 표 읽기</p></div><div><p class="s-value">2월</p><p class="s-h">탐구 서술</p><p>보고서 네 줄</p></div><div><p class="s-value">3~4월</p><p class="s-h">내신 대비</p><p>학교별 기출</p></div></div></div>
```

## .m-dday (그림 · 4 · korean admission credit)
`.m-dday`(`.m-cal` > `.m-cal-top` 달 · `.m-cal-day` 날 + `.m-num` · 달력 묶음 `.m-dday.m-pad` > `.m-cal-pad`(`i.m-cal-page` 둘 + `.m-cal`에 `i.m-cal-ring` 둘) — 달력 뒤로 남은 장이 겹치고 위에 고리, 오른쪽 글 아래 `.m-left`(양 끝만 '지금 → 목표' 트랙), 달 이름을 늘어놓지 않는다 · 날 글자는 100px(64 작음 · 136 큼)(그림 안 숫자라 크기 규칙 예외))

```html
<div class="s-m w12 h2 bare"><div class="m-dday"><div class="m-cal"><p class="m-cal-top">7월</p><p class="m-cal-day">21</p></div><div class="m-num"><p class="s-big hl">D-42</p><p class="s-h">2학기 개학까지 6주</p><p>7월 21일 개강 · 주 3회 120분</p><div class="m-days"><span class="on">월</span><span>화</span><span class="on">수</span><span>목</span><span class="on">금</span><span>토</span><span>일</span></div></div></div></div>
```

## .m-split (정보 · 4 · korean coding reading)
`.m-split[style="--a;--b"]`(두 비율 대비 — `div` 둘 `.s-h` · `.s-big`, 강조 쪽 `.accent`, 막대 자동)

```html
<div class="s-m w12 h2 bare"><div class="m-split" style="--a:60;--b:40"><div class="accent"><p class="s-h">A 성취도</p><p class="s-big">60<small>%</small></p></div><div><p class="s-h">B 이하</p><p class="s-big">40<small>%</small></p></div><p class="m-note"><i></i><span>30명 중 18명 · 대부분 여름반</span></p></div></div>
```

## .m-stack (그림 · 4 · admission math study grid)
`.m-stack`(쌓인 막대 + 범례 — 큰 칸은 `.s-m.w12.h2.bare`: 막대 144px(200은 투박, 배경 위 · 비율은 막대 위 · 이름은 막대 아래, 둘 다 조각 시작선에 맞춤(칸 폭 = 조각 폭, main.js `--cols` · `.m-stack-vals`) · 무엇의 비율인지(기준)는 그래프 제목이라 아래 한 줄 대신 맨 위 `.s-label` — 제목 색 · 24pt · 가운데, 메인 ✗, 한 장 `.s-stack`도 상자(`.s-panel-box`) 없이 같게) · `.m-names`(이름 타일 10명 안쪽).

```html
<div class="s-m w12 h2 bare"><div class="m-stack"><div class="s-stackbar"><span style="--v:22"></span><span style="--v:22"></span><span style="--v:56"></span></div><div class="s-legend"><div><i></i><p class="s-h">직접 문제 풀기</p><p class="s-value">40분</p></div><div><i></i><p class="s-h">필기 옮겨 쓰기</p><p class="s-value">40분</p></div><div><i></i><p class="s-h">인강 · 수업 듣기</p><p class="s-value">100분</p></div></div></div></div>
```

## .m-equation (그림 · 4 · coding science thinking vocab)
`.m-equation`(곱셈식 — 흰 카드 `div`(`.s-big` · `.s-h`) 사이 `span.m-op`(× · =), 마지막 답 카드 `.accent`만 메인, 상자 없는 칸 — 시간 · 양을 계산으로, · `.m-bricks`(벽돌 피라미드 — 위 → 아래 `div[.accent]` > `.s-h`, 줄마다 둥근 블록 1 · 2 · 3 · 4개(main.js), 이름은 오른쪽 옆, 맨 위 줄만 메인, 상자 없는 칸 — '쌓인다'를 블록 개수로, 사다리꼴 피라미드보다 우선,도 벽돌로: 이름 뒤 `<span class="s-value">2권</span>`,…

```html
<div class="s-m w12 h2 bare"><div class="m-equation"><div><p class="s-big">16<small>주</small></p><p class="s-h">한 학기</p></div><span class="m-op">×</span><div><p class="s-big">2<small>회</small></p><p class="s-h">한 주</p></div><span class="m-op">=</span><div class="accent"><p class="s-big">32<small>회</small></p><p class="s-h">수업 · 앱 3개 완성</p></div></div></div>
```

## .m-waffle (그림 · 4 · credit jeongsi social speaking)
`.m-waffle`(100칸 — `div[style="--v"][.accent]` > `.s-h` · `p`, 10 × 10칸 강조 묶음 메인 · 나머지 흰 칸, 오른쪽 범례 · 점수)

```html
<div class="s-m w12 h2 bare"><div class="m-waffle"><div style="--v:40"><p class="s-h">내용</p><p>무엇을 말하나</p></div><div style="--v:60" class="accent"><p class="s-h">어떻게 말하나</p><p>유창성 · 발음 · 태도</p></div></div></div>
```

## .m-bookfeat (사진 · 4 · csat entry social)
`.m-bookfeat`(표지 3 : 4 + 뒤에 겹친 책 한 장 `i` + 특징 카드 셋)

```html
<div class="s-m w12 h2 bare"><div class="m-bookfeat"><div class="m-bk"><i></i><figure class="m-photo" data-kind="교재 표지 사진" data-hint="세로 3 : 4"></figure></div><div class="m-bk-feat"><div><i data-icon="book"></i><p class="s-h">한글 따라 쓰기</p><p>자모부터 짧은 문장까지</p></div><div><i data-icon="calc"></i><p class="s-h">10칸 틀 수 세기</p><p>날마다 한 쪽</p></div><div><i data-icon="pencil"></i><p class="s-h">받아쓰기 급수표</p><p>1급부터 5급까지</p></div></div></div></div>
```

## .m-names (정보 · 4 · essay history sci-high grid)
`.m-names`(이름 타일 10명 안쪽).

```html
<div class="s-m w12 h2 bare"><div class="m-names"><div class="accent"><p class="s-h">김○○</p><p>영재학교</p></div><div><p class="s-h">이○○</p><p>과학고</p></div><div><p class="s-h">박○○</p><p>과학고</p></div><div><p class="s-h">최○○</p><p>영재학교</p></div><div><p class="s-h">정○○</p><p>과학고</p></div><div><p class="s-h">강○○</p><p>과학고</p></div><div><p class="s-h">조○○</p><p>영재학교</p></div><div><p class="s-h">윤○○</p><p>과학고</p></div><div><p class="s-h">장○○</p><p>과학고</p></div></div></div>
```

## .m-loop (정보 · 4 · math midterm reading)
`.m-loop`(공부 순환 — 칸 `div` 4개 시계 방향, 번호 · 가운데 원형 순환 화살표 자동). → 칸용 조각 40종.

```html
<div class="s-m w8 h2 bare"><div class="m-loop"><div><p class="s-h">교과서 읽기</p></div><div><p class="s-h">문제 풀기</p></div><div class="accent"><p class="s-h">오답 정리</p></div><div><p class="s-h">다시 설명하기</p></div></div></div>
```

## 보조 글 .m-note (4 · korean coding reading)
`.m-notes`(붙임쪽지 — `div[.accent]`(`.s-h` 낱말 64 · `p` 과목) ×6, 흰 쪽지 3 × 2 + 위 가운데 회색 테이프, 가운데 줄은 14px 내려 붙임, 쪽지 240 + 위 18 더 띄워 낱말이 테이프에 붙지 않게 — 아이가 물어본 말 · 모아 둔 낱말)

```html
<div class="s-grid"><div class="s-m w12 h2 bare"><div class="m-split" style="--a:60;--b:40"><div class="accent"><p class="s-h">A 성취도</p><p class="s-big">60<small>%</small></p></div><div><p class="s-h">B 이하</p><p class="s-big">40<small>%</small></p></div><p class="m-note"><i></i><span>30명 중 18명 · 대부분 여름반</span></p></div></div></div>
```

## .m-orbs (그림 · 3 · korean csat-eng study)
`.m-orbs`(원 크기 비교,. 원 넓이 = 값, 첫 묶음 원 = 메인 면, 나머지 = 흰 원, 이름 줄은 한 높이) → 53종. `.m-goal`은 이름표를 트랙 기준으로 놓고, 목표 85 이상 · 차이 25 이상이면 목표 이름표를 점 왼쪽에(칸 밖 잘림 방지).

```html
<div class="s-m w12 h2 bare"><div class="m-orbs" data-cols="3월에 시작한 중1|같은 학생의 첫 중간고사" data-unit="명"><div data-v="30" data-col="0"><p class="s-h">자기주도반</p></div><div data-v="22" data-col="1" class="hl"><p class="s-h">80점 이상</p></div><div data-v="8" data-col="1"><p class="s-h">80점 미만</p></div></div></div>
```

## .m-podium (그림 · 3 · korean reading)
`.m-podium`(순위 단상 — 상자 없는 형은 폭 1360 · 단 높이 290/400/210 · 퍼센트도 24pt, 1위 퍼센트는 메인 · 2위 · 1위 `.accent` · 3위 순서, 각 `.s-h` · `p` · `.m-block` 순위 숫자)

```html
<div class="s-m w12 h2 bare"><div class="m-podium"><div><p class="s-h">문단 구조</p><p>31%</p><p class="m-block">2</p></div><div class="accent"><p class="s-h">근거 없는 주장</p><p>46%</p><p class="m-block">1</p></div><div><p class="s-h">맞춤법</p><p>23%</p><p class="m-block">3</p></div></div></div>
```

## .m-sentence (그림 · 3 · korean thinking)
`.m-sentence > p.m-sent`(문장 분석 — 역할 낱말 `span[data-role][.hl]`, 밑줄 · 역할 이름 자동, 상자 없는 칸이면 문장 크기 흰 카드 + 아래 `p` 한 줄)

```html
<div class="s-m w12 h2 bare"><div class="m-sentence"><p class="m-sent"><span data-role="전체">사탕 24개를</span><span data-role="나누는 수">6명에게</span> 나누면 <span data-role="묻는 것" class="hl">한 명에 몇 개</span>?</p><p>무엇을 몇으로 나누는지 보이면 식이 나와요</p></div></div>
```

## .m-goal (그림 · 3 · korean reading)
`.m-goal[style="--now;--goal"]`(목표 트랙 — `.m-now` · `.m-to`(`b` 점수) · `.m-gap`, 트랙 자동)

```html
<div class="s-m w12 h2 bare"><div class="m-goal" style="--now:20;--goal:100"><p class="m-now">겨울방학 전<b>120자</b></p><p class="m-to">8주 뒤<b>600자</b></p><p class="m-gap">+480자</p><p class="m-say">이제 먼저 쓰겠다고 해요<small>6학년 학부모</small></p></div></div>
```

## .m-ba (정보 · 3 · admission science)
`.m-bars[data-unit]`(`div[style="--v"][.accent]` 이름, 칸 높이를 다 쓰는 세로 막대 — 값은 막대 꼭대기 바로 위, · `.m-hbars[data-unit]`(막대 2 ~ 3개뿐이면 `.s-m.bare` — 흰 상자 없이 배경 위 굵은 막대 168px, 빈 트랙은 옅은 회색 띠 · 채움은 흰 막대, · `.m-list`(`li[.accent]` 아이콘/체크 + `.s-row-text` [+ `.s-value`]) · `.m-quote`(`.s-qmark` · `blockquote` · `.s-who`) · `.m-steps`(…

```html
<div class="s-m w12 h2 bare"><div class="m-ba"><span class="s-label">중학교 방식</span><span class="s-label">우리 수업</span><p>용어를 외워요</p><p>원리를 말로 설명해요</p><p>그래프를 건너뛰어요</p><p>축부터 읽어요</p><p>정답만 골라요</p><p>근거를 한 줄 써요</p></div></div>
```

## .m-photostat (사진 · 3 · apply jeongsi)
`.m-photostat`(가로 액자 + 메인 카드 큰 숫자 · 이름 · 한 줄)

```html
<div class="s-m w12 h2 bare"><div class="m-photostat"><div class="m-frame"><figure class="m-photo" data-kind="정시 상담실 사진" data-hint="가로 3 : 2"></figure></div><div class="m-ps-card"><p class="s-big">12년</p><p class="s-h">정시 원서 상담</p><p>해마다 12월 한 달</p></div></div></div>
```

## .m-halfring (그림 · 3 · credit money perf)
`.m-halfring[data-a]`(반원 비율 — `div`(`.s-big` · `.s-h` · `p`) ×2, 반원 고리 왼쪽 회색 · 오른쪽 메인(SVG, 조각마다 모서리 26 둥글게 —, 이름은 두 끝 바깥) · `.m-twins`(두 학생 비교 — `div[.accent]`(`.s-big` 총점 · `.m-tw-bar > i[style="--v"]` 지필 · `i.hl` 수행 · `.m-tw-foot > .s-label` 이름), 같은 지필 위에 수행이 쌓인 세로 막대(조각 사이 28), 칸 310 × 2 — 등급 동그라미는 뺐다, · `.m-kanban`…

```html
<div class="s-m w12 h2 bare"><div class="m-halfring" data-a="60"><div><p class="s-big">60%</p><p class="s-h">지필 시험</p><p>중간 · 기말</p></div><div class="accent"><p class="s-big">40%</p><p class="s-h">수행평가</p><p>미리 준비 가능</p></div></div></div>
```

## .m-papers (그림 · 3 · csat science thinking)
`.m-papers`(시험지 두 장 — 세로 시험지 + 뒤에 겹친 한 장, 머리 = 시험 이름(`.s-label`) · 가는 선 한 줄, 번호 + 줄 하나 문항 한 단(미니멀, 글자 없이), 오른쪽 위 점수 도장(지름 220), + `p.m-paper-cap`, t = 글 문항 · c = 자료 문항(작은 막대 그래프) — 문항 종류 차이 · 아래 글(`.m-paper-cap`)은 덱이 그 내용을 말할 때만, 아니면 두 장 다 `t`로 중립, 두 번째 `.accent`는 도장만

```html
<div class="s-m w12 h2 bare"><div class="m-papers"><div class="m-paper" data-rows="t t t t t"><div class="m-sheet"><span class="s-label">중3 2학기 기말</span><p class="m-score">90점</p></div></div><div class="m-paper accent" data-rows="t t t t t"><div class="m-sheet"><span class="s-label">고1 첫 중간</span><p class="m-score">62점</p></div></div></div></div>
```

## .m-photowide (사진 · 3 · csat social)
`.m-photowide`(넓은 액자 한 장 1440 × 560 + 메모 겹치기 `.m-memo`)

```html
<div class="s-m w12 h2 bare"><div class="m-photowide"><div class="m-frame"><figure class="m-photo" data-kind="수업 사진" data-hint="가로 5 : 2"></figure></div></div><p class="m-memo"><b>한 반 10명</b>자료마다 한 명씩 설명</p></div>
```

## .m-fix (그림 · 3 · essay math)
`.m-fix`(첨삭 답안 = 공책 한 장: 왼쪽 펀치 구멍 셋 · 회색 여백 세로 줄(가로줄과 같은 색) · 여백 선부터 종이 끝까지 가로줄 자동 — `.s-label` + `p.m-fix-line`에 `<del>틀린 말</del><ins>고친 말</ins>`, 풀이 줄마다 공책 줄 · 틀린 말 줄 긋기 · 바로 위 옅은 메인 알약 메모 자동, 라벨은 상자 왼쪽 위(위 = 왼쪽 64); 줄에 `data-why="고친 이유"`를 달면 줄 오른쪽 끝에 "왜? 이유" — 이유를 달면 옆에 숫자 칸을 따로 두지 않고 `s-m w12 h2` 한 칸(폭 1440)으로, · `…

```html
<div class="s-m w12 h2"><div class="m-fix"><span class="s-label">학생 풀이</span><p class="m-fix-line" data-why="인수분해 공식">x² − 9 = <del>(x − 3)²</del><ins>(x − 3)(x + 3)</ins></p><p class="m-fix-line" data-why="해는 두 개">따라서 x = <del>3</del><ins>±3</ins> 이다.</p></div></div>
```

## .m-pict (그림 · 3 · math reading)
`.m-pict[data-v][data-of]`(사람 그림 n명 중 v명 + 안에 `.m-num` — 숫자가 둘이면 사람 그림만 `s-m w4 h2 bare`(배경 위, 회색 사람 한 단계 짙게)에 두고 숫자는 옆 칸 카드 둘로, 큰 흰 상자 하나로 감싸지 않는다, · `.m-dday`(`.m-cal` > `.m-cal-top` 달 · `.m-cal-day` 날 + `.m-num` · 달력 묶음 `.m-dday.m-pad` > `.m-cal-pad`(`i.m-cal-page` 둘 + `.m-cal`에 `i.m-cal-ring` 둘) — 달력 뒤로 남은 장이 겹치고 위…

```html
<div class="s-m w8 h2 bare"><div class="m-pict" data-v="8" data-of="10"><div class="m-num"><p class="s-big hl">8<small>명</small></p><p class="s-h">논술 평가 A</p><p>6학년 40명 중<br>32명이에요</p></div></div></div>
```

## .m-num (정보 · 3 · grid)
`.m-num`(큰 숫자 — 작은 칸 72 · 이름 18pt, 큰 칸 72 · 이름 24pt(120은 너무 큼,, `.center`; 단위 `small`도 숫자와 같은 크기) · `.m-donut`(`.s-donut[style="--v"]` + `.m-num`, 좁으면 위아래) · `.m-bars[data-unit]`(`div[style="--v"][.accent]` 이름, 칸 높이를 다 쓰는 세로 막대 — 값은 막대 꼭대기 바로 위, · `.m-hbars[data-unit]`(막대 2 ~ 3개뿐이면 `.s-m.bare` — 흰 상자 없이 배경 위 굵은 막대 168p…

```html
<div class="s-m w4 h2"><div class="m-num center"><p class="s-big">9<small>명</small></p><p class="s-h">100점</p><p>서술형까지<br>만점이에요</p></div></div>
```

## .m-poem (그림 · 2 · korean history)
`.m-poem` 공책 종이를 그대로, 앞 코딩 덱과 주 도식 안 겹침).

```html
<div class="s-m w12 h2"><div class="m-poem"><span class="s-label">훈민정음 서문 · 1446년</span><p class="m-verse" data-note="왜 달랐을까?">나라의 말이 <mark>중국과 달라</mark></p><p class="m-verse">문자와 서로 통하지 아니하므로</p><p class="m-verse">어리석은 백성이 말하고자 하는 바가 있어도</p><p class="m-verse" data-note="누구를 위한 글자?"><mark>제 뜻을 펴지 못하는</mark> 사람이 많다</p></div></div>
```

## .m-gauge (그림 · 2 · admission science)
`.m-gauge`(반원 게이지 — `div[data-v]` + `.s-big` · `.s-h` · `p` · `p.m-gauge-ends`(0% · 100%), 회색 반원 트랙 + 메인 호 + 가운데 흰 원판, 상자 없는 칸 — 비율 하나)

```html
<div class="s-m w12 h2 bare"><div class="m-gauge" data-v="80"><p class="s-big">80<small>%</small></p><p class="s-h">수시 모집 비중</p><p>전국 대학 모집 인원 기준</p><p class="m-gauge-ends"><span>0%</span><span>100%</span></p></div></div>
```

## .m-csatcard (그림 · 2 · apply csat)
`.m-csatcard`(수능 성적통지표 — `p.m-cc-title`(+ `span` 예시) · `div.m-cc-row.m-cc-head`(span 영역들) · `div.m-cc-row`(표준점수 · 백분위) · `div.m-cc-row.accent`(강조 줄), 절대평가 영역은 '–')

```html
<div class="s-m w12 h2"><div class="m-csatcard"><p class="m-cc-title">수능 성적통지표 <span>예시</span></p><div class="m-cc-row m-cc-head"><span>영역</span><span>국어</span><span>수학</span><span>영어</span><span>한국사</span><span>탐구 1</span><span>탐구 2</span></div><div class="m-cc-row accent"><span>표준점수</span><span>128</span><span>131</span><span>–</span><span>–</span><span>64</span><span>62</span></div><div class="m-cc-row"><span>백분위</span><span>91</span><span>95</span><span>–</span><span>–</span><span>89</span><span>85</span></div><div class="m-cc-row"><span>등급</span><span>2</span><span>1</span><span>2</span><span>3</span><span>2</span><span>2</span></div></div></div>
```

## .m-badges (정보 · 2 · coding csat-eng)
`.m-badges`(단계 배지 — `div[.accent]`(`.s-label` 기간 · 아이콘 · `.s-h` · `p`), 둥근 배지 안 아이콘(배지 320 · 아이콘 148,, 마지막만 메인 테두리) · `.m-ideas`(개념 카드 둘 — `div[data-draw="loop|fork"]`(`.s-label` 개념 · `.s-h` 뜻 한 줄 · `p.m-idea-ex` 생활 속 예), 카드 위 2D 아이콘(`<i data-icon="loop">` 반복 = 회색 카드 위 한 바퀴 돌아오는 화살표(trend와 같은 둥근 선 + 진한 화살촉) · `branch` …

```html
<div class="s-m w12 h2 bare"><div class="m-badges"><div><span class="s-label">1 ~ 6주</span><i data-icon="note"></i><p class="s-h">블록 코딩</p><p>반복 · 조건</p></div><div><span class="s-label">7 ~ 12주</span><i data-icon="laptop"></i><p class="s-h">파이썬 기초</p><p>직접 쓰는 코드</p></div><div class="accent"><span class="s-label">13 ~ 16주</span><i data-icon="rocket"></i><p class="s-h">나만의 앱</p><p>발표회</p></div></div></div>
```

## .m-treemap (그림 · 2 · csat-eng midterm)
`.m-treemap`(트리맵 — `div[data-v][.accent](.s-h · p 값)`, 첫 칸 왼쪽 세로 · 나머지 두 줄, 넓이 = 값 — 아주 작은 칸(2 이하)은 이웃과 합쳐 글이 세로로 꺾이지 않게)

```html
<div class="s-m w12 h2 bare"><div class="m-treemap"><div data-v="38" class="accent"><p class="s-h">서술형</p><p>38</p></div><div data-v="24"><p class="s-h">계산 실수</p><p>24</p></div><div data-v="18"><p class="s-h">범위 밖 개념</p><p>18</p></div><div data-v="12"><p class="s-h">시간 부족</p><p>12</p></div><div data-v="8"><p class="s-h">마킹 실수</p><p>8</p></div></div></div>
```

## .m-report (그림 · 2 · csat-eng study)
`.m-report`(주간 리포트 — `.m-rp-head`(`.s-label` · `p` 날짜) · `.m-rp-row[data-dots="5/7"|data-bar="0.75"]`(`.s-h` · `b` 값) · `.m-rp-note`(`b` · `p` — 이름 + 글 한 줄, 글은 20자 안쪽,, 흰 종이 한 장 — 리포트는 종이라 흰 상자) · `.m-year`(1년 사분원 — `div[data-in="봄"][.accent]`(`.s-label` 때 · `.s-h` · `p`) ×4, 원 지름 520을 왼쪽 위부터 시계 방향 네 조각(안엔 계절 이름), 글은 원…

```html
<div class="s-m w12 h2 bare"><div class="m-report"><div class="m-rp-head"><span class="s-label">주간 리포트</span><p>4월 둘째 주</p></div><div class="m-rp-row" data-dots="6/7"><p class="s-h">어휘 시험 통과</p><b>6 / 7일</b></div><div class="m-rp-row" data-bar="0.8"><p class="s-h">빈칸 정답률</p><b>80%</b></div><div class="m-rp-row" data-bar="0.65"><p class="s-h">실전 풀이 시간</p><b>65분</b></div><div class="m-rp-note"><b>선생님 한마디</b><p>순서 문제는 연결어부터 찾아요</p></div></div></div>
```

## .m-wheel (그림 · 2 · entry sci-high)
`.m-wheel`(순환 바퀴 — `div(.s-h · p)[.accent]` ×4, 흰 원판(반지름 300 · 그림자) 위에 고리 네 조각 + 둥근 화살촉(시계 방향 — 허전해서 원판을 깔았음,, 글은 원판 바깥 네 모서리 — 순환 카드 `.m-loop`과 다른 모양) · `.m-road`(굽은 길 — `div(.s-label 때 · .s-h)[.accent]` ×5, 왼쪽 아래 → 오른쪽 위로 굽이치는 굵은 회색 길 + 이정표 점, 카드는 위 · 아래 번갈아) → 127종. 가로 막대 줄 이름은 한 줄로(5자 안쪽).

```html
<div class="s-m w12 h2 bare"><div class="m-wheel"><div class="accent"><p class="s-h">질문</p><p>왜 그럴까?</p></div><div><p class="s-h">가설</p><p>이렇지 않을까?</p></div><div><p class="s-h">실험</p><p>직접 재 보기</p></div><div><p class="s-h">결론</p><p>다음 질문으로</p></div></div></div>
```

## .m-clock (그림 · 2 · essay thinking)
`.m-clock`(수업 시간 원 — `[data-unit][data-label]` > `div[style="--v"][.accent]` `.s-h`, 도넛 + 가운데 전체 시간 흰 원판 + 오른쪽 범례, 강조 조각만 메인 · 나머지 회색 두 단계)

```html
<div class="s-m w12 h2 bare"><div class="m-clock" data-unit="분" data-label="한 번 수업"><div style="--v:30"><p class="s-h">개념 그림</p></div><div style="--v:40" class="accent"><p class="s-h">문장제 풀이</p></div><div style="--v:20"><p class="s-h">연산 다지기</p></div></div></div>
```

## .m-rubric (그림 · 2 · history perf)
`.m-rubric[data-total]`(채점표 — `.m-rb-sheet`(`.s-label` · `.m-rb-q` 문제 · `ul > li.o|.x[data-pt="2/2"]`(`.s-h` · `p`)) — 맞음 메인 체크 · 틀림 회색 X · 줄 끝 점수, 오른쪽 메인 테두리 점수 도장은 맞은 줄 합으로 자동, 채점표는 종이라 흰 상자)

```html
<div class="s-m w12 h2 bare"><div class="m-rubric" data-total="10"><div class="m-rb-sheet"><span class="s-label">과학 실험 보고서</span><p class="m-rb-q">기준표에 있는 것만 채워도 점수가 돼요</p><ul><li class="o" data-pt="4/4"><p class="s-h">가설 쓰기</p><p>무엇을 확인할지</p></li><li class="o" data-pt="4/4"><p class="s-h">결과 표</p><p>단위까지 정확히</p></li><li class="x" data-pt="2/2"><p class="s-h">느낀 점</p><p>다음에 바꿀 것</p></li></ul></div></div></div>
```

## .m-gun (그림 · 2 · jeongsi)
`.m-gun`(정시 원서 세 장 — `div[.accent]`(`b` 군 글자 · `.s-h` 대학 · `p` 학과 · `span` 상향/적정/안정 · 결과))

```html
<div class="s-m w12 h2 bare"><div class="m-gun"><div><b>가</b><p class="s-h">A대학교</p><p>경영학과</p><span>상향</span></div><div class="accent"><b>나</b><p class="s-h">B대학교</p><p>경제학과</p><span>적정</span></div><div><b>다</b><p class="s-h">C대학교</p><p>회계학과</p><span>안정</span></div></div></div>
```

## .m-twins (그림 · 2 · money perf)
`.m-twins`(두 학생 비교 — `div[.accent]`(`.s-big` 총점 · `.m-tw-bar > i[style="--v"]` 지필 · `i.hl` 수행 · `.m-tw-foot > .s-label` 이름), 같은 지필 위에 수행이 쌓인 세로 막대(조각 사이 28), 칸 310 × 2 — 등급 동그라미는 뺐다, · `.m-kanban`(칸반 — `div[.accent]`(`.s-h` · `ul > li`) ×3, 개수 칩 자동 · 빈 칸 '아직 없어요') · `.m-cue`(발표 큐카드 — `div[.accent]`(`.s-h` · `p` · `.s-l…

```html
<div class="s-m w12 h2 bare"><div class="m-twins"><div><p class="s-big">80점</p><div class="m-tw-bar"><i style="--v:54">지필 54</i><i class="hl" style="--v:26">수행 26</i></div><div class="m-tw-foot"><span class="s-label">학생 A</span></div></div><div class="accent"><p class="s-big">92점</p><div class="m-tw-bar"><i style="--v:54">지필 54</i><i class="hl" style="--v:38">수행 38</i></div><div class="m-tw-foot"><span class="s-label">학생 B</span></div></div></div></div>
```

## .m-gallery (사진 · 2 · money)
`.m-gallery`(큰 액자 하나 + 작은 둘)

```html
<div class="s-m w12 h2 bare"><div class="m-gallery"><div class="m-frame"><figure class="m-photo" data-kind="시장 놀이 사진" data-hint="가로 3 : 2"></figure></div><div class="m-frame"><figure class="m-photo" data-kind="가게 준비 사진" data-hint="가로 2 : 1"></figure></div><div class="m-frame"><figure class="m-photo" data-kind="물건 사고팔기 사진" data-hint="가로 2 : 1"></figure></div></div></div>
```

## .m-jar (그림 · 2 · money phonics)
`.m-jar`(쌓이는 병 — `[data-fill][data-marks="2주|4주|…"]` > `.s-big` · `.s-h` · `p`, 흰 유리병 + 메인 뚜껑(검은 뚜껑 ✗, + 옅은 메인 물 + 흰 점선 눈금(맨 위 눈금은 이름만) · 오른쪽 이름) · `.m-radar`(다섯 영역 진단 — `[data-labels][data-values][data-hi]`, 흰 오각형 위 옅은 메인 다각형, 꼭짓점 바깥 이름 · 점수는 흰 카드, 강조 영역만 메인 테두리 · 글자 · 차트 620, 맨 위 이름 카드가 솟은 만큼 위 여백 56을 줘 대제목과 띄우고 칸 높이…

```html
<div class="s-m w12 h2 bare"><div class="m-jar" data-fill="100" data-marks="2주|4주|6주|8주"><p class="s-big">14<small>시간</small></p><p class="s-h">겨울 8주 소리 듣기</p><p>하루 15분 × 56일</p></div></div>
```

## .m-shelf (그림 · 2 · phonics reading)
`.m-shelf`(책장 — `div[data-n="16"][data-hi="16"]`, 바닥 선 위 흰 책등 n권(높이 들쭉날쭉), 강조할 권만 메인, 상자 없는 칸 + 아래 한 줄 — 읽을 책의 양)

```html
<div class="s-m w12 h2 bare"><div class="m-shelf" data-n="16" data-hi="16"></div><p class="m-caption">한 주에 2권 · 읽은 책마다 <span class="hl">한 편씩</span> 써요</p></div>
```

## .m-bricks (그림 · 2 · reading science)
`.m-bricks`(벽돌 피라미드 — 위 → 아래 `div[.accent]` > `.s-h`, 줄마다 둥근 블록 1 · 2 · 3 · 4개(main.js), 이름은 오른쪽 옆, 맨 위 줄만 메인, 상자 없는 칸 — '쌓인다'를 블록 개수로, 사다리꼴 피라미드보다 우선,도 벽돌로: 이름 뒤 `<span class="s-value">2권</span>`, 강조 줄은 이름 · 숫자 메인, `.m-funnel` 가로 띠 깔때기는 어색해서 독서 덱에서 뺐다 · 벽돌과 이름은 두 열 모두 내용 폭이라 한 덩어리로 가운데 — 양옆 여백이 같다)

```html
<div class="s-m w12 h2 bare"><div class="m-bricks"><div class="accent"><p class="s-h">탐구 설계 · 서술</p></div><div><p class="s-h">그래프 · 표 해석</p></div><div><p class="s-h">개념 연결</p></div><div><p class="s-h">핵심 개념</p></div></div></div>
```

## .m-bubbles (그림 · 2 · thinking)
`.m-bubbles[data-unit]`(크기 비교 원 — `div[style="--v"][.accent]` `.s-h`, 지름은 값의 제곱근 비례)

```html
<div class="s-m w12 h2 bare"><div class="m-bubbles" data-unit="%"><div style="--v:48" class="accent"><p class="s-h">끝까지 안 읽음</p></div><div style="--v:32"><p class="s-h">식 세우기</p></div><div style="--v:20"><p class="s-h">계산 실수</p></div></div></div>
```

## .m-quote (정보 · 2 · grid)
`.m-quote`(`.s-qmark` · `blockquote` · `.s-who`)

```html
<div class="s-m w8 h2 bare"><div class="m-quote"><span class="s-qmark"><i data-icon="quote"></i></span><blockquote>초등 때는 영어 1등이었는데,<br>중1 첫 시험이 72점이었어요.</blockquote><p class="s-who"><b>중1 학부모</b> · 지난해 상담에서</p></div><p class="m-memo"><b>초등 내내 1등이던 학생</b>중1 첫 영어 시험 72점</p></div>
```

## 보조 글 .m-say (2 · korean reading)

```html
<div class="s-grid"><div class="s-m w12 h2 bare"><div class="m-goal" style="--now:20;--goal:100"><p class="m-now">겨울방학 전<b>120자</b></p><p class="m-to">8주 뒤<b>600자</b></p><p class="m-gap">+480자</p><p class="m-say">이제 먼저 쓰겠다고 해요<small>6학년 학부모</small></p></div></div></div>
```

## .m-bignum (정보 · 1 · korean)
`.m-bignum` > `.s-big`(60pt, 강조는 `span.hl`)

```html
<div class="s-m w12 h2 bare"><div class="m-bignum"><p class="s-big">10명 중 <span class="hl">7명</span></p><p class="s-h">지난해 중2 서술형에서 감점됐어요</p><div class="m-chips"><span>느낌만 적음</span><span class="soft">시어 인용 없음</span><span>조건 빠뜨림</span><span class="accent">근거 없이 결론만</span><span class="soft">문장 미완성</span><span>글자 수 초과</span></div></div></div>
```

## .m-record (그림 · 1 · admission)
`.m-record`(학생부 문서 — `.s-label` 문서 이름(상자 왼쪽 위 · 잉크 기준 네 곳 67) + `.m-rec-row[.hl]` > `.s-h` 항목 + `p` 내용, 왼쪽 항목 칸은 배경색 띠, 강조 줄은 옅은 메인 띠 · 항목 이름 메인, 문서라 큰 흰 상자 `s-m w12 h2` 예외)

```html
<div class="s-m w12 h2"><div class="m-record"><span class="s-label">학교생활기록부 · 2학년</span><div class="m-rec-row"><p class="s-h">교과학습발달상황</p><p>과목별 성취도 · 석차등급</p></div><div class="m-rec-row hl"><p class="s-h">세부능력 및 특기사항</p><p>수업 시간의 탐구 · 발표를 선생님이 문장으로</p></div><div class="m-rec-row"><p class="s-h">창의적 체험활동상황</p><p>자율 · 동아리 · 진로 활동</p></div><div class="m-rec-row"><p class="s-h">행동특성 및 종합의견</p><p>담임 선생님의 한 해 종합 평가</p></div></div></div>
```

## .m-semesters (그림 · 1 · admission)
`.m-semesters`(학기 칸 — 학년 `div` > `.s-label` + 학기 `div[.accent|.off]` 둘(`.s-h` · `p`), 반영 학기 = 흰 카드 · 남은 학기 = 메인 면 · 빠지는 학기 = 옅은 회색 면, 상자 없는 큰 칸)

```html
<div class="s-m w12 h2 bare"><div class="m-semesters"><div><p class="s-label">1학년</p><div><p class="s-h">1학기</p><p>반영</p></div><div><p class="s-h">2학기</p><p>반영</p></div></div><div><p class="s-label">2학년</p><div><p class="s-h">1학기</p><p>반영</p></div><div><p class="s-h">2학기</p><p>반영</p></div></div><div><p class="s-label">3학년</p><div class="accent"><p class="s-h">1학기</p><p>마지막 반영</p></div><div class="off"><p class="s-h">2학기</p><p>수시엔 빠져요</p></div></div></div></div>
```

## .m-six (정보 · 1 · admission)
`.m-six`(원서 6장 — 묶음 `div[.accent]` 셋 > `.m-forms` > `i` 둘(원서 종이 · 글줄은 main.js) + `.s-h` · `p`, 강조 묶음 앞 장만 메인 면, 상자 없는 큰 칸)

```html
<div class="s-m w12 h2 bare"><div class="m-six"><div><div class="m-forms"><i></i><i></i></div><p class="s-h">상향 2장</p><p>합격선보다 조금 위</p></div><div class="accent"><div class="m-forms"><i></i><i></i></div><p class="s-h">적정 2장</p><p>합격선 근처</p></div><div><div class="m-forms"><i></i><i></i></div><p class="s-h">안정 2장</p><p>합격선보다 아래</p></div></div></div>
```

## .m-forms6 (정보 · 1 · admission)
`.m-forms6`(원서 조합 전후 — `.m-f6-row[.after]` 둘 > `.m-f6-head`(`.s-h` · `p` 구성) + `.m-f6-cards` > `i` 원서 칸 6개(`.pass > b` 합격), 처음 줄은 흐린 회색 칸 · 다시 짠 줄은 흰 칸 · 합격 칸만 메인 테두리 + 옅은 메인 칩, 상자 없는 큰 칸 — 전후 숫자 카드 둘은 완성도가 떨어져서, · `.m-chain`(개념 사슬 — `div[.accent]` > `.s-h` 개념 · `p` 학년, 테두리만 있는 둥근 고리가 겹쳐 사슬 + 고리 아래 흰 카드(main.js), 강조 고리…

```html
<div class="s-m w12 h2 bare"><div class="m-forms6"><div class="m-f6-row"><div class="m-f6-head"><p class="s-h">처음 짠 원서</p><p>상향 5 · 적정 1</p></div><div class="m-f6-cards"><i>상향</i><i>상향</i><i>상향</i><i>상향</i><i>상향</i><i>적정</i></div></div><div class="m-f6-row after"><div class="m-f6-head"><p class="s-h">다시 짠 원서</p><p>상향 2 · 적정 2 · 안정 2</p></div><div class="m-f6-cards"><i>상향</i><i>상향</i><i class="pass">적정<b>합격</b></i><i class="pass">적정<b>합격</b></i><i class="pass">안정<b>합격</b></i><i class="pass">안정<b>합격</b></i></div></div></div></div>
```

## .m-mix (그림 · 1 · apply)
`.m-mix[data-cols="국어|수학|영어|탐구"][data-hi="1"]`(반영 비율 띠 — `div[.accent]`(`.s-h` 대학 · `span` 비율 ×n) 줄마다 100% 띠를 비율만큼 나눔, 강조 영역은 강조 줄에서만 메인 · 다른 줄은 옅은 메인)

```html
<div class="s-m w12 h2 bare"><div class="m-mix" data-cols="국어|수학|영어|탐구" data-hi="1"><div><p class="s-h">A대학교</p><span>30</span><span>35</span><span>15</span><span>20</span></div><div class="accent"><p class="s-h">B대학교</p><span>25</span><span>45</span><span>10</span><span>20</span></div><div><p class="s-h">C대학교</p><span>35</span><span>25</span><span>15</span><span>25</span></div></div></div>
```

## .m-formula (그림 · 1 · apply)
`.m-formula[data-unit]`(환산식 — `div`(`.s-h` 영역 · `b` 점수 · `span` '× 0.30') 또는 `div[data-pts]`(등급을 점수로 바꾸는 칸) + `div.m-fm-total`(`.s-h`), 칸마다 값 · 사이 + · = · 합(메인 카드) 자동 계산)

```html
<div class="s-m w12 h2 bare"><div class="m-formula" data-unit="점"><div><p class="s-h">국어</p><b>128</b><span>× 0.30</span></div><div><p class="s-h">수학</p><b>131</b><span>× 0.35</span></div><div><p class="s-h">탐구</p><b>126</b><span>× 0.20</span></div><div data-pts="14"><p class="s-h">영어</p><b>2등급</b><span>등급 점수</span></div><div class="m-fm-total"><p class="s-h">A대학교 환산</p></div></div><p class="m-caption">표준점수 × 반영 비율 · 영어는 대학이 정한 <span class="hl">등급 점수</span>로 · 예시</p></div>
```

## .m-rankline (그림 · 1 · apply)
`.m-rankline[data-total]`(모집 인원 줄 — `div[data-cut][data-me][.accent]`(`.s-h` · `p`), 지원자 점 한 줄 · 모집 인원 자르는 선 · 내 자리 원 + 알약 자동, 강조 줄만 메인, 점은 20개 안팎으로 — 점 크기가 간격에 맞춰 커짐, 40개면 너무 작음 · 무거운 점 줄이 아래에 있어 도식 전체를 32px 위로 올려 무게 중심을 맞춤.

```html
<div class="s-m w12 h2 bare"><div class="m-rankline" data-total="20"><div data-cut="15" data-me="17"><p class="s-h">A대학교</p><p>경영학과 · 모의지원</p></div><div data-cut="15" data-me="11" class="accent"><p class="s-h">B대학교</p><p>경영학과 · 모의지원</p></div></div></div>
```

## .m-orbit (그림 · 1 · coding)
`.m-orbit`(가운데 원 + 둘레 카드 — `.m-orb-c`(`.s-big` · `p`) 메인 원 + `div`(아이콘 · `.s-h`) 넷이 네 모서리 흰 카드, 회색 점선으로 이음)

```html
<div class="s-m w12 h2 bare"><div class="m-orbit"><div class="m-orb-c"><p class="s-big">AI</p><p>쓰기만 해요</p></div><div><i data-icon="globe"></i><p class="s-h">번역</p></div><div><i data-icon="search"></i><p class="s-h">숙제 검색</p></div><div><i data-icon="star"></i><p class="s-h">그림 만들기</p></div><div><i data-icon="doc"></i><p class="s-h">글 요약</p></div></div></div>
```

## .m-io (그림 · 1 · coding)
`.m-io`(입력 → 처리 → 출력 — `div` 셋(`.s-label` · `.s-h` · `p`), 가운데 `.accent` 메인 카드 크게, 화살표 자동, 라벨 ↔ 이름 4px로 붙임 — · `.m-code`(코드 화면 — `p[.hl][data-note]` 줄, 흰 창 + 위 점 셋 + 줄 번호 + 고정폭 글자, 강조 줄은 옅은 메인 띠 + 왼쪽 메인 테두리 + 메모 칩) · `.m-puzzle`(퍼즐 조각 — `div[.accent]` 넷(`.s-h` · `p`), 흰 · 회색 번갈아 맞붙고 오른쪽 둥근 혹이 다음 조각에 끼워짐) · `.m-flow`(순서…

```html
<div class="s-m w12 h2 bare"><div class="m-io"><div><span class="s-label">입력</span><p class="s-h">고양이 사진 100장</p><p>예시를 보여 줘요</p></div><div class="accent"><span class="s-label">처리</span><p class="s-h">특징을 배워요</p><p>귀 · 눈 · 수염 모양</p></div><div><span class="s-label">출력</span><p class="s-h">“이건 고양이!”</p><p>처음 본 사진도 맞혀요</p></div></div></div>
```

## .m-code (그림 · 1 · coding)
`.m-code`(코드 화면 — `p[.hl][data-note]` 줄, 흰 창 + 위 점 셋 + 줄 번호 + 고정폭 글자, 강조 줄은 옅은 메인 띠 + 왼쪽 메인 테두리 + 메모 칩)

```html
<div class="s-m w12 h2 bare"><div class="m-code"><p>for i in range(3):</p><p>    print("안녕")</p><p>name = input("이름은?")</p><p class="hl" data-note="여기서 멈춰요">print("반가워 " + nam)</p></div></div>
```

## .m-puzzle (그림 · 1 · coding)
`.m-puzzle`(퍼즐 조각 — `div[.accent]` 넷(`.s-h` · `p`), 흰 · 회색 번갈아 맞붙고 오른쪽 둥근 혹이 다음 조각에 끼워짐)

```html
<div class="s-m w12 h2 bare"><div class="m-puzzle"><div><p class="s-h">분해</p><p>큰 문제를 작게</p></div><div><p class="s-h">패턴</p><p>반복을 찾기</p></div><div><p class="s-h">추상화</p><p>중요한 것만</p></div><div class="accent"><p class="s-h">알고리즘</p><p>순서대로 쓰기</p></div></div></div>
```

## .m-flow (정보 · 1 · coding)
`.m-flow`(순서도 — `p[data-k="start|q|yes|no|end"]`, 1560 × 500 고정 자리: 회색 알약 · 메인 마름모(SVG) · 흰 칸 · 선과 화살촉 · 예/아니오 칩)

```html
<div class="s-m w12 h2 bare"><div class="m-flow"><p data-k="start">시작</p><p data-k="q">숙제가 있나요?</p><p data-k="yes">숙제하기</p><p data-k="no">책 읽기</p><p data-k="end">끝</p></div></div>
```

## .m-ideas (정보 · 1 · coding)
`.m-ideas`(개념 카드 둘 — `div[data-draw="loop|fork"]`(`.s-label` 개념 · `.s-h` 뜻 한 줄 · `p.m-idea-ex` 생활 속 예), 카드 위 2D 아이콘(`<i data-icon="loop">` 반복 = 회색 카드 위 한 바퀴 돌아오는 화살표(trend와 같은 둥근 선 + 진한 화살촉) · `branch` 조건 = 두 갈래 이정표(메인 · 진한 메인 표지판) — icons.js에 새로 그림, · 가운데 정렬 · 아래 한 줄로 넓은 뜻 — 동작 하나를 그리면

```html
<div class="s-m w12 h2 bare"><div class="m-ideas"><div><i data-icon="loop"></i><span class="s-label">반복</span><p class="s-h">같은 일을 여러 번 하기</p><p class="m-idea-ex">줄넘기 100번 · 매일 아침 양치</p></div><div><i data-icon="branch"></i><span class="s-label">조건</span><p class="s-h">상황에 따라 다르게 하기</p><p class="m-idea-ex">비가 오면 우산 · 빨간불이면 멈춤</p></div></div><p class="m-caption">게임 · 앱 같은 모든 프로그램이 <span class="hl">반복과 조건</span>으로 움직여요</p></div>
```

## .m-timetable (그림 · 1 · credit)
`.m-timetable`(시간표 — `div.m-tt(.s-label 누구 · ol > li ×20, 5칸씩 줄)` ×2, 요일 머리는 자동, 고른 과목 `li.pick`은 메인 테두리)

```html
<div class="s-m w12 h2 bare"><div class="m-timetable"><div class="m-tt"><span class="s-label">우리 아이 · 공학 계열</span><ol><li>국어</li><li>수학</li><li class="pick">물리학</li><li>영어</li><li class="pick">미적분</li><li>영어</li><li class="pick">화학</li><li>국어</li><li>수학</li><li>체육</li><li class="pick">물리학</li><li>한국사</li><li>영어</li><li class="pick">화학</li><li>수학</li><li>수학</li><li>국어</li><li class="pick">미적분</li><li>음악</li><li>영어</li></ol></div><div class="m-tt"><span class="s-label">친구 · 인문 계열</span><ol><li>국어</li><li>수학</li><li class="pick">사회문화</li><li>영어</li><li class="pick">세계사</li><li>영어</li><li class="pick">경제</li><li>국어</li><li>수학</li><li>체육</li><li class="pick">사회문화</li><li>한국사</li><li>영어</li><li class="pick">경제</li><li>수학</li><li>수학</li><li>국어</li><li class="pick">세계사</li><li>음악</li><li>영어</li></ol></div></div></div>
```

## .m-tiers (그림 · 1 · credit)
`.m-tiers`(등급 띠 — `div[data-cuts="10,34,66,90,100"][.accent](.s-label 이름)`, 누적 비율로 100% 띠를 등급 칸(흰 카드)으로 나누고 띠 위 '1등급 = 상위 n%', 1등급 칸은 줄마다 메인 — · `.m-timetable`(시간표 — `div.m-tt(.s-label 누구 · ol > li ×20, 5칸씩 줄)` ×2, 요일 머리는 자동, 고른 과목 `li.pick`은 메인 테두리) · `.m-subway`(과목 노선도 — `p.m-sw-start` 출발역 + `div[.accent](.s-h 진로 · p…

```html
<div class="s-m w12 h2 bare"><div class="m-tiers"><div data-cuts="4,11,23,40,60,77,89,96,100"><span class="s-label">예전 9등급</span></div><div data-cuts="10,34,66,90,100" class="accent"><span class="s-label">지금 5등급</span></div></div></div>
```

## .m-thresh (그림 · 1 · credit)
`.m-thresh`(이수 기준선 — `div[style="--v:67"](.s-h 이름 · b 기준)`, 띠를 기준에서 미이수(회색) | 이수(흰 카드)로 나누고 경계에 메인 선)

```html
<div class="s-m w12 h2 bare"><div class="m-thresh"><div style="--v:67"><p class="s-h">출석률</p><b>3분의 2 이상</b></div><div style="--v:40"><p class="s-h">학업 성취율</p><b>40% 이상</b></div></div></div>
```

## .m-transcript (그림 · 1 · credit)
`.m-transcript`(성적표 — `div.m-tp-head(.s-label · p)` + `table`, 강조 줄은 옅은 메인 띠) → 133종. 100칸 `.m-waffle`에 `data-unit="%"`(기본 '점'). 두 사람 대화 말풍선 양옆 여백 44(정렬 검사 — 위 · 아래 ≥ 양옆 0.8배).

```html
<div class="s-m w12 h2 bare"><div class="m-transcript"><div class="m-tp-head"><p class="s-label">1학년 1학기 성적표</p><p>1학년 3반 · 예시</p></div><table><tbody><tr><th>과목</th><th>원점수 / 평균</th><th>성취도</th><th>석차 등급</th></tr><tr><td>공통국어1</td><td>88 / 71.2</td><td>B</td><td>2</td></tr><tr><td>공통수학1</td><td>94 / 65.4</td><td>A</td><td>1</td></tr><tr class="accent"><td>통합과학1</td><td>92 / 79.8</td><td>A</td><td>2</td></tr></tbody></table></div></div>
```

## .m-merge (그림 · 1 · credit)
`.m-merge`(모이는 선 — `div(.s-label · p[data-to="0"] …)` + `div(.s-label · div(.s-h · p) …)`, 왼쪽 칩이 곡선으로 모여 오른쪽 카드(메인 테두리)로, 카드는 모인 칩들의 가운데 높이)

```html
<div class="s-m w12 h2 bare"><div class="m-merge"><div><span class="s-label">2027 수능까지 · 골라서</span><p data-to="0">화법과 작문</p><p data-to="0">언어와 매체</p><p data-to="1">확률과 통계</p><p data-to="1">미적분</p><p data-to="1">기하</p></div><div><span class="s-label">2028 수능부터</span><div><p class="s-h">국어</p><p>모두 같은 시험</p></div><div><p class="s-h">수학</p><p>모두 같은 시험</p></div></div></div></div>
```

## .m-subway (그림 · 1 · credit)
`.m-subway`(과목 노선도 — `p.m-sw-start` 출발역 + `div[.accent](.s-h 진로 · p 고2 과목 · p 고3 과목)` ×3, 출발역에서 노선이 갈라지고 강조 노선만 메인, 열 머리는 `data-heads="고1 공통|고2 일반 선택|고3 진로 선택"`)

```html
<div class="s-m w12 h2 bare"><div class="m-subway"><p class="m-sw-start">공통 과목</p><div><p class="s-h">공학</p><p>물리학</p><p>역학과 에너지</p></div><div class="accent"><p class="s-h">의약</p><p>생명과학</p><p>세포와 물질대사</p></div><div><p class="s-h">인문 · 사회</p><p>사회와 문화</p><p>경제</p></div></div></div>
```

## .m-gradeband (그림 · 1 · csat)
`.m-gradeband[data-goal][data-now]`(등급 비율 띠 — 수능 9등급 비율 4 · 7 · 12 · 17 · 20 · 17 · 12 · 7 · 4%로 폭 자동, 경계 아래 누적 %, 목표 등급만 메인 + 위 알약, 지금 등급 아래 알약 · 자식 없음)

```html
<div class="s-m w12 h2 bare"><div class="m-gradeband" data-goal="2" data-now="4"></div></div>
```

## .m-minreq (그림 · 1 · csat)
`.m-minreq[data-pick="0,2,3"][data-limit][data-rule]`(수능 최저 계산 — `div`(`.s-h` 영역 · `b` 등급 + `small`) 4 ~ 5장, 고른 영역만 메인 테두리 · 묶음 선 · 식 알약 + 충족 알약(메인) 자동)

```html
<div class="s-m w12 h2 bare"><div class="m-minreq" data-pick="0,2,3" data-limit="6" data-rule="3개 합 6 이내"><div><p class="s-h">국어</p><b>2<small>등급</small></b></div><div><p class="s-h">수학</p><b>3<small>등급</small></b></div><div><p class="s-h">영어</p><b>1<small>등급</small></b></div><div><p class="s-h">탐구 1</p><b>2<small>등급</small></b></div><div><p class="s-h">탐구 2</p><b>3<small>등급</small></b></div></div></div>
```

## .m-mockyear (그림 · 1 · csat)
`.m-mockyear`(한 해 시험 띠 — 3 ~ 11월 달 점 자동, `div[data-m][.key 평가원 | .accent 수능]`(`.s-h` · `p`))

```html
<div class="s-m w12 h2 bare"><div class="m-mockyear"><div data-m="3"><p class="s-h">학평</p><p>교육청</p></div><div data-m="5"><p class="s-h">학평</p><p>교육청</p></div><div data-m="6" class="key"><p class="s-h">모평</p><p>평가원</p></div><div data-m="7"><p class="s-h">학평</p><p>교육청</p></div><div data-m="9" class="key"><p class="s-h">모평</p><p>평가원</p></div><div data-m="10"><p class="s-h">학평</p><p>교육청</p></div><div data-m="11" class="accent"><p class="s-h">수능</p><p>평가원</p></div></div></div>
```

## .m-rounds (그림 · 1 · csat)
`.m-rounds[data-cols="1회독|2회독|3회독"]`(회독 칸 — `div[data-done]`(`.s-h`) 줄마다 흰 카드 + 동그라미 체크 자동)

```html
<div class="s-m w12 h2 bare"><div class="m-rounds" data-cols="1회독|2회독|3회독"><div data-done="3"><p class="s-h">2026학년도 수능</p></div><div data-done="3"><p class="s-h">2025학년도 수능</p></div><div data-done="2"><p class="s-h">2024학년도 수능</p></div><div data-done="1"><p class="s-h">2023학년도 수능</p></div><div data-done="1"><p class="s-h">2022학년도 수능</p></div></div></div>
```

## .m-scoreline (그림 · 1 · csat-eng)
`.m-scoreline[data-min][data-now][data-goal]`(점수 줄 — `div[data-from][data-to][.accent](b 등급)` 구간 띠(흰 카드 · 목표 구간만 메인) + 축 눈금 + 지금 점수 점 · 카드 + 목표까지 메인 선(양 끝 같은 테두리 동그라미, · 남은 점수 칩) · `.m-treemap`(트리맵 — `div[data-v][.accent](.s-h · p 값)`, 첫 칸 왼쪽 세로 · 나머지 두 줄, 넓이 = 값 — 아주 작은 칸(2 이하)은 이웃과 합쳐 글이 세로로 꺾이지 않게) · `.m-readflow`(읽…

```html
<div class="s-m w12 h2 bare"><div class="m-scoreline" data-min="60" data-now="82" data-goal="90"><div data-from="60" data-to="70"><b>4등급</b></div><div data-from="70" data-to="80"><b>3등급</b></div><div data-from="80" data-to="90"><b>2등급</b></div><div data-from="90" data-to="100" class="accent"><b>1등급</b></div></div></div>
```

## .m-words (그림 · 1 · csat-eng)
`.m-words`(낱말 칩 구름 — `span[data-s="1|2|3"][.accent]` 흰 칩 세 크기, 강조 하나만 메인, 12개 안팎) → 122종.

```html
<div class="s-m w12 h2 bare"><div class="m-words"><span data-s="2">evidence</span><span>assume</span><span data-s="3" class="accent">significant</span><span>perspective</span><span data-s="2">behavior</span><span data-s="2">require</span><span>diverse</span><span data-s="3">environment</span><span>reduce</span><span data-s="2">individual</span><span>effective</span><span data-s="2">influence</span><span>process</span></div></div>
```

## .m-readflow (그림 · 1 · csat-eng)
`.m-readflow`(읽는 방향 — `div[.accent](.s-label · .m-rf-row > span ×4)` 두 줄, 위(강조)는 덩어리 아래 곧은 메인 화살표 · 아래는 덩어리 위로 되돌아가는 회색 화살표, 칩 330 고정)

```html
<div class="s-m w12 h2 bare"><div class="m-readflow"><div class="accent"><span class="s-label">끊어 읽기</span><div class="m-rf-row"><span>The students</span><span>who studied</span><span>passed the exam</span><span>last year</span></div></div><div><span class="s-label">해석 순서</span><div class="m-rf-row"><span>The students</span><span>who studied</span><span>passed the exam</span><span>last year</span></div></div></div></div>
```

## .m-passage (그림 · 1 · csat-eng)
`.m-passage`(지문 구조 — `p[data-n][.accent]` 묶음 이름, 흰 종이 회색 글줄(강조 묶음은 옅은 메인 띠) + 오른쪽 묶음 높이 괄호(막대 셋) + 이름)

```html
<div class="s-m w12 h2 bare"><div class="m-passage"><p data-n="1" class="accent">주제문</p><p data-n="3">예시 · 근거</p><p data-n="1">다시 강조</p></div></div>
```

## .m-scatter (그림 · 1 · csat-eng)
`.m-scatter[data-pts="x,y;…"][data-x][data-y][data-hi]`(산점도 — 축 둘 · 회색 점 · 끝 data-hi개 메인 · 흐름 선(최소제곱), SVG)

```html
<div class="s-m w12 h2 bare"><div class="m-scatter" data-x="어휘 진단 점수" data-y="모의고사 점수" data-hi="3" data-pts="12,30;18,38;22,34;28,46;31,41;35,52;40,49;44,58;47,55;52,63;55,60;58,68;62,66;66,72;70,75;74,70;78,82;84,86;88,90;93,94"></div></div>
```

## .m-dial (그림 · 1 · entry)
`.m-dialog`(`div[.me]` > 아이콘 + `.s-say`)

```html
<div class="s-m w12 h2 bare"><div class="m-dial"><div data-from="9:00" data-to="9:40"><b>9:00</b><p class="s-h">1교시</p></div><div data-from="9:50" data-to="10:30"><b>9:50</b><p class="s-h">2교시</p></div><div data-from="10:40" data-to="11:20"><b>10:40</b><p class="s-h">3교시</p></div><div data-from="11:30" data-to="12:10"><b>11:30</b><p class="s-h">4교시</p></div><div data-from="12:10" data-to="12:50" class="accent"><b>12:10</b><p class="s-h">급식</p></div></div></div>
```

## .m-notice (그림 · 1 · entry)
`.m-notice`(알림장 — `.m-nt-head(.s-label · p 날짜)` + `ol > li` … + `p.m-nt-stamp`, 줄 친 항목 · 번호 동그라미 자동 · 오른쪽 아래 확인 도장(메인 테두리 원))

```html
<div class="s-m w12 h2 bare"><div class="m-notice"><div class="m-nt-head"><p class="s-label">알림장</p><p>3월 4일 화요일 · 예시</p></div><ol><li>준비물: 색연필 12색</li><li>받아쓰기 1급 연습하기</li><li>우유 급식 신청서 내기</li></ol><p class="m-nt-stamp">확인</p></div></div>
```

## .m-jamo (그림 · 1 · entry)
`.m-jamo`(자모 합치기 — `div[.accent](i 자음 · i.v 모음 · i.f 받침 · b 글자)` ×3, 낱자 칸 사이 + · = 자동, 글자 칸은 메인 테두리 · 강조 줄만 메인 면, 줄은 글자 칸에 맞추고 덩어리는 가운데)

```html
<div class="s-m w12 h2 bare"><div class="m-jamo"><div><i>ㄱ</i><i class="v">ㅏ</i><b>가</b></div><div><i>ㄴ</i><i class="v">ㅗ</i><b>노</b></div><div class="accent"><i>ㅂ</i><i class="v">ㅏ</i><i class="f">ㅁ</i><b>밤</b></div></div></div>
```

## .m-dictation (그림 · 1 · entry)
`.m-dictation`(받아쓰기 시험지 — `.m-dc-head(.s-label · b 점수)` + `ol > li[.x](span 글 · del · ins)`, 번호 · 채점(맞음 메인 동그라미 · 틀림 회색 엑스) 자동)

```html
<div class="s-m w12 h2 bare"><div class="m-dictation"><div class="m-dc-head"><p class="s-label">받아쓰기 1급 · 예시</p><b>3 / 5</b></div><ol><li><span>하늘이 파래요</span></li><li class="x"><span>의자에 <del>안자요</del><ins>앉아요</ins></span></li><li><span>나무가 커요</span></li><li class="x"><span>책을 <del>일거요</del><ins>읽어요</ins></span></li><li><span>엄마와 걸어요</span></li></ol></div></div>
```

## .m-tray (그림 · 1 · entry)
`.m-tray`(급식판 — `div[.accent](.s-h · p)` ×5, 흰 판에 위 반찬 칸 셋 · 아래 밥 · 국 칸 둘(바탕색), 강조 칸만 메인 면)

```html
<div class="s-m w12 h2 bare"><div class="m-tray"><div><p class="s-h">김치</p><p>한 입 먹어 보기</p></div><div class="accent"><p class="s-h">처음 보는 반찬</p><p>골고루 먹기</p></div><div><p class="s-h">과일</p><p>껍질 스스로</p></div><div><p class="s-h">밥</p><p>숟가락 · 젓가락</p></div><div><p class="s-h">국</p><p>흘리지 않게</p></div></div></div>
```

## .m-tenframe (그림 · 1 · entry)
`.m-tenframe`(10칸 틀 — `div[data-a][data-b][data-make10][.accent](.s-h 식)` ×2, 2 × 5칸 틀 둘 · 앞 수 메인 점 · 뒤 수 진한 회색 점, data-make10이면 앞 틀을 10까지 채워 옮김) → 149종. 점 · 색 점은 실제 요소로(가상 요소 ✗ — PPT).

```html
<div class="s-m w12 h2 bare"><div class="m-tenframe"><div data-a="7" data-b="5"><p class="s-h">7 + 5</p></div><div data-a="7" data-b="5" data-make10="" class="accent"><p class="s-h">10 + 2 = 12</p></div></div></div>
```

## .m-clothesline (사진 · 1 · entry)
`.m-clothesline`(빨랫줄 사진 — `div[.accent](figure.m-photo · .s-h · p)` ×3, 처지는 줄에 집게로 매단 흰 카드 440(사진 392 × 340), 줄 높이 따라 가운데 카드가 조금 내려감, 강조 카드는 메인 테두리 —

```html
<div class="s-m w12 h2 bare"><div class="m-clothesline"><div><figure class="m-photo" data-kind="글씨 공책 사진" data-hint="가로 10 : 9"></figure><p class="s-h">1주</p><p>자음 따라 쓰기</p></div><div><figure class="m-photo" data-kind="글씨 공책 사진" data-hint="가로 10 : 9"></figure><p class="s-h">6주</p><p>받침 없는 낱말</p></div><div class="accent"><figure class="m-photo" data-kind="글씨 공책 사진" data-hint="가로 10 : 9"></figure><p class="s-h">12주</p><p>혼자 쓴 문장</p></div></div></div>
```

## .m-weekend (그림 · 1 · essay)
`.m-weekend`(주말 시험 일정 — `div[.accent](.s-label 주 · ul > li(b 요일 · span 대학 …) ×2)` ×4, 주마다 흰 카드에 토 · 일 줄 + 대학 칩, 강조 주는 흰 카드 + 메인 테두리 6 · 요일 글자 메인 — · `.m-lights`(수능 최저 계산 — `div[.pick](b 등급 · .s-h 과목)` ×4 + `p.m-lt-sum(.s-label · b · span)`, 흰 동그라미 넷(고른 과목은 메인 테두리) → 화살표 → 결과 카드 메인 면) · `.m-links`(제시문 연결 — `.m-lk-c(.s-l…

```html
<div class="s-m w12 h2 bare"><div class="m-weekend"><div class="accent"><span class="s-label">수능 다음 주</span><ul><li><b>토</b><span>A대</span><span>B대</span><span>C대</span></li><li><b>일</b><span>D대</span><span>E대</span><span>F대</span><span>G대</span></li></ul></div><div><span class="s-label">2주 뒤</span><ul><li><b>토</b><span>H대</span><span>I대</span></li><li><b>일</b><span>J대</span><span>K대</span><span>L대</span></li></ul></div><div><span class="s-label">3주 뒤</span><ul><li><b>토</b><span>M대</span></li><li><b>일</b><span>N대</span><span>O대</span></li></ul></div><div><span class="s-label">4주 뒤</span><ul><li><b>토</b><span>P대</span></li><li><b>일</b><span>Q대</span></li></ul></div></div></div>
```

## .m-lights (그림 · 1 · essay)
`.m-lights`(수능 최저 계산 — `div[.pick](b 등급 · .s-h 과목)` ×4 + `p.m-lt-sum(.s-label · b · span)`, 흰 동그라미 넷(고른 과목은 메인 테두리) → 화살표 → 결과 카드 메인 면)

```html
<div class="s-m w12 h2 bare"><div class="m-lights"><div><b>3등급</b><p class="s-h">국어</p></div><div class="pick"><b>2등급</b><p class="s-h">수학</p></div><div class="pick"><b>2등급</b><p class="s-h">영어</p></div><div><b>4등급</b><p class="s-h">탐구</p></div><p class="m-lt-sum"><span class="s-label">두 과목 합</span><b>4등급</b><span>기준 5 이내 · 충족</span></p></div></div>
```

## .m-links (그림 · 1 · essay)
`.m-links`(제시문 연결 — `.m-lk-c(.s-label · .s-h)` 가운데 논제(메인 면) + `div[data-role](.s-label · .s-h)` ×4 네 모서리 흰 카드, 선 가운데 역할 칩)

```html
<div class="s-m w12 h2 bare"><div class="m-links"><div class="m-lk-c"><span class="s-label">논제</span><p class="s-h">공정한 경쟁이란?</p></div><div data-role="기준"><span class="s-label">제시문 (가)</span><p class="s-h">능력에 따른 보상</p></div><div data-role="반론"><span class="s-label">제시문 (나)</span><p class="s-h">출발선의 차이</p></div><div data-role="사례"><span class="s-label">제시문 (다)</span><p class="s-h">입시 가산점 제도</p></div><div data-role="평가"><span class="s-label">제시문 (라)</span><p class="s-h">공정의 두 조건</p></div></div></div>
```

## .m-outline (그림 · 1 · essay)
`.m-outline`(개요표 — `.m-ol-head(.s-label · p)` + `ol > li[.accent](b 부분 · p 내용 · span 분량)`, 분량만큼 막대 자동 · 강조 줄 옅은 메인 띠 + 메인 막대)

```html
<div class="s-m w12 h2 bare"><div class="m-outline"><div class="m-ol-head"><p class="s-label">답안 개요</p><p>1,000자 답안 · 예시</p></div><ol><li><b>서론</b><p>논제를 내 말로 다시 쓰기</p><span>150자</span></li><li class="accent"><b>본론 1</b><p>(가)와 (나)의 관점 비교</p><span>400자</span></li><li><b>본론 2</b><p>(다)의 사례를 (라)로 평가</p><span>350자</span></li><li><b>결론</b><p>내 입장과 근거 한 문장</p><span>100자</span></li></ol></div></div>
```

## .m-crowd (그림 · 1 · essay)
`.m-crowd`(경쟁 점 — `div[data-n][data-of][.accent](.s-label · b 비율)`, 한 사람 = 점 하나 15개씩 줄, 자리 밖은 옅은 회색, 강조 줄 점만 메인) → 138종.

```html
<div class="s-m w12 h2 bare"><div class="m-crowd"><div data-n="45"><span class="s-label">원서 경쟁률</span><b>45 : 1</b></div><div data-n="15" data-of="45" class="accent"><span class="s-label">최저 충족 · 응시</span><b>15 : 1</b></div></div></div>
```

## .m-page (그림 · 1 · history)
`.m-page`(교과서 펼침 — `div` 두 쪽 > `span` 낱말 6개씩, 흰 종이 두 장 + 회색 글줄 조각 사이 낱말 칩(옅은 메인), 글줄은 main.js — 외울 양. 책처럼: 두 쪽을 붙여 가운데 접힌 줄, 뒤에 메인 겉표지 · 종이 층 둘이 아래로 살짝, 글줄은 옅고 가늘게 · 두 문단(문단 끝 줄 짧게) · 낱말은 형광펜 칠, 쪽 위 제목 줄은 뺐다)

```html
<div class="s-m w12 h2 bare"><div class="m-page"><div><span>골품제</span><span>화백 회의</span><span>진골</span><span>6두품</span><span>상대등</span><span>녹읍</span></div><div><span>집사부</span><span>시중</span><span>9주 5소경</span><span>국학</span><span>독서삼품과</span><span>관료전</span></div></div></div>
```

## .m-cause (그림 · 1 · history)
`.m-cause`(원인 → 사건 → 결과 — `.m-c-col` 카드 둘(`.s-label` · `.s-h` · `p`) · `.m-c-ev` 메인 원(`.s-label` · `.s-h` 64 · `p`) · `.m-c-col`, 모이고 갈라지는 곡선 화살표 SVG, 카드 높이 252 · 사이 56 — 위아래 여백을 왼쪽만큼 넉넉히)

```html
<div class="s-m w12 h2 bare"><div class="m-cause"><div class="m-c-col"><div><span class="s-label">원인</span><p class="s-h">일본의 통일</p><p>대륙으로 눈을 돌림</p></div><div><span class="s-label">원인</span><p class="s-h">조선의 국방 약화</p><p>오랜 평화로 해이</p></div></div><div class="m-c-ev"><span class="s-label">사건</span><p class="s-h">임진왜란</p><p>1592년</p></div><div class="m-c-col"><div><span class="s-label">결과</span><p class="s-h">국토 황폐</p><p>인구 · 농토 감소</p></div><div><span class="s-label">결과</span><p class="s-h">신분제 동요</p><p>곡식으로 신분 상승</p></div></div></div></div>
```

## .m-match (그림 · 1 · history)
`.m-match[data-links="0-3,1-2,…"][data-hi]`(짝 잇기 — `.m-ml > p` ×4 · `.m-mr > p` ×4, 엇갈린 곡선 SVG, 강조 한 줄과 그 두 카드만 메인 — 줄이 한 점에 다 모이지 않게 짝을 고른다)

```html
<div class="s-m w12 h2 bare"><div class="m-match" data-links="0-3,1-2,2-0,3-1" data-hi="1"><div class="m-ml"><p>훈민정음 창제</p><p>임진왜란</p><p>병자호란</p><p>갑오개혁</p></div><div class="m-mr"><p>북벌론 등장</p><p>신분제 폐지</p><p>공명첩 발행</p><p>한글 보급</p></div></div></div>
```

## .m-zoom (그림 · 1 · history)
`.m-zoom[data-hi]`(확대 — `.m-zm-top > p` 시대 알약 넷(선으로 이음) · `.m-zm-cards > div` ×3(`.s-label` · `.s-h` · `p`), 고른 알약에서 아래 옅은 메인 판으로 퍼지는 빛 SVG)

```html
<div class="s-m w12 h2 bare"><div class="m-zoom" data-hi="1"><div class="m-zm-top"><p>고려</p><p>조선 전기</p><p>조선 후기</p><p>근대</p></div><div class="m-zm-cards"><div><span class="s-label">정치</span><p class="s-h">경국대전</p><p>나라의 기본 법전</p></div><div><span class="s-label">경제</span><p class="s-h">과전법</p><p>관리에게 땅 나눔</p></div><div><span class="s-label">문화</span><p class="s-h">훈민정음</p><p>백성을 위한 글자</p></div></div></div></div>
```

## .m-venn (그림 · 1 · history)
`.m-venn`(겹친 원 — 양옆 `.m-vn-name`(`.s-h` 64 · `p` 연도) + `.m-vn-pic`(`.m-vn-a` · `.m-vn-both`(`.s-label` 공통점 · 메인 글자) · `.m-vn-b`, `p` 낱말 3개씩), 흰 원 둘 위에 테두리를 문서 순서로 다시(왼쪽 회색 · 오른쪽 메인))

```html
<div class="s-m w12 h2 bare"><div class="m-venn"><div class="m-vn-name"><p class="s-h">고려</p><p>918 ~ 1392</p></div><div class="m-vn-pic"><div class="m-vn-a"><p>불교</p><p>귀족</p><p>국제 무역</p></div><div class="m-vn-both"><span class="s-label">공통점</span><p>과거제</p><p>왕조 국가</p></div><div class="m-vn-b"><p>유교</p><p>양반</p><p>한글</p></div></div><div class="m-vn-name"><p class="s-h">조선</p><p>1392 ~ 1897</p></div></div></div>
```

## .m-era (그림 · 1 · history)
`.m-era`(시대 띠 — `div[data-w][.accent]`(`.s-h` 시대 · `.s-label` 때 · `p`), 너비 = 배우는 기간, 화살 모양 조각 SVG가 이어진 띠, 강조 시대만 메인 — SVG 띠라 흰 도형 검사에서 뺌) → 96종.

```html
<div class="s-m w12 h2 bare"><div class="m-era"><div data-w="2"><p class="s-h">선사<br>고조선</p><span class="s-label">3 ~ 4월</span><p>나라의 시작</p></div><div data-w="2"><p class="s-h">삼국<br>남북국</p><span class="s-label">5 ~ 6월</span><p>세 나라의 경쟁</p></div><div data-w="2"><p class="s-h">고려</p><span class="s-label">7 ~ 8월</span><p>귀족과 불교</p></div><div data-w="3" class="accent"><p class="s-h">조선</p><span class="s-label">9 ~ 11월</span><p>양반과 유교</p></div><div data-w="2"><p class="s-h">근현대</p><span class="s-label">12 ~ 1월</span><p>개항과 독립</p></div></div></div>
```

## .m-lanes (그림 · 1 · jeongsi)
`.m-lanes[data-lanes="수시|정시"]`(두 줄 입시 일정 — 9 ~ 2월 축 자동, `div[data-lane="0|1|all"][data-m="9|12.5"][.accent]`(`.s-h` · `p`), `all` = 두 줄을 잇는 세로 메인 카드(수능), 카드 폭 = 달 간격 - 22라 옆 달 카드와 겹치지 않음 —.

```html
<div class="s-m w12 h2 bare"><div class="m-lanes" data-lanes="수시|정시"><div data-lane="0" data-m="9" class="accent"><p class="s-h">원서 접수</p><p>6장</p></div><div data-lane="0" data-m="10"><p class="s-h">면접 · 논술</p><p>대학별</p></div><div data-lane="all" data-m="11"><p class="s-h">수능</p><p>11월</p></div><div data-lane="0" data-m="12"><p class="s-h">합격 발표</p><p>12월 중순</p></div><div data-lane="1" data-m="12.5" class="accent"><p class="s-h">원서 접수</p><p>가 · 나 · 다군</p></div><div data-lane="1" data-m="2"><p class="s-h">합격 발표</p><p>2월</p></div></div></div>
```

## .m-balance (그림 · 1 · jeongsi)
`.m-balance[data-heavy="left|right"]`(저울 — `div` ×2(`.s-label` · `.s-h` · `p`), 무거운 쪽이 아래 · 받침과 막대는 SVG, 무거운 쪽 카드만 `.accent`)

```html
<div class="s-m w12 h2 bare"><div class="m-balance" data-heavy="right"><div><p class="s-label">학생부 내신</p><p class="s-h">3.4등급</p><p>고2 1학기까지 평균</p></div><div class="accent"><p class="s-label">모의고사</p><p class="s-h">백분위 86</p><p>국 · 수 · 탐 평균</p></div></div></div>
```

## .m-ladder (그림 · 1 · jeongsi)
`.m-ladder[data-min][data-max][data-me][data-unit]`(지원 사다리 — 세로 눈금 + `div[data-from][data-to][.accent]`(`.s-h` · `p`) 구간 카드 + 내 점수 알약 자동, 세로로 길게 높이 600 · 이 칸이 든 격자는 큰 칸 632 — · `.m-balance[data-heavy="left|right"]`(저울 — `div` ×2(`.s-label` · `.s-h` · `p`), 무거운 쪽이 아래 · 받침과 막대는 SVG, 무거운 쪽 카드만 `.accent`) · `.m-lanes[data-…

```html
<div class="s-m w12 h2 bare"><div class="m-ladder" data-min="75" data-max="100" data-me="86"><div data-from="90" data-to="100"><p class="s-h">상향</p><p>내 점수보다 4 이상 위</p></div><div data-from="83" data-to="90" class="accent"><p class="s-h">적정</p><p>내 점수 앞뒤 3 안쪽</p></div><div data-from="75" data-to="83"><p class="s-h">안정</p><p>내 점수보다 3 이상 아래</p></div></div></div>
```

## .m-bookstack (그림 · 1 · midterm)
`.m-bookstack`(책 쌓기 — `div[.accent](ul > li 과목 … · .s-label 이름 · .s-h 과목 수)` ×2, 과목마다 흰 책등(560 × 60, 왼쪽 띠) 아래부터 쌓고 엇갈림, 바닥 맞춤, 강조 묶음의 띠 · 과목 수만 메인)

```html
<div class="s-m w12 h2 bare"><div class="m-bookstack"><div><ul><li>국어</li><li>수학</li><li>사회</li><li>과학</li></ul><span class="s-label">초등 6학년 단원평가</span><p class="s-h">4과목</p></div><div class="accent"><ul><li>국어</li><li>수학</li><li>영어</li><li>사회</li><li>과학</li><li>역사</li><li>도덕</li><li>기술 · 가정</li></ul><span class="s-label">중1 2학기 지필고사</span><p class="s-h">8과목</p></div></div></div>
```

## .m-scope (그림 · 1 · midterm)
`.m-scope`(시험 범위 — `div[data-from][data-to][data-pages][.accent](.s-h 과목)`, 교과서 = 흰 띠(길이 = 쪽수), 범위만큼 회색 · 강조 줄만 메인, 안에 'n~m쪽')

```html
<div class="s-m w12 h2 bare"><div class="m-scope"><div data-from="12" data-to="98" data-pages="220"><p class="s-h">국어</p></div><div data-from="8" data-to="86" data-pages="200" class="accent"><p class="s-h">수학</p></div><div data-from="10" data-to="74" data-pages="180"><p class="s-h">영어</p></div><div data-from="6" data-to="92" data-pages="210"><p class="s-h">과학</p></div></div></div>
```

## .m-omr (그림 · 1 · midterm)
`.m-omr`(OMR 답안지 — `.s-label` + `div[data-mark="1,3"][.err](p 메모)`, 줄마다 타이밍 표시 · 번호 · ①~⑤(칠한 칸은 메인 —, 실수 줄 옅은 메인 띠 + 메모 칩) · `.m-bell`(성적 분포 곡선 — `[data-mean][data-sd][data-me]` > `p.m-bl-mean` · `div.m-bl-me(.s-label · .s-h)`, 회색 종 곡선 · 평균 선 · 우리 아이 메인 선 · 오른쪽 꼬리 옅은 메인(`data-tint-fill="0.35"`) · 아래 눈금) · `.m-examday`(…

```html
<div class="s-m w12 h2 bare"><div class="m-omr"><span class="s-label">수학 답안지 · 예시</span><div data-mark="2"></div><div data-mark="4"></div><div data-mark="1,3" class="err"><p>두 개 칠함</p></div><div data-mark="5"></div><div data-mark="" class="err"><p>칠하지 않음</p></div></div></div>
```

## .m-bell (그림 · 1 · midterm)
`.m-bell`(성적 분포 곡선 — `[data-mean][data-sd][data-me]` > `p.m-bl-mean` · `div.m-bl-me(.s-label · .s-h)`, 회색 종 곡선 · 평균 선 · 우리 아이 메인 선 · 오른쪽 꼬리 옅은 메인(`data-tint-fill="0.35"`) · 아래 눈금)

```html
<div class="s-m w12 h2 bare"><div class="m-bell" data-mean="70" data-sd="15" data-me="85"><p class="m-bl-mean">평균 70점</p><div class="m-bl-me"><span class="s-label">우리 아이 85점</span><p class="s-h">상위 16%</p></div></div></div>
```

## .m-examday (그림 · 1 · midterm)
`.m-examday`(시험 날 시간표 — `div(.s-label 날 · ol > li[.accent](b 교시 · p 과목))` ×3, 과목 카드 세로, 강조 과목 한 칸만 메인 면) → 143종. `data-tint-fill`에 진하기 값을 줄 수 있다(기본 0.09).

```html
<div class="s-m w12 h2 bare"><div class="m-examday"><div><span class="s-label">첫째 날</span><ol><li><b>1교시</b><p>국어</p></li><li><b>2교시</b><p>도덕</p></li><li><b>3교시</b><p>과학</p></li></ol></div><div><span class="s-label">둘째 날</span><ol><li class="accent"><b>1교시</b><p>수학</p></li><li><b>2교시</b><p>역사</p></li><li><b>3교시</b><p>기술 · 가정</p></li></ol></div><div><span class="s-label">셋째 날</span><ol><li><b>1교시</b><p>영어</p></li><li><b>2교시</b><p>사회</p></li></ol></div></div></div>
```

## .m-baskets (그림 · 1 · money)
`.m-baskets`(바구니 둘 — `div[.accent](.s-label · ul > li 물건 …)` ×2, 흰 바구니 640 × 400 + 위 테두리 띠(강조는 메인) 안 물건 칩 가운데)

```html
<div class="s-m w12 h2 bare"><div class="m-baskets"><div class="accent"><span class="s-label">꼭 필요해요</span><ul><li>공책</li><li>우산</li><li>교통카드 충전</li><li>준비물</li></ul></div><div><span class="s-label">갖고 싶어요</span><ul><li>게임 아이템</li><li>인형</li><li>편의점 간식</li><li>스티커</li></ul></div></div></div>
```

## .m-coins (그림 · 1 · money)
`.m-coins`(동전 쌓기 — `div[data-n][.accent](b 금액 · span 때)` …, 동전 n개(흰 + 회색 테두리 · 강조는 메인) 아래부터, 바닥 선은 전체 한 줄 실제 요소)

```html
<div class="s-m w12 h2 bare"><div class="m-coins"><div data-n="1"><b>5천 원</b><span>1달</span></div><div data-n="2"><b>1만 원</b><span>2달</span></div><div data-n="3"><b>1만 5천 원</b><span>3달</span></div><div data-n="4"><b>2만 원</b><span>4달</span></div><div data-n="5"><b>2만 5천 원</b><span>5달</span></div><div data-n="6" class="accent"><b>3만 원</b><span>6달</span></div></div></div>
```

## .m-receipts (그림 · 1 · money)
`.m-receipts`(영수증 둘 — `div[.accent](.s-label 가게 · ul > li(span 물건 · b 값) · p.m-rc-total)` + 사이 `p.m-rc-gap` 차이 알약(메인 면), 강조 영수증은 메인 테두리)

```html
<div class="s-m w12 h2 bare"><div class="m-receipts"><div><p class="s-label">편의점</p><ul><li><span>우유</span><b>1,500원</b></li><li><span>과자</span><b>2,000원</b></li><li><span>음료</span><b>1,800원</b></li></ul><p class="m-rc-total"><span>합계</span><b>5,300원</b></p></div><p class="m-rc-gap">1,000원 차이</p><div class="accent"><p class="s-label">동네 마트</p><ul><li><span>우유</span><b>1,200원</b></li><li><span>과자</span><b>1,600원</b></li><li><span>음료</span><b>1,500원</b></li></ul><p class="m-rc-total"><span>합계</span><b>4,300원</b></p></div></div></div>
```

## .m-envelopes (그림 · 1 · money)
`.m-envelopes`(세 봉투 — `p.m-ev-src` 출발 알약 + `div[.accent](.s-big 비율 · .s-h · p)` ×3, 알약에서 봉투로 갈라지는 선 · 봉투 가로로 긴 봉투 520 × 400 · 위 덮개(옅게 칠한 삼각, 위 모서리는 봉투와 같은 원호) · 봉인 동그라미 자동 — 선만 그은 덮개는 어색 · 겹친 자국 ✗, 강조 봉투만 메인 면)

```html
<div class="s-m w12 h2 bare"><div class="m-envelopes"><p class="m-ev-src">한 달 용돈 2만 원</p><div><p class="s-big">50%</p><p class="s-h">쓰기</p><p>1만 원 · 간식 · 학용품</p></div><div class="accent"><p class="s-big">40%</p><p class="s-h">모으기</p><p>8천 원 · 저금통</p></div><div><p class="s-big">10%</p><p class="s-h">나누기</p><p>2천 원 · 기부 · 선물</p></div></div></div>
```

## .m-ledger (그림 · 1 · money)
`.m-ledger`(용돈 기입장 — `.m-lg-head(.s-label · p)` + `table`, `td.in` 들어온 돈 메인 글자 · `td.out` 나간 돈 회색 · 마지막 열 제목색, 강조 줄 옅은 메인 띠) → 155종. 두 학생 비교 `.m-twins`는 높이를 내용대로(막대 합이 작으면 위가 비어 떠 보였음).

```html
<div class="s-m w12 h2 bare"><div class="m-ledger"><div class="m-lg-head"><p class="s-label">용돈 기입장</p><p>5월 · 예시</p></div><table><tbody><tr><th>날짜</th><th>내용</th><th>들어온 돈</th><th>나간 돈</th><th>남은 돈</th></tr><tr><td>5월 1일</td><td>한 달 용돈</td><td class="in">+20,000</td><td></td><td>20,000</td></tr><tr><td>5월 3일</td><td>간식</td><td></td><td class="out">−1,500</td><td>18,500</td></tr><tr class="accent"><td>5월 3일</td><td>저금통에 넣기</td><td></td><td class="out">−8,000</td><td>10,500</td></tr><tr><td>5월 9일</td><td>공책</td><td></td><td class="out">−2,000</td><td>8,500</td></tr></tbody></table></div></div>
```

## .m-flags (그림 · 1 · perf)
`.m-flags[data-days]`(마감 깃발 줄 — `div[data-d][.accent]`(`b` 과목 · `span` 과제), 한 달 가로 선 + 1 · 8 · 15 · 22 · 29일 눈금, 마감마다 깃대 꼭대기에 흰 카드를 가운데로 꽂음(깃대 = 카드 아래 가운데 ~ 선), 세 단 사이 140으로 카드끼리 안 겹치게 · 깃대는 모두 카드 뒤에(문서 순서), 과제 글은 5자 안쪽, 강조 깃발 메인 — · `.m-halfring[data-a]`(반원 비율 — `div`(`.s-big` · `.s-h` · `p`) ×2, 반원 고리 왼쪽 회색 · 오른쪽 메인(…

```html
<div class="s-m w12 h2 bare"><div class="m-flags" data-days="31"><div data-d="3"><b>국어</b><span>독서 감상문</span></div><div data-d="7"><b>영어</b><span>말하기</span></div><div data-d="11"><b>과학</b><span>실험 보고서</span></div><div data-d="14"><b>사회</b><span>신문 만들기</span></div><div data-d="17" class="accent"><b>수학</b><span>포트폴리오</span></div><div data-d="21"><b>음악</b><span>가창</span></div><div data-d="24"><b>미술</b><span>작품 제출</span></div><div data-d="27"><b>국어</b><span>발표</span></div><div data-d="30"><b>체육</b><span>실기</span></div></div></div>
```

## .m-kanban (정보 · 1 · perf)
`.m-kanban`(칸반 — `div[.accent]`(`.s-h` · `ul > li`) ×3, 개수 칩 자동 · 빈 칸 '아직 없어요')

```html
<div class="s-m w12 h2 bare"><div class="m-kanban"><div class="accent"><p class="s-h">할 일</p><ul><li>국어 감상문</li><li>영어 말하기</li><li>과학 보고서</li><li>사회 신문</li><li>미술 작품</li></ul></div><div><p class="s-h">하는 중</p><ul><li>수학 포트폴리오</li></ul></div><div><p class="s-h">끝</p><ul></ul></div></div></div>
```

## .m-cue (정보 · 1 · perf)
`.m-cue`(발표 큐카드 — `div[.accent]`(`.s-h` · `p` · `.s-label` 시간 칩 — 칩은 문서 끝에 두고 위로 올림) ×3, 겹친 카드가 한 단씩 올라감)

```html
<div class="s-m w12 h2 bare"><div class="m-cue"><div><p class="s-h">도입</p><p>질문 하나로 시작</p><span class="s-label">30초</span></div><div class="accent"><p class="s-h">본론</p><p>근거 셋 · 자료 한 장</p><span class="s-label">2분</span></div><div><p class="s-h">마무리</p><p>한 문장 요약</p><span class="s-label">30초</span></div></div></div>
```

## .m-folders (정보 · 1 · perf)
`.m-folders`(포트폴리오 폴더 — `div[.accent]`(`.s-h` · `ul > li`) ×4, 탭 달린 회색 뒤판 + 삐져나온 종이 + 흰 앞판(강조 폴더 메인)) → 116종. 성적표 두 장 `.m-scorecard`도 이 덱에서 처음 썼다(칸 310 × 2, 상자 없는 칸 위아래 여백 0).

```html
<div class="s-m w12 h2 bare"><div class="m-folders"><div><p class="s-h">국어</p><ul><li>감상문 2편</li><li>발표 대본</li></ul></div><div><p class="s-h">영어</p><ul><li>말하기 원고</li><li>단어장</li></ul></div><div class="accent"><p class="s-h">과학</p><ul><li>실험 보고서</li><li>결과 표</li></ul></div><div><p class="s-h">사회</p><ul><li>신문 초안</li><li>자료 목록</li></ul></div></div></div>
```

## .m-onemany (정보 · 1 · phonics)
`.m-onemany`(글자 하나 · 여러 소리 — `.m-om-root`(`.s-label` + `.m-om-l` 글자) + `.m-om-leaves` > `div`(`.m-om-w` 낱말, 그 글자는 `<b>` · `p` 소리), 글자 칸(메인 면)에서 낱말 카드마다 곡선, 그 글자만 메인 · 글자 칸은 위아래 안쪽 여백 40을 줘 fitInk가 잉크 기준 정가운데로(소문자는 그냥 두면 아래로 처짐) — '26개 vs 44개' 개수 비교는 왜 소리가 더 많은지 설명하지 못해서, · `.m-jar`(쌓이는 병 — `[data-fill][data-marks="2주|4…

```html
<div class="s-m w12 h2 bare"><div class="m-onemany"><div class="m-om-root"><span class="s-label">글자 하나</span><p class="m-om-l">a</p></div><div class="m-om-leaves"><div><p class="m-om-w">c<b>a</b>t</p><p>/æ/</p></div><div><p class="m-om-w">c<b>a</b>ke</p><p>/eɪ/</p></div><div><p class="m-om-w">c<b>a</b>r</p><p>/ɑː/</p></div><div><p class="m-om-w">b<b>a</b>ll</p><p>/ɔː/</p></div></div></div></div>
```

## .m-radar (그림 · 1 · phonics)
`.m-radar`(다섯 영역 진단 — `[data-labels][data-values][data-hi]`, 흰 오각형 위 옅은 메인 다각형, 꼭짓점 바깥 이름 · 점수는 흰 카드, 강조 영역만 메인 테두리 · 글자 · 차트 620, 맨 위 이름 카드가 솟은 만큼 위 여백 56을 줘 대제목과 띄우고 칸 높이는 내용대로, · `.m-phonics`(소리 이어 붙이기 — `div`(`.m-ph-l` 글자 + `p` 소리) … `div.accent` 결과 낱말, + · = 자동, 글자는 그림이라 96px) · `.m-strips`(문장 길이 띠 — `div[data-w][…

```html
<div class="s-m w12 h2 bare"><div class="m-radar" data-labels="소리 읽기|듣기|어휘|말하기|문장 읽기" data-values="32,74,62,55,40" data-hi="0"></div></div>
```

## .m-phonics (그림 · 1 · phonics)
`.m-phonics`(소리 이어 붙이기 — `div`(`.m-ph-l` 글자 + `p` 소리) … `div.accent` 결과 낱말, + · = 자동, 글자는 그림이라 96px)

```html
<div class="s-m w12 h2 bare"><div class="m-phonics"><div><p class="m-ph-l">c</p><p>/k/</p></div><div><p class="m-ph-l">a</p><p>/æ/</p></div><div><p class="m-ph-l">t</p><p>/t/</p></div><div class="accent"><p class="m-ph-l">cat</p><p>고양이</p></div></div></div>
```

## .m-strips (그림 · 1 · phonics)
`.m-strips`(문장 길이 띠 — `div[data-w][.accent]` > `.s-h` 때 + `p.m-strip` 문장, 오른쪽 낱말 수 칩, 마지막 띠만 메인 테두리 · 메인 칩)

```html
<div class="s-m w12 h2 bare"><div class="m-strips"><div data-w="4"><p class="s-h">1주</p><p class="m-strip">I see a cat.</p></div><div data-w="6"><p class="s-h">4주</p><p class="m-strip">I see a big red cat.</p></div><div data-w="9" class="accent"><p class="s-h">8주</p><p class="m-strip">I see a big red cat on the mat.</p></div></div></div>
```

## .m-thermo (그림 · 1 · phonics)
`.m-thermo`(레벨 온도계 — `[data-min][data-max][data-from][data-to][data-step]` > `.s-big` · `.s-h` · `p`, 흰 관 + 메인 구 · 채움, 오른쪽 '시작 · 8주 뒤' 이름만(눈금 숫자 · 시작 점은 없어도 됨, · 시작 높이까지 옅은 메인 · 시작 → 도착은 진한 메인, 이름 오른쪽에 오른 만큼을 묶는 메인 괄호 + 그 가운데 높이에 큰 숫자 글 묶음(눈금을 빼니 허전해서), 모서리는 네 곳 같게) · `.m-path`(구불구불 길 — `div[.accent]` > `.s-label` 때 + …

```html
<div class="s-m w12 h2 bare"><div class="m-thermo" data-min="0" data-max="3" data-from="0.8" data-to="1.9" data-step="0.5"><p class="s-big">+1.1</p><p class="s-h">리딩 레벨</p><p>지난해 겨울반 평균</p></div></div>
```

## .m-path (그림 · 1 · phonics)
`.m-path`(구불구불 길 — `div[.accent]` > `.s-label` 때 + `.s-h` 이름, 정거장이 위아래로 번갈아 · 굵은 회색 길 + 흰 점선 · 마지막 정거장 메인)

```html
<div class="s-m w12 h2 bare"><div class="m-path"><div><span class="s-label">1 ~ 2주</span><p class="s-h">글자와 소리</p></div><div><span class="s-label">3 ~ 4주</span><p class="s-h">소리 이어 읽기</p></div><div><span class="s-label">5 ~ 6주</span><p class="s-h">자주 나오는 단어</p></div><div class="accent"><span class="s-label">7 ~ 8주</span><p class="s-h">첫 책 혼자 읽기</p></div></div></div>
```

## .m-wongoji (그림 · 1 · reading)
`.m-wongoji`(원고지 — `div[data-cols="18"]` > `.s-label` + `p[.hl]`, 글자 하나 = 칸 하나 · 첫 칸 들여쓰기 · 중심 문장 칸만 옅은 메인, 종이라 큰 흰 상자 예외, 칸 80px — 실제 문단 구조, 라벨은 상자 왼쪽 위 · 상자 높이는 원고지에 맞춰 잉크 기준 네 곳 67, → 61종. 칸용 조각 더하기: `.m-record`(학생부 문서 — `.s-label` 문서 이름(상자 왼쪽 위 · 잉크 기준 네 곳 67) + `.m-rec-row[.hl]` > `.s-h` 항목 + `p` 내용, 왼쪽 항목 칸은 배경색 …

```html
<div class="s-m w12 h2"><div class="m-wongoji" data-cols="18"><span class="s-label">원고지 · 한 문단</span><p class="hl">책을 읽으면 생각이 넓어진다. </p><p>다른 사람의 삶을 겪어 볼 수 있기 때문이다. 나도 주인공처럼 용기를 내 보고 싶어졌다.</p></div></div>
```

## .m-gates (그림 · 1 · sci-high)
`.m-gates`(관문 — `div(.s-big 인원 · .s-h 단계 · p)[.accent]` ×3, 오른쪽으로 갈수록 작아지는 원 셋(400 · 300 · 230, 마지막 메인 — 아치 문은 '이상하다'로 바꿈,, 숫자는 원 가운데 · 이름 · 한 줄은 아래 같은 높이, 사이 화살표) · `.m-venn3`(세 원 겹치기 — `div(.s-h · p)` ×3 + `p.m-v3-c` 가운데 메인 칩, 테두리 선 없이 옅은 회색 반투명 원 셋 — 겹칠수록 짙어짐(선이 복잡해 바꿈,, 원 이름은 원 바깥쪽 · 한 줄은 원 밖(세미볼드 · 제목 색,) · `.m-ri…

```html
<div class="s-m w12 h2 bare"><div class="m-gates"><div><p class="s-big">1,200명</p><p class="s-h">서류 지원</p><p>자기소개서 · 생기부</p></div><div><p class="s-big">360명</p><p class="s-h">면접 대상</p><p>탐구 · 소양 면접</p></div><div class="accent"><p class="s-big">120명</p><p class="s-h">최종 합격</p><p>열 명 중 한 명</p></div></div></div>
```

## .m-venn3 (그림 · 1 · sci-high)
`.m-venn3`(세 원 겹치기 — `div(.s-h · p)` ×3 + `p.m-v3-c` 가운데 메인 칩, 테두리 선 없이 옅은 회색 반투명 원 셋 — 겹칠수록 짙어짐(선이 복잡해 바꿈,, 원 이름은 원 바깥쪽 · 한 줄은 원 밖(세미볼드 · 제목 색,) · `.m-rings`(진행 고리 — `div[data-v][.accent](.s-h · b 값)` ×3, 안으로 작아지는 고리 셋 · 둥근 끝 진행 선 — 셋이 서로 구분되게 강조 하나는 메인 · 둘째는 옅은 메인(메인 42%, 학원 색 따라 `data-tint-stroke`) · 나머지는 옅은 회색(같은 색…

```html
<div class="s-m w12 h2 bare"><div class="m-venn3"><div><p class="s-h">수학</p><p>개념을 깊게</p></div><div><p class="s-h">과학</p><p>원리로 설명</p></div><div><p class="s-h">탐구</p><p>질문을 끝까지</p></div><p class="m-v3-c">영재성</p></div></div>
```

## .m-rings (그림 · 1 · sci-high)
`.m-rings`(진행 고리 — `div[data-v][.accent](.s-h · b 값)` ×3, 안으로 작아지는 고리 셋 · 둥근 끝 진행 선 — 셋이 서로 구분되게 강조 하나는 메인 · 둘째는 옅은 메인(메인 42%, 학원 색 따라 `data-tint-stroke`) · 나머지는 옅은 회색(같은 색 둘 ✗ · 회색 둘은 칙칙,, 오른쪽 이름 · 값) · `.m-wheel`(순환 바퀴 — `div(.s-h · p)[.accent]` ×4, 흰 원판(반지름 300 · 그림자) 위에 고리 네 조각 + 둥근 화살촉(시계 방향 — 허전해서 원판을 깔았음,, 글은 원판…

```html
<div class="s-m w12 h2 bare"><div class="m-rings"><div data-v="90"><p class="s-h">내신</p><b>90%</b></div><div data-v="35"><p class="s-h">탐구 활동</p><b>35%</b></div><div data-v="20" class="accent"><p class="s-h">면접 준비</p><b>20%</b></div></div></div>
```

## table.m-heat (그림 · 1 · science)
`.m-heat`(히트맵 표 — `table.m-heat` 머리 줄 + 줄 이름 + `td[data-v="54"]` 값(%)만큼 메인 진하기, 50 이상 흰 글자 — 상자 없는 칸 `s-m w12 h2 bare` 기본, 큰 흰 상자도 허용 — 단원 × 문항 유형 오답률. 강조할 곳이 한 열이면 `table[data-accent-col="3"]` — 농도 대신 칸 모두 흰색 · 회색 숫자, 그 열만 메인 — 상자 없는 칸에선 열마다 세로 카드 하나(머리 + 값, 사이 가는 줄, 카드는 표 뒤 실제 도형 `fitHeatCards`), 강조 열 카드는 메인 면 · 흰 숫자

```html
<div class="s-m w12 h2 bare"><table class="m-heat" data-accent-col="3"><tbody><tr><th></th><th>개념 문항</th><th>자료 해석</th><th>탐구 서술</th></tr><tr><td>물질과 규칙성</td><td data-v="18"></td><td data-v="54"></td><td data-v="41"></td></tr><tr><td>힘과 운동</td><td data-v="22"></td><td data-v="68"></td><td data-v="47"></td></tr><tr><td>화학 변화</td><td data-v="15"></td><td data-v="49"></td><td data-v="38"></td></tr><tr><td>생명 시스템</td><td data-v="12"></td><td data-v="36"></td><td data-v="29"></td></tr></tbody></table></div>
```

## .m-lab (그림 · 1 · science)
`.m-lab`(탐구 보고서 — 공책 종이, `.s-label` 보고서 제목 + `p[data-k="가설"]` 줄마다 항목 칩, 결론 줄 `.hl`, 큰 흰 상자 예외 — 실험 정리)

```html
<div class="s-m w12 h2"><div class="m-lab"><span class="s-label">탐구 보고서 · 온도와 용해도</span><p data-k="가설">물의 온도가 높을수록 설탕이 더 많이 녹는다</p><p data-k="변인">바꾸는 것: 물의 온도 · 같게 하는 것: 물의 양</p><p data-k="결과">20℃ 200g → 60℃ 287g 녹았다</p><p data-k="결론" class="hl">온도가 높을수록 용해도가 커진다</p></div></div>
```

## .m-scalebar (그림 · 1 · social)
`.m-scalebar[data-cm][data-km]`(축척 자 — `p.m-sb-map` · `p.m-sb-a` · `p.m-sb-b` · `p.m-sb-res`, 위 흰 지도 카드(두 점 · 선) + 아래 축척 막대 칸(회색 · 흰 번갈아, 두 점과 같은 폭) · 눈금 km + 결과 알약 메인 면) → 160종.

```html
<div class="s-m w12 h2 bare"><div class="m-scalebar" data-cm="6" data-km="3"><p class="m-sb-map">지도에서 6cm · 축척 1 : 50,000</p><p class="m-sb-a">학교</p><p class="m-sb-b">도서관</p><p class="m-sb-res">실제 거리 3km</p></div></div>
```

## .m-climate (그림 · 1 · social)
`.m-climate[data-rain][data-temp][data-hi]`(기후 그래프 — 크기 1680 × 653, `p.m-cl-legend > span(i · 글)` 범례, 12달 막대(회색 · 가장 많은 달만 메인, 위에 값) + 기온 선(메인 · 흰 점, 막대와 안 겹치게 위쪽 띠, 꼭대기 기온) · 막대는 위만 둥글고 바닥은 각지게 SVG 1440 × 560)

```html
<div class="s-m w12 h2 bare"><div class="m-climate" data-rain="17,21,56,89,102,133,394,364,169,51,52,22" data-temp="-2,1,6,13,18,22,25,26,21,15,7,0" data-hi="7"><p class="m-cl-legend"><span><i></i>강수량</span><span><i class="ln"></i>기온</span></p></div></div>
```

## .m-poppyramid (그림 · 1 · social)
`.m-poppyramid`(인구 피라미드 — `p.m-pp-l` · `p.m-pp-r` 위 이름 + `div[data-m][data-f][.accent](b 나이)` …, 가운데 나이 · 왼쪽 남자 · 오른쪽 여자 흰 막대(값 × 6px), 강조 줄 메인)

```html
<div class="s-m w12 h2 bare"><div class="m-poppyramid"><p class="m-pp-l">남자</p><p class="m-pp-r">여자</p><div data-m="30" data-f="48"><b>70세 이상</b></div><div data-m="56" data-f="62"><b>60대</b></div><div data-m="80" data-f="80" class="accent"><b>50대</b></div><div data-m="74" data-f="72"><b>40대</b></div><div data-m="62" data-f="58"><b>30대</b></div><div data-m="54" data-f="50"><b>20대</b></div><div data-m="44" data-f="42"><b>10대</b></div><div data-m="34" data-f="32"><b>10세 미만</b></div></div></div>
```

## .m-latlong (그림 · 1 · social)
`.m-latlong[data-lat][data-lon]`(위도 · 경도 격자 — `div.m-ll-card(.s-label · .s-h · p)`, 흰 판 없이 배경 위 격자(축 선만 진하게, · 30~45°N · 120~135°E 5°마다 선 + 메인 점 · 축까지 선, 오른쪽 위치 카드) · `.m-timezone`(시차 시계 — `div[data-h][data-m][.accent](.s-h 도시 · p 시각)` ×2 + `p.m-tz-gap` 차이 알약(메인 면), 흰 시계 12 · 3 · 6 · 9 · 시침 · 분침, 강조 시계 바늘만 메인) · `.m-sc…

```html
<div class="s-m w12 h2 bare"><div class="m-latlong" data-lat="37.5" data-lon="127"><div class="m-ll-card"><span class="s-label">우리 동네 위치</span><p class="s-h">서울</p><p>북위 37.5° · 동경 127°</p></div></div></div>
```

## .m-timezone (그림 · 1 · social)
`.m-timezone`(시차 시계 — `div[data-h][data-m][.accent](.s-h 도시 · p 시각)` ×2 + `p.m-tz-gap` 차이 알약(메인 면), 흰 시계 12 · 3 · 6 · 9 · 시침 · 분침, 강조 시계 바늘만 메인)

```html
<div class="s-m w12 h2 bare"><div class="m-timezone"><div data-h="21" data-m="0" class="accent"><p class="s-h">서울 · 동경 135° 기준</p><p>오후 9시</p></div><p class="m-tz-gap">9시간 차이</p><div data-h="12" data-m="0"><p class="s-h">런던 · 경도 0°</p><p>낮 12시</p></div></div></div>
```

## .m-stopwatch (그림 · 1 · speaking)
`.m-stopwatch`(스톱워치 — `[data-total][data-unit][data-label]` > `div[style="--v"][.accent]` `.s-h`, 흰 시계판 + 위 꼭지(옆 단추 ✗, + 가장자리 고리 구간(강조만 메인) + 눈금 12, 가운데 강조 시간, 오른쪽 전체 시간 + 범례) · `.m-nest`(겹 넓히기 — `div`(`.s-h` 이름 · `p` 예시) … `div.accent`, 왼쪽 아래를 중심으로 둥근 겹이 안쪽으로(겹마다 바깥 겹 왼쪽 아래 모서리에서 24px 띄움 — 면이 닿지 않게, 이름 · 예시는 각 겹 오른쪽 위…

```html
<div class="s-m w12 h2 bare"><div class="m-stopwatch" data-total="45" data-unit="분" data-label="영어 수업 한 시간"><div style="--v:30"><p class="s-h">선생님 설명</p></div><div style="--v:14"><p class="s-h">문제 풀이</p></div><div style="--v:1" class="accent"><p class="s-h">내가 말하기</p></div></div></div>
```

## .m-nest (그림 · 1 · speaking)
`.m-nest`(겹 넓히기 — `div`(`.s-h` 이름 · `p` 예시) … `div.accent`, 왼쪽 아래를 중심으로 둥근 겹이 안쪽으로(겹마다 바깥 겹 왼쪽 아래 모서리에서 24px 띄움 — 면이 닿지 않게, 이름 · 예시는 각 겹 오른쪽 위 · 오른쪽 정렬, 잉크 기준 위 여백 = 오른쪽 여백(약 44), 겹 사이 높이 168,(바깥 겹 흰색부터 회색 · 흰색 · 회색 차례로, 안쪽 겹은 그림자 · 테두리 없이 — 바깥 겹은 그림자만, 메인 테두리 ✗, · 겹 사이 160 · 네 모서리 같은 둥글기 56), 칸 높이는 내용대로 — PPT 때문에 바깥 겹…

```html
<div class="s-m w12 h2 bare"><div class="m-nest"><div><p class="s-h">낱말</p><p>apple</p></div><div><p class="s-h">한 문장</p><p>I like apples.</p></div><div><p class="s-h">주고받기</p><p>Do you like apples? Yes, I do.</p></div><div class="accent"><p class="s-h">1분 발표</p><p>My favorite fruit is …</p></div></div></div>
```

## .m-stress (그림 · 1 · speaking)
`.m-stress`(강세 점 — `div[data-s="ba|NA|na"]` > `.s-h` 낱말 · `p` 뜻, 대문자 음절이 강세 = 큰 메인 점 · 메인 글자, 낱말마다 흰 카드)

```html
<div class="s-m w12 h2 bare"><div class="m-stress"><div data-s="ba|NA|na"><p class="s-h">banana</p><p>바나나</p></div><div data-s="ho|TEL"><p class="s-h">hotel</p><p>호텔</p></div><div data-s="CHOC|o|late"><p class="s-h">chocolate</p><p>초콜릿</p></div></div></div>
```

## .m-wave (그림 · 1 · speaking)
`.m-wave`(녹음 파형 — `div[data-w="4685----37…"][.accent]` > `.s-h` · `p`, 글자 하나 = 막대(1~9 높이, '-' = 쉼), 쉼 3칸 이상이면 '멈춤' 칩, 강조 줄 막대만 메인, 막대 약 16px · 사이 13px — · `.m-qstack`(질문 카드 묶음 — `.m-qcard`(`.s-label` · `.m-q-en` 한 줄 · `p`) + `.m-qchips > span[.accent]`, 앞 카드 뒤로 두 장이 오른쪽 위로 비켜 겹침) · `.m-seats`(짝 자리 — `[data-pairs][data-…

```html
<div class="s-m w12 h2 bare"><div class="m-wave"><div data-w="4685----3745862-----37----------4786----5"><p class="s-h">연습 전</p><p>10초 녹음 · 멈춤 4번</p></div><div data-w="468573859-6748596738-475869473857-6948573" class="accent"><p class="s-h">연습 8주 뒤</p><p>10초 녹음 · 멈춤 없음</p></div></div></div>
```

## .m-qstack (그림 · 1 · speaking)
`.m-qstack`(질문 카드 묶음 — `.m-qcard`(`.s-label` · `.m-q-en` 한 줄 · `p`) + `.m-qchips > span[.accent]`, 앞 카드 뒤로 두 장이 오른쪽 위로 비켜 겹침)

```html
<div class="s-m w12 h2 bare"><div class="m-qstack"><div class="m-qcard"><span class="s-label">오늘의 질문</span><p class="m-q-en">What did you do last weekend?</p><p>지난 주말에 뭐 했어?</p></div><div class="m-qchips"><span class="accent">주말</span><span>가족</span><span>학교</span><span>좋아하는 것</span></div></div></div>
```

## .m-seats (그림 · 1 · speaking)
`.m-seats`(짝 자리 — `[data-pairs][data-hi][data-teacher]` > `p` 한 줄, 위 선생님 알약 · 짝마다 A · 흰 책상(말풍선 아이콘) · B, 강조 짝만 메인 자리)

```html
<div class="s-m w12 h2 bare"><div class="m-seats" data-pairs="3" data-hi="1" data-teacher="선생님 · 짝마다 돌며 듣기"><p>질문 카드로 묻고, 답하고, 바꿔서 다시</p></div></div>
```

## .m-planner (그림 · 1 · study)
`.m-planner[data-start][data-end]`(하루 플래너 — `div[data-from][data-to][.soft|.accent]`(`.s-h` · `p` 걸린 시간), 흰 종이 없이 배경 위 1200 × 620(칸 310 × 2로 키움) · 정시 선(#DCDEE4) 가운데에 시각, 블록은 흰 카드(.soft 회색) · 선에서 11px 떨어뜨려 블록 사이 22(붙어 보이면 답답,, 블록 높이 = 시간 — 30분 블록에도 글이 들어가게 4시간 안쪽 범위로, 강조 블록만 메인) · `.m-target`(목표 과녁 — `div`(`.s-label` 기간…

```html
<div class="s-m w12 h2 bare"><div class="m-planner" data-start="18" data-end="22"><div data-from="18" data-to="19.5"><p class="s-h">수학 학원</p><p>1시간 30분</p></div><div data-from="19.5" data-to="20.5" class="soft"><p class="s-h">저녁 · 휴대폰</p><p>1시간</p></div><div data-from="20.5" data-to="21.5"><p class="s-h">학원 숙제</p><p>1시간</p></div><div data-from="21.5" data-to="22" class="accent"><p class="s-h">혼자 복습</p><p>30분</p></div></div></div>
```

## .m-target (그림 · 1 · study)
`.m-target`(목표 과녁 — `div`(`.s-label` 기간 · `.s-h` 목표) ×4 바깥 → 가운데, 겹친 원 넷(흰 · 옅은 회색, 가운데 메인) + 원에서 오른쪽 목표로 잇는 선 — SVG, 원 + 글 덩어리를 실제 범위로 재서 가운데에 — `fitTargets`, · `.m-streak[data-on="1110000,…"]`(습관 체크판 — 주마다 한 줄 · 월 ~ 일 칸, 지킨 날 메인 칸 + 흰 체크(옅은 메인은 잘 안 보임,, 못 지킨 날 흰 칸 — 작심삼일) · `.m-forget[data-a][data-b][data-ticks]`(망각 …

```html
<div class="s-m w12 h2 bare"><div class="m-target"><div><span class="s-label">이번 학기</span><p class="s-h">수학 85점</p></div><div><span class="s-label">이번 달</span><p class="s-h">2단원 끝내기</p></div><div><span class="s-label">이번 주</span><p class="s-h">문제집 40쪽</p></div><div><span class="s-label">오늘</span><p class="s-h">8쪽 풀고 채점</p></div></div></div>
```

## .m-streak (그림 · 1 · study)
`.m-streak[data-on="1110000,…"]`(습관 체크판 — 주마다 한 줄 · 월 ~ 일 칸, 지킨 날 메인 칸 + 흰 체크(옅은 메인은 잘 안 보임,, 못 지킨 날 흰 칸 — 작심삼일) · `.m-forget[data-a][data-b][data-ticks]`(망각 곡선 — 회색 = 복습 안 함, 메인 = 1일 · 1주 · 1달마다 다시 올라 갈수록 완만, 두 곡선은 첫날까지 같음, 끝 이름 칩 둘은 곡선 끝 바로 위 · 마지막 복습 점 오른쪽(그래프와 겹치지 않게, — 모양만, 수치 ✗) · `.m-pomodoro[data-focus][data-re…

```html
<div class="s-m w12 h2 bare"><div class="m-streak" data-on="1110000,1110000,1100000,1110000"></div></div>
```

## .m-forget (그림 · 1 · study)
`.m-forget[data-a][data-b][data-ticks]`(망각 곡선 — 회색 = 복습 안 함, 메인 = 1일 · 1주 · 1달마다 다시 올라 갈수록 완만, 두 곡선은 첫날까지 같음, 끝 이름 칩 둘은 곡선 끝 바로 위 · 마지막 복습 점 오른쪽(그래프와 겹치지 않게, — 모양만, 수치 ✗) · `.m-pomodoro[data-focus][data-rest][data-n]`(집중 링 — `.m-pm-c`(`.s-big` · `p`) + `.m-pm-legend > div[.accent]`(`i` · `.s-h` · `p`) ×2, 집중 회색 · 쉬기 메인…

```html
<div class="s-m w12 h2 bare"><div class="m-forget" data-a="복습 안 함" data-b="세 번 복습" data-ticks="배운 날|1일 뒤|1주 뒤|1달 뒤"></div></div>
```

## .m-pomodoro (그림 · 1 · study)
`.m-pomodoro[data-focus][data-rest][data-n]`(집중 링 — `.m-pm-c`(`.s-big` · `p`) + `.m-pm-legend > div[.accent]`(`i` · `.s-h` · `p`) ×2, 집중 회색 · 쉬기 메인 조각이 번갈아 도는 고리 — 긴 쪽을 메인으로 칠하면 메인이 너무 많음, 범례 `.accent`도 쉬기 쪽)

```html
<div class="s-m w12 h2 bare"><div class="m-pomodoro" data-focus="25" data-rest="5" data-n="4"><div class="m-pm-c"><p class="s-big">2시간</p><p>한 번 앉아서</p></div><div class="m-pm-legend"><div><i></i><p class="s-h">25분 집중</p><p>휴대폰은 거실에</p></div><div class="accent"><i></i><p class="s-h">5분 쉬기</p><p>일어나서 물 마시기</p></div></div></div></div>
```

## .m-year (그림 · 1 · study)
`.m-year`(1년 사분원 — `div[data-in="봄"][.accent]`(`.s-label` 때 · `.s-h` · `p`) ×4, 원 지름 520을 왼쪽 위부터 시계 방향 네 조각(안엔 계절 이름), 글은 원 바깥 네 모서리 — 조각 안에 글을 넣으면 넘쳤음) → 110종. SVG 그림만 있는 도식(과녁 · 망각 곡선 · 사분원)은 흰 도형 검사에서 뺐다.

```html
<div class="s-m w12 h2 bare"><div class="m-year"><div class="accent" data-in="봄"><span class="s-label">3 ~ 5월</span><p class="s-h">계획 세우기</p><p>하루 플래너</p></div><div data-in="여름"><span class="s-label">6 ~ 8월</span><p class="s-h">집중 연습</p><p>25분 타이머</p></div><div data-in="가을"><span class="s-label">9 ~ 11월</span><p class="s-h">복습 루틴</p><p>1일 · 1주 · 1달</p></div><div data-in="겨울"><span class="s-label">12 ~ 2월</span><p class="s-h">혼자 시험 대비</p><p>스스로 계획</p></div></div></div>
```

## .m-chain (그림 · 1 · thinking)
`.m-chain`(개념 사슬 — `div[.accent]` > `.s-h` 개념 · `p` 학년, 테두리만 있는 둥근 고리가 겹쳐 사슬 + 고리 아래 흰 카드(main.js), 강조 고리만 메인)

```html
<div class="s-m w12 h2 bare"><div class="m-chain"><div><p class="s-h">나눗셈</p><p>3학년</p></div><div class="accent"><p class="s-h">분수</p><p>3학년</p></div><div><p class="s-h">분수의 덧셈</p><p>4학년</p></div><div><p class="s-h">약분과 통분</p><p>5학년</p></div></div></div>
```

## .m-fraction (그림 · 1 · thinking)
`.m-fraction`(분수 막대 — `div[data-n][data-k]` 줄마다 세로 분수 + n칸 막대 중 k칸 옅은 메인, 크기가 같으면 메인 세로 점선)

```html
<div class="s-m w12 h2 bare"><div class="m-fraction"><div data-n="2" data-k="1"></div><div data-n="4" data-k="2"></div><div data-n="8" data-k="4"></div></div></div>
```

## .m-notes (그림 · 1 · vocab)
`.m-notes`(붙임쪽지 — `div[.accent]`(`.s-h` 낱말 64 · `p` 과목) ×6, 흰 쪽지 3 × 2 + 위 가운데 회색 테이프, 가운데 줄은 14px 내려 붙임, 쪽지 240 + 위 18 더 띄워 낱말이 테이프에 붙지 않게 — 아이가 물어본 말 · 모아 둔 낱말)

```html
<div class="s-m w12 h2 bare"><div class="m-notes"><div><p class="s-h">관찰</p><p>과학</p></div><div><p class="s-h">분모</p><p>수학</p></div><div><p class="s-h">기후</p><p>사회</p></div><div><p class="s-h">갈등</p><p>국어</p></div><div class="accent"><p class="s-h">증발</p><p>과학</p></div><div><p class="s-h">직각</p><p>수학</p></div></div></div>
```

## .m-hanja (그림 · 1 · vocab)
`.m-hanja`(한자 뿌리 — `.m-hj-c`(`.m-hj-ch` 한자 200 · `.s-h` 훈음) 메인 칸 → 곡선 화살표 넷 → `ul > li`(`.s-h` 낱말, 그 한자 음절은 `mark` = 메인 · `p` 뜻) ×4)

```html
<div class="s-m w12 h2 bare"><div class="m-hanja"><div class="m-hj-c"><p class="m-hj-ch">學</p><p class="s-h">배울 학</p></div><ul><li><p class="s-h"><mark>학</mark>교</p><p>배우는 곳</p></li><li><p class="s-h"><mark>학</mark>생</p><p>배우는 사람</p></li><li><p class="s-h"><mark>학</mark>습</p><p>배우고 익힘</p></li><li><p class="s-h">과<mark>학</mark></p><p>자연을 배우는 과목</p></li></ul></div></div>
```

## .m-blanks (그림 · 1 · vocab)
`.m-blanks[data-a][data-b]`(빈칸 문장 — `p` 문장 하나(어려운 낱말 `mark`)를 main.js가 흰 띠 둘로: 위 = 낱말 형광펜, 아래 = 그 자리가 회색 빈칸 + ?)

```html
<div class="s-m w12 h2 bare"><div class="m-blanks" data-a="낱말을 아는 아이가 읽는 문장" data-b="낱말을 모르는 아이가 읽는 문장"><p>물이 <mark>증발</mark>하여 수증기가 되는 <mark>현상</mark>을 <mark>관찰</mark>해 봅시다.</p></div></div>
```

## .m-iceberg (그림 · 1 · vocab)
`.m-iceberg`(빙산 — `.m-ib-top` · `.m-ib-low`(`.s-big` · `.s-h`), 물 위 흰 봉우리 = 작은 몫 · 물 아래 메인 덩어리 = 큰 몫, 옅은 메인 물 — SVG, 물빛은 메인에서 rgb로 계산, 흰 도형 검사에서 뺌)

```html
<div class="s-m w12 h2 bare"><div class="m-iceberg"><div class="m-ib-top"><p class="s-big">30%</p><p class="s-h">고유어 · 외래어</p></div><div class="m-ib-low"><p class="s-big">70%</p><p class="s-h">한자어</p></div></div></div>
```

## .m-frayer (그림 · 1 · vocab)
`.m-frayer`(낱말 네 칸 — `div`(`.s-label` · `.s-h`) ×4 흰 카드 2 × 2 + `.m-fr-c` 가운데 메인 원(배경색 테두리 14), 글은 카드 가운데 정렬 — 원과 겹치지 않게 한 줄 10자 안쪽, 뜻 · 비슷한 말 · 반대말 · 예문)

```html
<div class="s-m w12 h2 bare"><div class="m-frayer"><div><span class="s-label">뜻</span><p class="s-h">액체가 기체로 변함</p></div><div><span class="s-label">비슷한 말</span><p class="s-h">기화</p></div><div><span class="s-label">반대말</span><p class="s-h">응결</p></div><div><span class="s-label">예문</span><p class="s-h">빨래의 물이 증발해요</p></div><p class="m-fr-c">증발</p></div></div>
```

## .m-subjects (정보 · 1 · vocab)
`.m-subjects`(과목 넷 — `div`(아이콘 · `.s-h` 과목 · `ul > li`(`b` 낱말 · `span` 한자)) ×4 세로 흰 카드, 낱말은 예시라 본문 크기 · 세미볼드)

```html
<div class="s-m w12 h2 bare"><div class="m-subjects"><div><i data-icon="book"></i><p class="s-h">국어</p><ul><li><b>주제</b><span>主題</span></li><li><b>인물</b><span>人物</span></li><li><b>갈등</b><span>葛藤</span></li></ul></div><div><i data-icon="calc"></i><p class="s-h">수학</p><ul><li><b>분모</b><span>分母</span></li><li><b>직각</b><span>直角</span></li><li><b>평행</b><span>平行</span></li></ul></div><div><i data-icon="globe"></i><p class="s-h">사회</p><ul><li><b>지역</b><span>地域</span></li><li><b>기후</b><span>氣候</span></li><li><b>인구</b><span>人口</span></li></ul></div><div><i data-icon="flask"></i><p class="s-h">과학</p><ul><li><b>관찰</b><span>觀察</span></li><li><b>증발</b><span>蒸發</span></li><li><b>실험</b><span>實驗</span></li></ul></div></div></div>
```

## .m-flash (그림 · 1 · vocab)
`.m-flash`(낱말 카드 — `.m-fl-front`(`.s-label` · `.m-fl-word` 96) → `.m-fl-back.accent`(`.s-label` · `.m-fl-hj > div`(`b` 한자 96 · `p` 훈음) · `.m-fl-mean`), 카드마다 뒤에 겹친 카드 한 장 · 사이 화살표, 라벨 + 내용은 한 덩어리로 카드 가운데) → 103종.

```html
<div class="s-m w12 h2 bare"><div class="m-flash"><div class="m-fl-front"><span class="s-label">앞면</span><p class="m-fl-word">관찰</p></div><div class="m-fl-back accent"><span class="s-label">뒷면</span><div class="m-fl-hj"><div><b>觀</b><p>볼 관</p></div><div><b>察</b><p>살필 찰</p></div></div><p class="m-fl-mean">자세히 살펴봄</p></div></div></div>
```

## .m-staff (그림 · 1)
`.m-staff`(정사각 사진 카드 셋 — 사진 · `.s-h` · `p`, 강조 카드 이름만 메인)

```html
<div class="s-m w12 h2 bare"><div class="m-staff"><div><figure class="m-photo" data-kind="강사 사진" data-hint="정사각 1 : 1"></figure><p class="s-h">김○○ 선생님</p><p>수학 · 12년</p></div><div class="accent"><figure class="m-photo" data-kind="강사 사진" data-hint="정사각 1 : 1"></figure><p class="s-h">이○○ 선생님</p><p>영어 · 9년</p></div><div><figure class="m-photo" data-kind="강사 사진" data-hint="정사각 1 : 1"></figure><p class="s-h">박○○ 선생님</p><p>국어 · 10년</p></div></div></div>
```

## .m-series (그림 · 1)
`.m-series`(단계별 표지 넷이 한 단씩 올라감, 마지막 `.accent` 메인)

```html
<div class="s-m w12 h2 bare"><div class="m-series"><div><span class="s-label">1단계</span><figure class="m-photo" data-kind="교재 사진" data-hint="세로 3 : 4"></figure><p class="s-h">개념 다지기</p><p>교과서 기본</p></div><div><span class="s-label">2단계</span><figure class="m-photo" data-kind="교재 사진" data-hint="세로 3 : 4"></figure><p class="s-h">유형 연습</p><p>대표 문제</p></div><div><span class="s-label">3단계</span><figure class="m-photo" data-kind="교재 사진" data-hint="세로 3 : 4"></figure><p class="s-h">서술형</p><p>풀이 쓰기</p></div><div class="accent"><span class="s-label">4단계</span><figure class="m-photo" data-kind="교재 사진" data-hint="세로 3 : 4"></figure><p class="s-h">실전 기출</p><p>학교별 시험</p></div></div></div>
```

## .m-examnote (그림 · 1)
`.m-examnote`(세로 액자 + 오른쪽 메모 칩 `li[data-y="22"]`(`b` 문항 · `span`) — 사진 안 그 높이의 메인 점에서 선, 사진 + 메모 덩어리를 실제 범위로 가운데 — `fitTargets`)

```html
<div class="s-m w12 h2 bare"><div class="m-examnote"><div class="m-frame"><figure class="m-photo" data-kind="시험지 사진" data-hint="세로 3 : 4"></figure></div><ul><li data-y="22"><b>5번</b><span>부호 실수 — 계산은 맞았어요</span></li><li data-y="50"><b>12번</b><span>개념 혼동 — 다음 주 다시 설명</span></li><li data-y="78"><b>서술형 2</b><span>풀이 중간이 빠졌어요</span></li></ul></div></div>
```

## .m-examvs (그림 · 1)
`.m-examvs`(전 · 후 시험지 두 장, 라벨 · 점수는 액자 왼쪽 위에 겹친 칩 `.m-vs-chip`(`.s-label` · `b.s-big`), 사이 화살표)

```html
<div class="s-m w12 h2 bare"><div class="m-examvs"><div><div class="m-frame"><figure class="m-photo" data-kind="첫 시험지 사진" data-hint="세로 3 : 4"></figure></div><p class="m-vs-chip"><span class="s-label">1학기 중간</span><b class="s-big">62점</b></p></div><div class="accent"><div class="m-frame"><figure class="m-photo" data-kind="최근 시험지 사진" data-hint="세로 3 : 4"></figure></div><p class="m-vs-chip"><span class="s-label">2학기 기말</span><b class="s-big">91점</b></p></div></div></div>
```

## .m-versus (정보 · 1)
`.m-versus`(전 `div` → 후 `div.accent`, 각 `.s-label` · `.s-big`, 화살표 자동)

```html
<div class="s-m w8 h2 bare"><div class="m-versus"><div><span class="s-label">등록 전</span><p class="s-big">14<small>점</small></p></div><div class="accent"><span class="s-label">한 학기 뒤</span><p class="s-big">31<small>점</small></p></div></div><p class="m-caption">서술형 점수 <span class="hl">2.2배</span> · 풀이를 끝까지 쓰게 됐어요</p></div>
```

## .m-chips (정보 · 1)
`.m-chips`(`span[.accent|.soft]`)

```html
<div class="s-m w8 h2 bare"><div class="m-chips"><span>꼼꼼한 관리</span><span class="soft">오답 노트</span><span>매달 상담</span><span class="accent">스스로 공부하는 습관</span><span class="soft">서술형 자신감</span><span>친절한 선생님</span><span>작은 반</span></div><p class="m-caption">설문에 답한 학부모 <span class="hl">124명</span> · 2026년 6월</p></div>
```

## .m-scale (정보 · 1)
`.m-scale` > `.s-scale-row`(등급 눈금) + `p`

```html
<div class="s-m w12 h2 bare"><div class="m-scale"><div class="s-scale-row"><div><div class="s-flag"></div><div class="s-cell">1</div></div><div class="goal"><div class="s-flag"><span>1년 뒤</span></div><div class="s-cell">2</div></div><div class="range"><div class="s-flag"></div><div class="s-cell">3</div></div><div class="now"><div class="s-flag"><span>지금</span></div><div class="s-cell">4</div></div><div><div class="s-flag"></div><div class="s-cell">5</div></div><div><div class="s-flag"></div><div class="s-cell">6</div></div><div><div class="s-flag"></div><div class="s-cell">7</div></div><div><div class="s-flag"></div><div class="s-cell">8</div></div><div><div class="s-flag"></div><div class="s-cell">9</div></div></div></div><p class="m-memo"><b>1년 평균 2등급 상승</b>대상 학생 46명</p></div>
```

## .m-dialog (정보 · 1)
`.m-dialog`(`div[.me]` > 아이콘 + `.s-say`)

```html
<div class="s-m w8 h2 bare"><div class="m-dialog"><div><i data-icon="family"></i><div class="s-say"><span class="s-label">학부모님</span><p>숙제는 다 하는데 왜 그대로일까요?</p></div></div><div class="me"><i data-icon="school"></i><div class="s-say"><span class="s-label">담당 선생님</span><p>푼 문제를 설명할 수 있는지부터 볼게요.</p></div></div></div></div>
```

## .m-pyramid (그림 · 1)
`.m-pyramid`(위에서부터 `div[.accent]`)

```html
<div class="s-m w8 h2 bare"><div class="m-pyramid"><div class="accent"><p class="s-h">실전</p></div><div><p class="s-h">서술형</p></div><div><p class="s-h">유형 연습</p></div><div><p class="s-h">개념 이해</p></div></div></div>
```

## .m-funnel (그림 · 1)
`.m-funnel`(깔때기 — `div[style="--w:100"]` 줄마다 `.s-h` · `.s-value`, 마지막 `.accent`)

```html
<div class="s-m w8 h2 bare"><div class="m-funnel"><div style="--w:100"><p class="s-h">상담 신청</p><p class="s-value">200명</p></div><div style="--w:80"><p class="s-h">레벨 진단</p><p class="s-value">160명</p></div><div style="--w:62"><p class="s-h">등록</p><p class="s-value">92명</p></div><div style="--w:46" class="accent"><p class="s-h">목표 고교 합격</p><p class="s-value">46명</p></div></div><p class="m-caption">등록생 합격률 <span class="hl">50%</span> · 92명 중 46명</p></div>
```

## .s-hero-center (정보 · 1)
`.s-hero-center` · 도넛 비율 `.s-ratio` > `.s-donut[style="--v:40"]` + `.s-ratio-text` · 진행 막대 `.s-meters.s-panel-box` > `.s-meter[style="--v"][.accent]`(`.s-h` · `.s-value` · `p`) | 막대·도넛 값은 % |

```html
<section class="slide"><header class="s-head"><p class="s-index">숫자 하나 · 가운데 큰 숫자 .s-hero-center</p><h2 class="s-title">작년 수강생 10명 중 9명이 올랐어요</h2></header><div class="s-body"><div class="s-hero-center"><p class="s-big">92<small>%</small></p><p class="s-h">성적이 오른 학생 비율</p><p>한 학기 이상 다닌 학생 124명 중 114명이에요</p></div></div></section>
```

## .s-ratio (그림 · 1)
`.s-ratio` > `.s-donut[style="--v:40"]` + `.s-ratio-text` · 진행 막대 `.s-meters.s-panel-box` > `.s-meter[style="--v"][.accent]`(`.s-h` · `.s-value` · `p`) | 막대·도넛 값은 % |

```html
<section class="slide"><header class="s-head"><p class="s-index">숫자 하나 · 도넛 비율 .s-ratio</p><h2 class="s-title">서술형이 시험의 40%를 차지해요</h2></header><div class="s-body"><div class="s-ratio"><div class="s-donut" style="--v:40"><p class="s-big">40<small>%</small></p></div><div class="s-ratio-text"><span class="s-label">서술형 비중</span><p class="s-h">100점 중 40점이<br>서술형에서 갈려요</p><p>객관식을 다 맞혀도<br>서술형에서 등급이 바뀌어요</p></div></div></div></section>
```

## .s-meters (그림 · 1)
`.s-meters.s-panel-box` > `.s-meter[style="--v"][.accent]`(`.s-h` · `.s-value` · `p`) | 막대·도넛 값은 % |

```html
<section class="slide"><header class="s-head"><p class="s-index">숫자 · 진행 막대 .s-meters</p><h2 class="s-title">32명 중 28명이 90점을 넘었어요</h2></header><div class="s-body"><div class="s-meters s-panel-box"><div class="s-meter accent" style="--v:87"><p class="s-h">90점 이상</p><p class="s-value">28/32명</p><p>서술형까지 안정적인 학생</p></div><div class="s-meter" style="--v:28"><p class="s-h">100점</p><p class="s-value">9/32명</p><p>실수 없이 만점을 받은 학생</p></div></div></div></section>
```

## .s-statrow (정보 · 1)
`.s-statrow.s-panel-box` > `div[.accent]`(`.s-big` · `.s-h` · `p`) | 3~4칸 |

```html
<section class="slide"><header class="s-head"><p class="s-index">여러 숫자 · 숫자 한 줄 .s-statrow</p><h2 class="s-title">숫자로 보는 우리 학원 10년</h2></header><div class="s-body"><div class="s-statrow s-panel-box"><div class="accent"><p class="s-big">1,240<small>명</small></p><p class="s-h">졸업생</p><p>2016~2026년</p></div><div><p class="s-big">32<small>명</small></p><p class="s-h">서울대</p><p>정시·수시 합계</p></div><div><p class="s-big">58<small>명</small></p><p class="s-h">의·치·한</p><p>재수생 포함</p></div><div><p class="s-big">4.8<small>년</small></p><p class="s-h">평균 재원 기간</p><p>중1부터 고3까지</p></div></div></div></section>
```

## .s-hbars (그림 · 1)
`.s-hbars.s-panel-box[data-unit]` > `div[style="--v"][.accent]` 이름 · 강조 열 표 `.s-table[data-accent-col="3"]` | |

```html
<section class="slide"><header class="s-head"><p class="s-index">비교 · 가로 막대 .s-hbars</p><h2 class="s-title">한 학기 만에 서술형 점수가 두 배예요</h2></header><div class="s-body"><div class="s-hbars s-panel-box" data-unit="점"><div style="--v:14">등록 전</div><div style="--v:21">1학기 기말</div><div style="--v:31" class="accent">2학기 중간</div></div></div></section>
```

## .s-table (정보 · 1)
`.s-table[data-accent-col="3"]` | |

```html
<section class="slide"><header class="s-head"><p class="s-index">비교 · 강조 열 표 .s-table[data-accent-col]</p><h2 class="s-title">같은 90분, 쓰는 방식이 달라요</h2></header><div class="s-body"><div class="s-table" data-accent-col="3"><table><tbody><tr><th>구분</th><th>일반 수업</th><th>우리 수업</th></tr><tr><td>개념 설명</td><td>50분</td><td>20분</td></tr><tr><td>혼자 풀기</td><td>20분</td><td>40분</td></tr><tr><td>말로 설명</td><td>없음</td><td>20분</td></tr><tr><td>오답 정리</td><td>숙제로</td><td>10분</td></tr></tbody></table></div></div></section>
```

## .s-flow (정보 · 1)
`.s-flow` > `div[.accent]`(`p.s-pill`(`.s-num` + `.s-h`) · `p`) · 세로 번호 줄 `ol.s-vsteps` > `li[.accent]`(`.s-num` + `.s-row-text`) · 계단 `.s-stairs` > `div[.accent]`(`.s-label` · `.s-h` · `p`) | 3~4개 |

```html
<section class="slide"><header class="s-head"><p class="s-index">순서 · 알약 흐름 .s-flow</p><h2 class="s-title">상담부터 첫 수업까지 일주일이에요</h2></header><div class="s-body"><div class="s-flow"><div><p class="s-pill"><span class="s-num">1</span><span class="s-h">상담 신청</span></p><p>전화나 문자로<br>시간을 잡아요</p></div><div class="accent"><p class="s-pill"><span class="s-num">2</span><span class="s-h">레벨 진단</span></p><p>40분 진단으로<br>약점을 찾아요</p></div><div><p class="s-pill"><span class="s-num">3</span><span class="s-h">반 배정</span></p><p>진단 결과로<br>반을 정해요</p></div><div><p class="s-pill"><span class="s-num">4</span><span class="s-h">첫 수업</span></p><p>담당 선생님과<br>바로 시작해요</p></div></div></div></section>
```

## ol.s-vsteps (정보 · 1)

```html
<section class="slide"><header class="s-head"><p class="s-index">순서 · 세로 번호 줄 .s-vsteps</p><h2 class="s-title">오답은 세 단계로 정리해요</h2></header><div class="s-body"><ol class="s-vsteps"><li><span class="s-num">1</span><div class="s-row-text"><p class="s-h">틀린 이유 분류</p><p>개념·계산·실수 중 무엇인지 나눠요</p></div></li><li class="accent"><span class="s-num">2</span><div class="s-row-text"><p class="s-h">말로 다시 설명</p><p>선생님 앞에서 풀이를 설명해요</p></div></li><li><span class="s-num">3</span><div class="s-row-text"><p class="s-h">비슷한 문제 풀기</p><p>같은 개념 문제를 세 개 더 풀어요</p></div></li></ol></div></section>
```

## .s-stairs (그림 · 1)
`.s-stairs` > `div[.accent]`(`.s-label` · `.s-h` · `p`) | 3~4개 |

```html
<section class="slide"><header class="s-head"><p class="s-index">순서·성장 · 계단 .s-stairs</p><h2 class="s-title">한 단계씩 올라가요</h2></header><div class="s-body"><div class="s-stairs"><div><span class="s-label">1단계</span><p class="s-h">개념 이해</p><p>교과서 개념을<br>설명할 수 있어요</p></div><div><span class="s-label">2단계</span><p class="s-h">유형 연습</p><p>기본 유형을<br>혼자 풀어요</p></div><div><span class="s-label">3단계</span><p class="s-h">서술형</p><p>풀이를 글로<br>쓸 수 있어요</p></div><div class="accent"><span class="s-label">4단계</span><p class="s-h">실전</p><p>시험 시간 안에<br>끝까지 풀어요</p></div></div></div></section>
```

## .s-months (정보 · 1)
`.s-months.s-panel-box`(`p.s-mhead` 13개 · 줄마다 `p.s-mname` + `p.s-mbar[style="--from;--to"][.accent]`) | 줄 3~4 |

```html
<section class="slide"><header class="s-head"><p class="s-index">시간 · 열두 달 띠 .s-months</p><h2 class="s-title">1년 공부는 시험에 맞춰 짜요</h2></header><div class="s-body"><div class="s-months s-panel-box"><p class="s-mhead">구분</p><p class="s-mhead">1</p><p class="s-mhead">2</p><p class="s-mhead">3</p><p class="s-mhead">4</p><p class="s-mhead">5</p><p class="s-mhead">6</p><p class="s-mhead">7</p><p class="s-mhead">8</p><p class="s-mhead">9</p><p class="s-mhead">10</p><p class="s-mhead">11</p><p class="s-mhead">12</p><p class="s-mname">선행</p><p class="s-mbar" style="--from:1;--to:2">2학년 1학기</p><p class="s-mbar" style="--from:7;--to:8">2학년 2학기</p><p class="s-mname">내신</p><p class="s-mbar accent" style="--from:4;--to:4">중간</p><p class="s-mbar accent" style="--from:6;--to:6">기말</p><p class="s-mbar accent" style="--from:10;--to:10">중간</p><p class="s-mbar accent" style="--from:12;--to:12">기말</p><p class="s-mname">서술형</p><p class="s-mbar" style="--from:3;--to:5">서술형 1</p><p class="s-mbar" style="--from:9;--to:11">서술형 2</p></div></div></section>
```

## .s-stack (그림 · 1)
`.s-stack`도 상자(`.s-panel-box`) 없이 같게)

```html
<section class="slide"><header class="s-head"><p class="s-index">비율 · 쌓인 막대 .s-stack</p><h2 class="s-title">감점의 절반은 개념에서 나와요</h2></header><div class="s-body"><div class="s-stack"><div class="s-stackbar"><span style="--v:48"></span><span style="--v:27"></span><span style="--v:17"></span><span style="--v:8"></span></div><div class="s-legend"><div><i></i><p class="s-h">개념 이해</p><p class="s-value">48%</p></div><div><i></i><p class="s-h">계산 실수</p><p class="s-value">27%</p></div><div><i></i><p class="s-h">문제 해석</p><p class="s-value">17%</p></div><div><i></i><p class="s-h">시간 부족</p><p class="s-value">8%</p></div></div></div></div></section>
```

## .s-dots (그림 · 1)
`.s-dots`(`.s-dotgrid[data-v]` + `.s-ratio-text`) | 조각 2~4 |

```html
<section class="slide"><header class="s-head"><p class="s-index">비율 · 점 100개 .s-dots</p><h2 class="s-title">100명 중 64명은 문제를 외워요</h2></header><div class="s-body"><div class="s-dots"><div class="s-dotgrid" data-v="64"></div><div class="s-ratio-text"><p class="s-big">64<small>명</small></p><p class="s-h">유형을 외워서 푸는 학생</p><p>문제가 조금만 바뀌어도<br>손을 못 대요</p></div></div></div></section>
```

## .s-grid4 (정보 · 1)
`.s-grid4` > `div[.accent]`(`<i data-icon>` + `div`(`.s-h` · `p`)) · 가운데 + 둘레 넷 `.s-hub`(`.s-hub-core` + `div` 4개) · 아이콘 줄 `.s-iconrow.s-panel-box` > `div`(`<i data-icon>` · `.s-h` · `p`) | |

```html
<section class="slide"><header class="s-head"><p class="s-index">묶음 · 2×2 격자 .s-grid4</p><h2 class="s-title">수업 밖에서도 네 가지를 챙겨요</h2></header><div class="s-body"><div class="s-grid4"><div><i data-icon="bell"></i><div><p class="s-h">매일 숙제 알림</p><p>했는지 문자로 보내요</p></div></div><div class="accent"><i data-icon="clipboard"></i><div><p class="s-h">주간 리포트</p><p>오답 이유를 정리해요</p></div></div><div><i data-icon="exam"></i><div><p class="s-h">월말 평가</p><p>한 달 범위를 점검해요</p></div></div><div><i data-icon="family"></i><div><p class="s-h">학부모 상담</p><p>매달 20분씩 이야기해요</p></div></div></div></div></section>
```

## .s-hub (정보 · 1)
`.s-hub`(`.s-hub-core` + `div` 4개) · 아이콘 줄 `.s-iconrow.s-panel-box` > `div`(`<i data-icon>` · `.s-h` · `p`) | |

```html
<section class="slide"><header class="s-head"><p class="s-index">묶음 · 가운데 + 둘레 넷 .s-hub</p><h2 class="s-title">모든 수업은 한 가지 원칙에서 나와요</h2></header><div class="s-body"><div class="s-hub"><div class="s-hub-core"><p class="s-h">설명할 수 있어야<br>아는 것</p><p>우리 학원의 원칙</p></div><div><p class="s-h">수학</p><p>풀이를 말로 설명해요</p></div><div><p class="s-h">영어</p><p>문법 규칙을 설명해요</p></div><div><p class="s-h">국어</p><p>근거를 찾아 설명해요</p></div><div><p class="s-h">과학</p><p>원리를 그림으로 설명해요</p></div></div></div></section>
```

## .s-iconrow (정보 · 1)
`.s-iconrow.s-panel-box` > `div`(`<i data-icon>` · `.s-h` · `p`) | |

```html
<section class="slide"><header class="s-head"><p class="s-index">묶음 · 아이콘 줄 .s-iconrow</p><h2 class="s-title">등록하면 이렇게 함께해요</h2></header><div class="s-body"><div class="s-iconrow s-panel-box"><div><i data-icon="search"></i><p class="s-h">레벨 진단</p><p>약점 단원 찾기</p></div><div><i data-icon="compass"></i><p class="s-h">학습 로드맵</p><p>1년 계획 세우기</p></div><div><i data-icon="note"></i><p class="s-h">오답 노트</p><p>매주 함께 점검</p></div><div><i data-icon="chat"></i><p class="s-h">첫 상담</p><p>한 달 뒤 결과 공유</p></div></div></div></section>
```

## .s-versus (정보 · 1)
`.s-versus` > `div`(전)

```html
<section class="slide"><header class="s-head"><p class="s-index">숫자 비교 · 전후 숫자 .s-versus</p><h2 class="s-title">한 학기 만에 서술형이 두 배가 됐어요</h2></header><div class="s-body"><div class="s-versus"><div><span class="s-label">등록 전</span><p class="s-big">14<small>점</small></p><p>풀이를 쓰다 멈추고<br>답만 적었어요</p></div><span class="s-vs"></span><div class="accent"><span class="s-label">한 학기 뒤</span><p class="s-big">31<small>점</small></p><p>풀이 과정을 끝까지<br>쓸 수 있게 됐어요</p></div></div></div></section>
```

## .s-lead (정보 · 1)
`.s-lead` > `.s-lead-main`(`.s-big` · `.s-h` · `p`) + `ul.s-lead-list` > `li`(`.s-row-text` + `.s-value`) | 목록 3줄 |

```html
<section class="slide"><header class="s-head"><p class="s-index">여러 숫자 · 대표 숫자 + 목록 .s-lead</p><h2 class="s-title">작년 고3, 수시 합격률 89%</h2></header><div class="s-body"><div class="s-lead"><div class="s-lead-main"><p class="s-big">89<small>%</small></p><p class="s-h">수시 합격률</p><p>46명 중 41명이<br>수시로 합격했어요</p></div><ul class="s-lead-list"><li><div class="s-row-text"><p class="s-h">인서울 대학</p><p>서울 소재 4년제</p></div><p class="s-value">27명</p></li><li><div class="s-row-text"><p class="s-h">교대·사범대</p><p>교육 계열</p></div><p class="s-value">8명</p></li><li><div class="s-row-text"><p class="s-h">의약 계열</p><p>의·치·한·약·수</p></div><p class="s-value">6명</p></li></ul></div></div></section>
```

## .s-ox (정보 · 1)
`.s-ox.s-panel-box` > `table`(`th[.accent]`, 칸 `td.o` / `td.x`) | 항목 3~5 × 선택지 2~3 |

```html
<section class="slide"><header class="s-head"><p class="s-index">비교 · O/X 표 .s-ox</p><h2 class="s-title">무엇이 다른지 한눈에 비교해 보세요</h2></header><div class="s-body"><div class="s-ox s-panel-box"><table><tbody><tr><th>관리 항목</th><th>일반 학원</th><th class="accent">우리 학원</th></tr><tr><td>매일 숙제 확인</td><td class="o"></td><td class="o"></td></tr><tr><td>오답 이유 기록</td><td class="x"></td><td class="o"></td></tr><tr><td>말로 설명하는 수업</td><td class="x"></td><td class="o"></td></tr><tr><td>매달 학부모 상담</td><td class="x"></td><td class="o"></td></tr></tbody></table></div></div></section>
```

## .s-cycle (정보 · 1)
`.s-cycle` > `div[.accent]`(`.s-num` · `.s-h` · `p`) + `div.s-return` > `span` | 로드맵 4~6 · 순환 3~4 |

```html
<section class="slide"><header class="s-head"><p class="s-index">순서 · 순환 .s-cycle</p><h2 class="s-title">한 단원은 이 순서를 돌며 익혀요</h2></header><div class="s-body"><div class="s-cycle"><div><span class="s-num">1</span><p class="s-h">개념 설명</p><p>핵심만 짚어요</p></div><div class="accent"><span class="s-num">2</span><p class="s-h">혼자 풀기</p><p>힌트만 들고 풀어요</p></div><div><span class="s-num">3</span><p class="s-h">말로 설명</p><p>풀이를 설명해요</p></div><div><span class="s-num">4</span><p class="s-h">점검 테스트</p><p>통과하면 다음 단원</p></div><div class="s-return"><span>막히면 다시 1단계로</span></div></div></div></section>
```

## .s-week (정보 · 1)
`.s-week.s-panel-box` > `div`(`p.s-day` + `div.s-block[.accent \| .soft]`(`.s-h` · `p`)) | 요일 5~6 |

```html
<section class="slide"><header class="s-head"><p class="s-index">시간 · 주간 일정 .s-week</p><h2 class="s-title">한 주는 이렇게 흘러가요</h2></header><div class="s-body"><div class="s-week s-panel-box"><div><p class="s-day">월</p><div class="s-block accent"><p class="s-h">수학 수업</p><p>오후 5시</p></div></div><div><p class="s-day">화</p><div class="s-block soft"><p class="s-h">오답 클리닉</p><p>오후 6시</p></div></div><div><p class="s-day">수</p><div class="s-block accent"><p class="s-h">수학 수업</p><p>오후 5시</p></div></div><div><p class="s-day">목</p><div class="s-block"><p class="s-h">자습 관리</p><p>오후 7시</p></div></div><div><p class="s-day">금</p><div class="s-block accent"><p class="s-h">수학 수업</p><p>오후 5시</p></div></div><div><p class="s-day">토</p><div class="s-block soft"><p class="s-h">주간 테스트</p><p>오전 10시</p></div></div></div></div></section>
```

## .s-scale (그림 · 1)
`.s-scale-row`(등급 눈금) + `p`

```html
<section class="slide"><header class="s-head"><p class="s-index">수준 · 등급 눈금 .s-scale</p><h2 class="s-title">지금 4등급이라도 2등급까지 갈 수 있어요</h2></header><div class="s-body"><div class="s-scale s-panel-box"><div class="s-scale-row"><div><div class="s-flag"></div><div class="s-cell">1</div></div><div class="goal"><div class="s-flag"><span>1년 뒤</span></div><div class="s-cell">2</div></div><div class="range"><div class="s-flag"></div><div class="s-cell">3</div></div><div class="now"><div class="s-flag"><span>지금</span></div><div class="s-cell">4</div></div><div><div class="s-flag"></div><div class="s-cell">5</div></div><div><div class="s-flag"></div><div class="s-cell">6</div></div><div><div class="s-flag"></div><div class="s-cell">7</div></div><div><div class="s-flag"></div><div class="s-cell">8</div></div><div><div class="s-flag"></div><div class="s-cell">9</div></div></div><p>수학 등급 기준 · 1년 동안 평균 <b>2등급</b> 올랐어요</p></div></div></section>
```

## .s-tags (정보 · 1)
`.s-tags.s-panel-box` > `span[.accent \| .soft]` · 두 줄 체크리스트 `ul.s-checks2.s-panel-box` > `li`(`<i class="s-check">` + `.s-h`) | 알약 6~10 · 체크 6~8 |

```html
<section class="slide"><header class="s-head"><p class="s-index">묶음 · 키워드 알약 .s-tags</p><h2 class="s-title">학부모님이 꼽은 우리 학원의 장점</h2></header><div class="s-body"><div class="s-tags s-panel-box"><span>꼼꼼한 관리</span><span class="soft">오답 노트</span><span>매달 상담</span><span class="accent">스스로 공부하는 습관</span><span class="soft">서술형 자신감</span><span>친절한 선생님</span><span>주간 리포트</span><span class="soft">작은 반</span></div></div></section>
```

## .s-pyramid (그림 · 1)
`.s-pyramid` > `div[.accent]`(`.s-h` · `p`) 위에서부터 | 3~4줄 |

```html
<section class="slide"><header class="s-head"><p class="s-index">위계 · 피라미드 .s-pyramid</p><h2 class="s-title">실력은 아래부터 쌓여요</h2></header><div class="s-body"><div class="s-pyramid"><div class="accent"><p class="s-h">실전</p><p>시간 안에 끝까지</p></div><div><p class="s-h">서술형</p><p>풀이를 글로 쓰기</p></div><div><p class="s-h">유형 연습</p><p>기본 유형을 혼자 풀기</p></div><div><p class="s-h">개념 이해</p><p>교과서 개념을 말로 설명하기</p></div></div></div></section>
```

## .s-profile (정보 · 1)
`.s-profile.s-panel-box` > `.s-profile-id`(`.s-avatar` > `<i data-icon>` · `.s-label` · `.s-h` · `p`) + `ul` > `li`(`<i class="s-check">` + `p`) | 경력 3~4 |

```html
<section class="slide"><header class="s-head"><p class="s-index">사람 · 강사 소개 .s-profile</p><h2 class="s-title">담당 선생님을 소개해요</h2></header><div class="s-body"><div class="s-profile s-panel-box"><div class="s-profile-id"><div class="s-avatar"><i data-icon="people"></i></div><span class="s-label">중등 수학</span><p class="s-h">김○○ 선생님</p><p>수학교육과 졸업</p></div><ul><li><i class="s-check"></i><p>중등 수학 지도 12년</p></li><li><i class="s-check"></i><p>가온중·누리중 내신 전담 6년</p></li><li><i class="s-check"></i><p>서술형 교재 집필 3권</p></li><li><i class="s-check"></i><p>담당 반 평균 21점 상승(2026)</p></li></ul></div></div></section>
```

## ul.s-faq (정보 · 1)

```html
<section class="slide"><header class="s-head"><p class="s-index">말 · 자주 묻는 질문 .s-faq</p><h2 class="s-title">상담에서 가장 많이 묻는 세 가지</h2></header><div class="s-body"><ul class="s-faq s-panel-box"><li><span class="s-q">Q</span><p class="s-h">중간에 들어가도 따라갈 수 있나요?</p><p>레벨 진단으로 비어 있는 단원부터 채운 뒤 반에 합류해요.</p></li><li><span class="s-q">Q</span><p class="s-h">숙제는 얼마나 나오나요?</p><p>하루 30분 안에 끝나는 양만 내고, 오답 정리를 꼭 함께해요.</p></li><li><span class="s-q">Q</span><p class="s-h">성적이 안 오르면 어떻게 하나요?</p><p>두 달마다 반과 계획을 다시 조정하고 상담으로 알려 드려요.</p></li></ul></div></section>
```

## .s-reviews (정보 · 1)
`.s-reviews` > `div[.accent]`(`.s-stars` · `blockquote` · `.s-who`) | 질문 3 · 후기 2~3 |

```html
<section class="slide"><header class="s-head"><p class="s-index">말 · 후기 묶음 .s-reviews</p><h2 class="s-title">먼저 다닌 학부모님들의 이야기</h2></header><div class="s-body"><div class="s-reviews"><div><p class="s-stars">★★★★★</p><blockquote>숙제 검사보다<br>오답 정리를 더 챙겨 줘요</blockquote><p class="s-who">중2 학부모 · 다닌 지 1년</p></div><div class="accent"><p class="s-stars">★★★★★</p><blockquote>아이가 먼저<br>공부 이야기를 해요</blockquote><p class="s-who">중3 학부모 · 다닌 지 2년</p></div><div><p class="s-stars">★★★★★</p><blockquote>매달 상담에서<br>계획을 같이 세워요</blockquote><p class="s-who">고1 학부모 · 다닌 지 3년</p></div></div></div></section>
```

## ul.s-checks2 (정보 · 1)

```html
<section class="slide"><header class="s-head"><p class="s-index">묶음 · 두 줄 체크리스트 .s-checks2</p><h2 class="s-title">등록하면 첫 달에 이것을 해요</h2></header><div class="s-body"><ul class="s-checks2 s-panel-box"><li><i class="s-check"></i><p class="s-h">레벨 진단</p></li><li><i class="s-check"></i><p class="s-h">학습 로드맵 상담</p></li><li><i class="s-check"></i><p class="s-h">약점 단원 정리</p></li><li><i class="s-check"></i><p class="s-h">오답 노트 만들기</p></li><li><i class="s-check"></i><p class="s-h">주간 리포트 시작</p></li><li><i class="s-check"></i><p class="s-h">한 달 뒤 결과 상담</p></li></ul></div></section>
```

## 보조 글 .m-bignum (1 · korean)
`.m-bignum` > `.s-big`(60pt, 강조는 `span.hl`)

```html
<div class="s-grid"><div class="s-m w12 h2 bare"><div class="m-bignum"><p class="s-big">10명 중 <span class="hl">7명</span></p><p class="s-h">지난해 중2 서술형에서 감점됐어요</p><div class="m-chips"><span>느낌만 적음</span><span class="soft">시어 인용 없음</span><span>조건 빠뜨림</span><span class="accent">근거 없이 결론만</span><span class="soft">문장 미완성</span><span>글자 수 초과</span></div></div></div></div>
```

