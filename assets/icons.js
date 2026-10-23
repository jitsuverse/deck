// 아이콘 (100x100 좌표계)
// - 2D: 플랫(ICONS_2D) — 옅은 회색 몸체 + 메인 컬러 + 진한 메인 컬러 면을 겹쳐 그림. 선 없음, 모서리 둥글게

// 둥근 모서리 사각형
const rrect = (x, y, w, h, r) =>
  `M${x + r} ${y}h${w - 2 * r}q${r} 0 ${r} ${r}v${h - 2 * r}q0 ${r} ${-r} ${r}h${-(w - 2 * r)}q${-r} 0 ${-r} ${-r}v${-(h - 2 * r)}q0 ${-r} ${r} ${-r}Z`;

const circle = (cx, cy, r) =>
  `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${r * 2} 0 a${r} ${r} 0 1 0 ${-r * 2} 0Z`;

export const ICONS = {
  bulb: 'M50 6C28 6 14 22 14 40c0 14 8 22 16 30v8h40v-8c8-8 16-16 16-30C86 22 72 6 50 6Z M34 84h32v6q0 4-4 4H38q-4 0-4-4Z',
  chart: 'M10 60h18v32H10Z M40 36h18v56H40Z M70 10h18v82H70Z',
  check: `${circle(50, 50, 44)} M26 50l8-8 10 10 22-22 8 8-30 30Z`,
  heart: 'M50 88C20 66 6 50 6 32 6 18 17 8 30 8c10 0 16 6 20 14 4-8 10-14 20-14 13 0 24 10 24 24 0 18-14 34-44 56Z',
  star: 'M50 6l12 30 32 2-25 20 9 32-28-18-28 18 9-32L6 38l32-2Z',
  chat: 'M14 12h72q8 0 8 8v40q0 8-8 8H44L24 86V68H14q-8 0-8-8V20q0-8 8-8Z',
  target: `${circle(50, 50, 44)} ${circle(50, 50, 30)} ${circle(50, 50, 16)}`,
  doc: 'M20 6h44l20 20v68H20Z M32 40h40v6H32Z M32 54h40v6H32Z M32 68h28v6H32Z',
};

