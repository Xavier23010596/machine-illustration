#!/usr/bin/env node
/* ============================================================================
 * build-prompt-pack.mjs —— 从"设备清单"批量展开成套提示词
 * ----------------------------------------------------------------------------
 *   node scripts/build-prompt-pack.mjs --in inventory.json --out out/
 *   node scripts/build-prompt-pack.mjs --in inventory.json --check        # 只校验不写出
 *   node scripts/build-prompt-pack.mjs --in inventory.json --out out/ --styles 3d,line,cut --split
 *
 * 风格块从 references/02-style-blocks.md 解析（唯一真源），本脚本不含任何风格文本。
 * 这样"改一处等于改全部"，不会出现文档和产物两个版本。
 * ==========================================================================*/
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');
const BLOCKS_MD = resolve(ROOT, 'references/02-style-blocks.md');

const STYLE_MAP = { '3d': 'S1', line: 'S2', exploded: 'S3', cut: 'S4' };
const STYLE_DIR = { '3d': '3d', line: 'line', exploded: 'exploded', cut: 'cutaway' };

function arg(name, def) {
  const i = process.argv.indexOf('--' + name);
  return i > -1 && process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : def;
}
const flag = (n) => process.argv.includes('--' + n);

/* ---------------- 1. 解析风格块 ---------------- */
function loadBlocks() {
  if (!existsSync(BLOCKS_MD)) throw new Error('找不到 references/02-style-blocks.md');
  const md = readFileSync(BLOCKS_MD, 'utf8').replace(/\r\n/g, '\n');
  const parts = md.split(/^### \[(\w+)\][^\n]*$/gm);
  const blocks = {};
  for (let i = 1; i < parts.length; i += 2) {
    const id = parts[i];
    const chunk = parts[i + 1] || '';
    const m = chunk.match(/```[a-z]*\n([\s\S]*?)```/);
    if (m) blocks[id] = m[1].trim();
  }
  const need = ['S1', 'S2', 'S3', 'S4', 'N', 'P'];
  const miss = need.filter((k) => !blocks[k]);
  if (miss.length) throw new Error('风格块缺失：' + miss.join('、') + '（检查 02-style-blocks.md 的 ### [ID] 标题）');
  return blocks;
}

/* ---------------- 2. 读清单 ---------------- */
const IN = resolve(arg('in', 'inventory.json'));
if (!existsSync(IN)) {
  console.error(`找不到清单文件 ${IN}\n可用 --in 指定；格式见 references/03-prompt-template.md`);
  process.exit(1);
}
const inv = JSON.parse(readFileSync(IN, 'utf8'));
const machines = inv.machines || [];
const styles = (arg('styles', (inv.styles || ['3d', 'line']).join(','))).split(',').map((s) => s.trim()).filter(Boolean);
const OUT = resolve(arg('out', '.'));
const CHECK = flag('check');

const blocks = loadBlocks();
const errs = [], warns = [];

/* ---------------- 3. 校验 ---------------- */
const ids = new Set();
for (const [i, m] of machines.entries()) {
  const at = `#${i + 1} ${m.id || '(无 id)'}`;
  if (!m.id) errs.push(`${at}：缺 id`);
  else if (ids.has(m.id)) errs.push(`${at}：id 重复`);
  else ids.add(m.id);

  if (!m.name_zh) errs.push(`${at}：缺中文名 name_zh`);
  if (!/^#[0-9A-Fa-f]{6}$/.test(m.hex || '')) errs.push(`${at}：hex 不合法（要 #RRGGBB，收到 "${m.hex}"）`);
  if (!m.accent) warns.push(`${at}：缺 accent 颜色名（配色句会退化成只有 hex）`);

  for (const k of ['subject_3d', 'subject_line']) {
    const s = m[k] || '';
    if (!s) { errs.push(`${at}：缺 ${k}`); continue; }
    if (/[\u4e00-\u9fa5]/.test(s)) errs.push(`${at}：${k} 含中文，提示词必须全英文`);
    if (s.split(/\s+/).length < 20) errs.push(`${at}：${k} 过短（<20 词），模型只会给你一台通用机器`);
    if (/^Subject\s*:/i.test(s)) errs.push(`${at}：${k} 不要自带 "Subject:" 前缀，脚本会补`);
  }

  const s3 = (m.subject_3d || '').toLowerCase();
  if (s3 && !/(\d|\bproportions?\b|times longer|character)/.test(s3)) {
    warns.push(`${at}：subject_3d 缺"比例/识别特征"句——这是防翻车的关键，建议补 "proportional character: ..."`);
  }
  if (!m.extra_negative) {
    warns.push(`${at}：缺 extra_negative（把最容易误认成的那台机器写进负向词，比反复改正文有效）`);
  }
}

for (const s of styles) if (!STYLE_MAP[s]) errs.push(`未知风格 "${s}"，可选：${Object.keys(STYLE_MAP).join(', ')}`);

// 风格与机器能力对不上时提醒（剖切要有内部结构描述，线稿要有 subject_line）
if (styles.includes('cut')) {
  const noCut = machines.filter((m) => !m.cutaway).map((m) => m.id);
  if (noCut.length) warns.push(`请求了 cut 风格，但以下机器没标 cutaway=true，内部结构描述不足：${noCut.join('、')}`);
}
if (styles.includes('line')) {
  const noLine = machines.filter((m) => !m.subject_line).map((m) => m.id);
  if (noLine.length) warns.push(`请求了 line 风格，但以下机器缺 subject_line，会被跳过：${noLine.join('、')}`);
}
if (inv.anchor && !machines.some((m) => m.id === inv.anchor)) {
  warns.push(`anchor=${inv.anchor} 不在清单里（锚点图必须是真实存在的某一台）`);
}

/* ---------------- 4. 拼装 ---------------- */
const slug = (m) => (m.name_en || m.id).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const hexToName = { '#2E6BE6': 'deep blue' };

function composePositive(m, style) {
  const subject = style === 'line' ? m.subject_line : m.subject_3d;
  let pos = `Subject: ${subject.trim()}`;
  // 配色句：正文里已有 Accent color 就不重复加，避免同一句出现两次
  if (style !== 'line' && !/accent color:/i.test(subject)) {
    const accent = m.accent || hexToName[m.hex] || 'accent';
    pos += '\n' + blocks.P
      .replace(/\{ACCENT\}/g, accent)
      .replace(/\{HEX\}/g, m.hex);
  }
  pos += '\n' + blocks[STYLE_MAP[style]];
  return pos;
}

function composeNegative(m) {
  return m.extra_negative ? `${blocks.N}\n${m.extra_negative}` : blocks.N;
}

const pack = [];
for (const m of machines) {
  for (const style of styles) {
    if (style === 'line' && !m.subject_line) continue;
    pack.push({
      id: m.id,
      name_zh: m.name_zh,
      name_en: m.name_en || '',
      stage: m.stage || '',
      accent: m.accent || '',
      hex: m.hex || '',
      cutaway: !!m.cutaway,
      style,
      block: STYLE_MAP[style],
      positive: composePositive(m, style),
      negative: composeNegative(m),
      filename: `${m.id}_${slug(m)}_${STYLE_DIR[style]}.png`
    });
  }
}

/* ---------------- 5. 输出 ---------------- */
if (CHECK) {
  console.log(`\n校验 ${machines.length} 台 / ${pack.length} 条提示词`);
  errs.forEach((e) => console.log('  ✗ ' + e));
  warns.forEach((w) => console.log('  ! ' + w));
  console.log(errs.length ? `\n  ${errs.length} 个错误，${warns.length} 个提醒\n` : `\n  通过（${warns.length} 个提醒）\n`);
  process.exit(errs.length ? 1 : 0);
}

mkdirSync(OUT, { recursive: true });
if (flag('split')) mkdirSync(join(OUT, 'prompts'), { recursive: true });

const bar = '='.repeat(78);
const lines = [
  `# ${inv.project || '设备图提示词包'} · 提示词包`,
  '',
  `- 风格块来源：\`references/02-style-blocks.md\`（唯一真源，改那里即全部生效）`,
  `- 机器 ${machines.length} 台 ｜ 提示词 ${pack.length} 条 ｜ 风格 ${styles.join(' / ')}`,
  `- 锚点图：${inv.anchor ? `${inv.anchor}（先跑这张定调，其余用它的成图做参考图，权重 0.4–0.6）` : '未指定（强烈建议指定一台结构最经典的做锚点）'}`,
  '',
  '> 用法：把「正向」整段粘进正向框，「负向」粘进负向框。图内**不生成任何文字**，名称与编号后期叠加。',
  ''
];

let lastStage = null;
for (const p of pack) {
  if (p.stage && p.stage !== lastStage) {
    lines.push(`---`, '', `## ${p.stage}`, '');
    lastStage = p.stage;
  }
  lines.push(
    `### ${p.id} ${p.name_zh}${p.name_en ? ' · ' + p.name_en : ''}`,
    '',
    `段：${p.stage || '—'} ｜ 点缀色：${p.accent || '—'} ${p.hex}${p.cutaway ? ' ｜ 需剖切' : ''} ｜ 文件：\`${p.filename}\``,
    '',
    '**正向**',
    '```text',
    p.positive,
    '```',
    '',
    '**负向**',
    '```text',
    p.negative,
    '```',
    ''
  );
}

writeFileSync(join(OUT, 'prompt-pack.md'), lines.join('\n'), 'utf8');
writeFileSync(join(OUT, 'prompt-pack.json'), JSON.stringify({ project: inv.project, anchor: inv.anchor, count: pack.length, items: pack }, null, 2), 'utf8');

/* 出图登记表：跑完图把 seed / 权重 / 采用文件填回来，下次复现靠它 */
const manifest = pack.map((p) => ({
  id: p.id, style: p.style, filename: p.filename,
  seed: null, ref_image: inv.anchor && p.id !== inv.anchor ? inv.anchor : null,
  ref_weight: inv.anchor && p.id !== inv.anchor ? 0.5 : null,
  model: null, picked: null, note: ''
}));
writeFileSync(join(OUT, 'manifest.json'), JSON.stringify({ project: inv.project, generated_at: null, items: manifest }, null, 2), 'utf8');

if (flag('split')) {
  for (const p of pack) {
    writeFileSync(join(OUT, 'prompts', p.filename.replace(/\.png$/, '.txt')),
      `# ${p.id} ${p.name_zh} (${p.style})\n\n[正向]\n${p.positive}\n\n[负向]\n${p.negative}\n`, 'utf8');
  }
}

console.log(bar);
console.log(`已生成提示词包：${OUT}`);
console.log(`  prompt-pack.md    ${pack.length} 条（人读，带正向/负向两栏）`);
console.log(`  prompt-pack.json  机读，可直接喂批处理`);
console.log(`  manifest.json     出图登记表（seed / 参考图 / 采用文件）`);
if (flag('split')) console.log(`  prompts/*.txt     逐条拆分（${pack.length} 个）`);
if (warns.length) {
  console.log(`\n  ${warns.length} 个提醒：`);
  warns.slice(0, 8).forEach((w) => console.log('   ! ' + w));
  if (warns.length > 8) console.log(`   … 其余 ${warns.length - 8} 条见 --check`);
}
console.log(bar);
