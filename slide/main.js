// 설명회 슬라이드 키트 + 스튜디오(임시 웹앱): 덱 파일(slides.html 또는 ?deck=examples/이름)의 .slide를 그리고,
//   · '글자 고치기'로 화면에서 바로 고치면 덱 파일에 저장(serve.py POST /__save)
//   · 덱·slide.css·main.js 파일이 바뀌면 저절로 다시 그림(1초마다 확인)
//   · kit/pptx.js로 편집 가능한 PPTX 내보내기
// 덱에는 내용과 부품 이름만 쓴다 — 글자 크기·색은 slide.css 역할 클래스가 정한다. 디자인 옵션은 없다(고정).
// 바뀌는 건 메인 컬러 하나: 학원 메인 컬러 ?brand=%23RRGGBB (너무 밝은 색이면 기본 색 유지 — 카드뉴스 withBrandColor와 같은 규칙).
import { deckToPptx } from '../kit/pptx.js';
import { renderIcon } from '../assets/icons.js';
import { phIcon } from '../assets/phosphor.js';
import { PART_RANGES } from './part-ranges.js';

const $ = (s) => document.querySelector(s);
const deck = $('#deck');
const params = new URLSearchParams(location.search);
const DECK = ((d) => (/^[\w/-]+$/.test(d ?? '') ? d : 'slides'))(params.get('deck'));
const DECK_FILE = `${DECK}.html`;
const css = (k) => getComputedStyle(document.documentElement).getPropertyValue(k).trim();

// ---------- 학원 메인 컬러: 밝기 0.8 넘으면 무시(흰 글자가 안 읽힘) ----------
function applyBrand(hex) {
  if (!/^#[0-9a-f]{6}$/i.test(hex ?? '')) return false;
  let [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  // 아주 밝은 파스텔(상대 밝기 0.62 넘음 — 연노랑 · 연분홍 등)은 버리지 않고 같은 색상 · 채도로 밝기만 낮춰 쓴다(2026-10-23 디자이너 — 예전엔 기본 파랑으로 바뀌어 학원 색이 사라졌음).
  // 거의 흰색(채도 10% 미만)만 기본 색 유지
  const lin0 = (v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4), rl0 = (R, G, B) => 0.2126 * lin0(R) + 0.7152 * lin0(G) + 0.0722 * lin0(B);
  if (rl0(r, g, b) > 0.62) {
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l0 = (mx + mn) / 2, d = mx - mn, sat = d === 0 ? 0 : d / (1 - Math.abs(2 * l0 - 1));
    if (sat < 0.1) return false;
    const hue = ((d === 0 ? 0 : mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4) + 6) % 6; // 0~6으로(분홍처럼 음수가 되면 살구색이 됐음)
    const fromHsl = (l) => { const c = (1 - Math.abs(2 * l - 1)) * sat, x = c * (1 - Math.abs((hue % 2 + 2) % 2 - 1)), m = l - c / 2, [p, q, w] = hue < 1 ? [c, x, 0] : hue < 2 ? [x, c, 0] : hue < 3 ? [0, c, x] : hue < 4 ? [0, x, c] : hue < 5 ? [x, 0, c] : [c, 0, x]; return [p + m, q + m, w + m].map((v) => Math.min(1, Math.max(0, v))); };
    let l = l0; while (l > 0.35 && rl0(...fromHsl(l)) > 0.62) l -= 0.01;
    [r, g, b] = fromHsl(l); hex = `#${[r, g, b].map((c) => Math.round(c * 255).toString(16).padStart(2, '0')).join('')}`;
  }
  const root = document.documentElement.style;
  root.setProperty('--main', hex);
  // 흰 글자와의 대비(WCAG)가 3 : 1보다 낮은 학원 색(노랑 · 연두 · 하늘 · 민트 등)은 밝은 색으로 본다 — 메인 면 위 글자는 제목색,
  // 흰 · 회색 바탕 위 메인 글자는 제목색을 조금씩 섞어 회색 판(#F4F4F4)과 4 : 1이 될 때까지 진하게(2026-10-23 여러 학원 색 점검 — 민트에서 밝기 계산이 느슨해 흰 글자가 남았음)
  const lin = (v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4), rl = (R, G, B) => 0.2126 * lin(R) + 0.7152 * lin(G) + 0.0722 * lin(B);
  const L = rl(r, g, b), light = 1.05 / (L + 0.05) < 3, T = [0x14, 0x16, 0x1C].map((v) => v / 255), mixAt = (t) => [r, g, b].map((c, k) => c * (1 - t) + T[k] * t);
  let t = 0; if (light) while (t < 0.9 && (0.905 + 0.05) / (rl(...mixAt(t)) + 0.05) < 4) t += 0.05; // 0.905 = #F4F4F4의 상대 밝기
  root.setProperty('--on-main', light ? '#14161C' : '#FFFFFF');
  root.setProperty('--main-text', light ? `#${mixAt(t).map((c) => Math.round(c * 255).toString(16).padStart(2, '0')).join('')}` : hex);
  return true;
}
const store = { get: (k) => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* 저장 안 돼도 화면은 그대로 */ } } };
applyBrand(params.get('brand') ?? store.get('slide.brand'));

// ---------- 원본(덱 파일) ↔ 화면 ----------
// 원본을 template으로 읽고, 글자를 직접 가진 요소마다 data-eid를 붙여 둔다. 화면은 그 복제본을 꾸며서 그린다.
// 화면에서 고친 글자는 같은 data-eid의 원본 요소에 옮긴 뒤, 원본을 그대로 파일에 쓴다(주석·줄바꿈 유지).
let source = null;   // <template> — 덱 파일 원본
let sourceText = '';

function readSource(text) {
  const t = document.createElement('template');
  t.innerHTML = text;
  let n = 0;
  t.content.querySelectorAll('.slide *').forEach((el) => {
    if ([...el.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim())) el.dataset.eid = String(n++);
  });
  return t;
}

function serialize() {
  const t = source.cloneNode(true);
  t.content.querySelectorAll('[data-eid]').forEach((el) => el.removeAttribute('data-eid'));
  return t.innerHTML;
}

// 꾸미기: 아이콘·화살표·막대·타임라인 점선·칸 수 (덱 파일에는 없는 것들)
// 그림(SVG) 안 글자를 실제 글자로 꺼냄(2026-10-23 디자이너 'PPT 편집 점검'): SVG는 PPT에서 그림 한 장이라 안 글자(달 · 값 · 눈금)를 원장님이 못 고친다.
// <text>를 같은 자리의 글자 요소(span.m-svgtxt)로 바꿔 PPT 글상자가 되게 — 부모는 position: relative, SVG는 부모를 꽉 채워야 함. scale = 화면 폭 ÷ viewBox 폭
const svgTextOut = (svg, scale) => {
  const vb = svg.viewBox.baseVal, host = svg.parentElement;
  svg.querySelectorAll('text').forEach((t) => {
    const x = +t.getAttribute('x'), y = +t.getAttribute('y'), fs = +t.getAttribute('font-size') || 30, anchor = t.getAttribute('text-anchor') || 'start';
    const sp = document.createElement('span'); sp.className = 'm-svgtxt'; sp.textContent = t.textContent;
    const shift = anchor === 'middle' ? '-50%' : anchor === 'end' ? '-100%' : '0';
    sp.style.cssText = `left:${(x / vb.width) * 100}%;top:${(y / vb.height) * 100}%;font-size:${Math.round(fs * scale)}px;font-weight:${t.getAttribute('font-weight') || 400};color:${t.style.fill || t.getAttribute('fill') || 'inherit'};transform:translate(${shift}, -80%)`;
    host.append(sp); t.remove();
  });
};

