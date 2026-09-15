import React from 'react';
import type { FsIconNode } from './fs-icon-nodes.generated';
import type { FsParametricIconProps } from './fs-parametric-icons';
import { OpticalGridGroup } from './icon-grid';

type Point = readonly [number, number];

type PathCommand =
  | { type: 'M' | 'L'; start: Point; end: Point }
  | { type: 'A'; start: Point; end: Point; rx: number; ry: number; rotation: number; largeArc: number; sweep: number }
  | { type: 'C'; start: Point; end: Point; control1: Point; control2: Point }
  | { type: 'Q'; start: Point; end: Point; control: Point }
  | { type: 'Z'; start: Point; end: Point };

const format = (value: number) => String(Number(value.toFixed(3)));
const point = (x: number, y: number): Point => [x, y];
const pathCache = new Map<string, string>();

const tokenizePath = (value: string) =>
  value.match(/[a-zA-Z]|[-+]?(?:\d*\.?\d+)(?:e[-+]?\d+)?/gi) ?? [];

const parseAdjustablePath = (value: string): PathCommand[] | null => {
  const tokens = tokenizePath(value);
  const commands: PathCommand[] = [];
  let cursor = point(0, 0);
  let subpathStart = cursor;
  let previousCubicControl: Point | null = null;
  let previousQuadraticControl: Point | null = null;
  let command = '';
  let index = 0;
  let movePair = 0;

  const number = () => {
    const token = tokens[index++];
    if (token === undefined || /^[a-zA-Z]$/.test(token)) throw new Error('Invalid SVG path data');
    return Number(token);
  };

  try {
    while (index < tokens.length) {
      if (/^[a-zA-Z]$/.test(tokens[index])) {
        command = tokens[index++];
        movePair = 0;
      }
      if (!command) return null;
      const relative = command === command.toLowerCase();
      const upper = command.toUpperCase();

      if (upper === 'Z') {
        commands.push({ type: 'Z', start: cursor, end: subpathStart });
        cursor = subpathStart;
        previousCubicControl = null;
        previousQuadraticControl = null;
        command = '';
        continue;
      }

      if (upper === 'M' || upper === 'L') {
        const x = number();
        const y = number();
        const end = point(relative ? cursor[0] + x : x, relative ? cursor[1] + y : y);
        const type = upper === 'M' && movePair === 0 ? 'M' : 'L';
        commands.push({ type, start: cursor, end });
        cursor = end;
        if (type === 'M') subpathStart = end;
        previousCubicControl = null;
        previousQuadraticControl = null;
        movePair += 1;
        continue;
      }

      if (upper === 'H') {
        const x = number();
        const end = point(relative ? cursor[0] + x : x, cursor[1]);
        commands.push({ type: 'L', start: cursor, end });
        cursor = end;
        previousCubicControl = null;
        previousQuadraticControl = null;
        continue;
      }

      if (upper === 'V') {
        const y = number();
        const end = point(cursor[0], relative ? cursor[1] + y : y);
        commands.push({ type: 'L', start: cursor, end });
        cursor = end;
        previousCubicControl = null;
        previousQuadraticControl = null;
        continue;
      }

      if (upper === 'A') {
        const rx = number();
        const ry = number();
        const rotation = number();
        const largeArc = number();
        const sweep = number();
        const x = number();
        const y = number();
        const end = point(relative ? cursor[0] + x : x, relative ? cursor[1] + y : y);
        commands.push({ type: 'A', start: cursor, end, rx, ry, rotation, largeArc, sweep });
        cursor = end;
        previousCubicControl = null;
        previousQuadraticControl = null;
        continue;
      }

      if (upper === 'C') {
        const x1 = number();
        const y1 = number();
        const x2 = number();
        const y2 = number();
        const x = number();
        const y = number();
        const control1 = point(relative ? cursor[0] + x1 : x1, relative ? cursor[1] + y1 : y1);
        const control2 = point(relative ? cursor[0] + x2 : x2, relative ? cursor[1] + y2 : y2);
        const end = point(relative ? cursor[0] + x : x, relative ? cursor[1] + y : y);
        commands.push({ type: 'C', start: cursor, end, control1, control2 });
        cursor = end;
        previousCubicControl = control2;
        previousQuadraticControl = null;
        continue;
      }

      if (upper === 'S') {
        const x2 = number();
        const y2 = number();
        const x = number();
        const y = number();
        const control1 = previousCubicControl
          ? point(cursor[0] * 2 - previousCubicControl[0], cursor[1] * 2 - previousCubicControl[1])
          : cursor;
        const control2 = point(relative ? cursor[0] + x2 : x2, relative ? cursor[1] + y2 : y2);
        const end = point(relative ? cursor[0] + x : x, relative ? cursor[1] + y : y);
        commands.push({ type: 'C', start: cursor, end, control1, control2 });
        cursor = end;
        previousCubicControl = control2;
        previousQuadraticControl = null;
        continue;
      }

      if (upper === 'Q') {
        const x1 = number();
        const y1 = number();
        const x = number();
        const y = number();
        const control = point(relative ? cursor[0] + x1 : x1, relative ? cursor[1] + y1 : y1);
        const end = point(relative ? cursor[0] + x : x, relative ? cursor[1] + y : y);
        commands.push({ type: 'Q', start: cursor, end, control });
        cursor = end;
        previousQuadraticControl = control;
        previousCubicControl = null;
        continue;
      }

      if (upper === 'T') {
        const x = number();
        const y = number();
        const control: Point = previousQuadraticControl
          ? point(cursor[0] * 2 - previousQuadraticControl[0], cursor[1] * 2 - previousQuadraticControl[1])
          : cursor;
        const end = point(relative ? cursor[0] + x : x, relative ? cursor[1] + y : y);
        commands.push({ type: 'Q', start: cursor, end, control });
        cursor = end;
        previousQuadraticControl = control;
        previousCubicControl = null;
        continue;
      }

      return null;
    }
  } catch {
    return null;
  }

  return commands;
};

