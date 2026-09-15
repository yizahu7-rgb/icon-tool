import fs from 'node:fs/promises';
import path from 'node:path';
import {
  findMats,
  getBranches,
  getBranchBeziers,
  getPathsFromStr
} from 'flo-mat';

const projectRoot = process.cwd();
const auditPath = path.join(projectRoot, 'scripts/iconfont-centerline-audit.json');
const source26815Path = path.join(projectRoot, 'scripts/iconfont-source-26815.json');
const source54209Path = path.join(projectRoot, 'scripts/iconfont-source-54209.json');
const outputPath = path.join(projectRoot, 'src/iconfont-source-icons.generated.ts');
const sourceToGrid = 24 / 1024;

// These are genuinely filled glyphs rather than outline icons. They are intentionally
// omitted from the editable linear library at the product owner's request.
const solidIconNames = new Set([
  '筛选-填充',
  '发送-填充',
  '收藏-已收藏',
  '引用',
  '点赞-填充',
  '理财',
  '充值',
  '卖出',
  '买入',
  '播放',
  '耳机',
  '三角-右',
  '三角-下',
  '三角-上',
  '三角-左',
  '点-小',
  '点-大',
  '面积图',
  '指南针',
  '环形图',
  '饼状图',
  '云-上传',
  '云-失败',
  '云',
  '云-下载',
  '调色盘',
  '协同',
  '支付宝支付',
  '基金',
  '数据转换',
  '金融循环'
]);

const format = (value) => Number(value.toFixed(4));
const point = (x, y) => [x, y];
const samePoint = (a, b, tolerance = 1e-5) =>
  Math.abs(a[0] - b[0]) <= tolerance && Math.abs(a[1] - b[1]) <= tolerance;

const unit = (from, to) => {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const length = Math.hypot(dx, dy);
  return length < 1e-6 ? null : [dx / length, dy / length];
};

const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
const cross = (a, b) => a[0] * b[1] - a[1] * b[0];

const lineIntersection = (originA, directionA, originB, directionB) => {
  const denominator = cross(directionA, directionB);
  if (Math.abs(denominator) < 1e-4) return null;
  const offset = [originB[0] - originA[0], originB[1] - originA[1]];
  const distance = cross(offset, directionB) / denominator;
  return [originA[0] + directionA[0] * distance, originA[1] + directionA[1] * distance];
};

const tokenizePath = (value) => value.match(/[MLQC]|[-+]?(?:\d*\.?\d+)(?:e[-+]?\d+)?/gi) ?? [];

const parseCenterlinePath = (value) => {
  const tokens = tokenizePath(value);
  const commands = [];
  let cursor = point(0, 0);
  let index = 0;
  while (index < tokens.length) {
    const type = tokens[index++].toUpperCase();
    const number = () => Number(tokens[index++]);
    if (type === 'M' || type === 'L') {
      const end = point(number(), number());
      commands.push({ type, start: cursor, end });
      cursor = end;
    } else if (type === 'Q') {
      const control = point(number(), number());
      const end = point(number(), number());
      commands.push({ type, start: cursor, control, end });
      cursor = end;
    } else if (type === 'C') {
      const control1 = point(number(), number());
      const control2 = point(number(), number());
      const end = point(number(), number());
      commands.push({ type, start: cursor, control1, control2, end });
      cursor = end;
    }
  }
  return commands;
};

const serializeCommands = (commands) => commands.map((command) => {
  if (command.type === 'M' || command.type === 'L') return `${command.type}${format(command.end[0])} ${format(command.end[1])}`;
  if (command.type === 'Q') return `Q${format(command.control[0])} ${format(command.control[1])} ${format(command.end[0])} ${format(command.end[1])}`;
  return `C${format(command.control1[0])} ${format(command.control1[1])} ${format(command.control2[0])} ${format(command.control2[1])} ${format(command.end[0])} ${format(command.end[1])}`;
}).join(' ');

