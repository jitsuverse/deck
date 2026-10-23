// 16:9 슬라이드 덱을 편집 가능한 PPTX로 내보낸다 (slide/ 키트 + kit/pptx.js)
// node scripts/slide-pptx.mjs [--deck slides] [--brand '#E03E3E'] [--out 파일.pptx] [--shot 미리보기.png]
import { writeFileSync } from 'node:fs';
import { args, startServer, launch } from './kit-lib.mjs';

const a = args();
const deck = a.deck ?? 'slides';
const out = a.out ?? `${deck.split('/').pop()}.pptx`;
const { server, url } = await startServer();
const browser = await launch();
try {
  const page = await browser.newPage();
  page.on('console', (m) => { if (m.text().startsWith('[pptx]') || m.type() === 'error') console.log(m.text()); });
  await page.setViewport({ width: 2000, height: 1200 });
  const u = new URL(url(deck).replace('/kit/', '/slide/')); if (a.brand) u.searchParams.set('brand', a.brand); // 학원 메인 컬러로 내보내기(2026-10-22)
  await page.goto(u.href, { waitUntil: 'networkidle0' });
  await page.evaluate(async () => { await document.fonts.ready; await new Promise((r) => setTimeout(r, 300)); });
  const issues = await page.evaluate(() => window.slideCheck());
  console.log(issues.length ? `넘침:\n  ${issues.join('\n  ')}` : '넘침: 없음');
  if (a.shot) { // 원본(브라우저) 미리보기 — 0.5배로 세로로 이어 찍는다
    await page.screenshot({ path: a.shot, fullPage: true });
    console.log(`→ ${a.shot}`);
  }
  const b64 = await page.evaluate(() => window.slidePptx());
  writeFileSync(out, Buffer.from(b64, 'base64'));
  console.log(`→ ${out}`);
} finally {
  await browser.close();
  server.close();
}