function decorate(root) {
  // 꾸미기 전 항목 개수를 적어 둔다(꾸미면 점 · 선 같은 조각이 자식으로 붙음) — 약한 장 검사(weakCheck)용
  root.querySelectorAll('.s-m > :is([class*="m-"], [class*="s-"]):not(.s-label), .s-body > :not(.s-grid)').forEach((el) => { if (!el.dataset.items) el.dataset.items = el.children.length; });
  const main = css('--main');
  root.querySelectorAll('[data-icon]').forEach((el) => {
    // 메인 면 위 아이콘: 메인 조각은 흰색(on-main)으로, 회색 몸체는 메인에 흰색을 섞은 색 — 메인 조각을 메인으로 칠하면 바탕에 묻힌다(2026-10-20)
    const onMain = !el.closest('.s-cover-icon') && !!el.closest('.s-cover-visual, .s-section, .s-m.accent, .s-lead-main, .accent:is(.s-kpi, .s-step, .s-col, .s-agenda > *, .s-stairs > *, .s-cycle > *, .s-pyramid > *, .m-steps > *, .m-names > *, .m-weekplan > *, .m-icongrid > *, .m-timeband .m-bands > .accent)');
    // 표지 경계 아이콘: 흰 바탕과 메인 면에 걸치므로 메인 조각은 한 단계 진한 메인으로(메인 면 위에서도 보이게, 2026-10-20 디자이너)
    const deep = (hex, k) => { const n = parseInt(hex.replace('#', ''), 16); const c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.round(v * (1 - k))); return `#${c.map((v) => v.toString(16).padStart(2, '0')).join('')}`; };
    const color = el.closest('.s-cover-icon') && /^#[0-9a-f]{6}$/i.test(main) ? deep(main, 0.38) : main;
    el.outerHTML = `<span class="s-icon">${renderIcon(el.dataset.icon, onMain ? css('--on-main') || '#FFFFFF' : color, onMain ? main : '#FFFFFF', onMain)}</span>`;
  });
  root.querySelectorAll('i.s-check').forEach((el) => { el.innerHTML = phIcon('check-circle', ''); });
  // 별점: 별 문자(★ · ☆) → 모서리가 둥근 별 아이콘(2026-10-21 디자이너 '별이 투박하다'). ☆는 빈(회색) 별
  root.querySelectorAll('.m-stars, .s-stars').forEach((el) => {
    const star = (on) => `<svg class="m-star${on ? '' : ' off'}" viewBox="-1 -1 26 26"><path d="M12 2L14.7 8.28L21.51 8.91L16.37 13.42L17.88 20.09L12 16.6L6.12 20.09L7.63 13.42L2.49 8.91L9.3 8.28Z" fill="currentColor" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/></svg>`;
    el.innerHTML = [...el.textContent.trim()].filter((c) => c === '★' || c === '☆').map((c) => star(c === '★')).join('');
  });
  // 칸용 조각 더하기 5 (2026-10-20)
  const onMainCol = css('--on-main') || '#FFFFFF'; // 밝은 학원 색이면 제목색(applyBrand)
  const tick = `<svg viewBox="0 0 32 32"><path d="M7 16.5l6 6L25 10" fill="none" stroke="${onMainCol}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  root.querySelectorAll('.m-stepper').forEach((g) => {
    const steps = [...g.querySelectorAll(':scope > div')], now = +g.dataset.now || 1;
    g.style.setProperty('--n', steps.length); g.style.setProperty('--now', now);
    steps.forEach((st, k) => { st.classList.add(k + 1 < now ? 'done' : k + 1 === now ? 'now' : 'next'); st.insertAdjacentHTML('afterbegin', `<span class="m-st-dot">${k + 1 < now ? tick : k + 1}</span>`); });
    g.insertAdjacentHTML('afterbegin', '<span class="m-st-track"></span><span class="m-st-fill"></span>');
  });
  root.querySelectorAll('.m-branch').forEach((g) => {
    const leaves = g.querySelector('.m-leaves'); const n = leaves?.children.length || 3;
    g.style.setProperty('--n', n);
    const drops = Array.from({ length: n }, (_, k) => `<i class="m-br-drop" style="left:calc((100% - ${(n - 1) * 24}px) / ${n} * ${k + 0.5} + ${k * 24}px)"></i>`).join('');
    leaves?.insertAdjacentHTML('beforebegin', `<div class="m-br-lines"><i class="m-br-stem"></i><i class="m-br-bar"></i>${drops}</div>`);
  });
  root.querySelectorAll('.m-sentence .m-sent').forEach((p) => {
    [...p.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        n.textContent.trim().split(/\s+/).filter(Boolean).forEach((w) => {
          const prev = n.previousElementSibling;
          if (/^[.,!?]+$/.test(w) && prev) (prev.classList.contains('m-role') ? prev.firstElementChild : prev).append(w); // 문장부호는 앞 낱말에 붙인다
          else n.before(Object.assign(document.createElement('span'), { textContent: w }));
        });
        n.remove();
      }
      else if (n.dataset?.role) { const role = n.dataset.role; n.classList.add('m-role'); n.innerHTML = `<span>${n.innerHTML}</span><b></b><small>${role}</small>`; }
    });
  });
  // 시 근거 찾기(.m-poem) = 공책 한 장(첨삭 답안과 같은 종이 — 2026-10-21 디자이너): 시 한 줄 = 공책 한 줄, data-note가 있으면 그 줄 오른쪽 끝에 메모 칩
  root.querySelectorAll('.m-poem > .m-verse[data-note]').forEach((v) => v.insertAdjacentHTML('beforeend', `<span class="m-gloss">${v.dataset.note}</span>`));
  // 첨삭 답안 = 공책 한 장: 왼쪽 펀치 구멍 셋 + 여백 세로 줄(2026-10-21 디자이너 '노트 · 종이 느낌')
  root.querySelectorAll('.s-m > :is(.m-fix, .m-poem, .m-lab)').forEach((f) => f.parentElement.insertAdjacentHTML('afterbegin', '<span class="m-paper-margin"></span><span class="m-paper-hole" style="top:22%"></span><span class="m-paper-hole" style="top:50%"></span><span class="m-paper-hole" style="top:78%"></span>'));
  root.querySelectorAll('.m-fix-line[data-why]').forEach((l) => l.insertAdjacentHTML('beforeend', `<span class="m-why"><b>왜?</b> ${l.dataset.why}</span>`)); // 고친 이유는 그 줄 오른쪽 끝(2026-10-21 디자이너)
  root.querySelectorAll('.m-fix del').forEach((d) => {
    const ins = d.nextElementSibling?.tagName === 'INS' ? d.nextElementSibling : null;
    const w = Object.assign(document.createElement('span'), { className: 'm-wrong' });
    w.innerHTML = `${d.innerHTML}<span class="m-strike"></span>${ins ? `<span class="m-right"><span>${ins.innerHTML}</span></span>` : ''}`;
    d.replaceWith(w); ins?.remove();
  });
  root.querySelectorAll('.m-bubbles').forEach((g) => {
    const items = [...g.children], unit = g.dataset.unit ?? '';
    const vals = items.map((b) => parseFloat(b.style.getPropertyValue('--v')) || 0), max = Math.max(...vals, 1);
    items.forEach((b, k) => { const d = Math.round((g.closest('.s-m.w12') ? 460 : 340) * Math.sqrt(vals[k] / max)); /* 전체 폭 칸은 원을 크게(2026-10-21) */ b.insertAdjacentHTML('afterbegin', `<div class="m-bub" style="width:${d}px;height:${d}px"><p class="s-big">${vals[k]}<small>${unit}</small></p></div>`); });
  });
  root.querySelectorAll('.m-checkbox > li').forEach((li) => li.insertAdjacentHTML('afterbegin', `<span class="m-box">${li.classList.contains('on') ? tick : ''}</span>`));
  // 쿠폰 혜택: .s-h + p 짝을 묶고 체크 동그라미(메인 체크)
  const tickMain = tick.replace(onMainCol, css('--main-text') || main); // 옅은 메인 위 체크는 흰 바탕 위 메인 글자색
  root.querySelectorAll('.m-coupon .m-cp-body').forEach((b) => {
    [...b.querySelectorAll(':scope > .s-h')].forEach((h) => {
      const item = Object.assign(document.createElement('div'), { className: 'm-cp-item' });
      const next = h.nextElementSibling?.matches('p:not(.s-h)') ? h.nextElementSibling : null;
      h.before(item); item.insertAdjacentHTML('afterbegin', `<span class="m-cp-check">${tickMain}</span>`); item.append(h); if (next) item.append(next);
    });
  });
  root.querySelectorAll('.m-coupon').forEach((c) => c.insertAdjacentHTML('beforeend', '<span class="m-cp-cut"></span><span class="m-cp-notch m-cp-n1"></span><span class="m-cp-notch m-cp-n2"></span>'));
  // 칸용 조각 더하기 4 (2026-10-20)
  root.querySelectorAll('.m-rating .m-dist > div').forEach((r) => r.querySelector('span')?.insertAdjacentHTML('afterend', '<span class="m-track"><span></span></span>'));
  root.querySelectorAll('.m-month').forEach((g) => {
    const start = +g.dataset.start || 0, days = +g.dataset.days || 30;
    const mark = new Set((g.dataset.mark ?? '').split(',').map(Number)), soft = new Set((g.dataset.soft ?? '').split(',').map(Number));
    const cells = ['일', '월', '화', '수', '목', '금', '토'].map((d) => `<span class="m-wd">${d}</span>`);
    for (let k = 0; k < start; k++) cells.push('<span></span>');
    for (let d = 1; d <= days; d++) cells.push(`<span${mark.has(d) ? ' class="mark"' : soft.has(d) ? ' class="soft"' : ''}>${d}</span>`);
    g.insertAdjacentHTML('afterbegin', `<div class="m-cal-grid">${cells.join('')}</div>`);
  });
  root.querySelectorAll('.m-split').forEach((g) => {
    const [a, b] = g.querySelectorAll(':scope > div');
    g.insertAdjacentHTML('beforeend', `<div class="m-splitbar"><span${a?.classList.contains('accent') ? ' class="accent"' : ''}></span><span${b?.classList.contains('accent') ? ' class="accent"' : ''}></span></div>`);
  });
  root.querySelectorAll('.m-timeband').forEach((g) => {
    const bands = [...g.children], unit = g.dataset.unit ?? '';
    const vals = bands.map((b) => parseFloat(b.style.getPropertyValue('--v')) || 0), total = vals.reduce((x, y) => x + y, 0) || 1;
    g.insertAdjacentHTML('afterbegin', '<div class="m-bands"></div>');
    g.firstElementChild.append(...bands);
    // 아래 = 시간의 흐름: 선 + 끝 화살표 + 점(0 · 구간 경계 · 끝) 아래 누적 숫자. 가운데 점은 카드 사이 틈 가운데(2026-10-20 디자이너)
    const G = 24, n = vals.length; let acc = 0;
    const tick = (left, label) => `<div class="m-tick" style="left:${left}"><i></i><b>${label}</b></div>`;
    const ticks = [tick('0%', `0${unit}`)];
    vals.forEach((v, k) => { acc += v; ticks.push(tick(k === n - 1 ? '100%' : `calc((100% - ${(n - 1) * G}px) * ${acc / total} + ${k * G + G / 2}px)`, `${acc}${unit}`)); });
    g.insertAdjacentHTML('beforeend', `<div class="m-ticks"><span class="m-tl-line"></span><span class="m-tl-arrow">${phIcon('caret-right', '')}</span>${ticks.join('')}</div>`);
  });
  root.querySelectorAll('.m-goal').forEach((g) => {
    const say = g.querySelector(':scope > .m-say'); if (say) say.insertAdjacentHTML('afterbegin', '<span class="m-say-tail"></span>');
    { const now = parseFloat(g.style.getPropertyValue('--now')), to = parseFloat(g.style.getPropertyValue('--goal')); if (to >= 85 && to - now >= 25) g.classList.add('m-to-end'); } // 목표가 오른쪽 끝 가까이면 이름표를 점 왼쪽으로(칸 밖으로 잘리지 않게)
    g.insertAdjacentHTML('afterbegin', '<div class="m-goal-track"><span class="m-fill"></span><span class="m-ahead"></span><span class="m-dot now"></span><span class="m-dot to"></span></div>');
    g.firstElementChild.append(...g.querySelectorAll(':scope > .m-now, :scope > .m-to, :scope > .m-gap, :scope > .m-say')); // 이름표는 트랙 기준으로
  });
  // 주간 계획: 요일은 카드 안 맨 위 칩('월' → '월요일'), 잇는 선은 없음(2026-10-21 디자이너)
  root.querySelectorAll('.m-weekplan > div').forEach((d) => { const wd = d.querySelector(':scope > .m-wd'), task = d.querySelector('.m-task'); if (wd && task) { if (wd.textContent.trim().length === 1) wd.textContent += '요일'; task.prepend(wd); } });
  root.querySelectorAll('.m-loop').forEach((g) => {
    const nodes = [...g.querySelectorAll(':scope > div')];
    const at = ['1 / 1', '1 / 3', '3 / 3', '3 / 1'];
    nodes.forEach((n, k) => { n.style.gridArea = at[k]; n.insertAdjacentHTML('afterbegin', `<span class="s-num">${k + 1}</span>`); });
    // 가운데 순환 화살표 하나(두 호가 시계 방향으로 서로를 쫓음) — 칸 사이 화살표 넷 대신(2026-10-20 디자이너)
    g.insertAdjacentHTML('beforeend', `<span class="m-loop-hub"><svg viewBox="0 0 100 100"><path d="M21.8 39.7A30 30 0 0 1 76 35M78.2 60.3A30 30 0 0 1 24 65" fill="none" stroke="${main}" stroke-width="9" stroke-linecap="round"/><path d="M80.5 42.8L68.9 36.8L81.1 29.8ZM19.5 57.2L31.1 63.2L18.9 70.2Z" fill="${main}" stroke="${main}" stroke-width="3" stroke-linejoin="round"/></svg></span>`);
  });
  // 히트맵 표(.m-heat, 2026-10-21 통합과학 덱): td[data-v] 값(%)만큼 메인 진하기, 50 이상은 흰 글자 — 어디서 많이 틀리는지 색으로
  // 강조 열(table[data-accent-col="3"], 1부터): 색 농도 대신 그 열만 메인 — 머리 알약 메인 면 · 숫자 메인, 나머지 칸은 흰색 · 회색 숫자(2026-10-21 디자이너 '파란 계열이 많아 눈에 안 들어옴')
  root.querySelectorAll('.m-heat[data-accent-col]').forEach((t) => { const c = +t.dataset.accentCol; t.classList.add('m-heat-col'); t.querySelectorAll('tr').forEach((tr) => tr.children[c - 1]?.classList.add('acc')); });
  root.querySelectorAll('.m-heat td[data-v]').forEach((td) => { const v = +td.dataset.v || 0; td.style.setProperty('--v', v); if (v >= 50) td.classList.add('hot'); if (!td.textContent.trim()) td.textContent = `${v}%`; });
  // 반원 게이지(.m-gauge[data-v][data-unit]): 반원 트랙 + 값만큼 메인 호, 가운데 큰 숫자(.s-big) · 이름(.s-h) — 비율 하나를 크게
  root.querySelectorAll('.m-gauge').forEach((g) => {
    const v = Math.max(0, Math.min(100, +g.dataset.v || 0)), R = 260, W = 44, a = Math.PI * (1 - v / 100);
    const x = 300 + R * Math.cos(a), y = 300 - R * Math.sin(a);
    const face = document.createElement('div'); face.className = 'm-gauge-face'; face.append(...[...g.children].filter((c) => !c.classList.contains('m-gauge-ends')));
    g.prepend(face);
    g.insertAdjacentHTML('afterbegin', `<svg class="m-gauge-arc" viewBox="0 0 600 320"><path d="M40 300A260 260 0 0 1 560 300" fill="none" stroke="#DCDEE4" stroke-width="${W}" stroke-linecap="round"/><path d="M40 300A260 260 0 0 1 ${x.toFixed(1)} ${y.toFixed(1)}" fill="none" stroke="${main}" stroke-width="${W}" stroke-linecap="round"/></svg>`); // 트랙 회색 · 값 메인, 가운데 흰 반원 판(글자 자리)
  });
  // 꺾은선 추이(.m-line[data-labels="a|b|c"][data-values="71,66,62"][data-unit]): 점은 HTML(값 · 이름), 잇는 선만 SVG — 마지막 점은 메인
  root.querySelectorAll('.m-line').forEach((g) => {
    const labels = (g.dataset.labels || '').split('|'), vals = (g.dataset.values || '').split(',').map(Number), unit = g.dataset.unit || '';
    const lo = Math.min(...vals), hi = Math.max(...vals), pad = (hi - lo) * 0.35 || 5, min = lo - pad, max = hi + pad, n = vals.length;
    const px = (k) => (n === 1 ? 50 : 8 + (84 * k) / (n - 1)), py = (v) => 100 - ((v - min) / (max - min)) * 100;
    const pts = vals.map((v, k) => `${px(k)},${py(v)}`).join(' ');
    g.innerHTML = `<div class="m-line-plot"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><polygon points="${px(0)},100 ${pts} ${px(n - 1)},100" fill="${g.closest('.s-m.bare') ? 'color-mix(in srgb, var(--main) 7%, #F4F4F4)' : 'none'}" stroke="none"/><polyline points="${pts}" fill="none" stroke="#C5C9D2" stroke-width="1.2" vector-effect="non-scaling-stroke" style="stroke-width:6px"/></svg>${vals.map((v, k) => `<i class="m-line-drop" style="left:${px(k)}%;top:${py(v)}%"></i>`).join('')}${g.dataset.gain ? `<p class="m-line-gain"><span>${g.dataset.gain}</span><b>${vals[n - 1] - vals[0] > 0 ? '+' : ''}${vals[n - 1] - vals[0]}${unit === '%' ? '%p' : unit}</b></p>` : ''}${vals.map((v, k) => `<span class="m-line-pt${k === n - 1 ? ' last' : ''}" style="left:${px(k)}%;top:${py(v)}%"><b>${v}${unit}</b></span>`).join('')}</div><div class="m-line-x">${labels.map((l, k) => `<span style="left:${px(k)}%">${l}</span>`).join('')}</div>`;
  });
  // 탐구 보고서(.m-lab > .s-label + p[data-k]): 공책 종이(첨삭 답안과 같은 구멍 · 여백 선), 줄마다 왼쪽 항목 칩(가설 · 변인 · 결과 · 결론)
  root.querySelectorAll('.m-lab > p[data-k]').forEach((p) => p.insertAdjacentHTML('afterbegin', `<span class="m-lab-k">${p.dataset.k}</span>`));
  // 시험지 두 장(.m-papers > .m-paper[data-rows="t t c ..."]): 종이 안 줄 — t = 글 문항(회색 줄 둘), c = 자료 문항(작은 막대 그래프 칸), 오른쪽 위 점수 도장(.m-score) — 시험이 어떻게 달라졌는지 그림으로(2026-10-21 통합과학 덱)
  root.querySelectorAll('.m-papers > .m-paper').forEach((p) => {
    const rows = (p.dataset.rows || 't t t t t t').trim().split(/\s+/).filter(Boolean), sheet = p.querySelector('.m-sheet');
    if (!sheet) return;
    // 시험지 모양(2026-10-21 디자이너 '줄글 말고 시험지 같은 종이'): 머리(시험 이름 = 라벨 · 이름 칸) · 두 줄 선 · 번호 붙은 문항 두 단, 뒤에 한 장 더 겹친 종이. 문항은 글자 없이 줄만(없는 정보 ✗)
    const label = sheet.querySelector('.s-label'); label?.classList.add('m-exam-title');
    sheet.insertAdjacentHTML('beforeend', `<span class="m-exam-rule"></span><span class="m-exam-qs">${rows.map((r, k) => `<span class="m-q ${r === 'c' ? 'chart' : 'text'}"><em>${k + 1}</em>${r === 'c' ? '<b></b><i style="height:46%"></i><i style="height:78%"></i><i style="height:60%"></i><i style="height:92%"></i>' : '<i></i>'}</span>`).join('')}</span>`); // 미니멀(2026-10-21 디자이너): 이름 칸 ✗, 선 한 줄, 문항은 번호 + 줄 하나
    p.insertAdjacentHTML('afterbegin', '<span class="m-sheet-back"></span>');
  });
  root.querySelectorAll('.m-papers:not([data-arrow="none"])').forEach((g) => [...g.querySelectorAll(':scope > .m-paper')].slice(1).forEach((c) => c.insertAdjacentHTML('beforebegin', `<span class="s-arrow">${phIcon('caret-right', '')}</span>`)));
  // 피라미드(상자 없는 칸): 층마다 사다리꼴로 잘라 전체가 하나의 삼각형 — SVG 띠(흰색 · 맨 위 강조는 메인)를 층 뒤에 깔고 층 이름은 글로 그대로(2026-10-21 디자이너 '숫자 · 화살표 빼고 더 피라미드 같게')
  root.querySelectorAll('.s-m.bare > .m-pyramid').forEach((g) => {
    // 꼭대기는 뾰족한 삼각형(맨 위 층만 높게 · 이름은 아래쪽), 모서리는 둥글게 — 같은 색 굵은 선(round)으로 다듬고 그만큼 안쪽으로 줄여 틈은 그대로(2026-10-21 디자이너)
    const layers = [...g.querySelectorAll(':scope > div')], n = layers.length, h = 116, top = 240, gap = 14, R = 14, W = 1000;
    const hs = layers.map((_, k) => (k ? h : top)), H = hs.reduce((a, b) => a + b, 0) + (n - 1) * gap;
    const half = (y) => (W / 2) * y / H;
    let y = 0;
    const bands = layers.map((d, k) => {
      const y0 = y + R, y1 = y + hs[k] - R, a = Math.max(0, half(y0) - R * 1.4), b = half(y1) - R * 1.4; y += hs[k] + gap;
      const c = d.classList.contains('accent') ? main : '#FFFFFF';
      d.style.height = `${hs[k]}px`;
      return `<polygon points="${W / 2 - a},${y0} ${W / 2 + a},${y0} ${W / 2 + b},${y1} ${W / 2 - b},${y1}" fill="${c}" stroke="${c}" stroke-width="${R * 2}" stroke-linejoin="round"/>`;
    }).join('');
    g.insertAdjacentHTML('afterbegin', `<svg class="m-pyr-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">${bands}</svg>`);
  });
  // 벽돌 피라미드(.m-bricks > div[.accent] .s-h, 위 → 아래): 줄마다 둥근 블록을 위에서부터 1 · 2 · 3 · 4개, 이름은 오른쪽 옆 — 맨 위(.accent) 블록만 메인(2026-10-21 디자이너 시안 A)
  root.querySelectorAll('.m-bricks > div').forEach((d, k) => d.insertAdjacentHTML('afterbegin', `<span class="m-brick-row">${'<i></i>'.repeat(k + 1)}</span>`));
  // 상자 없는 진행 단계: 단계 이름 · 설명을 흰 카드에 담는다(점 아래, 2026-10-21 — 점과 글만 있으면 얇고 작아 보임)
  root.querySelectorAll('.s-m.bare > .m-stepper > div').forEach((d) => { const t = [...d.children].filter((c) => !c.classList.contains('m-st-dot')); if (!t.length || d.querySelector('.m-st-card')) return; const w = document.createElement('div'); w.className = 'm-st-card'; w.append(...t); d.append(w); });
  // 책장(.m-shelf[data-n="16"]): 바닥 선 위에 책등 n권(높이는 정해진 순서로 들쭉날쭉), 마지막 권(data-hi 번째, 기본 없음)만 메인 — 읽을 책의 양을 그림으로(2026-10-21 독서 덱)
  root.querySelectorAll('.m-shelf').forEach((g) => {
    const n = +g.dataset.n || 12, hi = (g.dataset.hi || '').split(',').map(Number), hs = [86, 100, 92, 78, 96, 88, 100, 82, 94, 90, 80, 98, 86, 92, 100, 84];
    g.insertAdjacentHTML('afterbegin', `<div class="m-shelf-books">${Array.from({ length: n }, (_, k) => `<i class="${hi.includes(k + 1) ? 'hi' : ''}" style="height:${hs[k % hs.length]}%"></i>`).join('')}</div><span class="m-shelf-base"></span>`);
  });
  // ── 영어 리딩 덱(2026-10-21) 새 도식 7종 ──
  // 장 표지 오른쪽 메인 면(.s-section > .s-section-visual — 표지처럼 일부만 메인, 2026-10-22 디자이너): PART 번호의 숫자를 두 자리로 크게
  root.querySelectorAll('.slide.s-section').forEach((sec) => { if (sec.querySelector('.s-section-visual')) return; const n = (sec.querySelector('.s-section-num')?.textContent.match(/\d+/) || [''])[0]; sec.insertAdjacentHTML('beforeend', `<div class="s-section-visual"><span>${n ? n.padStart(2, '0') : ''}</span></div>`); });
  // 개념 카드 둘(.m-ideas > div[data-draw="square|bounce"](.s-label · .s-h · .m-idea-blk 블록 글)): 카드 아래쪽에 그 개념이 만든 움직임 그림(SVG) — 반복 = 같은 동작 4번으로 그린 정사각형(변마다 1 ~ 4), 조건 = 벽에 닿으면 튕겨 나오는 길
  root.querySelectorAll('.m-ideas > div[data-draw]').forEach((d) => {
    if (d.querySelector('.m-idea-svg')) return; const A = '<defs><marker id="m-ia" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="var(--main)"/></marker></defs>';
    const sq = `<path d="M60 200 V40 H220 V200 H90" fill="none" stroke="var(--main)" stroke-width="9" stroke-linejoin="round" stroke-linecap="round" marker-end="url(#m-ia)"/><circle cx="60" cy="200" r="12" fill="#FFFFFF" stroke="#B7BAC3" stroke-width="6"/>${[[60, 120], [140, 40], [220, 120], [140, 200]].map(([x, y], k) => `<g><circle cx="${x}" cy="${y}" r="20" fill="#FFFFFF" stroke="#E3E6EB" stroke-width="2"/><text x="${x}" y="${y + 8}" text-anchor="middle" font-size="22" font-weight="600" fill="var(--main)">${k + 1}</text></g>`).join('')}`;
    const bo = `<rect x="226" y="20" width="14" height="200" rx="7" fill="#DCDEE4"/><path d="M40 190 L214 120" fill="none" stroke="#B7BAC3" stroke-width="7" stroke-dasharray="14 12" stroke-linecap="round"/><path d="M214 120 L70 40" fill="none" stroke="var(--main)" stroke-width="9" stroke-linecap="round" marker-end="url(#m-ia)"/><circle cx="40" cy="190" r="12" fill="#FFFFFF" stroke="#B7BAC3" stroke-width="6"/><circle cx="214" cy="120" r="10" fill="var(--main)"/>`;
    const lp = `<path d="M 172 49 A 78 78 0 1 1 108 49" fill="none" stroke="var(--main)" stroke-width="14" stroke-linecap="round" marker-end="url(#m-ic)"/>`;
    const fk = `<path d="M60 120 H130" stroke="#B7BAC3" stroke-width="12" stroke-linecap="round"/><path d="M130 120 C170 120 170 60 214 60" fill="none" stroke="var(--main)" stroke-width="12" stroke-linecap="round" marker-end="url(#m-ic)"/><path d="M130 120 C170 120 170 180 214 180" fill="none" stroke="#B7BAC3" stroke-width="12" stroke-linecap="round" marker-end="url(#m-ib)"/><circle cx="130" cy="120" r="16" fill="#FFFFFF" stroke="var(--main)" stroke-width="8"/>`;
    const B = '<marker id="m-ic" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="3.2" markerHeight="3.2" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="var(--main)"/></marker><marker id="m-ib" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="3.2" markerHeight="3.2" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#B7BAC3"/></marker>';
    const pic = { loop: lp, fork: fk, bounce: bo, square: sq }[d.dataset.draw] || sq;
    d.insertAdjacentHTML('beforeend', `<svg class="m-idea-svg" viewBox="0 0 280 240">${A.replace('</defs>', B + '</defs>')}${pic}</svg>`); /* loop = 되돌아오는 화살표(반복), fork = 갈래(조건) — 동작 하나보다 넓은 뜻을 보여 주는 기호 */
  });
  // ── 코딩 · AI 덱(2026-10-22) 새 도식 7종 ──
  // 가운데 원 + 둘레 카드(.m-orbit > .m-orb-c(.s-big · p) + div(아이콘 · .s-h) ×4): 가운데 메인 원, 네 모서리 카드, 가운데에서 카드로 점선(SVG)
  root.querySelectorAll('.m-orbit').forEach((g) => {
    if (g.querySelector('.m-orb-lines')) return; const sats = [...g.querySelectorAll(':scope > div:not(.m-orb-c)')];
    const P = [[17, 22], [17, 78], [83, 22], [83, 78]]; sats.forEach((d, k) => { d.classList.add('m-orb-s'); d.style.left = `${P[k][0]}%`; d.style.top = `${P[k][1]}%`; });
    g.insertAdjacentHTML('afterbegin', `<svg class="m-orb-lines" viewBox="0 0 100 100" preserveAspectRatio="none">${sats.map((_, k) => `<line x1="50" y1="50" x2="${P[k][0]}" y2="${P[k][1]}" stroke="#C5C9D2" stroke-width="1" stroke-dasharray="2 2" vector-effect="non-scaling-stroke" style="stroke-width:5px;stroke-dasharray:14 12"/>`).join('')}</svg>`);
  });
  // 입력 → 처리 → 출력(.m-io > div ×3(.s-label · .s-h · p), 가운데 .accent): 사이에 화살표 자동
  root.querySelectorAll('.m-io').forEach((g) => { if (g.querySelector('.s-arrow')) return; [...g.children].slice(1).forEach((c) => c.insertAdjacentHTML('beforebegin', `<span class="s-arrow">${phIcon('caret-right', '')}</span>`)); });
  // 코드 화면(.m-code > p[.hl][data-note] 줄): 위 창 띠(점 셋), 줄 번호 자동, 강조 줄은 옅은 메인 띠 + 오른쪽 끝 메모 칩
  root.querySelectorAll('.m-code').forEach((g) => {
    if (g.querySelector('.m-code-bar')) return; g.querySelectorAll(':scope > p').forEach((l, k) => { l.insertAdjacentHTML('afterbegin', `<b class="m-ln">${k + 1}</b>`); if (l.dataset.note) l.insertAdjacentHTML('beforeend', `<span class="m-code-note">${l.dataset.note}</span>`); });
    g.insertAdjacentHTML('afterbegin', '<div class="m-code-bar"><i></i><i></i><i></i></div>');
  });
  // 퍼즐 조각(.m-puzzle > div[.accent](.s-h · p) ×4): 조각 오른쪽 가운데 둥근 혹(조각과 같은 색)이 다음 조각에 끼워짐 — 혹은 문서 끝에 따로 놓아 다음 조각 위에 그려지게(PPT 순서)
  root.querySelectorAll('.m-puzzle').forEach((g) => {
    if (g.querySelector('.m-tab')) return; const pcs = [...g.children]; pcs.forEach((d, k) => { d.classList.add('m-pc'); if (k % 2) d.classList.add('alt'); });
    pcs.slice(0, -1).forEach((d, k) => g.insertAdjacentHTML('beforeend', `<i class="m-tab${d.classList.contains('accent') ? ' accent' : d.classList.contains('alt') ? ' alt' : ''}" style="--k:${k + 1};--n:${pcs.length}"></i>`));
  });
  // 순서도(.m-flow > p[data-k="start|q|yes|no|end"]): 시작 · 끝은 둥근 알약, 질문은 마름모(SVG, 메인), 예 · 아니오 칸, 잇는 선과 화살촉(SVG), 갈래 이름 칩
  root.querySelectorAll('.m-flow').forEach((g) => {
    if (g.querySelector('.m-flow-lines')) return; const by = (k) => g.querySelector(`[data-k="${k}"]`);
    ['start', 'q', 'yes', 'no', 'end'].forEach((k) => by(k)?.classList.add(`m-f-${k}`));
    const q = by('q'); if (q) q.insertAdjacentHTML('afterbegin', '<svg class="m-f-dia" viewBox="0 0 340 240"><polygon points="170,6 334,120 170,234 6,120" fill="var(--main)" stroke="var(--main)" stroke-width="10" stroke-linejoin="round"/></svg>');
    const L = 'stroke="#B7BAC3" stroke-width="5" fill="none" stroke-linejoin="round" marker-end="url(#m-fa)"';
    g.insertAdjacentHTML('afterbegin', `<svg class="m-flow-lines" viewBox="0 0 1560 500"><defs><marker id="m-fa" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="#B7BAC3"/></marker></defs><path d="M210 250 H340" ${L}/><path d="M520 136 V110 H808" ${L}/><path d="M520 364 V390 H808" ${L}/><path d="M1140 110 H1250 V250 H1328" ${L}/><path d="M1140 390 H1250 V250" stroke="#B7BAC3" stroke-width="5" fill="none"/></svg><span class="m-f-tag yes">예</span><span class="m-f-tag no">아니오</span>`);
  });
  // 단계 배지(.m-badges > div[.accent](.s-label 단계 · i 아이콘 · .s-h · p)): 둥근 배지(테두리 원 안 아이콘), 배지 사이 점선, 마지막(.accent)은 메인 테두리
  root.querySelectorAll('.m-badges > div').forEach((d) => { if (d.querySelector('.m-badge')) return; const ic = d.querySelector('.s-icon'); const b = document.createElement('span'); b.className = 'm-badge'; if (ic) b.appendChild(ic); d.insertBefore(b, d.querySelector('.s-h')); });
  // ── 중3 과학고 · 영재학교 덱(2026-10-22) 새 도식 5종 ──
  // 관문(.m-gates > div(.s-big 인원 · .s-h 단계 · p)[.accent] ×3): 왼쪽부터 작아지는 아치 문(SVG — 흰 · 마지막 메인), 숫자는 아치 안, 단계 이름은 아래, 사이 화살표
  root.querySelectorAll('.m-gates').forEach((g) => { // 아치 문은 '이상하다'(2026-10-22 디자이너) → 작아지는 원 셋: 원은 세로 가운데를 맞춘 400 칸 안, 숫자는 원 가운데, 이름 · 한 줄은 아래 같은 높이
    if (g.querySelector('.m-gt-slot')) return; const ds = [400, 300, 230];
    [...g.children].forEach((d, k) => { d.style.setProperty('--d', `${ds[k] || ds.at(-1)}px`); const big = d.querySelector('.s-big'); d.insertAdjacentHTML('afterbegin', '<div class="m-gt-slot"><span class="m-gt-c"></span></div>'); if (big) d.querySelector('.m-gt-c').append(big); if (k) d.insertAdjacentHTML('beforebegin', `<span class="s-arrow">${phIcon('caret-right', '')}</span>`); });
  });
  // 세 원 겹치기(.m-venn3 > p.m-v3-c 가운데 이름 + div(.s-h · p) ×3): 흰 원 셋(왼쪽 위 · 오른쪽 위 · 아래)을 겹치고 테두리는 위에 다시, 가운데 메인 칩 — 원 이름은 원 안, 한 줄은 원 바깥(SVG 1400 × 640)
  root.querySelectorAll('.m-venn3').forEach((g) => {
    if (g.querySelector('svg')) return; const R = 210, C = [[578, 214], [822, 214], [700, 424]];
    // 테두리 선 없이 옅은 회색 반투명 원 셋 — 겹칠수록 짙어져 겹친 곳이 저절로 보임(2026-10-22 디자이너 '원마다 선이 복잡') · 가운데 셋이 겹친 곳에 메인 칩
    const fills = C.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${R}" fill="#5A6070" fill-opacity="0.09"/>`).join('');
    g.insertAdjacentHTML('afterbegin', `<svg class="m-v3-svg" viewBox="0 0 1400 640">${fills}</svg>`);
    g.querySelectorAll(':scope > div').forEach((d, k) => d.classList.add(`p${k}`));
  });
  // 진행 고리(.m-rings > div[data-v="90"][.accent](.s-h 이름 · b 값) ×3): 안으로 갈수록 작은 고리 셋 — 빈 트랙 회색 · 채운 만큼 둥근 끝 선(강조 .accent는 메인, 나머지는 짙은 회색), 오른쪽 이름 · 값
  root.querySelectorAll('.m-rings').forEach((g) => {
    if (g.querySelector('svg')) return; const items = [...g.children], C = 280, Rs = [236, 172, 108], T = 44;
    const arcs = items.map((d, k) => { const v = Math.min(99.9, +d.dataset.v || 0), R = Rs[k], a = (v / 100) * 2 * Math.PI, x = C + R * Math.sin(a), y = C - R * Math.cos(a), nk = items.slice(0, k).filter((e) => !e.classList.contains('accent')).length, soft = !d.classList.contains('accent') && nk === 1, col = d.classList.contains('accent') ? 'var(--main)' : soft ? '#9DB2F5' : '#B0B4BE'; /* 강조 메인 · 둘째는 옅은 메인(회색 둘은 칙칙 — 2026-10-22 디자이너) · 나머지 옅은 회색 */ /* 셋이 구분되게 — 메인은 강조 하나, 나머지는 옅은 · 짙은 회색(2026-10-22 디자이너 '두 고리 색이 같아 구분이 안 됨') */ d.classList.add('m-rg-item'); d.style.setProperty('--dot', col);
      return `<circle cx="${C}" cy="${C}" r="${R}" fill="none" stroke="#ECEEF1" stroke-width="${T}"/><path d="M${C} ${C - R} A${R} ${R} 0 ${v > 50 ? 1 : 0} 1 ${x.toFixed(1)} ${y.toFixed(1)}" fill="none" stroke-width="${T}" stroke-linecap="round"${soft ? ' data-tint-stroke="0.42"' : ''} style="stroke:${col}"/>`; }).join('');
    g.insertAdjacentHTML('afterbegin', `<svg class="m-rg-svg" viewBox="0 0 560 560">${arcs}</svg>`);
    const legend = document.createElement('div'); legend.className = 'm-rg-legend'; legend.append(...items); g.append(legend);
  });
  // 순환 바퀴(.m-wheel > div(.s-h · p)[.accent] ×4): 고리를 네 조각(위 → 오른쪽 → 아래 → 왼쪽, 시계 방향)으로, 조각 끝마다 둥근 화살촉 — 글은 고리 바깥 네 방향
  root.querySelectorAll('.m-wheel').forEach((g) => {
    if (g.querySelector('svg')) return; const items = [...g.children], C = 280, R = 210, T = 70, gp = 9;
    const pt = (deg, r = R) => [C + r * Math.sin((deg * Math.PI) / 180), C - r * Math.cos((deg * Math.PI) / 180)];
    const segs = items.map((d, k) => { const a0 = k * 90 + gp, a1 = a0 + 90 - 2 * gp - 10, [x0, y0] = pt(a0), [x1, y1] = pt(a1), col = d.classList.contains('accent') ? 'var(--main)' : '#DCDEE4';
      const tip = pt(a1 + 10), l = pt(a1, R - T / 2 - 6), r2 = pt(a1, R + T / 2 + 6);
      d.classList.add(`q${k}`);
      return `<path d="M${x0.toFixed(1)} ${y0.toFixed(1)} A${R} ${R} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}" fill="none" stroke-width="${T}" style="stroke:${col}"/><path d="M${l.map((v) => v.toFixed(1)).join(' ')} L${tip.map((v) => v.toFixed(1)).join(' ')} L${r2.map((v) => v.toFixed(1)).join(' ')} Z" stroke-width="10" stroke-linejoin="round" style="fill:${col};stroke:${col}"/>`; }).join('');
    g.insertAdjacentHTML('afterbegin', `<svg class="m-wh-svg" viewBox="0 0 560 560"><circle cx="${C}" cy="${C}" r="300" fill="#FFFFFF" style="filter:drop-shadow(0 12px 24px rgba(20,24,40,.07))"/>${segs}</svg>`); // 바퀴 뒤에 흰 원판(허전해서, 2026-10-22 디자이너)
  });
  // 굽은 길(.m-road > div(.s-label 때 · .s-h)[.accent] ×5): 왼쪽 아래 → 오른쪽 위로 굽이치는 굵은 길(SVG 1560 × 560), 길 위 이정표 점 · 점마다 위 · 아래 번갈아 카드
  root.querySelectorAll('.m-road').forEach((g) => {
    if (g.querySelector('svg')) return; const P = [[120, 430], [460, 300], [800, 400], [1140, 240], [1440, 150]].slice(0, g.children.length);
    let d = `M${P[0][0] - 80} ${P[0][1] + 40}`; const pts = [[P[0][0] - 80, P[0][1] + 40], ...P, [P.at(-1)[0] + 80, P.at(-1)[1] - 40]];
    for (let i = 1; i < pts.length; i++) { const p0 = pts[i - 2] || pts[i - 1], p1 = pts[i - 1], p2 = pts[i], p3 = pts[i + 1] || p2; d += ` C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0]} ${p2[1]}`; }
    const items = [...g.children]; const dots = P.map(([x, y], k) => `<circle cx="${x}" cy="${y}" r="22" fill="#FFFFFF" stroke-width="10" style="stroke:${items[k].classList.contains('accent') ? 'var(--main)' : '#B7BAC3'}"/>`).join('');
    items.forEach((it, k) => { it.classList.add('m-rd-card', k % 2 ? 'below' : 'above'); it.style.left = `${P[k][0]}px`; it.style.top = `${P[k][1]}px`; });
    g.insertAdjacentHTML('afterbegin', `<svg class="m-rd-svg" viewBox="0 0 1560 560"><path d="${d}" fill="none" stroke="#DCDEE4" stroke-width="44" stroke-linecap="round"/>${dots}</svg>`);
  });
  // ── 예비 고1 고교학점제 · 5등급 내신 덱(2026-10-22) 새 도식 6종 ──
  // 등급 띠(.m-tiers > div[data-cuts="10,34,66,90,100"][.accent](.s-label 이름)): 줄마다 100% 띠를 등급 칸으로 나눔(누적 비율 → 칸 폭), 띠 위에 '1등급 = 상위 n%' — 강조 줄의 1등급 칸만 메인
  root.querySelectorAll('.m-tiers').forEach((g) => {
    if (g.querySelector('.m-tr-bar')) return;
    g.querySelectorAll(':scope > div').forEach((row) => {
      const cuts = (row.dataset.cuts || '100').split(',').map(Number); let prev = 0;
      const segs = cuts.map((c, k) => { const w = c - prev; prev = c; return `<i style="flex-grow:${w}"><b>${k + 1}</b></i>`; }).join('');
      row.insertAdjacentHTML('beforeend', `<div class="m-tr-track"><p class="m-tr-pct">1등급 = 상위 ${cuts[0]}%</p><div class="m-tr-bar">${segs}</div></div>`);
    });
  });
  // 시간표(.m-timetable > div.m-tt(.s-label 누구 · ol > li[.pick] 과목 — 5칸씩 줄)): 요일 머리 칸을 붙이고, 내가 고른 과목(.pick)은 메인 테두리
  root.querySelectorAll('.m-timetable .m-tt > ol').forEach((ol) => {
    if (ol.querySelector('.m-tt-wd')) return;
    ol.insertAdjacentHTML('afterbegin', ['월', '화', '수', '목', '금'].map((d) => `<li class="m-tt-wd">${d}</li>`).join(''));
  });
  // 과목 노선도(.m-subway > p.m-sw-start 출발 + div[.accent](.s-h 진로 · p 고2 과목 · p 고3 과목) ×3): 출발역(공통 과목)에서 진로마다 노선이 갈라짐 — 강조 노선만 메인, 역 이름은 역 아래, 진로 이름은 노선 끝(SVG 1560 × 600)
  root.querySelectorAll('.m-subway').forEach((g) => {
    if (g.querySelector('svg')) return; const rows = [...g.querySelectorAll(':scope > div')], n = rows.length;
    const Y = rows.map((_, k) => (n === 1 ? 340 : 180 + (k * 320) / (n - 1))), mid = 340, X = [620, 1000], x0 = 210, xEnd = 1140;
    const heads = (g.dataset.heads || '고1 공통|고2 일반 선택|고3 진로 선택').split('|');
    const order = rows.map((r, k) => k).sort((a, b) => rows[a].classList.contains('accent') - rows[b].classList.contains('accent')); // 강조 노선은 마지막에 그려 위로
    const lines = order.map((k) => { const y = Y[k], col = rows[k].classList.contains('accent') ? 'var(--main)' : '#DCDEE4';
      return `<path d="M${x0} ${mid} C${x0 + 120} ${mid} ${x0 + 80} ${y} ${x0 + 220} ${y} H${xEnd}" fill="none" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" style="stroke:${col}"/>${X.map((x) => `<circle cx="${x}" cy="${y}" r="24" fill="#FFFFFF" stroke-width="10" style="stroke:${col}"/>`).join('')}`; }).join('');
    g.insertAdjacentHTML('afterbegin', `<svg class="m-sw-svg" viewBox="0 0 1560 600">${lines}</svg>${heads.map((h, k) => `<p class="s-label m-sw-head" style="left:${[110, ...X][k]}px">${h}</p>`).join('')}`);
    rows.forEach((r, k) => { r.querySelector('.s-h')?.style.setProperty('top', `${Y[k]}px`); r.querySelectorAll(':scope > p:not(.s-h)').forEach((p, j) => { p.style.left = `${X[j]}px`; p.style.top = `${Y[k] + 44}px`; }); });
  });
  // 이수 기준선(.m-thresh > div[style="--v:67"](.s-h 이름 · b 기준)): 줄마다 띠를 기준에서 나눔 — 왼쪽 '미이수'(회색) · 오른쪽 '이수'(흰 카드), 경계에 메인 기준선 + 위에 기준 글
  root.querySelectorAll('.m-thresh > div').forEach((row) => {
    if (row.querySelector('.m-th-bar')) return;
    row.insertAdjacentHTML('beforeend', '<div class="m-th-bar"><span class="m-th-low">미이수</span><span class="m-th-ok">이수</span><i class="m-th-mark"></i></div>');
  });
  // 모이는 선(.m-merge > div(.s-label · p[data-to="0"] 전 과목 …) + div(.s-label · div(.s-h · p) 후 과목 …)): 왼쪽 여러 칩이 곡선으로 모여 오른쪽 카드 하나로 — 카드는 모인 칩들의 가운데 높이(SVG 1440 × 560)
  root.querySelectorAll('.m-merge').forEach((g) => {
    if (g.querySelector('svg')) return; const [L, R] = g.querySelectorAll(':scope > div'); if (!L || !R) return;
    const src = [...L.querySelectorAll(':scope > p')], dst = [...R.querySelectorAll(':scope > div')], T = 72, h = 80, gp = 20, cy = (k) => T + k * (h + gp) + h / 2, dh = 200, x0 = 380, x1 = 980;
    src.forEach((p, k) => { p.style.top = `${T + k * (h + gp)}px`; });
    const cs = dst.map((_, j) => { const ys = src.flatMap((p, k) => (+p.dataset.to === j ? [cy(k)] : [])); return ys.length ? ys.reduce((a, b) => a + b, 0) / ys.length : T + dh / 2; });
    dst.forEach((d, j) => { d.style.top = `${cs[j] - dh / 2}px`; });
    const paths = src.map((p, k) => { const y0 = cy(k), y1 = cs[+p.dataset.to] ?? y0, xm = (x0 + x1) / 2; return `<path d="M${x0} ${y0} C${xm} ${y0} ${xm} ${y1} ${x1} ${y1}" fill="none" stroke="#DCDEE4" stroke-width="8" stroke-linecap="round"/>`; }).join('');
    g.insertAdjacentHTML('afterbegin', `<svg class="m-mg-svg" viewBox="0 0 1440 560">${paths}</svg>`);
  });
  // ── 고2 · 3 대입 논술 덱(2026-10-22) 새 도식 5종 ──
  // 주말 시험 일정(.m-weekend > div[.accent](.s-label 주 · ul > li(b 요일 · span 대학 …) ×2)): 주마다 흰 카드에 토 · 일 줄, 대학 칩은 오른쪽에 모아 줄바꿈 — 강조 주만 메인 면
  root.querySelectorAll('.m-weekend li').forEach((li) => {
    if (li.querySelector('.m-wk-chips')) return; const box = document.createElement('div'); box.className = 'm-wk-chips'; box.append(...li.querySelectorAll(':scope > span')); li.append(box);
  });
  // 제시문 연결(.m-links > .m-lk-c(.s-label · .s-h) 가운데 논제 + div[data-role](.s-label · .s-h) ×4): 네 모서리 제시문 카드에서 가운데 논제로 선, 선 가운데 역할 칩(SVG 1560 × 600)
  root.querySelectorAll('.m-links').forEach((g) => {
    if (g.querySelector('svg')) return; const items = [...g.querySelectorAll(':scope > div:not(.m-lk-c)')].slice(0, 4);
    const A = [[400, 130, 570, 260], [1160, 130, 990, 260], [400, 470, 570, 340], [1160, 470, 990, 340]];
    items.forEach((d, k) => d.classList.add(`p${k}`));
    const lines = items.map((_, k) => `<line x1="${A[k][0]}" y1="${A[k][1]}" x2="${A[k][2]}" y2="${A[k][3]}" stroke="#DCDEE4" stroke-width="8" stroke-linecap="round"/>`).join('');
    g.insertAdjacentHTML('afterbegin', `<svg class="m-lk-svg" viewBox="0 0 1560 600">${lines}</svg>`);
    items.forEach((d, k) => { if (d.dataset.role) g.insertAdjacentHTML('beforeend', `<span class="m-lk-role" style="left:${(A[k][0] + A[k][2]) / 2}px;top:${(A[k][1] + A[k][3]) / 2}px">${d.dataset.role}</span>`); });
  });
  // 개요표(.m-outline > .m-ol-head(.s-label · p) + ol > li[.accent](b 부분 · p 내용 · span 분량 '150자')): 흰 종이 한 장, 줄마다 분량만큼 막대(가장 긴 줄 = 240px) — 강조 줄은 옅은 메인 띠 + 메인 막대
  root.querySelectorAll('.m-outline ol').forEach((ol) => {
    if (ol.querySelector('.m-ol-bar')) return; const lis = [...ol.children], ns = lis.map((li) => parseFloat(li.querySelector('span')?.textContent) || 0), max = Math.max(...ns, 1);
    lis.forEach((li, k) => li.querySelector('span')?.insertAdjacentHTML('beforebegin', `<i class="m-ol-bar"><i style="width:${Math.round((ns[k] / max) * 240)}px"></i></i>`));
  });
  // 경쟁 점(.m-crowd > div[data-n="45"][data-of="45"][.accent](.s-label · b 비율)): 한 사람 = 점 하나(15개씩 줄), data-of만큼 자리를 두고 n명 밖은 옅은 회색 — 강조 줄의 점만 메인
  root.querySelectorAll('.m-crowd > div').forEach((d) => {
    if (d.querySelector('.m-cr-dots')) return; const n = +d.dataset.n || 0, of = Math.max(n, +d.dataset.of || n);
    d.insertAdjacentHTML('beforeend', `<div class="m-cr-dots">${'<i></i>'.repeat(n)}${'<i class="off"></i>'.repeat(of - n)}</div>`);
  });
  // 수능 최저 계산(.m-lights > div[.pick](b 등급 · .s-h 과목) ×4 + p.m-lt-sum(.s-label · b · span)): 동그라미 넷과 결과 카드 사이 화살표
  root.querySelectorAll('.m-lights > .m-lt-sum').forEach((sum) => { if (sum.previousElementSibling?.classList.contains('s-arrow')) return; sum.insertAdjacentHTML('beforebegin', `<span class="s-arrow">${phIcon('caret-right', '')}</span>`); });
  // ── 중1 첫 지필고사 덱(2026-10-22) 새 도식 5종 ──
  // 책 쌓기(.m-bookstack > div[.accent](ul > li 과목 … · .s-label 이름 · .s-h 과목 수) ×2): 과목마다 책등 하나(흰, 왼쪽 띠), 아래부터 쌓고 줄마다 살짝 엇갈림 — 강조 묶음의 띠만 메인
  root.querySelectorAll('.m-bookstack li').forEach((li) => { if (!li.querySelector('.m-bk-band')) li.insertAdjacentHTML('afterbegin', '<i class="m-bk-band"></i>'); });
  // 시험 범위(.m-scope > div[data-from][data-to][data-pages][.accent](.s-h 과목) …): 교과서 한 권 = 흰 띠(길이 = 쪽수), 시험 범위만큼 칠하고 안에 'n~m쪽', 오른쪽 끝에 전체 쪽수 — 강조 줄만 메인
  root.querySelectorAll('.m-scope').forEach((g) => {
    if (g.querySelector('.m-sc-book')) return; const rows = [...g.querySelectorAll(':scope > div')], max = Math.max(...rows.map((d) => +d.dataset.pages || 1));
    rows.forEach((d) => { const P = +d.dataset.pages || max, a = +d.dataset.from || 0, b = +d.dataset.to || P;
      d.insertAdjacentHTML('beforeend', `<div class="m-sc-book" style="width:${(P / max) * 100}%"><i class="m-sc-range" style="left:${(a / P) * 100}%;width:${((b - a) / P) * 100}%">${a}~${b}쪽</i></div><span class="m-sc-total">${P}쪽</span>`); });
  });
  // OMR 답안지(.m-omr > .s-label + div[data-mark="2"][.err](p 메모) …): 줄마다 왼쪽 검은 타이밍 표시 · 문항 번호 · ①~⑤ 동그라미(칠한 칸은 검게), 실수 줄은 옅은 메인 띠 + 메모 칩
  root.querySelectorAll('.m-omr > div[data-mark]').forEach((row, k) => {
    if (row.querySelector('.m-om-b')) return; const on = row.dataset.mark.split(',').map(Number);
    row.insertAdjacentHTML('afterbegin', `<i class="m-om-t"></i><b class="m-om-n">${k + 1}</b><span class="m-om-b">${[1, 2, 3, 4, 5].map((n) => `<i${on.includes(n) ? ' class="on"' : ''}>${n}</i>`).join('')}</span>`);
  });
  // 성적 분포 곡선(.m-bell[data-mean="70"][data-sd="15"][data-me="85"] > p.m-bl-mean · div.m-bl-me(.s-label · .s-h)): 종 모양 곡선(회색 면) + 평균 선 + 우리 아이 선(메인) · 오른쪽 꼬리 옅은 메인, 아래 눈금(SVG 1400 × 500)
  root.querySelectorAll('.m-bell').forEach((g) => {
    if (g.querySelector('svg')) return; const m = +g.dataset.mean || 70, sd = +g.dataset.sd || 15, me = +g.dataset.me || 85, lo = 25, hi = 100, W = 1400, base = 380, top = 80;
    const x = (v) => ((v - lo) / (hi - lo)) * W, y = (v) => base - (base - top) * Math.exp(-0.5 * ((v - m) / sd) ** 2);
    const pts = []; for (let v = lo; v <= hi; v += 0.5) pts.push(`${x(v).toFixed(1)},${y(v).toFixed(1)}`);
    const tail = []; for (let v = me; v <= hi; v += 0.5) tail.push(`${x(v).toFixed(1)},${y(v).toFixed(1)}`);
    const ticks = [m - 2 * sd, m - sd, m, m + sd, hi].filter((v) => v >= lo && v <= hi);
    g.insertAdjacentHTML('afterbegin', `<svg class="m-bl-svg" viewBox="0 0 1400 500"><polygon points="0,${base} ${pts.join(' ')} ${W},${base}" fill="#E3E5EA"/><polygon points="${x(me).toFixed(1)},${base} ${tail.join(' ')} ${W},${base}" data-tint-fill="0.35"/><line x1="${x(m)}" y1="${base}" x2="${x(m)}" y2="${top}" stroke="#9AA0AA" stroke-width="6"/><line x1="${x(me)}" y1="${base}" x2="${x(me)}" y2="${y(me) - 8}" stroke-width="8" stroke-linecap="round" style="stroke:var(--main)"/><circle cx="${x(me)}" cy="${y(me) - 8}" r="16" fill="#FFFFFF" stroke-width="8" style="stroke:var(--main)"/><line x1="0" y1="${base}" x2="${W}" y2="${base}" stroke="#C5C9D2" stroke-width="4"/></svg>${ticks.map((v) => `<span class="m-bl-tick" style="left:${x(v)}px">${v}</span>`).join('')}`);
    const mean = g.querySelector('.m-bl-mean'); if (mean) { mean.style.left = `${x(m)}px`; mean.style.top = `${top - 76}px`; }
    const card = g.querySelector('.m-bl-me'); if (card) { card.style.left = `${x(me) + 40}px`; card.style.top = `${y(me) - 150}px`; }
  });
  // 시험 날 시간표(.m-examday > div(.s-label 날 · ol > li[.accent](b 교시 · p 과목)) ×3): 날마다 위 이름 + 과목 카드(흰) 세로로, 강조 과목 한 칸만 메인 면
  // ── 예비 초1 입학 준비 덱(2026-10-22) 새 도식 6종 ──
  // 학교 시계(.m-dial > div[data-from="9:00"][data-to="9:40"][.accent](b 시각 · .s-h 일) …): 왼쪽 흰 시계(숫자 1~12) 둘레에 일마다 호(회색 · 강조만 메인), 오른쪽 시각 · 이름 줄(색 점 = 호 색)
  root.querySelectorAll('.m-dial').forEach((g) => {
    if (g.querySelector('svg')) return; const items = [...g.children], C = 280, R = 214, T = 44;
    const min = (s) => { const [h, m] = s.split(':').map(Number); return ((h % 12) * 60 + (m || 0)); }, pt = (t, r) => { const a = (t / 720) * 2 * Math.PI; return [C + r * Math.sin(a), C - r * Math.cos(a)]; };
    const arcs = items.map((d) => { const a = min(d.dataset.from), b = min(d.dataset.to) + (min(d.dataset.to) < min(d.dataset.from) ? 720 : 0), [x0, y0] = pt(a + 2, R), [x1, y1] = pt(b - 2, R), col = d.classList.contains('accent') ? 'var(--main)' : '#C5C9D2'; d.classList.add('m-dl-item'); d.insertAdjacentHTML('afterbegin', `<i class="m-dl-dot" style="background:${col}"></i>`);
      return `<path d="M${x0.toFixed(1)} ${y0.toFixed(1)} A${R} ${R} 0 ${b - a > 360 ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}" fill="none" stroke-width="${T}" style="stroke:${col}"/>`; }).join('');
    const nums = Array.from({ length: 12 }, (_, k) => { const [x, y] = pt((k + 1) * 60, 140); return `<text x="${x.toFixed(1)}" y="${(y + 12).toFixed(1)}" text-anchor="middle" font-size="34" font-weight="600" fill="#8B8E98" font-family="Pretendard">${k + 1}</text>`; }).join('');
    g.insertAdjacentHTML('afterbegin', `<svg class="m-dl-svg" viewBox="0 0 560 560"><circle cx="${C}" cy="${C}" r="268" fill="#FFFFFF" style="filter:drop-shadow(0 12px 24px rgba(20,24,40,.07))"/><circle cx="${C}" cy="${C}" r="${R}" fill="none" stroke="#F0F1F4" stroke-width="${T}"/>${arcs}${nums}<circle cx="${C}" cy="${C}" r="12" fill="#14161C"/></svg>`);
    const legend = document.createElement('div'); legend.className = 'm-dl-legend'; legend.append(...items); g.append(legend);
  });
  // 알림장(.m-notice > .m-nt-head(.s-label · p 날짜) + ol > li … + p.m-nt-stamp): 흰 공책 한 장 — 머리 줄 아래 줄 친 항목(번호 자동), 오른쪽 아래 선생님 확인 도장(메인 테두리 원)
  root.querySelectorAll('.m-notice ol').forEach((ol) => { if (ol.querySelector('.m-nt-n')) return; [...ol.children].forEach((li, k) => li.insertAdjacentHTML('afterbegin', `<b class="m-nt-n">${k + 1}</b>`)); });
  // 자모 합치기(.m-jamo > div[.accent](i 자음 · i.v 모음 · i.f 받침 · b 글자) ×3): 낱자 칸(흰) 사이 + · 글자 앞 = 를 붙이고, 글자 칸은 오른쪽 끝에 맞춤 — 강조 줄 글자만 메인 면
  root.querySelectorAll('.m-jamo > div').forEach((row) => {
    if (row.querySelector('.m-jm-op')) return; const parts = [...row.querySelectorAll(':scope > i')];
    parts.slice(1).forEach((p) => p.insertAdjacentHTML('beforebegin', '<span class="m-jm-op">+</span>'));
    row.querySelector(':scope > b')?.insertAdjacentHTML('beforebegin', '<span class="m-jm-op">=</span>');
  });
  // 받아쓰기 시험지(.m-dictation > .m-dc-head(.s-label · b 점수) + ol > li[.x](글 · del 틀린 말 · ins 고친 말) …): 흰 공책, 줄마다 번호 · 받아쓴 글 · 오른쪽 채점(맞으면 메인 동그라미, 틀리면 회색 ✕)
  root.querySelectorAll('.m-dictation ol').forEach((ol) => {
    if (ol.querySelector('.m-dc-mark')) return;
    [...ol.children].forEach((li, k) => { li.insertAdjacentHTML('afterbegin', `<b class="m-dc-n">${k + 1}</b>`); li.insertAdjacentHTML('beforeend', li.classList.contains('x') ? '<svg class="m-dc-mark" viewBox="0 0 60 60"><path d="M16 16L44 44M44 16L16 44" stroke="#9AA0AA" stroke-width="7" stroke-linecap="round"/></svg>' : '<svg class="m-dc-mark" viewBox="0 0 60 60"><circle cx="30" cy="30" r="22" fill="none" stroke-width="7" style="stroke:var(--main)"/></svg>'); });
  });
  // 10칸 틀(.m-tenframe > div[data-a="7"][data-b="5"][data-make10](.s-h 식) ×2): 2 × 5칸 틀 둘 — 앞 수는 메인 점, 뒤 수는 진한 회색 점, data-make10이면 뒤 수에서 앞 틀을 10까지 채워 옮김
  root.querySelectorAll('.m-tenframe > div').forEach((row) => {
    if (row.querySelector('.m-tf')) return; const a = +row.dataset.a || 0, b = +row.dataset.b || 0, make = row.hasAttribute('data-make10');
    const f1 = make ? [a, Math.min(10 - a, b)] : [a, 0], f2 = make ? b - Math.min(10 - a, b) : b;
    const frame = (m, d) => `<div class="m-tf">${Array.from({ length: 10 }, (_, k) => (k < m ? '<i class="a"><b></b></i>' : k < m + d ? '<i class="b"><b></b></i>' : '<i></i>')).join('')}</div>`;
    row.insertAdjacentHTML('beforeend', `<div class="m-tf-row">${frame(f1[0], f1[1])}<span class="m-jm-op">+</span>${frame(0, f2)}</div>`);
  });
  // 빨랫줄 사진(.m-clothesline > div[.accent](figure.m-photo · .s-h · p) ×3): 위에 처지는 줄(SVG 1560 × 660) · 카드마다 줄 높이에 집게, 흰 카드(사진 + 이름 · 한 줄)가 매달림 — 강조 카드는 메인 테두리
  root.querySelectorAll('.m-clothesline').forEach((g) => {
    if (g.querySelector('svg')) return; const cards = [...g.children], n = cards.length, W = 1560, y = (x) => 40 + 70 * (1 - ((x - W / 2) / (W / 2)) ** 2);
    const xs = cards.map((_, k) => (n === 1 ? W / 2 : 290 + (k * (W - 580)) / (n - 1)));
    cards.forEach((c, k) => { c.classList.add('m-cl-card'); c.style.left = `${xs[k]}px`; c.style.top = `${y(xs[k]) + 14}px`; c.insertAdjacentHTML('afterbegin', '<i class="m-cl-pin"></i>'); });
    g.insertAdjacentHTML('afterbegin', `<svg class="m-cl-svg" viewBox="0 0 ${W} 700"><path d="M0 40 Q${W / 2} 180 ${W} 40" fill="none" stroke="#B7BAC3" stroke-width="6" stroke-linecap="round"/></svg>`);
  });
  // ── 초등 경제 · 금융 교실 덱(2026-10-23) 새 도식 5종 ──
  // 바구니 둘(.m-baskets > div[.accent](.s-label · ul > li 물건 …) ×2): 위 이름 + 흰 바구니(위 테두리 띠 — 강조 바구니는 메인) 안에 물건 칩이 바닥부터 쌓임
  root.querySelectorAll('.m-baskets > div').forEach((d) => { if (!d.querySelector('.m-bs-rim')) d.querySelector('ul')?.insertAdjacentHTML('afterbegin', '<i class="m-bs-rim"></i>'); });
  // 동전 쌓기(.m-coins > div[data-n="3"][.accent](b 금액 · span 때) …): 동전 n개를 아래부터 쌓고(흰 동전 · 강조 줄은 메인), 위에 금액 · 아래 바닥 선과 때 — 바닥 선은 전체 아래 한 줄
  root.querySelectorAll('.m-coins > div').forEach((d) => {
    if (d.querySelector('.m-cn-stack')) return; const n = +d.dataset.n || 0;
    d.querySelector(':scope > b')?.insertAdjacentHTML('afterend', `<div class="m-cn-stack">${'<i></i>'.repeat(n)}</div>`);
  });
  // 세 봉투(.m-envelopes > p.m-ev-src 출발 + div[.accent](.s-big 비율 · .s-h 이름 · p) ×3): 위 출발 알약에서 봉투 셋으로 갈라지는 선(SVG 1440 × 640), 봉투는 흰 카드 + 위 덮개(옅게 칠한 삼각) + 봉인 동그라미(흰 봉투는 메인 · 메인 봉투는 흰색) — 2026-10-23 디자이너 '선만 있으니 어색 — 진짜 봉투처럼' — 강조 봉투만 메인 면
  root.querySelectorAll('.m-envelopes').forEach((g) => {
    if (g.querySelector('.m-ev-lines')) return; const envs = [...g.querySelectorAll(':scope > div')], n = envs.length, W = 520, gap = 60, GW = 1680, x0 = (GW - (n * W + (n - 1) * gap)) / 2;
    const xs = envs.map((_, k) => x0 + k * (W + gap) + W / 2);
    envs.forEach((e) => e.insertAdjacentHTML('afterbegin', `<svg class="m-ev-flap" viewBox="0 0 520 400"><path d="M0 32A32 32 0 0 1 32 0H488A32 32 0 0 1 520 32L282 112Q260 122 238 112Z" fill="currentColor" fill-opacity="0.14"/><circle cx="260" cy="108" r="18" style="fill:${e.classList.contains('accent') ? '#FFFFFF' : 'var(--main)'}"/></svg>`));
    g.insertAdjacentHTML('afterbegin', `<svg class="m-ev-lines" viewBox="0 0 1680 640">${xs.map((x) => `<path d="M840 88 C840 170 ${x} 150 ${x} 236" fill="none" stroke="#DCDEE4" stroke-width="8" stroke-linecap="round"/>`).join('')}</svg>`);
  });
  root.querySelectorAll('.m-coins').forEach((g) => { if (!g.querySelector('.m-cn-base')) g.insertAdjacentHTML('afterbegin', '<i class="m-cn-base"></i>'); }); // 바닥 선은 실제 요소(가상 요소는 PPT에서 빠짐), 문서 순서상 맨 앞이라 동전 뒤
  // ── 중1 · 2 사회 지도 · 통계 덱(2026-10-23) 새 도식 5종 ──
  // 기후 그래프(.m-climate[data-rain="17,21,…"][data-temp="-2,1,…"][data-hi="7"] > p 범례 …): 12달 막대(강수량 · 회색, 가장 많은 달만 메인) + 선(기온 · 메인 실선 · 흰 점, 2026-10-23 디자이너) · 막대는 위만 둥글고 바닥은 각지게, 아래 달 · 막대 위 최댓값 · 선 꼭대기 기온(SVG 1440 × 560)
  root.querySelectorAll('.m-climate').forEach((g) => {
    if (g.querySelector('svg')) return; const rain = g.dataset.rain.split(',').map(Number), temp = g.dataset.temp.split(',').map(Number), hi = +g.dataset.hi || rain.indexOf(Math.max(...rain)) + 1;
    const X = (k) => 150 + k * 104, base = 470, rMax = Math.max(...rain) * 1.1, tLo = Math.min(...temp), tHi = Math.max(...temp), ty = (t) => 340 - ((t - tLo) / (tHi - tLo)) * 260; // 기온 선은 위쪽 띠(80~340)에 — 막대 꼭대기와 겹치지 않게
    const bars = rain.map((r, k) => { const h = (r / rMax) * 290, on = k + 1 === hi; const x0 = X(k) - 34, y0 = base - h, rr = Math.min(14, h); return `<path d="M${x0} ${base}V${(y0 + rr).toFixed(1)}Q${x0} ${y0.toFixed(1)} ${x0 + rr} ${y0.toFixed(1)}H${x0 + 68 - rr}Q${x0 + 68} ${y0.toFixed(1)} ${x0 + 68} ${(y0 + rr).toFixed(1)}V${base}Z" style="fill:${on ? 'var(--main)' : '#DCDEE4'}"/>${on ? `<text x="${X(k)}" y="${base - h - 18}" text-anchor="middle" font-size="34" font-weight="600" font-family="Pretendard" style="fill:var(--main-text)">${r}mm</text>` : ''}<text x="${X(k)}" y="${base + 48}" text-anchor="middle" font-size="30" font-weight="600" fill="#8B8E98" font-family="Pretendard">${k + 1}월</text>`; }).join('');
    const tMaxK = temp.indexOf(Math.max(...temp)), pts = temp.map((t, k) => `${X(k)},${ty(t).toFixed(1)}`).join(' ');
    const dots = temp.map((t, k) => `<circle cx="${X(k)}" cy="${ty(t).toFixed(1)}" r="10" fill="#FFFFFF" stroke-width="5" style="stroke:var(--main)"/>`).join('');
    g.insertAdjacentHTML('afterbegin', `<svg class="m-cl-chart" viewBox="0 0 1440 560"><line x1="100" y1="${base}" x2="1390" y2="${base}" stroke="#C5C9D2" stroke-width="4"/>${bars}<polyline points="${pts}" fill="none" stroke-width="5" stroke-linejoin="round" style="stroke:var(--main)"/>${dots}<text x="${X(tMaxK)}" y="${ty(temp[tMaxK]) - 28}" text-anchor="middle" font-size="34" font-weight="600" font-family="Pretendard" style="fill:var(--main-text)">${temp[tMaxK]}°C</text></svg>`);
    svgTextOut(g.querySelector('.m-cl-chart'), 1680 / 1440); // 달 · 값 글자는 PPT에서 고칠 수 있게 실제 글자로(그래프 크기 1680 = CSS .m-climate 폭)
  });
  // 인구 피라미드(.m-poppyramid > p.m-pp-l 왼쪽 이름 · p.m-pp-r 오른쪽 이름 + div[data-m][data-f][.accent](b 나이) …): 위가 많은 나이, 가운데 나이 이름 · 왼쪽 남자 · 오른쪽 여자 막대(흰, 강조 줄은 메인)
  root.querySelectorAll('.m-poppyramid > div').forEach((d) => {
    if (d.querySelector('.m-pp-bar')) return; const m = +d.dataset.m || 0, f = +d.dataset.f || 0;
    d.insertAdjacentHTML('afterbegin', `<span class="m-pp-bar l"><i style="width:${m * 6}px"></i></span>`); d.insertAdjacentHTML('beforeend', `<span class="m-pp-bar r"><i style="width:${f * 6}px"></i></span>`);
  });
  // 위도 · 경도 격자(.m-latlong[data-lat="37.5"][data-lon="127"] > div.m-ll-card(.s-label · .s-h · p)): 왼쪽 격자(위도 30~45°N · 경도 120~135°E, 5°마다 선) + 그 자리 메인 점 · 축까지 가는 선, 오른쪽 위치 카드
  root.querySelectorAll('.m-latlong').forEach((g) => {
    if (g.querySelector('svg')) return; const lat = +g.dataset.lat, lon = +g.dataset.lon, W = 760, H = 560, x = (v) => 100 + ((v - 120) / 15) * (W - 140), y = (v) => H - 80 - ((v - 30) / 15) * (H - 140);
    let grid = ''; // 흰 판 없이 배경 위 격자 — 그래프처럼(2026-10-23 디자이너)
    for (let v = 30; v <= 45; v += 5) grid += `<line x1="100" y1="${y(v)}" x2="${W - 40}" y2="${y(v)}" stroke="${v === 30 ? '#9AA0AA' : '#DCDEE4'}" stroke-width="${v === 30 ? 4 : 3}"/><text x="86" y="${y(v) + 11}" text-anchor="end" font-size="30" font-weight="500" fill="#8B8E98" font-family="Pretendard">${v}°N</text>`;
    for (let v = 120; v <= 135; v += 5) grid += `<line x1="${x(v)}" y1="60" x2="${x(v)}" y2="${H - 80}" stroke="${v === 120 ? '#9AA0AA' : '#DCDEE4'}" stroke-width="${v === 120 ? 4 : 3}"/><text x="${x(v)}" y="${H - 34}" text-anchor="middle" font-size="30" font-weight="500" fill="#8B8E98" font-family="Pretendard">${v}°E</text>`;
    const px = x(lon), py = y(lat);
    g.insertAdjacentHTML('afterbegin', `<svg class="m-ll-svg" viewBox="0 0 ${W} ${H}">${grid}<line x1="100" y1="${py}" x2="${px}" y2="${py}" stroke-width="5" stroke-linecap="round" style="stroke:var(--main)"/><line x1="${px}" y1="${py}" x2="${px}" y2="${H - 80}" stroke-width="5" stroke-linecap="round" style="stroke:var(--main)"/><circle cx="${px}" cy="${py}" r="22" fill="#FFFFFF" stroke-width="10" style="stroke:var(--main)"/></svg>`);
    const svg = g.querySelector('.m-ll-svg'), plot = document.createElement('div'); plot.className = 'm-ll-plot'; svg.before(plot); plot.append(svg); svgTextOut(svg, 920 / 760); // 눈금 글자는 실제 글자로(격자 크기 920 = CSS .m-ll-plot 폭)
  });
  // 시차 시계(.m-timezone > div[data-h="21"][data-m="0"][.accent](.s-h 도시 · p 시각) ×2 + p.m-tz-gap 차이 알약): 흰 시계 둘(12 · 3 · 6 · 9 숫자, 시침 · 분침) 사이 메인 알약
  root.querySelectorAll('.m-timezone > div').forEach((d) => {
    if (d.querySelector('svg')) return; const h = +d.dataset.h || 0, m = +d.dataset.m || 0, C = 200, ha = ((h % 12) + m / 60) * 30, ma = m * 6, hand = (a, r) => `${(C + r * Math.sin((a * Math.PI) / 180)).toFixed(1)},${(C - r * Math.cos((a * Math.PI) / 180)).toFixed(1)}`;
    const nums = [[12, 0], [3, 90], [6, 180], [9, 270]].map(([n, a]) => { const [px, py] = hand(a, 150).split(','); return `<text x="${px}" y="${+py + 12}" text-anchor="middle" font-size="36" font-weight="600" fill="#8B8E98" font-family="Pretendard">${n}</text>`; }).join('');
    const col = d.classList.contains('accent') ? 'var(--main)' : '#14161C';
    d.insertAdjacentHTML('afterbegin', `<svg class="m-tz-clock" viewBox="0 0 400 400"><circle cx="${C}" cy="${C}" r="192" fill="#FFFFFF" style="filter:drop-shadow(0 12px 24px rgba(20,24,40,.07))"/>${nums}<polyline points="${C},${C} ${hand(ha, 92)}" stroke-width="14" stroke-linecap="round" style="stroke:${col}"/><polyline points="${C},${C} ${hand(ma, 128)}" stroke-width="8" stroke-linecap="round" style="stroke:${col}"/><circle cx="${C}" cy="${C}" r="14" style="fill:${col}"/></svg>`);
  });
  // 축척 자(.m-scalebar[data-cm="6"][data-km="3"] > p.m-sb-a · p.m-sb-b 두 곳 · p.m-sb-map 지도 거리 · p.m-sb-res 결과): 위 흰 지도 카드(두 점 · 잇는 선 · 가운데 '지도에서 n cm') + 아래 축척 막대(n칸 · 번갈아 회색 · 흰색, 눈금 km) + 결과 알약(메인 면)
  root.querySelectorAll('.m-scalebar').forEach((g) => {
    if (g.querySelector('.m-sb-bar')) return; const n = +g.dataset.cm || 4, km = +g.dataset.km || n, step = km / n;
    const ticks = Array.from({ length: n + 1 }, (_, k) => { const v = +(k * step).toFixed(2); return `<span style="left:${(k / n) * 100}%">${v}${k === n ? 'km' : ''}</span>`; }).join('');
    g.insertAdjacentHTML('afterbegin', `<div class="m-sb-card"><i class="m-sb-line"></i><i class="m-sb-dot a"></i><i class="m-sb-dot b"></i></div><div class="m-sb-bar">${Array.from({ length: n }, (_, k) => `<i${k % 2 ? ' class="w"' : ''}></i>`).join('')}<div class="m-sb-ticks">${ticks}</div></div>`);
  });
  // ── 수능 대비 · 수시 정시 덱(2026-10-23) 새 도식 9종 ──
  // 등급 비율 띠(.m-gradeband[data-goal][data-now]): 수능 9등급 상대평가 비율(4 · 7 · 12 · 17 · 20 · 17 · 12 · 7 · 4%)만큼 폭을 나눈 띠 — 경계 아래 누적 비율, 목표 등급만 메인 + 위 알약, 지금 등급은 아래 알약
  root.querySelectorAll('.m-gradeband').forEach((g) => {
    if (g.dataset.done) return; g.dataset.done = 1;
    const R = [4, 7, 12, 17, 20, 17, 12, 7, 4], W = 1500, G = 8, unit = (W - G * 8) / 100, goal = +g.dataset.goal || 0, now = +g.dataset.now || 0;
    let x = 0, acc = 0; const segs = [], ticks = [], mid = [];
    R.forEach((r, k) => { const w = r * unit; mid.push(x + w / 2); segs.push(`<div class="m-gb-seg${k + 1 === goal ? ' accent' : ''}" style="left:${x}px;width:${w}px"><b>${k + 1}</b></div>`); acc += r; x += w; if (k < 8) ticks.push(`<span class="m-gb-tick" style="left:${x + G / 2}px"><i></i><b>${acc}%</b></span>`); x += G; });
    const cum = (k) => R.slice(0, k).reduce((a, b) => a + b, 0);
    g.innerHTML = segs.join('') + ticks.join('') + (goal ? `<span class="m-gb-goal" style="left:${mid[goal - 1]}px">${goal}등급 = 상위 ${cum(goal)}%까지</span>` : '') + (now ? `<span class="m-gb-now" style="left:${mid[now - 1]}px"><i></i><b>지금 ${now}등급</b></span>` : '');
  });
  // 수능 최저 계산(.m-minreq[data-pick="0,2,3"][data-limit][data-rule] > div(.s-h 영역 · b 등급)): 영역 카드 한 줄, 고른 영역만 메인 테두리 · 아래 묶음 선 + 합 알약(식은 흰 알약, 충족 여부만 메인)
  root.querySelectorAll('.m-minreq').forEach((g) => {
    if (g.querySelector('.m-mr-sum')) return;
    const cards = [...g.children], pick = (g.dataset.pick || '').split(',').filter((v) => v !== '').map(Number), lim = +g.dataset.limit, CW = 260, GAP = 44;
    cards.forEach((d, k) => { d.classList.add('m-mr-card'); d.style.left = `${k * (CW + GAP)}px`; if (pick.includes(k)) d.classList.add('on'); });
    const W = cards.length * CW + (cards.length - 1) * GAP; g.style.width = `${W}px`;
    const vals = pick.map((k) => parseInt(cards[k].querySelector('b')?.textContent, 10) || 0), sum = vals.reduce((a, b) => a + b, 0), cx = pick.map((k) => k * (CW + GAP) + CW / 2), l = Math.min(...cx), r = Math.max(...cx), m = (l + r) / 2;
    g.insertAdjacentHTML('beforeend', `${cx.map((c) => `<i class="m-mr-stub" style="left:${c}px"></i>`).join('')}<i class="m-mr-line" style="left:${l}px;width:${r - l}px"></i><i class="m-mr-stub down" style="left:${m}px"></i><div class="m-mr-sum" style="left:${m}px"><span class="m-mr-eq">${vals.join(' + ')} = ${sum}</span><span class="m-mr-ok">${g.dataset.rule || `합 ${lim} 이내`} · ${sum <= lim ? '충족' : '미충족'}</span></div>`);
  });
  // 한 해 시험 띠(.m-mockyear > div[data-m][.key|.accent](.s-h · p)): 3 ~ 11월 칸 위 달 이름 · 점, 시험이 있는 달만 점 아래 카드 — 평가원(.key)은 메인 글자 이름표, 수능(.accent)은 메인 면
  root.querySelectorAll('.m-mockyear').forEach((g) => {
    if (g.querySelector('.m-my-axis')) return;
    const M = [3, 4, 5, 6, 7, 8, 9, 10, 11], W = 1500, cw = W / M.length, x = (m) => (M.indexOf(m) + 0.5) * cw, used = new Set();
    [...g.children].forEach((d) => { const m = +d.dataset.m; used.add(m); d.classList.add('m-my-card'); d.style.left = `${x(m)}px`; });
    g.insertAdjacentHTML('afterbegin', `<i class="m-my-axis"></i>${M.map((m) => `<span class="m-my-month${used.has(m) ? ' on' : ''}" style="left:${x(m)}px"><b>${m}월</b><i></i></span>`).join('')}`);
  });
  // 회독 칸(.m-rounds[data-cols="1회독|2회독|3회독"] > div[data-done](.s-h)): 머리 줄(회독 이름) + 줄마다 흰 카드에 동그라미 — 한 만큼 메인 체크, 남은 칸은 빈 회색 원
  root.querySelectorAll('.m-rounds').forEach((g) => {
    if (g.querySelector('.m-rd-head')) return;
    const cols = (g.dataset.cols || '1회독|2회독|3회독').split('|');
    [...g.children].forEach((row) => { const n = +row.dataset.done || 0; row.classList.add('m-rd-row'); row.insertAdjacentHTML('beforeend', cols.map((c, k) => `<span class="m-rd-dot${k < n ? ' on' : ''}">${k < n ? phIcon('check', '') : ''}</span>`).join('')); });
    g.insertAdjacentHTML('afterbegin', `<div class="m-rd-head"><span></span>${cols.map((c) => `<span>${c}</span>`).join('')}</div>`);
  });
  // 정시 원서 세 장(.m-gun > div(b 군 이름 · .s-h 대학 · p 학과 · span 상향/적정/안정)[.accent]): 군 글자를 원 안에 크게 얹은 세로 원서, 강조 한 장만 메인 면 — 꾸밀 것 없음(CSS만)
  // 지원 사다리(.m-ladder[data-min][data-max][data-me][data-unit] > div[data-from][data-to][.accent](.s-h · p)): 세로 눈금(위가 높은 점수) 오른쪽에 구간 카드, 왼쪽에 '내 점수' 알약 + 점 — 적정(.accent)만 메인
  root.querySelectorAll('.m-ladder').forEach((g) => {
    if (g.querySelector('.m-ld-axis')) return;
    const lo = +g.dataset.min || 70, hi = +g.dataset.max || 100, me = +g.dataset.me, H = 600, y = (v) => ((hi - v) / (hi - lo)) * H, unit = g.dataset.unit ?? '';
    [...g.children].forEach((b) => { b.classList.add('m-ld-band'); const t = y(+b.dataset.to), btm = y(+b.dataset.from); b.style.top = `${t + 6}px`; b.style.height = `${btm - t - 12}px`; });
    const ticks = []; for (let v = lo; v <= hi; v += 5) ticks.push(`<span class="m-ld-tick" style="top:${y(v)}px"><b>${v}</b><i></i></span>`);
    g.insertAdjacentHTML('afterbegin', `<i class="m-ld-axis"></i>${ticks.join('')}`);
    if (me) g.insertAdjacentHTML('beforeend', `<span class="m-ld-me" style="top:${y(me)}px"><b>내 점수 ${me}${unit}</b><i></i></span>`);
  });
  // 저울(.m-balance[data-heavy="left|right"] > div ×2(.s-label · .s-h · p)[.accent]): 받침 · 기울어진 막대 · 줄은 SVG, 접시는 HTML 카드(무거운 쪽이 아래) — 무거운 쪽 카드만 메인
  root.querySelectorAll('.m-balance').forEach((g) => {
    if (g.querySelector('.m-bl2-svg')) return;
    const left = g.dataset.heavy !== 'right', dy = 70, yl = left ? 150 + dy : 150 - dy, yr = left ? 150 - dy : 150 + dy, [a, b] = g.children;
    a?.classList.add('m-bl2-pan', 'l'); b?.classList.add('m-bl2-pan', 'r');
    if (a) a.style.top = `${yl + 60}px`; if (b) b.style.top = `${yr + 60}px`;
    g.insertAdjacentHTML('afterbegin', `<svg class="m-bl2-svg" viewBox="0 0 1500 560"><polygon points="700,540 800,540 750,170" fill="#DCDEE4"/><rect x="620" y="532" width="260" height="20" rx="10" fill="#C5C9D2"/><line x1="290" y1="${yl}" x2="1210" y2="${yr}" stroke="#9AA0AA" stroke-width="14" stroke-linecap="round"/><circle cx="750" cy="150" r="22" fill="#FFFFFF" stroke="#9AA0AA" stroke-width="10"/><line x1="290" y1="${yl}" x2="290" y2="${yl + 60}" stroke="#C5C9D2" stroke-width="6"/><line x1="1210" y1="${yr}" x2="1210" y2="${yr + 60}" stroke="#C5C9D2" stroke-width="6"/></svg>`);
  });
  // 두 줄 입시 일정(.m-lanes[data-lanes="수시|정시"] > div[data-lane="0|1|all"][data-m](.s-h · p)[.accent]): 9 ~ 2월 달 축 위에 줄 둘, 일정 카드는 그 달 자리에 — data-lane="all"(수능)은 두 줄을 잇는 세로 메인 카드
  root.querySelectorAll('.m-lanes').forEach((g) => {
    if (g.querySelector('.m-ln-axis')) return;
    const M = [9, 10, 11, 12, 1, 2], names = (g.dataset.lanes || '수시|정시').split('|'), X0 = 170, W = 1500, cw = (W - X0) / M.length, LH = 170, GAP = 24, CW = Math.floor(cw - 22); // 카드 폭 = 달 간격 - 틈 22 — 옆 달 카드와 겹치지 않게(2026-10-23 디자이너)
    const x = (m) => { const k = M.indexOf(Math.floor(m)); return X0 + (k + (m - Math.floor(m)) + 0.5) * cw; };
    [...g.children].forEach((d) => { d.classList.add('m-ln-card'); d.style.left = `${x(+d.dataset.m)}px`; if (d.dataset.lane !== 'all') { d.style.width = `${CW}px`; d.style.marginLeft = `${-CW / 2}px`; } if (d.dataset.lane === 'all') { d.classList.add('all'); d.style.top = '0px'; d.style.height = `${LH * 2 + GAP}px`; } else d.style.top = `${(+d.dataset.lane || 0) * (LH + GAP) + 20}px`; });
    g.insertAdjacentHTML('afterbegin', `${names.map((n, k) => `<div class="m-ln-lane" style="top:${k * (LH + GAP)}px;height:${LH}px"><p class="s-h">${n}</p></div>`).join('')}<i class="m-ln-axis" style="top:${LH * 2 + GAP + 36}px"></i>${M.map((m) => `<span class="m-ln-month" style="left:${x(m)}px;top:${LH * 2 + GAP + 36}px"><i></i><b>${m}월</b></span>`).join('')}`);
  });
  // ── 정시 원서 덱(2026-10-23) 새 도식 3종 ──
  // 반영 비율 띠(.m-mix[data-cols="국어|수학|영어|탐구"][data-hi="1"] > div[.accent](.s-h 대학 · span 비율 ×n)): 대학마다 100% 가로 띠를 영역 비율만큼 나눔 — 강조 영역(data-hi)은 강조 줄(.accent)에서만 메인 면, 다른 줄은 옅은 메인
  root.querySelectorAll('.m-mix').forEach((g) => {
    if (g.querySelector('.m-mx-seg')) return;
    const cols = (g.dataset.cols || '').split('|'), hi = g.dataset.hi === undefined ? -1 : +g.dataset.hi;
    [...g.children].forEach((row) => { row.classList.add('m-mx-row'); const spans = [...row.querySelectorAll(':scope > span')], tot = spans.reduce((a, s) => a + (parseFloat(s.textContent) || 0), 0) || 100;
      const bar = document.createElement('div'); bar.className = 'm-mx-bar';
      spans.forEach((s, k) => { const v = parseFloat(s.textContent) || 0; s.className = `m-mx-seg${k === hi ? ' hi' : ''}`; s.style.flexGrow = v / tot; s.innerHTML = `<b>${cols[k] ?? ''}</b><i>${v}%</i>`; bar.append(s); });
      row.append(bar); });
  });
  // 환산식(.m-formula[data-unit] > div(.s-h 영역 · b 점수 · span '× 0.30' | div[data-pts] 영어처럼 등급을 점수로 바꾸는 칸) + div.m-fm-total(.s-h)): 칸마다 점수 × 비율 = 값, 사이에 + · = , 합은 메인 카드(계산은 자동 — 덱 값으로만)
  root.querySelectorAll('.m-formula').forEach((g) => {
    if (g.querySelector('.m-fm-op')) return;
    const terms = [...g.children].filter((d) => !d.classList.contains('m-fm-total')), total = g.querySelector(':scope > .m-fm-total'), unit = g.dataset.unit ?? '';
    let sum = 0;
    terms.forEach((d) => { d.classList.add('m-fm-term'); const w = parseFloat((d.querySelector('span')?.textContent || '').replace(/[^\d.]/g, '')); const v = 'pts' in d.dataset ? +d.dataset.pts : (parseFloat(d.querySelector('b')?.textContent) || 0) * (w || 0); sum += v; d.insertAdjacentHTML('beforeend', `<em>${Math.round(v * 10) / 10}${unit}</em>`); });
    terms.slice(1).forEach((d) => d.insertAdjacentHTML('beforebegin', '<i class="m-fm-op">+</i>'));
    if (total) { total.insertAdjacentHTML('beforebegin', '<i class="m-fm-op">=</i>'); if (!total.querySelector('b')) total.insertAdjacentHTML('beforeend', `<b>${Math.round(sum * 10) / 10}<small>${unit}</small></b>`); }
  });
  // 모집 인원 줄(.m-rankline[data-total] > div[data-cut][data-me][.accent](.s-h · p)): 줄마다 지원자를 점수 순으로 점 한 줄 — 점 크기는 점 수에 맞춰(20개 안팎이 보기 좋음, 2026-10-23 디자이너 '원이 너무 작아') — 모집 인원까지 흰 점 · 그 뒤는 회색, 자르는 선 + 이름표, 내 자리는 큰 원 + 알약(강조 줄만 메인)
  root.querySelectorAll('.m-rankline').forEach((g) => {
    if (g.querySelector('.m-rk-dots')) return;
    const N = +g.dataset.total || 40, W = 1080, step = W / N;
    [...g.children].forEach((row) => { row.classList.add('m-rk-row'); const cut = +row.dataset.cut, me = +row.dataset.me, inside = me <= cut;
      const dots = Array.from({ length: N }, (_, k) => `<i class="m-rk-dot${k + 1 <= cut ? ' in' : ''}${k + 1 === me ? ' me' : ''}" style="left:${(k + 0.5) * step}px"></i>`).join('');
      row.insertAdjacentHTML('beforeend', `<div class="m-rk-dots" style="--d:${Math.min(56, Math.round(step * 0.8))}px">${dots}<span class="m-rk-cut" style="left:${cut * step}px"><b>모집 ${cut}명</b></span><span class="m-rk-me${inside ? ' in' : ''}" style="left:${(me - 0.5) * step}px">내 자리 ${me}등</span></div>`); });
  });
  // ── 고1 수능 영어 덱(2026-10-22) 새 도식 6종 ──
  // 점수 줄(.m-scoreline[data-min="60"][data-now="82"][data-goal="90"] > div[data-from][data-to][.accent](b 등급) …): 점수 구간 띠(흰 · 1등급만 메인) + 아래 눈금, 지금 점수 표시 · 목표까지 남은 점수 칩
  root.querySelectorAll('.m-scoreline').forEach((g) => {
    if (g.querySelector('.m-sl-axis')) return; const lo = +g.dataset.min || 60, hi = 100, W = 1500, x = (v) => ((v - lo) / (hi - lo)) * W, now = +g.dataset.now, goal = +g.dataset.goal;
    g.querySelectorAll(':scope > div').forEach((b) => { b.classList.add('m-sl-band'); b.style.left = `${x(+b.dataset.from)}px`; b.style.width = `${x(+b.dataset.to) - x(+b.dataset.from)}px`; });
    const ticks = []; for (let v = lo; v <= hi; v += 10) ticks.push(`<span class="m-sl-tick" style="left:${x(v)}px"><i></i><b>${v}</b></span>`);
    g.insertAdjacentHTML('beforeend', `<i class="m-sl-axis"></i>${ticks.join('')}<i class="m-sl-span" style="left:${x(now)}px;width:${x(goal) - x(now)}px"></i><span class="m-sl-now" style="left:${x(now)}px"><i></i><b>지금 ${now}점</b></span><span class="m-sl-now m-sl-goal" style="left:${x(goal)}px"><i></i></span><span class="m-sl-gap" style="left:${(x(now) + x(goal)) / 2}px">+${goal - now}점</span>`);
  });
  // 트리맵(.m-treemap > div[data-v][.accent](.s-h · p)): 첫 칸은 왼쪽 세로 한 줄, 나머지는 오른쪽 두 줄로 나눠 넓이 = 값 — 1500 × 560, 틈 14
  root.querySelectorAll('.m-treemap').forEach((g) => {
    if (g.dataset.done) return; g.dataset.done = 1; const items = [...g.children], vs = items.map((d) => +d.dataset.v), tot = vs.reduce((a, b) => a + b, 0), W = 1500, H = 560, G = 14;
    const w0 = (vs[0] / tot) * (W - G); Object.assign(items[0].style, { left: '0px', top: '0px', width: `${w0}px`, height: `${H}px` });
    const rest = items.slice(1), rv = vs.slice(1), rt = rv.reduce((a, b) => a + b, 0); let acc = 0, cut = 0; while (cut < rv.length && acc + rv[cut] / 2 < rt / 2) acc += rv[cut++];
    const rows = [rest.slice(0, cut), rest.slice(cut)].filter((r) => r.length), X0 = w0 + G, RW = W - X0; let y = 0;
    rows.forEach((row, ri) => { const vals = row.map((d) => +d.dataset.v), s = vals.reduce((a, b) => a + b, 0), h = ri === rows.length - 1 ? H - y : (s / rt) * (H - G * (rows.length - 1)); let xx = X0;
      row.forEach((d, k) => { const w = k === row.length - 1 ? W - xx : (vals[k] / s) * (RW - G * (row.length - 1)); Object.assign(d.style, { left: `${xx}px`, top: `${y}px`, width: `${w}px`, height: `${h}px` }); xx += w + G; }); y += h + G; });
  });
  // 읽는 방향(.m-readflow > div[.accent](.s-label · .m-rf-row > span ×4)): 위 줄(.accent)은 덩어리 아래로 곧게 지나가는 메인 화살표, 아래 줄은 덩어리 위로 되돌아가는 회색 화살표(SVG — 칩 폭 300 · 틈 40 고정)
  root.querySelectorAll('.m-readflow > div').forEach((lane) => {
    if (lane.querySelector('svg')) return; const n = lane.querySelectorAll('.m-rf-row > span').length, cw = 330, gp = 40, W = n * cw + (n - 1) * gp, c = (k) => k * (cw + gp) + cw / 2;
    // 화살촉 = 선과 같은 색 · 모서리 둥근 삼각형(2026-10-22 디자이너 '끝 삼각형이 어색 · 둥글게'): 같은 색 굵은 테두리 + 둥근 이음, 크기는 선 굵기와 상관없이 고정
    const mk = (id, col) => `<defs><marker id="${id}" viewBox="0 0 30 30" refX="17" refY="15" markerWidth="40" markerHeight="40" markerUnits="userSpaceOnUse" orient="auto"><path d="M8 6 L24 15 L8 24 Z" stroke-width="6" stroke-linejoin="round" style="fill:${col};stroke:${col}"/></marker></defs>`;
    const svg = lane.classList.contains('accent')
      ? `<svg class="m-rf-svg down" viewBox="0 0 ${W} 60">${mk('m-rfa', 'var(--main)')}<path d="M20 30 H${W - 22}" stroke-width="7" fill="none" marker-end="url(#m-rfa)" style="stroke:var(--main)"/></svg>`
      : `<svg class="m-rf-svg up" viewBox="0 0 ${W} 90">${Array.from({ length: n - 1 }, (_, k) => `<path d="M${c(k + 1)} 84 C${c(k + 1)} 10 ${c(k)} 10 ${c(k)} 84" stroke="#B7BAC3" stroke-width="6" stroke-linecap="round" fill="none"/>`).join('')}</svg>`;
    lane.querySelector('.m-rf-row')?.insertAdjacentHTML(lane.classList.contains('accent') ? 'afterend' : 'beforebegin', svg);
  });
  // 지문 구조(.m-passage > p[data-n="1"][.accent] 묶음 이름 ×3): 왼쪽 흰 종이에 묶음마다 회색 글줄 n개(강조 묶음 줄은 옅은 메인 띠), 오른쪽에 묶음 높이만큼 괄호 + 이름
  root.querySelectorAll('.m-passage').forEach((g) => {
    if (g.querySelector('.m-pg-paper')) return; const groups = [...g.querySelectorAll(':scope > p')]; const L = 104, widths = [96, 88, 92, 84, 90, 70];
    let li = 0; const paper = groups.map((p) => { const n = +p.dataset.n || 1; const lines = Array.from({ length: n }, () => `<i style="width:${widths[li++ % widths.length]}%"></i>`).join(''); return `<div class="m-pg-grp${p.classList.contains('accent') ? ' accent' : ''}" style="height:${n * L}px">${lines}</div>`; }).join('');
    groups.forEach((p) => { p.classList.add('m-pg-lab'); p.style.height = `${(+p.dataset.n || 1) * L}px`; p.insertAdjacentHTML('afterbegin', '<i class="m-pg-br"><i></i><i></i><i></i></i>'); /* 괄호는 막대 셋(위 · 세로 · 아래) — PPT에서 한쪽만 테두리 · 둥근 모서리가 깨지지 않게 */ });
    const labs = document.createElement('div'); labs.className = 'm-pg-labs'; labs.append(...groups); g.innerHTML = `<div class="m-pg-paper">${paper}</div>`; g.append(labs);
  });
  // 산점도(.m-scatter[data-pts="x,y;…"][data-x][data-y][data-hi="3"]): 축 둘 + 점(회색, 끝 data-hi개는 메인) + 흐름 선(점선 대신 옅은 굵은 선) — SVG 1300 × 520, 값은 0 ~ 100
  root.querySelectorAll('.m-scatter').forEach((g) => {
    if (g.querySelector('svg')) return; const pts = (g.dataset.pts || '').split(';').filter(Boolean).map((s) => s.split(',').map(Number)), hi = +g.dataset.hi || 0, X0 = 120, X1 = 1280, Y0 = 470, Y1 = 30;
    const px = (v) => X0 + (v / 100) * (X1 - X0), py = (v) => Y0 - (v / 100) * (Y0 - Y1);
    const n = pts.length, mx = pts.reduce((a, p) => a + p[0], 0) / n, my = pts.reduce((a, p) => a + p[1], 0) / n, b = pts.reduce((a, p) => a + (p[0] - mx) * (p[1] - my), 0) / pts.reduce((a, p) => a + (p[0] - mx) ** 2, 0), a0 = my - b * mx;
    const dots = pts.map((p, k) => `<circle cx="${px(p[0]).toFixed(1)}" cy="${py(p[1]).toFixed(1)}" r="14" style="fill:${k >= n - hi ? 'var(--main)' : '#C5C9D2'}"/>`).join('');
    g.innerHTML = `<svg viewBox="0 0 1300 520"><line x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}" stroke="#DCDEE4" stroke-width="5"/><line x1="${X0}" y1="${Y0}" x2="${X0}" y2="${Y1}" stroke="#DCDEE4" stroke-width="5"/><line x1="${px(5)}" y1="${py(a0 + b * 5)}" x2="${px(95)}" y2="${py(a0 + b * 95)}" stroke-width="16" stroke-linecap="round" style="stroke:#DCDEE4"/>${dots}</svg><p class="m-sc-x">${g.dataset.x || ''}</p><p class="m-sc-y">${g.dataset.y || ''}</p>`;
  });
  // ── 중등 수행평가 덱(2026-10-22) 새 도식 6종 ──
  // 마감 깃발 줄(.m-flags[data-days="31"] > div[data-d="5"][.accent](b 과목 · span 과제)): 한 달 가로 선 위에 마감 날마다 깃대 + 깃발 카드(높이 세 단으로 엇갈림), 선 아래 1 · 8 · 15 · 22 · 29일 눈금
  root.querySelectorAll('.m-flags').forEach((g) => {
    if (g.querySelector('.m-fl-line')) return; const days = +g.dataset.days || 31, W = 1560, x = (d) => 40 + ((d - 1) / (days - 1)) * (W - 80);
    const flags = [...g.children]; flags.forEach((f, k) => { f.classList.add('m-fl-flag', `lv${k % 3}`); f.style.left = `${x(+f.dataset.d)}px`; });
    const ticks = [1, 8, 15, 22, 29].filter((d) => d <= days).map((d) => `<span class="m-fl-tick" style="left:${x(d)}px"><i></i><b>${d}일</b></span>`).join('');
    const poles = flags.map((f, k) => `<i class="m-fl-pole lv${k % 3}${f.classList.contains('accent') ? ' accent' : ''}" style="left:${x(+f.dataset.d)}px"></i>`).join(''); // 깃대는 모두 카드보다 먼저(뒤에) 그린다 — 다른 깃발 카드를 가로지르지 않게(2026-10-22 디자이너)
    g.insertAdjacentHTML('afterbegin', `<i class="m-fl-line"></i>${ticks}${poles}`);
  });
  // 반원 비율(.m-halfring[data-a="60"] > div(.s-big · .s-h · p) ×2[.accent]): 반원 고리를 두 몫으로(왼쪽 회색 · 오른쪽 메인) — SVG, 이름은 두 끝 아래
  root.querySelectorAll('.m-halfring').forEach((g) => {
    if (g.querySelector('svg')) return; const a = +g.dataset.a || 50, R = 390, C = [450, 450], T = 110;
    // 조각마다 모서리를 둥글게(2026-10-22 디자이너): 반지름 r만큼 안쪽으로 줄인 고리 조각을 같은 색 굵은 테두리(둥근 이음)로 감싸 모서리 r로 둥글게 — PPT는 그림 한 장
    const r = 26, Ro = R + T / 2 - r, Ri = R - T / 2 + r, P = (rad, deg) => [C[0] + rad * Math.cos((deg * Math.PI) / 180), C[1] + rad * Math.sin((deg * Math.PI) / 180)].map((v) => v.toFixed(1)).join(' ');
    const seg = (d0, d1, st) => { const o = (r / Ro) * (180 / Math.PI), i = (r / Ri) * (180 / Math.PI); return `<path d="M${P(Ro, d0 + o)} A${Ro} ${Ro} 0 0 1 ${P(Ro, d1 - o)} L${P(Ri, d1 - i)} A${Ri} ${Ri} 0 0 0 ${P(Ri, d0 + i)} Z" stroke-width="${2 * r}" stroke-linejoin="round" style="fill:${st};stroke:${st}"/>`; };
    const mid = 180 + (a / 100) * 180;
    g.insertAdjacentHTML('afterbegin', `<svg class="m-hr-svg" viewBox="0 0 900 500">${seg(180, mid - 1.2, '#DCDEE4')}${seg(mid + 1.2, 360, 'var(--main)')}</svg>`);
  });
  // 칸반(.m-kanban > div(.s-h 칸 이름 · ul > li 과제)[.accent] ×3): 흰 판 셋, 칸 이름 옆 개수 칩(자동), 과제는 배경색 카드 — 빈 칸은 '아직 없어요'
  root.querySelectorAll('.m-kanban > div').forEach((c) => {
    if (c.querySelector('.m-kb-n')) return; const n = c.querySelectorAll('li').length;
    c.querySelector('.s-h')?.insertAdjacentHTML('beforeend', `<span class="m-kb-n">${n}</span>`);
    if (!n) c.querySelector('ul')?.insertAdjacentHTML('beforeend', '<li class="m-kb-empty">아직 없어요</li>');
  });
  // 포트폴리오 폴더(.m-folders > div(.s-h · ul)[.accent]): 뒤판 · 탭 · 삐져나온 종이(글줄 셋)를 먼저, 글은 앞판 안으로 — 문서 순서로 앞뒤(PPT)
  root.querySelectorAll('.m-folders > div').forEach((d) => { if (d.querySelector('.m-fd-front')) return; const front = document.createElement('div'); front.className = 'm-fd-front'; front.append(...d.childNodes); d.innerHTML = '<i class="m-fd-tab"></i><i class="m-fd-back"></i><div class="m-fd-paper"><i style="top:28px;width:60%"></i><i style="top:54px;width:75%"></i><i style="top:80px;width:45%"></i></div>'; d.append(front); });
  // ── 사진 자리(2026-10-22 디자이너 '사진이 들어갈 영역만 지정 — 원장님이 나중에 넣음') ──
  // figure.m-photo[data-kind="강사 사진"][data-hint="세로 4 : 5"]: img가 없으면 회색 자리(그림 기호 + 무슨 사진 · 비율), img가 있으면 칸에 맞춰 채움. PPT에선 figure 통째로 그림 한 장 → 원장님이 '그림 바꾸기'로 교체
  root.querySelectorAll('figure.m-photo').forEach((f) => {
    if (f.querySelector('img')) { f.classList.add('has-img'); return; } if (f.querySelector('.m-ph-in')) return;
    const pic = '<svg viewBox="0 0 48 48" class="m-ph-ic"><rect x="4" y="8" width="40" height="32" rx="6" fill="none" stroke="currentColor" stroke-width="3.5"/><circle cx="17" cy="19" r="4" fill="currentColor"/><path d="M8 36l10-10 7 7 6-6 9 9" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/></svg>';
    f.insertAdjacentHTML('beforeend', `<div class="m-ph-in">${pic}<b>${f.dataset.kind || '사진'}</b>${f.dataset.hint ? `<span>${f.dataset.hint}</span>` : ''}</div>`);
  });
  root.querySelectorAll('.m-examvs').forEach((g) => { if (g.querySelector('.s-arrow')) return; [...g.children].slice(1).forEach((c) => c.insertAdjacentHTML('beforebegin', `<span class="s-arrow">${phIcon('caret-right', '')}</span>`)); }); // 시험지 전후 사이 화살표
  // 시험지 메모(.m-examnote > figure.m-photo + ul > li[data-y="30"](b · span)): 사진 오른쪽 메모 칩을 사진 안 data-y%(세로) 높이에 — 칩 왼쪽에서 사진 안 점까지 잇는 선
  root.querySelectorAll('.m-examnote li').forEach((li) => { if (li.querySelector('.m-en-line')) return; li.style.top = `${li.dataset.y || 50}%`; li.insertAdjacentHTML('afterbegin', '<i class="m-en-line"><i></i></i>'); });
  // ── 중1 자기주도학습 덱(2026-10-22) 새 도식 7종 ──
  // 하루 플래너(.m-planner[data-start][data-end] > div[data-from][data-to][.soft|.accent](.s-h · p)): 흰 종이에 시간 줄(정시마다 선 · 왼쪽 시각), 일정 블록을 시간만큼 높이로
  root.querySelectorAll('.m-planner').forEach((g) => {
    if (g.querySelector('.m-pl-hours')) return; const a = +g.dataset.start, b = +g.dataset.end, span = b - a;
    const hr = (h) => (h === 12 ? '낮 12시' : h > 12 ? `${h === a ? '오후 ' : ''}${h - 12}시` : `${h}시`);
    const hours = Array.from({ length: span + 1 }, (_, k) => `<div class="m-pl-hour" style="top:${(k / span) * 100}%"><b>${hr(a + k)}</b><i></i></div>`).join('');
    g.querySelectorAll(':scope > div').forEach((d) => { d.classList.add('m-pl-blk'); d.style.top = `calc(var(--pl-pad) + ${(+d.dataset.from - a) / span} * (100% - 2 * var(--pl-pad)) + var(--pl-gap))`; d.style.height = `calc(${(+d.dataset.to - +d.dataset.from) / span} * (100% - 2 * var(--pl-pad)) - 2 * var(--pl-gap))`; });
    g.insertAdjacentHTML('afterbegin', `<div class="m-pl-hours">${hours}</div>`);
  });
  // 목표 과녁(.m-target > div(.s-label 기간 · .s-h 목표) ×4, 바깥 → 가운데): 겹친 원 넷(흰 · 옅은 회색 번갈아, 가운데 메인) + 원마다 오른쪽 이름으로 잇는 선(SVG 1500 × 560)
  root.querySelectorAll('.m-target').forEach((g) => {
    if (g.querySelector('.m-tg-svg')) return; const items = [...g.children]; const R = [280, 210, 140, 70], cx = 300, cy = 280, rows = [70, 210, 350, 490], ang = [-38, -16, 16, 38];
    items.forEach((d, k) => { d.classList.add('m-tg-item'); d.style.top = `${rows[k]}px`; if (k === items.length - 1) d.classList.add('accent'); });
    const rings = R.map((r, k) => `<circle cx="${cx}" cy="${cy}" r="${r}" style="fill:${k === R.length - 1 ? 'var(--main)' : k % 2 ? '#EEF0F3' : '#FFFFFF'}"/>`).join('');
    const lines = R.map((r, k) => { const t = (ang[k] * Math.PI) / 180, x = cx + r * Math.cos(t) * (k === R.length - 1 ? 0.55 : 0.92), y = cy + r * Math.sin(t) * (k === R.length - 1 ? 0.55 : 0.92); return `<path d="M${x.toFixed(1)} ${y.toFixed(1)} L700 ${rows[k]} L740 ${rows[k]}" fill="none" stroke="#B7BAC3" stroke-width="4" stroke-linejoin="round"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="9" style="fill:${k === R.length - 1 ? '#FFFFFF' : '#B7BAC3'}"/>`; }).join('');
    g.insertAdjacentHTML('afterbegin', `<svg class="m-tg-svg" viewBox="0 0 1500 560"><g style="filter:drop-shadow(0 12px 24px rgba(20,24,40,.08))">${rings}</g>${lines}</svg>`);
  });
  // 습관 체크판(.m-streak[data-on="1110000,…"]): 주마다 한 줄, 월 ~ 일 칸 — 지킨 날은 옅은 메인 + 체크, 못 지킨 날은 흰 칸(작심삼일이 한눈에)
  root.querySelectorAll('.m-streak').forEach((g) => {
    if (g.querySelector('.m-sk-cell')) return; const weeks = (g.dataset.on || '').split(',').filter(Boolean); const days = ['월', '화', '수', '목', '금', '토', '일'];
    const ok = '<svg viewBox="0 0 32 32"><path d="M8 16.5l5.5 5.5L24.5 10.5" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    g.innerHTML = `<span></span>${days.map((d) => `<b class="m-sk-day">${d}</b>`).join('')}${weeks.map((w, r) => `<b class="m-sk-wk">${r + 1}주</b>${[...w].map((c) => `<i class="m-sk-cell${c === '1' ? ' on' : ''}">${c === '1' ? ok : ''}</i>`).join('')}`).join('')}`;
  });
  // 망각 곡선(.m-forget[data-a][data-b]): 복습 안 함(회색, 가파르게 떨어짐) · 1일 · 1주 · 1달 복습(메인, 복습마다 다시 올라 갈수록 완만) — SVG 1440 × 520, 눈금 이름은 data-ticks
  root.querySelectorAll('.m-forget').forEach((g) => {
    if (g.querySelector('svg')) return; const X = [120, 470, 860, 1250], top = 40, bot = 440, y = (p) => bot - (bot - top) * p, end = 1400;
    const decay = (x0, x1, p0, p1) => `C${x0 + (x1 - x0) * 0.18} ${y(p1 + (p0 - p1) * 0.12)} ${x0 + (x1 - x0) * 0.45} ${y(p1)} ${x1} ${y(p1)}`;
    const grey = `M${X[0]} ${y(1)} ${decay(X[0], X[1], 1, 0.42)} ${decay(X[1], end, 0.42, 0.16)}`; // 배운 날 ~ 1일은 두 곡선이 같다
    const main = `M${X[0]} ${y(1)} ${decay(X[0], X[1], 1, 0.42)} L${X[1]} ${y(1)} ${decay(X[1], X[2], 1, 0.64)} L${X[2]} ${y(1)} ${decay(X[2], X[3], 1, 0.82)} L${X[3]} ${y(1)} ${decay(X[3], end, 1, 0.92)}`;
    const ticks = (g.dataset.ticks || '배운 날|1일|1주|1달').split('|').map((t, k) => `<line x1="${X[k]}" y1="${bot}" x2="${X[k]}" y2="${bot + 14}" stroke="#C5C9D2" stroke-width="4"/><text x="${X[k]}" y="${bot + 62}" text-anchor="middle" style="font:600 36px Pretendard, sans-serif;fill:#14161C;letter-spacing:-0.03em">${t}</text>`).join('');
    const dots = X.slice(1).map((x) => `<circle cx="${x}" cy="${y(1)}" r="13" style="fill:#FFFFFF;stroke:var(--main)" stroke-width="7"/>`).join('');
    g.innerHTML = `<svg viewBox="0 0 1440 520"><line x1="${X[0]}" y1="${bot}" x2="${end}" y2="${bot}" stroke="#DCDEE4" stroke-width="5"/>${ticks}<path d="${grey}" fill="none" stroke="#C5C9D2" stroke-width="8" stroke-linecap="round"/><path d="${main}" fill="none" style="stroke:var(--main)" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"/>${dots}</svg><p class="m-fg-a">${g.dataset.a || ''}</p><p class="m-fg-b">${g.dataset.b || ''}</p>`;
  });
  // 집중 링(.m-pomodoro[data-focus="25"][data-rest="5"][data-n="4"] > .m-pm-c(.s-big · p) + .m-pm-legend > div ×2): 집중(메인) · 쉬기(회색) 조각이 번갈아 도는 고리(SVG)
  root.querySelectorAll('.m-pomodoro').forEach((g) => {
    if (g.querySelector('.m-pm-ring')) return; const f = +g.dataset.focus || 25, r0 = +g.dataset.rest || 5, n = +g.dataset.n || 4, tot = (f + r0) * n, R = 210, C = 250, gap = 1.2;
    const arc = (a0, a1) => { const p = (a) => [C + R * Math.sin((a * Math.PI) / 180), C - R * Math.cos((a * Math.PI) / 180)]; const [x0, y0] = p(a0), [x1, y1] = p(a1); return `M${x0.toFixed(1)} ${y0.toFixed(1)} A${R} ${R} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`; };
    let a = 0, segs = ''; for (let k = 0; k < n; k++) { const af = (f / tot) * 360, ar = (r0 / tot) * 360; segs += `<path d="${arc(a + gap, a + af - gap)}" fill="none" stroke="#DCDEE4" stroke-width="56"/><path d="${arc(a + af + gap, a + af + ar - gap)}" fill="none" style="stroke:var(--main)" stroke-width="56"/>`; /* 집중은 회색, 쉬기만 메인 — 메인이 너무 많아서(2026-10-22 디자이너) */ a += af + ar; }
    g.insertAdjacentHTML('afterbegin', `<svg class="m-pm-ring" viewBox="0 0 500 500"><circle cx="${C}" cy="${C}" r="${R + 46}" fill="#FFFFFF" style="filter:drop-shadow(0 12px 24px rgba(20,24,40,.07))"/>${segs}</svg>`);
  });
  // 주간 리포트(.m-report > .m-rp-head(.s-label · p) · div.m-rp-row[data-dots="5/7"|data-bar="0.75"](.s-h 이름 · b 값) ×n · .m-rp-note(b · p)): 흰 종이 한 장, 줄마다 점 · 막대 그림
  root.querySelectorAll('.m-report .m-rp-row').forEach((r) => {
    if (r.querySelector('.m-rp-vis')) return; let vis = '';
    if (r.dataset.dots) { const [v, of] = r.dataset.dots.split('/').map(Number); vis = Array.from({ length: of }, (_, k) => `<i class="${k < v ? 'on' : ''}"></i>`).join(''); }
    else if (r.dataset.bar) vis = `<span class="m-rp-bar"><i style="width:${+r.dataset.bar * 100}%"></i></span>`;
    r.querySelector('.s-h')?.insertAdjacentHTML('afterend', `<div class="m-rp-vis">${vis}</div>`);
  });
  // 1년 사분원(.m-year > div[data-in="봄"](.s-label 때 · .s-h · p) ×4[.accent]): 원(지름 520)을 네 조각(왼쪽 위부터 시계 방향), 조각 안엔 계절 이름, 때 · 이름 · 한 줄은 원 바깥 네 모서리 — 강조 조각만 메인(SVG)
  root.querySelectorAll('.m-year').forEach((g) => {
    if (g.querySelector('.m-yr-svg')) return; const items = [...g.children], CX = 750, CY = 280, R = 260, gp = 10;
    const Q = [[-1, -1, 180], [1, -1, 270], [1, 1, 0], [-1, 1, 90]]; // 왼쪽 위 · 오른쪽 위 · 오른쪽 아래 · 왼쪽 아래(시계 방향), 시작 각
    const paths = items.map((d, k) => { const [sx, sy, a0] = Q[k], a1 = a0 + 90, ox = CX + sx * gp, oy = CY + sy * gp, pt = (a) => [ox + R * Math.cos((a * Math.PI) / 180), oy + R * Math.sin((a * Math.PI) / 180)]; const [x0, y0] = pt(a0), [x1, y1] = pt(a1);
      d.classList.add('m-yr-item', sx < 0 ? 'l' : 'r'); d.style.top = `${CY + sy * 130}px`; d.style[sx < 0 ? 'right' : 'left'] = `${CX + 300}px`;
      const on = d.classList.contains('accent'); const tx = CX + sx * 118, ty = CY + sy * 118;
      return `<path d="M${ox} ${oy} L${x0.toFixed(1)} ${y0.toFixed(1)} A${R} ${R} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)} Z" style="fill:${on ? 'var(--main)' : '#FFFFFF'}"/><text x="${tx}" y="${ty + 16}" text-anchor="middle" style="font:600 48px Pretendard, sans-serif;letter-spacing:-0.03em;fill:${on ? '#FFFFFF' : '#14161C'}">${d.dataset.in || ''}</text>`; }).join('');
    g.insertAdjacentHTML('afterbegin', `<svg class="m-yr-svg" viewBox="0 0 1500 560"><g style="filter:drop-shadow(0 12px 24px rgba(20,24,40,.07))">${paths.replace(/<text[^>]*>[^<]*<\/text>/g, '')}</g>${(paths.match(/<text[^>]*>[^<]*<\/text>/g) || []).join('')}</svg>`);
  });
  // ── 초등 어휘력 덱(2026-10-22) 새 도식 7종 ──
  // 붙임쪽지(.m-notes > div(.s-h 낱말 · p 과목) ×6[.accent]): 쪽지마다 위 가운데 테이프 조각(쪽지 뒤에 그려지면 안 되니 쪽지 안 마지막 자식)
  root.querySelectorAll('.m-notes > div').forEach((n) => { if (!n.querySelector('.m-tape')) n.insertAdjacentHTML('beforeend', '<i class="m-tape"></i>'); });
  // 한자 뿌리(.m-hanja > .m-hj-c(.m-hj-ch 한자 · .s-h 훈음) · ul > li(.s-h 낱말(mark = 그 한자 음절) · p 뜻) ×4): 한자 칸에서 낱말 넷으로 퍼지는 곡선 화살표(SVG 200 × 560)
  root.querySelectorAll('.m-hanja > .m-hj-c').forEach((c) => {
    if (c.parentElement.querySelector('svg')) return; const ys = [60, 206, 352, 498];
    c.insertAdjacentHTML('afterend', `<svg class="m-hj-lines" viewBox="0 0 200 560"><defs><marker id="m-ha" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#B7BAC3"/></marker></defs>${ys.map((y) => `<path d="M8 280 C110 280 80 ${y} 190 ${y}" stroke="#B7BAC3" stroke-width="5" fill="none" marker-end="url(#m-ha)"/>`).join('')}</svg>`);
  });
  // 빈칸 문장(.m-blanks[data-a][data-b] > p 문장(mark = 어려운 낱말)): 같은 문장 두 줄 — 위는 낱말을 아는 아이(낱말 형광펜), 아래는 모르는 아이(낱말 자리가 회색 빈칸 + ?)
  root.querySelectorAll('.m-blanks').forEach((g) => {
    if (g.querySelector('.m-bl-strip')) return; const p = g.querySelector(':scope > p'); if (!p) return;
    const strip = (label, html, cls) => `<div class="m-bl-strip ${cls}"><span class="s-label">${label}</span><p>${html}</p></div>`;
    const q = p.cloneNode(true); q.querySelectorAll('mark').forEach((m) => { m.outerHTML = `<span class="m-bl" style="width:${m.textContent.length * 0.97}em"><b>?</b></span>`; }); const hidden = q.innerHTML; /* 스튜디오가 data-eid를 붙여서 정규식 ✗ — DOM으로 */
    g.innerHTML = strip(g.dataset.a || '', p.innerHTML, 'know') + strip(g.dataset.b || '', hidden, 'blank');
  });
  // 빙산(.m-iceberg > .m-ib-top · .m-ib-low (.s-big · .s-h)): 물 위 작은 흰 봉우리 · 물 아래 큰 메인 덩어리 · 옅은 메인 물(SVG 1400 × 560) — 물빛은 PPT 그림이라 메인에서 직접 계산
  root.querySelectorAll('.m-iceberg').forEach((g) => {
    if (g.querySelector('svg')) return; const tmp = document.createElement('i'); tmp.style.color = 'var(--main)'; g.appendChild(tmp);
    const mc = (getComputedStyle(tmp).color.match(/[\d.]+/g) || [47, 91, 234]).slice(0, 3).map(Number); tmp.remove();
    const water = `rgb(${mc.map((v) => Math.round(v * 0.09 + 255 * 0.91)).join(',')})`;
    g.insertAdjacentHTML('afterbegin', `<svg class="m-ib-svg" viewBox="0 0 1400 560"><rect x="0" y="176" width="1400" height="384" rx="32" data-tint-fill style="fill:${water}"/><polygon points="430,176 950,176 1010,300 930,500 760,548 560,528 440,420 400,290" style="fill:var(--main);stroke:var(--main)" stroke-width="16" stroke-linejoin="round"/><polygon points="560,176 620,92 668,118 726,40 796,112 840,176" style="fill:#FFFFFF;stroke:#FFFFFF;filter:drop-shadow(0 8px 16px rgba(20,24,40,.10))" stroke-width="16" stroke-linejoin="round"/></svg>`);
  });
  // 낱말 카드(.m-flash > .m-fl-front · .m-fl-back(.accent)): 카드마다 뒤에 겹친 카드 한 장(문서 순서로 먼저), 앞면 → 뒷면 사이 화살표
  root.querySelectorAll('.m-flash').forEach((g) => {
    if (g.querySelector('.m-fl-slot')) return; const cards = [...g.children];
    cards.forEach((c, k) => { const s = document.createElement('div'); s.className = `m-fl-slot${c.classList.contains('accent') ? ' accent' : ''}`; s.innerHTML = '<i class="m-fl-layer"></i>'; c.replaceWith(s); s.appendChild(c); if (k) s.insertAdjacentHTML('beforebegin', `<span class="s-arrow">${phIcon('caret-right', '')}</span>`); });
  });
  // ── 중학 역사 덱(2026-10-22) 새 도식 7종 ──
  // 교과서 펼침(.m-page > div ×2 > span 낱말): 쪽마다 위 제목 줄 + 낱말 하나씩 든 글줄 — 낱말 앞뒤는 회색 글줄 조각(위치는 줄마다 다르게)
  root.querySelectorAll('.m-page > div').forEach((pg, pi) => {
    if (pg.querySelector('.m-pg-row')) return; /* 쪽 위 제목 줄은 뺐다(2026-10-22 디자이너) */ const words = [...pg.querySelectorAll(':scope > span')]; const pos = [0.2, 0.55, 0, 0.35, 0.7, 0.1];
    words.forEach((w, k) => {
      const p = pos[(k + pi * 3) % pos.length]; const row = document.createElement('div'); row.className = 'm-pg-row';
      if (p > 0) row.insertAdjacentHTML('beforeend', `<i style="flex-grow:${p * 10}"></i>`);
      row.appendChild(w); if (p < 1) row.insertAdjacentHTML('beforeend', `<i style="flex-grow:${(1 - p) * 10}"></i>`);
      if (k === 2 || k === words.length - 1) row.classList.add('m-pg-end'); /* 문단 끝 줄은 짧게 — 글이 문단으로 읽히게 */
      if (k === 3) pg.insertAdjacentHTML('beforeend', '<div class="m-pg-gap"></div>');
      pg.appendChild(row);
    });
  });
  // 책 모양(2026-10-22 디자이너 '책 같은 느낌이 안 남'): 뒤에 메인 겉표지 · 종이 층 둘, 위에 가운데 접힌 줄 — 문서 순서로 앞뒤
  root.querySelectorAll('.m-page').forEach((b) => { if (b.querySelector('.m-book-cover')) return; b.insertAdjacentHTML('afterbegin', '<i class="m-book-cover"></i><i class="m-book-edge e2"></i><i class="m-book-edge e1"></i>'); b.insertAdjacentHTML('beforeend', '<i class="m-book-spine"></i>'); });
  // 원인 → 사건 → 결과(.m-cause > .m-c-col(카드 둘) · .m-c-ev(메인 원) · .m-c-col): 카드 둘이 원으로 모이고 원에서 다시 갈라지는 곡선 화살표(SVG)
  root.querySelectorAll('.m-cause > .m-c-ev').forEach((ev) => {
    if (ev.parentElement.querySelector('svg')) return; const L = 'stroke="#B7BAC3" stroke-width="5" fill="none" marker-end="url(#m-ca)"';
    const mk = '<defs><marker id="m-ca" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#B7BAC3"/></marker></defs>';
    ev.insertAdjacentHTML('beforebegin', `<svg class="m-c-lines" viewBox="0 0 160 560">${mk}<path d="M0 130 C90 130 70 280 150 280" ${L}/><path d="M0 430 C90 430 70 280 150 280" ${L}/></svg>`);
    ev.insertAdjacentHTML('afterend', `<svg class="m-c-lines" viewBox="0 0 160 560">${mk}<path d="M10 280 C90 280 70 130 152 130" ${L}/><path d="M10 280 C90 280 70 430 152 430" ${L}/></svg>`);
  });
  // 채점표(.m-rubric[data-total] > .m-rb-sheet(.s-label · .m-rb-q · ul > li.o|.x[data-pt="2/2"](.s-h · p))): 줄 앞 맞음 · 틀림 표시, 줄 끝 점수, 오른쪽 점수 도장(맞은 줄 점수 합)
  root.querySelectorAll('.m-rubric').forEach((g) => {
    if (g.querySelector('.m-rb-stamp')) return; let sum = 0;
    const ok = '<svg viewBox="0 0 32 32"><path d="M8 16.5l5.5 5.5L24.5 10.5" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    const no = '<svg viewBox="0 0 32 32"><path d="M10 10L22 22M22 10L10 22" fill="none" stroke="#8B8E98" stroke-width="4" stroke-linecap="round"/></svg>';
    g.querySelectorAll('li').forEach((li) => {
      const [v, of] = (li.dataset.pt || '0/0').split('/'); if (li.classList.contains('o')) sum += +v;
      li.insertAdjacentHTML('afterbegin', `<span class="m-rb-mark">${li.classList.contains('o') ? ok : no}</span>`);
      li.insertAdjacentHTML('beforeend', `<b class="m-rb-pt">${li.classList.contains('o') ? v : 0} / ${of}점</b>`);
    });
    g.insertAdjacentHTML('beforeend', `<div class="m-rb-stamp"><p class="s-big">${sum}<small>점</small></p><p>${g.dataset.total || 10}점 만점</p></div>`);
  });
  // 짝 잇기(.m-match[data-links="0-2,1-3,…"][data-hi] > .m-ml > p ×4 · .m-mr > p ×4): 왼쪽 사건과 오른쪽 결과를 곡선으로 이음(엇갈림), data-hi번째 줄만 메인 — 점은 카드 끝 위에(SVG를 문서 끝에 둬 위에 그려지게)
  root.querySelectorAll('.m-match').forEach((g) => {
    if (g.querySelector('svg')) return; const y = (k) => 52 + k * 152; const hi = +(g.dataset.hi ?? -1);
    const links = (g.dataset.links || '').split(',').filter(Boolean).map((s) => s.split('-').map(Number));
    const path = ([a, b], on) => `<path d="M440 ${y(a)} C750 ${y(a)} 750 ${y(b)} 1060 ${y(b)}" fill="none" style="stroke:${on ? 'var(--main)' : '#C5C9D2'};stroke-width:${on ? 8 : 6}px"/>`;
    const dot = (x, k, on) => `<circle cx="${x}" cy="${y(k)}" r="14" style="fill:${on ? 'var(--main)' : '#FFFFFF'};stroke:${on ? 'var(--main)' : '#C5C9D2'};stroke-width:6px"/>`;
    const order = links.map((l, i) => i).sort((i) => (i === hi ? 1 : -1));
    g.insertAdjacentHTML('beforeend', `<svg class="m-mt-lines" viewBox="0 0 1500 560">${order.map((i) => path(links[i], i === hi)).join('')}${order.map((i) => dot(440, links[i][0], i === hi) + dot(1060, links[i][1], i === hi)).join('')}</svg>`);
    if (links[hi]) { g.querySelectorAll('.m-ml > p')[links[hi][0]]?.classList.add('hl'); g.querySelectorAll('.m-mr > p')[links[hi][1]]?.classList.add('hl'); }
  });
  // 확대(.m-zoom[data-hi] > .m-zm-top > p ×4 · .m-zm-cards > div ×3(.s-label · .s-h · p)): 위 시대 알약 줄에서 data-hi번째를 메인으로, 그 알약에서 아래 옅은 메인 판으로 퍼지는 빛(SVG)
  root.querySelectorAll('.m-zoom').forEach((g) => {
    if (g.querySelector('.m-zm-beam')) return; const pills = g.querySelectorAll('.m-zm-top > p'); const hi = +(g.dataset.hi ?? 0); const n = pills.length || 4;
    pills[hi]?.classList.add('on'); const mc = (getComputedStyle(pills[hi] || g).backgroundColor.match(/[\d.]+/g) || [47, 91, 234]).slice(0, 3).map(Number); const tint = `rgb(${mc.map((v) => Math.round(v * 0.09 + 255 * 0.91)).join(',')})`; /* PPT 그림으로 옮길 때 color-mix 변수는 풀리지 않아 메인 색(고른 알약 바탕)에서 옅은 메인을 직접 계산 */ g.querySelector('.m-zm-top')?.insertAdjacentHTML('afterbegin', '<i class="m-zm-line"></i>'); const step = (1560 - 320) / (n - 1); const x0 = hi * step, x1 = x0 + 320;
    g.querySelector('.m-zm-top')?.insertAdjacentHTML('afterend', `<svg class="m-zm-beam" viewBox="0 0 1560 100" preserveAspectRatio="none"><polygon points="${x0 + 36},0 ${x1 - 36},0 1528,100 32,100" data-tint-fill style="fill:${tint}"/></svg>`);
  });
  // 겹친 원(.m-venn > .m-vn-name · .m-vn-pic(.m-vn-a · .m-vn-both · .m-vn-b) · .m-vn-name): 흰 원 둘을 겹치고 테두리는 위에 다시(왼쪽 회색 · 오른쪽 메인) — 겹친 곳 테두리도 보이게, 문서 순서로 앞뒤
  root.querySelectorAll('.m-venn > .m-vn-pic').forEach((p) => { if (!p.querySelector('.m-vn-c')) p.insertAdjacentHTML('afterbegin', '<i class="m-vn-c l"></i><i class="m-vn-c r"></i><i class="m-vn-ring l"></i><i class="m-vn-ring r"></i>'); });
  // 시대 띠(.m-era > div[data-w][.accent](.s-h 시대 · .s-label 때 · p)): 너비 = 배우는 기간, 화살 모양 조각(SVG)이 이어진 띠 + 조각 가운데 아래 때 · 설명
  root.querySelectorAll('.m-era').forEach((g) => {
    if (g.querySelector('.m-era-band')) return; const segs = [...g.children]; const W = 1560, G = 26, N = 44, H = 240;
    const tot = segs.reduce((s, d) => s + (+d.dataset.w || 1), 0); const unit = (W - G * (segs.length - 1) - N) / tot; let x = 0;
    const polys = segs.map((d, k) => {
      const w = (+d.dataset.w || 1) * unit; const a = x, b = x + w; x = b + G; d.style.left = `${((a + (k ? N : 0) / 2 + b + N / 2) / 2 / W) * 100}%`; d.style.setProperty('--sw', `${((w - N / 2) / W) * 100}%`);
      const pts = [[a, 0], [b, 0], [b + N, H / 2], [b, H], [a, H]]; if (k) pts.push([a + N, H / 2]);
      return `<polygon points="${pts.map((q) => q.join(',')).join(' ')}" stroke-linejoin="round" stroke-width="12" style="${d.classList.contains('accent') ? 'fill:var(--main);stroke:var(--main)' : 'fill:#FFFFFF;stroke:#FFFFFF'}"/>`;
    });
    g.insertAdjacentHTML('afterbegin', `<svg class="m-era-band" viewBox="-8 -8 ${W + 16} ${H + 16}">${polys.join('')}</svg>`);
  });
  // ── 영어 말하기 덱(2026-10-21) 새 도식 7종 ──
  // 스톱워치(.m-stopwatch[data-total][data-unit][data-label] > div[style="--v"][.accent] > .s-h): 흰 시계판(꼭지 · 눈금 12개) + 가장자리 고리에 구간, 가운데엔 강조 구간 시간 · 이름, 오른쪽 범례
  root.querySelectorAll('.m-stopwatch').forEach((g) => {
    if (g.querySelector('.m-sw-face')) return; const items = [...g.querySelectorAll(':scope > div')], unit = g.dataset.unit || '분';
    const vals = items.map((d) => parseFloat(d.style.getPropertyValue('--v')) || 0), total = +g.dataset.total || vals.reduce((a, b) => a + b, 0);
    const C = 2 * Math.PI * 42; let acc = 0, grey = 0;
    const arcs = items.map((d, k) => { const len = (vals[k] / total) * C, col = d.classList.contains('accent') ? 'var(--main)' : (grey++ % 2 ? '#DCDEE4' : '#B7BAC3'); d.dataset.col = col; const a = `<circle cx="50" cy="50" r="42" fill="none" stroke="${col}" stroke-width="8" stroke-dasharray="${Math.max(len - 0.8, 0.6)} ${C}" stroke-dashoffset="${-acc}" transform="rotate(-90 50 50)"/>`; acc += len; return a; }).join('');
    const ticks = Array.from({ length: 12 }, (_, k) => { const a = (k * Math.PI) / 6, x1 = 50 + 32 * Math.sin(a), y1 = 50 - 32 * Math.cos(a), x2 = 50 + 35 * Math.sin(a), y2 = 50 - 35 * Math.cos(a); return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#DCDEE4" stroke-width="1.2" stroke-linecap="round"/>`; }).join('');
    const hi = items.findIndex((d) => d.classList.contains('accent'));
    const legend = items.map((d, k) => `<div class="${d.className}"><i style="background:${d.dataset.col}"></i>${d.innerHTML}<p class="m-sw-v">${vals[k]}${unit}</p></div>`).join('');
    g.innerHTML = `<div class="m-sw"><span class="m-sw-crown"></span><span class="m-sw-btn"></span><div class="m-sw-face"><svg viewBox="0 0 100 100">${arcs}${ticks}</svg><div class="m-sw-c"><p class="s-big">${hi >= 0 ? vals[hi] : total}${unit}</p><p>${hi >= 0 ? items[hi].querySelector('.s-h')?.textContent ?? '' : ''}</p></div></div></div><div class="m-sw-legend"><p class="m-sw-total">${g.dataset.label || ''} ${total}${unit}</p>${legend}</div>`;
  });
  // 겹 넓히기(.m-nest > div(.s-h + p) … div.accent): 안쪽부터 바깥으로 커지는 둥근 겹(바닥을 맞춘 타원), 이름 · 예시는 각 겹 위 띠
  root.querySelectorAll('.m-nest').forEach((g) => { if (g.querySelector('.m-ring')) return; const items = [...g.children]; items.forEach((d, k) => { d.classList.add('m-ring'); d.querySelector('.s-h')?.insertAdjacentHTML('afterbegin', `<b class="m-ring-n">${k + 1}</b>`); if ((items.length - 1 - k) % 2) d.classList.add('alt'); /* 바깥 겹(흰색)부터 흰 · 회색 번갈아 */ d.style.setProperty('--k', k); d.style.setProperty('--n', items.length); }); items.reverse().forEach((d) => g.appendChild(d)); }); /* PPT는 z-index를 모르고 문서 순서대로 그림 — 바깥 겹을 먼저 */
  // 강세 점(.m-stress > div[data-s="ba|NA|na"] > .s-h 낱말 · p 뜻): 음절마다 위에 점 — 대문자로 쓴 음절이 강세(큰 메인 점 · 메인 글자), 나머지는 작은 회색 점
  root.querySelectorAll('.m-stress > div[data-s]').forEach((d) => { if (d.querySelector('.m-syl')) return; const syl = d.dataset.s.split('|'); d.insertAdjacentHTML('afterbegin', `<div class="m-syls">${syl.map((x) => { const on = x === x.toUpperCase() && /[A-Z]/.test(x); return `<span class="m-syl${on ? ' on' : ''}"><i></i><b>${x.toLowerCase()}</b></span>`; }).join('<em>·</em>')}</div>`); });
  // 100칸(.m-waffle[data-unit="%"] — 단위 기본 '점' > div[style="--v"][.accent] > .s-h · p): 10 × 10칸을 앞에서부터 차례로 칠함 — 강조 묶음은 메인, 나머지는 흰 칸, 오른쪽 범례
  root.querySelectorAll('.m-waffle').forEach((g) => {
    if (g.querySelector('.m-wf-grid')) return; const items = [...g.querySelectorAll(':scope > div')], vals = items.map((d) => parseFloat(d.style.getPropertyValue('--v')) || 0);
    const order = [...items.keys()].sort((a, b) => (items[b].classList.contains('accent') - items[a].classList.contains('accent'))); let cells = '';
    order.forEach((k) => { cells += `<i${items[k].classList.contains('accent') ? ' class="on"' : ''}></i>`.repeat(vals[k]); });
    g.innerHTML = `<div class="m-wf-grid">${cells}</div><div class="m-wf-legend">${items.map((d, k) => `<div class="${d.className}"><i></i><div>${d.innerHTML}</div><p class="m-wf-v">${vals[k]}${g.dataset.unit ?? '점'}</p></div>`).join('')}</div>`;
  });
  // 녹음 파형(.m-wave > div[data-w="3579-–-…"][.accent] > .s-h 이름 · p 한 줄): 글자 하나 = 막대 하나(1~9 높이, '-'는 쉼), 쉼이 3칸 이상 이어지면 그 위에 '멈춤' 칩
  root.querySelectorAll('.m-wave > div[data-w]').forEach((d) => {
    if (d.querySelector('.m-wv')) return; const w = d.dataset.w; let bars = '', run = 0;
    [...w].forEach((c, j) => { if (c === '-') { run++; bars += '<i class="z"></i>'; } else { bars += `<i style="--h:${c}"></i>`; } if (c !== '-' || j === w.length - 1) { if (run >= 3) { const end = c === '-' ? j : j - 1; bars += `<b class="m-wv-pause" style="--at:${end - (run - 1) / 2};--len:${w.length}">멈춤</b>`; } if (c !== '-') run = 0; } });
    d.insertAdjacentHTML('beforeend', `<div class="m-wv" style="--len:${w.length}">${bars}</div>`);
  });
  // 질문 카드 묶음(.m-qstack > .m-qcard(.s-label · .m-q-en · p) + .m-qchips > span): 앞 카드 뒤로 두 장이 비켜 겹침(실제 요소), 아래 주제 칩
  root.querySelectorAll('.m-qstack').forEach((g) => { const c = g.querySelector('.m-qcard'); if (c && !g.querySelector('.m-qback')) c.insertAdjacentHTML('beforebegin', '<i class="m-qback b2"></i><i class="m-qback b1"></i>'); });
  // 짝 자리(.m-seats[data-pairs][data-teacher] > p 한 줄): 짝마다 책상(말풍선 아이콘) 위아래 두 자리(A · B), 위에 선생님 자리, 짝 하나만 강조(data-hi)
  root.querySelectorAll('.m-seats').forEach((g) => {
    if (g.querySelector('.m-desk')) return; const n = +g.dataset.pairs || 3, hi = +(g.dataset.hi ?? -1), cap = g.innerHTML;
    const pairs = Array.from({ length: n }, (_, k) => `<div class="m-pair${k === hi ? ' accent' : ''}"><span class="m-seat">A</span><span class="m-desk"><span class="s-icon">${renderIcon('chat', css('--main'), '#FFFFFF', false)}</span></span><span class="m-seat">B</span><p>짝 ${k + 1}</p></div>`).join('');
    g.innerHTML = `<p class="m-teacher">${g.dataset.teacher || '선생님'}</p><div class="m-pairs">${pairs}</div>${cap}`;
  });
  // 글자 하나 · 여러 소리(.m-onemany > .m-om-root(.s-label + .m-om-l 글자) + .m-om-leaves > div(.m-om-w 낱말 — 그 글자는 <b> · p 소리)): 왼쪽 글자 칸에서 오른쪽 낱말 카드마다 곡선으로 이어 줌(SVG, 카드 높이 104 · 사이 24 기준)
  root.querySelectorAll('.m-onemany').forEach((g) => {
    if (g.querySelector('.m-om-lines')) return; const n = g.querySelectorAll('.m-om-leaves > div').length, H = n * 128 + (n - 1) * 32, mid = H / 2;
    const paths = Array.from({ length: n }, (_, k) => { const y = 64 + k * 160; return `<path d="M 0 ${mid} C 130 ${mid} 110 ${y} 240 ${y}" fill="none" stroke="#C5C9D2" stroke-width="6" stroke-linecap="round"/>`; }).join('');
    g.querySelector('.m-om-root').insertAdjacentHTML('afterend', `<svg class="m-om-lines" viewBox="0 0 240 ${H}" width="240" height="${H}">${paths}</svg>`);
  });
  // 쌓이는 병(.m-jar[data-fill][data-marks="2주|4주|…"] > .s-big · .s-h · p): 왼쪽 유리병(뚜껑 · 물 높이 · 눈금 줄과 이름), 오른쪽 글
  root.querySelectorAll('.m-jar').forEach((g) => {
    if (g.querySelector('.m-jar-glass')) return; const fill = +(g.dataset.fill ?? 100), marks = (g.dataset.marks || '').split('|').filter(Boolean);
    const ticks = marks.map((m, k) => `<span class="m-jar-tick" style="bottom:${((k + 1) / marks.length) * fill}%"><i></i><b>${m}</b></span>`).join('');
    g.innerHTML = `<div class="m-jar-glass"><span class="m-jar-lid"></span><span class="m-jar-body"><span class="m-jar-water" style="height:${fill}%"></span>${ticks}</span></div><div class="m-jar-text">${g.innerHTML}</div>`;
  });
  // 다섯 영역 진단(.m-radar[data-labels][data-values][data-hi]): 오각형 눈금 셋 · 축 · 값 다각형(옅은 메인 + 메인 선), 꼭짓점마다 이름 · 값 — data-hi 영역만 메인 글자
  root.querySelectorAll('.m-radar').forEach((g) => {
    if (g.querySelector('svg')) return; const labels = g.dataset.labels.split('|'), vals = g.dataset.values.split(',').map(Number), n = labels.length, hi = +(g.dataset.hi ?? -1);
    const pt = (k, r) => { const a = -Math.PI / 2 + (2 * Math.PI * k) / n; return [50 + r * Math.cos(a), 50 + r * Math.sin(a)]; };
    const ring = (r) => Array.from({ length: n }, (_, k) => pt(k, r).join(',')).join(' ');
    const grid = [40, 26.7, 13.3].map((r) => `<polygon points="${ring(r)}" fill="${r === 40 ? '#FFFFFF' : 'none'}" stroke="#DCDEE4" stroke-width="0.5"/>`).join('') + labels.map((_, k) => `<line x1="50" y1="50" x2="${pt(k, 40)[0]}" y2="${pt(k, 40)[1]}" stroke="#DCDEE4" stroke-width="0.5"/>`).join('');
    const poly = vals.map((v, k) => pt(k, (40 * v) / 100).join(',')).join(' ');
    const dots = vals.map((v, k) => { const [x, y] = pt(k, (40 * v) / 100); return `<circle cx="${x}" cy="${y}" r="1.6" fill="${k === hi ? 'var(--main)' : '#FFFFFF'}" stroke="var(--main)" stroke-width="0.8"/>`; }).join('');
    const labs = labels.map((l, k) => { const [x0, y] = pt(k, 49), x = 50 + (x0 - 50) * 1.12; /* 옆 이름 카드는 꼭짓점에서 조금만 바깥으로 */ return `<p class="m-radar-l${k === hi ? ' hl' : ''}" style="left:${x}%;top:${y}%"><span>${l}</span><b>${vals[k]}점</b></p>`; }).join('');
    g.innerHTML = `<div class="m-radar-box"><svg viewBox="0 0 100 100">${grid}<polygon points="${poly}" fill="color-mix(in srgb, var(--main) 18%, #FFFFFF)" fill-opacity="0.85" stroke="var(--main)" stroke-width="0.9" stroke-linejoin="round"/>${dots}</svg>${labs}</div>`;
  });
  // 소리 이어 붙이기(.m-phonics > div(.m-ph-l 글자 + p 소리) … div.accent(결과 낱말)): 사이에 + · = 자동
  root.querySelectorAll('.m-phonics').forEach((g) => { if (g.querySelector('.m-op')) return; const items = [...g.children]; items.slice(1).forEach((d) => d.insertAdjacentHTML('beforebegin', `<span class="m-op">${d.classList.contains('accent') ? '=' : '+'}</span>`)); });
  // 문장 길이 띠(.m-strips > div[data-w][.accent] > .s-h 때 + p.m-strip 문장): 오른쪽 끝에 낱말 수 칩
  root.querySelectorAll('.m-strips > div[data-w]').forEach((d) => { if (!d.querySelector('.m-strip-n')) d.insertAdjacentHTML('beforeend', `<span class="m-strip-n">${d.dataset.w}단어</span>`); });
  // 레벨 온도계(.m-thermo[data-min][data-max][data-from][data-to][data-step] > .s-big · .s-h · p): 세로 관 + 아래 둥근 구(메인), 눈금 · 시작점(테두리 원) · 도착 높이까지 메인으로 채움
  root.querySelectorAll('.m-thermo').forEach((g) => {
    if (g.querySelector('.m-th-tube')) return; const min = +g.dataset.min, max = +g.dataset.max, from = +g.dataset.from, to = +g.dataset.to, step = +(g.dataset.step || 1);
    const pc = (v) => ((v - min) / (max - min)) * 100; let ticks = '';
    for (let v = min; v <= max + 1e-9; v += step) ticks += `<span class="m-th-tick" style="bottom:${pc(v)}%"><b>${+v.toFixed(1)}</b><i></i></span>`;
    g.style.setProperty('--mid', (pc(from) + pc(to)) / 2); g.innerHTML = `<div class="m-th"><div class="m-th-tube">${ticks}<span class="m-th-fill" style="height:${pc(to)}%"></span><span class="m-th-base" style="height:calc(${pc(from)}% + 40px)"></span><span class="m-th-gap" style="bottom:${pc(from)}%;height:${pc(to) - pc(from)}%"><i></i><i></i></span><span class="m-th-mark from" style="bottom:${pc(from)}%"><i></i><em>시작 ${from}</em></span><span class="m-th-mark to" style="bottom:${pc(to)}%"><em>8주 뒤 ${to}</em></span></div><span class="m-th-bulb"></span></div><div class="m-th-text">${g.innerHTML}</div>`;
  });
  // 구불구불 길(.m-path > div[.accent] > .s-label 때 + .s-h 이름): 정거장이 위아래로 번갈아, 뒤에 굵은 회색 길(SVG) + 가운데 흰 점선, 정거장 점(마지막은 메인), 이름 카드는 점 바깥쪽
  root.querySelectorAll('.m-path').forEach((g) => {
    if (g.querySelector('.m-path-road')) return; const items = [...g.children], n = items.length;
    const P = items.map((_, k) => [8 + (84 * k) / Math.max(n - 1, 1), k % 2 ? 66 : 34]);
    let d = `M 0 ${P[0][1] + 8} L ${P[0][0]} ${P[0][1]}`; for (let k = 1; k < n; k++) { const [x0, y0] = P[k - 1], [x1, y1] = P[k], mx = (x0 + x1) / 2; d += ` C ${mx} ${y0} ${mx} ${y1} ${x1} ${y1}`; } d += ` L 100 ${P[n - 1][1] - 8}`;
    items.forEach((it, k) => { it.classList.add('m-stop', k % 2 ? 'low' : 'high'); it.style.left = `${P[k][0]}%`; it.style.top = `${P[k][1]}%`; it.insertAdjacentHTML('afterbegin', '<i class="m-stop-dot"></i>'); });
    g.insertAdjacentHTML('afterbegin', `<svg class="m-path-road" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="${d}" fill="none" stroke="#DCDEE4" stroke-width="7" stroke-linecap="round" vector-effect="non-scaling-stroke" style="stroke-width:44px"/><path d="${d}" fill="none" stroke="#FFFFFF" stroke-width="1" stroke-dasharray="3 3" vector-effect="non-scaling-stroke" style="stroke-width:5px;stroke-dasharray:18 16"/></svg>`);
  });
  // 개념 사슬(.m-chain > div[.accent] > .s-h 개념 + p 학년, 2026-10-21 수학 사고력 덱): 고리마다 테두리만 있는 둥근 고리(실제 요소), 이웃 고리와 겹쳐 사슬처럼, 강조 고리만 메인
  root.querySelectorAll('.m-chain > div').forEach((d) => { if (d.querySelector(':scope > .m-link')) return; d.innerHTML = `<i class="m-link"></i><div class="m-chain-card">${d.innerHTML}</div>`; });
  // 분수 막대(.m-fraction > div[data-n][data-k]): 줄마다 세로 분수(분자 · 선 · 분모) + n칸 막대 중 k칸 칠함, 같은 크기면 세로 점선(메인)으로 이어 줌
  root.querySelectorAll('.m-fraction').forEach((g) => {
    let eq = null;
    g.querySelectorAll(':scope > div[data-n]').forEach((r) => {
      const n = +r.dataset.n, k = +r.dataset.k; if (r.querySelector('.m-frac-bar')) return;
      r.innerHTML = `<span class="m-frac"><b>${k}</b><i></i><b>${n}</b></span><span class="m-frac-bar">${Array.from({ length: n }, (_, j) => `<i${j < k ? ' class="on"' : ''}></i>`).join('')}</span>`;
      eq = eq === null ? k / n : (Math.abs(eq - k / n) < 1e-9 ? eq : NaN);
    });
    if (eq === eq && eq !== null && !g.querySelector('.m-frac-eq')) { g.style.setProperty('--eq', eq); g.insertAdjacentHTML('beforeend', '<span class="m-frac-eq"></span>'); }
  });
  // 수업 시간 원(.m-clock[data-total][data-unit] > div[style="--v"][.accent] > .s-h): 도넛(SVG 호) + 가운데 전체 시간, 오른쪽 범례(이름 · 시간) — 강조 조각만 메인, 나머지는 회색 두 단계
  root.querySelectorAll('.m-clock').forEach((g) => {
    if (g.querySelector('.m-clock-ring')) return;
    const items = [...g.querySelectorAll(':scope > div')], unit = g.dataset.unit || '분';
    const vals = items.map((d) => parseFloat(d.style.getPropertyValue('--v')) || 0), total = +g.dataset.total || vals.reduce((a, b) => a + b, 0);
    const C = 2 * Math.PI * 40; let acc = 0, grey = 0;
    const arcs = items.map((d, k) => { const len = (vals[k] / total) * C, gap = 1.2; const col = d.classList.contains('accent') ? 'var(--main)' : (grey++ % 2 ? '#DCDEE4' : '#B7BAC3'); const a = `<circle cx="50" cy="50" r="40" fill="none" stroke="${col}" stroke-width="14" stroke-dasharray="${Math.max(len - gap, 0)} ${C}" stroke-dashoffset="${-acc}" transform="rotate(-90 50 50)"/>`; acc += len; d.dataset.col = col; return a; }).join('');
    const legend = items.map((d, k) => `<div class="${d.className}"><i style="background:${d.dataset.col}"></i>${d.innerHTML}<p class="m-clock-v">${vals[k]}${unit}</p></div>`).join('');
    g.innerHTML = `<div class="m-clock-ring"><svg viewBox="0 0 100 100">${arcs}</svg><div class="m-clock-c"><p class="s-big">${total}${unit}</p><p>${g.dataset.label || ''}</p></div></div><div class="m-clock-legend">${legend}</div>`;
  });
  // 원서 6장(.m-six > div[.accent] > .m-forms > i ×2): 원서 종이마다 머리 띠 · 글줄 조각(실제 요소 — PPT에서 가상 요소는 글자를 가림, 2026-10-21 수시 덱)
  root.querySelectorAll('.m-six .m-forms > i').forEach((f) => { if (!f.children.length) f.innerHTML = '<b class="m-form-top"></b><b></b><b></b><b class="short"></b>'; });
  // 원고지(.m-wongoji[data-cols="20"] > p[.hl]): 글자 하나 = 칸 하나, 첫 칸은 들여쓰기, 중심 문장(p.hl) 칸만 옅은 메인 + 메인 글자(2026-10-21 독서 덱)
  root.querySelectorAll('.m-wongoji').forEach((g) => {
    const cols = +g.dataset.cols || 20, cells = [{ ch: '', hl: false }];
    g.querySelectorAll(':scope > p').forEach((p) => [...p.textContent.trim()].forEach((ch, i, a) => { cells.push({ ch: ch === ' ' ? '' : ch, hl: p.classList.contains('hl') }); }));
    while (cells.length % cols) cells.push({ ch: '', hl: false });
    const label = g.querySelector(':scope > .s-label')?.outerHTML || '';
    g.style.setProperty('--cols', cols);
    g.innerHTML = `${label}<div class="m-wg-grid">${cells.map((c) => `<span${c.hl ? ' class="hl"' : ''}>${c.ch}</span>`).join('')}</div>`;
  });
  // 원 크기 비교(.m-orbs, 2026-10-21 디자이너 시안 A): 원 넓이 = 값. 묶음 = data-cols("전|후"), 원 = div[data-v][data-col], 첫 묶음 원은 메인 면, 나머지는 흰 원. 묶음 사이 화살표
  root.querySelectorAll('.m-orbs').forEach((g) => {
    const cols = (g.dataset.cols || '').split('|'), unit = g.dataset.unit || '';
    const orbs = [...g.querySelectorAll(':scope > div[data-v]')], max = Math.max(...orbs.map((o) => +o.dataset.v || 0)) || 1;
    const D = +g.dataset.size || 380;
    const groups = cols.map((c, k) => `<div class="m-og${k ? '' : ' first'}"><p class="m-oh">${c}</p><div class="m-orow">${orbs.filter((o) => (+o.dataset.col || 0) === k).map((o) => {
      const v = +o.dataset.v || 0, d = Math.round(Math.sqrt(v / max) * D);
      return `<div class="m-ob${o.classList.contains('hl') ? ' hl' : ''}"><span class="m-oslot" style="height:${D}px"><span class="m-oc" style="width:${d}px;height:${d}px"><b>${v}${unit}</b></span></span>${o.innerHTML}</div>`; // 원 자리 높이는 가장 큰 원과 같게 — 이름 줄이 한 높이에
    }).join('')}</div></div>`);
    g.innerHTML = groups.join(`<span class="s-arrow">${phIcon('caret-right', '')}</span>`);
  });
  // 점수대 이동(.m-drop, 2026-10-21 디자이너 — 사람 30명은 복잡함): 전 · 후 세로 막대 둘, 막대 안 조각 = 점수대(높이 = 인원 비율, 위가 높은 점수대), 가운데 메인 알약(data-gap · data-gap-label)
  root.querySelectorAll('.m-drop').forEach((g) => {
    const cols = (g.dataset.cols || '전|후').split('|');
    const rows = [...g.querySelectorAll(':scope > div[data-row]')].map((r, k) => ({ name: r.dataset.row, vs: (r.dataset.v || '').split(',').map(Number), k }));
    const bar = (c) => {
      const total = rows.reduce((a, r) => a + (r.vs[c] || 0), 0) || 1;
      return `<div class="m-dcol${c === cols.length - 1 ? ' last' : ''}"><p class="m-dh">${cols[c]}</p><div class="m-dbar">${rows.filter((r) => r.vs[c]).map((r) => `<div class="m-dseg t${r.k}" style="flex:${r.vs[c] / total}"><p>${r.name}</p><b>${r.vs[c]}명</b></div>`).join('')}</div></div>`;
    };
    const gap = g.dataset.gap ? `<div class="m-dgap"><p class="m-dpill">${g.dataset.gap}</p><p>${g.dataset.gapLabel || ''}</p></div>` : '';
    g.innerHTML = cols.map((_, c) => bar(c)).join(gap);
  });
  // 사람 그림: data-of명 중 data-v명을 메인으로(2026-10-20)
  root.querySelectorAll('.m-pict').forEach((g) => {
    const v = +g.dataset.v || 0, of = +g.dataset.of || 10;
    g.insertAdjacentHTML('afterbegin', `<div class="m-people">${Array.from({ length: of }, (_, k) => `<div class="m-person${k < v ? ' on' : ''}"><i></i><b></b></div>`).join('')}</div>`);
  });
  // 전후 비교 줄: 머리 라벨 사이 빈칸, 짝마다 가운데 화살표
  root.querySelectorAll('.m-ba').forEach((g) => {
    const labels = [...g.querySelectorAll(':scope > .s-label')];
    if (labels.length === 2) labels[0].insertAdjacentHTML('afterend', '<span></span>');
    [...g.querySelectorAll(':scope > p')].forEach((p, k) => { if (k % 2 === 1) { p.classList.add('m-after'); p.insertAdjacentHTML('beforebegin', `<span class="s-arrow">${phIcon('caret-right', '')}</span>`); } });
  });
  root.querySelectorAll('.m-table').forEach((t) => { const r = t.querySelector('tr'); if (r) t.style.setProperty('--cols', r.children.length); }); // 표 열 수 → 격자 열
  // 상자 없는 표(.s-m.bare > .m-table) → 비교 카드: 왼쪽 배경 위 항목 이름 + 줄(학교)마다 세로 흰 카드, 강조 줄은 메인 면(2026-10-20 디자이너). eid는 그대로 옮겨 고칠 수 있게
  root.querySelectorAll('.s-m.bare > .m-table').forEach((t) => {
    const [head, ...rows] = [...t.rows];
    const cell = (c, cls) => `<p class="${cls}"${c.dataset.eid ? ` data-eid="${c.dataset.eid}"` : ''}>${c.innerHTML}</p>`;
    const labels = [...head.cells].slice(1).map((c) => cell(c, 's-tlabel')).join('');
    const cols = rows.map((r) => `<div class="s-tcol${r.classList.contains('accent') ? ' accent' : ''}">${cell(r.cells[0], 's-h')}${[...r.cells].slice(1).map((c) => cell(c, 's-tval')).join('')}</div>`).join('');
    t.outerHTML = `<div class="m-tcols" style="--n:${rows.length};--k:${head.cells.length - 1}"><div class="s-tlabels"><p class="s-tcorner"></p>${labels}</div>${cols}</div>`;
  });
  root.querySelectorAll('.s-steps').forEach((s) => {
    [...s.children].slice(1).forEach((st) => st.insertAdjacentHTML('beforebegin', `<span class="s-arrow">${phIcon('caret-right', '')}</span>`));
  });
  root.querySelectorAll('.s-compare > .s-vs').forEach((v) => { v.innerHTML = phIcon('caret-right', ''); });
  root.querySelectorAll('.s-cta .s-action').forEach((a) => a.insertAdjacentHTML('beforeend', phIcon('caret-right', '')));
  // 막대: <div style="--v:17">중2</div> → 값 · 막대 · 이름 (가장 큰 값 = 높이 280px). 이름은 원본 eid를 이어받아 고칠 수 있다
  root.querySelectorAll('.s-bars').forEach((g) => {
    const bars = [...g.children];
    const vals = bars.map((b) => parseFloat(b.style.getPropertyValue('--v')) || 0);
    const max = Math.max(...vals, 1);
    const unit = g.dataset.unit ?? '';
    bars.forEach((b, i) => {
      const name = b.textContent.trim(), eid = b.dataset.eid;
      b.removeAttribute('data-eid');
      b.classList.add('s-bar');
      b.innerHTML = `<p class="s-value">${vals[i]}<small>${unit}</small></p><div class="s-fill" style="height:${Math.round((vals[i] / max) * 280)}px"><span class="s-fill-foot"></span></div><p class="s-name"${eid ? ` data-eid="${eid}"` : ''}>${name}</p>`;
    });
  });
  root.querySelectorAll('.s-timeline').forEach((t) => {
    t.querySelectorAll(':scope > .s-when').forEach((w) => w.querySelector('.s-value')?.insertAdjacentHTML('afterend', '<span class="s-dot"></span>'));
    t.insertAdjacentHTML('afterbegin', '<span class="s-track"></span>');
  });
  // ---- 표현 늘리기(2026-10-20) 꾸미기 ----
  root.querySelectorAll('.s-meter').forEach((m) => m.querySelector('.s-value')?.insertAdjacentHTML('afterend', '<div class="s-track-bar"><span></span></div>'));
  root.querySelectorAll('.s-hbars').forEach((g) => { // <div style="--v:64">이름</div> → 이름 · 막대(가장 큰 값 = 끝까지) · 값
    const rows = [...g.children];
    const vals = rows.map((r) => parseFloat(r.style.getPropertyValue('--v')) || 0);
    const max = Math.max(...vals, 1), unit = g.dataset.unit ?? '';
    rows.forEach((r, i) => {
      const name = r.textContent.trim(), eid = r.dataset.eid;
      r.removeAttribute('data-eid'); r.classList.add('s-hbar');
      r.innerHTML = `<p class="s-h"${eid ? ` data-eid="${eid}"` : ''}>${name}</p><div><div class="s-fill" style="width:${Math.round((vals[i] / max) * 100)}%"></div></div><p class="s-value">${vals[i]}<small>${unit}</small></p>`;
    });
  });
  root.querySelectorAll('.s-table[data-accent-col]').forEach((t) => { const n = +t.dataset.accentCol; t.querySelectorAll('tr').forEach((tr) => tr.children[n - 1]?.classList.add('accent-col')); });
  root.querySelectorAll('.s-flow').forEach((f) => [...f.children].slice(1).forEach((c) => c.insertAdjacentHTML('beforebegin', `<span class="s-arrow">${phIcon('caret-right', '')}</span>`)));
  root.querySelectorAll('.s-donut').forEach((d) => d.insertAdjacentHTML('afterbegin', '<span class="s-donut-hole"></span>'));
  root.querySelectorAll('.s-dotgrid').forEach((g) => { const v = Math.round(+g.dataset.v || 0); g.innerHTML = Array.from({ length: 100 }, (_, i) => `<span${i < v ? ' class="on"' : ''}></span>`).join(''); });
  root.querySelectorAll('.s-stairs').forEach((g) => [...g.children].forEach((c, i) => c.style.setProperty('--i', i)));
  root.querySelectorAll('.s-statrow, .s-stairs, .s-iconrow').forEach((g) => g.style.setProperty('--n', g.children.length));
  // ---- 표현 늘리기 2(2026-10-20) ----
  root.querySelectorAll('.s-versus > .s-vs').forEach((v) => { v.innerHTML = phIcon('caret-right', ''); });
  root.querySelectorAll('.s-ox td.o').forEach((td) => { td.innerHTML = `<span class="s-mark-o">${phIcon('check-circle', '')}</span>`; });
  root.querySelectorAll('.s-ox td.x').forEach((td) => { td.innerHTML = '<span class="s-mark-x"></span>'; });
  root.querySelectorAll('.s-roadmap').forEach((r) => {
    const items = [...r.children];
    items.forEach((it) => it.insertAdjacentHTML('afterbegin', '<span class="s-node"></span>'));
    r.insertAdjacentHTML('afterbegin', '<span class="s-track"></span>');
    r.style.setProperty('--n', items.length);
    items.forEach((it, i) => { it.querySelector('.s-node').style.gridColumn = i + 1; it.querySelector('.s-when-text').style.gridColumn = i + 1; });
  });
  root.querySelectorAll('.s-cycle').forEach((c) => {
    const cards = [...c.children].filter((el) => !el.classList.contains('s-return'));
    cards.slice(0, -1).forEach((card) => card.insertAdjacentHTML('beforeend', `<span class="s-cyc-arrow">${phIcon('caret-right', '')}</span>`));
    c.style.setProperty('--n', cards.length);
  });
  root.querySelectorAll('.s-week, .s-scale-row, .s-reviews').forEach((g) => g.style.setProperty('--n', g.children.length));
  // ---- 격자 키트 칸용 조각(2026-10-20) ----
  root.querySelectorAll('.m-bars').forEach((g) => { // <div style="--v:17" [class="accent"]>이름</div> → 값 · 막대(칸 높이 비율) · 이름
    const bars = [...g.children], vals = bars.map((b) => parseFloat(b.style.getPropertyValue('--v')) || 0), max = Math.max(...vals, 1), unit = g.dataset.unit ?? '';
    bars.forEach((b, i) => { const name = b.textContent.trim(), eid = b.dataset.eid; b.removeAttribute('data-eid'); b.classList.add('m-bar');
      // 값은 막대 꼭대기 바로 위에(막대 안 위치 = 막대 높이를 따라감, 2026-10-21 디자이너 '숫자가 너무 위에')
      b.innerHTML = `<div class="m-area"><div class="s-fill" style="--p:${Math.round((vals[i] / max) * 100)}%"><span class="s-fill-foot"></span><p class="s-value">${vals[i]}<small>${unit}</small></p></div></div><p class="m-name"${eid ? ` data-eid="${eid}"` : ''}>${name}</p>`; });
  });
  root.querySelectorAll('.m-hbars').forEach((g) => {
    const rows = [...g.children], vals = rows.map((r) => parseFloat(r.style.getPropertyValue('--v')) || 0), max = Math.max(...vals, 1), unit = g.dataset.unit ?? '';
    rows.forEach((r, i) => { const name = r.textContent.trim(), eid = r.dataset.eid; r.removeAttribute('data-eid'); r.classList.add('m-hbar');
      r.innerHTML = `<p class="s-h"${eid ? ` data-eid="${eid}"` : ''}>${name}</p><div><div class="s-fill" style="width:${Math.round((vals[i] / max) * 100)}%"></div></div><p class="s-value">${vals[i]}<small>${unit}</small></p>`; });
  });
  root.querySelectorAll('.m-timeline').forEach((t) => { [...t.children].forEach((w) => {
    const rest = [...w.children].filter((c) => !c.classList.contains('s-value')); // 때 아래 글을 한 묶음으로(상자 없는 칸이면 작은 카드)
    const box = document.createElement('div'); box.className = 'm-tl-text'; rest.forEach((c) => box.append(c)); w.append(box);
    w.querySelector('.s-value')?.insertAdjacentHTML('afterend', '<div class="m-dotrow"><span class="m-dot"></span></div>');
  }); t.style.setProperty('--n', t.children.length); });
  root.querySelectorAll('.m-stack .s-legend').forEach((g) => g.style.setProperty('--n', g.children.length));
  root.querySelectorAll('.m-stack').forEach((m) => { const vs = [...m.querySelectorAll('.s-stackbar > span')].map((sp) => parseFloat(sp.style.getPropertyValue('--v')) || 1); const g = m.querySelector('.s-legend'); if (g) g.style.setProperty('--cols', vs.map((v) => `minmax(0, ${v}fr)`).join(' ')); if (m.parentElement.matches('.s-m.h2.bare') && g && !m.querySelector('.m-stack-vals')) { const row = document.createElement('div'); row.className = 'm-stack-vals'; row.style.setProperty('--cols', g.style.getPropertyValue('--cols')); row.innerHTML = [...g.children].map((d) => `<p>${d.querySelector('.s-value')?.innerHTML ?? ''}</p>`).join(''); m.querySelector('.s-stackbar').before(row); } }); // 범례 칸 폭 = 막대 조각 폭(상자 없는 큰 칸에서 이름을 조각 바로 아래에, 2026-10-21 디자이너)
  // 성적표 두 장(.m-scorecard, 2026-10-21 디자이너 '휑하다'): 줄마다 이름 · 막대(점수/만점) · 값, 가운데 차이 동그라미(data-gap)
  root.querySelectorAll('.m-scorecard').forEach((g) => {
    g.querySelectorAll('li[data-v]').forEach((li) => { const [v, of] = li.dataset.v.split('/').map(Number); li.querySelector('span')?.insertAdjacentHTML('afterend', `<i class="m-sc-bar"><i style="width:${(v / of) * 100}%"></i></i>`); });
    g.querySelectorAll('li:not([data-v])').forEach((li) => li.querySelector('span')?.insertAdjacentHTML('afterend', '<i class="m-sc-bar none"></i>'));
    const cards = g.querySelectorAll(':scope > div');
    if (cards[1] && g.dataset.gap) cards[1].insertAdjacentHTML('beforebegin', `<div class="m-sc-gap"><p class="m-sc-dot">${g.dataset.gap}</p><p>${g.dataset.gapLabel || ''}</p></div>`);
  });
  root.querySelectorAll('.m-versus').forEach((v) => [...v.children].slice(1).forEach((c) => c.insertAdjacentHTML('beforebegin', `<span class="s-arrow">${phIcon('caret-right', '')}</span>`)));
  root.querySelectorAll('.m-ox td.o').forEach((td) => { td.innerHTML = `<span class="s-mark-o">${phIcon('check-circle', '')}</span>`; });
  root.querySelectorAll('.m-ox td.x').forEach((td) => { td.innerHTML = '<span class="s-mark-x"></span>'; });
  root.querySelectorAll('.m-meter').forEach((m) => m.querySelector('.s-value')?.insertAdjacentHTML('afterend', '<div class="s-track-bar"><span></span></div>'));
  root.querySelectorAll('.m-steps').forEach((st) => [...st.children].slice(1).forEach((c) => c.insertAdjacentHTML('beforebegin', `<span class="s-arrow">${phIcon('caret-right', '')}</span>`)));
  root.querySelectorAll('.s-stack .s-legend').forEach((g) => g.style.setProperty('--n', g.children.length));
  root.querySelectorAll('.s-cards, .s-kpis, .s-timeline, .s-rows.cols').forEach((g) => g.style.setProperty('--n', g.querySelectorAll(':scope > :not(.s-track)').length));
}

// 타임라인 가로 선을 점 가운데 높이에 (배율과 상관없이 offset으로)
// 잉크(눈에 보이는 획) 기준 내용 덩어리의 위·아래 — 글자는 줄 상자 위아래 빈 곳을 빼고, 아이콘·칠한 조각은 그대로
const inkCtx = document.createElement('canvas').getContext('2d');
const inkBox = (el) => {
  const box = el.getBoundingClientRect(), k = box.width / (el.offsetWidth || 1); let t = Infinity, b = -Infinity;
  const add = (r) => { if (r.width && r.height) { t = Math.min(t, r.top); b = Math.max(b, r.bottom); } };
  const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let n, text = false;
  while ((n = w.nextNode())) {
    if (!n.textContent.trim() || n.parentElement.closest('.m-memo, .m-caption')) continue; /* 상자 모서리에 걸친 메모는 내용 덩어리가 아님 */ text = true; const rg = document.createRange(); rg.selectNodeContents(n);
    inkCtx.font = getComputedStyle(n.parentElement).font; const m = inkCtx.measureText(n.textContent.trim());
    [...rg.getClientRects()].forEach((r) => { if (!r.width) return; const base = r.top + m.fontBoundingBoxAscent * k; add({ width: 1, height: 1, top: base - m.actualBoundingBoxAscent * k, bottom: base + m.actualBoundingBoxDescent * k }); });
  }
  el.querySelectorAll('svg, img').forEach((x) => add(x.getBoundingClientRect()));
  const own = getComputedStyle(el).backgroundColor;
  el.querySelectorAll('*').forEach((x) => { if (x.closest('.m-memo, .m-caption')) return; const c = getComputedStyle(x).backgroundColor; if (c !== 'rgba(0, 0, 0, 0)' && c !== own) add(x.getBoundingClientRect()); });
  return text && t !== Infinity ? { top: (t - box.top) / k, bottom: (box.bottom - b) / k } : null;
};
// 칠한 도형(흰 상자 · 메인 면) 안 내용 덩어리를 잉크 기준 위아래 가운데로 — 위아래 안쪽 여백이 같은 도형만, 차이의 절반만큼 여백을 옮긴다(2026-10-20 디자이너 '정렬이 잘못된 곳 전체 확인')
const inkTargets = (root) => [...root.querySelectorAll('.slide .s-body *')].filter((el) => {
  const cs = getComputedStyle(el);
  if (cs.backgroundColor === 'rgba(0, 0, 0, 0)' || el.offsetHeight < 80 || el.matches('.m-frame, figure.m-photo, figure.m-photo *, .s-stairs > *, .m-climb > *, .s-return, .s-m.bare, .s-m.h2:has(> .m-quote), .s-m:has(> .m-statement), .s-m:has(> :is(.m-fix, .m-poem, .m-lab))')) return false; // 큰 칸 인용은 일부러 왼쪽 아래(디자이너)
  const pt = el.dataset.inkPad ?? cs.paddingTop;
  return parseFloat(pt) >= 16 && (el.dataset.inkPad ? true : cs.paddingTop === cs.paddingBottom);
});
const fitInk = () => {
  deck.querySelectorAll('[data-ink-pad]').forEach((el) => { el.style.paddingTop = el.style.paddingBottom = ''; delete el.dataset.inkPad; });
  const items = inkTargets(deck).map((el) => { const ink = inkBox(el); return ink && { el, d: (ink.bottom - ink.top) / 2 }; }).filter(Boolean);
  // 나란히 놓인 같은 도형(같은 부모 · 같은 크기 · 같은 부품, 강조 빼고)은 같은 만큼만 옮긴다 — 강조 카드만 따로 움직여 줄이 어긋나지 않게
  const groups = new Map();
  items.forEach((it) => { const key = it.el.parentElement; (groups.get(key) ?? groups.set(key, []).get(key)).push(it); });
  groups.forEach((g) => {
    const rows = new Map(); g.forEach((it) => { const h = `${Math.round(it.el.offsetHeight)}|${Math.round(it.el.offsetWidth)}|${it.el.className.replace(/\baccent\b/, '').trim()}|${it.el.firstElementChild?.className ?? ''}`; (rows.get(h) ?? rows.set(h, []).get(h)).push(it); });
    rows.forEach((r) => { const ds = r.map((it) => it.d).sort((a, b) => a - b); const d = ds[Math.floor(ds.length / 2)]; r.forEach((it) => { it.d = d; }); });
  });
  items.forEach(({ el, d }) => {
    if (Math.abs(d) < 2) return;
    const p = parseFloat(getComputedStyle(el).paddingTop); if (p + d < 0 || p - d < 0) return;
    el.dataset.inkPad = `${p}px`; el.style.paddingTop = `${p + d}px`; el.style.paddingBottom = `${p - d}px`;
  });
};
// 큰 숫자가 한 장에 하나뿐이면 72px(36pt)로 — 숫자는 한글보다 키가 작아 대제목과 같은 64px이면 작아 보임(2026-10-21 디자이너). 둘 이상이면 모두 대제목 크기 그대로
const fitBigNumber = () => deck.querySelectorAll('.slide').forEach((s) => {
  s.querySelectorAll('.m-big1').forEach((el) => el.classList.remove('m-big1'));
  const body = s.querySelector('.s-body'); if (!body || s.matches('.s-cover, .s-section')) return;
  const k = s.getBoundingClientRect().width / 1920 || 1;
  const big = [...body.querySelectorAll('*')].filter((el) => { const own = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join(''); return /\d/.test(own) && parseFloat(getComputedStyle(el).fontSize) >= 60 && el.getBoundingClientRect().width > 0; });
  if (big.length === 1) big[0].classList.add('m-big1');
});
// 쿠폰 점선 · 홈: 비율 계산 대신 실제 왼쪽 면 오른쪽 끝 ~ 오른쪽 칸 시작 사이 가운데에(2026-10-21 디자이너 '오른쪽 정렬 고장' — 폭을 바꾸자 점선이 체크 동그라미에 붙었음)
const fitCoupons = () => deck.querySelectorAll('.m-coupon').forEach((c) => {
  const m = c.querySelector('.m-cp-main'), b = c.querySelector('.m-cp-body'); if (!m || !b) return;
  const x = (m.offsetLeft + m.offsetWidth + b.offsetLeft) / 2;
  c.querySelectorAll(':scope > :is(.m-cp-cut, .m-cp-notch)').forEach((e) => { e.style.left = `${x}px`; });
});
// 히트맵 열 카드(상자 없는 칸 · 강조 열 방식): 열마다 네 모서리 둥근 카드 하나를 표 뒤에 깐다 — 칸마다 위 · 아래만 둥글게 하면 PPT에서 모서리가 달라짐(2026-10-21)
const fitHeatCards = () => deck.querySelectorAll('.s-m.bare > .m-heat.m-heat-col').forEach((t) => {
  const cell = t.parentElement; cell.querySelectorAll(':scope > .m-heat-card').forEach((c) => c.remove());
  const cr = cell.getBoundingClientRect(), k = cr.width / (cell.offsetWidth || 1), rows = [...t.querySelectorAll('tr')];
  [...rows[0].children].forEach((th, c) => { if (!c) return; const a = th.getBoundingClientRect(), b = rows.at(-1).children[c].getBoundingClientRect();
    cell.insertAdjacentHTML('afterbegin', `<span class="m-heat-card${th.classList.contains('acc') ? ' acc' : ''}" style="left:${(a.left - cr.left) / k}px;top:${(a.top - cr.top) / k}px;width:${a.width / k}px;height:${(b.bottom - a.top) / k}px"></span>`); });
});
// 상자 없는 칸의 메모: 칸 모서리가 아니라 실제 도식(보이는 조각들)의 오른쪽 위, 도식 바로 위에 놓는다(겹치면 도식 글자를 가림)(2026-10-21 — 칸이 도식보다 커서 메모가 멀리 떨어졌음)
// 상자 없는 칸의 '도식 아래 한 줄'은 칸 바닥이 아니라 도식 잉크 바로 아래(56px)에, 도식 + 한 줄 덩어리를 칸 세로 가운데로(2026-10-21 디자이너 — 얇은 도식이면 한 줄만 혼자 멀리 내려와 있었음)
const fitCaptions = () => deck.querySelectorAll('.s-m.bare > .m-caption').forEach((cap) => {
  const cell = cap.parentElement, grid = cell.parentElement, d = cell.querySelector(':scope > :first-child');
  cap.style.top = ''; grid.style.top = '';
  if (!d || d === cap) return; const ink = inkBox(d); if (!ink) return;
  const inkTop = d.offsetTop + ink.top, inkBottom = d.offsetTop + d.offsetHeight - ink.bottom, capTop = inkBottom + 56;
  cap.style.top = `${capTop}px`;
  if (grid.children.length === 1) grid.style.top = `${Math.max(-44, cell.offsetHeight / 2 - (inkTop + capTop + cap.offsetHeight) / 2)}px`; /* 칸을 다 쓰는 도식은 예전처럼 44px까지만 올려 머리에 붙지 않게 */
});
const fitMemos = () => deck.querySelectorAll('.s-m.bare > .m-memo').forEach((memo) => {
  const cell = memo.parentElement, cr = cell.getBoundingClientRect(), k = cr.width / (cell.offsetWidth || 1);
  let top = Infinity, right = -Infinity, bottom = -Infinity;
  cell.querySelectorAll(':scope > :not(.m-memo) *').forEach((el) => { const r = el.getBoundingClientRect(); if (!r.width || !r.height) return; const cs = getComputedStyle(el); if (cs.backgroundColor === 'rgba(0, 0, 0, 0)' && !el.childNodes.length) return; top = Math.min(top, r.top); right = Math.max(right, r.right); bottom = Math.max(bottom, r.bottom); });
  if (top === Infinity) return;
  memo.style.left = 'auto'; memo.style.margin = '0';
  const head = cell.closest('.slide')?.querySelector('.s-head')?.getBoundingClientRect(), mh = memo.offsetHeight, mw = memo.offsetWidth;
  const aboveTop = (top - cr.top) / k - mh - 24;
  const slideR = cell.closest('.slide').getBoundingClientRect().right - 100 * k;
  if (head && cr.top + aboveTop * k < head.bottom + 32 * k) {
    if (right + (mw + 32) * k <= slideR) { memo.style.top = `${(top - cr.top) / k}px`; memo.style.right = `${(cr.right - right) / k - mw - 32}px`; } // 위에 자리가 없으면 도식 오른쪽 옆에
    else { memo.style.top = `${(top - cr.top) / k - 40}px`; memo.style.right = `${(cr.right - right) / k - 48}px`; } // 옆도 디자인 영역 밖이면 도식 오른쪽 위 모서리에 걸친다(메모 겹치기 본래 모양)
  }
  else { memo.style.top = `${aboveTop}px`; memo.style.right = `${Math.max(0, (cr.right - right) / k)}px`; } // 도식 위에 겹치지 않게 — 도식 오른쪽 끝에 맞춰 그 위에
  // 그래도 도식 글자를 가리면(2026-10-23 전체 검사 — 사람 그림 옆 큰 숫자 · 체크리스트 첫 줄을 덮음) 도식 아래 → 도식 오른쪽 옆 순서로 옮겨 본다
  if (memoHitsText(memo)) {
    const slide = cell.closest('.slide').getBoundingClientRect(), maxBottom = slide.bottom - 100 * k;
    const tries = [[(bottom - cr.top) / k + 24, Math.max(0, (cr.right - right) / k)], [(top - cr.top) / k, (cr.right - right) / k - mw - 32]];
    for (const [t, r] of tries) { memo.style.top = `${t}px`; memo.style.right = `${r}px`; const m = memo.getBoundingClientRect(); if (m.bottom <= maxBottom && m.right <= slide.right - 100 * k + 1 && !memoHitsText(memo)) return; }
    memo.style.top = `${(bottom - cr.top) / k + 24}px`; memo.style.right = `${Math.max(0, (cr.right - right) / k)}px`;
  }
});
// 메모가 같은 칸의 도식 글자(글자 줄 상자)를 덮는지 — fitMemos · 검사가 같이 쓴다
function memoTextHit(m) {
  const r = m.getBoundingClientRect(); if (!r.width) return null;
  const walker = document.createTreeWalker(m.closest('.s-m, .s-body'), NodeFilter.SHOW_TEXT);
  for (let n; (n = walker.nextNode());) {
    if (!n.textContent.trim() || m.contains(n) || n.parentElement.closest('.s-notes')) continue;
    const g = document.createRange(); g.selectNodeContents(n);
    if ([...g.getClientRects()].some((q) => q.width && q.left < r.right - 2 && q.right > r.left + 2 && q.top < r.bottom - 2 && q.bottom > r.top + 2)) return n.parentElement;
  }
  return null;
}
const memoHitsText = (m) => !!memoTextHit(m);
// 세로 막대 차이 칩(2026-10-22 디자이너 '슬라이드가 빈 느낌' → 상승 선은 '부자연스러워' 뺌, 시간 순서 막대에 data-trend): 마지막 값이 첫 값보다 크면 마지막 막대 값 위에 '처음보다 +n' 칩 — 숫자는 덱 값으로 계산(지어내기 ✗)
const fitBarTrends = () => deck.querySelectorAll('.m-bars').forEach((g) => {
  g.querySelectorAll(':scope > .m-bar-gain').forEach((e) => e.remove()); g.classList.remove('has-trend');
  const bars = [...g.querySelectorAll(':scope > .m-bar')]; if (bars.length < 2 || !('trend' in g.dataset)) return; /* 시간 순서 막대만(data-trend) — 등급 분포처럼 항목끼리 비교하는 막대엔 ✗ */
  const vals = bars.map((b) => parseFloat(b.style.getPropertyValue('--v'))); const d = Math.round((vals.at(-1) - vals[0]) * 10) / 10; if (!(d > 0)) return;
  g.classList.add('has-trend'); /* 선 · 칩 자리만큼 위를 비워 도식 높이에 넣는다 — 대제목에 붙지 않게 */
  const gr = g.getBoundingClientRect(), k = gr.width / (g.offsetWidth || 1);
  g.insertAdjacentHTML('beforeend', `<p class="m-bar-gain"><span>처음보다</span><b>+${d}${g.dataset.unit || ''}</b></p>`);
  const chip = g.lastElementChild, v = (bars.at(-1).querySelector('.s-value') || bars.at(-1)).getBoundingClientRect(); // 칩은 마지막 막대 값 바로 위 가운데
  chip.style.left = `${(v.left + v.width / 2 - gr.left) / k - chip.offsetWidth / 2}px`; chip.style.top = `${(v.top - gr.top) / k - chip.offsetHeight - 36}px`; /* 값과 붙어 보이지 않게 36(2026-10-22 디자이너) */
});
// 목표 과녁: 원 + 오른쪽 목표 글을 한 덩어리로 보고 슬라이드 가운데에(2026-10-22 디자이너 '왼쪽으로 치우침') — 1500 틀 안에서 실제 그린 범위(원 왼쪽 끝 ~ 가장 긴 글 끝)만큼 옮김
const fitTargets = () => deck.querySelectorAll('.m-target, .m-examnote').forEach((g) => { /* 시험지 + 메모도 같은 방식(2026-10-22) */
  g.style.left = '0px'; const gr = g.getBoundingClientRect(), k = gr.width / (g.offsetWidth || 1); const items = [...g.querySelectorAll('.m-tg-item, li')]; if (!items.length) return;
  const right = Math.max(...items.map((d) => d.getBoundingClientRect().right)); const L = g.matches('.m-target') ? 20 : 0, R = (right - gr.left) / k; g.style.left = `${(g.offsetWidth - L - R) / 2}px`;
});
// SVG 안 옅은 메인(물빛 · 확대 빛)은 PPT 때문에 실제 rgb로 칠한다 — 학원 메인 컬러(?brand=)가 나중에 바뀌어도 따라가게 배치 때마다 다시 계산(2026-10-22 — 주황 학원인데 물빛이 파랗게 남았음)
const fitTints = () => deck.querySelectorAll('[data-tint-fill], [data-tint-stroke]').forEach((el) => {
  const p = document.createElement('i'); p.style.color = 'var(--main)'; (el.closest('.slide') || deck).append(p); const mc = (getComputedStyle(p).color.match(/[\d.]+/g) || [47, 91, 234]).slice(0, 3).map(Number); p.remove();
  if (el.dataset.tintStroke) { const a = +el.dataset.tintStroke; el.style.stroke = `rgb(${mc.map((v) => Math.round(v * a + 255 * (1 - a))).join(',')})`; return; } // 옅은 메인 선(진행 고리 등)
  const a = +el.dataset.tintFill || 0.09; el.style.fill = `rgb(${mc.map((v) => Math.round(v * a + 255 * (1 - a))).join(',')})`; // data-tint-fill="0.35"처럼 진하기 지정 가능
});
const fitTracks = () => { fitTints(); fitBigNumber(); fitBands(); fitGrids(); fitHeatCards(); fitCoupons(); fitInk(); fitTargets(); fitBarTrends(); fitCaptions(); fitMemos(); deck.querySelectorAll('.s-timeline').forEach((t) => {
  const dot = t.querySelector('.s-dot');
  if (dot?.offsetParent) t.querySelector('.s-track').style.top = `${dot.offsetParent.offsetTop + dot.offsetTop + dot.offsetHeight / 2 - 3}px`;
}); };
// 폭을 줄인 격자(양옆을 다 채우지 않음)에서 항목 제목·이름이 두 줄로 꺾이면 원래 폭으로 되돌린다(2026-10-20 디자이너)
const fitBands = () => deck.querySelectorAll('.m-timeband').forEach((t) => { t.classList.remove('tight'); if ([...t.querySelectorAll('.m-bands > div')].some((b) => b.scrollWidth > b.clientWidth + 1)) t.classList.add('tight'); });
const fitGrids = () => deck.querySelectorAll('.s-grid').forEach((g) => {
  g.classList.remove('s-wide');
  if (getComputedStyle(g).maxWidth === 'none') return;
  const wraps = [...g.querySelectorAll('.s-h, .s-label, .s-value, blockquote, p')].some((h) => Math.round(h.offsetHeight / parseFloat(getComputedStyle(h).lineHeight)) > h.querySelectorAll('br').length + 1); // 직접 끊은 줄(<br>)보다 더 꺾이면
  if (wraps) g.classList.add('s-wide');
});

const slidesEl = () => [...deck.querySelectorAll('.slide')];

let cur = 0; // 지금 보는 장(0부터)
let zoom = 1;        // 화면 맞춤 배율에 곱하는 값 (1 = 맞춤)
let viewNow = 0.5;   // 지금 슬라이드 배율 (1 = 실제 1920×1080)
const viewport = $('#viewport');
function fitScale() {
  const presenting = document.body.classList.contains('presenting');
  const w = presenting ? innerWidth : (viewport?.clientWidth ?? 1000) - 48;
  const h = presenting ? innerHeight : (viewport?.clientHeight ?? 600) - 48;
  return Math.max(0.1, Math.min(w / 1920, h / 1080));
}
function fitView() { // 가운데 무대에 한 장이 꽉 차게 × 확대 배율 (발표 모드면 화면 전체, 확대 없음)
  if (!document.querySelector('.stage')) return;
  const presenting = document.body.classList.contains('presenting');
  viewNow = fitScale() * (presenting ? 1 : zoom);
  deck.style.setProperty('--view', viewNow.toFixed(4));
  const label = $('#zoom-fit');
  if (label) label.textContent = Math.abs(zoom - 1) < 0.005 ? `맞춤 ${Math.round(viewNow * 100)}%` : `${Math.round(viewNow * 100)}%`;
  viewport?.classList.toggle('grab', zoom > 1.001);
}
// 확대·축소: 기준점(화면 좌표)이 그 자리에 머물게 스크롤을 맞춘다
function setZoom(z, cx, cy) {
  const before = deck.getBoundingClientRect();
  const vr = viewport.getBoundingClientRect();
  cx ??= vr.left + vr.width / 2; cy ??= vr.top + vr.height / 2;
  const rx = (cx - before.left) / before.width, ry = (cy - before.top) / before.height;
  zoom = Math.max(0.3, Math.min(8 / fitScale(), z)); // 실제 크기의 800%까지
  fitView();
  const after = deck.getBoundingClientRect();
  viewport.scrollLeft += after.left + rx * after.width - cx;
  viewport.scrollTop += after.top + ry * after.height - cy;
}
// 트랙패드 집기 = ctrl + 휠(브라우저가 보내는 방식). 페이지 전체 확대 대신 슬라이드만
viewport?.addEventListener('wheel', (e) => {
  if (!e.ctrlKey && !e.metaKey) return; // 두 손가락 밀기는 그냥 스크롤
  e.preventDefault();
  setZoom(zoom * Math.exp(-e.deltaY * 0.012), e.clientX, e.clientY);
}, { passive: false });
// Safari 집기(gesture 이벤트)
let gestureStart = 1;
viewport?.addEventListener('gesturestart', (e) => { e.preventDefault(); gestureStart = zoom; });
viewport?.addEventListener('gesturechange', (e) => { e.preventDefault(); setZoom(gestureStart * e.scale, e.clientX, e.clientY); });
// 확대한 상태에서 끌어서 옮기기(글자 고치기 중엔 ✗)
let drag = null;
viewport?.addEventListener('pointerdown', (e) => {
  if (zoom <= 1.001 || editing || e.button !== 0) return;
  drag = { x: e.clientX, y: e.clientY, l: viewport.scrollLeft, t: viewport.scrollTop };
  viewport.classList.add('grabbing'); viewport.setPointerCapture(e.pointerId);
});
viewport?.addEventListener('pointermove', (e) => { if (drag) { viewport.scrollLeft = drag.l - (e.clientX - drag.x); viewport.scrollTop = drag.t - (e.clientY - drag.y); } });
viewport?.addEventListener('pointerup', () => { drag = null; viewport.classList.remove('grabbing'); });
$('#zoom-in')?.addEventListener('click', () => setZoom(zoom * 1.25));
$('#zoom-out')?.addEventListener('click', () => setZoom(zoom / 1.25));
$('#zoom-fit')?.addEventListener('click', () => setZoom(1));
$('#zoom-100')?.addEventListener('click', () => setZoom(1 / fitScale()));

// 부품 이름(오른쪽 '이 장'): 홈페이지 레이아웃 이름과 짝
const PARTS = [
  ['.s-grid', '격자 키트', '12칸 격자 · 칸 w4/w6/w8/w12 × h1/h2, 칸마다 m- 조각'],
  ['.s-cover', '표지', '제목 2줄 + 오른쪽 메인 면에 오늘의 키워드'],
  ['.s-section', '장 표지', '큰 순서 사이에 넣는 메인 면 한 장'],
  ['.s-agenda', '목차', '번호 + 이름 + 한 줄, 2~6개'],
  ['.s-split', '핵심 숫자', '큰 숫자 하나 + 오른쪽 근거 줄'],
  ['.s-kpis', '숫자 타일', '값 + 이름 + 한 줄, 2~4칸'],
  ['.s-bars', '막대', '값 비교 2~6개, 강조 막대만 메인'],
  ['.s-compare', '비교', '두 칸, 우리 쪽만 메인 면'],
  ['.s-cards', '카드', '아이콘 + 이름 + 설명 2줄, 2~4칸'],
  ['.s-steps', '단계', '순서 2~5단계, 화살표 자동'],
  ['.s-timeline', '타임라인', '때 + 일 2~6개, 승부처만 메인'],
  ['.s-quote', '한 문장', '후기·인용 2줄 안쪽'],
  ['.s-table', '비교표', '열 2~5 · 줄 2~5, 강조 줄 하나'],
  ['.s-cta', '마감', '오늘 할 행동 하나 + 연락처'],
  ['.s-rows', '줄 목록', '3~4줄, 맨 위·아래 선 없음'],
  ['.s-honor-board', '합격자 명단', '대표 1명 큰 타일(메인) + 6명, 많으면 .s-names.dense'],
  ['.s-hero-center', '숫자 하나 · 가운데 큰 숫자', '숫자 + 이름 + 설명을 가운데로'],
  ['.s-ratio', '숫자 하나 · 도넛 비율', '도넛 안 % + 오른쪽 글'],
  ['.s-meters', '숫자 · 진행 막대', '전체 중 몇 — 2~3줄'],
  ['.s-statrow', '여러 숫자 · 숫자 한 줄', '흰 도형 하나 안 3~4칸, 세로 선'],
  ['.s-hbars', '비교 · 가로 막대', '이름 · 막대 · 값, 2~5줄'],
  ['.s-flow', '순서 · 알약 흐름', '번호 알약 3~4개 + 한 줄 설명'],
  ['.s-vsteps', '순서 · 세로 번호 줄', '번호를 세로 선으로, 3~4개'],
  ['.s-stairs', '순서·성장 · 계단', '오른쪽으로 높아지는 칸 3~4개'],
  ['.s-months', '시간 · 열두 달 띠', '달 머리 + 기간 막대 3~4줄'],
  ['.s-stack', '비율 · 쌓인 막대', '100% 한 줄 + 범례 2~4'],
  ['.s-dots', '비율 · 점 100개', '10×10 점 중 N + 큰 %'],
  ['.s-grid4', '묶음 · 2×2 격자', '아이콘 왼쪽 + 글 오른쪽'],
  ['.s-hub', '묶음 · 가운데 + 둘레 넷', '가운데 메인 원 + 칸 넷'],
  ['.s-iconrow', '묶음 · 아이콘 줄', '흰 도형 하나 안 3~5칸'],
  ['.s-dialog', '말 · 두 사람 대화', '학부모(흰) · 선생님(메인) 풍선'],
  ['.s-versus', '숫자 비교 · 전후 숫자', '전(흰) → 후(메인) 큰 숫자 둘'],
  ['.s-lead', '여러 숫자 · 대표 숫자 + 목록', '왼쪽 메인 면 큰 숫자 + 숫자 줄 3'],
  ['.s-ox', '비교 · O/X 표', '항목 3~5 × 선택지 2~3'],
  ['.s-roadmap', '순서 · 로드맵', '가로 선 위 점, 글은 위아래 번갈아 4~6개'],
  ['.s-cycle', '순서 · 순환', '칸 3~4 + 되돌이 선'],
  ['.s-week', '시간 · 주간 일정', '요일 칸 5~6 + 수업 조각'],
  ['.s-scale', '수준 · 등급 눈금', '칸 줄 + 지금 · 목표 표시'],
  ['.s-tags', '묶음 · 키워드 알약', '핵심 하나(메인) + 키워드 6~10'],
  ['.s-pyramid', '위계 · 피라미드', '위로 좁아지는 줄 3~4, 맨 위 메인'],
  ['.s-profile', '사람 · 강사 소개', '사진 자리·이름 + 경력 줄 3~4'],
  ['.s-faq', '말 · 자주 묻는 질문', 'Q + 질문 · 답, 3개'],
  ['.s-reviews', '말 · 후기 묶음', '별점 + 짧은 후기 2~3칸'],
  ['.s-checks2', '묶음 · 두 줄 체크리스트', '짧은 항목 6~8개를 두 열로'],
  ['.s-typescale', '글자 크기 견본', '확인용 — 덱에는 쓰지 않아요'],
  ['.s-names', '이름 타일', '4열 8명까지, .dense 5열 15명까지'],
];
const partOf = (s) => PARTS.find(([sel]) => s.matches(sel) || s.querySelector(`.s-body > ${sel}, .s-body > * > ${sel}`)) ?? [null, '부품 없음', ''];

let issuesBySlide = [];
function go(i) {
  const frames = [...deck.children];
  if (!frames.length) return;
  cur = Math.max(0, Math.min(frames.length - 1, i));
  frames.forEach((f, k) => f.classList.toggle('on', k === cur));
  document.querySelectorAll('.thumb').forEach((t, k) => t.classList.toggle('on', k === cur));
  document.querySelectorAll('.thumb')[cur]?.scrollIntoView({ block: 'nearest' });
  const set = (sel, t) => { const el = $(sel); if (el) el.textContent = t; };
  set('#count', `${cur + 1} / ${frames.length}`);
  const [, name, hint] = partOf(slidesEl()[cur]);
  set('#part-name', name); set('#part-hint', hint);
  const mine = issuesBySlide[cur] ?? [];
  const list = $('#check-list');
  if (list) list.replaceChildren(...mine.map((t) => Object.assign(document.createElement('li'), { textContent: t.replace(/^\d+장: /, '') })));
  const chk = $('#check');
  if (chk) { chk.textContent = mine.length ? `이 장 ${mine.length}건` : '이 장 문제 없음'; chk.classList.toggle('bad', mine.length > 0); }
  const total = issuesBySlide.flat().length;
  set('#check-all', total ? `덱 전체 ${total}건 — 왼쪽 주황 점이 있는 장` : '덱 전체 문제 없음');
}

function render() {
  const root = source.content.cloneNode(true);
  decorate(root);
  deck.replaceChildren();
  const slides = [...root.children].filter((el) => el.classList.contains('slide'));
  slides.forEach((s, i) => {
    const f = document.createElement('div');
    f.className = 'frame';
    f.append(s);
    deck.append(f);
  });
  fitView();
  setEditable(editing);
  go(cur);
  requestAnimationFrame(() => { fitTracks(); runCheck(); drawThumbs(); go(cur); });
}

// ---------- 왼쪽 미리보기 목록 ----------
function drawThumbs() {
  const nav = $('#thumbs');
  if (!nav) return;
  nav.replaceChildren(...slidesEl().map((s, i) => {
    const item = document.createElement('div');
    item.className = 'thumb';
    const f = document.createElement('div');
    f.className = 'frame';
    const c = s.cloneNode(true);
    c.querySelectorAll('[contenteditable]').forEach((e) => e.removeAttribute('contenteditable'));
    f.append(c);
    const num = document.createElement('div');
    num.append(String(i + 1).padStart(2, '0'));
    if (issuesBySlide[i]?.length) num.append(Object.assign(document.createElement('div'), { className: 'warn-dot' }));
    item.append(num, f);
    item.addEventListener('click', () => go(i));
    return item;
  }));
}

// ---------- 검사: 넘침 · 슬라이드 밖 · 제목 두 줄 · 머리와 도식 사이 ----------
// 같은 주 도식(콘텐츠 영역 맨 위 부품) 반복: PPT는 일부 겹쳐도 된다(2026-10-20 디자이너) — 세 번 이상이거나 바로 옆 장에서 이어질 때만 잡는다
const partKey = (el) => [...el.classList].filter((c) => c.startsWith('s-') && c !== 's-panel-box').concat(el.classList.contains('cols') ? ['cols'] : el.classList.contains('dense') ? ['dense'] : []).join('.');
// 격자(.s-grid)면 '칸 크기 + 칸마다 조각' 짜임을 한 도식으로 본다 — 같은 조각도 칸 짜임이 다르면 다른 도식
const mainPart = (s) => { const el = s.querySelector('.s-body > *'); if (!el) return null; if (el.classList.contains('s-grid')) return `grid(${[...el.children].map((m) => (m.className.match(/\bw\d+|\bh2\b/g) ?? []).join('') + ':' + (m.firstElementChild ? [...m.firstElementChild.classList].filter((c) => c.startsWith('m-')).join('.') : '')).join('+')})`; return partKey(el); };
// 보조 글 붙이는 방식(2026-10-21 디자이너 — '도식 상자 + 글 상자 나란히'가 지겹게 반복): 같은 방식은 두 번까지 · 바로 옆 장 연속 ✗
const supportKind = (s) => {
  const b = s.querySelector('.s-body'); if (!b) return null;
  for (const [sel, name] of [['.m-say', '말풍선'], ['.m-bignum', '큰 숫자 주인공'], ['.m-note', '도식 안 주석'], ['.m-memo', '메모 겹치기'], ['.m-caption', '도식 아래 한 줄']]) if (b.querySelector(sel)) return name;
  const g = b.querySelector(':scope > .s-grid');
  if (g && g.children.length === 2 && [...g.children].some((m) => m.querySelector(':scope > :is(.m-num, .m-statement, .m-quote, .m-iconstat)'))) return '도식 + 글 칸 나란히';
  return null;
};
function repeatCheck() {
  const used = {}, out = [], sUsed = {};
  let prev = null, sPrev = null;
  slidesEl().forEach((s, i) => {
    const sk = s.classList.contains('s-ref') ? null : supportKind(s);
    if (sk) { (sUsed[sk] ??= []).push(i + 1); if (sk === sPrev) out.push(`${i + 1}장: 바로 앞 장과 같은 보조 글 방식(${sk})`); if (sUsed[sk].length === 3) out.push(`${i + 1}장: 보조 글 방식(${sk})이 세 번째예요(${sUsed[sk].join('·')}장) — 두 번까지`); }
    sPrev = sk;
  });
  slidesEl().forEach((s, i) => {
    const k = s.classList.contains('s-ref') ? null : mainPart(s); // 확인용 견본 장(.s-ref)은 반복 검사에서 뺀다
    if (!k) { prev = null; return; }
    (used[k] ??= []).push(i + 1);
    if (k === prev) out.push(`${i + 1}장: 바로 앞 장과 같은 도식(${k})`);
    if (used[k].length === 3) out.push(`${i + 1}장: 같은 도식(${k})이 세 번째예요(${used[k].join('·')}장) — 두 번까지`);
    prev = k;
  });
  return out;
}
// ── 정렬 검사 셋(2026-10-22 디자이너 '대부분 정렬 피드백 — 규칙이 잘 설정된 거 맞아?') ──
// 예전 검사는 위 = 아래만 보고(위아래 padding이 같은 도형만), 높이 300 이상만 48px를 봤다 → 작은 카드 위아래가 좁아도(원인 카드) · 걸친 장식 밑에 글이 붙어도(쪽지 테이프) · 쌓인 글 줄 사이가 달라도(간지) 통과했다
// 잉크 상자(가로세로): 글자는 획 기준, 아이콘 · 그림 · 칠한 조각은 상자 그대로. skip(el)이 참인 요소(걸친 장식)는 빼고 잰다
const inkRect = (el, skip = () => false) => {
  const box = el.getBoundingClientRect(), k = box.width / (el.offsetWidth || 1); let t = Infinity, b = -Infinity, l = Infinity, r = -Infinity, text = false;
  const add = (q) => { if (q.width && q.height) { t = Math.min(t, q.top); b = Math.max(b, q.bottom); l = Math.min(l, q.left); r = Math.max(r, q.right); } };
  const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let n;
  while ((n = w.nextNode())) {
    const pe = n.parentElement; if (!n.textContent.trim() || pe.closest('.m-memo, .m-caption') || skip(pe)) continue;
    const pcs = getComputedStyle(pe); if (pcs.color === 'rgba(0, 0, 0, 0)' || pcs.visibility === 'hidden') continue; text = true;
    const rg = document.createRange(); rg.selectNodeContents(n); inkCtx.font = pcs.font; const m = inkCtx.measureText(n.textContent.trim());
    [...rg.getClientRects()].forEach((q) => { if (!q.width) return; const base = q.top + m.fontBoundingBoxAscent * k; add({ width: q.width, height: 1, left: q.left, right: q.right, top: base - m.actualBoundingBoxAscent * k, bottom: base + m.actualBoundingBoxDescent * k }); });
  }
  el.querySelectorAll('svg, img').forEach((x) => { if (!skip(x)) add(x.getBoundingClientRect()); });
  const own = getComputedStyle(el).backgroundColor;
  el.querySelectorAll('*').forEach((x) => { if (x.closest('.m-memo, .m-caption') || skip(x)) return; const c = getComputedStyle(x).backgroundColor; if (c !== 'rgba(0, 0, 0, 0)' && c !== own) add(x.getBoundingClientRect()); });
  return text && t !== Infinity ? { top: (t - box.top) / k, bottom: (box.bottom - b) / k, left: (l - box.left) / k, right: (box.right - r) / k, k } : null;
};
// 글자만의 잉크 위 · 아래(절대 좌표, 화면 px)
const textInkY = (el) => { const q = inkRect(el); if (!q) return null; const box = el.getBoundingClientRect(); return { top: box.top + q.top * q.k, bottom: box.bottom - q.bottom * q.k, k: q.k }; };
const ALIGN_SKIP = '.s-stairs > *, .m-climb > *, .m-gun > div, .s-return, .s-m.bare, .s-m.h2:has(> .m-quote), .s-m:has(> .m-statement), .s-m:has(> :is(.m-fix, .m-poem, .m-lab, .m-table, .m-ox, .m-heat, .m-hbars, .m-csatcard, .m-wongoji, .m-record, .m-transcript, .m-outline, .m-omr, .m-notice, .m-dictation, .m-ledger, .m-receipts)), .m-ledger *, .m-receipts *, .m-cn-stack *, .m-envelopes > div, .m-transcript *, .m-outline *, .m-omr *, .m-notice *, .m-dictation *, .m-tray > *, .m-tf, .m-tf *, .m-jamo *, .m-cl-card, .m-tr-bar *, .m-month, .m-cal, .m-heat *, .m-table *, .m-ox *, .m-bars *, .m-hbars *, .m-stack *, .m-dist *, .s-track-bar, .m-gauge *, .m-waffle *, .s-dotgrid, .s-dotgrid *, .m-podium *, .m-funnel *, .s-pyramid *, .m-wave *, .m-sheet, .m-frame, figure.m-photo, figure.m-photo *';
const alignCheck = (s, i) => {
  const out = [], body = s.querySelector('.s-body'); if (!body) return out;
  const nm = (el) => (el.className || el.tagName).toString().split(' ').filter((c) => c !== 'accent').slice(0, 2).join('.') || el.tagName;
  // ① 칠한 도형 안 글 덩어리: 위 · 아래 여백 ≥ 양옆 여백(64까지)의 0.8배 — 작은 칩 · 동그라미 · 알약 · 그래프 조각은 뺀다
  // ② 도형 끝에 걸친 장식(테이프 · 겹친 카드 등 도형 밖으로 나간 조각)이 있으면 그 장식 끝부터 잰다
  [...body.querySelectorAll('*')].forEach((el) => {
    const cs = getComputedStyle(el); if (cs.backgroundColor === 'rgba(0, 0, 0, 0)' || el.offsetHeight < 96 || el.offsetWidth < 200 || el.matches(ALIGN_SKIP)) return;
    if (parseFloat(cs.borderTopLeftRadius) >= Math.min(el.offsetHeight, el.offsetWidth) / 2 - 1) return;
    const box = el.getBoundingClientRect();
    const crosses = (x) => { const q = x.getBoundingClientRect(); return q.height > 0 && ((q.top < box.top - 1 && q.bottom > box.top + 1) || (q.bottom > box.bottom + 1 && q.top < box.bottom - 1)); };
    const decos = [...el.querySelectorAll('*')].filter((x) => { const c = getComputedStyle(x); return c.position === 'absolute' && !x.closest('.m-memo') && c.backgroundColor !== 'rgba(0, 0, 0, 0)' && c.backgroundColor !== cs.backgroundColor && crosses(x); }); // 같은 색 꼬리 · 메모는 안쪽을 차지하지 않음
    const ink = inkRect(el, (x) => decos.some((d) => d === x || d.contains(x))); if (!ink) return;
    let top = ink.top, bottom = ink.bottom;
    decos.forEach((d) => { const q = d.getBoundingClientRect(); if (q.top < box.top) top = Math.min(top, ink.top - (q.bottom - box.top) / ink.k); else bottom = Math.min(bottom, ink.bottom - (box.bottom - q.top) / ink.k); });
    if (decos.length && Math.abs(top - bottom) > 6) out.push(`${i + 1}장: ${nm(el)} 걸친 장식 끝부터 위 ${Math.round(top)} · 아래 ${Math.round(bottom)}px — 위아래 같게`);
    else if (!decos.length && Math.abs(top - bottom) > 6 && !inkTargets(el.parentElement || el).includes(el) && cs.justifyContent === 'center') out.push(`${i + 1}장: ${nm(el)} 위 ${Math.round(top)} · 아래 ${Math.round(bottom)}px — 가운데 정렬 도형인데 위아래가 달라요(위아래 padding을 같게 두면 fitInk가 맞춤)`); // 위아래 padding 0인 가운데 정렬 도형은 예전 검사 대상이 아니었다(한자 칸)
    const padL = parseFloat(cs.paddingLeft); if (padL < 24) return; // 양옆 여백을 정하지 않은 가운데 정렬 칸(짝 잇기 카드 등)은 위아래 같음만 본다
    const side = Math.min(ink.left, ink.right, 64), need = Math.round(side * 0.8);
    if (Math.min(top, bottom) < need - 1) out.push(`${i + 1}장: ${nm(el)} 위 ${Math.round(top)} · 아래 ${Math.round(bottom)}px — 양옆(${Math.round(side)})보다 좁음, ${need}px 이상으로`);
  });
  // ③ 쌓인 글 줄 사이(잉크 기준)는 같게 — 장 표지 PART ↔ 제목 ↔ 부제, 표지 위 태그 ↔ 제목은 20 기준이라 제외
  const stack = (els, label) => { const ys = els.map(textInkY); if (ys.some((y) => !y)) return; const g = ys.slice(1).map((y, k) => Math.round((y.top - ys[k].bottom) / y.k)); if (Math.max(...g) - Math.min(...g) > 4) out.push(`${i + 1}장: ${label} 줄 사이 ${g.join(' · ')}px — 같게`); };
  // 카드 안 라벨 ↔ 이름 ↔ 설명(바로 이어진 .s-label · .s-h · p) — 디자이너 규칙: 카드 라벨 · 이름 · 설명 사이는 같게(28)
  body.querySelectorAll('.s-label + .s-h + p:not(.s-h)').forEach((p3) => { const h = p3.previousElementSibling; stack([h.previousElementSibling, h, p3], `${nm(p3.parentElement)} 라벨 ↔ 이름 ↔ 설명`); });
  if (s.matches('.s-section')) { const els = ['.s-section-num', '.s-section-title', '.s-section-sub'].map((q) => s.querySelector(q)).filter(Boolean); if (els.length === 3) stack(els, '장 표지'); }
  return out;
};
// 글자 대비 검사(2026-10-23 디자이너 '여러 학원 색으로 점검'): 글자 색과 그 뒤 바탕(가장 가까운 칠한 조상, 없으면 판 바탕)의 대비가 2.5 : 1보다 낮으면 잡는다
// — 밝은 학원 색(노랑 · 연두 · 하늘)에서 메인 면 위 흰 글자, 흰 바탕 위 메인 글자가 안 읽히는 일을 찾으려고. 회색 보조 글(#8B8E98 on #F4F4F4 ≈ 3.0)은 통과하는 선
const rgbOf = (s) => { const m = (s || '').match(/[\d.]+/g); if (!m) return null; const [r, g, b, a = 1] = m.map(Number); if (/^color\(srgb/.test(s)) return { r: r * 255, g: g * 255, b: b * 255, a }; return { r, g, b, a }; };
const relLum = ({ r, g, b }) => [r, g, b].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }).reduce((s, v, k) => s + v * [0.2126, 0.7152, 0.0722][k], 0);
const contrastOf = (a, b) => { const [x, y] = [relLum(a), relLum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const contrastCheck = (s, i) => {
  const out = [], seen = new Set(), f = s.closest('.frame'), keep = f?.getAttribute('style') ?? null;
  if (f) f.style.cssText += ';position:fixed;left:0;top:0;z-index:2147483647'; // 잴 장을 화면 왼쪽 위로 잠깐 꺼냄(안 보이는 장은 화면 밖에 있음)
  s.querySelectorAll('*').forEach((el) => {
    const own = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join('').trim();
    if (!/[0-9A-Za-z가-힣]/.test(own) || el.closest('figure.m-photo, .s-cover-visual, .m-om-b, .m-ln, .m-q > em') || !el.getClientRects().length) return; // OMR 칠한 칸 숫자는 일부러 숨김
    const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || +cs.opacity === 0) return;
    if (el.closest('.s-section') && parseFloat(cs.fontSize) >= 200) return; // 장 표지 큰 번호는 일부러 옅게 깐 장식
    const fg = rgbOf(el instanceof SVGElement ? cs.fill : cs.color); if (!fg || fg.a === 0) return;
    // 바탕 = 글자 가운데 자리에서 글자 바로 뒤에 실제로 깔린 것(부모가 아니라 겹친 형제 도형 · SVG 칠까지) — 화면에 보이는 장에서만 정확
    const rc = el.getClientRects()[0]; let bg = rgbOf(cs.backgroundColor); if (!(bg && bg.a > 0.5)) bg = null; // 글자 요소 자신이 칠해져 있으면 그 색
    if (!bg) for (const u of document.elementsFromPoint(rc.left + rc.width / 2, rc.top + rc.height / 2)) {
      if (u === el || (el.contains(u) && !(u instanceof SVGElement)) || !s.contains(u)) continue; // 글자 요소 안에 깐 그림(마름모 등)은 바탕으로 봄
      const ucs = getComputedStyle(u), c = rgbOf(u instanceof SVGElement && u.tagName !== 'svg' ? ucs.fill : ucs.backgroundColor);
      if (c && c.a > 0.5) { bg = c; break; }
    }
    if (!bg) for (let p = el instanceof SVGElement ? el.closest('svg')?.parentElement : el; p && p !== s.parentElement; p = p.parentElement) { const c = rgbOf(getComputedStyle(p).backgroundColor); if (c && c.a > 0.5) { bg = c; break; } } // 화면 밖이면 부모로
    bg ||= rgbOf(getComputedStyle(s).backgroundColor) || { r: 244, g: 244, b: 244 };
    const ratio = contrastOf(fg, bg); const key = `${own.slice(0, 12)}`;
    if (ratio < 2.5 && !seen.has(key)) { seen.add(key); out.push(`${i + 1}장: 글자 대비 ${ratio.toFixed(1)} : 1 — '${own.slice(0, 14)}'(${el.className?.baseVal ?? el.className ?? el.tagName}) 안 읽힘`); }
  });
  if (f) { if (keep == null) f.removeAttribute('style'); else f.setAttribute('style', keep); }
  return out;
};
// 약한 장: 부품의 항목이 예시 덱보다 크게 적으면(최소보다 적고 최대의 60% 이하) 휑해 보인다(2026-10-23 홈페이지 시험 — 구간 하나뿐인 수업 시간 띠)
function weakCheck() {
  const out = [];
  slidesEl().forEach((s, i) => s.querySelectorAll('[data-items]').forEach((el) => {
    const c = [...el.classList].find((k) => PART_RANGES[k]); if (!c) return;
    const [lo, hi] = PART_RANGES[c], n = +el.dataset.items; if (hi <= 2) return; // 예시가 1 ~ 2개뿐인 부품(달력 등)은 개수로 빈약함을 말할 수 없다
    if (n < lo && n <= hi * 0.6) out.push(`${i + 1}장: .${c} 항목이 ${n}개 — 예시 덱은 ${lo === hi ? lo : lo + ' ~ ' + hi}개(빈약해 보임, 항목을 늘리거나 다른 부품으로)`);
  }));
  // 대본으로 만든 덱(data-beat가 있는 덱)은 내지마다 꼭지 · 발표자 노트가 있어야 한다(2026-10-23 홈페이지 5단계 연결)
  if (slidesEl().some((s) => s.dataset.beat)) slidesEl().forEach((s, i) => {
    if (s.matches('.s-section')) return;
    if (!s.dataset.beat) out.push(`${i + 1}장: 어느 꼭지 장인지(data-beat)가 없어요`);
    if (!s.querySelector('.s-notes')?.textContent.trim()) out.push(`${i + 1}장: 발표자 노트(aside.s-notes)가 없어요 — 이 장에서 할 말을 노트로`);
  });
  // 겹쳐 놓는 보조 글(메모 · 주석)이 도식 글자를 가리면 안 된다(2026-10-23 홈페이지 시험 — 가로 막대 값 '68점'을 메모가 덮음)
  slidesEl().forEach((s, i) => s.querySelectorAll('.m-memo, .m-note').forEach((m) => {
    const hit = memoTextHit(m);
    if (hit) out.push(`${i + 1}장: 메모가 도식 글자 '${hit.textContent.trim().slice(0, 12)}'를 가려요 — 메모를 빼거나 도식 아래 한 줄(.m-caption)로`);
  }));
  return out;
}
window.slideCheck = () => (slidesEl().length ? [] : ['슬라이드가 0장']).concat(repeatCheck(), weakCheck(), slidesEl().flatMap((s, i) => {
  const out = [], body = s.querySelector('.s-body');
  const sr = s.getBoundingClientRect(), k = sr.width / 1920;
  // 칠한 도형의 모서리 값이 서로 다르면 PPT에서 다르게 나온다(kit/pptx.js는 한 값으로만 옮김, 2026-10-20) — 돌린 조각(그림으로 옮김)은 빼고
  s.querySelectorAll('*').forEach((el) => {
    const cs = getComputedStyle(el);
    if (cs.backgroundColor === 'rgba(0, 0, 0, 0)' && cs.backgroundImage === 'none') return;
    if (cs.transform !== 'none') return;
    const r = [cs.borderTopLeftRadius, cs.borderTopRightRadius, cs.borderBottomRightRadius, cs.borderBottomLeftRadius];
    if (new Set(r).size > 1) out.push(`${i + 1}장: ${el.className || el.tagName} 모서리 값이 달라 PPT에서 다르게 보임`);
  });
  // 격자 키트: 슬라이드에 복잡하거나 많은 내용은 안 들어간다(2026-10-20 디자이너) — 한 장 3칸까지 · 목록 4줄까지
  // 한 장 = 도식 하나(2026-10-21 디자이너 — 서로 다른 큰 사각형 둘이 나란하면 지겹다): 격자 칸들의 조각 종류가 둘 이상이면 ✗. 같은 카드 여러 장(×3 · 숫자 넷)은 도식 하나로 셈, 보조 글(말풍선 · 메모 · 주석 · 아래 한 줄)은 칸이 아님
  if (!s.classList.contains('s-ref')) s.querySelectorAll('.s-grid').forEach((g) => { const kinds = new Set([...g.children].map((m) => { const el = m.querySelector(':scope > [class*="m-"]:not(.m-memo, .m-caption, .m-paper-margin, .m-paper-hole)'); return el ? [...el.classList].find((c) => c.startsWith('m-')) : 'list'; })); if (kinds.size > 1) out.push(`${i + 1}장: 한 장에 도식이 ${kinds.size}개(${[...kinds].join(' + ')}) — 도식 하나로(보조 글은 말풍선 · 메모 · 주석 · 아래 한 줄)`); });
  // 도식이 칸보다 커서 넘치면 아래로만 밀려 위아래가 치우친다(2026-10-21 디자이너 — 상자 없는 사분면). 상자 없는 칸의 도식도 넘침을 잡는다
  s.querySelectorAll('.s-m > :first-child').forEach((d) => { if (d.matches('.m-memo, .m-caption, .s-label, .m-paper-margin')) return; const r = d.getBoundingClientRect(); if (!r.height) return; const over = [...d.children].some((c) => { const cr = c.getBoundingClientRect(); return cr.height && getComputedStyle(c).position !== 'absolute' && cr.bottom > r.bottom + 2; }); if (over) out.push(`${i + 1}장: ${[...d.classList].join('.')} 도식이 칸보다 커서 아래로 넘침 — 위아래가 치우쳐 보임`); });
  // 도식 크기: 보이는 조각들의 범위가 본문 영역(폭 1720 × 머리 아래 ~ 디자인 영역 아래) 면적의 45% 미만이면 작다(2026-10-21 디자이너 '사방 여백이 많은데 왜 작게')
  if (body && !s.matches('.s-cover, .s-section, .s-ref') && !s.querySelector('.s-cta, .s-quote, .s-dialog, .m-quote, .m-dialog')) { // 인용 · 대화는 글 길이만큼(디자이너 규칙)이라 뺀다
    let L = 1e9, T = 1e9, R = -1e9, B = -1e9;
    body.querySelectorAll('*').forEach((el) => { const r = el.getBoundingClientRect(); if (!r.width || !r.height) return; const cs = getComputedStyle(el); if (cs.backgroundColor === 'rgba(0, 0, 0, 0)' && !(parseFloat(cs.borderTopWidth) > 2 && cs.borderTopStyle !== 'none' && cs.borderTopColor !== 'rgba(0, 0, 0, 0)') && el.tagName !== 'svg' && ![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) return; /* 테두리만 있는 도형(사슬 고리 등)도 보이는 조각 */ L = Math.min(L, r.left); T = Math.min(T, r.top); R = Math.max(R, r.right); B = Math.max(B, r.bottom); });
    const hd = s.querySelector('.s-head')?.getBoundingClientRect(), availH = (sr.bottom - 100 * k) - ((hd?.bottom ?? sr.top) + 64 * k);
    const area = ((R - L) / k / 1720) * ((B - T) / availH);
    if (R > L && area < 0.45) out.push(`${i + 1}장: 도식이 작아요 — 본문 영역의 ${Math.round(area * 100)}%만 써요(45% 이상으로 키우기)`);
  }
  // 타임라인 · 로드맵의 강조 점은 꽉 채우지 않는다 — 다른 점과 같은 테두리 원, 테두리만 메인(2026-10-20 디자이너, 로드맵에서 빠졌던 일 2026-10-21)
  { const mc = getComputedStyle(s).getPropertyValue('--main').trim(); const probe = document.createElement('i'); probe.style.color = mc; s.append(probe); const mainRgb = getComputedStyle(probe).color; probe.remove();
    s.querySelectorAll('.s-roadmap .s-node, .m-timeline .m-dot, .s-when .s-dot, .s-timeline .s-dot').forEach((d) => { if (getComputedStyle(d).backgroundColor === mainRgb) out.push(`${i + 1}장: 타임라인 강조 점이 꽉 찬 메인 — 속은 비우고 테두리만 메인으로`); }); }
  s.querySelectorAll('.s-grid').forEach((g) => { if (g.children.length > 3) out.push(`${i + 1}장: 칸이 ${g.children.length}개 — 한 장에 3칸까지`); });
  // 큰 흰 상자(도식 하나를 통째로 감싸는 상자)는 표 · 가로 막대 그래프만(2026-10-21 디자이너 확정). 공책 종이(첨삭 답안 · 시 근거 찾기)는 종이 자체가 디자인이라 예외. 나머지는 상자 없는 형(.bare, 조각마다 흰 카드)
  s.querySelectorAll('.s-grid > .s-m.h2:not(.bare)').forEach((m) => { const big = m.classList.contains('w12') || m.parentElement.children.length === 1; if (big && !m.querySelector(':scope > :is(.m-table, .m-ox, .m-heat, .m-hbars, .m-fix, .m-poem, .m-lab, .m-wongoji, .m-record, .m-csatcard)')) out.push(`${i + 1}장: 큰 흰 상자는 표 · 가로 막대만 — 상자 없는 형(.bare, 조각마다 흰 카드)으로`); });
  if (!s.querySelector('.s-cta') && s.querySelector('.s-head .s-sub')) out.push(`${i + 1}장: 내지 부연설명은 쓰지 않아요(디자이너) — 머리는 목차 표시 + 대제목`);
  s.querySelectorAll('.s-title .hl').forEach(() => out.push(`${i + 1}장: 대제목에 메인 컬러 강조 — 제목은 제목 색만(디자이너)`));
  s.querySelectorAll('.m-list').forEach((l) => { if (l.children.length > 4) out.push(`${i + 1}장: 목록이 ${l.children.length}줄 — 4줄까지`); });
  // 흰 도형이 하나도 없는 내지는 허전하다(2026-10-20 디자이너, 카드뉴스와 같은 규칙)
  if (body && !s.classList.contains('s-ref') && !body.querySelector('.m-stack, .s-stack, .m-pyr-svg, .m-era-band, .m-ib-svg, .m-forget svg, .m-tg-svg, .m-yr-svg, .m-hr-svg, .m-scatter svg, .m-v3-svg, .m-rg-svg, .m-wh-svg, .m-rd-svg, .m-sw-svg, .m-mg-svg, .m-dl-svg, .m-ev-lines, .m-cl-chart, .m-tz-clock, .m-ll-svg') /* 쌓인 막대는 배경 위 그래프만(디자이너) */ && ![...body.querySelectorAll('*')].some((el) => getComputedStyle(el).backgroundColor === 'rgb(255, 255, 255)')) out.push(`${i + 1}장: 흰 도형이 하나도 없음`);
  // 흰 도형 안 내용 덩어리는 위아래 여백이 같게(2026-10-20 디자이너 — 줄 목록이 상자보다 커서 아래로 넘쳐 아래에 붙어 보였음). 위아래 padding이 같은 흰 도형만
  if (body) inkTargets(s).forEach((el) => {
    const ink = inkBox(el); if (!ink) return;
    // 내용이 도형보다 크면 안쪽 여백이 무시되고 위아래로 넘친다(같은 만큼 넘쳐서 위아래 차이 검사로는 안 잡힘 — 2026-10-21 O/X 표). 잉크 여백 44px 미만도 잡는다
    if ((el.scrollHeight > el.clientHeight + 1 && !el.querySelector(':scope > :is(.m-memo, .m-caption)')) || [...el.children].some((c) => { const r = c.getBoundingClientRect(), b = el.getBoundingClientRect(); return r.height > 0 && getComputedStyle(c).position !== 'absolute' && (r.top < b.top - 1 || r.bottom > b.bottom + 1); })) out.push(`${i + 1}장: ${(el.className || el.tagName).toString().split(' ').slice(0, 3).join('.')} 내용이 도형보다 커서 넘침 — 줄 간격 · 글을 줄이기`);
    else if (el.offsetHeight >= 300 && Math.min(ink.top, ink.bottom) < 48) out.push(`${i + 1}장: ${(el.className || el.tagName).toString().split(' ').slice(0, 3).join('.')} 큰 도형 안 위 ${Math.round(ink.top)} · 아래 ${Math.round(ink.bottom)}px — 48px 이상으로`); // 칩 · 작은 칸은 제외, 큰 흰 상자만
    if (Math.abs(ink.top - ink.bottom) > 6 && !el.matches('.m-phonics > div:not(.accent)')) /* 글자 칸 줄은 글자 밑선을 맞춰 같은 만큼만 옮김(c · a는 x높이, t는 위로 솟음) */ out.push(`${i + 1}장: ${(el.className || el.tagName).toString().split(' ').slice(0, 3).join('.')} 칠한 도형 안 위 ${Math.round(ink.top)} · 아래 ${Math.round(ink.bottom)}px — 위아래 여백을 같게`);
  });
  out.push(...alignCheck(s, i), ...contrastCheck(s, i));
  if (body && body.scrollHeight > body.clientHeight + 1) out.push(`${i + 1}장: 콘텐츠 영역 넘침 ${body.scrollHeight - body.clientHeight}px`);
  s.querySelectorAll('*').forEach((el) => { const r = el.getBoundingClientRect(); if (r.width && (r.right > sr.right + 1 || r.bottom > sr.bottom + 1)) out.push(`${i + 1}장: ${el.className || el.tagName} 슬라이드 밖`); });
  const head = s.querySelector('.s-head'), first = s.querySelector('.s-body > *');
  if (head && first) { const gap = (first.getBoundingClientRect().top - head.getBoundingClientRect().bottom) / k; if (gap < 64) out.push(`${i + 1}장: 머리와 도식 사이 ${Math.round(gap)}px (64 이상)`); }
  if (first) { const pad = parseFloat(getComputedStyle(s).getPropertyValue('--pad')) || 100; const bottom = (first.getBoundingClientRect().bottom - sr.top) / k; if (bottom > 1080 - pad + 1) out.push(`${i + 1}장: 도식이 디자인 영역 아래로 ${Math.round(bottom - (1080 - pad))}px 나감`); }
  s.querySelectorAll('.s-cover-title, .s-section-title').forEach((t) => { if (t.getBoundingClientRect().height > parseFloat(getComputedStyle(t).lineHeight) * 2.5 * k) out.push(`${i + 1}장: 표지 제목이 세 줄 넘음`); });
  s.querySelectorAll('.s-title').forEach((t) => { if (t.getBoundingClientRect().height > parseFloat(getComputedStyle(t).lineHeight) * 1.5 * k) out.push(`${i + 1}장: 제목이 두 줄`); });
  return out;
}));
function runCheck() {
  const all = window.slideCheck();
  issuesBySlide = slidesEl().map((_, i) => all.filter((t) => t.startsWith(`${i + 1}장:`)));
  go(cur);
}

// ---------- 글자 고치기 → 덱 파일에 저장 ----------
let editing = false, saveTimer = null;
function setEditable(on) {
  document.body.classList.toggle('editing', on);
  deck.querySelectorAll('[data-eid]').forEach((el) => { if (on) el.contentEditable = 'true'; else el.removeAttribute('contenteditable'); });
}
function setState(t) { const el = $('#save-state'); if (el) el.textContent = t; }
async function save() {
  const html = serialize();
  setState('저장 중…');
  const r = await fetch('/__save', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ path: `slide/${DECK_FILE}`, html }) }).catch(() => null);
  const j = r ? await r.json().catch(() => ({})) : {};
  if (!j.ok) { setState(`저장 실패: ${j.error ?? r?.status ?? '서버 없음'}`); return; }
  sourceText = html;
  watched[DECK_FILE] = html;
  setState('저장됨');
}
deck.addEventListener('input', (e) => {
  const el = e.target.closest('[data-eid]');
  const src = el && source.content.querySelector(`[data-eid="${el.dataset.eid}"]`);
  if (!src) return;
  // 화면에서 넣은 줄바꿈·강조(.hl)만 남기고 원본에 옮긴다
  src.innerHTML = el.innerHTML.replace(/<(?!\/?(br|span|b|strong|small)\b)[^>]*>/gi, '').replace(/&nbsp;/g, ' ');
  setState('고치는 중…');
  clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => { await save(); fitTracks(); runCheck(); drawThumbs(); }, 700);
});
deck.addEventListener('keydown', (e) => { // Enter = 줄바꿈(<br>)
  if (e.key === 'Enter' && e.target.closest('[data-eid]')) { e.preventDefault(); document.execCommand('insertLineBreak'); }
});
deck.addEventListener('paste', (e) => { // 붙여넣기는 글자만
  if (!e.target.closest('[data-eid]')) return;
  e.preventDefault();
  document.execCommand('insertText', false, e.clipboardData.getData('text/plain'));
});
function toggleEdit() {
  editing = !editing;
  const b = $('#edit-toggle');
  b?.classList.toggle('on', editing);
  if (b) b.textContent = editing ? '고치기 끝' : '글자 고치기';
  setEditable(editing);
}
$('#edit-toggle')?.addEventListener('click', toggleEdit);
function toggleGuides() {
  const on = document.body.classList.toggle('guides');
  $('#guide-toggle')?.classList.toggle('on', on);
  store.set('slide.guides', on ? '1' : '');
}
$('#guide-toggle')?.addEventListener('click', toggleGuides);
if (store.get('slide.guides')) toggleGuides();

