import React from 'react';
import { adjustPathCornerRadius } from './fs-node-icon';
import type { FsParametricIconProps } from './fs-parametric-icons';
import { CanonicalGridGroup, OpticalGridGroup, type IconKeylineProfile } from './icon-grid';
import type { IconfontSourceIconData } from './iconfont-source-icons.generated';

const format = (value: number) => String(Number(value.toFixed(4)));

const dotSegmentPath = (x: number, y: number, strokeWidth: number) => {
  const half = strokeWidth / 2;
  return `M${format(x - half)} ${format(y)} H${format(x + half)}`;
};

const strokeRelativeSegmentPath = (
  segment: NonNullable<IconfontSourceIconData['strokeRelativeSegments']>[number],
  strokeWidth: number
) => {
  const magnitude = Math.hypot(segment.dx, segment.dy) || 1;
  const halfLength = strokeWidth * segment.lengthMultiplier / 2;
  const offsetX = segment.dx / magnitude * halfLength;
  const offsetY = segment.dy / magnitude * halfLength;
  return `M${format(segment.x - offsetX)} ${format(segment.y - offsetY)} L${format(segment.x + offsetX)} ${format(segment.y + offsetY)}`;
};

export const createIconfontSourceIcon = (
  data: IconfontSourceIconData,
  displayName: string,
  sourceCalibrated = false,
  keylineProfile: IconKeylineProfile = 'square',
  opticalScale = 1
) => {
  const IconfontSourceIcon = ({
    size = 24,
    strokeWidth = 2,
    cornerRadius = 1,
    strokeLinecap = 'butt',
    strokeLinejoin = 'miter',
    ...props
  }: FsParametricIconProps) => {
    const radius = Math.max(0, Number(cornerRadius) || 0);

    const renderPath = (geometryScale: number, geometryStrokeWidth: number, geometryRadius: number) => {
      const editablePath = [
        ...data.paths,
        ...data.dots.map((dot) => dotSegmentPath(dot.x, dot.y, geometryStrokeWidth)),
        ...(data.strokeRelativeSegments ?? []).map((segment) => strokeRelativeSegmentPath(segment, geometryStrokeWidth))
      ].filter(Boolean).join(' ');
      const masterGoPath = adjustPathCornerRadius(editablePath, 0);
      const renderedPath = adjustPathCornerRadius(masterGoPath, geometryRadius / geometryScale);
      return <path d={renderedPath} data-mastergo-editable-d={masterGoPath} />;
    };

    if (sourceCalibrated) {
      const referenceGridScale = 32 / 24;
      const referenceStrokeWidth = Number(strokeWidth) * referenceGridScale;
      const referenceRadius = radius * referenceGridScale;
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
          data-iconfont-collection={data.collectionId}
          data-iconfont-source-id={data.sourceId}
          xmlns="http://www.w3.org/2000/svg"
        >
          <CanonicalGridGroup strokeWidth={referenceStrokeWidth} profile={keylineProfile} opticalScale={opticalScale}>
            {(geometryScale, geometryStrokeWidth) => renderPath(geometryScale, geometryStrokeWidth, referenceRadius)}
          </CanonicalGridGroup>
        </svg>
      );
    }

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
        data-iconfont-collection={data.collectionId}
        data-iconfont-source-id={data.sourceId}
        xmlns="http://www.w3.org/2000/svg"
      >
        <OpticalGridGroup strokeWidth={strokeWidth} mode="library">
          {(geometryScale, geometryStrokeWidth) => {
            // A single SVG path is the library-wide structural contract. Separate
            // semantic pieces remain editable M-subpaths inside the same vector
            // object instead of becoming separate MasterGo layers.
            return renderPath(geometryScale, geometryStrokeWidth, radius);
          }}
        </OpticalGridGroup>
      </svg>
    );
  };

  IconfontSourceIcon.displayName = displayName;
  return IconfontSourceIcon;
};
