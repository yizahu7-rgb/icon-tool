import fs from 'node:fs/promises';
import path from 'node:path';

const projectRoot = process.cwd();
const auditPath = path.join(projectRoot, 'scripts/iconfont-centerline-audit.json');
const outputPath = path.join(projectRoot, 'scripts/iconfont-audit.html');
const { results, failures } = JSON.parse(await fs.readFile(auditPath, 'utf8'));
const [source26815, source54209] = await Promise.all([
  fs.readFile(path.join(projectRoot, 'scripts/iconfont-source-26815.json'), 'utf8').then(JSON.parse),
  fs.readFile(path.join(projectRoot, 'scripts/iconfont-source-54209.json'), 'utf8').then(JSON.parse)
]);
const sourceByKey = new Map([...source26815, ...source54209].map((icon) => [`${icon.collectionId}:${icon.name}`, icon]));

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const cards = results.map((icon) => {
  const centerline = icon.centerlinePaths.join(' ');
  const dotPaths = icon.dots.map(({ x, y }) => `M${x - 1} ${y} H${x + 1}`).join(' ');
  const convertedD = `${centerline} ${dotPaths}`.trim();
  return `
    <article class="card ${icon.stats.likelyFilled ? 'is-filled' : ''}" data-name="${escapeHtml(icon.name)}">
      <header><strong>${escapeHtml(icon.name)}</strong><span>${icon.collectionId}</span></header>
      <div class="compare">
        <figure><svg viewBox="0 0 24 24"><path d="${escapeHtml(icon.sourceFillD)}" fill="currentColor"/></svg><figcaption>Iconfont 原图</figcaption></figure>
        <figure><svg viewBox="0 0 24 24"><path d="${escapeHtml(convertedD)}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="butt" stroke-linejoin="miter"/></svg><figcaption>中轴描边</figcaption></figure>
      </div>
      <footer>路径 ${icon.stats.branches} · 点 ${icon.stats.dots}${icon.stats.likelyFilled ? ' · 疑似实心' : ''}</footer>
    </article>`;
}).join('');

const failureCards = failures.map((failure) => {
  const source = sourceByKey.get(`${failure.collectionId}:${failure.name}`);
  return `
    <article class="card failure" data-name="${escapeHtml(failure.name)}">
      <header><strong>${escapeHtml(failure.name)}</strong><span>${failure.collectionId}</span></header>
      ${source ? `<figure><svg viewBox="${escapeHtml(source.viewBox)}">${source.svgInner}</svg><figcaption>Iconfont 原图</figcaption></figure>` : ''}
      <p>${escapeHtml(failure.error)}</p>
    </article>`;
}).join('');

const html = `<!doctype html>
<html lang="zh-CN">
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Iconfont 轮廓核对</title>
<style>
  *{box-sizing:border-box} body{margin:0;background:#f5f7fa;color:#182033;font:14px/1.4 system-ui,sans-serif}
  .toolbar{position:sticky;top:0;z-index:2;display:flex;gap:12px;align-items:center;padding:14px 22px;background:#fff;border-bottom:1px solid #dde3ec}
  input{width:320px;height:38px;padding:0 12px;border:1px solid #cdd5e1;border-radius:8px;font:inherit}
  label{display:flex;gap:6px;align-items:center;color:#667085}
  main{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;padding:18px}
  .card{background:#fff;border:1px solid #e1e6ee;border-radius:12px;padding:12px;min-width:0}
  .card.is-filled{border-color:#f0b96a;background:#fffaf2}.card.failure{border-color:#ef7777;background:#fff5f5}
  header{display:flex;justify-content:space-between;gap:8px}header span,footer{color:#8a94a6;font-size:12px}
  .compare{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px}
  figure{margin:0;padding:8px;background:#f8fafc;border-radius:8px;text-align:center}svg{width:88px;height:88px;color:#596273}
  figcaption{margin-top:4px;color:#8a94a6;font-size:11px}footer{margin-top:8px}
  @media(max-width:1000px){main{grid-template-columns:repeat(2,minmax(0,1fr))}} @media(max-width:600px){main{grid-template-columns:1fr}}
</style>
<div class="toolbar"><input id="q" placeholder="按名称筛选"/><label><input id="hideFilled" type="checkbox"/>隐藏疑似实心</label><span>共 ${results.length} 个，失败 ${failures.length} 个</span></div>
<main>${failureCards}${cards}</main>
<script>
const q=document.querySelector('#q');const hide=document.querySelector('#hideFilled');const cards=[...document.querySelectorAll('.card')];
const apply=()=>{const terms=q.value.split('|').map(term=>term.trim()).filter(Boolean);cards.forEach(card=>{const name=card.dataset.name||'';card.hidden=(terms.length>0&&!terms.some(term=>name.includes(term)))||(hide.checked&&card.classList.contains('is-filled'));});};
q.addEventListener('input',apply);hide.addEventListener('change',apply);
</script>
</html>`;

await fs.writeFile(outputPath, html);
console.log(`Wrote ${outputPath}`);
