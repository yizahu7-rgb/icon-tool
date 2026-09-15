import React from 'react';
import { CanonicalGridGroup, OpticalGridGroup } from './icon-grid';
import { getDownloadIconfontOutline, getDownloadMasterGoPath } from './download-icon-geometry';
import { getHomeInsideOutline, getHomeMasterGoPath } from './home-icon-geometry';

export type FsParametricIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
  strokeWidth?: number | string;
  cornerRadius?: number;
};

type Point = readonly [number, number];

const format = (value: number) => Number(value.toFixed(3));

const roundedPath = (points: readonly Point[], radius: number, closed = false) => {
  const safeRadius = Math.max(0, radius);
  if (points.length < 2) return '';
  if (safeRadius === 0) {
    return `${points.map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${x} ${y}`).join(' ')}${closed ? ' Z' : ''}`;
  }

  const corner = (index: number) => {
    const current = points[index];
    const previous = points[(index - 1 + points.length) % points.length];
    const next = points[(index + 1) % points.length];
    const toPrevious: Point = [previous[0] - current[0], previous[1] - current[1]];
    const toNext: Point = [next[0] - current[0], next[1] - current[1]];
    const previousLength = Math.hypot(...toPrevious);
    const nextLength = Math.hypot(...toNext);
    const previousUnit: Point = [toPrevious[0] / previousLength, toPrevious[1] / previousLength];
    const nextUnit: Point = [toNext[0] / nextLength, toNext[1] / nextLength];
    const dot = Math.max(-0.999999, Math.min(0.999999, previousUnit[0] * nextUnit[0] + previousUnit[1] * nextUnit[1]));
    const angle = Math.acos(dot);
    const tangent = Math.min(safeRadius / Math.tan(angle / 2), previousLength * 0.45, nextLength * 0.45);
    const effectiveRadius = tangent * Math.tan(angle / 2);
    const start: Point = [current[0] + previousUnit[0] * tangent, current[1] + previousUnit[1] * tangent];
    const end: Point = [current[0] + nextUnit[0] * tangent, current[1] + nextUnit[1] * tangent];
    const incoming: Point = [current[0] - previous[0], current[1] - previous[1]];
    const outgoing: Point = [next[0] - current[0], next[1] - current[1]];
    const sweep = incoming[0] * outgoing[1] - incoming[1] * outgoing[0] > 0 ? 1 : 0;
    return { start, end, radius: effectiveRadius, sweep };
  };

  if (!closed) {
    let path = `M${points[0][0]} ${points[0][1]}`;
    for (let index = 1; index < points.length - 1; index += 1) {
      const rounded = corner(index);
      path += ` L${format(rounded.start[0])} ${format(rounded.start[1])}`;
      path += ` A${format(rounded.radius)} ${format(rounded.radius)} 0 0 ${rounded.sweep} ${format(rounded.end[0])} ${format(rounded.end[1])}`;
    }
    const last = points[points.length - 1];
    return `${path} L${last[0]} ${last[1]}`;
  }

  const corners = points.map((_, index) => corner(index));
  let path = `M${format(corners[0].end[0])} ${format(corners[0].end[1])}`;
  for (let index = 1; index < corners.length; index += 1) {
    const rounded = corners[index];
    path += ` L${format(rounded.start[0])} ${format(rounded.start[1])}`;
    path += ` A${format(rounded.radius)} ${format(rounded.radius)} 0 0 ${rounded.sweep} ${format(rounded.end[0])} ${format(rounded.end[1])}`;
  }
  const first = corners[0];
  path += ` L${format(first.start[0])} ${format(first.start[1])}`;
  path += ` A${format(first.radius)} ${format(first.radius)} 0 0 ${first.sweep} ${format(first.end[0])} ${format(first.end[1])} Z`;
  return path;
};

type ParametricSvgProps = Omit<FsParametricIconProps, 'children'> & {
  children: React.ReactNode | ((geometryScale: number, geometryStrokeWidth: number) => React.ReactNode);
};

const ParametricSvg = ({
  size = 24,
  strokeWidth = 2,
  cornerRadius: _cornerRadius,
  strokeLinecap = 'butt',
  strokeLinejoin = 'miter',
  children,
  ...props
}: ParametricSvgProps) => (
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
    xmlns="http://www.w3.org/2000/svg"
  >
    <OpticalGridGroup strokeWidth={strokeWidth}>{children}</OpticalGridGroup>
  </svg>
);

const dotSegmentPath = (centerX: number, centerY: number, strokeWidth: number) => {
  const half = strokeWidth / 2;
  return `M${format(centerX - half)} ${format(centerY)} H${format(centerX + half)}`;
};

const circlePath = (centerX: number, centerY: number, radius: number) => [
  `M${format(centerX + radius)} ${format(centerY)}`,
  `A${format(radius)} ${format(radius)} 0 1 1 ${format(centerX - radius)} ${format(centerY)}`,
  `A${format(radius)} ${format(radius)} 0 1 1 ${format(centerX + radius)} ${format(centerY)}`,
  'Z'
].join(' ');

const questionGlyphPath = (strokeWidth: number, centerX = 12, dotY = 17.25) => {
  const curveEndY = dotY - strokeWidth * 1.5;
  return [
    `M${format(centerX - 3)} 9.15`,
    `C${format(centerX - 2.45)} 7.8 ${format(centerX - 1.35)} 7.1 ${format(centerX + 0.1)} 7.1`,
    `C${format(centerX + 2)} 7.1 ${format(centerX + 3.25)} 8.2 ${format(centerX + 3.25)} 9.85`,
    `C${format(centerX + 3.25)} 11.75 ${format(centerX + 0.15)} 12.25 ${format(centerX + 0.15)} ${format(curveEndY)}`,
    dotSegmentPath(centerX + 0.15, dotY, strokeWidth)
  ].join(' ');
};

const alertGlyphPath = (strokeWidth: number, centerX = 12, dotY = 17.25) => {
  const stemEndY = dotY - strokeWidth * 1.5;
  return `M${format(centerX)} 7.75 V${format(stemEndY)} ${dotSegmentPath(centerX, dotY, strokeWidth)}`;
};

const infoGlyphPath = (strokeWidth: number, centerX = 12, dotY = 7.25) => {
  const stemStartY = dotY + strokeWidth * 1.5;
  return `${dotSegmentPath(centerX, dotY, strokeWidth)} M${format(centerX)} ${format(stemStartY)} V16.5`;
};

export const FsMaximizeIcon = ({ cornerRadius = 0, ...props }: FsParametricIconProps) => {
  const radius = Math.max(0, cornerRadius);
  return (
    <ParametricSvg {...props} cornerRadius={radius}>
      {(geometryScale) => {
        const normalizedRadius = radius / geometryScale;
        const editablePath = [
          roundedPath([[8, 3], [3, 3], [3, 8]], 0),
          roundedPath([[16, 3], [21, 3], [21, 8]], 0),
          roundedPath([[3, 16], [3, 21], [8, 21]], 0),
          roundedPath([[16, 21], [21, 21], [21, 16]], 0)
        ].join(' ');
        const renderedPath = [
          roundedPath([[8, 3], [3, 3], [3, 8]], normalizedRadius),
          roundedPath([[16, 3], [21, 3], [21, 8]], normalizedRadius),
          roundedPath([[3, 16], [3, 21], [8, 21]], normalizedRadius),
          roundedPath([[16, 21], [21, 21], [21, 16]], normalizedRadius)
        ].join(' ');
        return (
          <path d={renderedPath} data-mastergo-editable-d={editablePath} />
        );
      }}
    </ParametricSvg>
  );
};

// Reference implementation for the source-faithful redraw workflow.
// The Iconfont source has two semantic strokes: a downward arrow and a tray.
// Both are kept inside one SVG path object, while their unavoidable branches
// remain subpaths of that object. This avoids the disconnected vector layers
// produced by medial-axis branch extraction and stays editable in MasterGo.
const FsDownloadIcon = ({
  size = 32,
  strokeWidth = 2,
  cornerRadius = 0,
  strokeLinecap = 'butt',
  strokeLinejoin = 'miter',
  ...props
}: FsParametricIconProps) => {
  // App-level parameters are normalized for the legacy 24-unit viewBox.
  // Convert them to the 32-unit reference grid so the visible px values stay exact.
  const referenceGridScale = 32 / 24;
  const radius = Math.max(0, cornerRadius) * referenceGridScale;
  const referenceStrokeWidth = Number(strokeWidth) * referenceGridScale;
  // Exact 32-grid centreline reconstruction of Iconfont glyph 47901520.
  // Coordinates come from the midpoint of the source glyph's expanded stroke
  // contours; they are not inferred from a substitute icon library.
  const arrowPoints: Point[] = [[10, 14], [16, 20], [22, 14]];
  const trayPoints: Point[] = [[5, 20.667], [5, 27], [27, 27], [27, 20.667]];
  const shaftPath = 'M16 4 L16 20';
  const arrowPath = roundedPath(arrowPoints, radius);
  const trayPath = roundedPath(trayPoints, radius);
  const renderedPath = `${shaftPath} ${arrowPath} ${trayPath}`;
  const masterGoPath = getDownloadMasterGoPath();
  const iconfontOutline = getDownloadIconfontOutline(referenceStrokeWidth, radius);

  return (
    <svg
      {...props}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={referenceStrokeWidth}
      strokeLinecap={strokeLinecap}
      strokeLinejoin={strokeLinejoin}
      aria-hidden="true"
      focusable="false"
      data-iconfont-collection="54209"
      data-iconfont-source-id="47901520"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d={renderedPath}
        data-mastergo-editable-d={masterGoPath}
        data-iconfont-outline-d={iconfontOutline}
      />
    </svg>
  );
};

// Second sample candidate: a source-faithful inside-stroke reconstruction of
// Iconfont glyph 47901534. The preview and Iconfont export use one nonzero
// filled path; the MasterGo copy swaps in the five editable house vertices.
const FsHomeIcon = ({
  size = 32,
  strokeWidth = 2,
  cornerRadius = 0,
  ...props
}: FsParametricIconProps) => {
  const referenceGridScale = 32 / 24;
  const referenceStrokeWidth = Number(strokeWidth) * referenceGridScale;
  const referenceRadius = Math.max(0, cornerRadius) * referenceGridScale;
  const outline = getHomeInsideOutline(referenceStrokeWidth, referenceRadius);

  return (
    <svg
      {...props}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="currentColor"
      stroke="none"
      aria-hidden="true"
      focusable="false"
      data-iconfont-collection="54209"
      data-iconfont-source-id="47901534"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d={outline}
        fillRule="nonzero"
        data-mastergo-editable-d={getHomeMasterGoPath()}
        data-mastergo-inside-stroke="true"
        data-mastergo-stroke-width={referenceStrokeWidth}
        data-iconfont-outline-d={outline}
      />
    </svg>
  );
};

// Source-faithful redraw of Iconfont glyph 18267910 from collection 26815.
// The original shape is a three-corner inspection frame with a magnifier in
// the lower-right quadrant. All semantic strokes live in one SVG path object;
// only the three true 90-degree frame corners respond to the radius control.
const inspectionTopLeft: Point[] = [[12.191, 4.571], [4.571, 4.571], [4.571, 12.191]];
const inspectionTopRight: Point[] = [[19.809, 4.571], [27.429, 4.571], [27.429, 12.191]];
const inspectionBottomLeft: Point[] = [[4.571, 19.809], [4.571, 27.429], [12.191, 27.429]];
const inspectionLensPath = [
  'M23.803 23.803',
  'A4.571 4.571 0 1 1 23.803 17.339',
  'A4.571 4.571 0 0 1 23.803 23.803',
  'M23.803 23.803 L28.571 28.571'
].join(' ');

const getInspectionPath = (radius: number) => [
  roundedPath(inspectionTopLeft, radius),
  roundedPath(inspectionTopRight, radius),
  roundedPath(inspectionBottomLeft, radius),
  inspectionLensPath
].join(' ');

const FsInspectionIcon = ({
  size = 32,
  strokeWidth = 2,
  cornerRadius = 0,
  strokeLinecap = 'butt',
  strokeLinejoin = 'miter',
  ...props
}: FsParametricIconProps) => {
  const referenceGridScale = 32 / 24;
  const numericStrokeWidth = Number(strokeWidth);
  const referenceStrokeWidth = Number.isFinite(numericStrokeWidth)
    ? numericStrokeWidth * referenceGridScale
    : strokeWidth;
  const referenceRadius = Math.max(0, cornerRadius) * referenceGridScale;
  const renderedPath = getInspectionPath(referenceRadius);
  const editablePath = getInspectionPath(0);

  return (
    <svg
      {...props}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={referenceStrokeWidth}
      strokeLinecap={strokeLinecap}
      strokeLinejoin={strokeLinejoin}
      aria-hidden="true"
      focusable="false"
      data-iconfont-collection="26815"
      data-iconfont-source-id="18267910"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={renderedPath} data-mastergo-editable-d={editablePath} />
    </svg>
  );
};

// SDICS glyph 47901593. The expanded source outline contains a baked fillet at
// the check bend; reconstructing the two straight centreline legs makes that
// bend one geometric node controlled by the global radius value.
const checkPoints: Point[] = [
  [5.333, 12.272],
  [10.686, 17.625],
  [19.085, 6.425]
];

const FsCheckIcon = ({
  size = 32,
  strokeWidth = 2,
  cornerRadius = 0,
  strokeLinecap = 'butt',
  strokeLinejoin = 'miter',
  ...props
}: FsParametricIconProps) => {
  const referenceGridScale = 32 / 24;
  const referenceStrokeWidth = Number(strokeWidth) * referenceGridScale;
  const referenceRadius = Math.max(0, cornerRadius) * referenceGridScale;
  const scaledPoints = checkPoints.map(([x, y]) => [x * referenceGridScale, y * referenceGridScale] as Point);
  const renderedPath = roundedPath(scaledPoints, referenceRadius);
  const editablePath = roundedPath(scaledPoints, 0);

  return (
    <svg
      {...props}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={referenceStrokeWidth}
      strokeLinecap={strokeLinecap}
      strokeLinejoin={strokeLinejoin}
      aria-hidden="true"
      focusable="false"
      data-iconfont-collection="54209"
      data-iconfont-source-id="47901593"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={renderedPath} data-mastergo-editable-d={editablePath} />
    </svg>
  );
};

// SDICS glyph 47901543. Each inward arrow keeps a separate shaft subpath at
// the branch, while its two arrowhead legs share one editable corner node.
const FsShrinkIcon = ({
  size = 24,
  strokeWidth = 2,
  cornerRadius = 0,
  strokeLinecap = 'butt',
  strokeLinejoin = 'miter',
  ...props
}: FsParametricIconProps) => {
  const referenceGridScale = 32 / 24;
  const referenceStrokeWidth = Number(strokeWidth) * referenceGridScale;
  const referenceRadius = Math.max(0, cornerRadius) * referenceGridScale;
  return (
    <svg
      {...props}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={referenceStrokeWidth}
      strokeLinecap={strokeLinecap}
      strokeLinejoin={strokeLinejoin}
      aria-hidden="true"
      focusable="false"
      data-iconfont-collection="54209"
      data-iconfont-source-id="47901543"
      xmlns="http://www.w3.org/2000/svg"
    >
      <CanonicalGridGroup strokeWidth={referenceStrokeWidth} profile="resize">
        {(geometryScale) => {
        const normalizedRadius = referenceRadius / geometryScale;
        const topRight = [[17.986, 10.058], [14.705, 9.339], [13.986, 6.056]] as const;
        const bottomLeft = [[5.574, 14.468], [8.858, 15.188], [9.576, 18.467]] as const;
        const renderedPath = [
          'M20.235 3.808 L14.705 9.339',
          roundedPath(topRight, normalizedRadius),
          'M3.326 20.718 L8.858 15.188',
          roundedPath(bottomLeft, normalizedRadius)
        ].join(' ');
        const editablePath = [
          'M20.235 3.808 L14.705 9.339',
          roundedPath(topRight, 0),
          'M3.326 20.718 L8.858 15.188',
          roundedPath(bottomLeft, 0)
        ].join(' ');
        return <path d={renderedPath} data-mastergo-editable-d={editablePath} />;
        }}
      </CanonicalGridGroup>
    </svg>
  );
};

export const FsSaveIcon = ({ cornerRadius = 0, ...props }: FsParametricIconProps) => {
  const radius = Math.max(0, cornerRadius);
  return (
    <ParametricSvg {...props} cornerRadius={radius}>
      {(geometryScale) => {
        const normalizedRadius = radius / geometryScale;
        const outer = [[3, 3], [21, 3], [21, 21], [3, 21]] as const;
        const label = [[7, 3], [17, 3], [17, 9], [7, 9]] as const;
        const well = [[7, 14], [17, 14], [17, 21], [7, 21]] as const;
        const renderedPath = [
          roundedPath(outer, Math.min(normalizedRadius, 9), true),
          roundedPath(label, Math.min(normalizedRadius, 3), true),
          roundedPath(well, Math.min(normalizedRadius, 3.5), true)
        ].join(' ');
        const editablePath = [roundedPath(outer, 0, true), roundedPath(label, 0, true), roundedPath(well, 0, true)].join(' ');
        return (
          <path d={renderedPath} data-mastergo-editable-d={editablePath} />
        );
      }}
    </ParametricSvg>
  );
};

export const FsEditIcon = ({ cornerRadius = 0, ...props }: FsParametricIconProps) => {
  const radius = Math.min(2.5, Math.max(0, cornerRadius));
  return (
    <ParametricSvg {...props} cornerRadius={radius}>
      {(geometryScale) => {
        const normalizedRadius = radius / geometryScale;
        const body = [[9.5, 2.5], [14.5, 2.5], [14.5, 16.5], [9.5, 16.5]] as const;
        const tip = [[9.5, 16.5], [12, 21.5], [14.5, 16.5]] as const;
        const renderedPath = `${roundedPath(body, normalizedRadius, true)} M9.5 6 H14.5 ${roundedPath(tip, normalizedRadius, true)}`;
        const editablePath = `${roundedPath(body, 0, true)} M9.5 6 H14.5 ${roundedPath(tip, 0, true)}`;
        return (
          <g transform="rotate(-45 12 12)">
            <path d={renderedPath} data-mastergo-editable-d={editablePath} />
          </g>
        );
      }}
    </ParametricSvg>
  );
};

const gearPoints: Point[] = Array.from({ length: 32 }, (_, index) => {
  const toothStep = index % 4;
  const distance = toothStep === 1 || toothStep === 2 ? 9 : 7.3;
  const angle = -Math.PI / 2 + (index * Math.PI * 2) / 32;
  return [12 + Math.cos(angle) * distance, 12 + Math.sin(angle) * distance];
});

export const FsSettingsIcon = ({ cornerRadius = 0, ...props }: FsParametricIconProps) => {
  const radius = Math.max(0, cornerRadius);
  return (
    <ParametricSvg {...props} cornerRadius={radius}>
      {(geometryScale) => (
        <path
          d={`${roundedPath(gearPoints, radius / geometryScale, true)} ${circlePath(12, 12, 3)}`}
          data-mastergo-editable-d={`${roundedPath(gearPoints, 0, true)} ${circlePath(12, 12, 3)}`}
        />
      )}
    </ParametricSvg>
  );
};

const shieldTop: Point = [12, 2.5];
const shieldRightShoulder: Point = [20, 6.2];
const shieldLeftShoulder: Point = [4, 6.2];
const shieldBottom: Point = [12, 21.5];
const shieldRightSideStart: Point = [20, 12.2];
const shieldLeftSideStart: Point = [4, 12.2];
const shieldBottomRightGuide: Point = [16.6, 20.2];
const shieldBottomLeftGuide: Point = [7.4, 20.2];

const shieldCorner = (previous: Point, current: Point, next: Point, radius: number) => {
  const toPrevious: Point = [previous[0] - current[0], previous[1] - current[1]];
  const toNext: Point = [next[0] - current[0], next[1] - current[1]];
  const previousLength = Math.hypot(...toPrevious);
  const nextLength = Math.hypot(...toNext);
  const previousUnit: Point = [toPrevious[0] / previousLength, toPrevious[1] / previousLength];
  const nextUnit: Point = [toNext[0] / nextLength, toNext[1] / nextLength];
  const dot = Math.max(-0.999999, Math.min(0.999999, previousUnit[0] * nextUnit[0] + previousUnit[1] * nextUnit[1]));
  const angle = Math.acos(dot);
  const tangent = Math.min(Math.max(0, radius) / Math.tan(angle / 2), previousLength * 0.45, nextLength * 0.45);
  const effectiveRadius = tangent * Math.tan(angle / 2);
  const start: Point = [current[0] + previousUnit[0] * tangent, current[1] + previousUnit[1] * tangent];
  const end: Point = [current[0] + nextUnit[0] * tangent, current[1] + nextUnit[1] * tangent];
  const incoming: Point = [current[0] - previous[0], current[1] - previous[1]];
  const outgoing: Point = [next[0] - current[0], next[1] - current[1]];
  return {
    start,
    end,
    radius: effectiveRadius,
    sweep: incoming[0] * outgoing[1] - incoming[1] * outgoing[0] > 0 ? 1 : 0
  };
};

const shieldEditablePath = [
  `M${shieldTop[0]} ${shieldTop[1]}`,
  `L${shieldRightShoulder[0]} ${shieldRightShoulder[1]}`,
  `L${shieldRightSideStart[0]} ${shieldRightSideStart[1]}`,
  `C20 16.7 ${shieldBottomRightGuide[0]} ${shieldBottomRightGuide[1]} ${shieldBottom[0]} ${shieldBottom[1]}`,
  `C${shieldBottomLeftGuide[0]} ${shieldBottomLeftGuide[1]} 4 16.7 ${shieldLeftSideStart[0]} ${shieldLeftSideStart[1]}`,
  `L${shieldLeftShoulder[0]} ${shieldLeftShoulder[1]}`,
  'Z'
].join(' ');

const shieldPath = (radius: number) => {
  if (radius <= 0) return shieldEditablePath;
  const top = shieldCorner(shieldLeftShoulder, shieldTop, shieldRightShoulder, radius);
  const right = shieldCorner(shieldTop, shieldRightShoulder, shieldRightSideStart, radius);
  const bottom = shieldCorner(shieldBottomRightGuide, shieldBottom, shieldBottomLeftGuide, radius);
  const left = shieldCorner(shieldLeftSideStart, shieldLeftShoulder, shieldTop, radius);
  const arc = (corner: ReturnType<typeof shieldCorner>) =>
    `A${format(corner.radius)} ${format(corner.radius)} 0 0 ${corner.sweep} ${format(corner.end[0])} ${format(corner.end[1])}`;

  return [
    `M${format(top.end[0])} ${format(top.end[1])}`,
    `L${format(right.start[0])} ${format(right.start[1])}`,
    arc(right),
    `L${shieldRightSideStart[0]} ${shieldRightSideStart[1]}`,
    `C20 16.7 ${shieldBottomRightGuide[0]} ${shieldBottomRightGuide[1]} ${format(bottom.start[0])} ${format(bottom.start[1])}`,
    arc(bottom),
    `C${shieldBottomLeftGuide[0]} ${shieldBottomLeftGuide[1]} 4 16.7 ${shieldLeftSideStart[0]} ${shieldLeftSideStart[1]}`,
    `L${format(left.start[0])} ${format(left.start[1])}`,
    arc(left),
    `L${format(top.start[0])} ${format(top.start[1])}`,
    arc(top),
    'Z'
  ].join(' ');
};

const ShieldFrame = ({
  cornerRadius = 0,
  children,
  ...props
}: Omit<FsParametricIconProps, 'children'> & {
  children: (geometryScale: number, geometryStrokeWidth: number) => {
    rendered: string;
    editable?: string;
  };
}) => {
  const radius = Math.max(0, cornerRadius);
  return (
    <ParametricSvg {...props} cornerRadius={radius}>
      {(geometryScale, geometryStrokeWidth) => {
        const glyph = children(geometryScale, geometryStrokeWidth);
        return (
          <path
            d={`${shieldPath(radius / geometryScale)} ${glyph.rendered}`}
            data-mastergo-editable-d={`${shieldEditablePath} ${glyph.editable ?? glyph.rendered}`}
          />
        );
      }}
    </ParametricSvg>
  );
};

const FsShieldCheckIcon = ({ cornerRadius = 0, ...props }: FsParametricIconProps) => (
  <ShieldFrame {...props} cornerRadius={cornerRadius}>
    {(geometryScale) => ({
      rendered: roundedPath([[8.8, 12.1], [11, 14.2], [15.5, 9.8]], (Math.max(0, cornerRadius) * 0.7) / geometryScale),
      editable: roundedPath([[8.8, 12.1], [11, 14.2], [15.5, 9.8]], 0)
    })}
  </ShieldFrame>
);

const FsShieldXIcon = ({ cornerRadius = 0, ...props }: FsParametricIconProps) => (
  <ShieldFrame {...props} cornerRadius={cornerRadius}>
    {() => ({ rendered: 'M9.5 9.5 L14.5 14.5 M14.5 9.5 L9.5 14.5' })}
  </ShieldFrame>
);

const FsShieldQuestionIcon = ({ cornerRadius = 0, ...props }: FsParametricIconProps) => {
  const radius = Math.max(0, cornerRadius);
  return (
    <ParametricSvg {...props} cornerRadius={radius}>
      {(geometryScale, geometryStrokeWidth) => {
        const glyphPath = questionGlyphPath(geometryStrokeWidth);
        return (
          <path
            d={`${shieldPath(radius / geometryScale)} ${glyphPath}`}
            data-mastergo-editable-d={`${shieldEditablePath} ${glyphPath}`}
            strokeLinecap="butt"
          />
        );
      }}
    </ParametricSvg>
  );
};

const FsShieldAlertIcon = ({ cornerRadius = 0, ...props }: FsParametricIconProps) => {
  const radius = Math.max(0, cornerRadius);
  return (
    <ParametricSvg {...props} cornerRadius={radius}>
      {(geometryScale, geometryStrokeWidth) => {
        const glyphPath = alertGlyphPath(geometryStrokeWidth);
        return (
          <path
            d={`${shieldPath(radius / geometryScale)} ${glyphPath}`}
            data-mastergo-editable-d={`${shieldEditablePath} ${glyphPath}`}
            strokeLinecap="butt"
          />
        );
      }}
    </ParametricSvg>
  );
};

const FsShieldPlusIcon = ({ cornerRadius = 0, ...props }: FsParametricIconProps) => (
  <ShieldFrame {...props} cornerRadius={cornerRadius}>
    {() => ({ rendered: 'M9 12 H15 M12 9 V15' })}
  </ShieldFrame>
);

const FsShieldEllipsisIcon = ({ cornerRadius = 0, ...props }: FsParametricIconProps) => {
  const radius = Math.max(0, cornerRadius);
  return (
    <ShieldFrame {...props} cornerRadius={radius}>
      {(_geometryScale, geometryStrokeWidth) => ({
        rendered: [8, 12, 16].map((x) => dotSegmentPath(x, 12, geometryStrokeWidth)).join(' ')
      })}
    </ShieldFrame>
  );
};

const FsInfoIcon = ({ cornerRadius = 0, ...props }: FsParametricIconProps) => (
  <ParametricSvg {...props} cornerRadius={cornerRadius}>
    {(_geometryScale, geometryStrokeWidth) => (
      <path d={`${circlePath(12, 12, 10)} ${infoGlyphPath(geometryStrokeWidth)}`} strokeLinecap="butt" />
    )}
  </ParametricSvg>
);

const FsHelpIcon = ({ cornerRadius = 0, ...props }: FsParametricIconProps) => (
  <ParametricSvg {...props} cornerRadius={cornerRadius}>
    {(_geometryScale, geometryStrokeWidth) => (
      <path d={`${circlePath(12, 12, 10)} ${questionGlyphPath(geometryStrokeWidth)}`} strokeLinecap="butt" />
    )}
  </ParametricSvg>
);

const FsTriangleAlertIcon = ({ cornerRadius = 0, ...props }: FsParametricIconProps) => {
  const radius = Math.max(0, cornerRadius);
  const trianglePoints: Point[] = [[12, 2.5], [22, 20.5], [2, 20.5]];
  return (
    <ParametricSvg {...props} cornerRadius={radius}>
      {(geometryScale, geometryStrokeWidth) => {
        const glyphPath = alertGlyphPath(geometryStrokeWidth, 12, 16.8);
        return (
          <path
            d={`${roundedPath(trianglePoints, radius / geometryScale, true)} ${glyphPath}`}
            data-mastergo-editable-d={`${roundedPath(trianglePoints, 0, true)} ${glyphPath}`}
            strokeLinecap="butt"
          />
        );
      }}
    </ParametricSvg>
  );
};

const FsLockIcon = ({ cornerRadius = 0, ...props }: FsParametricIconProps) => {
  const radius = Math.max(0, cornerRadius);
  const bodyPoints: Point[] = [[5, 10], [19, 10], [19, 20], [5, 20]];
  return (
    <ParametricSvg {...props} cornerRadius={radius}>
      {(geometryScale, geometryStrokeWidth) => {
        const shacklePath = 'M8 10 V7 A4 4 0 0 1 16 7 V10';
        const dotPath = dotSegmentPath(12, 15, geometryStrokeWidth);
        return (
          <path
            d={`${shacklePath} ${roundedPath(bodyPoints, radius / geometryScale, true)} ${dotPath}`}
            data-mastergo-editable-d={`${shacklePath} ${roundedPath(bodyPoints, 0, true)} ${dotPath}`}
            strokeLinecap="butt"
          />
        );
      }}
    </ParametricSvg>
  );
};

export const fsParametricIcons: Record<string, React.ElementType<FsParametricIconProps>> = {
  全屏: FsMaximizeIcon,
  下载: FsDownloadIcon,
  主页: FsHomeIcon,
  查验: FsInspectionIcon,
  勾: FsCheckIcon,
  变小: FsShrinkIcon,
  保存: FsSaveIcon,
  编辑: FsEditIcon,
  设置: FsSettingsIcon,
  '盾-危害': FsShieldXIcon,
  '盾-疑问': FsShieldQuestionIcon,
  '盾-安全': FsShieldCheckIcon,
  '盾-警告': FsShieldAlertIcon,
  '盾-财产安全': FsShieldCheckIcon,
  '盾-提示': FsShieldPlusIcon,
  提示: FsInfoIcon,
  帮助: FsHelpIcon,
  '反馈-警告': FsTriangleAlertIcon,
  锁: FsLockIcon,
  '密码箱-关闭': FsLockIcon,
  安全隐私: FsShieldCheckIcon,
  隐私保护: FsShieldCheckIcon,
  稳定可靠: FsShieldCheckIcon,
  监管风控: FsShieldEllipsisIcon
};
