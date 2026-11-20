import type { TDesignIcon } from './tdesign-icons';
import { straightenFrameCornerBevels, transformMasterGoPath } from './fs-node-icon';

export const TDESIGN_GENERATION_STANDARD_VERSION = 'TDESIGN-V2-32-2026.10';

export type TDesignGenerationReference = Pick<TDesignIcon, 'name' | 'label' | 'keywords' | 'viewBox' | 'body'> & {
  source: 'TDesign Icons official';
};

type TDesignGenerationFamily = {
  id: string;
  label: string;
  source: string;
  keyline: string;
  masterRule: string;
  stateRule: string;
  stroke2Role?: 'core-detail' | 'state-symbol';
  presetSvg?: string;
  geometry?: {
    stroke1: { x: number; y: number; width: number; height: number };
    stroke2Center?: { x: number; y: number; tolerance: number };
    stroke2MaxSize?: { width: number; height: number };
    minimumLayerGap?: number;
  };
};

export type TDesignGenerationContext = {
  family?: TDesignGenerationFamily;
  references: readonly TDesignGenerationReference[];
  stroke2Role: 'core-detail' | 'state-symbol';
  referenceAspectRatio?: number;
  referenceShape?: 'square' | 'horizontal-rectangle' | 'vertical-rectangle' | 'circle' | 'irregular';
  referenceInteriorGap?: number;
  referenceHasTopBar?: boolean;
};

type GenerationPromptOptions = {
  concept: string;
  hasReferenceImage: boolean;
  cornerRadius: number;
  context?: TDesignGenerationContext;
};

const normalizeSemanticText = (value: string) => value
  .toLowerCase()
  .replace(/[\s\p{P}\p{S}]+/gu, '');

const getWarehouseStateRule = (concept: string) => {
  const normalized = normalizeSemanticText(concept);
  if (/出入库|入出库|库存流转|双向/.test(normalized)) {
    return 'Use one centered horizontal bidirectional arrow in stroke2: left and right arrowheads on the same axis. Do not add boxes, doors, shelves, or a second container.';
  }
  if (/出库|出仓|发货|领料/.test(normalized)) {
    return 'Use one centered upward arrow in stroke2 to mean leaving stock. Keep it fully inside the warehouse shell with a 1.5–2.5 unit visible gap from stroke1.';
  }
  if (/入库|入仓|收货|上架/.test(normalized)) {
    return 'Use one centered downward arrow in stroke2 to mean entering stock. Keep it fully inside the warehouse shell with a 1.5–2.5 unit visible gap from stroke1.';
  }
  return 'Draw no state symbol unless the concept explicitly requires one. Do not add shelves, windows, doors, boxes, or decorative divisions.';
};

const getFileSecurityStateRule = (concept: string) => {
  const normalized = normalizeSemanticText(concept);
  if (/解密|解锁|未锁/.test(normalized)) {
    return 'Use one open padlock in stroke2, centered in the lower half. The shackle must be visibly open and must not touch the document outline.';
  }
  return 'Use one closed padlock in stroke2, centered in the lower half. Keep the shackle and lock body simple, symmetric, and visibly separated from the document outline.';
};

const getFileSecurityPresetSvg = (concept: string) => {
  const normalized = normalizeSemanticText(concept);
  const shacklePath = /解密|解锁|未锁/.test(normalized)
    ? 'M12.5 20.5V18.5C12.5 16.8 13.9 15.5 15.5 15.5H16.5C17.7 15.5 18.8 16.2 19.3 17.2'
    : 'M12.5 20.5V18.5C12.5 16.8 13.9 15.5 15.5 15.5H16.5C18.1 15.5 19.5 16.8 19.5 18.5V20.5';

  return `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="stroke1">
<path d="M5 3H18L27 12V29H5Z M18 3V12H27" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"/>
</g>
<g id="stroke2">
<path d="${shacklePath} M11 20.5H21V25H11Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"/>
</g>
</svg>`;
};

const getPackageStateRule = (concept: string) => {
  const normalized = normalizeSemanticText(concept);
  if (/发货|寄件|寄出|派送/.test(normalized)) {
    return 'Use one rightward arrow in stroke2 to mean shipment. Keep it optically centered against the package body, preserve clear separation from stroke1, and do not replace the package with an export window or share symbol.';
  }
  if (/拆箱|取出|出箱|包裹出库/.test(normalized)) {
    return 'Use one upward arrow in stroke2, centered over the box interior, to show removal. Do not change the box master.';
  }
  return 'Use one downward arrow in stroke2, centered over the box interior, to show insertion. Do not change the box master.';
};

const getWarehousePresetSvg = (concept: string) => {
  const normalized = normalizeSemanticText(concept);
  const statePath = /出库|出仓|发货|领料/.test(normalized)
    ? 'M16 20V8.5M12.5 12L16 8.5L19.5 12'
    : /入库|入仓|收货|上架/.test(normalized)
      ? 'M16 8.5V20M12.5 16.5L16 20L19.5 16.5'
      : null;
  if (!statePath) return undefined;

  return `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="stroke1">
<path d="M4 28V12L16 4L28 12V28H4Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"/>
</g>
<g id="stroke2">
<path d="${statePath}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"/>
</g>
</svg>`;
};

const qualityRejectionPresetSvg = `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="stroke1">
<path d="M4 9L16 3L28 9V24L16 29L4 24V9ZM4 9L16 15L28 9M16 15V29" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"/>
</g>
<g id="stroke2">
<path d="M7.5 17.5L11.5 21.5M11.5 17.5L7.5 21.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"/>
</g>
</svg>`;

const auditReviewPresetSvg = `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="stroke1">
<path d="M4 3H23V13 M15.5 27H4V3 M7 8H19 M7 12H19 M7 16H15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"/>
</g>
<g id="stroke2">
<path d="M23 16.5A4.5 4.5 0 1 1 23 25.5A4.5 4.5 0 1 1 23 16.5Z M26.2 24.2L30 28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"/>
</g>
</svg>`;

const orderClipboardPresetSvg = `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="stroke1">
<path d="M11 6H5V29H27V6H21" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"/>
<path d="M11 3H21V9H11Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"/>
</g>
</svg>`;

