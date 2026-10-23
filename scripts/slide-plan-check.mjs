// 장 구성표 검사(2026-10-23): node scripts/slide-plan-check.mjs --plan 구성표.json --request 요청.txt [--beats b0,b1,… --target 14]
// 홈페이지는 같은 함수(slide/plan.js checkPlan)를 그대로 쓴다 — 이 스크립트는 시험 · 확인용
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { args, ROOT } from './kit-lib.mjs';
import { checkPlan } from '../slide/plan.js';
const a = args();
const plan = JSON.parse(readFileSync(a.plan, 'utf8').replace(/^[^{]*/, '').replace(/[^}]*$/, ''));
const parts = JSON.parse(readFileSync(join(ROOT, 'slide/parts.json'), 'utf8'));
const issues = checkPlan(plan, readFileSync(a.request, 'utf8'), parts, { beats: a.beats ? String(a.beats).split(',') : null, target: a.target });
console.log(issues.length ? `구성표 검사:\n${issues.map((t) => '  ' + t).join('\n')}` : '구성표 검사: 문제 없음');
process.exit(issues.length ? 1 : 0);
