// 걸린 장만 다시 쓰기(2026-10-23) — 홈페이지 흐름을 여기서 흉내 내는 시험 · 확인용. 홈페이지는 slide/plan.js 함수를 그대로 쓴다.
//   node scripts/slide-fix.mjs --deck _test/덱 --out 요청.md          덱을 그려 검사 → 다시 쓰기 요청 글(걸린 장 없으면 '통과')
//   node scripts/slide-fix.mjs --deck _test/덱 --apply 답.html         Claude 답의 장들을 덱에 바꿔 끼움(덱 파일을 고침)
//   node scripts/slide-fix.mjs --deck _test/덱 --shots 폴더           장마다 960×540 사진(폴더/01.png …) — 사진 보고 다듬기(PROMPT-REVIEW.md)에 넣는다
//   node scripts/slide-fix.mjs --deck _test/덱 --review 점검.txt --out 요청.md   사진 점검 답('N장: …' 줄)으로 다시 쓰기 요청 글
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { args, ROOT, startServer, launch } from './kit-lib.mjs';
import { buildFixRequest, parseFixResponse, replaceSections } from '../slide/plan.js';
const a = args();
const file = join(ROOT, 'slide', a.deck + '.html');
const deck = readFileSync(file, 'utf8');
if (a.apply) {
  const map = parseFixResponse(readFileSync(a.apply, 'utf8'));
  writeFileSync(file, replaceSections(deck, map));
  console.log(`바꿔 끼운 장: ${Object.keys(map).join(' · ') || '없음'}`);
  process.exit(0);
}
const { server, url } = await startServer();
const browser = await launch();
try {
  const page = await browser.newPage();
  await page.goto(url(a.deck).replace('/kit/', '/slide/'), { waitUntil: 'networkidle0' });
  await page.evaluate(async () => { await document.fonts.ready; await new Promise((r) => setTimeout(r, 300)); });
  let issues = await page.evaluate(() => window.slideCheck()); // 사진 찍기용 배치 바꾸기 전에 검사
  if (a.shots) {
    const { mkdirSync } = await import('node:fs');
    mkdirSync(a.shots, { recursive: true });
    await page.setViewport({ width: 1100, height: 800 });
    await page.evaluate(() => {
      document.querySelectorAll('.top, .thumbs, .side, .pager').forEach((e) => e.remove());
      document.body.style.cssText = 'height:auto;overflow:visible;display:block';
      document.querySelector('.studio').style.display = 'block';
      const st = document.querySelector('.stage'); st.style.cssText = 'display:block;padding:20px'; st.classList.remove('stage');
      document.querySelector('#viewport').style.cssText = 'display:block;overflow:visible;padding:0';
      const d = document.querySelector('#deck');
      d.style.cssText += ';display:grid;gap:20px;overflow:visible;align-items:start;grid-template-columns:auto';
      d.querySelectorAll('.frame').forEach((f) => { f.classList.add('on'); f.style.boxShadow = 'none'; f.style.borderRadius = '0'; });
      d.style.setProperty('--view', 0.5);
    });
    await new Promise((r) => setTimeout(r, 300));
    const frames = await page.$$('#deck .frame section.slide');
    for (let i = 0; i < frames.length; i++) await frames[i].screenshot({ path: join(a.shots, String(i + 1).padStart(2, '0') + '.png') });
    console.log(`사진 ${frames.length}장 → ${a.shots}`);
  }
  if (a.review) issues = readFileSync(a.review, 'utf8').split('\n').map((t) => t.trim().replace(/^[-*]\s*/, '')).filter((t) => /^\d+장/.test(t));
  const req = buildFixRequest(deck, issues);
  console.log(issues.length ? `검사:\n${issues.map((t) => '  ' + t).join('\n')}` : '검사: 문제 없음');
  if (req && a.out) { writeFileSync(a.out, req); console.log(`→ ${a.out}`); }
  else if (!req) console.log('다시 쓸 장 없음');
} finally { await browser.close(); server.close(); }
