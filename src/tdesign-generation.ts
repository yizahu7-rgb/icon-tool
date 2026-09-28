export const TDESIGN_GENERATION_STANDARD_VERSION = 'TDESIGN-V2-32-2026.09';

type GenerationPromptOptions = {
  concept: string;
  hasReferenceImage: boolean;
};

export const buildTDesignGenerationPrompt = ({ concept, hasReferenceImage }: GenerationPromptOptions) => {
  const sourceRule = hasReferenceImage
    ? 'The attached image is the structural source of truth. Preserve its object count, silhouette, openings, directions, overlaps, connection points, internal symbols, and aspect ratio.'
    : `Use the simplest unambiguous topology for the concept "${concept}". Do not invent decorative details.`;

  return `You are an SVG icon engineer. Create one editable outline icon following ${TDESIGN_GENERATION_STANDARD_VERSION}.

SEMANTIC INPUT
- Concept: "${concept}"
- ${sourceRule}

DRAWING SYSTEM
- Use an exact 32×32 artboard with viewBox="0 0 32 32".
- Keep ordinary geometry inside x=2..30 and y=2..30. Semantic extremities may cross that keyline but must remain inside the artboard.
- Choose one centered keyline by visual body: horizontal 26×22, square 24×24, vertical 22×26, or circular/sparse 28×28.
- Preserve proportions. Never stretch width and height independently.
- Prefer integer or 0.5 coordinates. Angled lines should use 45° or another 15° multiple where the object permits.
- Use editable centerline paths, not expanded or filled stroke silhouettes.
- Use square line caps and hard ordinary corners. Curves must be explicit path geometry.
- Compound-icon gaps should normally be 0.5-unit increments and no wider than 2.5 units.
- Use exactly one primary metaphor and at most one state modifier. Do not draw one element for every word in the concept.
- Omit tape, folds, dividers, labels, texture, and construction detail unless removing it would change the core meaning.
- Icons in the same semantic family must reuse the same base silhouette and keyline; vary only the state symbol.
- Prefer one outer path and one state-symbol path. Before exceeding three visible paths, remove any detail that is not semantically indispensable.

SEMANTIC LAYERS
- Put every external silhouette and outer structural line in one <g id="stroke1">.
- Put internal symbols, holes, dividers, letters, dots, status marks, and decorative details in one optional <g id="stroke2">.
- Internal details must be separate from stroke1 so global corner editing can affect only the exterior.
- Unless a semantic connection is explicit, stroke2 symbols must not intersect or touch stroke1. At the default 2-unit stroke, keep a visible 1.5–2.5-unit gap (normally 3.5–4.5 units between centerlines), using 0.5-unit increments.
- Use one or more <path> elements inside those groups. Multiple disconnected subpaths are allowed.
- Each path must use fill="none", stroke="currentColor", stroke-width="2", and stroke-linecap="square".
- Use absolute path commands only: M L H V C S Q T A Z. Do not use transforms.

OUTPUT CONTRACT
- Return only one complete SVG element: <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">...</svg>.
- The SVG may contain only stroke1 and optional stroke2 groups, containing path elements only.
- Do not output Markdown, prose, comments, style, class, script, defs, clipPath, mask, text, raster images, or external references.
- Verify before answering: correct semantic topology; all geometry inside 0..32; stable stroke1/stroke2 separation; no filled silhouette; no omitted or invented object.`;
};

type ValidationResult =
  | { ok: true; body: string }
  | { ok: false; reason: string };

const escapeAttribute = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/"/g, '&quot;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