// ---------- 장 넘기기 · 발표 모드 · 단축키 ----------
$('#prev')?.addEventListener('click', () => go(cur - 1));
$('#next')?.addEventListener('click', () => go(cur + 1));
function present(on) {
  document.body.classList.toggle('presenting', on);
  if (on && editing) toggleEdit();
  if (on) document.documentElement.requestFullscreen?.().catch(() => {});
  else if (document.fullscreenElement) document.exitFullscreen();
  requestAnimationFrame(() => { fitView(); fitTracks(); });
}
$('#present')?.addEventListener('click', () => present(true));
document.addEventListener('fullscreenchange', () => { if (!document.fullscreenElement) present(false); });
deck.addEventListener('click', (e) => { if (document.body.classList.contains('presenting')) go(cur + (e.clientX < innerWidth / 3 ? -1 : 1)); });
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && ['=', '+', '-', '0', '1'].includes(e.key)) { // ⌘ +/−/0/1 = 슬라이드 확대·축소(페이지 확대 대신)
    e.preventDefault();
    if (e.key === '=' || e.key === '+') setZoom(zoom * 1.25); else if (e.key === '-') setZoom(zoom / 1.25); else if (e.key === '0') setZoom(1); else setZoom(1 / fitScale());
    return;
  }
  if (e.target.closest?.('[contenteditable=true], input, select')) return; // 글자 고치는 중엔 단축키 ✗
  if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); go(cur + 1); }
  else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) { e.preventDefault(); go(cur - 1); }
  else if (e.key === 'e' || e.key === 'E') toggleEdit();
  else if (e.key === 'p' || e.key === 'P') present(true);
  else if (e.key === 'g' || e.key === 'G') toggleGuides();
  else if (e.key === 'Escape') present(false);
});

