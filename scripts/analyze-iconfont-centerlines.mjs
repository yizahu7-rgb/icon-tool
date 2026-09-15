import fs from 'node:fs/promises';
import path from 'node:path';
import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads';
import {
  findMats,
  getAllVertices,
  getBranches,
  getBranchBeziers,
  getPathsFromStr
} from 'flo-mat';

const projectRoot = process.cwd();
const source26815Path = path.join(projectRoot, 'scripts/iconfont-source-26815.json');
const source54209Path = path.join(projectRoot, 'scripts/iconfont-source-54209.json');
const outputPath = path.join(projectRoot, 'scripts/iconfont-centerline-audit.json');
const sourceToGrid = 24 / 1024;

const format = (value) => Number((value * sourceToGrid).toFixed(4));
const samePoint = (a, b, tolerance = 1e-5) =>
  Math.abs(a[0] - b[0]) <= tolerance && Math.abs(a[1] - b[1]) <= tolerance;

const extractPathData = (svgInner) => {
  const match = svgInner.match(/\sd="([^"]+)"/);
  if (!match) throw new Error('Source SVG has no path data');
  return match[1];
};

const cleanBeziers = (beziers) => beziers.filter((bezier) => {
  if (bezier.length < 2) return false;
  return bezier.slice(1).some((point) => !samePoint(point, bezier[0]));
});

const beziersToPath = (beziers, close = false) => {
  const cleaned = cleanBeziers(beziers);
  if (!cleaned.length) return '';
  let cursor = null;
  const commands = [];

  for (const bezier of cleaned) {
    const start = bezier[0].map(format);
    const end = bezier[bezier.length - 1].map(format);
    if (!cursor || !samePoint(start, cursor, 1e-3)) commands.push(`M${start[0]} ${start[1]}`);

    if (bezier.length === 2) {
      commands.push(`L${end[0]} ${end[1]}`);
    } else if (bezier.length === 3) {
      const control = bezier[1].map(format);
      commands.push(`Q${control[0]} ${control[1]} ${end[0]} ${end[1]}`);
    } else if (bezier.length === 4) {
      const control1 = bezier[1].map(format);
      const control2 = bezier[2].map(format);
      commands.push(`C${control1[0]} ${control1[1]} ${control2[0]} ${control2[1]} ${end[0]} ${end[1]}`);
    }
    cursor = end;
  }

  if (close) commands.push('Z');
  return commands.join(' ');
};

const normalizeFillPath = (loops) => loops
  .map((loop) => beziersToPath(loop, true))
  .filter(Boolean)
  .join(' ');

const analyzeIcon = (icon) => {
  const sourceD = extractPathData(icon.svgInner);
  const loops = getPathsFromStr(sourceD);
  // The source paths already contain clean production geometry. A moderate MAT
  // tolerance preserves their centerlines without exploding on dense grids.
  const mats = findMats(loops, { maxCurviness: 0.6, maxLength: 50 });
  const paths = [];
  const dots = [];
  const radii = [];

  for (const mat of mats) {
    const vertices = getAllVertices(mat.cpNode);
    for (const vertex of vertices) radii.push(vertex.pointOnShape.circle.radius * sourceToGrid);

    const branches = getBranches(mat.cpNode);
    if (!branches.length) {
      const circle = vertices[0]?.pointOnShape.circle;
      if (circle) {
        dots.push({
          x: format(circle.center[0]),
          y: format(circle.center[1]),
          sourceRadius: Number((circle.radius * sourceToGrid).toFixed(4))
        });
      }
      continue;
    }

    for (const branch of branches) {
      const d = beziersToPath(getBranchBeziers(branch[0]));
      if (d) paths.push(d);
    }
  }

  radii.sort((a, b) => a - b);
  const medianRadius = radii[Math.floor(radii.length / 2)] ?? 0;
  const maximumRadius = radii.at(-1) ?? 0;
  const likelyFilled =
    /填充|已收藏/.test(icon.name) ||
    medianRadius > 1.65 ||
    (maximumRadius > 3.2 && medianRadius > 1.25);

  return {
    name: icon.name,
    collectionId: icon.collectionId,
    sourceId: icon.sourceId,
    sourceFillD: normalizeFillPath(loops),
    centerlinePaths: paths,
    dots,
    stats: {
      loops: loops.length,
      mats: mats.length,
      branches: paths.length,
      dots: dots.length,
      medianRadius: Number(medianRadius.toFixed(4)),
      maximumRadius: Number(maximumRadius.toFixed(4)),
      likelyFilled
    }
  };
};

const analyzeInWorker = (icon, index) => new Promise((resolve) => {
  const worker = new Worker(new URL(import.meta.url), { workerData: { icon, index } });
  const timeout = setTimeout(async () => {
    await worker.terminate();
    resolve({ index, failure: { name: icon.name, collectionId: icon.collectionId, error: 'Centerline analysis timed out' } });
  }, 8000);

  worker.once('message', (message) => {
    clearTimeout(timeout);
    resolve(message);
  });
  worker.once('error', (error) => {
    clearTimeout(timeout);
    resolve({ index, failure: { name: icon.name, collectionId: icon.collectionId, error: String(error) } });
  });
});

const main = async () => {
  const [source26815, source54209] = await Promise.all([
    fs.readFile(source26815Path, 'utf8').then(JSON.parse),
    fs.readFile(source54209Path, 'utf8').then(JSON.parse)
  ]);

  // The SDICS collection is the primary source for the seven duplicated semantic names.
  const merged = new Map(source26815.map((icon) => [icon.name, icon]));
  for (const icon of source54209) merged.set(icon.name, icon);

  const icons = [...merged.values()];
  const completed = [];
  let nextIndex = 0;
  const workerLoop = async () => {
    while (nextIndex < icons.length) {
      const index = nextIndex;
      nextIndex += 1;
      completed.push(await analyzeInWorker(icons[index], index));
      if (completed.length % 25 === 0) console.log(`Analyzed ${completed.length}/${icons.length}`);
    }
  };

  await Promise.all(Array.from({ length: 6 }, workerLoop));
  completed.sort((a, b) => a.index - b.index);
  const results = completed.flatMap((item) => item.result ? [item.result] : []);
  const failures = completed.flatMap((item) => item.failure ? [item.failure] : []);

  await fs.writeFile(outputPath, JSON.stringify({ results, failures }, null, 2));
  console.log(`Wrote ${results.length} icon analyses to ${outputPath}; failures: ${failures.length}`);
};

if (!isMainThread) {
  try {
    parentPort.postMessage({ index: workerData.index, result: analyzeIcon(workerData.icon) });
  } catch (error) {
    parentPort.postMessage({
      index: workerData.index,
      failure: { name: workerData.icon.name, collectionId: workerData.icon.collectionId, error: String(error) }
    });
  }
} else {
  await main();
}
