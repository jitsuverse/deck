// 설명회 슬라이드 사진·시트 + 넘침 검사 (slide/ 키트)
// node scripts/slide-shot.mjs [--deck slides] [--ids 1,4] [--scale 0.3] [--cols 3] [--brand '#0E9F6E'] [--weights 1] --sheet 시트.png
import { args, startServer, launch } from './kit-lib.mjs';

const a = args();
const deck = a.deck ?? 'slides'; // 기본 = 작업 덱(새로 만든 덱이 늘 여기, 2026-10-21 디자이너)
const scale = Number(a.scale ?? 0.3);
const cols = Number(a.cols ?? 3);
const ids = a.ids ? String(a.ids).split(',').map(Number) : null;
// 눈에 보이는 무게 검사(2026-10-22 디자이너 '도식이 밑으로 치우침' — 상자 경계로는 가운데인데 글 · 선이 한쪽에 몰려 치우쳐 보였음):
// 장마다 사진을 찍어 머리 아래 본문 영역의 픽셀마다 '바탕과 다른 정도'(120에서 자름 — 진한 글 · 메인 면 1, 흰 도형 0.3, 그림자 0.15쯤)를 무게로 더해
// 무게 중심이 영역 가운데(시각 보정 12px 위)에서 세로 WEIGHT_Y px 넘게 벗어난 장을 '눈으로 확인할 장'으로 따로 알린다 — 실패가 아니라 후보(데이터 모양 · 강조 면 때문일 수도 있음).
const WEIGHT_Y = 30, WEIGHT_SCALE = 0.25;
// 바닥선에서 자라는 그래프 · 값만큼 채우는 그림은 무게가 아래 · 위로 쏠리는 게 내용이라 뺀다(확정 덱 기준 맞춤)
const WEIGHT_SKIP = '.m-bars, .s-bars, .m-podium, .m-line, .m-climb, .m-stack, .m-drop, .m-waffle, .s-dotgrid, .m-hbars, .m-rise';
async function weightCheck(browser, href) {
  const p = await browser.newPage();
  try {
    await p.setViewport({ width: Math.ceil(1920 * WEIGHT_SCALE) + 64, height: 800 });
    await p.goto(href, { waitUntil: 'networkidle0' });
    await p.evaluate(async () => { await document.fonts.ready; await new Promise((r) => setTimeout(r, 300)); });
    const info = await p.evaluate((scale, skipSel) => {
      document.querySelectorAll('.top, .thumbs, .side, .pager').forEach((e) => e.remove());
      document.body.style.cssText = 'height:auto;overflow:visible;display:block;background:#2A2C33';
      document.querySelector('.studio').style.display = 'block';
      const st = document.querySelector('.stage'); st.style.cssText = 'display:block;padding:32px'; st.classList.remove('stage');
      document.querySelector('#viewport').style.cssText = 'display:block;overflow:visible;padding:0';
      const d = document.querySelector('#deck');
      d.style.cssText += ';display:grid;gap:32px;overflow:visible;align-items:start;grid-template-columns:auto';
      d.querySelectorAll('.frame').forEach((f) => { f.classList.add('on'); f.style.boxShadow = 'none'; f.style.borderRadius = '0'; });
      d.style.setProperty('--view', scale);
      // 잴 장: 표지 · 장 표지 · 마감 · 견본 · 인용 · 대화(글 길이만큼 놓이는 장)는 뺀다
      return [...d.querySelectorAll(':scope > .frame')].map((f) => { const s = f.querySelector('section.slide'), h = s?.querySelector('.s-head'), body = s?.querySelector('.s-body');
        const skip = !s || !h || !body || s.matches('.s-cover, .s-section, .s-ref') || body.querySelector('.s-cta, .s-quote, .s-dialog') || body.querySelector(skipSel);
        if (skip) return { skip: true };
        const sr = s.getBoundingClientRect(), k = sr.width / 1920;
        return { skip, top: (h.getBoundingClientRect().bottom - sr.top) / k }; });
    }, WEIGHT_SCALE, WEIGHT_SKIP);
    const frames = await p.$$('#deck .frame section.slide');
    const out = [];
    for (let i = 0; i < frames.length; i++) {
      if (info[i].skip) continue;
      const b64 = await frames[i].screenshot({ encoding: 'base64' });
      if (a.wdump) (await import('node:fs')).writeFileSync(`${a.wdump}-${i + 1}.png`, Buffer.from(b64, 'base64'));
      const r = await p.evaluate(async (b64, top) => {
        const img = new Image(); img.src = `data:image/png;base64,${b64}`; await img.decode();
        const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const g = c.getContext('2d'); g.drawImage(img, 0, 0);
        const k = img.width / 1920, y0 = Math.ceil(top * k), { data } = g.getImageData(0, 0, img.width, img.height);
        let W = 0, sy = 0, sx = 0;
        for (let y = y0; y < img.height; y++) for (let x = 0; x < img.width; x++) { const o = (y * img.width + x) * 4; let w = Math.abs(data[o] - 244) + Math.abs(data[o + 1] - 244) + Math.abs(data[o + 2] - 244); if (w < 9) continue; w = Math.min(w, 120); W += w; sy += w * y; sx += w * x; }
        return W ? { cy: sy / W / k, cx: sx / W / k } : null;
      }, b64, info[i].top);
      if (!r) continue;
      const dy = r.cy - ((info[i].top + 1080) / 2 - 12);
      if (Math.abs(dy) > WEIGHT_Y) out.push(`${i + 1}장 ${dy > 0 ? '아래' : '위'}로 ${Math.round(Math.abs(dy))}px`);
      if (a.weights) console.log(`  [무게] ${i + 1}장 세로 ${Math.round(dy)}`);
    }
    return out;
  } finally { await p.close(); }
}