const resolveGenerationFamily = (concept: string): TDesignGenerationFamily | undefined => {
  const normalized = normalizeSemanticText(concept);

  if (normalized === '订单') {
    return {
      id: 'order-clipboard',
      label: '订单夹板家族',
      source: 'User-provided clipboard topology, normalized for TDesign v2',
      keyline: 'vertical 22×26, centered at x=5..27 and y=3..29',
      masterRule: 'Use one upright clipboard body with one centered foreground tab. The body top edge must be split into left and right segments that stop at the tab sides; no hidden top edge may pass through the tab.',
      stateRule: 'Keep both the body and tab in stroke1 because they form one outer object. Store all adjustable corners as sharp vertices so the page corner-radius control is the only source of rounding.',
      presetSvg: orderClipboardPresetSvg,
      geometry: {
        stroke1: { x: 5, y: 3, width: 22, height: 26 }
      }
    };
  }

  if (/^(分配|派发|调拨|调配|资源分配|库存分配|物料分配|订单分配)$/.test(normalized)) {
    return {
      id: 'allocation-flow',
      label: '分配流转家族',
      source: 'TDesign arrow-left-right-circle topology, redrawn for the TDesign v2 circular keyline',
      keyline: 'circular 28×28, centered at x=2..30 and y=2..30',
      masterRule: 'The circular master is locked. In stroke1 use one exact 28×28 circle centered at (16,16), spanning x=2..30 and y=2..30.',
      stateRule: 'Use two compact opposing horizontal arrows in stroke2. Their combined geometric center must be exactly (16,16), with balanced top and bottom spacing and generous clearance from the circle.',
      presetSvg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="stroke1">
<path d="M16 2A14 14 0 1 1 16 30A14 14 0 1 1 16 2Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"/>
</g>
<g id="stroke2">
<path d="M20.5 13H11.5M14 10.5L11.5 13L14 15.5M11.5 19H20.5M18 16.5L20.5 19L18 21.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"/>
</g>
</svg>`,
      geometry: {
        stroke1: { x: 2, y: 2, width: 28, height: 28 },
        stroke2Center: { x: 16, y: 16, tolerance: 0.01 },
        stroke2MaxSize: { width: 10, height: 12 }
      }
    };
  }

  if (normalized === '审核') {
    return {
      id: 'audit-review',
      label: 'Iconfont 审核母版 #3875045',
      source: 'Iconfont exact-name collection-priority result “审核” #3875045, redrawn for TDesign v2',
      keyline: 'special document-and-magnifier composite, spanning x=4..29 and y=3..28',
      masterRule: 'Preserve the reference topology: one upright audit document with short review lines, overlapped by one magnifying glass at the lower right. Do not replace the magnifying glass with a check mark, checkbox, stamp, person, shield, or plain framed tick.',
      stateRule: 'The magnifying glass is an intentional foreground object from the Iconfont reference, not a detached status mark. Keep its circular lens and diagonal handle together in stroke2. Express the overlap by breaking the covered right and bottom document edges; visible stroke1 and stroke2 lines must never cross or touch.',
      presetSvg: auditReviewPresetSvg,
      geometry: {
        stroke1: { x: 4, y: 3, width: 19, height: 24 },
        stroke2MaxSize: { width: 11.5, height: 11.5 },
        minimumLayerGap: 3.5
      }
    };
  }

  if (/文件加密|加密文件|文件锁定|锁定文件|文件安全|安全文件|文件解密|解密文件|文件解锁|解锁文件/.test(normalized)) {
    return {
      id: 'document-security',
      label: '文件安全家族',
      source: 'TDesign file-locked / file-unlocked family',
      keyline: 'vertical 22×26, centered at x=5..27 and y=3..29',
      masterRule: 'The document master is locked. In stroke1 use exactly this topology and proportion: M5 3H18L27 12V29H5Z M18 3V12H27. Do not redesign the page silhouette or add text lines.',
      stateRule: `${getFileSecurityStateRule(concept)} The complete lock is fixed at x=11..21 and y=15.5..25; its bottom centerline must remain 4 units above the document bottom at y=29.`,
      presetSvg: getFileSecurityPresetSvg(concept),
      geometry: {
        stroke1: { x: 5, y: 3, width: 22, height: 26 },
        stroke2Center: { x: 16, y: 20.25, tolerance: 0.01 },
        stroke2MaxSize: { width: 10, height: 9.5 }
      }
    };
  }

  if (normalized === '发货') {
    return {
      id: 'shipping-dispatch',
      label: 'Iconfont 发货母版 #11239023',
      source: 'Iconfont exact-name collection-priority result “发货” #11239023, redrawn for TDesign v2',
      keyline: 'horizontal 26×22, centered at x=3..29 and y=5..27',
      masterRule: 'Use the locked front-facing shipment package: one horizontal package outline, one top closure seam, and one centered hanging seal with a V-shaped lower notch. Do not replace it with an isometric cube, truck, share window, export arrow, or tiny arrow inside a box.',
      stateRule: 'The centered seal is part of the package structure and remains in stroke1. Do not add a separate stroke2 arrow or status mark.',
      presetSvg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="stroke1">
<path d="M3 5H29V27H3Z M3 9H29 M12 9V18L16 15.5L20 18V9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"/>
</g>
</svg>`,
      geometry: {
        stroke1: { x: 3, y: 5, width: 26, height: 22 }
      }
    };
  }

  if (/^(不合格处理|不合格品|不良品处理|异常品处理|不合格品处理)$/.test(normalized)) {
    return {
      id: 'quality-rejection',
      label: '质量异常处理家族',
      source: 'Package status topology normalized for TDesign v2',
      keyline: 'special 24×26 package body, centered at x=4..28 and y=3..29',
      masterRule: 'Use the locked isometric package master in stroke1. Keep the three faces and center seam unchanged.',
      stateRule: 'Use one compact 4×4 rejection cross on the left face in stroke2. Its exact bounding box is x=7.5..11.5 and y=17.5..21.5 so every visible edge keeps the required safety gap.',
      presetSvg: qualityRejectionPresetSvg,
      geometry: {
        stroke1: { x: 4, y: 3, width: 24, height: 26 },
        stroke2Center: { x: 9.5, y: 19.5, tolerance: 0.01 },
        stroke2MaxSize: { width: 4, height: 4 }
      }
    };
  }

  if (/出入库|入出库|入库|出库|入仓|出仓|库存流转|仓储流转|收货入库|发货出库/.test(normalized)) {
    return {
      id: 'warehouse-flow',
      label: '仓储流转家族',
      source: 'Tabler package-import / package-export topology, redrawn for TDesign v2',
      keyline: 'square 24×24, centered at x=4..28 and y=4..28',
      masterRule: 'The warehouse master is locked. In stroke1 use exactly this single shell path: M4 28V12L16 4L28 12V28H4Z. Do not redesign the roof, open a side, or replace the warehouse with a tray, house, box, or download symbol.',
      stateRule: getWarehouseStateRule(concept),
      presetSvg: getWarehousePresetSvg(concept),
      geometry: {
        stroke1: { x: 4, y: 4, width: 24, height: 24 },
        stroke2MaxSize: { width: 7, height: 11.5 }
      }
    };
  }

  if (/打包|装箱|入箱|拆箱|开箱|出箱|包裹入库|包裹出库/.test(normalized)) {
    return {
      id: 'package-flow',
      label: '包裹流转家族',
      source: 'Tabler package-import / package-export topology, redrawn for TDesign v2',
      keyline: 'square 24×24, centered at x=4..28 and y=4..28',
      masterRule: 'The package master is locked. In stroke1 use exactly this topology: M16 28L4 21.5V10.5L16 4L28 10.5V21.5L16 28 M4 10.5L16 17L28 10.5 M16 17V28. Keep all box perspective lines in stroke1 and do not add tape or labels.',
      stateRule: getPackageStateRule(concept),
      stroke2Role: 'state-symbol'
    };
  }

  return undefined;
};

