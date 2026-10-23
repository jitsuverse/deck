// PPTX에 Pretendard 넣기 (2026-10-23): 원장님 PC에 Pretendard가 없어도 글자 모양·폭이 그대로 나오게.
// PptxGenJS는 글꼴 넣기를 못 해서, 다 만든 PPTX(zip)를 열어 파워포인트가 쓰는 형식으로 더한다.
//   ppt/fonts/fontN.fntdata  = EOT(압축·XOR 없음 — 파워포인트가 직접 넣을 때와 같은 형식) 안에 TTF
//   presentation.xml         = embedTrueTypeFonts="1" + <p:embeddedFontLst>(typeface별 regular/bold)
//   presentation.xml.rels · [Content_Types].xml = 글꼴 관계 · application/x-fontdata
// 글꼴은 하위 집합: 덱에 쓴 글자 + 자주 쓰는 한글 2,350자(KS X 1001) + 라틴·문장부호·기호 — 원장님이 글을 고쳐도
// 거의 모든 글자가 그대로 나오고, 한 굵기 2.7MB → 약 0.25MB(압축 뒤). 하위 집합은 브라우저에서 harfbuzz(wasm)로.
// 글꼴을 못 받으면(오프라인 등) 넣지 않고 그냥 내보낸다 — 내보내기 자체는 실패하지 않는다.

const TTF = 'https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/public/static/alternative/'; // OFL — 문서에 넣어도 됨
const HB_SUBSET = 'https://cdn.jsdelivr.net/npm/harfbuzzjs@0.4.7/hb-subset.wasm';
// kit/pptx.js fontOf가 쓰는 typeface → 파일 (Bold는 typeface 'Pretendard' + 굵게)
const FACES = {
  'Pretendard': { regular: 'Pretendard-Regular.ttf', bold: 'Pretendard-Bold.ttf' },
  'Pretendard Medium': { regular: 'Pretendard-Medium.ttf' },
  'Pretendard SemiBold': { regular: 'Pretendard-SemiBold.ttf' },
};
const BASE = [[0x20, 0xff], [0x2000, 0x206f], [0x2190, 0x21ff], [0x2460, 0x24ff], [0x25a0, 0x25ff], [0x2600, 0x26ff],
  [0x3000, 0x303f], [0x3130, 0x318f], [0xff01, 0xff5e]];
let common = null; // KS X 1001 한글 2,350자 (EUC-KR B0A1 ~ C8FE)
const commonHangul = () => common ??= new TextDecoder('euc-kr').decode(
  Uint8Array.from({ length: 25 * 94 * 2 }, (_, i) => (i % 2 ? 0xa1 + ((i >> 1) % 94) : 0xb0 + Math.floor((i >> 1) / 94)))).replace(/[^가-힣]/g, '');

let hbLoad = null;
const harfbuzz = () => (hbLoad ??= fetch(HB_SUBSET).then((r) => r.arrayBuffer()).then((b) => WebAssembly.instantiate(b)).then((m) => m.instance.exports));
const fontCache = new Map();
const fetchFont = (file) => {
  if (!fontCache.has(file)) fontCache.set(file, fetch(TTF + file).then((r) => { if (!r.ok) throw new Error(`${file} ${r.status}`); return r.arrayBuffer(); }));
  return fontCache.get(file);
};

// TTF + 코드포인트 → 하위 집합 TTF (harfbuzz hb-subset)
function subset(hb, ttf, codes) {
  const font = hb.malloc(ttf.byteLength);
  new Uint8Array(hb.memory.buffer).set(new Uint8Array(ttf), font);
  const blob = hb.hb_blob_create(font, ttf.byteLength, 2, 0, 0);
  const face = hb.hb_face_create(blob, 0);
  hb.hb_blob_destroy(blob);
  const input = hb.hb_subset_input_create_or_fail();
  const set = hb.hb_subset_input_unicode_set(input);
  for (const c of codes) hb.hb_set_add(set, c);
  const sub = hb.hb_subset_or_fail(face, input);
  hb.hb_subset_input_destroy(input);
  const out = hb.hb_face_reference_blob(sub);
  const at = hb.hb_blob_get_data(out, 0), len = hb.hb_blob_get_length(out);
  const bytes = new Uint8Array(hb.memory.buffer).slice(at, at + len); // 메모리가 늘었을 수 있어 새로 읽는다
  hb.hb_blob_destroy(out); hb.hb_face_destroy(sub); hb.hb_face_destroy(face); hb.free(font);
  if (!len) throw new Error('하위 집합을 만들지 못했어요');
  return bytes;
}

