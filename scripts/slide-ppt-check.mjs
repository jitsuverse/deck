// 내보낸 PPTX를 Microsoft PowerPoint로 열어 PDF로 저장 → 장마다 그림 → 시트 한 장 (키노트 ✗, 2026-10-20 사용자)
// 파워포인트에 사용자 파일이 열려 있으면 실행하지 않는다(그 파일을 닫아 버린 사고가 있었음)
// node scripts/slide-ppt-check.mjs [--deck slides] [--brand '#E03E3E'] [--dpi 48] --sheet 시트.png
// 필요: Microsoft PowerPoint · pdftoppm(brew poppler) · python3 PIL
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { args } from './kit-lib.mjs';

const a = args();
const deck = a.deck ?? 'slides'; // 기본 = 작업 덱(새로 만든 덱이 늘 여기, 2026-10-21 디자이너)
const sheet = a.sheet ?? 'ppt-check.png';
// PowerPoint는 샌드박스라 /tmp 대신 문서 폴더 안 임시 폴더를 쓴다
const dir = mkdtempSync(join(homedir(), 'Documents', 'slide-ppt-check-'));
try {
  const pptx = join(dir, 'deck.pptx'), pdf = join(dir, 'deck.pdf');
  execFileSync('node', ['scripts/slide-pptx.mjs', '--deck', deck, '--out', pptx, ...(a.brand ? ['--brand', a.brand] : [])], { stdio: 'inherit' });
  // ⚠️ 2026-10-20 사고: 'active presentation'을 저장 없이 닫다가 사용자가 작업 중이던 파일을 날렸다.
  // 그래서 ① 파워포인트에 열린 프레젠테이션이 하나라도 있으면 아예 손대지 않고 멈추고,
  // ② 우리가 연 파일만 이름으로 집어서 닫는다(active presentation ✗, quit ✗).
  const open = +execFileSync('osascript', ['-e', 'if application "Microsoft PowerPoint" is running then\ntell application "Microsoft PowerPoint" to return count of presentations\nelse\nreturn 0\nend if']).toString().trim();
  if (open > 0) throw new Error(`파워포인트에 열린 파일이 ${open}개 있어요 — 작업을 지키려고 확인을 멈췄어요. 파워포인트 파일을 모두 닫은 뒤 다시 실행하세요.`);
  const name = 'deck.pptx';
  const n = +execFileSync('osascript', ['-e', `tell application "Microsoft PowerPoint"
open POSIX file "${pptx}"
set prev to -1
repeat 40 times
  delay 1
  try
    set n to count of slides of presentation "${name}"
    if n > 0 and n = prev then exit repeat
    set prev to n
  end try
end repeat
save presentation "${name}" in POSIX file "${pdf}" as save as PDF
delay 2
close presentation "${name}" saving no
return prev
end tell`]).toString().trim();
  // PDF 저장은 PowerPoint가 뒤에서 마저 쓴다 — 쪽수가 장 수와 같아질 때까지 기다린다(바로 읽으면 앞 9장만 나왔음)
  const pagesOf = () => { try { return +/Pages:\s+(\d+)/.exec(execFileSync('pdfinfo', [pdf]).toString())[1]; } catch { return 0; } };
  for (let t = 0; t < 60 && pagesOf() < n; t++) execFileSync('sleep', ['1']);
  execFileSync('pdftoppm', ['-r', String(a.dpi ?? 48), '-png', pdf, join(dir, 'p')]);
  const pages = readdirSync(dir).filter((f) => /^p-\d+\.png$/.test(f)).sort().map((f) => join(dir, f));
  execFileSync('python3', ['-c', `
import sys
from PIL import Image
fs = sys.argv[2:]; ims = [Image.open(f) for f in fs]
w, h = ims[0].size; c = 3
s = Image.new('RGB', (w*c + 20*(c-1), (h+20)*((len(ims)+c-1)//c)), (40, 40, 48))
for i, im in enumerate(ims): s.paste(im, ((i % c)*(w+20), (i//c)*(h+20)))
s.save(sys.argv[1])`, sheet, ...pages]);
  console.log(`파워포인트로 연 ${pages.length}장 → ${sheet}`);
} finally {
  rmSync(dir, { recursive: true, force: true });
}