// 2D 플랫: [톤, 패스, 옵션] — 면 위주, 선 없음, 모서리는 모두 둥글게
// 톤: gray(옅은 회색 몸체) · grayDark(회색 그늘) · main(메인 컬러) · deep(진한 메인) · white · ink(메인 조각 위의 흰 조각)
// 옵션: { t: transform, round: 다각형 모서리를 둥글게 만드는 같은 색 테두리 두께, line: 채우지 않고 끝이 둥근 선으로만 그릴 두께 }
export const ICONS_2D = {
  bulb: [
    ['gray', circle(50, 38, 27)],
    ['gray', rrect(37, 48, 26, 18, 5)],
    ['grayDark', 'M50 11a27 27 0 0 1 0 54Z'],
    ['white', rrect(47, 27, 6, 25, 3)],
    ['deep', rrect(35, 66, 30, 9, 4.5)],
    ['main', rrect(40, 79, 20, 8, 4)],
  ],
  chart: [
    ['gray', rrect(12, 12, 76, 76, 14)],
    ['main', rrect(24, 52, 12, 26, 4)],
    ['deep', rrect(44, 36, 12, 42, 4)],
    ['main', rrect(64, 24, 12, 54, 4)],
    ['grayDark', rrect(20, 76, 60, 5, 2.5)],
  ],
  check: [ // 달력 + 체크
    ['gray', rrect(14, 20, 72, 68, 12)],
    ['main', rrect(14, 20, 72, 22, 12)],
    ['gray', 'M14 36h72v6H14Z'],
    ['deep', `${rrect(28, 11, 7, 16, 3.5)} ${rrect(65, 11, 7, 16, 3.5)}`],
    ['deep', 'M32 61l7-7 8 8 15-15 7 7-22 22Z', { round: 6 }],
  ],
  heart: [
    ['gray', rrect(12, 12, 76, 76, 20)],
    ['main', ICONS.heart, { t: 'translate(19 21) scale(0.62)', round: 8 }],
    ['ink', circle(36, 38, 4.5)],
  ],
  star: [ // 리본 배지
    ['gray', 'M37 58L28 90l10-6 6 10 7-34Z', { round: 6 }],
    ['grayDark', 'M63 58l9 32-10-6-6 10-7-34Z', { round: 6 }],
    ['main', circle(50, 40, 28)],
    ['deep', circle(50, 40, 18)],
    ['white', ICONS.star, { t: 'translate(39.5 29.5) scale(0.21)', round: 14 }],
  ],
  chat: [
    ['gray', 'M10 16h54v36H34L22 63V52H10Z', { round: 12 }],
    ['main', 'M38 42h52v34H80v11L67 76H38Z', { round: 12 }],
    ['ink', `${rrect(47, 52, 34, 5, 2.5)} ${rrect(47, 63, 22, 5, 2.5)}`],
  ],
  target: [
    ['gray', circle(50, 50, 42)],
    ['ink', circle(50, 50, 30)],
    ['main', circle(50, 50, 20)],
    ['deep', circle(50, 50, 9)],
  ],
  doc: [
    ['gray', 'M24 10h38l16 16v64H24Z', { round: 12 }],
    ['grayDark', 'M62 10l16 16H64q-2 0-2-2Z', { round: 6 }],
    ['main', rrect(33, 36, 26, 6, 3)],
    ['grayDark', `${rrect(33, 49, 36, 5, 2.5)} ${rrect(33, 59, 36, 5, 2.5)} ${rrect(33, 69, 24, 5, 2.5)}`],
  ],
  book: [ // 펼친 책 + 책갈피
    ['gray', 'M10 24q20-8 40 4v58q-20-10-40-4Z', { round: 6 }],
    ['grayDark', 'M50 28q20-12 40-4v58q-20-6-40 4Z', { round: 6 }],
    ['deep', rrect(47, 26, 6, 62, 3)],
    ['main', 'M68 18h11v28l-5.5-5-5.5 5Z', { round: 4 }],
  ],
  clock: [
    ['gray', circle(50, 50, 42)],
    ['ink', circle(50, 50, 31)],
    ['grayDark', `${rrect(48, 22, 4, 7, 2)} ${rrect(48, 71, 4, 7, 2)} ${rrect(22, 48, 7, 4, 2)} ${rrect(71, 48, 7, 4, 2)}`],
    ['deep', rrect(47, 29, 6, 24, 3)],
    ['main', rrect(47, 47, 22, 6, 3)],
    ['deep', circle(50, 50, 5)],
  ],
  people: [ // 사람들
    ['gray', `${circle(25, 36, 10)} M9 74q0-20 16-20t16 20Z`, { round: 4 }],
    ['gray', `${circle(75, 36, 10)} M59 74q0-20 16-20t16 20Z`, { round: 4 }],
    ['main', `${circle(50, 38, 13)} M27 86q0-28 23-28t23 28Z`, { round: 4 }],
  ],
  cap: [ // 학사모
    ['gray', 'M28 48v18q22 14 44 0V48L50 58Z', { round: 6 }],
    ['main', 'M50 18L92 38L50 58L8 38Z', { round: 6 }],
    ['deep', `${rrect(78, 38, 4, 24, 2)} ${circle(80, 64, 5)}`],
  ],
  rocket: [
    ['main', 'M32 52L18 72h16Z M68 52l14 20H66Z', { round: 6 }],
    ['gray', 'M50 8q20 18 18 54H32Q30 26 50 8Z', { round: 6 }],
    ['ink', circle(50, 36, 9)],
    ['main', circle(50, 36, 5)],
    ['deep', rrect(40, 62, 20, 8, 4)],
    ['main', 'M43 74h14l-7 16Z', { round: 6 }],
  ],
  megaphone: [ // 확성기 (모집·공지)
    ['grayDark', 'M30 58l6 24h10l-4-22Z', { round: 6 }],
    ['main', rrect(12, 38, 16, 24, 6)],
    ['gray', 'M26 40L70 18v64L26 60Z', { round: 8 }],
    ['deep', rrect(68, 14, 10, 72, 5)],
  ],
  // 2026-10-19 사용자 '표지 아이콘 다양화' — 학원 콘텐츠에 자주 맞는 9개 더함(같은 아이콘이 덱마다 반복되던 것)
  pencil: [ // 연필 (글쓰기·필기·서술형)
    ['gray', 'M37 24h26v48H37Z', { t: 'rotate(40 50 50)' }], // 몸통 아래는 각지게 — 깎은 부분과 틈 없이 이어지게(2026-10-22 디자이너)
    ['main', rrect(37, 6, 26, 18, 8), { t: 'rotate(40 50 50)' }],
    ['deep', rrect(37, 21, 26, 7, 2), { t: 'rotate(40 50 50)' }],
    ['grayDark', 'M37 71.5H63L51.6 91.2Q50 94 48.4 91.2Z', { t: 'rotate(40 50 50)' }], // 깎은 부분은 몸통과 같은 폭에서 시작, 끝만 둥글게
    ['deep', 'M44.35 84H55.65L51.6 91.2Q50 94 48.4 91.2Z', { t: 'rotate(40 50 50)' }], // 심은 깎은 부분 선을 그대로 따라감
  ],
  trophy: [ // 트로피 (성적 우수·수상·합격)
    ['gray', `${rrect(14, 18, 22, 24, 11)} ${rrect(64, 18, 22, 24, 11)}`],
    ['main', 'M28 12h44v24q0 24-22 24T28 36Z', { round: 6 }],
    ['ink', ICONS.star, { t: 'translate(40.5 21) scale(0.19)', round: 12 }],
    ['deep', rrect(44, 58, 12, 14, 3)],
    ['gray', rrect(32, 70, 36, 9, 4.5)],
    ['grayDark', rrect(26, 80, 48, 10, 5)],
  ],
  search: [ // 돋보기 + 막대 (분석·진단)
    ['deep', 'M64 70l6-6 20 20q3 3 0 6t-6 0Z', { round: 6 }],
    ['main', circle(42, 42, 32)],
    ['ink', circle(42, 42, 23)],
    ['main', rrect(30, 44, 6, 12, 3)],
    ['deep', rrect(39, 36, 6, 20, 3)],
    ['main', rrect(48, 30, 6, 26, 3)],
  ],
  flask: [ // 실험 플라스크 (과학·탐구)
    ['gray', 'M40 14h20v24l22 38q4 10-6 12H24q-10-2-6-12l22-38Z', { round: 6 }],
    ['main', 'M31 60h38l11 18q2 6-4 7H24q-6-1-4-7Z', { round: 4 }],
    ['ink', `${circle(44, 72, 4)} ${circle(57, 67, 3)}`],
    ['deep', rrect(35, 8, 30, 9, 4.5)],
  ],
  globe: [ // 지구본 (영어·외국어·해외) — 2026-10-19 다시 그림: 메인 구 + 끝 둥근 받침 고리 + 둥근 받침대(대륙 덩어리 ✗, 각진 선 ✗)
    ['grayDark', 'M54 9.5A37 37 0 0 1 54 82.5', { line: 7 }],
    ['main', circle(46, 46, 30)],
    // 구 안 경위선은 뺌(2026-10-19 사용자 — 미니멀하게): 메인 구 + 받침 고리 + 받침대만
    ['deep', rrect(43, 81, 10, 9, 4)],
    ['gray', rrect(28, 89, 40, 8, 4)],
  ],
  calc: [ // 계산기 (수학·연산)
    ['gray', rrect(20, 8, 60, 84, 14)],
    ['ink', rrect(29, 17, 42, 20, 6)],
    ['main', rrect(46, 24, 18, 6, 3)],
    ['grayDark', `${rrect(29, 45, 11, 10, 4)} ${rrect(44.5, 45, 11, 10, 4)} ${rrect(60, 45, 11, 10, 4)} ${rrect(29, 60, 11, 10, 4)} ${rrect(44.5, 60, 11, 10, 4)} ${rrect(29, 75, 11, 10, 4)} ${rrect(44.5, 75, 11, 10, 4)}`],
    ['main', rrect(60, 60, 11, 25, 4)],
  ],
  gift: [ // 선물 상자 (이벤트·무료 체험·혜택)
    ['gray', rrect(16, 46, 68, 44, 8)],
    ['main', 'M50 34q-24-24-30-10t30 10Z M50 34q24-24 30-10t-30 10Z', { round: 4 }],
    ['main', rrect(10, 32, 80, 16, 7)],
    ['deep', `${rrect(44, 32, 12, 16, 3)} ${rrect(45, 48, 10, 42, 3)}`],
  ],
  loop: [ // 돌아오는 화살표(반복 · 다시 하기) — trend처럼 회색 카드 위 둥근 선 + 진한 화살촉, 2026-10-22 코딩 덱
    ['gray', rrect(12, 12, 76, 76, 14)],
    ['main', 'M64.6 38.5 A22 22 0 1 1 42.5 29.3', { line: 9 }],
    ['deep', 'M38.4 21.6 L45.4 41.6 L57.8 27.4 Z', { round: 4 }],
  ],
  branch: [ // 이정표(두 갈래 길 고르기 — 조건 · 선택), 2026-10-22 코딩 덱
    ['gray', rrect(45, 14, 10, 76, 5)],
    ['grayDark', rrect(34, 84, 32, 8, 4)],
    ['main', 'M28 20 H68 L80 31 L68 42 H28 Z', { round: 5 }],
    ['deep', 'M72 50 H32 L20 61 L32 72 H72 Z', { round: 5 }],
  ],
  compass: [ // 나침반 (진로·방향·로드맵)
    ['gray', circle(50, 50, 42)],
    ['ink', circle(50, 50, 31)],
    ['grayDark', `${rrect(48, 21, 4, 6, 2)} ${rrect(48, 73, 4, 6, 2)} ${rrect(21, 48, 6, 4, 2)} ${rrect(73, 48, 6, 4, 2)}`],
    ['main', 'M50 26l9 24H41Z', { round: 4 }],
    ['deep', 'M50 74l-9-24h18Z', { round: 4 }],
    ['gray', circle(50, 50, 5)],
  ],
  house: [ // 집 (학부모·가정 학습·우리 학원)
    ['gray', rrect(20, 44, 60, 46, 6)],
    ['main', 'M50 12L88 44q2 4-2 4H14q-4 0-2-4Z', { round: 6 }],
    ['deep', rrect(42, 62, 16, 28, 5)],
    ['ink', rrect(27, 55, 11, 11, 3)],
    ['ink', rrect(62, 55, 11, 11, 3)],
  ],
  // ---- 2026-10-20 설명회 슬라이드용으로 더함(디자이너 요청: 더 다양하게) ----
  school: [ // 학교 건물 (학교·내신·학교 분석)
    ['gray', rrect(16, 42, 68, 46, 6)],
    ['main', 'M50 14L88 40q2 4-2 4H14q-4 0-2-4Z', { round: 6 }],
    ['deep', rrect(42, 62, 16, 26, 4)],
    ['white', rrect(24, 54, 12, 10, 3)],
    ['white', rrect(64, 54, 12, 10, 3)],
    ['ink', circle(50, 32, 5)],
  ],
  flag: [ // 깃발 (목표·출발·결심)
    ['grayDark', rrect(22, 10, 7, 80, 3.5)],
    ['main', 'M29 14h48q4 0 2 4l-8 12 8 12q2 4-2 4H29Z', { round: 6 }],
    ['deep', rrect(12, 84, 28, 8, 4)],
  ],
  medal: [ // 메달 (1등·수상·합격)
    ['gray', 'M30 8h14l10 30H40Z', { round: 6 }],
    ['grayDark', 'M70 8H56L46 38h14Z', { round: 6 }],
    ['main', circle(50, 62, 27)],
    ['deep', circle(50, 62, 18)],
    ['white', ICONS.star, { t: 'translate(40 52) scale(0.2)', round: 14 }],
  ],
  crown: [ // 왕관 (최상위·1위·명문)
    ['main', 'M18 64L14 30l20 16 16-26 16 26 20-16-4 34Z', { round: 6 }],
    ['deep', rrect(18, 70, 64, 14, 5)],
    ['ink', circle(30, 56, 4)],
    ['ink', circle(50, 52, 4)],
    ['ink', circle(70, 56, 4)],
  ],
  trend: [ // 오르는 그래프 (성적 상승·변화)
    ['gray', rrect(12, 12, 76, 76, 14)],
    ['main', 'M24 70L42 52l14 10 20-26', { line: 9 }],
    ['deep', 'M64 28h16v16Z', { round: 5 }],
  ],
  clipboard: [ // 클립보드 체크리스트 (관리·점검)
    ['gray', rrect(18, 16, 64, 76, 10)],
    ['deep', rrect(36, 9, 28, 14, 6)],
    ['main', rrect(28, 36, 10, 10, 3)],
    ['main', rrect(28, 52, 10, 10, 3)],
    ['main', rrect(28, 68, 10, 10, 3)],
    ['white', rrect(44, 38, 28, 6, 3)],
    ['white', rrect(44, 54, 28, 6, 3)],
    ['white', rrect(44, 70, 20, 6, 3)],
  ],
  note: [ // 스프링 공책 (오답 노트·기록)
    ['gray', rrect(22, 10, 62, 80, 10)],
    ['main', rrect(16, 10, 20, 80, 8)],
    ['white', circle(26, 26, 3.5)],
    ['white', circle(26, 43, 3.5)],
    ['white', circle(26, 60, 3.5)],
    ['white', circle(26, 77, 3.5)],
    ['grayDark', rrect(44, 30, 30, 5, 2.5)],
    ['grayDark', rrect(44, 46, 30, 5, 2.5)],
    ['grayDark', rrect(44, 62, 20, 5, 2.5)],
  ],
  hourglass: [ // 모래시계 (남은 시간·기한)
    ['gray', 'M28 19h44q0 20-16 31 16 11 16 31H28q0-20 16-31-16-11-16-31Z', { round: 4 }],
    ['main', 'M36 26h28q-2 12-14 18-12-6-14-18Z'],
    ['main', 'M50 60q12 6 14 16H36q2-10 14-16Z'],
    ['deep', rrect(22, 10, 56, 9, 4.5)],
    ['deep', rrect(22, 81, 56, 9, 4.5)],
  ],
  pin: [ // 위치 핀 (우리 동네·학원 위치)
    ['gray', rrect(30, 84, 40, 8, 4)],
    ['main', 'M50 8c18 0 30 13 30 29 0 22-30 51-30 51S20 59 20 37C20 21 32 8 50 8Z'],
    ['ink', circle(50, 37, 11)],
  ],
  phone: [ // 휴대폰 (상담 전화·문자 알림)
    ['gray', rrect(28, 8, 44, 84, 10)],
    ['main', rrect(33, 18, 34, 58, 4)],
    ['white', rrect(44, 81, 12, 4, 2)],
    ['ink', rrect(39, 28, 22, 5, 2.5)],
    ['ink', rrect(39, 38, 14, 5, 2.5)],
  ],
  laptop: [ // 노트북 (온라인 수업·리포트)
    ['gray', rrect(18, 18, 64, 48, 8)],
    ['main', rrect(24, 24, 52, 36, 4)],
    ['deep', 'M8 70h84q0 10-10 10H18Q8 80 8 70Z'],
    ['ink', 'M45 34l12 8-12 8Z', { round: 3 }],
  ],
  shield: [ // 방패 + 체크 (안심 관리·보장)
    ['main', 'M50 8l34 12v24c0 24-15 40-34 48C31 84 16 68 16 44V20Z', { round: 6 }],
    ['deep', 'M50 8l34 12v24c0 24-15 40-34 48Z'],
    ['ink', 'M36 50l7-7 7 7 14-14 7 7-21 21Z', { round: 5 }],
  ],
  stairs: [ // 계단 (단계·로드맵·성장)
    ['gray', rrect(12, 64, 24, 24, 5)],
    ['main', rrect(38, 46, 24, 42, 5)],
    ['deep', rrect(64, 26, 24, 62, 5)],
  ],
  seedling: [ // 새싹 (시작·성장·저학년)
    ['deep', rrect(47, 34, 6, 32, 3)],
    ['main', 'M48 48C34 48 22 38 22 24c14 0 26 10 26 24Z', { round: 4 }],
    ['main', 'M52 42c0-16 12-28 28-28 0 16-12 28-28 28Z', { round: 4 }],
    ['gray', 'M30 66h40l-5 24H35Z', { round: 6 }],
    ['grayDark', rrect(26, 60, 48, 9, 4.5)],
  ],
  key: [ // 열쇠 (핵심·해법·비결)
    ['deep', rrect(46, 45, 44, 10, 5)],
    ['deep', rrect(70, 52, 8, 16, 3)],
    ['deep', rrect(81, 52, 8, 12, 3)],
    ['main', circle(32, 50, 20)],
    ['ink', circle(32, 50, 8)],
  ],
  brain: [ // 뇌 (사고력·이해·개념) — 동글동글한 두 반구, 왼쪽 회색 · 오른쪽 메인(조각마다 따로 칠해야 겹친 곳이 비지 않는다)
    ['gray', circle(37, 36, 17)], ['gray', circle(29, 56, 16)], ['gray', circle(40, 70, 14)], ['gray', rrect(32, 28, 18, 54, 8)],
    ['main', circle(63, 36, 17)], ['main', circle(71, 56, 16)], ['main', circle(60, 70, 14)], ['main', rrect(50, 28, 18, 54, 8)],
    ['grayDark', 'M30 46q9 0 11 9', { line: 4.5 }],
    ['ink', 'M70 46q-9 0-11 9 M62 66q7-3 11 2', { line: 4.5 }],
  ],
  coin: [ // 동전 (수강료·비용·장학)
    ['deep', circle(55, 55, 33)],
    ['main', circle(47, 47, 33)],
    ['ink', 'M33 34l7 26 7-18 7 18 7-26 M30 46h34', { line: 5 }],
  ],
  exam: [ // 시험지 + 점수 (시험·성적·평가)
    ['gray', rrect(16, 8, 58, 80, 8)],
    ['grayDark', rrect(26, 24, 32, 5, 2.5)],
    ['grayDark', rrect(26, 36, 38, 5, 2.5)],
    ['grayDark', rrect(26, 48, 26, 5, 2.5)],
    ['main', circle(66, 70, 21)],
    ['ink', 'M58 78l8-16 8 16 M61 73h10', { line: 4 }],
  ],
  family: [ // 부모와 아이 (학부모·가정)
    ['gray', circle(36, 28, 13)],
    ['gray', rrect(16, 46, 40, 44, 18)],
    ['main', circle(68, 46, 10)],
    ['main', rrect(54, 60, 28, 30, 12)],
  ],
  quote: [ // 큰따옴표 “ (인용·후기·학부모 말씀) — 2026-10-20 디자이너. 머리와 꼬리를 한 윤곽으로 이어 그림(조각을 겹치면 이음새가 끊겨 보여서)
    ['main', 'M46 15C27 22 14 40 14 64A16 16 0 0 0 46 64A16 16 0 0 0 31 48C31 39 37 31 48 25Z', { round: 3 }],
    ['main', 'M86 15C67 22 54 40 54 64A16 16 0 0 0 86 64A16 16 0 0 0 71 48C71 39 77 31 88 25Z', { round: 3 }],
  ],
  bell: [ // 종 (알림·공지·리마인드)
    ['main', 'M50 12c16 0 26 12 26 28v18l8 12H16l8-12V40c0-16 10-28 26-28Z', { round: 4 }],
    ['deep', circle(50, 80, 8)],
    ['ink', rrect(36, 30, 6, 20, 3)],
  ],
  // ── 2026-10-22 디자이너 'PPT 아이콘 더 많이' — 학원 설명회에 자주 맞는 19개 더함(같은 그림체: 회색 몸체 + 메인 + 진한 메인, 선 없음 · 모서리 둥글게) ──
  calendar: [ // 달력 (일정·학사 일정·D-day)
    ['gray', rrect(14, 20, 72, 68, 12)],
    ['main', rrect(14, 20, 72, 22, 12)],
    ['gray', 'M14 36h72v6H14Z'],
    ['deep', `${rrect(28, 11, 7, 16, 3.5)} ${rrect(65, 11, 7, 16, 3.5)}`],
    ['grayDark', `${rrect(26, 52, 10, 9, 3)} ${rrect(45, 52, 10, 9, 3)} ${rrect(26, 68, 10, 9, 3)} ${rrect(45, 68, 10, 9, 3)} ${rrect(64, 68, 10, 9, 3)}`],
    ['main', rrect(64, 52, 10, 9, 3)],
  ],
  microscope: [ // 현미경 (과학·탐구·관찰)
    ['grayDark', rrect(20, 84, 60, 8, 4)],
    ['gray', 'M58 30q22 16 12 46H58q8-22-6-34Z', { round: 4 }],
    ['deep', rrect(52, 70, 14, 16, 4)],
    ['gray', rrect(26, 62, 36, 8, 4)],
    ['main', rrect(34, 8, 18, 44, 7), { t: 'rotate(-28 43 30)' }],
    ['deep', rrect(36, 48, 14, 9, 3), { t: 'rotate(-28 43 30)' }],
  ],
  atom: [ // 원자 (과학·원리)
    ['gray', 'M10 50a40 15 0 1 0 80 0a40 15 0 1 0 -80 0', { line: 6 }],
    ['gray', 'M10 50a40 15 0 1 0 80 0a40 15 0 1 0 -80 0', { line: 6, t: 'rotate(60 50 50)' }],
    ['gray', 'M10 50a40 15 0 1 0 80 0a40 15 0 1 0 -80 0', { line: 6, t: 'rotate(120 50 50)' }],
    ['main', circle(50, 50, 11)],
    ['deep', circle(86, 44, 6)],
  ],
  headphones: [ // 헤드폰 (듣기·영어 리스닝)
    ['grayDark', 'M22 62V50a28 28 0 0 1 56 0v12', { line: 9 }],
    ['main', `${rrect(14, 52, 22, 34, 10)} ${rrect(64, 52, 22, 34, 10)}`],
    ['deep', `${rrect(30, 58, 8, 22, 4)} ${rrect(62, 58, 8, 22, 4)}`],
  ],
  mic: [ // 마이크 (말하기·발표·면접)
    ['gray', 'M26 46a24 24 0 0 0 48 0', { line: 7 }],
    ['gray', rrect(46, 68, 8, 16, 4)],
    ['grayDark', rrect(32, 82, 36, 8, 4)],
    ['main', rrect(36, 10, 28, 48, 14)],
    ['ink', `${rrect(44, 22, 12, 5, 2.5)} ${rrect(44, 32, 12, 5, 2.5)}`],
  ],
  folder: [ // 폴더 (포트폴리오·자료 정리)
    ['gray', 'M12 24h26l8 8h42v54H12Z', { round: 8 }],
    ['white', rrect(22, 30, 54, 30, 5)],
    ['main', rrect(10, 44, 80, 44, 10)],
    ['deep', rrect(20, 54, 22, 6, 3)],
  ],
  envelope: [ // 편지봉투 (안내문·리포트·문자)
    ['gray', rrect(10, 22, 80, 58, 10)],
    ['grayDark', 'M12 76L40 50h20l28 26Z', { round: 6 }],
    ['main', 'M14 26h72L50 58Z', { round: 6 }],
    ['deep', circle(50, 46, 6)],
  ],
  ruler: [ // 자 (수학·도형·측정)
    ['main', rrect(8, 36, 84, 28, 6), { t: 'rotate(-30 50 50)' }],
    ['ink', `${rrect(18, 36, 4, 12, 2)} ${rrect(30, 36, 4, 8, 2)} ${rrect(42, 36, 4, 12, 2)} ${rrect(54, 36, 4, 8, 2)} ${rrect(66, 36, 4, 12, 2)} ${rrect(78, 36, 4, 8, 2)}`, { t: 'rotate(-30 50 50)' }],
  ],
  backpack: [ // 책가방 (신학기·초등·등원)
    ['gray', 'M38 26v-6a12 12 0 0 1 24 0v6', { line: 6 }],
    ['gray', rrect(20, 24, 60, 66, 18)],
    ['grayDark', rrect(20, 40, 60, 8, 4)],
    ['main', rrect(30, 56, 40, 26, 9)],
    ['deep', rrect(44, 62, 12, 6, 3)],
  ],
  alarm: [ // 자명종 (기상·습관·시간 관리)
    ['main', `${circle(25, 22, 10)} ${circle(75, 22, 10)}`],
    ['grayDark', `${rrect(24, 80, 8, 12, 4)} ${rrect(68, 80, 8, 12, 4)}`],
    ['gray', circle(50, 54, 33)],
    ['ink', circle(50, 54, 24)],
    ['deep', rrect(47, 37, 6, 19, 3)],
    ['main', rrect(47, 51, 17, 6, 3)],
  ],
  magnet: [ // 자석 (끌어당김·집중·흡수)
    ['main', 'M30 24v26a20 20 0 0 0 40 0V24', { line: 18 }],
    ['gray', `${rrect(20, 12, 20, 16, 5)} ${rrect(60, 12, 20, 16, 5)}`],
  ],
  tablet: [ // 태블릿 (온라인 수업·디지털 교재)
    ['gray', rrect(18, 8, 64, 84, 12)],
    ['white', rrect(25, 16, 50, 62, 6)],
    ['main', rrect(32, 24, 36, 18, 5)],
    ['grayDark', `${rrect(32, 48, 30, 5, 2.5)} ${rrect(32, 58, 22, 5, 2.5)}`],
    ['grayDark', circle(50, 85, 3.5)],
  ],
  lightning: [ // 번개 (집중·속도·빠른 성장)
    ['gray', rrect(12, 12, 76, 76, 20)],
    ['main', 'M56 18L28 54h20l-6 30 30-40H52Z', { round: 5 }],
  ],
  palette: [ // 팔레트 (미술·창의)
    ['gray', 'M50 12C28 12 12 28 12 50s16 38 36 38c8 0 10-6 6-11-4-6 0-11 8-11h10c11 0 16-7 16-17C88 27 72 12 50 12Z', { round: 4 }],
    ['main', circle(32, 40, 7)],
    ['deep', circle(51, 28, 7)],
    ['main', circle(70, 38, 7)],
    ['grayDark', circle(29, 60, 7)],
  ],
  music: [ // 음표 (음악·예체능)
    ['deep', 'M40 22L82 12v13L40 35Z', { round: 3 }],
    ['main', `${rrect(36, 24, 7, 48, 3.5)} ${rrect(76, 14, 7, 48, 3.5)}`],
    ['main', `${circle(30, 72, 11)} ${circle(70, 62, 11)}`],
  ],
  puzzle: [ // 퍼즐 (문제 해결·맞춤)
    ['main', rrect(50, 28, 40, 46, 9)],
    ['main', circle(70, 28, 9)], // 겹치는 조각은 따로 칠함(한 패스에 넣으면 겹친 곳이 빔)
    ['gray', rrect(10, 28, 40, 46, 9)],
    ['gray', circle(51, 51, 9)],
  ],
  pie: [ // 원그래프 (비율·성적 구성)
    ['gray', circle(50, 50, 40)],
    ['main', 'M50 50V10A40 40 0 0 1 88 62Z', { round: 4 }],
    ['deep', 'M50 50L88 62A40 40 0 0 1 72 83Z', { round: 4 }],
    ['ink', circle(50, 50, 6)],
  ],
  stopwatch: [ // 초시계 (시간 재기·집중 시간)
    ['main', rrect(40, 8, 20, 10, 5)],
    ['deep', rrect(46, 16, 8, 10, 3)],
    ['grayDark', rrect(72, 24, 10, 8, 4), { t: 'rotate(45 77 28)' }],
    ['gray', circle(50, 58, 34)],
    ['ink', circle(50, 58, 25)],
    ['main', 'M50 58V36a22 22 0 0 1 19 11Z', { round: 3 }],
    ['deep', circle(50, 58, 5)],
  ],
  board: [ // 칠판 · 설명회 (수업·발표)
    ['grayDark', `${rrect(28, 66, 6, 26, 3)} ${rrect(66, 66, 6, 26, 3)}`],
    ['gray', rrect(10, 12, 80, 58, 10)],
    ['white', rrect(18, 20, 64, 42, 6)],
    ['main', `${rrect(28, 42, 9, 14, 3)} ${rrect(42, 34, 9, 22, 3)}`],
    ['deep', rrect(56, 28, 9, 28, 3)],
  ],
  // ── 2026-10-22 디자이너 '아이콘 더 많이' 2차 — 20개 더함 ──
  bus: [ // 셔틀버스 (등하원·차량 운행)
    ['main', rrect(14, 16, 72, 62, 14)],
    ['ink', `${rrect(22, 26, 24, 20, 5)} ${rrect(54, 26, 24, 20, 5)}`],
    ['deep', rrect(14, 56, 72, 8, 4)],
    ['gray', `${rrect(22, 70, 14, 16, 6)} ${rrect(64, 70, 14, 16, 6)}`],
    ['grayDark', `${rrect(24, 60, 10, 6, 3)} ${rrect(66, 60, 10, 6, 3)}`],
  ],
  building: [ // 건물 · 학원 (위치·시설)
    ['gray', rrect(18, 14, 64, 76, 10)],
    ['white', `${rrect(28, 26, 12, 10, 3)} ${rrect(44, 26, 12, 10, 3)} ${rrect(60, 26, 12, 10, 3)} ${rrect(28, 44, 12, 10, 3)} ${rrect(44, 44, 12, 10, 3)} ${rrect(60, 44, 12, 10, 3)}`],
    ['main', rrect(40, 64, 20, 26, 5)],
    ['grayDark', rrect(12, 86, 76, 6, 3)],
  ],
  apple: [ // 사과 (선생님·바른 공부)
    ['main', 'M50 30c-6-6-30-8-30 22 0 22 14 36 30 30 16 6 30-8 30-30 0-30-24-28-30-22Z', { round: 4 }],
    ['deep', rrect(47, 14, 6, 18, 3)],
    ['main', 'M54 22q10-14 22-8-6 14-22 8Z', { round: 3 }],
    ['ink', rrect(30, 44, 6, 16, 3)],
  ],
  hand: [ // 손 들기 (질문·참여)
    ['gray', rrect(32, 80, 40, 14, 6)],
    ['main', rrect(28, 44, 48, 40, 16)],
    ['main', rrect(30, 20, 10, 40, 5)],
    ['main', rrect(43, 10, 10, 46, 5)],
    ['main', rrect(56, 14, 10, 42, 5)],
    ['main', rrect(69, 24, 10, 36, 5)],
    ['deep', rrect(10, 48, 30, 12, 6), { t: 'rotate(45 34 58)' }],
  ],
  percent: [ // 퍼센트 배지 (할인·비율)
    ['main', circle(50, 50, 40)],
    ['ink', `${circle(36, 36, 8)} ${circle(64, 64, 8)}`],
    ['ink', rrect(46, 22, 8, 56, 4), { t: 'rotate(40 50 50)' }],
  ],
  ticket: [ // 티켓 · 쿠폰 (혜택·이벤트)
    ['main', 'M10 28h80v14a8 8 0 0 0 0 16v14H10V58a8 8 0 0 0 0-16Z', { round: 6 }],
    ['ink', `${rrect(60, 32, 4, 8, 2)} ${rrect(60, 46, 4, 8, 2)} ${rrect(60, 60, 4, 8, 2)}`],
    ['deep', rrect(22, 44, 28, 12, 6)],
  ],
  question: [ // 물음표 말풍선 (질문·상담·궁금증)
    ['gray', 'M14 14h72q6 0 6 6v44q0 6-6 6H46L28 86V70H14q-6 0-6-6V20q0-6 6-6Z', { round: 6 }],
    ['main', 'M38 34q0-12 12-12t12 11q0 7-8 11-4 2-4 6v2', { line: 8 }],
    ['main', circle(50, 60, 5)],
  ],
  smile: [ // 웃는 얼굴 (만족·후기)
    ['main', circle(50, 50, 40)],
    ['ink', `${circle(36, 42, 5)} ${circle(64, 42, 5)}`],
    ['ink', 'M32 58q18 18 36 0', { line: 7 }],
  ],
  sun: [ // 해 (아침·오전 수업)
    ['gray', `${rrect(46, 6, 8, 14, 4)} ${rrect(46, 80, 8, 14, 4)} ${rrect(6, 46, 14, 8, 4)} ${rrect(80, 46, 14, 8, 4)}`],
    ['gray', `${rrect(46, 6, 8, 14, 4)} ${rrect(46, 80, 8, 14, 4)} ${rrect(6, 46, 14, 8, 4)} ${rrect(80, 46, 14, 8, 4)}`, { t: 'rotate(45 50 50)' }],
    ['main', circle(50, 50, 24)],
    ['deep', 'M50 26a24 24 0 0 1 0 48Z'],
  ],
  moon: [ // 달 (저녁·밤 자습)
    ['main', 'M60 12a38 38 0 1 0 28 54A30 30 0 0 1 60 12Z', { round: 4 }],
    ['gray', `${circle(74, 22, 5)} ${circle(84, 40, 3)}`],
    ['deep', circle(40, 58, 5)],
  ],
  video: [ // 영상 재생 (온라인 강의·녹화)
    ['gray', rrect(10, 18, 80, 56, 12)],
    ['main', 'M42 34l20 12-20 12Z', { round: 6 }],
    ['grayDark', rrect(10, 82, 80, 6, 3)],
    ['main', rrect(10, 82, 34, 6, 3)],
  ],
  user: [ // 사람 한 명 (학생·1:1)
    ['main', circle(50, 32, 18)],
    ['gray', 'M16 90q0-36 34-36t34 36Z', { round: 6 }],
  ],
  lock: [ // 자물쇠 (안전·개인정보)
    ['gray', 'M32 46V32a18 18 0 0 1 36 0v14', { line: 9 }],
    ['main', rrect(20, 44, 60, 46, 12)],
    ['deep', `${circle(50, 62, 7)} ${rrect(47, 62, 6, 14, 3)}`],
  ],
  glasses: [ // 안경 (독서·꼼꼼히 보기)
    ['grayDark', 'M8 44q8-8 16-6 M92 44q-8-8-16-6', { line: 5 }],
    ['main', 'M8 50a16 16 0 1 0 32 0a16 16 0 1 0 -32 0 M60 50a16 16 0 1 0 32 0a16 16 0 1 0 -32 0', { line: 7 }],
    ['main', 'M40 48q10-8 20 0', { line: 6 }],
  ],
  lamp: [ // 스탠드 (공부방·밤 공부)
    ['grayDark', rrect(20, 84, 48, 8, 4)],
    ['gray', 'M40 86V56l22-24', { line: 8 }],
    ['main', 'M48 22l30-12 12 30-30 12Z', { round: 7 }],
    ['deep', circle(76, 50, 8)],
  ],
  eraser: [ // 지우개 (오답·다시 하기)
    ['main', rrect(18, 32, 48, 32, 8), { t: 'rotate(-35 50 50)' }],
    ['gray', rrect(54, 32, 28, 32, 8), { t: 'rotate(-35 50 50)' }],
    ['grayDark', rrect(12, 84, 76, 6, 3)],
  ],
  brush: [ // 붓 (미술·꾸미기)
    ['gray', rrect(42, 4, 16, 52, 8), { t: 'rotate(40 50 50)' }],
    ['deep', rrect(39, 50, 22, 12, 4), { t: 'rotate(40 50 50)' }],
    ['main', 'M39 62h22q4 22-11 34-15-12-11-34Z', { t: 'rotate(40 50 50)', round: 3 }],
  ],
  map: [ // 지도 (오시는 길·로드맵)
    ['gray', 'M10 22l26-8 28 8 26-8v64l-26 8-28-8-26 8Z', { round: 6 }],
    ['grayDark', 'M36 14v64 M64 22v64', { line: 4 }],
    ['main', 'M64 26c-10 0-16 7-16 15 0 10 16 24 16 24s16-14 16-24c0-8-6-15-16-15Z', { round: 3 }],
    ['ink', circle(64, 41, 5)],
  ],
  ball: [ // 농구공 (체육·활동)
    ['main', circle(50, 50, 40)],
    ['ink', 'M50 10v80 M10 50h80 M24 20q16 30 0 60 M76 20q-16 30 0 60', { line: 5 }],
  ],
  books: [ // 책 더미 (독서량·교재)
    ['gray', rrect(14, 70, 72, 16, 5)],
    ['main', rrect(20, 52, 64, 16, 5)],
    ['grayDark', rrect(12, 34, 70, 16, 5)],
    ['deep', rrect(24, 16, 56, 16, 5)],
    ['ink', `${rrect(30, 57, 30, 5, 2.5)} ${rrect(32, 21, 26, 5, 2.5)}`],
  ],
};
export const ICON_NAMES = Object.keys(ICONS_2D);