const lineIntersection = (originA: Point, directionA: Point, originB: Point, directionB: Point): Point | null => {
  const cross = directionA[0] * directionB[1] - directionA[1] * directionB[0];
  if (Math.abs(cross) < 0.0001) return null;
  const offset = point(originB[0] - originA[0], originB[1] - originA[1]);
  const distance = (offset[0] * directionB[1] - offset[1] * directionB[0]) / cross;
  return point(originA[0] + directionA[0] * distance, originA[1] + directionA[1] * distance);
};

const unit = (from: Point, to: Point): Point | null => {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const length = Math.hypot(dx, dy);
  return length < 0.0001 ? null : point(dx / length, dy / length);
};

const simplifyPolyline = (sourcePoints: readonly Point[], closed: boolean) => {
  if (sourcePoints.length < 3) return [...sourcePoints];
  return sourcePoints.filter((current, index) => {
    if (!closed && (index === 0 || index === sourcePoints.length - 1)) return true;
    const previous = sourcePoints[(index - 1 + sourcePoints.length) % sourcePoints.length];
    const next = sourcePoints[(index + 1) % sourcePoints.length];
    const incoming = unit(previous, current);
    const outgoing = unit(current, next);
    if (!incoming || !outgoing) return false;
    const cross = incoming[0] * outgoing[1] - incoming[1] * outgoing[0];
    const direction = incoming[0] * outgoing[0] + incoming[1] * outgoing[1];
    return Math.abs(cross) > 0.0001 || direction < 0.9999;
  });
};

