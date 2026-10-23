// 홈페이지에서 덱을 쓸 때 쓰는 도우미(2026-10-23) — DOM 없이 글자만 다뤄서 브라우저 · 서버(node) 어디서나 돈다.
// ① checkPlan: Claude가 HTML보다 먼저 낸 장 구성표(JSON)를 검사 → 문제 목록(빈 배열이면 통과)
// ② buildFixRequest · parseSections · replaceSections: 그린 덱의 검사(window.slideCheck) 결과로 걸린 장만 다시 쓰게 하고 바꿔 끼우기
// 형식 · 쓰는 법은 slide/PROMPT-PLAN.md · slide/PROMPT-FIX.md

// 사진 자리 부품(PROMPT.md 2절) — 이 부품을 쓰거나 photo: true면 사진 장으로 센다
export const PHOTO_PARTS = ['.m-teacher', '.m-polaroid', '.m-photowide', '.m-gallery', '.m-photostat', '.m-bookfeat', '.m-clothesline', 'figure.m-photo'];
export const SUPPORTS = ['.m-say', '.m-bignum', '.m-note', '.m-memo', '.m-caption', '그래프 제목'];
const FRAME = ['.s-cover', '.s-section', '.s-cta'];
// 무난한 정보 도식(카드 · 단계 · 목록 · 질문과 답 · 표) — 나머지는 내용 자체를 보여 주는 그림 도식(2026-10-23 디자이너 '로컬과 완성도 비슷하게'
// — 홈페이지 시험 덱이 있는 그림 도식(시험지 · OMR · 원 비교 · 첨삭 답안)을 두고 무난한 쪽으로 흘렀음). 구성표에서 그림 도식 비율을 본다
export const PLAIN_PARTS = ['.m-review', '.m-iconstat', '.m-coupon', '.m-feature', '.m-checkbox', '.m-faq', '.m-list', '.m-icongrid', '.m-steps', '.m-stepper',
  '.m-timeline', '.m-split', '.m-num', '.m-quad', '.s-roadmap', '.m-weekplan', '.m-timeband', '.m-names', '.m-badges', '.m-chips', '.m-scale', '.m-dialog',
  '.m-bignum', '.m-six', '.m-ideas', '.m-flow', '.m-cue', '.m-kanban', '.m-versus', '.s-dialog', '.s-quote', '.m-quote', '.m-table', '.m-ox', '.s-statrow',
  '.s-table', '.s-flow', '.s-vsteps', '.s-grid4', '.s-iconrow', '.s-versus', '.s-lead', '.s-ox', '.s-tags', '.s-profile', '.s-faq', '.s-reviews', '.s-checks2',
  '.s-week', '.s-months', '.s-cycle', '.s-hub', '.s-hero-center', '.m-ba', '.m-loop', '.m-forms6', '.m-folders', '.m-onemany', '.m-subjects'];

// 숫자 뽑기: 50,000 · 2,000처럼 세 자리 쉼표만 천 단위로, '17,21,56'은 숫자 셋
const nums = (t) => (String(t ?? '').match(/\d{1,3}(?:,\d{3})+(?!\d)|\d+(?:\.\d+)?/g) ?? []).map((x) => x.replace(/,/g, ''));
// 숫자 + 단위 첫 글자('6개' · '6cm' · '3월')— 대제목 되풀이는 단위까지 같을 때만
// 학년(고2 · 중3)처럼 글자에 붙은 숫자는 빼고
const unitNums = (t) => [...String(t ?? '').matchAll(/(?<![가-힣a-zA-Z\d])(\d{1,3}(?:,\d{3})+|\d+(?:\.\d+)?)\s*([가-힣a-zA-Z%°])?/g)].map((m) => m[1].replace(/,/g, '') + (m[2] ?? ''));
// 'ul.m-list' · 'm-list' · '.m-list'을 같게 본다(태그 앞머리는 떼고 점은 붙임)
const norm = (p) => String(p ?? '').trim().replace(/^[a-z]+(?=\.)/, '').replace(/^(?=m-|s-)/, '.');