// TTF → EOT 2.1 (머리 + 글꼴 그대로). 머리 값은 TTF의 OS/2·head·name에서
function toEot(ttf) {
  const v = new DataView(ttf.buffer, ttf.byteOffset, ttf.byteLength);
  const tables = {};
  for (let i = 0, n = v.getUint16(4); i < n; i++) tables[String.fromCharCode(...ttf.subarray(12 + i * 16, 16 + i * 16))] = v.getUint32(20 + i * 16);
  const os2 = tables['OS/2'], head = tables.head, name = tables.name;
  const names = {};
  for (let i = 0, n = v.getUint16(name + 2), str = name + v.getUint16(name + 4); i < n; i++) {
    const r = name + 6 + i * 12;
    if (v.getUint16(r) !== 3 || v.getUint16(r + 4) !== 0x409) continue; // 윈도우 · 영어 이름
    const id = v.getUint16(r + 6), len = v.getUint16(r + 8), off = str + v.getUint16(r + 10);
    names[id] = ttf.slice(off, off + len); // UTF-16BE
  }
  const le = (b) => { const o = b.slice(); for (let i = 0; i < o.length; i += 2) [o[i], o[i + 1]] = [o[i + 1], o[i]]; return o; }; // → UTF-16LE
  const strs = [1, 2, 5, 4].map((id) => le(names[id] ?? new Uint8Array()));
  const size = 80 + strs.reduce((s, b) => s + 4 + b.length, 0) + 4 + ttf.length;
  const out = new Uint8Array(size), w = new DataView(out.buffer);
  w.setUint32(0, size, true); w.setUint32(4, ttf.length, true); w.setUint32(8, 0x00020001, true); w.setUint32(12, 0, true);
  out.set(ttf.subarray(os2 + 32, os2 + 42), 16); // PANOSE
  out[26] = 1; out[27] = v.getUint16(os2 + 62) & 1; // 문자 집합 기본 · 기울임
  w.setUint32(28, v.getUint16(os2 + 4), true); w.setUint16(32, v.getUint16(os2 + 8), true); w.setUint16(34, 0x504c, true);
  for (let i = 0; i < 4; i++) w.setUint32(36 + i * 4, v.getUint32(os2 + 42 + i * 4), true); // 유니코드 범위
  for (let i = 0; i < 2; i++) w.setUint32(52 + i * 4, v.getUint32(os2 + 78 + i * 4), true); // 코드 페이지 범위
  w.setUint32(60, v.getUint32(head + 8), true); // checkSumAdjustment (64 ~ 80 예약 0)
  let at = 80;
  for (const b of [...strs, new Uint8Array()]) { at += 2; w.setUint16(at, b.length, true); at += 2; out.set(b, at); at += b.length; } // 앞 2바이트 = 패딩 0, 마지막은 RootString(빈 값)
  out.set(ttf, at);
  return out;
}

// PPTX(ArrayBuffer) → 글꼴을 넣은 zip 생성 결과 (type: base64 · arraybuffer · blob …, JSZip generateAsync와 같음)
export async function embedFonts(buffer, type) {
  const zip = await window.JSZip.loadAsync(buffer);
  const slides = await Promise.all(Object.keys(zip.files).filter((f) => /^ppt\/slides\/slide\d+\.xml$/.test(f)).map((f) => zip.file(f).async('string')));
  const used = new Map(); // typeface → { regular, bold }
  for (const xml of slides) for (const m of xml.matchAll(/<a:rPr([^>]*[^/])>(?:(?!<\/a:rPr>).)*?<a:latin typeface="([^"]+)"/g)) {
    if (!FACES[m[2]]) continue;
    const u = used.get(m[2]) ?? {}; u[/\bb="1"/.test(m[1]) && FACES[m[2]].bold ? 'bold' : 'regular'] = true; used.set(m[2], u);
  }
  if (!used.size) return zip.generateAsync({ type, compression: 'DEFLATE' });
  const text = slides.map((x) => [...x.matchAll(/<a:t>([^<]*)<\/a:t>/g)].map((m) => m[1]).join('')).join('')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
  const codes = new Set([...text + commonHangul()].map((c) => c.codePointAt(0)));
  for (const [a, b] of BASE) for (let c = a; c <= b; c++) codes.add(c);

  let list = '', rels = '', n = 0;
  try {
    const hb = await harfbuzz();
    for (const [face, styles] of used) {
      let entry = '';
      for (const style of ['regular', 'bold']) {
        if (!styles[style]) continue;
        const eot = toEot(subset(hb, await fetchFont(FACES[face][style]), codes));
        const id = `rIdFont${++n}`;
        zip.file(`ppt/fonts/font${n}.fntdata`, eot);
        rels += `<Relationship Id="${id}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/font" Target="fonts/font${n}.fntdata"/>`;
        entry += `<p:${style} r:id="${id}"/>`;
      }
      list += `<p:embeddedFont><p:font typeface="${face}" pitchFamily="34" charset="0"/>${entry}</p:embeddedFont>`;
    }
  } catch (err) {
    console.warn('[pptx] 글꼴을 넣지 못했어요 — 글꼴 없이 내보냅니다:', err.message);
    return window.JSZip.loadAsync(buffer).then((z) => z.generateAsync({ type, compression: 'DEFLATE' }));
  }
  const pres = (await zip.file('ppt/presentation.xml').async('string'))
    .replace(/<p:presentation\b([^>]*)>/, (_, a) => `<p:presentation${a.replace(/\s*(saveSubsetFonts|embedTrueTypeFonts)="[^"]*"/g, '')} embedTrueTypeFonts="1">`) // 다시 저장해도 글꼴을 빼지 않게(하위 집합 저장 끔)
    .replace(/(<p:notesSz[^>]*\/>)/, `$1<p:embeddedFontLst>${list}</p:embeddedFontLst>`); // 순서: notesSz 다음 · defaultTextStyle 앞
  zip.file('ppt/presentation.xml', pres);
  const relXml = await zip.file('ppt/_rels/presentation.xml.rels').async('string');
  zip.file('ppt/_rels/presentation.xml.rels', relXml.replace('</Relationships>', `${rels}</Relationships>`));
  const types = await zip.file('[Content_Types].xml').async('string');
  if (!types.includes('Extension="fntdata"')) zip.file('[Content_Types].xml', types.replace(/(<Types[^>]*>)/, '$1<Default Extension="fntdata" ContentType="application/x-fontdata"/>'));
  console.info('[pptx] 글꼴 넣음:', [...used.keys()].join(' · '), `(${codes.size}자)`);
  return zip.generateAsync({ type, compression: 'DEFLATE' });
}