const roundedPolyline = (sourcePoints: readonly Point[], radius: number, closed: boolean) => {
  const points = simplifyPolyline(sourcePoints, closed);
  if (points.length < 2) return '';
  if (radius <= 0) {
    return `${points.map(([x, y], itemIndex) => `${itemIndex ? 'L' : 'M'}${format(x)} ${format(y)}`).join(' ')}${closed ? ' Z' : ''}`;
  }

  const getCorner = (itemIndex: number) => {
    const current = points[itemIndex];
    const previous = points[(itemIndex - 1 + points.length) % points.length];
    const next = points[(itemIndex + 1) % points.length];
    const previousUnit = unit(current, previous) ?? point(0, 0);
    const nextUnit = unit(current, next) ?? point(0, 0);
    const previousLength = Math.hypot(previous[0] - current[0], previous[1] - current[1]);
    const nextLength = Math.hypot(next[0] - current[0], next[1] - current[1]);
    const dot = Math.max(-0.999999, Math.min(0.999999, previousUnit[0] * nextUnit[0] + previousUnit[1] * nextUnit[1]));
    const angle = Math.acos(dot);
    const tangent = Math.min(radius / Math.tan(angle / 2), previousLength * 0.45, nextLength * 0.45);
    const effectiveRadius = tangent * Math.tan(angle / 2);
    const start = point(current[0] + previousUnit[0] * tangent, current[1] + previousUnit[1] * tangent);
    const end = point(current[0] + nextUnit[0] * tangent, current[1] + nextUnit[1] * tangent);
    const incoming = point(current[0] - previous[0], current[1] - previous[1]);
    const outgoing = point(next[0] - current[0], next[1] - current[1]);
    const sweep = incoming[0] * outgoing[1] - incoming[1] * outgoing[0] > 0 ? 1 : 0;
    return { start, end, radius: effectiveRadius, sweep };
  };

  if (!closed) {
    let output = `M${format(points[0][0])} ${format(points[0][1])}`;
    for (let itemIndex = 1; itemIndex < points.length - 1; itemIndex += 1) {
      const corner = getCorner(itemIndex);
      output += ` L${format(corner.start[0])} ${format(corner.start[1])}`;
      output += ` A${format(corner.radius)} ${format(corner.radius)} 0 0 ${corner.sweep} ${format(corner.end[0])} ${format(corner.end[1])}`;
    }
    const last = points[points.length - 1];
    return `${output} L${format(last[0])} ${format(last[1])}`;
  }

  const corners = points.map((_, itemIndex) => getCorner(itemIndex));
  let output = `M${format(corners[0].end[0])} ${format(corners[0].end[1])}`;
  for (let itemIndex = 1; itemIndex < corners.length; itemIndex += 1) {
    const corner = corners[itemIndex];
    output += ` L${format(corner.start[0])} ${format(corner.start[1])}`;
    output += ` A${format(corner.radius)} ${format(corner.radius)} 0 0 ${corner.sweep} ${format(corner.end[0])} ${format(corner.end[1])}`;
  }
  const first = corners[0];
  return `${output} L${format(first.start[0])} ${format(first.start[1])} A${format(first.radius)} ${format(first.radius)} 0 0 ${first.sweep} ${format(first.end[0])} ${format(first.end[1])} Z`;
};