const semanticExpansions = [
  { when: /分配|派发|调拨|调配/, terms: ['arrow-left-right-circle', 'swap', '交换', '左右箭头循环'] },
  { when: /加密|锁定|安全/, terms: ['locked', 'lock', '锁定', '安全'] },
  { when: /解密|解锁/, terms: ['unlocked', 'unlock', '解锁'] },
  { when: /入库|入仓|收货/, terms: ['import', '导入', 'download', '下载'] },
  { when: /出库|出仓/, terms: ['export', '导出', 'upload', '上传'] },
  { when: /发货|寄件|寄出|派送/, terms: ['shipment', 'shipping', 'delivery', 'package', 'truck', '发货', '物流', '运输'] },
  { when: /文件|文档/, terms: ['file', 'document', '文件', '文档'] },
  { when: /仓库|仓储|库存/, terms: ['store', 'warehouse', 'institution', '仓库', '库存'] },
  { when: /设置|配置/, terms: ['setting', 'settings', '设置', '配置'] },
  { when: /搜索|查找/, terms: ['search', '搜索', '查找'] },
  { when: /用户|人员/, terms: ['user', '用户', '人员'] }
] as const;

const buildSemanticTerms = (concept: string) => {
  const normalized = normalizeSemanticText(concept);
  const terms = new Set([normalized]);
  semanticExpansions.forEach(({ when, terms: relatedTerms }) => {
    if (when.test(normalized)) relatedTerms.forEach((term) => terms.add(normalizeSemanticText(term)));
  });
  return [...terms].filter(Boolean);
};

const scoreReferenceIcon = (icon: TDesignIcon, concept: string, semanticTerms: readonly string[]) => {
  const normalizedConcept = normalizeSemanticText(concept);
  const iconTerms = [icon.name, icon.label, ...icon.keywords]
    .map(normalizeSemanticText)
    .filter(Boolean);
  let score = 0;

  iconTerms.forEach((iconTerm) => {
    if (iconTerm === normalizedConcept) score = Math.max(score, 120);
    if (normalizedConcept.length >= 2 && normalizedConcept.includes(iconTerm) && iconTerm.length >= 2) {
      score = Math.max(score, 55 + iconTerm.length);
    }
    if (iconTerm.length >= 2 && iconTerm.includes(normalizedConcept) && normalizedConcept.length >= 2) {
      score = Math.max(score, 50 + normalizedConcept.length);
    }
    semanticTerms.forEach((semanticTerm) => {
      if (iconTerm === semanticTerm) score = Math.max(score, semanticTerm === normalizedConcept ? 120 : 46);
      if (semanticTerm.length >= 2 && iconTerm.includes(semanticTerm)) {
        score = Math.max(score, 32 + semanticTerm.length);
      }
    });
  });

  return score;
};

export const resolveTDesignGenerationContext = (
  concept: string,
  icons: readonly TDesignIcon[]
): TDesignGenerationContext => {
  const family = resolveGenerationFamily(concept);
  const normalizedConcept = normalizeSemanticText(concept);
  const isShipmentConcept = /发货|寄件|寄出|派送/.test(normalizedConcept);
  const semanticTerms = buildSemanticTerms(concept);
  const preferredNames = family?.id === 'document-security'
    ? new Set(['file-locked', 'file-unlocked'])
    : family?.id === 'warehouse-flow'
      ? new Set(['institution', 'store'])
      : family?.id === 'package-flow'
        ? new Set(['inbox', 'outbox'])
        : family?.id === 'allocation-flow'
          ? new Set(['arrow-left-right-circle', 'swap'])
        : new Set<string>();

  const excludedNames = family?.id === 'package-flow' || family?.id === 'warehouse-flow' || isShipmentConcept
    ? new Set(['export', 'import', 'jump', 'jump-double', 'share', 'share-1', 'forward'])
    : new Set<string>();

  const references = icons
    .map((icon) => ({
      icon,
      score: scoreReferenceIcon(icon, concept, semanticTerms) + (preferredNames.has(icon.name) ? 80 : 0)
    }))
    .filter(({ icon }) => !excludedNames.has(icon.name))
    .filter(({ score }) => score >= 38)
    .sort((left, right) => right.score - left.score || left.icon.name.localeCompare(right.icon.name))
    .slice(0, family ? 3 : 2)
    .map(({ icon }): TDesignGenerationReference => ({
      name: icon.name,
      label: icon.label,
      keywords: icon.keywords,
      viewBox: icon.viewBox,
      body: icon.body,
      source: 'TDesign Icons official'
    }));

  return {
    family,
    references,
    stroke2Role: family?.stroke2Role ?? 'core-detail'
  };
};

const formatGenerationContext = (context?: TDesignGenerationContext) => {
  if (!context) return 'No approved reference was found. Use only the simplest universal metaphor and keep the topology minimal.';

  const familySection = context.family
    ? `FAMILY MASTER — mandatory and higher priority than all other references
- Family: ${context.family.label} (${context.family.id})
- Reference basis: ${context.family.source}
- Keyline: ${context.family.keyline}
- Locked master: ${context.family.masterRule}
- State variant: ${context.family.stateRule}
- stroke2 semantic role: ${context.stroke2Role === 'state-symbol' ? 'detached state symbol' : 'core semantic detail'}
- The locked stroke1 master must remain identical across every icon in this family. Only stroke2 may vary by state.`
    : `No locked product-family master matched this concept.
- stroke2 semantic role: core semantic detail unless an approved family explicitly classifies it as a detached state symbol.`;

  const referenceSection = context.references.length
    ? context.references.map((reference, index) => `REFERENCE ${index + 1} — ${reference.source}
- Name: ${reference.name}
- Label: ${reference.label}
- Source viewBox: ${reference.viewBox}
- Source SVG body (topology reference only):
${reference.body}`).join('\n\n')
    : 'No same-semantic TDesign reference matched.';

  return `${familySection}

APPROVED SEMANTIC REFERENCES — ordered by relevance
${referenceSection}

Use references only to determine the metaphor, object relationships, openings, direction, and state placement. Redraw them on the 32×32 TDesign v2 master; do not copy their source coordinates, fill treatment, rounded style, or element IDs. If references conflict with a locked family master, the locked family master wins.`;
};