// ---------- 파일이 바뀌면 다시 그림 ----------
const watched = { [DECK_FILE]: null, 'slide.css': null, 'studio.css': null, 'main.js': null, '../kit/pptx.js': null };
async function poll() {
  for (const f of Object.keys(watched)) {
    const t = await fetch(f, { cache: 'no-store' }).then((r) => (r.ok ? r.text() : null)).catch(() => null);
    if (t == null) continue;
    if (watched[f] != null && t !== watched[f]) {
      if (f === DECK_FILE) {
        if (deck.contains(document.activeElement)) continue; // 고치는 중이면 나중에
        sourceText = t; source = readSource(t); render(); setState('파일이 바뀌어 다시 그렸어요');
      } else if (f.endsWith('.css')) {
        const link = [...document.querySelectorAll('link[rel=stylesheet]')].find((l) => l.getAttribute('href').split('?')[0] === f);
        if (link) link.href = `${f}?v=${Date.now()}`;
        setTimeout(() => { fitTracks(); runCheck(); drawThumbs(); }, 400);
      } else { location.reload(); return; }
    }
    watched[f] = t;
  }
}

// ---------- 덱 고르기 · 학원 색 · PPT ----------
async function listDecks() {
  const pick = $('#deck-pick');
  if (!pick) return;
  const names = ['slides'];
  const html = await fetch('examples/', { cache: 'no-store' }).then((r) => r.text()).catch(() => '');
  for (const m of html.matchAll(/href="([\w-]+)\.html"/g)) names.push(`examples/${m[1]}`);
  pick.replaceChildren(...names.map((n) => new Option(n === 'slides' ? '작업 덱 (slides)' : n.replace('examples/', '예시: '), n, false, n === DECK)));
  pick.addEventListener('change', () => { params.set('deck', pick.value); location.search = params.toString(); });
}
const brand = $('#brand');
if (brand) {
  if (/^#[0-9a-f]{6}$/i.test(css('--main'))) brand.value = css('--main');
  brand.addEventListener('input', () => { if (applyBrand(brand.value)) { store.set('slide.brand', brand.value); render(); } });
}

window.slidePptx = async () => (await deckToPptx(slidesEl(), { title: document.title })).pptx.write({ outputType: 'base64' }); // scripts/slide-pptx.mjs용
$('#export-pptx').addEventListener('click', async (e) => {
  const btn = e.currentTarget;
  btn.disabled = true; btn.textContent = 'PPT 만드는 중…';
  const wasEditing = editing;
  if (wasEditing) setEditable(false);
  const hadGuides = document.body.classList.contains('guides');
  document.body.classList.remove('guides'); // 안내선은 PPT에 넣지 않는다
  try { await (await deckToPptx(slidesEl())).pptx.writeFile({ fileName: `${DECK.split('/').pop()}.pptx` }); }
  catch (err) { console.error(err); alert('PPT 내보내기에 실패했어요: ' + err.message); }
  finally { btn.disabled = false; btn.textContent = 'PPT로 내보내기'; if (wasEditing) setEditable(true); if (hadGuides) document.body.classList.add('guides'); }
});

window.addEventListener('resize', () => { fitView(); fitTracks(); });
sourceText = await (await fetch(DECK_FILE, { cache: 'no-store' })).text();
source = readSource(sourceText);
render();
await document.fonts.ready; fitTracks(); runCheck();
listDecks();
for (const f of Object.keys(watched)) watched[f] = await fetch(f, { cache: 'no-store' }).then((r) => (r.ok ? r.text() : null)).catch(() => null);
if (!navigator.webdriver) setInterval(poll, 1000); // 검사·사진 스크립트에서는 확인하지 않는다