const transformParsedPath = (input: PathCommand[], radius: number) => {
  const commands = input.map((command) => ({ ...command })) as PathCommand[];
  const subpaths: PathCommand[][] = [];
  let subpath: PathCommand[] = [];
  for (const command of commands) {
    if (command.type === 'M' && subpath.length) {
      subpaths.push(subpath);
      subpath = [];
    }
    subpath.push(command);
  }
  if (subpath.length) subpaths.push(subpath);

  return subpaths.map((items) => {
    const move = items[0];
    const drawable = items.slice(1);
    const hasCurves = drawable.some((command) => ['A', 'C', 'Q'].includes(command.type));
    const closed = drawable[drawable.length - 1]?.type === 'Z';

    if (!hasCurves) {
      const lines = drawable.filter((command) => command.type === 'L');
      const points = [move.end, ...lines.map((command) => command.end)];
      const lastPoint = points[points.length - 1];
      if (closed && points.length > 1 && lastPoint?.[0] === points[0][0] && lastPoint?.[1] === points[0][1]) points.pop();
      return roundedPolyline(points, radius, closed);
    }

    const overrides = new Map<number, { start: Point; end: Point; radius: number; sweep: number } | null>();
    const lineCornerOverrides = new Map<number, { start: Point; end: Point; radius: number; sweep: number }>();
    for (let itemIndex = 0; itemIndex < drawable.length; itemIndex += 1) {
      const curve = drawable[itemIndex];
      const previous = itemIndex > 0 ? drawable[itemIndex - 1] : closed ? drawable[drawable.length - 1] : null;
      const next = drawable[itemIndex + 1] ?? null;
      if (!previous || !next || !['L', 'Z'].includes(previous.type) || !['L', 'Z'].includes(next.type)) continue;

      let incoming: Point | null = null;
      let outgoing: Point | null = null;
      if (curve.type === 'A') {
        if (curve.largeArc !== 0 || Math.abs(curve.rotation) > 0.001 || Math.abs(curve.rx - curve.ry) > 0.001 || curve.rx > 3.25) continue;
        incoming = unit(previous.start, previous.end);
        outgoing = unit(next.start, next.end);
      } else if (curve.type === 'C') {
        incoming = unit(curve.start, curve.control1);
        outgoing = unit(curve.control2, curve.end);
      } else if (curve.type === 'Q') {
        incoming = unit(curve.start, curve.control);
        outgoing = unit(curve.control, curve.end);
      } else {
        continue;
      }

      if (!incoming || !outgoing) continue;
      const previousLine = unit(previous.start, previous.end);
      const nextLine = unit(next.start, next.end);
      if (!previousLine || !nextLine) continue;
      if (incoming[0] * previousLine[0] + incoming[1] * previousLine[1] < 0.985) continue;
      if (outgoing[0] * nextLine[0] + outgoing[1] * nextLine[1] < 0.985) continue;

      const corner = lineIntersection(curve.start, incoming, curve.end, outgoing);
      if (!corner) continue;
      const oldIncoming = Math.hypot(corner[0] - curve.start[0], corner[1] - curve.start[1]);
      const oldOutgoing = Math.hypot(corner[0] - curve.end[0], corner[1] - curve.end[1]);
      const sourceRadius = curve.type === 'A' ? curve.rx : Math.max(oldIncoming, oldOutgoing);
      if (oldIncoming > Math.max(5, sourceRadius * 2.75) || oldOutgoing > Math.max(5, sourceRadius * 2.75)) continue;
      const incomingDot = (corner[0] - curve.start[0]) * incoming[0] + (corner[1] - curve.start[1]) * incoming[1];
      const outgoingDot = (corner[0] - curve.end[0]) * outgoing[0] + (corner[1] - curve.end[1]) * outgoing[1];
      if (incomingDot < -0.01 || outgoingDot > 0.01) continue;

      const previousDirection = point(-incoming[0], -incoming[1]);
      const dot = Math.max(-0.999999, Math.min(0.999999, previousDirection[0] * outgoing[0] + previousDirection[1] * outgoing[1]));
      const angle = Math.acos(dot);
      const previousLength = Math.hypot(corner[0] - previous.start[0], corner[1] - previous.start[1]);
      const nextLength = Math.hypot(next.end[0] - corner[0], next.end[1] - corner[1]);
      const tangent = radius <= 0 ? 0 : Math.min(radius / Math.tan(angle / 2), previousLength * 0.45, nextLength * 0.45);
      const effectiveRadius = tangent * Math.tan(angle / 2);
      const start = point(corner[0] - incoming[0] * tangent, corner[1] - incoming[1] * tangent);
      const end = point(corner[0] + outgoing[0] * tangent, corner[1] + outgoing[1] * tangent);
      const sweep = incoming[0] * outgoing[1] - incoming[1] * outgoing[0] > 0 ? 1 : 0;

      if (previous.type === 'L') previous.end = start;
      if (previous.type === 'Z' && move.type === 'M') move.end = start;
      overrides.set(itemIndex, radius <= 0 ? null : { start, end, radius: effectiveRadius, sweep });
    }

    if (radius > 0) {
      for (let itemIndex = 0; itemIndex < drawable.length; itemIndex += 1) {
        const current = drawable[itemIndex];
        const next = drawable[itemIndex + 1] ?? null;
        if (current.type !== 'L' || !next || !['L', 'Z'].includes(next.type)) continue;

        const corner = current.end;
        const nextPoint = next.type === 'L' ? next.end : move.end;
        const incoming = unit(current.start, corner);
        const outgoing = unit(corner, nextPoint);
        if (!incoming || !outgoing) continue;

        const previousDirection = point(-incoming[0], -incoming[1]);
        const dot = Math.max(-0.999999, Math.min(0.999999, previousDirection[0] * outgoing[0] + previousDirection[1] * outgoing[1]));
        const angle = Math.acos(dot);
        const tangentFactor = Math.tan(angle / 2);
        const cross = incoming[0] * outgoing[1] - incoming[1] * outgoing[0];
        if (Math.abs(cross) < 0.0001 || tangentFactor < 0.0001) continue;

        const previousLength = Math.hypot(corner[0] - current.start[0], corner[1] - current.start[1]);
        const nextLength = Math.hypot(nextPoint[0] - corner[0], nextPoint[1] - corner[1]);
        const tangent = Math.min(radius / tangentFactor, previousLength * 0.45, nextLength * 0.45);
        if (tangent < 0.0001) continue;

        const effectiveRadius = tangent * tangentFactor;
        const start = point(corner[0] - incoming[0] * tangent, corner[1] - incoming[1] * tangent);
        const end = point(corner[0] + outgoing[0] * tangent, corner[1] + outgoing[1] * tangent);
        current.end = start;
        lineCornerOverrides.set(itemIndex, { start, end, radius: effectiveRadius, sweep: cross > 0 ? 1 : 0 });
      }

      if (closed && drawable[0]?.type === 'L' && drawable[drawable.length - 1]?.type === 'Z') {
        const closingLineIndex = drawable.length - 2;
        const closingLine = drawable[closingLineIndex];
        if (closingLine?.type === 'L') {
          const corner = move.end;
          const incoming = unit(closingLine.end, corner);
          const outgoing = unit(corner, drawable[0].end);
          if (incoming && outgoing) {
            const previousDirection = point(-incoming[0], -incoming[1]);
            const dot = Math.max(-0.999999, Math.min(0.999999, previousDirection[0] * outgoing[0] + previousDirection[1] * outgoing[1]));
            const angle = Math.acos(dot);
            const tangentFactor = Math.tan(angle / 2);
            const cross = incoming[0] * outgoing[1] - incoming[1] * outgoing[0];
            if (Math.abs(cross) >= 0.0001 && tangentFactor >= 0.0001) {
              const previousLength = Math.hypot(corner[0] - closingLine.end[0], corner[1] - closingLine.end[1]);
              const nextLength = Math.hypot(drawable[0].end[0] - corner[0], drawable[0].end[1] - corner[1]);
              const tangent = Math.min(radius / tangentFactor, previousLength * 0.45, nextLength * 0.45);
              if (tangent >= 0.0001) {
                const effectiveRadius = tangent * tangentFactor;
                const start = point(corner[0] - incoming[0] * tangent, corner[1] - incoming[1] * tangent);
                const end = point(corner[0] + outgoing[0] * tangent, corner[1] + outgoing[1] * tangent);
                closingLine.end = start;
                move.end = end;
                lineCornerOverrides.set(drawable.length - 1, { start, end, radius: effectiveRadius, sweep: cross > 0 ? 1 : 0 });
              }
            }
          }
        }
      }
    }

    let output = `M${format(move.end[0])} ${format(move.end[1])}`;
    drawable.forEach((command, itemIndex) => {
      if (overrides.has(itemIndex)) {
        const override = overrides.get(itemIndex);
        if (override) output += ` A${format(override.radius)} ${format(override.radius)} 0 0 ${override.sweep} ${format(override.end[0])} ${format(override.end[1])}`;
        return;
      }
      if (command.type === 'L') {
        output += ` L${format(command.end[0])} ${format(command.end[1])}`;
        const lineCorner = lineCornerOverrides.get(itemIndex);
        if (lineCorner) output += ` A${format(lineCorner.radius)} ${format(lineCorner.radius)} 0 0 ${lineCorner.sweep} ${format(lineCorner.end[0])} ${format(lineCorner.end[1])}`;
      }
      if (command.type === 'A') output += ` A${format(command.rx)} ${format(command.ry)} ${format(command.rotation)} ${command.largeArc} ${command.sweep} ${format(command.end[0])} ${format(command.end[1])}`;
      if (command.type === 'C') output += ` C${format(command.control1[0])} ${format(command.control1[1])} ${format(command.control2[0])} ${format(command.control2[1])} ${format(command.end[0])} ${format(command.end[1])}`;
      if (command.type === 'Q') output += ` Q${format(command.control[0])} ${format(command.control[1])} ${format(command.end[0])} ${format(command.end[1])}`;
      if (command.type === 'Z') {
        const closingCorner = lineCornerOverrides.get(itemIndex);
        if (closingCorner) output += ` L${format(closingCorner.start[0])} ${format(closingCorner.start[1])} A${format(closingCorner.radius)} ${format(closingCorner.radius)} 0 0 ${closingCorner.sweep} ${format(closingCorner.end[0])} ${format(closingCorner.end[1])}`;
        output += ' Z';
      }
    });
    return output;
  }).join(' ');
};