const { server, url } = await startServer();
const browser = await launch();
try {
  const page = await browser.newPage();
  page.on('console', (m) => { if (m.type() === 'error') console.log(m.text()); });
  await page.setViewport({ width: Math.ceil(1920 * scale * cols + 32 * (cols + 1)), height: 1000 });
  const q = new URL(url(deck).replace('/kit/', '/slide/'));
  if (a.brand) q.searchParams.set('brand', a.brand);
  await page.goto(q.href, { waitUntil: 'networkidle0' });
  await page.evaluate(async () => { await document.fonts.ready; await new Promise((r) => setTimeout(r, 300)); });
  const issues = await page.evaluate(() => window.slideCheck());
  const heavy = a.weights ? await weightCheck(browser, q.href).catch((e) => [`무게 검사 실패: ${e.message}`]) : []; // 눈 확인 보조 — --weights 줄 때만(자동 판정은 확정 덱과 어긋나서, 2026-10-22)
  console.log(issues.length ? `검사:\n  ${issues.join('\n  ')}` : '검사: 문제 없음');
  if (heavy.length) console.log(`눈으로 확인할 장(무게 중심 치우침 ${WEIGHT_Y}px 넘음 — 크게 찍어 보고 정말 치우쳤으면 고치기): ${heavy.join(' · ')}`);
  if (a.sheet) {
    await page.evaluate((scale, cols, ids) => {
      document.querySelectorAll('.top, .thumbs, .side, .pager').forEach((e) => e.remove());
      document.body.style.cssText = 'height:auto;overflow:visible;display:block;background:#2A2C33';
      document.querySelector('.studio').style.display = 'block';
      const st = document.querySelector('.stage'); st.style.cssText = 'display:block;padding:32px'; st.classList.remove('stage'); // 창 크기 맞춤(fitView) 끄기
      document.querySelector('#viewport').style.cssText = 'display:block;overflow:visible;padding:0';
      const d = document.querySelector('#deck');
      d.style.cssText += ';display:grid;gap:32px;overflow:visible;align-items:start';
      d.querySelectorAll('.frame').forEach((f) => f.classList.add('on'));
      d.style.setProperty('--view', scale);
      d.style.gridTemplateColumns = `repeat(${cols}, auto)`;
      if (ids) [...d.children].forEach((f, i) => { if (!ids.includes(i + 1)) f.remove(); });
    }, scale, cols, ids);
    await page.screenshot({ path: a.sheet, fullPage: true });
    console.log(`→ ${a.sheet}`);
  }
} finally {
  await browser.close();
  server.close();
  process.exit(0);
}