export const buildTDesignGenerationPrompt = ({
  concept,
  hasReferenceImage,
  cornerRadius,
  context
}: GenerationPromptOptions) => {
  const sourceRule = hasReferenceImage
    ? 'First isolate the icon itself: ignore captions, labels, screenshots, and surrounding UI. Treat every visible icon stroke as structural evidence. Before drawing, identify the object count, every open endpoint, disconnected segment, junction, gap, direction, and internal mark. Preserve that topology exactly, including short strokes that might look decorative; do not close an open edge, merge two strokes, delete one side of a pair, or replace the silhouette with a familiar generic icon. Normalize only coordinates, scale, spacing, visual centering, stroke styling, and adjustable corner radius to TDesign v2.'
    : `Use the approved reference context below before drawing. Do not invent a new metaphor when a family master or same-semantic reference exists.`;

  const referenceContext = hasReferenceImage
    ? `${formatGenerationContext(context ? { ...context, references: [] } : undefined)}

The user-provided icon is the structural source. Other same-name library icons must not replace its silhouette or internal marks. A locked family master still governs geometry where applicable.`
    : formatGenerationContext(context);

  return `You are an SVG icon engineer. Create one editable outline icon following ${TDESIGN_GENERATION_STANDARD_VERSION}.

SEMANTIC INPUT
- Concept: "${concept}"
- ${sourceRule}

REFERENCE CONTEXT
${referenceContext}

DRAWING SYSTEM
- Use an exact 32×32 artboard with viewBox="0 0 32 32".
- Keep ordinary geometry inside x=2..30 and y=2..30. Semantic extremities may cross that keyline but must remain inside the artboard.
- Choose one centered keyline by visual body: horizontal 26×22, square 24×24, vertical 22×26, or circular/sparse 28×28.
- For an uploaded icon reference, match the actual outer silhouette's width-to-height ratio. A nearly square frame must stay nearly square; do not turn it into a narrow portrait frame. Preserve the exact count and placement of internal bars, arrows, and other meaningful marks.
${context?.referenceAspectRatio ? `- Measured uploaded-reference silhouette width/height ratio: ${context.referenceAspectRatio.toFixed(2)}. Keep the generated stroke1 outer silhouette within 15% of this ratio.` : ''}
${context?.referenceShape ? `- Classified uploaded-reference outer silhouette: ${context.referenceShape}. ${context.referenceShape === 'square' ? 'Use the square 24×24 keyline, x=4..28 and y=4..28; do not choose the vertical keyline.' : context.referenceShape === 'horizontal-rectangle' ? 'Use the horizontal 26×22 keyline, x=3..29 and y=5..27.' : context.referenceShape === 'vertical-rectangle' ? 'Use the vertical 22×26 keyline, x=5..27 and y=3..29.' : context.referenceShape === 'circle' ? 'Use the circular 28×28 keyline, x=2..30 and y=2..30.' : 'Preserve the unusual silhouette and select the nearest keyline by visual weight without changing its proportions.'}` : ''}
${hasReferenceImage ? '- For every rectangular frame in the reference, including frames with tabs, handles, or other attached parts, draw each adjustable exterior corner as a true right-angle vertex. Never use short diagonal bevels in place of rounded corners. Keep attached parts as separate structural strokes; the UI applies the requested radius to the frame later.' : ''}
${context?.referenceInteriorGap ? `- The reference has a separate upper horizontal bar and lower symbol. Draw them as disconnected subpaths. Keep at least ${context.referenceInteriorGap.toFixed(1)} units of centerline vertical separation between them on the 32×32 master; do not connect or crowd the arrow against the bar.` : ''}
${context?.referenceHasTopBar ? '- The reference icon has a continuous horizontal top frame stroke. Preserve that stroke across the frame; do not replace it with two isolated corner stubs or an open gap.' : ''}
- Fill the selected keyline with the complete visible geometry while preserving its proportions. Closed square frames target 24×24; sparse open or fragmented near-square silhouettes target the 28×28 sparse keyline. Horizontal and vertical silhouettes target 26×22 and 22×26 respectively. Center near (16,16). Do not treat 24 units as a universal size threshold; a thin object may have a smaller minor dimension.
- Preserve proportions. Never stretch width and height independently.
- Prefer integer or 0.5 coordinates. Angled lines should use 45° or another 15° multiple where the object permits.
- Use editable centerline paths, not expanded or filled stroke silhouettes.
- Use square line caps and hard ordinary corners. Curves must be explicit path geometry.
- The editable source master must keep every user-adjustable exterior corner sharp. The page currently applies a ${cornerRadius}-unit corner radius to stroke1 after generation; do not bake that radius or any reference-image corner radius into the SVG path. Use A/C/S/Q/T curves only for intrinsic semantic curves such as true circles, lenses, wheels, or organic contours, never merely to imitate rounded corners from the reference image.
- Compound-icon gaps should normally be 0.5-unit increments and no wider than 2.5 units.
- Use exactly one primary metaphor and at most one state modifier. Do not draw one element for every word in the concept.
${hasReferenceImage ? '- Keep all visible icon strokes, even short ones. Do not omit a source detail merely because its semantic purpose is unclear. Ignore only text or UI outside the icon.' : '- Omit tape, folds, dividers, labels, texture, and construction detail unless removing it would change the core meaning.'}
- Icons in the same semantic family must reuse the same base silhouette and keyline; vary only the state symbol.
- Prefer one outer path and one state-symbol path. Before exceeding three visible paths, remove any detail that is not semantically indispensable.

SEMANTIC LAYERS
- Put every external silhouette and outer structural line in one <g id="stroke1">.
- Put internal symbols, holes, dividers, letters, dots, status marks, and decorative details in one optional <g id="stroke2">.
- Internal details must be separate from stroke1 so global corner editing can affect only the exterior.
- Size and position the complete stroke2 bounding box inside the subject's effective interior cavity, excluding roofs, perspective faces, openings, seams, and corners. By default, neither stroke2 dimension may exceed 50% of the corresponding stroke1 dimension unless a locked family rule explicitly says otherwise.
- Geometrically center the complete state symbol first, including the arrowhead, wings, and shaft or both strokes of a cross. Only then apply at most a 0.5-unit optical correction. Never center only the shaft, one diagonal, or the path start point.
- Unless a semantic connection is explicit, stroke2 symbols must not intersect or touch stroke1. At the default 2-unit stroke, keep a visible 1.5–2.5-unit gap (normally 3.5–4.5 units between centerlines), using 0.5-unit increments.
- Measure the layer gap as the true two-dimensional shortest distance across every segment, endpoint, and curve, including diagonal-to-diagonal distances. Any centerline gap below 3.5 units is invalid even when the two bounding boxes do not overlap.
- Preserve foreground/background order with explicit path breaks. Whenever a foreground object overlaps a background outline, stop the covered background segments before the foreground boundary and resume them after it. Never draw a closed background outline and let its hidden edge pass through the middle of the foreground object; do not simulate occlusion with white fills, masks, or clipping.
- Before answering, inspect every overlap at centerline level: no supposedly hidden background segment may remain visible inside or across the foreground object's silhouette.
- Use one or more <path> elements inside those groups. Multiple disconnected subpaths are allowed.
- Each path must use fill="none", stroke="currentColor", stroke-width="2", and stroke-linecap="square".
- Use absolute path commands only: M L H V C S Q T A Z. Do not use transforms.

OUTPUT CONTRACT
- Return only one complete SVG element: <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">...</svg>.
- The SVG may contain only stroke1 and optional stroke2 groups, containing path elements only.
- Do not output Markdown, prose, comments, style, class, script, defs, clipPath, mask, text, raster images, or external references.
- Verify before answering: correct semantic topology; every overlap uses a real background-path break; adjustable exterior corners are sharp source vertices; all geometry inside 0..32; stable stroke1/stroke2 separation; no filled silhouette; no omitted or invented object.`;
};

