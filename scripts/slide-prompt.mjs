// 덱을 쓰는 Claude에게 넣을 부품 마크업 표를 예시 덱에서 자동으로 뽑는다(2026-10-23).
// 부품마다 실제로 쓰인 마크업 하나 + PARTS.md의 한 줄 설명 → slide/PROMPT-PARTS.md
// 사용: node scripts/slide-prompt.mjs
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, launch } from './kit-lib.mjs';
import { PLAIN_PARTS, PHOTO_PARTS } from '../slide/plan.js';

const EX = join(ROOT, 'slide/examples');
const types = JSON.parse(readFileSync(join(EX, 'deck-types.json'), 'utf8'));
const ref = types.reference;
// 실제 덱 먼저(기준 덱이 맨 앞), 견본 덱은 실제 덱에 없는 부품을 채울 때만
const real = readdirSync(EX).filter((f) => /^seminar-.*\.html$/.test(f)).map((f) => f.slice(0, -5))
  .filter((d) => !types.notForPrompt.includes(d)).sort((a, b) => (a === ref ? -1 : b === ref ? 1 : a.localeCompare(b)));
const samples = ['photos', 'grid', 'grid-2', 'grid-3', 'grid-4', 'grid-5', 'expressions', 'expressions-2', 'seminar-grid'];
const decks = [...real, ...samples].map((d) => ({ d, html: readFileSync(join(EX, d + '.html'), 'utf8'), real: real.includes(d) }));
const parts = readFileSync(join(ROOT, 'slide/PARTS.md'), 'utf8');

const browser = await launch();
const page = await browser.newPage();
const found = await page.evaluate((decks) => {
  const out = {};
  const keyOf = (el) => {
    const c = [...el.classList].find((x) => /^(m|s)-/.test(x));
    return c ? (el.tagName === 'DIV' ? '' : el.tagName.toLowerCase()) + '.' + c : null;
  };
  const clean = (h) => h.replace(/\s*\n\s*/g, ' ').replace(/>\s+</g, '><').trim();
  const add = (key, html, deck, isReal, el) => {
    if (!key) return;
    const o = (out[key] ||= { n: 0, decks: new Set(), best: null, counts: [] });
    if (el && isReal) o.counts.push(el.children.length);
    o.n++; o.decks.add(deck);
    const cand = { html: clean(html), deck, isReal };
    const b = o.best;
    // 실제 덱 > 견본, 그 안에서 짧은 것(단, 너무 짧아 뼈대만 있는 건 피하려고 200자 이상 우선)
    const score = (c) => (c.isReal ? 0 : 1e6) + (c.html.length < 200 ? 5e5 : 0) + c.html.length;
    if (!b || score(cand) < score(b)) o.best = cand;
  };
  for (const { d, html, real } of decks) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    for (const s of doc.querySelectorAll('section.slide')) {
      if (s.classList.contains('s-cover')) { add('section.s-cover', s.outerHTML, d, real); continue; }
      if (s.classList.contains('s-section')) { add('section.s-section', s.outerHTML, d, real); continue; }
      const body = s.querySelector('.s-body');
      if (!body) continue;
      const grid = body.querySelector(':scope > .s-grid');
      if (grid) {
        for (const m of grid.querySelectorAll(':scope > .s-m')) {
          const kid = [...m.children].find((k) => keyOf(k) && !k.classList.contains('s-label')) || m.firstElementChild;
          add(kid && keyOf(kid), m.outerHTML, d, real, kid);
        }
        continue;
      }
      const first = [...body.children].find((k) => keyOf(k));
      if (first) add(keyOf(first), s.outerHTML, d, real, first);
    }
  }
  // 보조 글은 다른 조각 옆에 붙어서 위에서 안 잡힌다 — 그 장의 격자째 하나씩
  for (const sup of ['m-say', 'm-note', 'm-memo', 'm-caption', 'm-bignum']) {
    for (const { d, html, real } of decks) {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      for (const el of doc.querySelectorAll('.' + sup)) {
        const g = el.closest('.s-grid') || el.closest('.s-body');
        if (g) add('보조 글 .' + sup, g.outerHTML, d, real);
      }
    }
  }
  for (const k in out) out[k].decks = [...out[k].decks];
  return out;
}, decks);
await browser.close();

