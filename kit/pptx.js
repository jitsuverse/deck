// PPT 내보내기 (시제품 2026-10-18): 화면에 그려진 카드(DOM)를 그대로 재서 편집 가능한 PPTX로 옮긴다.
// 배치는 브라우저(kit.css·fit.js)가 끝낸 결과를 쓴다 — PPT 안에서는 다시 맞추지 않는다.
//   흰 도형·판·선·칩 → PPT 도형(채움·테두리·둥근 모서리·그림자)
//   글자 → 글상자 (브라우저가 끊은 줄 자리 그대로, 굵기·색·자간·줄간격 유지)
//   SVG·사진·아이콘·그라데이션·회전·마스크 → 그 요소만 PNG
//   ::before/::after(절대 위치) → 계산한 자리에 도형
// 단위: 카드 1px = 1/144in (1080×1440px → 7.5×10in), 글자 pt = px × 0.5

import { embedFonts } from './pptx-fonts.js';

const PX_PER_IN = 144;
const inch = (px) => px / PX_PER_IN;
const pt = (px) => px * 0.5;
const px = (v) => parseFloat(v) || 0;
const PPTX_SRC = 'https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js';

let libLoad = null;
const loadLib = () => (libLoad ??= new Promise((ok, no) => {
  if (window.PptxGenJS) return ok();
  const s = document.createElement('script');
  s.src = PPTX_SRC; s.onload = ok; s.onerror = () => no(new Error('PptxGenJS를 불러오지 못했어요'));
  document.head.append(s);
}));