// plan = { slides: [{ kind: 'cover'|'section'|'inner'|'cta', beat, step, index, title, part, support, photo, facts: [] }] }
// request = 원장님 요청 글 전체(홈페이지 5단계면 대본 다이제스트 + 강점 + 실데이터), parts = 쓸 수 있는 부품 이름 목록(slide/parts.json)
// opts.beats = 대본 꼭지 id 순서(['b0','b1',…]) — 주면 꼭지 순서 · 빠진 꼭지를 본다, opts.target = 목표 장 수(홈페이지 slideCountTarget)
export function checkPlan(plan, request, parts, opts = {}) {
  const out = [], S = plan?.slides;
  if (!Array.isArray(S) || !S.length) return ['장 구성표가 비었어요(slides 배열)'];
  // 요청 쪽은 '89,102,133' 같은 나열도 있으니 쉼표로 나눈 조각도 함께 센다
  const known = new Set(parts.map(norm)), given = new Set([...nums(request), ...(String(request).match(/\d+/g) ?? [])]);
  const at = (i) => `${i + 1}장`;
  const target = +opts.target || 0;
  if (target ? Math.abs(S.length - target) > 3 : S.length < 16 || S.length > 26) out.push(`전체 ${S.length}장 — ${target ? `목표 ${target}장 안팎(±3)` : '18 ~ 24장'}으로`);
  // 대본 꼭지: 순서대로, 빠짐없이(2026-10-23 홈페이지 5단계 연결 — 장 순서는 대본이 정한다)
  if (Array.isArray(opts.beats) && opts.beats.length) {
    const order = new Map(opts.beats.map((b, k) => [String(b), k]));
    let last = -1;
    S.forEach((s, i) => {
      if (s.kind === 'section' || s.beat == null || s.beat === '') { if (s.kind === 'inner') out.push(`${at(i)}: 어느 꼭지 장인지(beat)가 없어요`); return; }
      const k = order.get(String(s.beat));
      if (k == null) { out.push(`${at(i)}: 꼭지 ${s.beat}는 대본에 없어요`); return; }
      if (k < last) out.push(`${at(i)}: 꼭지 ${s.beat}가 앞 장보다 앞 순서예요 — 대본 꼭지 순서대로`);
      last = Math.max(last, k);
    });
    const used = new Set(S.map((s) => String(s.beat)));
    const miss = opts.beats.filter((b) => !used.has(String(b)));
    if (miss.length) out.push(`대본 꼭지 ${miss.join(' · ')}의 장이 없어요 — 꼭지마다 1 ~ 2장`);
  }
  if (S[0].kind !== 'cover') out.push('1장은 표지(kind: cover)여야 해요');
  if (S.at(-1).kind !== 'cta') out.push(`${S.length}장(마지막)은 마감(kind: cta)이어야 해요`);
  const sections = S.filter((s) => s.kind === 'section').length;
  if (sections < 2 || sections > 3) out.push(`장 표지가 ${sections}장 — 2 ~ 3장으로`);

  const used = {}, sUsed = {};
  let prev = null, sPrev = null, photos = 0;
  S.forEach((s, i) => {
    if (s.kind !== 'inner') { prev = sPrev = null; return; }
    const part = norm(s.part);
    if (!s.title?.trim()) out.push(`${at(i)}: 대제목이 없어요`);
    else if ([...s.title].length > 26) out.push(`${at(i)}: 대제목이 ${[...s.title].length}자 — 24자 안쪽 한 줄로`);
    if (!s.index?.trim()) out.push(`${at(i)}: 목차 표시(index)가 없어요`);
    if (!part) out.push(`${at(i)}: 부품(part)이 없어요`);
    else if (FRAME.includes(part)) out.push(`${at(i)}: ${part}는 표지 · 장 표지 · 마감 전용이에요`);
    else if (!known.has(part)) out.push(`${at(i)}: ${part}는 PROMPT-PARTS.md에 없는 부품이에요`);
    if (part) {
      (used[part] ??= []).push(i + 1);
      if (part === prev) out.push(`${at(i)}: 바로 앞 장과 같은 도식(${part})`);
      if (used[part].length === 3) out.push(`${at(i)}: 같은 도식(${part})이 세 번째예요(${used[part].join('·')}장) — 두 번까지`);
    }
    prev = part;
    const sup = s.support ? norm(s.support).replace(/^\.(?=그래프)/, '') : null;
    if (sup) {
      if (!SUPPORTS.includes(sup)) out.push(`${at(i)}: 보조 글 ${sup}는 없는 방식이에요(${SUPPORTS.join(' · ')})`);
      (sUsed[sup] ??= []).push(i + 1);
      if (sup === sPrev) out.push(`${at(i)}: 바로 앞 장과 같은 보조 글 방식(${sup})`);
      if (sUsed[sup].length === 3) out.push(`${at(i)}: 보조 글 방식(${sup})이 세 번째예요 — 두 번까지`);
    }
    sPrev = sup;
    if (s.photo || PHOTO_PARTS.map(norm).includes(part)) photos++;
    // 숫자: facts에 장에 쓴 숫자를 모두 적는다. '240분 = 2회 × 120분'처럼 계산한 값은 = 오른쪽 숫자가 요청에 있어야 한다
    const facts = Array.isArray(s.facts) ? s.facts : [];
    const allowed = new Set(given);
    for (const f of facts) {
      const [left, ...right] = String(f).split('=');
      const src = right.length ? right.join('=') : left;
      // 식 안의 작은 수 · 100(횟수 · 백분율 환산 — '2회 × 120분', '× 100')은 요청에 없어도 된다
      const bad = nums(src).filter((n) => !given.has(n) && !(right.length && (+n <= 12 || n === '100')));
      if (bad.length) out.push(`${at(i)}: 숫자 ${bad.join(' · ')}는 요청에 없어요 — 지어낸 숫자는 빼고, 계산한 값이면 '값 = 식'으로`);
      nums(f).forEach((n) => allowed.add(n));
    }
    const loose = nums(s.title).filter((n) => !allowed.has(n));
    if (loose.length) out.push(`${at(i)}: 대제목의 숫자 ${loose.join(' · ')}가 요청 · facts에 없어요`);
  });
  // 같은 숫자를 대제목에 두 번 쓰면 같은 말을 두 장이 되풀이한다(2026-10-23 시험 — 4장 '12점에서 21점' · 11장 '25점 만점에서 21점')
  const seen = {};
  S.forEach((s, i) => { if (s.kind === 'inner') new Set(unitNums(s.title)).forEach((n) => { if (parseFloat(n) > 1 && !/월$/.test(n) && seen[n]) out.push(`${at(i)}: 대제목 숫자 ${n}를 ${seen[n]}장에서도 말했어요 — 같은 말을 두 장이 되풀이하지 않게`); else seen[n] ??= i + 1; }); });
  if (photos < 2 || photos > 4) out.push(`사진 자리 장이 ${photos}장 — 2 ~ 4장으로(${PHOTO_PARTS.slice(0, 4).join(' · ')} 등)`);
  // 그림 도식 비율: 여기서 만든 예시 덱은 사진 장을 뺀 내지의 39 ~ 71%(최근 덱 60% 이상), 홈페이지 시험 덱은 23 ~ 36%였다
  const plain = PLAIN_PARTS.map(norm), photo = PHOTO_PARTS.map(norm);
  const inner = S.filter((s) => s.kind === 'inner' && !s.photo && !photo.includes(norm(s.part)));
  const pics = inner.filter((s) => !plain.includes(norm(s.part))).length;
  if (inner.length && pics / inner.length < 0.5) out.push(`그림 도식이 ${pics}장(사진 장을 뺀 내지의 ${Math.round(pics / inner.length * 100)}%) — 절반 이상을 내용 자체를 보여 주는 그림 도식으로(PROMPT-PARTS.md의 '그림' 부품). 무난한 정보 도식: ${inner.filter((s) => plain.includes(norm(s.part))).map((s) => `${S.indexOf(s) + 1}장 ${norm(s.part)}`).join(' · ')}`);
  const kinds = Object.keys(used).length;
  if (kinds < 12) out.push(`서로 다른 도식이 ${kinds}종 — 12종 이상으로(주제다운 도식 한두 장 포함)`);
  return out;
}