function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const mix = (c) => Math.round(amt < 0 ? c * (1 + amt) : c + (255 - c) * amt);
  const r = mix(n >> 16), g = mix((n >> 8) & 255), b = mix(n & 255);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

// 아이콘은 2D 플랫 한 가지만 쓴다
// 아이콘 회색 몸체는 놓이는 바탕에 따라 고른다(2026-10-16 사용자): 밝은 바탕(흰색·옅은 회색·파스텔)에서는 옅은 회색이 묻혀서 한 단계 짙은 회색,
// 어둡거나 색이 진한 바탕(다크·메인 컬러 표지)에서는 흰색 몸체. bg를 안 주면 예전 색.
const lum = (hex) => { const n = parseInt(String(hex).replace('#', '').slice(0, 6), 16); return Number.isFinite(n) ? (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255 : 1; };
function grayTones(bg, onMain) {
  // 메인 컬러 표지(bg = 메인 컬러): 몸체는 메인에 흰색을 섞은 불투명 색 — 반투명이면 겹친 조각이 비쳐서(2026-10-17 사용자)
  if (onMain) return { gray: shade(bg, 0.32), grayDark: shade(bg, 0.18) };
  if (!bg) return { gray: '#E8EAED', grayDark: '#D3D6DB' };
  const l = lum(bg);
  if (l > 0.82) return { gray: '#D6DAE0', grayDark: '#BCC2CB' }; // 밝은 바탕: 짙은 회색
  return { gray: '#FFFFFF', grayDark: '#E3E6EB' }; // 어둡거나 진한 바탕: 흰색
}
// onMain이면 bg에 메인 컬러(아이콘이 놓인 바탕)를 넘긴다.
export function renderIcon(name, color, bg, onMain = false) {
  const tones = { ...grayTones(bg, onMain), main: color, deep: onMain ? shade(bg, -0.3) : shade(color, -0.4), white: '#FFFFFF', ink: onMain ? bg : '#FFFFFF' }; // ink = 메인 조각 위에 놓인 흰 조각 — 메인 표지는 메인 조각이 흰색이라 메인 컬러로(2026-10-17) // 메인 표지의 진한 조각 = 메인을 어둡게(흰 강조색을 어둡게 하면 엉뚱한 회색)
  const parts = (ICONS_2D[name] ?? ICONS_2D.star).map(([tone, pd, o = {}]) => {
    const c = tones[tone];
    if (o.line) return `<path d="${pd}" fill="none" stroke="${c}" stroke-width="${o.line}" stroke-linecap="round" stroke-linejoin="round"${o.t ? ` transform="${o.t}"` : ''}/>`; // 선 그리기(끝 둥글게) — 2026-10-19 지구본 곡선
    const round = o.round ? ` stroke="${c}" stroke-width="${o.round}" stroke-linejoin="round"` : '';
    return `<path d="${pd}" fill="${c}"${round}${o.t ? ` transform="${o.t}"` : ''}/>`;
  }).join('');
  return `<svg viewBox="0 0 100 100" class="icon">${parts}</svg>`;
}