const distanceToLine = (candidate, start, end) => {
  const direction = unit(start, end);
  if (!direction) return Math.hypot(candidate[0] - start[0], candidate[1] - start[1]);
  return Math.abs(cross([candidate[0] - start[0], candidate[1] - start[1]], direction));
};

const linearizeStraightCurves = (commands) => commands.map((command) => {
  if (command.type === 'Q' && distanceToLine(command.control, command.start, command.end) <= 0.035) {
    return { type: 'L', start: command.start, end: command.end };
  }
  if (command.type === 'C' &&
      distanceToLine(command.control1, command.start, command.end) <= 0.035 &&
      distanceToLine(command.control2, command.start, command.end) <= 0.035) {
    return { type: 'L', start: command.start, end: command.end };
  }
  return command;
});

const getStartTangent = (command) => command.type === 'Q'
  ? unit(command.start, command.control)
  : unit(command.start, command.control1);

const getEndTangent = (command) => command.type === 'Q'
  ? unit(command.control, command.end)
  : unit(command.control2, command.end);

// Iconfont expands every stroke to a filled outline. The medial axis therefore
// contains the original small corner fillets. Collapse only those short fillets
// back to a single editable vertex; semantic curves (circles, shields, clouds,
// handles) stay untouched.
const collapseSmallCornerRuns = (commands) => {
  if (commands.length < 4) return commands;
  const output = [commands[0]];
  let index = 1;

  while (index < commands.length) {
    const current = commands[index];
    if (!['Q', 'C'].includes(current.type) || commands[index - 1]?.type !== 'L') {
      output.push(current);
      index += 1;
      continue;
    }

    let endIndex = index;
    while (endIndex < commands.length && ['Q', 'C'].includes(commands[endIndex].type)) endIndex += 1;
    const next = commands[endIndex];
    const firstCurve = commands[index];
    const lastCurve = commands[endIndex - 1];
    const previous = commands[index - 1];
    const startTangent = getStartTangent(firstCurve);
    const endTangent = getEndTangent(lastCurve);
    const previousDirection = unit(previous.start, previous.end);
    const nextDirection = next?.type === 'L' ? unit(next.start, next.end) : null;

    if (!startTangent || !endTangent || !previousDirection || !nextDirection ||
        dot(startTangent, previousDirection) < 0.9 || dot(endTangent, nextDirection) < 0.9) {
      output.push(current);
      index += 1;
      continue;
    }

    const corner = lineIntersection(firstCurve.start, startTangent, lastCurve.end, endTangent);
    const startDistance = corner ? Math.hypot(corner[0] - firstCurve.start[0], corner[1] - firstCurve.start[1]) : Infinity;
    const endDistance = corner ? Math.hypot(corner[0] - lastCurve.end[0], corner[1] - lastCurve.end[1]) : Infinity;
    const turn = Math.abs(cross(startTangent, endTangent));
    const startAhead = corner ? dot([corner[0] - firstCurve.start[0], corner[1] - firstCurve.start[1]], startTangent) > -0.02 : false;
    const endAhead = corner ? dot([lastCurve.end[0] - corner[0], lastCurve.end[1] - corner[1]], endTangent) > -0.02 : false;

    if (!corner || startDistance > 2.25 || endDistance > 2.25 || turn < 0.08 || !startAhead || !endAhead) {
      output.push(current);
      index += 1;
      continue;
    }

    output.push({ type: 'L', start: firstCurve.start, end: corner });
    index = endIndex;
  }

  return output;
};

const canonicalizeSmallCorners = (value) => {
  const parsed = parseCenterlinePath(value);
  const firstPass = collapseSmallCornerRuns(parsed);
  const linearized = linearizeStraightCurves(firstPass);
  const secondPass = collapseSmallCornerRuns(linearized);
  return serializeCommands(secondPass);
};