// PARTS.md에서 그 클래스가 처음 나온 자리의 설명 한 토막
const desc = (key) => {
  const cls = key.replace(/^보조 글 /, '').replace(/^[a-z]*\./, '.');
  const i = parts.indexOf('`' + cls);
  if (i < 0) return '';
  let t = parts.slice(i, i + 400).split('\n')[0];
  t = t.replace(/\(?\s*\d{4}-\d{2}-\d{2}[^)]*\)?/g, '').replace(/디자이너[^,·)]*/g, '').replace(/\s+/g, ' ');
  // 괄호 밖에서 다음 부품(` · \`.`)이 시작되기 전까지
  let depth = 0, end = t.length;
  for (let k = 1; k < t.length; k++) {
    const ch = t[k];
    if (ch === '(') depth++;
    else if (ch === ')') depth = Math.max(0, depth - 1);
    else if (depth === 0 && t.startsWith(' · `', k) && k > 2) { end = k; break; }
  }
  t = t.slice(0, end).trim();
  return t.length > 320 ? t.slice(0, 320) + '…' : t;
};

const keys = Object.keys(found).sort((a, b) => found[b].n - found[a].n);
let md = `# 설명회 덱 부품 마크업 (자동 생성 — 손으로 고치지 않는다)\n\n`;
md += `\`node scripts/slide-prompt.mjs\`가 예시 덱에서 부품마다 실제로 쓰인 마크업 하나를 뽑은 표다. 덱을 쓸 때 이 마크업을 그대로 본떠 글자만 바꾼다 — 여기 없는 클래스는 만들지 않는다. 많이 쓰인 순서. 머리의 괄호 = (분류 · 예시 덱에서 쓰인 횟수 · 쓰인 덱 주제). 분류: **그림** = 내용 자체를 보여 주는 그림 도식(시험지 · 첨삭 답안 · 원 비교 · 문장 분석 …) · **정보** = 무난한 카드 · 단계 · 목록 · 표 · **사진** = 사진 자리. 사진 장을 뺀 내지의 절반 이상을 그림 도식으로 — 쓰인 덱 주제가 이번 주제와 가까운 그림 도식부터 본다.\n\n`;
for (const k of keys) {
  const o = found[k];
  const dd = desc(k);
  const nk = k.replace(/^[a-z]+(?=\.)/, '').replace(/^보조 글 /, '');
  const cat = k.startsWith('보조 글') || /s-(cover|section|cta)$/.test(k) ? '' : PHOTO_PARTS.map((p) => p.replace(/^[a-z]+(?=\.)/, '')).includes(nk) ? '사진 · ' : PLAIN_PARTS.includes(nk) ? '정보 · ' : '그림 · ';
  const where = o.decks.filter((d) => d.startsWith('seminar-')).map((d) => d.slice(8)).slice(0, 6).join(' ');
  md += `## ${k} (${cat}${o.n}${where ? ' · ' + where : ''})\n${dd ? dd + '\n' : ''}\n\`\`\`html\n${o.best.html}\n\`\`\`\n\n`;
}
writeFileSync(join(ROOT, 'slide/PROMPT-PARTS.md'), md);
// 부품마다 예시 덱(실제 덱)에서 쓴 항목 개수 범위 — 검사(main.js weakCheck)가 예보다 크게 빈약한 장을 잡는다
const ranges = {};
for (const k of keys) { const c = found[k].counts; if (c?.length && !k.startsWith('보조 글')) ranges[k.replace(/^[a-z]*\./, '')] = [Math.min(...c), Math.max(...c)]; }
writeFileSync(join(ROOT, 'slide/part-ranges.js'), `// 자동 생성(scripts/slide-prompt.mjs) — 부품별 예시 덱 항목 개수 [최소, 최대]\nexport const PART_RANGES = ${JSON.stringify(ranges)};\n`);
// 장 구성표 검사(slide/plan.js checkPlan)가 쓰는 부품 이름 목록
writeFileSync(join(ROOT, 'slide/parts.json'), JSON.stringify(keys.filter((k) => !k.startsWith('보조 글')), null, 0) + '\n');
console.log(`부품 ${keys.length}종 · ${md.length}자 → slide/PROMPT-PARTS.md`);
