type Point = readonly [number, number];

// Source: Iconfont collection 54209, glyph 47901534 ("主页").
// The original 1024-unit filled outline is normalized to a 32-unit canvas.
// These are the five semantic vertices of its fixed outer silhouette. The
// visible stroke is constructed inward from this boundary, so changing stroke
// width never makes the icon grow beyond the source keyline.
const HOME_OUTER_POINTS: readonly Point[] = [
  [16, 2.5],
  [28, 10.667],
  [28, 28.667],
  [4, 28.667],
  [4, 10.667]
];

const DOOR_TOP = 16.667;
const DOOR_BOTTOM = 23.333;
const MAX_INSIDE_STROKE = 10;

const format = (value: number) => {
  const rounded = Number(value.toFixed(4));
  return Object.is(rounded, -0) ? '0' : String(rounded);
};

const add = (a: Point, b: Point): Point => [a[0] + b[0], a[1] + b[1]];
const subtract = (a: Point, b: Point): Point => [a[0] - b[0], a[1] - b[1]];
const scale = (point: Point, amount: number): Point => [point[0] * amount, point[1] * amount];
const cross = (a: Point, b: Point) => a[0] * b[1] - a[1] * b[0];
const normalize = (point: Point): Point => {
  const magnitude = Math.hypot(point[0], point[1]);
  return magnitude === 0 ? [0, 0] : [point[0] / magnitude, point[1] / magnitude];
};

const lineIntersection = (originA: Point, directionA: Point, originB: Point, directionB: Point): Point => {
  const denominator = cross(directionA, directionB);
  if (Math.abs(denominator) < 1e-8) return originA;
  const amount = cross(subtract(originB, originA), directionB) / denominator;
  return add(originA, scale(directionA, amount));
};

const insetClockwisePolygon = (points: readonly Point[], distance: number) =>
  points.map((point, index): Point => {
    const previous = points[(index - 1 + points.length) % points.length];
    const next = points[(index + 1) % points.length];
    const incoming = normalize(subtract(point, previous));
    const outgoing = normalize(subtract(next, point));
    // In the SVG y-down coordinate system these source points are clockwise,
    // so the left-hand normal points into the house.
    const incomingNormal: Point = [-incoming[1], incoming[0]];
    const outgoingNormal: Point = [-outgoing[1], outgoing[0]];
    return lineIntersection(
      add(point, scale(incomingNormal, distance)),
      incoming,
      add(point, scale(outgoingNormal, distance)),
      outgoing
    );
  });

const roundedClosedPath = (points: readonly Point[], radius: number) => {
  const safeRadius = Math.max(0, radius);
  if (safeRadius === 0) {
    return `${points.map((point, index) => `${index === 0 ? 'M' : 'L'}${format(point[0])} ${format(point[1])}`).join(' ')} Z`;
  }

  const corners = points.map((current, index) => {
    const previous = points[(index - 1 + points.length) % points.length];
    const next = points[(index + 1) % points.length];
    const toPrevious = normalize(subtract(previous, current));
    const toNext = normalize(subtract(next, current));
    const previousLength = Math.hypot(previous[0] - current[0], previous[1] - current[1]);
    const nextLength = Math.hypot(next[0] - current[0], next[1] - current[1]);
    const dot = Math.max(-0.999999, Math.min(0.999999, toPrevious[0] * toNext[0] + toPrevious[1] * toNext[1]));
    const angle = Math.acos(dot);
    const tangent = Math.min(safeRadius / Math.tan(angle / 2), previousLength * 0.45, nextLength * 0.45);
    const effectiveRadius = tangent * Math.tan(angle / 2);
    const start = add(current, scale(toPrevious, tangent));
    const end = add(current, scale(toNext, tangent));
    const incoming = subtract(current, previous);
    const outgoing = subtract(next, current);
    const sweep = cross(incoming, outgoing) > 0 ? 1 : 0;
    return { start, end, radius: effectiveRadius, sweep };
  });

  let path = `M${format(corners[0].end[0])} ${format(corners[0].end[1])}`;
  for (let index = 1; index < corners.length; index += 1) {
    const corner = corners[index];
    path += ` L${format(corner.start[0])} ${format(corner.start[1])}`;
    path += ` A${format(corner.radius)} ${format(corner.radius)} 0 0 ${corner.sweep} ${format(corner.end[0])} ${format(corner.end[1])}`;
  }
  const first = corners[0];
  path += ` L${format(first.start[0])} ${format(first.start[1])}`;
  path += ` A${format(first.radius)} ${format(first.radius)} 0 0 ${first.sweep} ${format(first.end[0])} ${format(first.end[1])} Z`;
  return path;
};

const rectanglePath = (left: number, top: number, right: number, bottom: number) =>
  `M${format(left)} ${format(top)} H${format(right)} V${format(bottom)} H${format(left)} Z`;

export const getHomeMasterGoPath = () => [
  'M16 2.5 L28 10.667 L28 28.667 L4 28.667 L4 10.667 Z',
  `M16 ${DOOR_TOP} L16 ${DOOR_BOTTOM}`
].join(' ');

export const getHomeInsideOutline = (strokeWidth: number, cornerRadius: number) => {
  const safeStrokeWidth = Math.min(MAX_INSIDE_STROKE, Math.max(0.01, strokeWidth));
  const safeOuterRadius = Math.max(0, cornerRadius);
  const innerPoints = insetClockwisePolygon(HOME_OUTER_POINTS, safeStrokeWidth);
  const innerRadius = Math.max(0, safeOuterRadius - safeStrokeWidth);
  const outer = roundedClosedPath(HOME_OUTER_POINTS, safeOuterRadius);
  // Reversing the inset loop makes it a nonzero-rule hole while retaining a
  // single SVG path object. The door is a positively wound closed contour.
  const inner = roundedClosedPath([...innerPoints].reverse(), innerRadius);
  const halfDoor = safeStrokeWidth / 2;
  const door = rectanglePath(16 - halfDoor, DOOR_TOP, 16 + halfDoor, DOOR_BOTTOM);
  return `${outer} ${inner} ${door}`;
};

