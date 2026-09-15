import { boolean, getPathsFromStr } from 'flo-boolean';

type Point = readonly [number, number];

const DOWNLOAD_ARROW_POINTS: readonly Point[] = [[10, 14], [16, 20], [22, 14]];
const DOWNLOAD_TRAY_POINTS: readonly Point[] = [[5, 20.667], [5, 27], [27, 27], [27, 20.667]];

const format = (value: number) => {
  const rounded = Number(value.toFixed(4));
  return Object.is(rounded, -0) ? '0' : String(rounded);
};

const add = (a: Point, b: Point): Point => [a[0] + b[0], a[1] + b[1]];
const subtract = (a: Point, b: Point): Point => [a[0] - b[0], a[1] - b[1]];
const scale = (point: Point, amount: number): Point => [point[0] * amount, point[1] * amount];
const length = (point: Point) => Math.hypot(point[0], point[1]);
const normalize = (point: Point): Point => {
  const magnitude = length(point);
  return magnitude === 0 ? [0, 0] : [point[0] / magnitude, point[1] / magnitude];
};
const cross = (a: Point, b: Point) => a[0] * b[1] - a[1] * b[0];
const pointAt = (center: Point, radius: number, angle: number): Point => [
  center[0] + Math.cos(angle) * radius,
  center[1] + Math.sin(angle) * radius
];

const signedPolygonArea = (points: readonly Point[]) =>
  points.reduce((area, point, index) => {
    const next = points[(index + 1) % points.length];
    return area + point[0] * next[1] - next[0] * point[1];
  }, 0) / 2;

const polygonPath = (points: readonly Point[]) => {
  const positivePoints = signedPolygonArea(points) < 0 ? [...points].reverse() : points;
  return `${positivePoints.map((point, index) => `${index === 0 ? 'M' : 'L'}${format(point[0])} ${format(point[1])}`).join(' ')} Z`;
};

const segmentOutline = (
  start: Point,
  end: Point,
  halfStroke: number,
  extendStart = 0,
  extendEnd = 0
) => {
  const direction = normalize(subtract(end, start));
  const normal: Point = [-direction[1] * halfStroke, direction[0] * halfStroke];
  const extendedStart = subtract(start, scale(direction, extendStart));
  const extendedEnd = add(end, scale(direction, extendEnd));
  return polygonPath([
    add(extendedStart, normal),
    add(extendedEnd, normal),
    subtract(extendedEnd, normal),
    subtract(extendedStart, normal)
  ]);
};

const lineIntersection = (originA: Point, directionA: Point, originB: Point, directionB: Point): Point => {
  const denominator = cross(directionA, directionB);
  if (Math.abs(denominator) < 1e-8) return originA;
  const amount = cross(subtract(originB, originA), directionB) / denominator;
  return add(originA, scale(directionA, amount));
};

const miterJoinOutline = (previous: Point, corner: Point, next: Point, halfStroke: number) => {
  const incoming = normalize(subtract(corner, previous));
  const outgoing = normalize(subtract(next, corner));
  const turn = cross(incoming, outgoing);
  const side = turn < 0 ? 1 : -1;
  const incomingNormal: Point = [-incoming[1] * halfStroke * side, incoming[0] * halfStroke * side];
  const outgoingNormal: Point = [-outgoing[1] * halfStroke * side, outgoing[0] * halfStroke * side];
  const incomingOffset = add(corner, incomingNormal);
  const outgoingOffset = add(corner, outgoingNormal);
  const miter = lineIntersection(incomingOffset, incoming, outgoingOffset, outgoing);
  const overlap = Math.max(0.01, halfStroke * 0.01);
  return polygonPath([
    subtract(incomingOffset, scale(incoming, overlap)),
    miter,
    add(outgoingOffset, scale(outgoing, overlap)),
    corner
  ]);
};

const cubicArcCommands = (
  center: Point,
  radius: number,
  startAngle: number,
  endAngle: number,
  direction: 1 | -1
) => {
  if (radius <= 0) return '';
  let delta = endAngle - startAngle;
  if (direction > 0) {
    while (delta <= 0) delta += Math.PI * 2;
  } else {
    while (delta >= 0) delta -= Math.PI * 2;
  }
  const segmentCount = Math.max(1, Math.ceil(Math.abs(delta) / (Math.PI / 2)));
  const step = delta / segmentCount;
  const commands: string[] = [];

  for (let index = 0; index < segmentCount; index += 1) {
    const from = startAngle + step * index;
    const to = from + step;
    const tangent = (4 / 3) * Math.tan(step / 4);
    const start = pointAt(center, radius, from);
    const end = pointAt(center, radius, to);
    const controlA: Point = [
      start[0] - Math.sin(from) * radius * tangent,
      start[1] + Math.cos(from) * radius * tangent
    ];
    const controlB: Point = [
      end[0] + Math.sin(to) * radius * tangent,
      end[1] - Math.cos(to) * radius * tangent
    ];
    commands.push(
      `C${format(controlA[0])} ${format(controlA[1])} ${format(controlB[0])} ${format(controlB[1])} ${format(end[0])} ${format(end[1])}`
    );
  }

  return commands.join(' ');
};