const getPathBounds = (value) => {
  const commands = parseCenterlinePath(value);
  const points = commands.flatMap((command) => {
    if (command.type === 'Q') return [command.start, command.control, command.end];
    if (command.type === 'C') return [command.start, command.control1, command.control2, command.end];
    return [command.start, command.end];
  });
  const xs = points.map((item) => item[0]);
  const ys = points.map((item) => item[1]);
  return {
    x: Math.min(...xs),
    y: Math.min(...ys),
    width: Math.max(...xs) - Math.min(...xs),
    height: Math.max(...ys) - Math.min(...ys)
  };
};

const splitPathsAndDots = (paths) => {
  const editablePaths = [];
  const dots = [];
  for (const value of paths) {
    const bounds = getPathBounds(value);
    if (bounds.width <= 0.18 && bounds.height <= 0.18) {
      dots.push({ x: format(bounds.x + bounds.width / 2), y: format(bounds.y + bounds.height / 2) });
    } else {
      editablePaths.push(canonicalizeSmallCorners(value));
    }
  }
  return { paths: editablePaths, dots };
};

const cleanBeziers = (beziers) => beziers.filter((bezier) =>
  bezier.length >= 2 && bezier.slice(1).some((item) => !samePoint(item, bezier[0])));

const bezierBranchToPath = (beziers) => {
  const cleaned = cleanBeziers(beziers);
  if (!cleaned.length) return '';
  const output = [];
  let cursor = null;
  for (const bezier of cleaned) {
    const map = (item) => item.map((value) => format(value * sourceToGrid));
    const start = map(bezier[0]);
    const end = map(bezier.at(-1));
    if (!cursor || !samePoint(start, cursor, 1e-3)) output.push(`M${start[0]} ${start[1]}`);
    if (bezier.length === 2) output.push(`L${end[0]} ${end[1]}`);
    if (bezier.length === 3) {
      const control = map(bezier[1]);
      output.push(`Q${control[0]} ${control[1]} ${end[0]} ${end[1]}`);
    }
    if (bezier.length === 4) {
      const control1 = map(bezier[1]);
      const control2 = map(bezier[2]);
      output.push(`C${control1[0]} ${control1[1]} ${control2[0]} ${control2[1]} ${end[0]} ${end[1]}`);
    }
    cursor = end;
  }
  return output.join(' ');
};

const extractPathData = (svgInner) => svgInner.match(/\sd="([^"]+)"/)?.[1] ?? '';

const analyzeFallbackLink = async () => {
  const source54209 = JSON.parse(await fs.readFile(source54209Path, 'utf8'));
  const icon = source54209.find((item) => item.name === '链接');
  const loops = getPathsFromStr(extractPathData(icon.svgInner));
  const mats = findMats(loops, { maxCurviness: 0.6, maxLength: 50 });
  const paths = mats.flatMap((mat) => getBranches(mat.cpNode).map((branch) => bezierBranchToPath(getBranchBeziers(branch[0]))).filter(Boolean));
  return splitPathsAndDots(paths);
};

// Attachment is the only SDICS outline whose expanded compound path makes the
// medial-axis library diverge. This is the same source geometry reconstructed as
// a single editable paperclip centerline.
const attachment = {
  paths: [
    'M20.5 11.5 L11.42 20.58 C9.27 22.73 5.78 22.73 3.63 20.58 C1.48 18.43 1.48 14.94 3.63 12.79 L12.83 3.59 C14.2 2.22 16.42 2.22 17.79 3.59 C19.16 4.96 19.16 7.18 17.79 8.55 L8.59 17.75 C8 18.34 7.05 18.34 6.46 17.75 C5.87 17.16 5.87 16.21 6.46 15.62 L14.95 7.13'
  ],
  dots: []
};

