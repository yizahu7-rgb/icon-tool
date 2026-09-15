type Point = readonly [number, number];

type BoundaryEdge = {
  from: Point;
  to: Point;
  used: boolean;
};

const pointKey = ([x, y]: Point) => `${x},${y}`;
const pointsEqual = (a: Point, b: Point) => a[0] === b[0] && a[1] === b[1];

const direction = (edge: BoundaryEdge) => {
  const dx = edge.to[0] - edge.from[0];
  const dy = edge.to[1] - edge.from[1];
  if (dx > 0) return 0;
  if (dy > 0) return 1;
  if (dx < 0) return 2;
  return 3;
};

const chooseNextEdge = (edges: BoundaryEdge[], candidateIndexes: number[], previousDirection: number) => {
  const turnPriority = [1, 0, 3, 2];
  return candidateIndexes
    .filter((index) => !edges[index].used)
    .sort((a, b) => {
      const turnA = (direction(edges[a]) - previousDirection + 4) % 4;
      const turnB = (direction(edges[b]) - previousDirection + 4) % 4;
      return turnPriority.indexOf(turnA) - turnPriority.indexOf(turnB);
    })[0];
};

const polygonArea = (points: Point[]) => {
  let area = 0;
  for (let index = 0; index < points.length; index += 1) {
    const current = points[index];
    const next = points[(index + 1) % points.length];
    area += current[0] * next[1] - next[0] * current[1];
  }
  return area / 2;
};

const perpendicularDistance = (point: Point, start: Point, end: Point) => {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  if (dx === 0 && dy === 0) return Math.hypot(point[0] - start[0], point[1] - start[1]);
  return Math.abs(dy * point[0] - dx * point[1] + end[0] * start[1] - end[1] * start[0]) / Math.hypot(dx, dy);
};

const simplifyLine = (points: Point[], tolerance: number): Point[] => {
  if (points.length <= 2) return points;

  const keep = new Uint8Array(points.length);
  keep[0] = 1;
  keep[points.length - 1] = 1;
  const pending: Array<[number, number]> = [[0, points.length - 1]];

  while (pending.length > 0) {
    const [startIndex, endIndex] = pending.pop() as [number, number];
    let furthestIndex = -1;
    let furthestDistance = tolerance;

    for (let index = startIndex + 1; index < endIndex; index += 1) {
      const distance = perpendicularDistance(points[index], points[startIndex], points[endIndex]);
      if (distance > furthestDistance) {
        furthestDistance = distance;
        furthestIndex = index;
      }
    }

    if (furthestIndex >= 0) {
      keep[furthestIndex] = 1;
      pending.push([startIndex, furthestIndex], [furthestIndex, endIndex]);
    }
  }

  return points.filter((_, index) => keep[index] === 1);
};

const removeCollinearPoints = (points: Point[]) =>
  points.filter((point, index) => {
    const previous = points[(index - 1 + points.length) % points.length];
    const next = points[(index + 1) % points.length];
    const cross = (point[0] - previous[0]) * (next[1] - point[1]) - (point[1] - previous[1]) * (next[0] - point[0]);
    return cross !== 0;
  });

const simplifyClosedContour = (points: Point[], tolerance: number) => {
  const cleanPoints = removeCollinearPoints(points);
  if (cleanPoints.length <= 4) return cleanPoints;

  const center = cleanPoints.reduce(
    (sum, point) => [sum[0] + point[0] / cleanPoints.length, sum[1] + point[1] / cleanPoints.length] as Point,
    [0, 0] as Point
  );
  let anchorIndex = 0;
  let furthestDistance = -1;
  cleanPoints.forEach((point, index) => {
    const distance = Math.hypot(point[0] - center[0], point[1] - center[1]);
    if (distance > furthestDistance) {
      anchorIndex = index;
      furthestDistance = distance;
    }
  });

  const rotated = [...cleanPoints.slice(anchorIndex), ...cleanPoints.slice(0, anchorIndex)];
  const simplified = simplifyLine([...rotated, rotated[0]], tolerance);
  return simplified.slice(0, -1);
};