export const validateTDesignGeneratedIcon = (raw: string): ValidationResult => {
  const candidate = raw
    .replace(/^```(?:svg|xml)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
  const svgMatch = candidate.match(/<svg\b[\s\S]*?<\/svg>/i);
  if (!svgMatch) return { ok: false, reason: '没有找到完整的 SVG 元素' };

  const documentResult = new DOMParser().parseFromString(svgMatch[0], 'image/svg+xml');
  if (documentResult.querySelector('parsererror')) return { ok: false, reason: 'SVG 语法不完整' };

  const root = documentResult.documentElement;
  if (root.tagName.toLowerCase() !== 'svg') return { ok: false, reason: '根元素必须是 svg' };
  const viewBox = root.getAttribute('viewBox')?.trim().replace(/\s+/g, ' ');
  if (viewBox !== '0 0 32 32') return { ok: false, reason: '画板必须是 0 0 32 32' };

  const allowedRootAttributes = new Set(['viewBox', 'fill', 'xmlns']);
  for (const attribute of Array.from(root.attributes)) {
    if (!allowedRootAttributes.has(attribute.name)) {
      return { ok: false, reason: `svg 不允许 ${attribute.name} 属性` };
    }
  }

  const groups = Array.from(root.children);
  if (groups.length < 1 || groups.length > 2) return { ok: false, reason: '只允许 stroke1 和可选的 stroke2 图层' };
  if (Array.from(root.childNodes).some((node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim())) {
    return { ok: false, reason: 'SVG 外层包含多余文本' };
  }

  const groupIds = new Set<string>();
  let pathCount = 0;
  for (const group of groups) {
    if (group.tagName.toLowerCase() !== 'g') return { ok: false, reason: 'SVG 只允许使用 g 图层和 path' };
    const id = group.getAttribute('id') || '';
    if (id !== 'stroke1' && id !== 'stroke2') return { ok: false, reason: '图层 ID 只能是 stroke1 或 stroke2' };
    if (groupIds.has(id)) return { ok: false, reason: `图层 ${id} 重复` };
    groupIds.add(id);
    if (group.attributes.length !== 1) return { ok: false, reason: `${id} 图层不能包含额外属性` };

    const paths = Array.from(group.children);
    if (paths.length === 0) return { ok: false, reason: `${id} 图层不能为空` };
    for (const path of paths) {
      if (path.tagName.toLowerCase() !== 'path') return { ok: false, reason: '图层内只允许 path 元素' };
      pathCount += 1;
      if (pathCount > 24) return { ok: false, reason: '路径数量过多' };
      const allowedPathAttributes = new Set([
        'd', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit'
      ]);
      for (const attribute of Array.from(path.attributes)) {
        if (!allowedPathAttributes.has(attribute.name)) {
          return { ok: false, reason: `path 不允许 ${attribute.name} 属性` };
        }
        if (/url\s*\(|javascript:|data:/i.test(attribute.value)) {
          return { ok: false, reason: `${attribute.name} 包含不安全内容` };
        }
      }
      const pathData = path.getAttribute('d')?.trim() || '';
      if (!pathData) return { ok: false, reason: 'path 缺少有效的 d 数据' };
      if (/[a-z]/.test(pathData)) return { ok: false, reason: '路径只能使用绝对坐标命令' };
      const commands = pathData.match(/[A-Z]/g) || [];
      if (!commands.length || commands.some((command) => !'MLHVCSQTAZ'.includes(command))) {
        return { ok: false, reason: '路径包含不支持的命令' };
      }
      if (path.getAttribute('fill') !== 'none') return { ok: false, reason: '生成路径必须使用 fill="none"' };
      if (path.getAttribute('stroke') !== 'currentColor') return { ok: false, reason: '生成路径必须使用 currentColor 描边' };
    }
  }
  if (!groupIds.has('stroke1')) return { ok: false, reason: '缺少外轮廓 stroke1 图层' };

  const measurementSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  measurementSvg.setAttribute('viewBox', '0 0 32 32');
  measurementSvg.style.cssText = 'position:fixed;left:-10000px;top:-10000px;width:32px;height:32px;visibility:hidden';
  document.body.appendChild(measurementSvg);
  try {
    for (const sourcePath of Array.from(root.querySelectorAll('path'))) {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', sourcePath.getAttribute('d') || '');
      measurementSvg.appendChild(path);
      const box = path.getBBox();
      if (![box.x, box.y, box.width, box.height].every(Number.isFinite)) {
        return { ok: false, reason: '路径无法计算边界' };
      }
      const tolerance = 0.01;
      if (box.x < -tolerance || box.y < -tolerance || box.x + box.width > 32 + tolerance || box.y + box.height > 32 + tolerance) {
        return { ok: false, reason: '路径超出 32×32 画板' };
      }
      path.remove();
    }
  } catch {
    return { ok: false, reason: '路径数据无法解析' };
  } finally {
    measurementSvg.remove();
  }

  const body = groups.map((group) => {
    const id = group.getAttribute('id') as 'stroke1' | 'stroke2';
    const paths = Array.from(group.children).map((path) => {
      const orderedAttributes = ['d', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit'];
      const attributes = orderedAttributes
        .filter((name) => path.hasAttribute(name))
        .map((name) => `${name}="${escapeAttribute(path.getAttribute(name) || '')}"`)
        .join(' ');
      return `<path ${attributes}/>`;
    }).join('\n');
    return `<g id="${id}">\n${paths}\n</g>`;
  }).join('\n');

  return { ok: true, body };
};