type ValidationResult =
  | { ok: true; body: string }
  | { ok: false; reason: string };

const escapeAttribute = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/"/g, '&quot;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

type MeasuredBox = { x: number; y: number; width: number; height: number };
type MeasuredPoint = { x: number; y: number };

const MIN_LAYER_CENTERLINE_GAP = 3.5;
const PATH_SAMPLE_STEP = 0.25;
const REQUIRED_PATH_ATTRIBUTES = {
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '2',
  'stroke-linecap': 'square',
  'stroke-linejoin': 'miter'
} as const;
const OPTIONAL_PATH_ATTRIBUTES = new Set(['stroke-miterlimit']);
const PATH_PRESENTATION_ATTRIBUTES = new Set([
  ...Object.keys(REQUIRED_PATH_ATTRIBUTES),
  ...OPTIONAL_PATH_ATTRIBUTES
]);

const validateInheritedPathAttribute = (name: string, value: string) => {
  if (name in REQUIRED_PATH_ATTRIBUTES) {
    const expected = REQUIRED_PATH_ATTRIBUTES[name as keyof typeof REQUIRED_PATH_ATTRIBUTES];
    return value === expected ? null : `${name} 必须为 ${expected}`;
  }
  if (name === 'stroke-miterlimit') {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) && numericValue > 0
      ? null
      : 'stroke-miterlimit 必须为正数';
  }
  return `${name} 不是允许的描边属性`;
};

const mergeMeasuredBoxes = (left: MeasuredBox | undefined, right: MeasuredBox): MeasuredBox => {
  if (!left) return right;
  const x = Math.min(left.x, right.x);
  const y = Math.min(left.y, right.y);
  const rightEdge = Math.max(left.x + left.width, right.x + right.width);
  const bottomEdge = Math.max(left.y + left.height, right.y + right.height);
  return { x, y, width: rightEdge - x, height: bottomEdge - y };
};

const samplePathPoints = (path: SVGPathElement): MeasuredPoint[] => {
  const length = path.getTotalLength();
  if (!Number.isFinite(length)) return [];
  const sampleCount = Math.max(1, Math.ceil(length / PATH_SAMPLE_STEP));
  const points: MeasuredPoint[] = [];
  for (let index = 0; index <= sampleCount; index += 1) {
    const point = path.getPointAtLength((length * index) / sampleCount);
    points.push({ x: point.x, y: point.y });
  }
  return points;
};

const getMinimumPointDistance = (left: readonly MeasuredPoint[], right: readonly MeasuredPoint[]) => {
  let minimumSquared = Number.POSITIVE_INFINITY;
  for (const leftPoint of left) {
    for (const rightPoint of right) {
      const deltaX = leftPoint.x - rightPoint.x;
      const deltaY = leftPoint.y - rightPoint.y;
      const distanceSquared = deltaX * deltaX + deltaY * deltaY;
      if (distanceSquared < minimumSquared) minimumSquared = distanceSquared;
    }
  }
  return Math.sqrt(minimumSquared);
};