const arcStrokeOutline = (
  center: Point,
  centerRadius: number,
  startAngle: number,
  endAngle: number,
  direction: 1 | -1,
  halfStroke: number
) => {
  const outerRadius = centerRadius + halfStroke;
  const innerRadius = Math.max(0, centerRadius - halfStroke);
  // Flo Boolean implements nonzero union as winding number >= 1, so every
  // primitive must use a positive orientation. Reverse clockwise SVG arcs
  // before handing them to the boolean engine.
  const orientedStartAngle = direction > 0 ? startAngle : endAngle;
  const orientedEndAngle = direction > 0 ? endAngle : startAngle;
  const outerStart = pointAt(center, outerRadius, orientedStartAngle);
  let path = `M${format(outerStart[0])} ${format(outerStart[1])} `;
  path += `${cubicArcCommands(center, outerRadius, orientedStartAngle, orientedEndAngle, 1)} `;

  if (innerRadius === 0) {
    path += `L${format(center[0])} ${format(center[1])} Z`;
    return path;
  }

  const innerEnd = pointAt(center, innerRadius, orientedEndAngle);
  path += `L${format(innerEnd[0])} ${format(innerEnd[1])} `;
  path += `${cubicArcCommands(center, innerRadius, orientedEndAngle, orientedStartAngle, -1)} Z`;
  return path;
};

type Fillet = {
  start: Point;
  end: Point;
  center: Point;
  startAngle: number;
  endAngle: number;
  direction: 1 | -1;
};

const quarterFillet = (previous: Point, corner: Point, next: Point, radius: number): Fillet => {
  const incoming = normalize(subtract(corner, previous));
  const outgoing = normalize(subtract(next, corner));
  const start = subtract(corner, scale(incoming, radius));
  const end = add(corner, scale(outgoing, radius));
  const turn = cross(incoming, outgoing);
  // The fillet centre sits on the inside of the turn. The opposite side is
  // used by the miter helper above because that helper constructs the outer tip.
  const side = turn < 0 ? -1 : 1;
  const incomingNormal: Point = [-incoming[1] * side, incoming[0] * side];
  const center = add(start, scale(incomingNormal, radius));
  const startAngle = Math.atan2(start[1] - center[1], start[0] - center[0]);
  const endAngle = Math.atan2(end[1] - center[1], end[0] - center[0]);
  return { start, end, center, startAngle, endAngle, direction: turn < 0 ? -1 : 1 };
};

const polylineStrokePrimitives = (points: readonly Point[], strokeWidth: number, radius: number) => {
  const halfStroke = strokeWidth / 2;
  const safeRadius = Math.max(0, radius);
  const fillets = points.slice(1, -1).map((_, index) =>
    safeRadius > 0 ? quarterFillet(points[index], points[index + 1], points[index + 2], safeRadius) : null
  );
  const primitives: string[] = [];
  const overlap = Math.max(0.01, halfStroke * 0.01);

  for (let index = 0; index < points.length - 1; index += 1) {
    const start = index === 0 ? points[index] : fillets[index - 1]?.end ?? points[index];
    const end = index === points.length - 2 ? points[index + 1] : fillets[index]?.start ?? points[index + 1];
    primitives.push(
      segmentOutline(
        start,
        end,
        halfStroke,
        index === 0 ? 0 : overlap,
        index === points.length - 2 ? 0 : overlap
      )
    );
  }

  fillets.forEach((fillet, index) => {
    if (fillet) {
      primitives.push(
        arcStrokeOutline(
          fillet.center,
          safeRadius,
          fillet.startAngle,
          fillet.endAngle,
          fillet.direction,
          halfStroke
        )
      );
    } else {
      primitives.push(miterJoinOutline(points[index], points[index + 1], points[index + 2], halfStroke));
    }
  });

  return primitives;
};

const serializeBezierLoops = (loops: (number[][])[][]) =>
  loops
    .map((loop) => {
      if (loop.length === 0) return '';
      const commands = [`M${format(loop[0][0][0])} ${format(loop[0][0][1])}`];
      loop.forEach((bezier) => {
        if (bezier.length === 2) {
          commands.push(`L${format(bezier[1][0])} ${format(bezier[1][1])}`);
        } else if (bezier.length === 3) {
          commands.push(
            `Q${format(bezier[1][0])} ${format(bezier[1][1])} ${format(bezier[2][0])} ${format(bezier[2][1])}`
          );
        } else if (bezier.length === 4) {
          commands.push(
            `C${format(bezier[1][0])} ${format(bezier[1][1])} ${format(bezier[2][0])} ${format(bezier[2][1])} ${format(bezier[3][0])} ${format(bezier[3][1])}`
          );
        }
      });
      commands.push('Z');
      return commands.join(' ');
    })
    .filter(Boolean)
    .join(' ');

export const getDownloadMasterGoPath = () => [
  'M16 4 L16 20',
  'M10 14 L16 20 L22 14',
  'M5 20.667 L5 27 L27 27 L27 20.667'
].join(' ');

export const getDownloadIconfontOutline = (strokeWidth: number, cornerRadius: number) => {
  const safeStrokeWidth = Math.max(0.01, strokeWidth);
  const safeRadius = Math.max(0, cornerRadius);
  const primitives = [
    segmentOutline([16, 4], [16, 20], safeStrokeWidth / 2),
    ...polylineStrokePrimitives(DOWNLOAD_ARROW_POINTS, safeStrokeWidth, safeRadius),
    ...polylineStrokePrimitives(DOWNLOAD_TRAY_POINTS, safeStrokeWidth, safeRadius)
  ];
  const loops = boolean('OR', getPathsFromStr(primitives.join(' ')), { minLoopArea: 0.1 });
  return serializeBezierLoops(loops);
};
