import React, { useLayoutEffect, useRef, useState } from 'react';
import { GENERATED_ICON_GRID } from './icon-generation-standard';

export const ICON_GRID = {
  canvas: 24,
  center: 12,
  circleDiameter: 20,
  squareSize: 18,
  irregularSize: 19,
  horizontalWidth: 20,
  horizontalHeight: 16,
  verticalWidth: 16,
  verticalHeight: 20,
  minimumPadding: 1
} as const;

/** Canonical drawing keylines used by source-calibrated 32×32 icons. */
export const ICON_DRAWING_GRID = {
  canvas: 32,
  center: 16,
  squareWidth: 24,
  squareHeight: 24,
  circleDiameter: 28,
  verticalWidth: 22,
  verticalHeight: 26,
  horizontalWidth: 26,
  horizontalHeight: 22,
  arrowWidth: 10,
  arrowHeight: 18,
  arrowHorizontalWidth: 18,
  arrowHorizontalHeight: 10,
  closeSize: 18.5,
  resizeSize: 22
} as const;

export type IconKeylineProfile = 'square' | 'circle' | 'vertical' | 'horizontal' | 'arrow' | 'arrow-horizontal' | 'close' | 'resize';

type OpticalGridMode = 'source' | 'library' | 'generated';

type OpticalGridGroupProps = {
  strokeWidth: number | string;
  mode?: OpticalGridMode;
  children: React.ReactNode | ((geometryScale: number, geometryStrokeWidth: number) => React.ReactNode);
};

type OpticalState = {
  scale: number;
  sourceCenterX: number;
  sourceCenterY: number;
};

const initialOpticalState: OpticalState = {
  scale: 1,
  sourceCenterX: ICON_GRID.center,
  sourceCenterY: ICON_GRID.center
};

const nearlyEqual = (a: number, b: number) => Math.abs(a - b) < 0.002;
const clamp = (value: number, minimum: number, maximum: number) => Math.min(maximum, Math.max(minimum, value));

const getDominantPrimitive = (group: SVGGElement, groupBox: DOMRect) => {
  const elements = Array.from(group.querySelectorAll<SVGGraphicsElement>('circle, ellipse, rect'));
  for (const element of elements) {
    const box = element.getBBox();
    if (groupBox.width <= 0 || groupBox.height <= 0) continue;
    const widthCoverage = box.width / groupBox.width;
    const heightCoverage = box.height / groupBox.height;
    if (widthCoverage < 0.86 || heightCoverage < 0.86) continue;
    if (element.tagName.toLowerCase() === 'rect') return 'rect';
    return 'circle';
  }
  return null;
};

const calculateOpticalScale = (group: SVGGElement, box: DOMRect, mode: OpticalGridMode) => {
  if (mode === 'source') return 1;
  const targetGrid = mode === 'generated' ? GENERATED_ICON_GRID : ICON_GRID;
  const width = box.width;
  const height = box.height;
  const maximumDimension = Math.max(width, height);
  if (!Number.isFinite(maximumDimension) || maximumDimension <= 0 || maximumDimension <= 3) return 1;

  const ratio = width / height;
  const dominantPrimitive = getDominantPrimitive(group, box);
  let targetWidth: number = targetGrid.irregularSize;
  let targetHeight: number = targetGrid.irregularSize;

  if (dominantPrimitive === 'circle' && ratio >= 0.8 && ratio <= 1.25) {
    targetWidth = targetGrid.circleDiameter;
    targetHeight = targetGrid.circleDiameter;
  } else if (dominantPrimitive === 'rect' && ratio >= 0.8 && ratio <= 1.25) {
    targetWidth = targetGrid.squareSize;
    targetHeight = targetGrid.squareSize;
  } else if (ratio >= 1.35) {
    targetWidth = targetGrid.horizontalWidth;
    targetHeight = targetGrid.horizontalHeight;
  } else if (ratio <= 0.74) {
    targetWidth = targetGrid.verticalWidth;
    targetHeight = targetGrid.verticalHeight;
  }

  const fittedScale = Math.min(targetWidth / width, targetHeight / height);
  return mode === 'generated'
    ? clamp(fittedScale, 0.75, 1.4)
    : clamp(fittedScale, 0.88, 1.25);
};