export const validateTDesignGeneratedIcon = (
  raw: string,
  context?: TDesignGenerationContext
): ValidationResult => {
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

  const allowedRootAttributes = new Set(['viewBox', 'xmlns', ...PATH_PRESENTATION_ATTRIBUTES]);
  for (const attribute of Array.from(root.attributes)) {
    if (!allowedRootAttributes.has(attribute.name)) {
      return { ok: false, reason: `svg 不允许 ${attribute.name} 属性` };
    }
    if (PATH_PRESENTATION_ATTRIBUTES.has(attribute.name)) {
      const reason = validateInheritedPathAttribute(attribute.name, attribute.value);
      if (reason) return { ok: false, reason: `svg 的 ${reason}` };
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

    const inheritedAttributes = new Map<string, string>();
    for (const attribute of Array.from(group.attributes)) {
      if (attribute.name === 'id') continue;
      if (!PATH_PRESENTATION_ATTRIBUTES.has(attribute.name)) {
        return { ok: false, reason: `${id} 图层不允许 ${attribute.name} 属性` };
      }
      const reason = validateInheritedPathAttribute(attribute.name, attribute.value);
      if (reason) return { ok: false, reason: `${id} 图层的 ${reason}` };
      inheritedAttributes.set(attribute.name, attribute.value);
      group.removeAttribute(attribute.name);
    }

    const paths = Array.from(group.children);
    if (paths.length === 0) return { ok: false, reason: `${id} 图层不能为空` };
    for (const path of paths) {
      if (path.tagName.toLowerCase() !== 'path') return { ok: false, reason: '图层内只允许 path 元素' };
      pathCount += 1;
      if (pathCount > 24) return { ok: false, reason: '路径数量过多' };
      const allowedPathAttributes = new Set([
        'd', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit'
      ]);

      Object.entries(REQUIRED_PATH_ATTRIBUTES).forEach(([name, defaultValue]) => {
        if (!path.hasAttribute(name)) {
          path.setAttribute(name, inheritedAttributes.get(name) || root.getAttribute(name) || defaultValue);
        }
      });
      const inheritedMiterLimit = inheritedAttributes.get('stroke-miterlimit') || root.getAttribute('stroke-miterlimit');
      if (!path.hasAttribute('stroke-miterlimit') && inheritedMiterLimit) {
        path.setAttribute('stroke-miterlimit', inheritedMiterLimit);
      }

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
      for (const [name, expected] of Object.entries(REQUIRED_PATH_ATTRIBUTES)) {
        if (path.getAttribute(name) !== expected) {
          return { ok: false, reason: `生成路径的 ${name} 必须为 ${expected}` };
        }
      }
      if (path.hasAttribute('stroke-miterlimit')) {
        const reason = validateInheritedPathAttribute('stroke-miterlimit', path.getAttribute('stroke-miterlimit') || '');
        if (reason) return { ok: false, reason: `生成路径的 ${reason}` };
      }
      if (id === 'stroke1') {
        const straightenedCorners = straightenFrameCornerBevels(pathData);
        if (straightenedCorners) path.setAttribute('d', straightenedCorners);
      }
    }
  }
  if (!groupIds.has('stroke1')) return { ok: false, reason: '缺少外轮廓 stroke1 图层' };

  const measurementSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  measurementSvg.setAttribute('viewBox', '0 0 32 32');
  measurementSvg.style.cssText = 'position:fixed;left:-10000px;top:-10000px;width:32px;height:32px;visibility:hidden';
  document.body.appendChild(measurementSvg);
  const measuredGroups = new Map<string, MeasuredBox>();
  const measuredPaths = new Map<string, SVGPathElement[]>();
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
      const groupId = sourcePath.parentElement?.getAttribute('id') || '';
      measuredGroups.set(groupId, mergeMeasuredBoxes(measuredGroups.get(groupId), {
        x: box.x,
        y: box.y,
        width: box.width,
        height: box.height
      }));
      measuredPaths.set(groupId, [...(measuredPaths.get(groupId) || []), path]);
    }

    // The uploaded bitmap supplies topology, not physical size. Bring a small
    // generated drawing up to the selected 32px-master keyline before checking gaps.
    if (context && !context.family?.geometry) {
      const outer = measuredGroups.get('stroke1');
      const detail = measuredGroups.get('stroke2');
      const bounds = outer && (context.referenceShape === 'square'
        || context.referenceShape === 'horizontal-rectangle'
        || context.referenceShape === 'vertical-rectangle'
        || context.referenceShape === 'circle')
        ? outer : outer && detail ? mergeMeasuredBoxes(outer, detail) : outer;
      if (bounds && bounds.width > 0 && bounds.height > 0) {
        const aspect = bounds.width / bounds.height;
        const hasOpenOuterStroke = Array.from(root.querySelectorAll('#stroke1 path'))
          .some((path) => !/Z\s*$/.test(path.getAttribute('d') || ''));
        const keyline = context.referenceShape === 'square' ? { width: 24, height: 24 }
          : context.referenceShape === 'horizontal-rectangle' ? { width: 26, height: 22 }
            : context.referenceShape === 'vertical-rectangle' ? { width: 22, height: 26 }
              : context.referenceShape === 'circle' ? { width: 28, height: 28 }
                : aspect > 1.25 ? { width: 26, height: 22 }
                  : aspect < 0.8 ? { width: 22, height: 26 }
                    // Open outlines carry less ink than closed near-square
                    // silhouettes and need the larger sparse keyline.
                    : hasOpenOuterStroke ? { width: 28, height: 28 } : { width: 24, height: 24 };
        const centerX = bounds.x + bounds.width / 2;
        const centerY = bounds.y + bounds.height / 2;
        const targetScale = Math.min(keyline.width / bounds.width, keyline.height / bounds.height);
        const scale = targetScale > 1.02 ? targetScale : 1;
        if (scale > 1 || Math.abs(centerX - 16) > 1.5 || Math.abs(centerY - 16) > 1.5) {
          const matrix = { a: scale, b: 0, c: 0, d: scale,
            e: 16 - centerX * scale, f: 16 - centerY * scale };
          const sourcePaths = Array.from(root.querySelectorAll('path'));
          const measured = Array.from(measurementSvg.querySelectorAll('path'));
          sourcePaths.forEach((path, index) => {
            let data = transformMasterGoPath(path.getAttribute('d') || '', matrix);
            path.setAttribute('d', data);
            measured[index].setAttribute('d', data);
          });
          measuredGroups.clear();
          sourcePaths.forEach((path, index) => {
            const box = measured[index].getBBox();
            if (box.x < 0 || box.y < 0 || box.x + box.width > 32 || box.y + box.height > 32) {
              throw new Error('normalized path outside artboard');
            }
            const groupId = path.parentElement?.getAttribute('id') || '';
            measuredGroups.set(groupId, mergeMeasuredBoxes(measuredGroups.get(groupId), box));
          });
        }
      }
    }

    const geometry = context?.family?.geometry;
    const stroke1Points = (measuredPaths.get('stroke1') || []).flatMap(samplePathPoints);
    let stroke2Points = (measuredPaths.get('stroke2') || []).flatMap(samplePathPoints);
    // Historical localStorage entries are revalidated without generation context.
    // Preserve those records as-is; enforce the stricter inter-layer gap on every
    // newly generated icon, which always supplies its resolved context.
    if (context && stroke1Points.length && stroke2Points.length) {
      let minimumLayerGap = getMinimumPointDistance(stroke1Points, stroke2Points);
      const requiredLayerGap = geometry?.minimumLayerGap ?? MIN_LAYER_CENTERLINE_GAP;
      if (minimumLayerGap < requiredLayerGap - 0.05 && !geometry) {
        const sourceDetails = Array.from(root.querySelectorAll('#stroke2 path'));
        const measuredDetails = measuredPaths.get('stroke2') || [];
        const originalPaths = sourceDetails.map((path) => path.getAttribute('d') || '');
        const detailBox = measuredGroups.get('stroke2');
        if (detailBox && sourceDetails.length === measuredDetails.length) {
          const centerX = detailBox.x + detailBox.width / 2;
          const centerY = detailBox.y + detailBox.height / 2;
          // A coarse distance field rejects impossible placements cheaply. The
          // exact sampled-path distance is still checked before accepting one.
          const gridSize = 129;
          const field = new Float32Array(gridSize * gridSize);
          for (let gy = 0; gy < gridSize; gy += 1) {
            for (let gx = 0; gx < gridSize; gx += 1) {
              const x = gx / 4;
              const y = gy / 4;
              let nearest = Number.POSITIVE_INFINITY;
              for (const point of stroke1Points) {
                const squared = (point.x - x) ** 2 + (point.y - y) ** 2;
                if (squared < nearest) nearest = squared;
              }
              field[gy * gridSize + gx] = nearest;
            }
          }
          let repaired = false;
          for (let scaleStep = 20; scaleStep >= 5; scaleStep -= 1) {
            const scale = scaleStep / 20;
            const halfWidth = detailBox.width * scale / 2;
            const halfHeight = detailBox.height * scale / 2;
            const centers: Array<[number, number]> = [[centerX, centerY]];
            for (let cy = Math.ceil((2 + halfHeight) * 2) / 2; cy <= 30 - halfHeight; cy += 0.5) {
              for (let cx = Math.ceil((2 + halfWidth) * 2) / 2; cx <= 30 - halfWidth; cx += 0.5) {
                centers.push([cx, cy]);
              }
            }
            centers.sort((a, b) => (a[0] - centerX) ** 2 + (a[1] - centerY) ** 2
              - (b[0] - centerX) ** 2 - (b[1] - centerY) ** 2);
            for (const [candidateCenterX, candidateCenterY] of centers) {
              if (candidateCenterX - halfWidth < 2 || candidateCenterY - halfHeight < 2
                || candidateCenterX + halfWidth > 30 || candidateCenterY + halfHeight > 30) continue;
              const dx = candidateCenterX - centerX;
              const dy = candidateCenterY - centerY;
              const candidatePoints = stroke2Points.map((point) => ({
                x: centerX + (point.x - centerX) * scale + dx,
                y: centerY + (point.y - centerY) * scale + dy
              }));
              if (candidatePoints.some((point) => {
                const gx = Math.max(0, Math.min(128, Math.round(point.x * 4)));
                const gy = Math.max(0, Math.min(128, Math.round(point.y * 4)));
                return field[gy * gridSize + gx] < (requiredLayerGap - 0.25) ** 2;
              })) continue;
              const gap = getMinimumPointDistance(stroke1Points, candidatePoints);
              if (gap < requiredLayerGap - 0.05) continue;
              const matrix = {
                a: scale, b: 0, c: 0, d: scale,
                e: centerX * (1 - scale) + dx,
                f: centerY * (1 - scale) + dy
              };
              const adjusted = originalPaths.map((path) => transformMasterGoPath(path, matrix));
              adjusted.forEach((path, index) => measuredDetails[index].setAttribute('d', path));
              const boxes = measuredDetails.map((path) => path.getBBox());
              if (boxes.some((box) => box.x < 0 || box.y < 0
                || box.x + box.width > 32 || box.y + box.height > 32)) continue;
              const points = measuredDetails.flatMap(samplePathPoints);
              const finalGap = getMinimumPointDistance(stroke1Points, points);
              if (finalGap < requiredLayerGap - 0.05) continue;
              adjusted.forEach((path, index) => sourceDetails[index].setAttribute('d', path));
              stroke2Points = points;
              minimumLayerGap = finalGap;
              measuredGroups.set('stroke2', boxes.reduce<MeasuredBox | undefined>((merged, box) =>
                mergeMeasuredBoxes(merged, box), undefined)!);
              repaired = true;
              break;
            }
            if (repaired) break;
          }
          if (!repaired) originalPaths.forEach((path, index) => measuredDetails[index].setAttribute('d', path));
        }
      }
      if (minimumLayerGap < requiredLayerGap - 0.05) {
        return {
          ok: false,
          reason: `stroke1 与 stroke2 的中心线最短距离仅 ${minimumLayerGap.toFixed(2)}，必须至少为 ${requiredLayerGap}`
        };
      }
    }

    if (context?.referenceInteriorGap && !geometry) {
      const sourceDetails = Array.from(root.querySelectorAll('#stroke2 path'));
      const measuredDetails = measuredPaths.get('stroke2') || [];
      const originalPaths = sourceDetails.map((path) => path.getAttribute('d') || '');
      const pieces = originalPaths.flatMap((path, sourceIndex) => path.trim().split(/(?=M)/)
        .filter(Boolean).map((data) => ({ sourceIndex, data })));
      const temporary = pieces.map(({ data }) => {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', data);
        measurementSvg.appendChild(path);
        return path;
      });
      try {
        const boxes = temporary.map((path) => path.getBBox());
        const barIndex = boxes.findIndex((box) => box.width >= 6 && box.height < 0.3
          && box.y < 16 && Math.abs(box.x + box.width / 2 - 16) <= 3);
        if (barIndex >= 0) {
          const bar = boxes[barIndex];
          const lowerIndices = boxes.flatMap((box, index) => index !== barIndex
            && box.y > bar.y + 0.3 && box.x < bar.x + bar.width
            && box.x + box.width > bar.x ? [index] : []);
          if (lowerIndices.length) {
            const currentGap = Math.min(...lowerIndices.map((index) => boxes[index].y)) - bar.y;
            if (currentGap < context.referenceInteriorGap - 0.05) {
              const delta = context.referenceInteriorGap - currentGap;
              let repaired = false;
              for (const upperShare of [0.5, 0.75, 0.25, 1, 0]) {
                const updated = pieces.map((piece, index) => {
                  const dy = index === barIndex ? -delta * upperShare
                    : lowerIndices.includes(index) ? delta * (1 - upperShare) : 0;
                  return dy ? transformMasterGoPath(piece.data, {
                    a: 1, b: 0, c: 0, d: 1, e: 0, f: dy
                  }) : piece.data;
                });
                const joined = originalPaths.map((_, sourceIndex) => updated
                  .filter((_, index) => pieces[index].sourceIndex === sourceIndex).join(' '));
                joined.forEach((data, index) => measuredDetails[index].setAttribute('d', data));
                const newBoxes = measuredDetails.map((path) => path.getBBox());
                if (newBoxes.some((box) => box.x < 0 || box.y < 0
                  || box.x + box.width > 32 || box.y + box.height > 32)) continue;
                const points = measuredDetails.flatMap(samplePathPoints);
                if (getMinimumPointDistance(stroke1Points, points) < MIN_LAYER_CENTERLINE_GAP - 0.05) continue;
                joined.forEach((data, index) => sourceDetails[index].setAttribute('d', data));
                measuredGroups.set('stroke2', newBoxes.reduce<MeasuredBox | undefined>((merged, box) =>
                  mergeMeasuredBoxes(merged, box), undefined)!);
                repaired = true;
                break;
              }
              if (!repaired) {
                originalPaths.forEach((data, index) => measuredDetails[index].setAttribute('d', data));
                return { ok: false, reason: `内部横线与箭头间距不足，参考图要求约 ${context.referenceInteriorGap.toFixed(1)} 的中心线间距` };
              }
            }
          }
        }
      } finally {
        temporary.forEach((path) => path.remove());
      }
    }

    const stroke1Box = measuredGroups.get('stroke1');
    const stroke2Box = measuredGroups.get('stroke2');
    if (context?.referenceHasTopBar && stroke1Box) {
      const rows = new Map<number, number[]>();
      for (const point of stroke1Points) {
        if (point.y > stroke1Box.y + stroke1Box.height * 0.4) continue;
        const row = Math.round(point.y * 2);
        rows.set(row, [...(rows.get(row) || []), point.x]);
      }
      const continuousTop = [...rows.values()].some((points) => {
        points.sort((a, b) => a - b);
        return points.length > 1 && points[points.length - 1] - points[0] >= stroke1Box.width * 0.55
          && points.every((x, index) => index === 0 || x - points[index - 1] <= 1);
      });
      if (!continuousTop) return { ok: false, reason: '参考图顶部有连续横线，生成外框不能缺失中间横线' };
    }
    const referenceKeyline = context?.referenceShape === 'square'
      ? { width: 24, height: 24 }
      : context?.referenceShape === 'horizontal-rectangle'
        ? { width: 26, height: 22 }
        : context?.referenceShape === 'vertical-rectangle'
          ? { width: 22, height: 26 }
          : context?.referenceShape === 'circle'
            ? { width: 28, height: 28 }
            : undefined;
    if (referenceKeyline && stroke1Box && !context?.family?.geometry) {
      const widthError = Math.abs(stroke1Box.width - referenceKeyline.width);
      const heightError = Math.abs(stroke1Box.height - referenceKeyline.height);
      const centerX = stroke1Box.x + stroke1Box.width / 2;
      const centerY = stroke1Box.y + stroke1Box.height / 2;
      if (widthError > 1.5 || heightError > 1.5 || Math.abs(centerX - 16) > 1
        || Math.abs(centerY - 16) > 1) {
        return { ok: false, reason: `参考图形状应使用 ${referenceKeyline.width}×${referenceKeyline.height} Keyline 并居中，当前外轮廓为 ${stroke1Box.width.toFixed(1)}×${stroke1Box.height.toFixed(1)}` };
      }
      if (context?.referenceShape !== 'circle') {
        const corners = [
          { x: stroke1Box.x, y: stroke1Box.y },
          { x: stroke1Box.x + stroke1Box.width, y: stroke1Box.y },
          { x: stroke1Box.x, y: stroke1Box.y + stroke1Box.height },
          { x: stroke1Box.x + stroke1Box.width, y: stroke1Box.y + stroke1Box.height }
        ];
        if (corners.some((corner) => stroke1Points.every((point) =>
          Math.hypot(point.x - corner.x, point.y - corner.y) > 0.75))) {
          return { ok: false, reason: '参考图是圆角矩形：SVG 母版必须保留四个直角顶点，不能画成斜切角或八边形；圆角由页面参数处理' };
        }
      }
    }
    if (context?.referenceAspectRatio && stroke1Box && stroke1Box.height > 0) {
      const actualRatio = stroke1Box.width / stroke1Box.height;
      const ratioError = Math.abs(actualRatio / context.referenceAspectRatio - 1);
      if (ratioError > 0.15) {
        return { ok: false, reason: `外轮廓宽高比 ${actualRatio.toFixed(2)} 与参考图 ${context.referenceAspectRatio.toFixed(2)} 不符` };
      }
    }
    // The 32×32 viewBox alone does not guarantee a correctly sized icon.
    // Apply this conservative gate only to free-form generations: fixed families
    // have their own exact geometry, while thin objects may have a small minor axis.
    if (context && !geometry && stroke1Box) {
      const wholeBox = stroke2Box ? mergeMeasuredBoxes(stroke1Box, stroke2Box) : stroke1Box;
      if (Math.max(wholeBox.width, wholeBox.height) < 23.5) {
        return { ok: false, reason: '图形主体过小：32×32 母版中最长方向至少应接近 24px Keyline' };
      }
      const centerX = wholeBox.x + wholeBox.width / 2;
      const centerY = wholeBox.y + wholeBox.height / 2;
      if (Math.abs(centerX - 16) > 1.5 || Math.abs(centerY - 16) > 1.5) {
        return { ok: false, reason: '图形未在 32×32 母版中居中，请按所选 Keyline 调整主体位置' };
      }
    }
    if (
      context?.stroke2Role === 'state-symbol'
      && stroke1Box
      && stroke2Box
      && !geometry?.stroke2MaxSize
    ) {
      const defaultMaximumWidth = stroke1Box.width * 0.5;
      const defaultMaximumHeight = stroke1Box.height * 0.5;
      const tolerance = 0.05;
      if (
        stroke2Box.width > defaultMaximumWidth + tolerance
        || stroke2Box.height > defaultMaximumHeight + tolerance
      ) {
        return {
          ok: false,
          reason: `stroke2 状态图形过大，默认不得超过主体对应尺寸的 50%（当前上限 ${defaultMaximumWidth.toFixed(1)}×${defaultMaximumHeight.toFixed(1)}）`
        };
      }
    }

    if (geometry) {
      const familyLabel = context?.family?.label || '当前图标家族';
      const expected = geometry.stroke1;
      const tolerance = 0.05;
      if (!stroke1Box || [
        Math.abs(stroke1Box.x - expected.x),
        Math.abs(stroke1Box.y - expected.y),
        Math.abs(stroke1Box.width - expected.width),
        Math.abs(stroke1Box.height - expected.height)
      ].some((difference) => difference > tolerance)) {
        return {
          ok: false,
          reason: `${familyLabel}的 stroke1 必须符合 ${expected.width}×${expected.height} Keyline，并保持画板居中`
        };
      }
      if (geometry.stroke2Center) {
        if (!stroke2Box) return { ok: false, reason: `${familyLabel}缺少规定的 stroke2 状态图形` };
        const centerX = stroke2Box.x + stroke2Box.width / 2;
        const centerY = stroke2Box.y + stroke2Box.height / 2;
        if (
          Math.abs(centerX - geometry.stroke2Center.x) > geometry.stroke2Center.tolerance
          || Math.abs(centerY - geometry.stroke2Center.y) > geometry.stroke2Center.tolerance
        ) {
          return { ok: false, reason: `${familyLabel}的 stroke2 未与外轮廓几何居中` };
        }
      }
      if (
        stroke2Box
        && geometry.stroke2MaxSize
        && (stroke2Box.width > geometry.stroke2MaxSize.width + tolerance
          || stroke2Box.height > geometry.stroke2MaxSize.height + tolerance)
      ) {
        return { ok: false, reason: `${familyLabel}的内部图形过大，未保留规定留白` };
      }
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