const transformPath = (value: string, radius: number) => {
  const cacheKey = `${radius}|${value}`;
  const cached = pathCache.get(cacheKey);
  if (cached) return cached;
  const parsed = parseAdjustablePath(value);
  const output = parsed ? transformParsedPath(parsed, radius) : value;
  pathCache.set(cacheKey, output);
  return output;
};

export const toMasterGoEditablePath = (value: string) => transformPath(value, 0);
export const adjustPathCornerRadius = (value: string, radius: number) =>
  transformPath(value, Math.max(0, radius));

type SvgMatrixLike = Pick<DOMMatrix, 'a' | 'b' | 'c' | 'd' | 'e' | 'f'>;

/** Bakes the rendered SVG transform into path coordinates for design-tool paste. */
export const transformMasterGoPath = (value: string, matrix: SvgMatrixLike) => {
  const parsed = parseAdjustablePath(value);
  if (!parsed) return value;

  const transformPoint = ([x, y]: Point) => point(
    matrix.a * x + matrix.c * y + matrix.e,
    matrix.b * x + matrix.d * y + matrix.f
  );
  const scaleX = Math.hypot(matrix.a, matrix.b);
  const scaleY = Math.hypot(matrix.c, matrix.d);
  const rotation = Math.atan2(matrix.b, matrix.a) * 180 / Math.PI;
  const flipsSweep = matrix.a * matrix.d - matrix.b * matrix.c < 0;

  return parsed.map((command) => {
    const end = transformPoint(command.end);
    if (command.type === 'M' || command.type === 'L') {
      return `${command.type}${format(end[0])} ${format(end[1])}`;
    }
    if (command.type === 'A') {
      return `A${format(command.rx * scaleX)} ${format(command.ry * scaleY)} ${format(command.rotation + rotation)} ${command.largeArc} ${flipsSweep ? 1 - command.sweep : command.sweep} ${format(end[0])} ${format(end[1])}`;
    }
    if (command.type === 'C') {
      const control1 = transformPoint(command.control1);
      const control2 = transformPoint(command.control2);
      return `C${format(control1[0])} ${format(control1[1])} ${format(control2[0])} ${format(control2[1])} ${format(end[0])} ${format(end[1])}`;
    }
    if (command.type === 'Q') {
      const control = transformPoint(command.control);
      return `Q${format(control[0])} ${format(control[1])} ${format(end[0])} ${format(end[1])}`;
    }
    return 'Z';
  }).join(' ');
};