export const OpticalGridGroup = ({ strokeWidth, mode = 'library', children }: OpticalGridGroupProps) => {
  const groupRef = useRef<SVGGElement>(null);
  const [optical, setOptical] = useState<OpticalState>(initialOpticalState);

  useLayoutEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    const box = group.getBBox();
    if (!Number.isFinite(box.width) || !Number.isFinite(box.height) || box.width <= 0 || box.height <= 0) return;

    const scale = calculateOpticalScale(group, box, mode);
    const centerX = box.x + box.width / 2;
    const centerY = box.y + box.height / 2;
    const shouldCorrectCenter = mode === 'generated' && (Math.abs(centerX - ICON_GRID.center) > 1 || Math.abs(centerY - ICON_GRID.center) > 1);
    const next: OpticalState = {
      scale,
      sourceCenterX: shouldCorrectCenter ? centerX : ICON_GRID.center,
      sourceCenterY: shouldCorrectCenter ? centerY : ICON_GRID.center
    };

    setOptical((current) =>
      nearlyEqual(current.scale, next.scale) &&
      nearlyEqual(current.sourceCenterX, next.sourceCenterX) &&
      nearlyEqual(current.sourceCenterY, next.sourceCenterY)
        ? current
        : next
    );
  }, [mode]);

  const numericStrokeWidth = Number(strokeWidth);
  const compensatedStrokeWidth = Number.isFinite(numericStrokeWidth)
    ? numericStrokeWidth / optical.scale
    : strokeWidth;
  const geometryStrokeWidth = Number.isFinite(numericStrokeWidth)
    ? numericStrokeWidth / optical.scale
    : 2 / optical.scale;
  const transform = `translate(${ICON_GRID.center} ${ICON_GRID.center}) scale(${optical.scale}) translate(${-optical.sourceCenterX} ${-optical.sourceCenterY})`;

  return (
    <g
      ref={groupRef}
      data-icon-grid="24"
      data-optical-scale={Number(optical.scale.toFixed(4))}
      transform={transform}
      strokeWidth={compensatedStrokeWidth}
    >
      {typeof children === 'function' ? children(optical.scale, geometryStrokeWidth) : children}
    </g>
  );
};

type CanonicalGridGroupProps = {
  strokeWidth: number;
  profile: IconKeylineProfile;
  opticalScale?: number;
  children: React.ReactNode | ((geometryScale: number, geometryStrokeWidth: number) => React.ReactNode);
};

const getCanonicalPathSize = (profile: IconKeylineProfile) => {
  if (profile === 'circle') return [ICON_DRAWING_GRID.circleDiameter, ICON_DRAWING_GRID.circleDiameter] as const;
  if (profile === 'vertical') return [ICON_DRAWING_GRID.verticalWidth, ICON_DRAWING_GRID.verticalHeight] as const;
  if (profile === 'horizontal') return [ICON_DRAWING_GRID.horizontalWidth, ICON_DRAWING_GRID.horizontalHeight] as const;
  if (profile === 'arrow') return [ICON_DRAWING_GRID.arrowWidth, ICON_DRAWING_GRID.arrowHeight] as const;
  if (profile === 'arrow-horizontal') return [ICON_DRAWING_GRID.arrowHorizontalWidth, ICON_DRAWING_GRID.arrowHorizontalHeight] as const;
  if (profile === 'close') return [ICON_DRAWING_GRID.closeSize, ICON_DRAWING_GRID.closeSize] as const;
  if (profile === 'resize') return [ICON_DRAWING_GRID.resizeSize, ICON_DRAWING_GRID.resizeSize] as const;
  return [ICON_DRAWING_GRID.squareWidth, ICON_DRAWING_GRID.squareHeight] as const;
};

/**
 * Fits a legacy 24-unit hand-drawn source path into the approved 32-unit
 * centreline keyline. Stroke width is independent and is never subtracted
 * from the requested MasterGo geometry size.
 */
export const CanonicalGridGroup = ({ strokeWidth, profile, opticalScale = 1, children }: CanonicalGridGroupProps) => {
  const groupRef = useRef<SVGGElement>(null);
  const [optical, setOptical] = useState<OpticalState>({
    scale: 32 / 24,
    sourceCenterX: 12,
    sourceCenterY: 12
  });

  useLayoutEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    const box = group.getBBox();
    if (!Number.isFinite(box.width) || !Number.isFinite(box.height) || (box.width <= 0 && box.height <= 0)) return;

    const [targetWidth, targetHeight] = getCanonicalPathSize(profile);
    const widthScale = box.width > 0 ? targetWidth / box.width : Number.POSITIVE_INFINITY;
    const heightScale = box.height > 0 ? targetHeight / box.height : Number.POSITIVE_INFINITY;
    const scale = Math.min(widthScale, heightScale) * opticalScale;
    const next: OpticalState = {
      scale,
      sourceCenterX: box.x + box.width / 2,
      sourceCenterY: box.y + box.height / 2
    };
    setOptical((current) =>
      nearlyEqual(current.scale, next.scale) &&
      nearlyEqual(current.sourceCenterX, next.sourceCenterX) &&
      nearlyEqual(current.sourceCenterY, next.sourceCenterY)
        ? current
        : next
    );
  }, [opticalScale, profile]);

  const compensatedStrokeWidth = strokeWidth / optical.scale;
  const transform = `translate(${ICON_DRAWING_GRID.center} ${ICON_DRAWING_GRID.center}) scale(${optical.scale}) translate(${-optical.sourceCenterX} ${-optical.sourceCenterY})`;

  return (
    <g
      ref={groupRef}
      data-icon-grid="32"
      data-keyline-profile={profile}
      data-optical-scale={Number(optical.scale.toFixed(4))}
      transform={transform}
      strokeWidth={compensatedStrokeWidth}
    >
      {typeof children === 'function'
        ? children(optical.scale, compensatedStrokeWidth)
        : children}
    </g>
  );
};
