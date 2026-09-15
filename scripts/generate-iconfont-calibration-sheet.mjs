import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, '..');
const curatedPath = path.join(projectRoot, 'src/iconfont-curated-icons.ts');
const outputPath = path.join(scriptDir, 'iconfont-calibration-batch.svg');

const batchNames = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ['全屏', '减-2', '下载', '清空', '眼睛-不可见', '加-2', '拖拽-竖', '提示', '帮助', '筛选'];

const escapeXml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const findEntry = (source, name) => {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const patterns = [
    new RegExp(`^\\s*'${escapedName}':\\s*\\{`, 'm'),
    new RegExp(`^\\s*"${escapedName}":\\s*\\{`, 'm'),
    new RegExp(`^\\s*${escapedName}:\\s*\\{`, 'm')
  ];
  const match = patterns.map((pattern) => pattern.exec(source)).find(Boolean);
  if (!match) return null;
  const start = source.indexOf('{', match.index);
  let depth = 0;
  for (let index = start; index < source.length; index += 1) {
    if (source[index] === '{') depth += 1;
    if (source[index] === '}') depth -= 1;
    if (depth === 0) return source.slice(start, index + 1);
  }
  return null;
};

const parseCuratedEntry = (source, name) => {
  const entry = findEntry(source, name);
  if (!entry) return null;
  const pathBody = entry.match(/paths:\s*\[([\s\S]*?)\]\s*,\s*dots:/)?.[1] ?? '';
  const paths = [...pathBody.matchAll(/'([^']*)'/g)].map((match) => match[1]);
  const dotBody = entry.match(/dots:\s*\[([\s\S]*?)\]/)?.[1] ?? '';
  const dots = [...dotBody.matchAll(/\{\s*x:\s*([-\d.]+),\s*y:\s*([-\d.]+)\s*\}/g)]
    .map((match) => ({ x: Number(match[1]), y: Number(match[2]) }));
  return { paths, dots };
};

const sourceCollections = await Promise.all([
  fs.readFile(path.join(scriptDir, 'iconfont-source-54209.json'), 'utf8').then(JSON.parse),
  fs.readFile(path.join(scriptDir, 'iconfont-source-26815.json'), 'utf8').then(JSON.parse)
]);
const sourceIcons = sourceCollections.flat();
const curatedSource = await fs.readFile(curatedPath, 'utf8');

const icons = batchNames.map((name) => {
  const source = sourceIcons.find((icon) => icon.name === name);
  const curated = parseCuratedEntry(curatedSource, name);
  if (!source) throw new Error(`Missing source SVG for ${name}`);
  return { name, source, curated };
});

const cellWidth = 540;
const cellHeight = 250;
const columns = 2;
const width = cellWidth * columns;
const height = cellHeight * Math.ceil(icons.length / columns);
const sourceScale = 24 / 1024;

const curatedPathMarkup = (curated, color, opacity = 1) => {
  if (!curated) return '';
  const dots = curated.dots.map(({ x, y }) => `M${x - 1} ${y} H${x + 1}`);
  const d = [...curated.paths, ...dots].join(' ');
  return `<path d="${escapeXml(d)}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="butt" stroke-linejoin="miter" opacity="${opacity}"/>`;
};

const cards = icons.map(({ name, source, curated }, index) => {
  const column = index % columns;
  const row = Math.floor(index / columns);
  const x = column * cellWidth;
  const y = row * cellHeight;
  const sourceMarkup = source.svgInner.replaceAll('#1A202E', '#64748b');
  const panel = (offsetX, label, content) => `
    <g transform="translate(${offsetX} 52)">
      <rect x="0" y="0" width="136" height="150" rx="10" fill="#ffffff" stroke="#dbe2ea"/>
      <text x="68" y="19" text-anchor="middle" font-size="12" fill="#64748b">${label}</text>
      <g transform="translate(20 35) scale(4)">${content}</g>
    </g>`;
  const original = `<g transform="scale(${sourceScale})">${sourceMarkup}</g>`;
  const overlay = `${original}${curatedPathMarkup(curated, '#4f46e5', 0.95)}`;
  return `
  <g transform="translate(${x} ${y})">
    <rect x="10" y="10" width="520" height="230" rx="14" fill="#f8fafc" stroke="#e2e8f0"/>
    <text x="28" y="36" font-size="18" font-weight="700" fill="#0f172a">${escapeXml(name)}</text>
    ${panel(28, '原始轮廓', original)}
    ${panel(198, '当前中心线', curatedPathMarkup(curated, '#334155'))}
    ${panel(368, '来源叠加', overlay)}
  </g>`;
}).join('');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="#eef2f7"/>
  <style>text{font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif}</style>
  ${cards}
</svg>\n`;

await fs.writeFile(outputPath, svg, 'utf8');
console.log(outputPath);