const traceBoundaries = (pixels: Uint8ClampedArray, width: number, height: number) => {
  const foreground = new Uint8Array(width * height);
  for (let index = 0; index < width * height; index += 1) {
    foreground[index] = pixels[index * 4 + 3] >= 112 ? 1 : 0;
  }

  const isForeground = (x: number, y: number) =>
    x >= 0 && x < width && y >= 0 && y < height && foreground[y * width + x] === 1;

  const edges: BoundaryEdge[] = [];
  const outgoing = new Map<string, number[]>();
  const addEdge = (from: Point, to: Point) => {
    const edgeIndex = edges.length;
    edges.push({ from, to, used: false });
    const key = pointKey(from);
    const indexes = outgoing.get(key) ?? [];
    indexes.push(edgeIndex);
    outgoing.set(key, indexes);
  };

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (!isForeground(x, y)) continue;
      if (!isForeground(x, y - 1)) addEdge([x, y], [x + 1, y]);
      if (!isForeground(x + 1, y)) addEdge([x + 1, y], [x + 1, y + 1]);
      if (!isForeground(x, y + 1)) addEdge([x + 1, y + 1], [x, y + 1]);
      if (!isForeground(x - 1, y)) addEdge([x, y + 1], [x, y]);
    }
  }

  const contours: Point[][] = [];
  edges.forEach((firstEdge, firstIndex) => {
    if (firstEdge.used) return;
    const contour: Point[] = [firstEdge.from];
    let currentIndex: number | undefined = firstIndex;

    while (currentIndex !== undefined) {
      const current = edges[currentIndex];
      if (current.used) break;
      current.used = true;
      contour.push(current.to);
      if (pointsEqual(current.to, contour[0])) break;
      currentIndex = chooseNextEdge(edges, outgoing.get(pointKey(current.to)) ?? [], direction(current));
    }

    const isClosed = contour.length >= 4 && pointsEqual(contour[0], contour[contour.length - 1]);
    if (!isClosed) return;
    const openContour = contour.slice(0, -1);
    if (Math.abs(polygonArea(openContour)) >= 8) contours.push(openContour);
  });

  return contours;
};

const loadSvgImage = (svgData: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('图标渲染失败'));
    };
    image.src = url;
  });

const prepareSourceSvg = (svgElement: SVGSVGElement, renderSize: number) => {
  const source = svgElement.cloneNode(true) as SVGSVGElement;
  source.removeAttribute('id');
  source.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  source.setAttribute('width', String(renderSize));
  source.setAttribute('height', String(renderSize));
  source.setAttribute('color', '#000000');
  source.setAttribute('stroke', '#000000');
  source.setAttribute('stroke-linecap', 'butt');
  source.setAttribute('stroke-linejoin', 'miter');
  source.setAttribute('stroke-miterlimit', '4');
  source.querySelectorAll('[data-mastergo-editable-d]').forEach((element) => element.removeAttribute('data-mastergo-editable-d'));
  source.querySelectorAll('[data-mastergo-inside-stroke]').forEach((element) => element.removeAttribute('data-mastergo-inside-stroke'));
  source.querySelectorAll('[data-mastergo-stroke-width]').forEach((element) => element.removeAttribute('data-mastergo-stroke-width'));
  source.querySelectorAll('[data-iconfont-outline-d]').forEach((element) => element.removeAttribute('data-iconfont-outline-d'));
  return new XMLSerializer().serializeToString(source);
};

const formatCoordinate = (value: number) => {
  const rounded = Number(value.toFixed(3));
  return Object.is(rounded, -0) ? '0' : String(rounded);
};

export async function serializeIconfontSvg(svgElement: SVGSVGElement, outputSize: number) {
  const exactOutline = svgElement.querySelector('[data-iconfont-outline-d]')?.getAttribute('data-iconfont-outline-d');
  if (exactOutline) {
    const viewBox = svgElement.getAttribute('viewBox') || `0 0 ${outputSize} ${outputSize}`;
    const size = formatCoordinate(outputSize);
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${viewBox}"><path d="${exactOutline}" fill="#000000" fill-rule="nonzero"/></svg>`;
  }

  // Iconfont accepts SVGs with different canvas sizes. A fixed 256px internal
  // canvas gives sub-pixel accuracy for the supported 16/24/32px outputs while
  // keeping the conversion light enough for embedded browsers.
  const renderSize = 256;
  const image = await loadSvgImage(prepareSourceSvg(svgElement, renderSize));
  const canvas = document.createElement('canvas');
  canvas.width = renderSize;
  canvas.height = renderSize;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) throw new Error('浏览器不支持图标轮廓转换');

  context.clearRect(0, 0, renderSize, renderSize);
  context.drawImage(image, 0, 0, renderSize, renderSize);
  const imageData = context.getImageData(0, 0, renderSize, renderSize);
  const contours = traceBoundaries(imageData.data, renderSize, renderSize).map((contour) => simplifyClosedContour(contour, 1.1));
  if (contours.length === 0) throw new Error('没有检测到可导出的图形');

  const scale = outputSize / renderSize;
  const pathData = contours
    .filter((contour) => contour.length >= 3)
    .map((contour) => {
      const [first, ...rest] = contour;
      const commands = rest.map((point) => `L${formatCoordinate(point[0] * scale)} ${formatCoordinate(point[1] * scale)}`);
      return `M${formatCoordinate(first[0] * scale)} ${formatCoordinate(first[1] * scale)}${commands.join('')}Z`;
    })
    .join('');

  const size = formatCoordinate(outputSize);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><path d="${pathData}" fill="#000000" fill-rule="nonzero"/></svg>`;
}

export function saveIconfontSvg(svgData: string, fileName: string) {
  const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}