const parsePoints = (value: string) => {
  const values = value.trim().split(/[\s,]+/).map(Number);
  const points: Point[] = [];
  for (let index = 0; index + 1 < values.length; index += 2) points.push(point(values[index], values[index + 1]));
  return points;
};

const renderNode = ([tag, sourceAttributes]: FsIconNode, index: number, radius: number) => {
  const { key: _sourceKey, ...attributes } = sourceAttributes;
  const props: Record<string, string | number> = { ...attributes, key: `${tag}-${index}` };

  if (tag === 'rect') {
    const width = Number(attributes.width ?? 0);
    const height = Number(attributes.height ?? 0);
    props.rx = Math.min(radius, width / 2, height / 2);
    props.ry = props.rx;
  }

  if (tag === 'polyline' || tag === 'polygon') {
    const points = parsePoints(String(attributes.points ?? ''));
    return React.createElement('path', {
      ...props,
      points: undefined,
      d: roundedPolyline(points, radius, tag === 'polygon'),
      'data-mastergo-editable-d': roundedPolyline(points, 0, tag === 'polygon')
    });
  }

  if (tag === 'path' && typeof attributes.d === 'string') {
    props.d = transformPath(attributes.d, radius);
    props['data-mastergo-editable-d'] = transformPath(attributes.d, 0);
  }
  return React.createElement(tag, props);
};

export const createMasterGoIcon = (nodes: readonly FsIconNode[], displayName: string) => {
  const MasterGoIcon = ({
    size = 24,
    strokeWidth = 2,
    cornerRadius = 0,
    strokeLinecap = 'round',
    strokeLinejoin = 'round',
    ...props
  }: FsParametricIconProps) => {
    const radius = Math.max(0, cornerRadius);
    return (
      <svg
        {...props}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap={strokeLinecap}
        strokeLinejoin={strokeLinejoin}
        aria-hidden="true"
        focusable="false"
        xmlns="http://www.w3.org/2000/svg"
      >
        <OpticalGridGroup strokeWidth={strokeWidth}>
          {(geometryScale) => nodes.map((node, index) => renderNode(node, index, radius / geometryScale))}
        </OpticalGridGroup>
      </svg>
    );
  };
  MasterGoIcon.displayName = displayName;
  return MasterGoIcon;
};