// ---------- 걸린 장만 다시 쓰기 ----------
const SECTION = /(?:<!--(?:(?!-->)[^])*-->\s*)?<section\b[^]*?<\/section>/g;
// 덱 HTML → 장마다 { n, html } (앞 주석 포함 — 바꿔 끼울 때 주석도 같이 바뀐다)
export const parseSections = (deck) => [...String(deck).matchAll(SECTION)].map((m, i) => ({ n: i + 1, html: m[0].trim(), start: m.index, end: m.index + m[0].length }));

// 검사 문장('9장: …')을 장 번호별로 묶는다. 장 번호가 없는 문장은 0번(덱 전체)
export function groupIssues(issues) {
  const by = {};
  for (const t of issues) { const m = /^(\d+)장/.exec(t); (by[m ? +m[1] : 0] ??= []).push(t); }
  return by;
}

// 다시 쓰기 요청 글(PROMPT-FIX.md를 앞에 두고 이 글을 이번 요청으로 보낸다). 걸린 장이 없으면 null
export function buildFixRequest(deck, issues) {
  const by = groupIssues(issues), secs = parseSections(deck);
  const ns = Object.keys(by).map(Number).filter((n) => n > 0 && secs[n - 1]).sort((a, b) => a - b);
  if (!ns.length) return null;
  const around = (n) => [n - 1, n + 1].filter((k) => secs[k - 1]).map((k) => `${k}장 부품: ${(secs[k - 1].html.match(/class="(m-[\w-]+|s-(?!m\b|grid|body|head|index|title)[\w-]+)/) ?? [])[1] ?? '-'}`).join(' · ');
  return ns.map((n) => `### ${n}장\n검사:\n${by[n].map((t) => '- ' + t.replace(/^\d+장:\s*/, '')).join('\n')}\n이웃 장(같은 도식 피하기): ${around(n)}\n\n\`\`\`html\n${secs[n - 1].html}\n\`\`\``).join('\n\n');
}

// Claude 답(장마다 '<!-- N. … -->' 주석 + <section>)에서 장 번호별 새 HTML을 꺼낸다
export function parseFixResponse(text) {
  const map = {};
  for (const m of String(text).matchAll(/<!--\s*(\d+)[.\s](?:(?!-->)[^])*-->\s*<section\b[^]*?<\/section>/g)) map[+m[1]] = m[0].trim();
  return map;
}

// 덱에서 그 장들만 바꿔 끼운다
export function replaceSections(deck, map) {
  const secs = parseSections(deck);
  let out = '', pos = 0;
  for (const s of secs) { if (map[s.n]) { out += deck.slice(pos, s.start) + map[s.n]; pos = s.end; } }
  return out + deck.slice(pos);
}