// ---------- 색 ----------
const ctx = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
function color(css) { // → { hex, alpha } · 투명이면 null. color(srgb …)·color-mix 결과도 캔버스로 읽는다
  if (!css || css === 'transparent' || css === 'none') return null;
  let r, g, b, a = 1;
  const m = /^rgba?\(([^)]+)\)$/.exec(css);
  if (m) [r, g, b, a = 1] = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
  else {
    ctx.clearRect(0, 0, 1, 1); ctx.fillStyle = '#0000'; ctx.fillStyle = css; ctx.fillRect(0, 0, 1, 1);
    [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data; a /= 255;
  }
  if (a <= 0.01) return null;
  return { hex: [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase(), alpha: a };
}
const transparency = (alpha) => Math.round((1 - alpha) * 100);

// box-shadow 첫 그림자(inset 제외) → PPT 바깥 그림자
function shadow(css, opacity) {
  if (!css || css === 'none') return null;
  const parts = css.split(/,(?![^(]*\))/).map((s) => s.trim()).filter((s) => !/\binset\b/.test(s));
  if (!parts.length) return null;
  const s = parts[0], col = /^(\w+\([^)]*\)|#\w+|\w+)/.exec(s)?.[0] ?? 'black';
  const [x = 0, y = 0, blur = 0] = s.slice(col.length).trim().split(/\s+/).map(px);
  const c = color(col);
  if (!c || (!x && !y && !blur)) return null;
  return { type: 'outer', color: c.hex, opacity: +(c.alpha * opacity).toFixed(3), blur: pt(blur), offset: pt(Math.hypot(x, y)), angle: Math.round(((Math.atan2(y, x) * 180) / Math.PI + 360) % 360) };
}

// 회전·기울임이 있는 변형인지 (평행 이동·확대만이면 화면 상자로 충분)
// 개별 변형 속성(translate·rotate·scale, 2026-10-18 — 말풍선 꼬리 rotate:45deg, 타이머 손잡이 translate:-50%)도 CSS 순서대로 합친다
function matrix(cs, w = 0, h = 0) {
  let m = new DOMMatrix(), any = false;
  const len = (v, size) => (v.endsWith('%') ? (px(v) / 100) * size : px(v));
  if (cs.translate && cs.translate !== 'none') { const [tx = '0', ty = '0'] = cs.translate.split(' '); m = m.translate(len(tx, w), len(ty, h)); any = true; }
  if (cs.rotate && cs.rotate !== 'none') {
    const a = cs.rotate.split(' ').at(-1), n = px(a);
    m = m.rotate(a.endsWith('turn') ? n * 360 : a.endsWith('rad') && !a.endsWith('grad') ? (n * 180) / Math.PI : n); any = true;
  }
  if (cs.scale && cs.scale !== 'none') { const [sx, sy = sx] = cs.scale.split(' ').map(Number); m = m.scale(sx, sy); any = true; }
  if (cs.transform && cs.transform !== 'none') { m = m.multiply(new DOMMatrix(cs.transform)); any = true; }
  return any ? m : null;
}
const rotated = (m) => m && (Math.abs(m.b) > 1e-3 || Math.abs(m.c) > 1e-3);
const angleOf = (m) => Math.round((Math.atan2(m.b, m.a) * 180) / Math.PI * 10) / 10;

// 글꼴: 첫 이름 + 굵기. 600·500은 따로 설치되는 굵기 이름(Pretendard SemiBold 등), 700 이상은 굵게
function font(cs) {
  const family = cs.fontFamily.split(',')[0].trim().replace(/^["']|["']$/g, '');
  const w = +cs.fontWeight;
  if (w >= 700) return { fontFace: family, bold: true };
  if (w >= 600) return { fontFace: `${family} SemiBold`, bold: false };
  if (w >= 500) return { fontFace: `${family} Medium`, bold: false };
  return { fontFace: family, bold: false };
}

// 통째로 PNG로 넣을 요소: 그림·사진 틀·마스크·필터·회전
function isAtomic(el, cs) {
  if (el instanceof SVGElement || /^(IMG|CANVAS|VIDEO|PICTURE|FIGURE)$/.test(el.tagName)) return true;
  if (el.classList.contains('k-icon') || el.classList.contains('cover-icon')) return true;
  if (cs.clipPath !== 'none' || cs.maskImage !== 'none' || (cs.webkitMaskImage && cs.webkitMaskImage !== 'none')) return true;
  if (cs.filter !== 'none' || cs.mixBlendMode !== 'normal' || cs.webkitBackgroundClip === 'text') return true;
  return rotated(matrix(cs));
}

// ---------- 카드 한 장 ----------
async function convertCard(card, slide, fontEmbedCSS, stats) {
  const cr = card.getBoundingClientRect(), s = cr.width / card.offsetWidth; // 미리보기 축소 비율
  const local = (r) => ({ x: (r.left - cr.left) / s, y: (r.top - cr.top) / s, w: r.width / s, h: r.height / s });
  const pos = (b) => ({ x: inch(b.x), y: inch(b.y), w: inch(Math.max(b.w, 0.5)), h: inch(Math.max(b.h, 0.5)) });
  const inside = (b) => b.w > 0.5 && b.h > 0.5 && b.x < card.offsetWidth && b.y < card.offsetHeight && b.x + b.w > 0 && b.y + b.h > 0;
  const opacityOf = (el) => { let o = 1; for (let e = el; e && e !== card.parentElement; e = e.parentElement) o *= +getComputedStyle(e).opacity; return o; };

  // 요소(또는 own=true면 요소 바탕만, 자식 빼고)를 PNG로 — 회전한 요소는 회전 전 모양으로 찍고 PPT에서 돌린다
  async function image(el, cs, own = false) {
    const m = matrix(cs), rot = rotated(m);
    const b = local(el.getBoundingClientRect());
    const w0 = el.offsetWidth ?? px(cs.width), h0 = el.offsetHeight ?? px(cs.height);
    // 사방 여유(P): 상자 밖으로 나가는 그림자·SVG 선 끝(둥근 끝)이 잘리지 않게
    // 사진 자리(figure.m-photo)는 여유 없이 칸 크기 그대로 — 원장님이 '그림 바꾸기'로 사진을 넣으면 그 상자를 꽉 채우므로, 여유가 있으면 액자 밖으로 넘침(2026-10-23 PPT 편집 점검)
    const photo = el.matches?.('figure.m-photo'), P = own || photo ? 0 : 48;
    const box = { x: b.x + b.w / 2 - w0 / 2 - P, y: b.y + b.h / 2 - h0 / 2 - P, w: w0 + P * 2, h: h0 + P * 2 };
    if (!inside(box)) return;
    const data = await htmlToImage.toPng(el, { // 복제본은 제자리에(절대 위치·여백이 남아 있으면 그림 밖으로 밀려 빈 그림이 된다)
      pixelRatio: 2, fontEmbedCSS, width: box.w, height: box.h, ...(own && { filter: () => false }),
      // width/height 옵션은 복제본 크기까지 바꾸므로 요소 크기는 다시 원래 값으로
      style: { transform: 'none', translate: 'none', rotate: 'none', scale: 'none', position: 'relative', left: 'auto', top: 'auto', right: 'auto', bottom: 'auto', margin: `${P}px`, width: cs.width, height: cs.height, ...(el instanceof SVGSVGElement && { overflow: 'hidden' }) }, // SVG는 화면처럼 자기 상자에서 자른다
    });
    const alt = photo ? `${el.dataset.kind || '사진'} 자리${el.dataset.hint ? ` · ${el.dataset.hint}` : ''} — 그림 바꾸기로 사진을 넣으세요` : undefined; // 선택 창 · 대체 텍스트에서 무슨 사진 자리인지 보이게
    slide.addImage({ data, ...pos(box), ...(rot && { rotate: angleOf(m) }), ...(alt && { altText: alt }) });
    stats.images++;
  }

  // 상자 도형: 채움·테두리·둥근 모서리·그림자
  function box(b, cs, opacity, rotate = 0) {
    const fill = color(cs.backgroundColor);
    const sides = ['Top', 'Right', 'Bottom', 'Left'].map((k) => ({ w: cs[`border${k}Style`] === 'none' ? 0 : px(cs[`border${k}Width`]), c: color(cs[`border${k}Color`]) }));
    const uniform = sides.every((d) => d.w === sides[0].w && d.c?.hex === sides[0].c?.hex) && sides[0].w > 0 && sides[0].c;
    const sh = shadow(cs.boxShadow, opacity);
    if ((!fill && !sides.some((d) => d.w && d.c) && !sh) || !inside(b)) return;
    const rad = cs.borderTopLeftRadius.endsWith('%') ? (px(cs.borderTopLeftRadius) / 100) * Math.min(b.w, b.h) : px(cs.borderTopLeftRadius);
    const half = Math.min(b.w, b.h) / 2;
    const shape = rad >= half - 0.5 ? (Math.abs(b.w - b.h) < 1 ? 'ellipse' : 'roundRect') : rad > 0 ? 'roundRect' : 'rect';
    const inset = uniform ? sides[0].w / 2 : 0; // CSS 테두리는 상자 안쪽, PPT 선은 가장자리 가운데 → 반만큼 안으로
    const r = { x: b.x + inset, y: b.y + inset, w: b.w - inset * 2, h: b.h - inset * 2 };
    slide.addShape(shape, {
      ...pos(r),
      fill: fill ? { color: fill.hex, transparency: transparency(fill.alpha * opacity) } : { type: 'none' },
      line: uniform ? { color: sides[0].c.hex, width: pt(sides[0].w), transparency: transparency(sides[0].c.alpha * opacity), ...(cs.borderTopStyle === 'dashed' && { dashType: 'dash' }), ...(cs.borderTopStyle === 'dotted' && { dashType: 'sysDot' }) } : { type: 'none' },
      ...(shape === 'roundRect' && { rectRadius: inch(Math.min(rad, half) - inset) }),
      ...(sh && { shadow: sh }),
      ...(rotate && { rotate }),
    });
    stats.shapes++;
    if (!uniform) sides.forEach((d, k) => { // 한쪽만 있는 선(줄 목록 위·아래 선 등)은 얇은 사각형
      if (!d.w || !d.c) return;
      const line = [{ x: b.x, y: b.y, w: b.w, h: d.w }, { x: b.x + b.w - d.w, y: b.y, w: d.w, h: b.h }, { x: b.x, y: b.y + b.h - d.w, w: b.w, h: d.w }, { x: b.x, y: b.y, w: d.w, h: b.h }][k];
      slide.addShape('rect', { ...pos(line), fill: { color: d.c.hex, transparency: transparency(d.c.alpha * opacity) }, line: { type: 'none' } });
      stats.shapes++;
    });
  }

  // 절대 위치 가상 요소(::before/::after): 담는 블록 안쪽 여백 상자 + left/top으로 자리를 계산
  async function pseudo(el, which) {
    const ps = getComputedStyle(el, which);
    if (ps.content === 'none' || ps.content === 'normal' || ps.display === 'none' || ps.visibility === 'hidden') return;
    if (ps.position !== 'absolute' && ps.position !== 'fixed') { stats.skipped.add(`${el.className}${which} (흐름 안)`); return; }
    let cb = el;
    while (cb !== card && getComputedStyle(cb).position === 'static') cb = cb.parentElement;
    const cbs = getComputedStyle(cb), c = local(cb.getBoundingClientRect());
    const pw = cb.clientWidth, ph = cb.clientHeight;
    const extra = (a, b2) => (ps.boxSizing === 'border-box' ? 0 : px(ps[`padding${a}`]) + px(ps[`padding${b2}`]) + px(ps[`border${a}Width`]) + px(ps[`border${b2}Width`]));
    const w = px(ps.width) + extra('Left', 'Right'), h = px(ps.height) + extra('Top', 'Bottom');
    const x = ps.left !== 'auto' ? px(ps.left) + px(ps.marginLeft) : pw - px(ps.right) - w - px(ps.marginRight);
    const y = ps.top !== 'auto' ? px(ps.top) + px(ps.marginTop) : ph - px(ps.bottom) - h - px(ps.marginBottom);
    let b = { x: c.x + px(cbs.borderLeftWidth) + x, y: c.y + px(cbs.borderTopWidth) + y, w, h };
    const m = matrix(ps, w, h);
    let rotate = 0;
    if (m) { // 변형: 상자 가운데가 옮겨 간 자리 + 회전
      const [ox, oy] = ps.transformOrigin.split(' ').map(px);
      const cx = w / 2 - ox, cy = h / 2 - oy;
      const nx = ox + m.a * cx + m.c * cy + m.e, ny = oy + m.b * cx + m.d * cy + m.f;
      const sc = Math.hypot(m.a, m.b);
      b = { x: b.x + nx - (w * sc) / 2, y: b.y + ny - (h * Math.hypot(m.c, m.d)) / 2, w: w * sc, h: h * Math.hypot(m.c, m.d) };
      rotate = rotated(m) ? angleOf(m) : 0;
    }
    if (!inside(b)) return;
    const opacity = opacityOf(el) * +ps.opacity;
    if (ps.backgroundImage !== 'none') { // 그라데이션 가상 요소: 같은 모양의 임시 요소를 만들어 찍는다
      const host = Object.assign(document.createElement('div'), { style: 'position:fixed;left:-99999px;top:0' });
      const tmp = document.createElement('span');
      for (const p of ps) tmp.style.setProperty(p, ps.getPropertyValue(p));
      Object.assign(tmp.style, { position: 'relative', left: '0', top: '0', margin: '0', transform: 'none', translate: 'none', rotate: 'none', scale: 'none', opacity: '1', display: 'block' });
      host.append(tmp); document.body.append(host);
      try {
        const data = await htmlToImage.toPng(tmp, { pixelRatio: 2, skipFonts: true });
        slide.addImage({ data, ...pos(b), ...(rotate && { rotate }), ...(opacity < 1 && { transparency: transparency(opacity) }) });
        stats.images++;
      } finally { host.remove(); }
    } else box(b, ps, opacity, rotate);
    const txt = /^"(.*)"$/s.exec(ps.content)?.[1].replace(/\\([0-9a-fA-F]{1,6})\s?/g, (_, h2) => String.fromCodePoint(parseInt(h2, 16))).replace(/\\(.)/g, '$1');
    if (txt?.trim()) {
      const col = color(ps.color);
      slide.addText(txt, { ...pos(b), margin: 0, align: ps.textAlign === 'center' ? 'center' : 'left', valign: 'middle', fontSize: pt(px(ps.fontSize)), ...font(ps), color: col?.hex, charSpacing: pt(px(ps.letterSpacing)) || undefined, wrap: false, fit: 'resize' });
      stats.texts++;
    }
  }

  // 글자 묶음(이어진 글자·인라인 요소) → 글상자 하나. 글자마다 자리를 재서 브라우저 줄바꿈을 그대로 옮긴다
  function text(nodes, block) {
    const chars = [];
    const range = document.createRange();
    const visit = (n) => {
      if (n.nodeType === 3) {
        const t = n.textContent;
        for (let i = 0; i < t.length;) {
          const len = t.codePointAt(i) > 0xffff ? 2 : 1;
          range.setStart(n, i); range.setEnd(n, i + len);
          const r = range.getClientRects()[0];
          if (r && r.width > 0) chars.push({ ch: t.slice(i, i + len), el: n.parentElement, b: local(r) });
          i += len;
        }
      } else if (n.nodeType === 1) {
        const cs = getComputedStyle(n);
        if (cs.display === 'none' || cs.visibility === 'hidden') return;
        if (n.tagName === 'BR') { chars.push({ br: true }); return; }
        const bg = color(cs.backgroundColor); // 인라인 강조(형광펜·밑줄 칩): 줄마다 바탕 도형
        if (bg || px(cs.borderBottomWidth)) [...n.getClientRects()].forEach((r) => box(local(r), cs, opacityOf(n)));
        n.childNodes.forEach(visit);
      }
    };
    nodes.forEach(visit);
    const shown = chars.filter((c) => !c.br && inside(c.b));
    if (!shown.some((c) => c.ch.trim())) return;

    // 줄 나누기: 글자 윗변이 지금 줄 아랫변에서 글자 높이 절반 위보다 더 내려가면 새 줄 (또는 <br>)
    // 윗변끼리 견주면 큰 숫자 옆 작은 단위(18<small>개월</small>)가 새 줄로 떨어져 숫자 위에 겹친다
    const lines = [[]];
    let bottom = null;
    for (const c of chars) {
      if (c.br) { lines.push([]); bottom = null; continue; }
      if (!inside(c.b)) continue;
      if (bottom != null && c.b.y > bottom - c.b.h * 0.5) { lines.push([]); bottom = null; }
      bottom = Math.max(bottom ?? -Infinity, c.b.y + c.b.h);
      lines.at(-1).push(c);
    }
    const used = lines.map((l) => { // 줄 끝 공백 빼기
      while (l.length && !l[0].ch.trim()) l.shift();
      while (l.length && !l.at(-1).ch.trim()) l.pop();
      return l;
    }).filter((l, k, all) => l.length || (k > 0 && k < all.length - 1));

    const all = used.flat();
    const bcs = getComputedStyle(block);
    const fsMax = Math.max(...all.map((c) => px(getComputedStyle(c.el).fontSize)));
    const tops = used.filter((l) => l.length).map((l) => Math.min(...l.map((c) => c.b.y + c.b.h / 2)));
    const lh = bcs.lineHeight === 'normal' ? fsMax * 1.2 : px(bcs.lineHeight);
    const pitch = tops.length > 1 ? (tops.at(-1) - tops[0]) / (tops.length - 1) : Math.max(lh, fsMax);
    const left = Math.min(...all.map((c) => c.b.x)), right = Math.max(...all.map((c) => c.b.x + c.b.w));
    const align = /center/.test(bcs.textAlign) ? 'center' : /right|end/.test(bcs.textAlign) ? 'right' : 'left';
    const slack = (right - left) * 0.06 + fsMax * 0.6; // 글꼴 폭 차이로 PPT가 한 번 더 줄을 바꾸지 않게
    const x = align === 'center' ? left - slack / 2 : align === 'right' ? left - slack : left;
    const y = tops[0] - pitch / 2;

    const runs = [];
    used.forEach((l, k) => {
      let cur = null;
      for (const c of l) {
        if (cur && cur.el === c.el) { cur.text += c.ch; continue; }
        cur = { el: c.el, text: c.ch };
        runs.push(cur);
      }
      if (!l.length) runs.push(cur = { el: block, text: '' });
      if (k < used.length - 1) cur.breakLine = true;
    });
    slide.addText(runs.map(({ el, text: t, breakLine }) => {
      const cs = getComputedStyle(el), col = color(cs.color), op = opacityOf(el);
      const deco = cs.textDecorationLine;
      return { text: t, options: {
        fontSize: pt(px(cs.fontSize)), ...font(cs),
        ...(col && { color: col.hex, ...(col.alpha * op < 1 && { transparency: transparency(col.alpha * op) }) }),
        ...(px(cs.letterSpacing) && { charSpacing: pt(px(cs.letterSpacing)) }),
        ...(/line-through/.test(deco) && { strike: 'sngStrike' }),
        ...(/underline/.test(deco) && { underline: { style: 'sng' } }),
        lineSpacing: pt(pitch), breakLine,
      } };
    }), { x: inch(x), y: inch(y), w: inch(right - left + slack), h: inch(pitch * used.length), margin: 0, valign: 'top', align, paraSpaceBefore: 0, paraSpaceAfter: 0, fit: 'resize', wrap: false }); // 줄은 화면대로 직접 끊어 넣었으니 PPT 자동 줄바꿈은 끄고(wrap none), 글 길이에 맞춰 상자도 늘어나게(spAutoFit) — 원장님이 글을 고쳐 길어져도 한 줄로 이어지고 상자가 따라옴(2026-10-23 디자이너)
    stats.texts++;
  }

  async function walk(el) {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || +cs.opacity === 0) return;
    const b = local(el.getBoundingClientRect());
    const opacity = opacityOf(el);
    if (el !== card && isAtomic(el, cs)) { await image(el, cs); return; }
    const behind = (w) => +getComputedStyle(el, w).zIndex < 0; // z-index 음수 가상 요소(타이머 손잡이 등)는 요소 바탕보다 먼저
    if (cs.visibility !== 'hidden') {
      for (const w of ['::before', '::after']) if (behind(w)) await pseudo(el, w);
      if (cs.backgroundImage !== 'none') await image(el, cs, true); // 그라데이션·배경 그림: 바탕만 PNG, 글자·자식은 따로
      else if (el !== card) box(b, cs, opacity);
      if (!behind('::before')) await pseudo(el, '::before');
    }
    let group = [];
    const flush = () => { if (group.length) text(group, el); group = []; };
    for (const n of el.childNodes) {
      if (n.nodeType === 3) { if (n.textContent.trim() || group.length) group.push(n); continue; }
      if (n.nodeType !== 1) continue;
      const ncs = getComputedStyle(n);
      const inline = n.tagName === 'BR' || (ncs.display === 'inline' && !isAtomic(n, ncs) && ![...n.querySelectorAll('*')].some((d) => getComputedStyle(d).display !== 'inline' && d.tagName !== 'BR'));
      if (inline) group.push(n);
      else { flush(); await walk(n); }
    }
    flush();
    if (cs.visibility !== 'hidden' && !behind('::after')) await pseudo(el, '::after');
  }

  const bg = color(getComputedStyle(card).backgroundColor);
  if (bg) slide.background = { color: bg.hex };
  await walk(card);
}

// 카드 묶음 → PptxGenJS 문서 (writeFile / write로 저장)
export async function deckToPptx(cards, { title = '카드뉴스' } = {}) {
  await loadLib();
  await document.fonts.ready;
  const pptx = new window.PptxGenJS();
  const w = cards[0].offsetWidth, h = cards[0].offsetHeight;
  pptx.defineLayout({ name: 'CARD', width: inch(w), height: inch(h) });
  pptx.layout = 'CARD';
  pptx.title = title;
  const fontEmbedCSS = await htmlToImage.getFontEmbedCSS(cards[0]);
  const stats = { shapes: 0, texts: 0, images: 0, skipped: new Set() };
  for (const card of cards) {
    const slide = pptx.addSlide();
    await convertCard(card, slide, fontEmbedCSS, stats);
    // 발표자 노트(설명회 덱의 aside.s-notes — 원장님이 그 장에서 할 말, 2026-10-23 홈페이지 5단계 연결)
    const notes = card.querySelector?.('.s-notes')?.innerText?.trim() || card.querySelector?.('.s-notes')?.textContent?.trim();
    if (notes) slide.addNotes(notes);
  }
  console.info('[pptx]', cards.length, '장', JSON.stringify({ ...stats, skipped: [...stats.skipped] }));
  // 저장할 때 Pretendard를 넣는다(kit/pptx-fonts.js) — write·writeFile을 그대로 부르는 쪽(스튜디오·스크립트·카드뉴스)이 고칠 것 없게 감싼다
  const write = pptx.write.bind(pptx);
  pptx.write = async ({ outputType = 'blob' } = {}) => embedFonts(await write({ outputType: 'arraybuffer' }), outputType === 'STREAM' ? 'nodebuffer' : outputType);
  pptx.writeFile = async ({ fileName = 'Presentation.pptx' } = {}) => {
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(await pptx.write({ outputType: 'blob' })), download: /\.pptx$/i.test(fileName) ? fileName : `${fileName}.pptx` });
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 30000);
    return fileName;
  };
  return { pptx, stats };
}
