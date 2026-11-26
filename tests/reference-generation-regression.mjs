import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

const loadExports = (source) => {
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
  }).outputText;
  const sandbox = { exports: {}, require: () => ({}) };
  runInNewContext(compiled, sandbox);
  return sandbox.exports;
};

const page = readFileSync(new URL('../src/TDesignSmartPage.tsx', import.meta.url), 'utf8');
const analysisSource = page.slice(
  page.indexOf('export const analyzeReferenceShape ='),
  page.indexOf('\nconst simulatedIdentityIcon')
);
const { analyzeReferenceShape } = loadExports(analysisSource);
const { straightenFrameCornerBevels } = loadExports(
  readFileSync(new URL('../src/fs-node-icon.tsx', import.meta.url), 'utf8')
);
const { resolveTDesignGenerationContext, buildTDesignGenerationPrompt, selectFreeformKeyline } = loadExports(
  readFileSync(new URL('../src/tdesign-generation.ts', import.meta.url), 'utf8')
);
assert.deepEqual(JSON.parse(JSON.stringify(selectFreeformKeyline(1, true, 82, 26))),
  { width: 24, height: 24 }, 'a dense open document must use the square keyline');
assert.deepEqual(JSON.parse(JSON.stringify(selectFreeformKeyline(1, true, 35, 26))),
  { width: 28, height: 28 }, 'a genuinely sparse open icon may use the larger keyline');

const libraryMatch = resolveTDesignGenerationContext('订单', [
  { name: 'task', label: '任务', keywords: ['订单', '夹板'], viewBox: '0 0 24 24',
    body: '<path id="stroke1" d="M8 6H4V22H20V6H16" />' },
  { name: 'unrelated', label: '月亮', keywords: [], viewBox: '0 0 24 24', body: '<path d="M1 1" />' }
]);
assert.equal(libraryMatch.references[0]?.name, 'task');
const libraryPrompt = buildTDesignGenerationPrompt({ concept: '订单', hasReferenceImage: true,
  cornerRadius: 0, context: { ...libraryMatch, family: undefined } });
assert.match(libraryPrompt, /M8 6H4V22H20V6H16/,
  'uploaded-reference prompts must include matching current-library geometry');
assert.match(libraryPrompt, /copy its existing geometry as the starting drawing/);

const makeImage = () => {
  const width = 128;
  const height = 128;
  const data = new Uint8ClampedArray(width * height * 4);
  data.fill(255);
  const mark = (cx, cy, radius = 2) => {
    for (let y = Math.round(cy - radius); y <= cy + radius; y += 1) {
      for (let x = Math.round(cx - radius); x <= cx + radius; x += 1) {
        if (x < 0 || x >= width || y < 0 || y >= height
          || (x - cx) ** 2 + (y - cy) ** 2 > radius ** 2) continue;
        const index = (y * width + x) * 4;
        data[index] = data[index + 1] = data[index + 2] = 50;
      }
    }
  };
  const line = (ax, ay, bx, by) => {
    const steps = Math.ceil(Math.hypot(bx - ax, by - ay) * 3);
    for (let i = 0; i <= steps; i += 1) {
      mark(ax + (bx - ax) * i / steps, ay + (by - ay) * i / steps);
    }
  };
  const circle = (cx, cy, radius) => {
    for (let i = 0; i <= 720; i += 1) {
      const angle = 2 * Math.PI * i / 720;
      mark(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
    }
  };
  const analyze = () => analyzeReferenceShape({ width, height }, {
    getImageData: () => ({ data })
  });
  return { line, circle, analyze };
};

const frame = makeImage();
for (const [a, b] of [
  [[32, 20], [96, 20]], [[96, 20], [108, 32]], [[108, 32], [108, 96]],
  [[108, 96], [96, 108]], [[96, 108], [32, 108]], [[32, 108], [20, 96]],
  [[20, 96], [20, 32]], [[20, 32], [32, 20]]
]) frame.line(...a, ...b);
assert.equal(frame.analyze()?.hasFullRectangularFrame, true,
  'a rounded or beveled full frame needs sharp master corners');

const box = makeImage();
for (const [a, b] of [
  [[36, 20], [92, 20]], [[92, 20], [108, 50]], [[108, 50], [108, 108]],
  [[108, 108], [20, 108]], [[20, 108], [20, 50]], [[20, 50], [36, 20]]
]) box.line(...a, ...b);
assert.notEqual(box.analyze()?.shape, 'circle', 'a box must not be mistaken for a circle');
assert.equal(box.analyze()?.hasFullRectangularFrame, false,
  'a square-keyline box with a sloped lid is not a four-corner rectangle');

const ring = makeImage();
ring.circle(64, 64, 35);
for (const [x, y] of [[64, 29], [34, 82], [94, 82]]) ring.circle(x, y, 8);
assert.equal(ring.analyze()?.hasSingleConnectedSubject, true,
  'nodes touching a ring are one connected subject');

const clipboard = makeImage();
for (const [a, b] of [
  [[28, 24], [100, 24]], [[100, 24], [100, 108]],
  [[100, 108], [28, 108]], [[28, 108], [28, 24]],
  [[52, 20], [76, 20]], [[52, 20], [52, 28]],
  [[76, 20], [76, 28]], [[52, 28], [76, 28]]
]) clipboard.line(...a, ...b);
clipboard.line(43, 65, 58, 80);
clipboard.line(58, 80, 85, 51);
assert.equal(clipboard.analyze()?.hasSingleConnectedSubject, false,
  'a separate check mark must keep its own spacing rule');
assert.equal(clipboard.analyze()?.hasCenteredTopTab, true,
  'a centered clipboard tab must interrupt the visible frame top');
assert.equal(clipboard.analyze()?.shape, 'vertical-rectangle',
  'one centered tab must not turn a vertically rectangular icon into a square');

const slopedBoxPath = 'M4 10 L6 5 L26 5 L28 10 L28 25 L25 28 L7 28 L4 25 Z';
const repaired = straightenFrameCornerBevels(slopedBoxPath, { preserveTopDiagonals: true });
assert.match(repaired, /L6 5 L26 5 L28 10/, 'structural lid slopes stay intact');
assert.match(repaired, /L28 28 L4 28/, 'bottom rounded corners become right angles');

console.log('reference topology regression passed');