// The SDICS compound outline crashes flo-mat before it can return a medial
// axis. Reconstruct its two rounded chain strokes directly on the 24 grid so
// the correct diagonal source glyph is kept instead of silently substituting
// the unrelated AntChain overlapping-squares icon with the same Chinese name.
const link = {
  paths: [
    'M10 13 C8.047 14.953 8.047 18.119 10 20.071 C11.953 22.024 15.119 22.024 17.071 20.071 L20.071 17.071 C22.024 15.119 22.024 11.953 20.071 10 C18.119 8.047 14.953 8.047 13 10 L11.28 11.72',
    'M14 11 C15.953 9.047 15.953 5.881 14 3.929 C12.047 1.976 8.881 1.976 6.929 3.929 L3.929 6.929 C1.976 8.881 1.976 12.047 3.929 14 C5.881 15.953 9.047 15.953 11 14 L12.72 12.28'
  ],
  dots: []
};

const dragDots = {
  '拖拽-竖': [
    { x: 8.5, y: 5.5 }, { x: 15.5, y: 5.5 },
    { x: 8.5, y: 12 }, { x: 15.5, y: 12 },
    { x: 8.5, y: 18.5 }, { x: 15.5, y: 18.5 }
  ],
  '拖拽-横': [
    { x: 5.5, y: 8.5 }, { x: 12, y: 8.5 }, { x: 18.5, y: 8.5 },
    { x: 5.5, y: 15.5 }, { x: 12, y: 15.5 }, { x: 18.5, y: 15.5 }
  ]
};

const { results } = JSON.parse(await fs.readFile(auditPath, 'utf8'));
const sourceIdByName = Object.fromEntries(results.map((icon) => [icon.name, String(icon.sourceId)]));
const source54209 = JSON.parse(await fs.readFile(source54209Path, 'utf8'));
const fallbackSourceId = (name) => String(source54209.find((icon) => icon.name === name)?.sourceId ?? '');
const generated = {};
for (const icon of results) {
  if (solidIconNames.has(icon.name)) continue;
  const normalized = splitPathsAndDots(icon.centerlinePaths);
  generated[icon.name] = {
    collectionId: icon.collectionId,
    sourceId: String(icon.sourceId),
    paths: normalized.paths,
    dots: dragDots[icon.name] ?? [...normalized.dots, ...(icon.dots ?? []).map(({ x, y }) => ({ x, y }))]
  };
}

generated['链接'] = { collectionId: 54209, sourceId: fallbackSourceId('链接'), ...link };
generated['附件'] = { collectionId: 54209, sourceId: fallbackSourceId('附件'), ...attachment };
generated['锁'] = {
  collectionId: 54209,
  sourceId: sourceIdByName['锁'],
  paths: [
    'M4 11 L20 11 L20 21 L4 21 Z',
    'M6 11 L6 10',
    'M18 11 L18 10'
  ],
  dots: []
};
generated['密码箱-关闭'] = {
  collectionId: 54209,
  sourceId: sourceIdByName['密码箱-关闭'],
  paths: [
    'M3 4 L21 4 L21 19 L3 19 Z',
    'M5 19 L5 20.65',
    'M19 19 L19 20.65',
    'M12 7.15 L12 14.47'
  ],
  dots: []
};

const source = `/* eslint-disable */\n// Generated by scripts/generate-iconfont-source-data.mjs. Do not edit manually.\n\nexport type IconfontSourceIconData = {\n  readonly collectionId: number;\n  readonly sourceId: string;\n  readonly paths: readonly string[];\n  readonly dots: readonly { readonly x: number; readonly y: number }[];\n  readonly strokeRelativeSegments?: readonly {\n    readonly x: number;\n    readonly y: number;\n    readonly dx: number;\n    readonly dy: number;\n    readonly lengthMultiplier: number;\n  }[];\n};\n\nexport const iconfontSolidIconNames = new Set<string>(${JSON.stringify([...solidIconNames], null, 2)});\n\nexport const iconfontSourceIconData = ${JSON.stringify(generated, null, 2)} as const satisfies Record<string, IconfontSourceIconData>;\n`;

await fs.writeFile(outputPath, source);
console.log(`Wrote ${Object.keys(generated).length} editable line icons to ${outputPath}; excluded ${solidIconNames.size} filled icons.`);
