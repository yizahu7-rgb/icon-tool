import { useEffect, useMemo, useRef, useState } from 'react';
import { Copy, Download, Search, Sparkles, UploadCloud, X } from 'lucide-react';
import { tdesignActionIcons } from './tdesign-action-icons';
import { tdesignAlertIcons } from './tdesign-alert-icons';
import { tdesignArrowIcons } from './tdesign-arrow-icons';
import { tdesignChartIcons } from './tdesign-chart-icons';
import { tdesignCommunicationIcons } from './tdesign-communication-icons';
import { tdesignComponentIcons } from './tdesign-component-icons';
import { tdesignDesignIcons } from './tdesign-design-icons';
import { tdesignDevelopmentIcons } from './tdesign-development-icons';
import { tdesignDeviceIcons } from './tdesign-device-icons';
import { tdesignDocumentIcons } from './tdesign-document-icons';
import { tdesignFileIcons } from './tdesign-file-icons';
import { tdesignImageIcons } from './tdesign-image-icons';
import { tdesignMapIcons } from './tdesign-map-icons';
import { tdesignMediaIcons } from './tdesign-media-icons';
import { tdesignSystemIcons } from './tdesign-system-icons';
import { tdesignUserIcons } from './tdesign-user-icons';
import { tdesignSmartIcons } from './tdesign-smart-icons';
import { serializeTDesignIcon, type TDesignIcon } from './tdesign-icons';
import {
  buildTDesignGenerationPrompt,
  resolveTDesignGenerationContext,
  TDESIGN_GENERATION_STANDARD_VERSION,
  validateTDesignGeneratedIcon
} from './tdesign-generation';
import { adjustPathCornerRadius, transformMasterGoPath } from './fs-node-icon';
import { saveIconfontSvg, serializeIconfontSvg } from './iconfont-export';
import './tdesign-smart.css';

const importedCategories = {
  '智能': tdesignSmartIcons,
  '行动': tdesignActionIcons,
  '警报': tdesignAlertIcons,
  '箭头': tdesignArrowIcons,
  '图表': tdesignChartIcons,
  '沟通': tdesignCommunicationIcons,
  '组件': tdesignComponentIcons,
  '设计': tdesignDesignIcons,
  '开发': tdesignDevelopmentIcons,
  '设备': tdesignDeviceIcons,
  '文档': tdesignDocumentIcons,
  '文件': tdesignFileIcons,
  '图片': tdesignImageIcons,
  '地图': tdesignMapIcons,
  '媒体': tdesignMediaIcons,
  '系统': tdesignSystemIcons,
  '用户': tdesignUserIcons
} as const;

type ImportedCategory = keyof typeof importedCategories;
const categories = Object.keys(importedCategories) as ImportedCategory[];
const importedIconCount = Object.values(importedCategories)
  .reduce((total, icons) => total + icons.length, 0);
const generationReferenceIcons: readonly TDesignIcon[] = Object.values(importedCategories).flat();
const libraryMaskCache = new WeakMap<TDesignIcon, Uint8Array>();

const rasterMask = async (url: string): Promise<Uint8Array> => {
  const image = new Image();
  image.src = url;
  await image.decode();
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 48;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('无法比较图标轮廓');
  context.fillStyle = '#fff';
  context.fillRect(0, 0, 48, 48);
  context.drawImage(image, 0, 0, 48, 48);
  const pixels = context.getImageData(0, 0, 48, 48).data;
  const raw = new Uint8Array(48 * 48);
  let left = 48; let top = 48; let right = -1; let bottom = -1;
  for (let y = 0; y < 48; y += 1) for (let x = 0; x < 48; x += 1) {
    const index = (y * 48 + x) * 4;
    if (Math.max(pixels[index], pixels[index + 1], pixels[index + 2]) > 180) continue;
    raw[y * 48 + x] = 1;
    left = Math.min(left, x); top = Math.min(top, y);
    right = Math.max(right, x); bottom = Math.max(bottom, y);
  }
  const normalized = new Uint8Array(32 * 32);
  if (right < left || bottom < top) return normalized;
  for (let y = 0; y < 32; y += 1) for (let x = 0; x < 32; x += 1) {
    const sx = left + Math.round(x * (right - left) / 31);
    const sy = top + Math.round(y * (bottom - top) / 31);
    normalized[y * 32 + x] = raw[sy * 48 + sx];
  }
  return normalized;
};

const findVisualLibraryMatches = async (imageUrl: string, icons: readonly TDesignIcon[]) => {
  const reference = await rasterMask(imageUrl);
  const ranked: Array<{ icon: TDesignIcon; score: number }> = [];
  for (let start = 0; start < icons.length; start += 16) {
    const chunk = icons.slice(start, start + 16);
    const masks = await Promise.all(chunk.map(async (icon) => {
      const cached = libraryMaskCache.get(icon);
      if (cached) return cached;
      try {
        const svg = serializeTDesignIcon(icon, 32);
        const mask = await rasterMask(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`);
        libraryMaskCache.set(icon, mask);
        return mask;
      } catch { return undefined; }
    }));
    masks.forEach((mask, index) => {
      if (!mask) return;
      let intersection = 0; let union = 0;
      for (let pixel = 0; pixel < mask.length; pixel += 1) {
        if (mask[pixel] || reference[pixel]) union += 1;
        if (mask[pixel] && reference[pixel]) intersection += 1;
      }
      if (union) ranked.push({ icon: chunk[index], score: intersection / union });
    });
  }
  return ranked.sort((a, b) => b.score - a.score).filter((item) => item.score >= 0.35).slice(0, 3)
    .map(({ icon }) => ({ name: icon.name, label: icon.label, keywords: icon.keywords,
      viewBox: icon.viewBox, body: icon.body, source: 'Current icon library' as const }));
};
const generatedCategory = '我的生成' as const;
type ActiveCategory = ImportedCategory | typeof generatedCategory;

type GeneratedTDesignIcon = TDesignIcon & {
  sourceModel?: string;
  normalizedSizeVersion?: 1;
  standardVersion: typeof TDESIGN_GENERATION_STANDARD_VERSION;
};

const generatedIconStorageKey = 'tdesign-v2-generated-icons';

type ReferenceShapeAnalysis = {
  aspectRatio: number;
  shape: 'square' | 'horizontal-rectangle' | 'vertical-rectangle' | 'circle' | 'irregular';
  hasFullRectangularFrame: boolean;
  hasSingleConnectedSubject: boolean;
  interiorVerticalGap?: number;
  hasTopBar: boolean;
  topProtrusions: number;
  hasCenteredTopTab: boolean;
  frameAspectRatio?: number;
  interiorSizeRatio?: { width: number; height: number };
  subjectBounds: { x: number; y: number; width: number; height: number };
};

export const analyzeReferenceShape = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): ReferenceShapeAnalysis | undefined => {
  const { width, height } = canvas;
  const pixels = context.getImageData(0, 0, width, height).data;
  const corners = [[0, 0], [width - 1, 0], [0, height - 1], [width - 1, height - 1]];
  const background = [0, 1, 2].map((channel) => Math.round(corners.reduce((sum, [x, y]) =>
    sum + pixels[(y * width + x) * 4 + channel], 0) / corners.length));
  if (corners.some(([x, y]) => [0, 1, 2].some((channel) =>
    Math.abs(pixels[(y * width + x) * 4 + channel] - background[channel]) > 24))) return undefined;
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  let foregroundCount = 0;
  const foreground = new Uint8Array(width * height);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;
      const difference = Math.max(...background.map((value, channel) =>
        Math.abs(pixels[index + channel] - value)));
      if (pixels[index + 3] < 64 || difference < 48) continue;
      foreground[y * width + x] = 1;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
      foregroundCount += 1;
    }
  }
  if (foregroundCount < width * height * 0.002 || foregroundCount > width * height * 0.35
    || maxX < minX || maxY < minY) return undefined;
  const fullWidth = maxX - minX + 1;
  const fullHeight = maxY - minY + 1;
  const visited = new Uint8Array(width * height);
  const components: Array<{ x: number; y: number; right: number; bottom: number; area: number }> = [];
  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const start = y * width + x;
      if (!foreground[start] || visited[start]) continue;
      const queue = [start];
      visited[start] = 1;
      const component = { x, y, right: x, bottom: y, area: 0 };
      for (let head = 0; head < queue.length; head += 1) {
        const index = queue[head];
        const px = index % width;
        const py = Math.floor(index / width);
        component.x = Math.min(component.x, px);
        component.y = Math.min(component.y, py);
        component.right = Math.max(component.right, px);
        component.bottom = Math.max(component.bottom, py);
        component.area += 1;
        for (const neighbor of [index - 1, index + 1, index - width, index + width]) {
          if (neighbor < 0 || neighbor >= foreground.length || visited[neighbor] || !foreground[neighbor]) continue;
          if (Math.abs(neighbor % width - px) + Math.abs(Math.floor(neighbor / width) - py) !== 1) continue;
          visited[neighbor] = 1;
          queue.push(neighbor);
        }
      }
      if (component.area >= 3) components.push(component);
    }
  }
  // A screenshot may contain a caption below the icon. Measure and send the
  // connected icon silhouette, not the union of every dark pixel in the file.
  const subject = [...components].sort((a, b) => b.area - a.area)[0];
  if (!subject || subject.area < foregroundCount * 0.12
    || subject.right - subject.x + 1 < fullWidth * 0.4
    || subject.bottom - subject.y + 1 < fullHeight * 0.4) return undefined;
  minX = subject.x;
  minY = subject.y;
  maxX = subject.right;
  maxY = subject.bottom;
  const boxWidth = maxX - minX + 1;
  const boxHeight = maxY - minY + 1;
  if (boxWidth < 8 || boxHeight < 8) return undefined;
  const aspectRatio = boxWidth / boxHeight;
  const sideSupport = (vertical: boolean, farSide: boolean) => {
    let supported = 0;
    for (const position of [0.15, 0.25, 0.5, 0.75, 0.85]) {
      const fixed = farSide ? 0.97 : 0.03;
      const px = minX + Math.round((vertical ? fixed : position) * (boxWidth - 1));
      const py = minY + Math.round((vertical ? position : fixed) * (boxHeight - 1));
      const radius = Math.max(2, Math.round((vertical ? boxWidth : boxHeight) * 0.05));
      let found = false;
      for (let offset = -radius; offset <= radius && !found; offset += 1) {
        const x = vertical ? px + offset : px;
        const y = vertical ? py : py + offset;
        found = x >= 0 && x < width && y >= 0 && y < height && foreground[y * width + x] === 1;
      }
      if (found) supported += 1;
    }
    return supported >= 5;
  };
  const hasRectangularOutline = sideSupport(true, false) && sideSupport(true, true)
    && sideSupport(false, false) && sideSupport(false, true);
  // Keyline classification is about overall size. A sloped lid can still fit a
  // square keyline, but its upper diagonal is not a rounded frame corner.
  const hasEarlySideWall = (farSide: boolean) => [0.09, 0.13, 0.17].filter((fraction) => {
    const y = minY + Math.round(fraction * (boxHeight - 1));
    const edge = farSide ? maxX : minX;
    const tolerance = Math.max(1, Math.round(boxWidth * 0.035));
    for (let offset = 0; offset <= tolerance; offset += 1) {
      const x = edge + (farSide ? -offset : offset);
      if (foreground[y * width + x]) return true;
    }
    return false;
  }).length >= 2;
  const hasFullRectangularFrame = hasRectangularOutline
    && hasEarlySideWall(false) && hasEarlySideWall(true);
  const shape = hasRectangularOutline
    ? aspectRatio >= 0.94 && aspectRatio <= 1.06 ? 'square'
      : aspectRatio > 1.06 ? 'horizontal-rectangle' : 'vertical-rectangle'
    : aspectRatio >= 0.85 && aspectRatio <= 1.18
      && [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875].every((fraction) => {
        const angle = fraction * Math.PI * 2;
        const x = minX + Math.round((0.5 + 0.45 * Math.cos(angle)) * (boxWidth - 1));
        const y = minY + Math.round((0.5 + 0.45 * Math.sin(angle)) * (boxHeight - 1));
        return foreground[y * width + x] === 1 || Array.from({ length: 25 }, (_, index) => {
          const dx = index % 5 - 2;
          const dy = Math.floor(index / 5) - 2;
          return foreground[(y + dy) * width + x + dx] === 1;
        }).some(Boolean);
      }) ? 'circle' : 'irregular';
  const interiorComponents = components.filter((component) => component !== subject
    && component.x > minX + 2 && component.right < maxX - 2
    && component.y > minY + 2 && component.bottom < maxY - 2);
  const nearbyDetachedComponents = components.filter((component) => component !== subject
    && component.right >= minX - boxWidth * 0.08
    && component.x <= maxX + boxWidth * 0.08
    && component.bottom >= minY - boxHeight * 0.08
    && component.y <= maxY + boxHeight * 0.08);
  const bar = interiorComponents.filter((item) => (item.right - item.x + 1) >= boxWidth * 0.3
    && (item.right - item.x + 1) >= (item.bottom - item.y + 1) * 2
    && item.y < minY + boxHeight * 0.5)
    .sort((a, b) => a.y - b.y)[0];
  const below = bar && interiorComponents.filter((item) => item.y > bar.bottom
    && item.x < bar.right && item.right > bar.x).sort((a, b) => a.y - b.y)[0];
  const visibleGap = bar && below ? below.y - bar.bottom - 1 : 0;
  const interiorVerticalGap = visibleGap > 0
    ? Math.max(3.5, Math.min(6, visibleGap * (shape === 'square' ? 24 : 26) / boxHeight + 2))
    : undefined;
  let hasTopBar = false;
  let topBarY = -1;
  for (let y = minY; y <= minY + boxHeight * 0.4 && !hasTopBar; y += 1) {
    let run = 0;
    for (let x = minX; x <= maxX; x += 1) {
      run = foreground[y * width + x] ? run + 1 : 0;
      if (run >= boxWidth * 0.55) { hasTopBar = true; topBarY = y; break; }
    }
  }
  let topProtrusions = 0;
  const protrusionColumns: number[] = [];
  if (topBarY >= minY + 3) {
    let active = false;
    for (let x = minX + Math.round(boxWidth * 0.1); x <= maxX - Math.round(boxWidth * 0.1); x += 1) {
      let columnHasInk = false;
      for (let y = minY; y < topBarY - 1; y += 1) {
        if (foreground[y * width + x]) { columnHasInk = true; break; }
      }
      if (columnHasInk) protrusionColumns.push(x);
      if (columnHasInk && !active) topProtrusions += 1;
      active = columnHasInk;
    }
  }
  if (topProtrusions > 4) topProtrusions = 0;
  const protrusionLeft = protrusionColumns[0];
  const protrusionRight = protrusionColumns[protrusionColumns.length - 1];
  const hasCenteredTopTab = topProtrusions === 1 && protrusionLeft !== undefined
    && protrusionRight !== undefined
    && (protrusionRight - protrusionLeft) <= boxWidth * 0.45
    && Math.abs((protrusionLeft + protrusionRight) / 2 - (minX + maxX) / 2) <= boxWidth * 0.12;
  const frameRatio = topBarY >= 0 ? boxWidth / (maxY - topBarY + 1) : 0;
  const frameShape = hasTopBar && topProtrusions >= 2 && frameRatio >= 0.85 && frameRatio <= 1.18
    ? 'square' : shape;
  const innerCandidates = interiorComponents.filter((item) => item.y > (topBarY >= 0 ? topBarY : minY) + 2);
  const inner = innerCandidates.sort((a, b) => b.area - a.area)[0];
  const innerWidthRatio = inner ? (inner.right - inner.x + 1) / boxWidth : 0;
  const innerHeightRatio = inner ? (inner.bottom - inner.y + 1) / (topBarY >= 0 ? maxY - topBarY + 1 : boxHeight) : 0;
  const interiorSizeRatio = inner && innerCandidates.length === 1
    && innerWidthRatio >= 0.1 && innerWidthRatio <= 0.75
    && innerHeightRatio >= 0.1 && innerHeightRatio <= 0.75
    ? { width: innerWidthRatio, height: innerHeightRatio } : undefined;
  return { aspectRatio, shape: frameShape, hasFullRectangularFrame,
    hasSingleConnectedSubject: nearbyDetachedComponents.length === 0,
    interiorVerticalGap, hasTopBar, topProtrusions, hasCenteredTopTab,
    frameAspectRatio: topProtrusions > 0 && frameRatio >= 0.7 && frameRatio <= 1.4 ? frameRatio : undefined,
    interiorSizeRatio,
    subjectBounds: { x: minX, y: minY, width: boxWidth, height: boxHeight } };
};

const simulatedIdentityIcon: GeneratedTDesignIcon = {
  name: 'generated-identity-card-simulation',
  label: '身份证',
  keywords: ['身份证', '证件', '身份认证', '个人资料', '模拟生成'],
  viewBox: '0 0 32 32',
  body: `<g id="stroke1">
<path d="M3 5H29V27H3Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"/>
</g>
<g id="stroke2">
<path d="M14.5 13.5A3 3 0 1 1 8.5 13.5A3 3 0 1 1 14.5 13.5Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"/>
<path d="M7.5 21C9.75 18.25 13.5 18.25 15.75 21" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"/>
<path d="M20 12.5H25" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"/>
<path d="M20 18.5H25" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"/>
</g>`,
  sourceModel: '对话模拟',
  standardVersion: TDESIGN_GENERATION_STANDARD_VERSION
};

const simulatedWarehouseOutIcon: GeneratedTDesignIcon = {
  name: 'generated-warehouse-out-simulation',
  label: '出库',
  keywords: ['出库', '仓库', '库存', '向外', '模拟生成'],
  viewBox: '0 0 32 32',
  body: `<g id="stroke1">
<path d="M4 28V12L16 4L28 12V28H4Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"/>
</g>
<g id="stroke2">
<path d="M16 20V8.5M12.5 12L16 8.5L19.5 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"/>
</g>`,
  sourceModel: '固定母版 · 仓储流转家族',
  standardVersion: TDESIGN_GENERATION_STANDARD_VERSION
};

const simulatedPackingIcon: GeneratedTDesignIcon = {
  name: 'generated-packing-simulation',
  label: '装箱',
  keywords: ['装箱', '打包', '箱子', '入箱', '模拟生成'],
  viewBox: '0 0 32 32',
  body: `<g id="stroke1">
<path d="M16 28L4 21.5V10.5L16 4L27 10V16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"/>
<path data-corner-fixed="true" d="M16 16L27 10M16 16V28M16 16L4 10.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"/>
</g>
<g id="stroke2">
<path d="M29 23.5H20.5M24.5 19.5L20.5 23.5L24.5 27.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"/>
</g>`,
  sourceModel: '参考重绘 · Tabler package-import',
  standardVersion: TDESIGN_GENERATION_STANDARD_VERSION
};

const simulatedReturnGoodsIcon: GeneratedTDesignIcon = {
  name: 'generated-return-goods-simulation',
  label: '退货',
  keywords: ['退货', '返回', '箱子', '逆向物流', '模拟生成'],
  viewBox: '0 0 32 32',
  body: `<g id="stroke1">
<path d="M7 24.5H3V5H19V13.5M13 24.5H20M19 6H25L29 12.5V24.5H25.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"/>
<path data-corner-fixed="true" d="M7 24.5A2.5 2.5 0 1 0 12 24.5A2.5 2.5 0 1 0 7 24.5M20.5 24.5A2.5 2.5 0 1 0 25.5 24.5A2.5 2.5 0 1 0 20.5 24.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"/>
</g>
<g id="stroke2">
<path d="M16 16H9M12 13L9 16L12 19" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"/>
</g>`,
  sourceModel: '参考重绘 · Tabler truck-return',
  standardVersion: TDESIGN_GENERATION_STANDARD_VERSION
};

const simulatedNonconformanceIcon: GeneratedTDesignIcon = {
  name: 'generated-nonconformance-processing-simulation',
  label: '不合格处理',
  keywords: ['不合格处理', '异常处理', '质量', '退回', '模拟生成'],
  viewBox: '0 0 32 32',
  body: `<g id="stroke1">
<path d="M4 9L16 3L28 9V24L16 29L4 24V9ZM4 9L16 15L28 9M16 15V29" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"/>
</g>
<g id="stroke2">
<path d="M7.5 17.5L11.5 21.5M11.5 17.5L7.5 21.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"/>
</g>`,
  sourceModel: '固定母版 · 质量异常处理家族',
  standardVersion: TDESIGN_GENERATION_STANDARD_VERSION
};

const simulatedGeneratedIcons = [
  simulatedNonconformanceIcon,
  simulatedReturnGoodsIcon,
  simulatedPackingIcon,
  simulatedWarehouseOutIcon,
  simulatedIdentityIcon
];

const readGeneratedIcons = (): GeneratedTDesignIcon[] => {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(generatedIconStorageKey) || '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((item): GeneratedTDesignIcon[] => {
      if (!item || typeof item !== 'object') return [];
      const candidate = item as Partial<GeneratedTDesignIcon>;
      if (
        typeof candidate.name !== 'string'
        || typeof candidate.label !== 'string'
        || typeof candidate.body !== 'string'
        || candidate.viewBox !== '0 0 32 32'
      ) return [];
      const validation = validateTDesignGeneratedIcon(
        `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">${candidate.body}</svg>`
      );
      if (!validation.ok) return [];
      // Earlier versions accepted oversized masters because fitting only
      // scaled upward. Refit legacy straight-line drawings on load so their
      // preview, copied SVG, and export all use the same corrected geometry.
      const sourceSvg = `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">${validation.body}</svg>`;
      const parsedSvg = new DOMParser().parseFromString(sourceSvg, 'image/svg+xml');
      const hasIntrinsicCurves = Array.from(parsedSvg.querySelectorAll('path[d]'))
        .some((path) => /[ACQST]/.test(path.getAttribute('d') || ''));
      const refitted = candidate.normalizedSizeVersion !== 1
        && !hasIntrinsicCurves && !candidate.sourceModel?.includes('固定母版')
        ? validateTDesignGeneratedIcon(sourceSvg, { references: [], stroke2Role: 'core-detail' })
        : validation;
      return [{
        name: candidate.name,
        label: candidate.label,
        keywords: Array.isArray(candidate.keywords)
          ? candidate.keywords.filter((keyword): keyword is string => typeof keyword === 'string')
          : [candidate.label],
        viewBox: '0 0 32 32',
        body: refitted.ok ? refitted.body : validation.body,
        normalizedSizeVersion: 1,
        standardVersion: TDESIGN_GENERATION_STANDARD_VERSION,
        ...(typeof candidate.sourceModel === 'string' ? { sourceModel: candidate.sourceModel } : {})
      }];
    });
  } catch {
    return [];
  }
};

const iconSizes = [16, 24, 32, 48] as const;
type IconSize = typeof iconSizes[number];
const fixedCornerIconNames = new Set(['menu-application', 'more', 'ellipsis']);

const writeClipboard = async (value: string) => {
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = value;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
  }
};

const setOutlineFillLayersTransparent = (root: ParentNode) => {
  root.querySelectorAll('[id="fill1"], [id="fill2"]').forEach((layer) => {
    if (layer.hasAttribute('fill')) layer.setAttribute('fill', 'transparent');
    layer.querySelectorAll('[fill]').forEach((child) => child.setAttribute('fill', 'transparent'));
  });
};

const getOuterCornerPaths = (root: ParentNode) => {
  const paths = new Set<Element>();
  const innerPathData = new Set<string>();

  root.querySelectorAll('[id="stroke2"], [id="fill2"]').forEach((layer) => {
    if (layer.tagName.toLowerCase() === 'path' && layer.hasAttribute('d')) {
      innerPathData.add(layer.getAttribute('d') ?? '');
    }
    layer.querySelectorAll('path[d]').forEach((path) => {
      innerPathData.add(path.getAttribute('d') ?? '');
    });
  });

  root.querySelectorAll('[id="stroke1"], [id="fill1"]').forEach((layer) => {
    if (layer.tagName.toLowerCase() === 'path' && layer.hasAttribute('d')) {
      if (!layer.hasAttribute('data-corner-fixed') && !innerPathData.has(layer.getAttribute('d') ?? '')) {
        paths.add(layer);
      }
    }
    layer.querySelectorAll('path[d]').forEach((path) => {
      if (!path.hasAttribute('data-corner-fixed') && !innerPathData.has(path.getAttribute('d') ?? '')) {
        paths.add(path);
      }
    });
  });

  return paths;
};

const applyOuterCornerRadiusToBody = (body: string, cornerRadius: number) => {
  if (cornerRadius <= 0) return body;

  const svgDocument = new DOMParser().parseFromString(
    `<svg xmlns="http://www.w3.org/2000/svg">${body}</svg>`,
    'image/svg+xml'
  );
  const svg = svgDocument.documentElement;

  getOuterCornerPaths(svg).forEach((path) => {
    const pathData = path.getAttribute('d');
    if (pathData) path.setAttribute('d', adjustPathCornerRadius(pathData, cornerRadius));
  });

  return svg.innerHTML;
};

const parseViewBox = (viewBox: string) => {
  const values = viewBox.trim().split(/[\s,]+/).map(Number);
  if (
    values.length !== 4
    || values.some((value) => !Number.isFinite(value))
    || values[2] <= 0
    || values[3] <= 0
  ) {
    return { x: 0, y: 0, width: 24, height: 24 };
  }
  const [x, y, width, height] = values;
  return { x, y, width, height };
};

const getSquareFit = (viewBox: string, iconSize: IconSize) => {
  const { x, y, width, height } = parseViewBox(viewBox);
  const scale = iconSize / Math.max(width, height);
  return {
    scale,
    matrix: {
      a: scale,
      b: 0,
      c: 0,
      d: scale,
      e: (iconSize - width * scale) / 2 - x * scale,
      f: (iconSize - height * scale) / 2 - y * scale
    }
  };
};

const formatSvgNumber = (value: number) => String(Number(value.toFixed(3)));

function SmartIconGraphic({
  icon,
  size,
  strokeWidth,
  cornerRadius
}: {
  icon: TDesignIcon;
  size: IconSize;
  strokeWidth: number;
  cornerRadius: number;
}) {
  const { scale } = getSquareFit(icon.viewBox, size);
  const appliedCornerRadius = fixedCornerIconNames.has(icon.name) ? 0 : cornerRadius;
  const sourceCornerRadius = appliedCornerRadius / scale;
  const body = useMemo(
    () => applyOuterCornerRadiusToBody(icon.body, sourceCornerRadius),
    [icon.body, sourceCornerRadius]
  );
  const iconStyle = {
    '--td-smart-stroke-width': strokeWidth / scale,
    '--td-icon-fill': 'transparent'
  } as React.CSSProperties;

  return (
    <svg
      width={size}
      height={size}
      viewBox={icon.viewBox}
      fill="none"
      style={iconStyle}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: body }}
    />
  );
}

const serializeConfiguredIcon = (
  icon: TDesignIcon,
  iconSize: IconSize,
  strokeWidth: number,
  cornerRadius: number,
  primaryColor: string,
  secondaryColor: string
) => {
  const svgDocument = new DOMParser().parseFromString(serializeTDesignIcon(icon, iconSize), 'image/svg+xml');
  const svg = svgDocument.documentElement;
  const { scale, matrix } = getSquareFit(icon.viewBox, iconSize);
  const outerCornerPaths = getOuterCornerPaths(svg);
  const appliedCornerRadius = fixedCornerIconNames.has(icon.name) ? 0 : cornerRadius;

  setOutlineFillLayersTransparent(svg);

  svg.querySelectorAll('path[d]').forEach((element) => {
    const sourcePath = element.getAttribute('d') ?? '';
    const sourceCornerRadius = appliedCornerRadius / scale;
    const roundedPath = appliedCornerRadius > 0 && outerCornerPaths.has(element)
      ? adjustPathCornerRadius(sourcePath, sourceCornerRadius)
      : sourcePath;
    element.setAttribute('d', transformMasterGoPath(roundedPath, matrix));
  });

  svg.querySelectorAll('rect').forEach((element) => {
    const x = Number(element.getAttribute('x') ?? 0);
    const y = Number(element.getAttribute('y') ?? 0);
    const width = Number(element.getAttribute('width') ?? 0);
    const height = Number(element.getAttribute('height') ?? 0);
    element.setAttribute('x', formatSvgNumber(x * scale + matrix.e));
    element.setAttribute('y', formatSvgNumber(y * scale + matrix.f));
    element.setAttribute('width', formatSvgNumber(width * scale));
    element.setAttribute('height', formatSvgNumber(height * scale));
    if (element.hasAttribute('rx')) {
      element.setAttribute('rx', formatSvgNumber(Number(element.getAttribute('rx')) * scale));
    }
    if (element.hasAttribute('ry')) {
      element.setAttribute('ry', formatSvgNumber(Number(element.getAttribute('ry')) * scale));
    }
  });

  svg.setAttribute('viewBox', `0 0 ${iconSize} ${iconSize}`);

  svg.querySelectorAll('[stroke]').forEach((element) => {
    element.setAttribute('stroke', primaryColor);
    element.setAttribute('stroke-width', String(strokeWidth));
  });

  svg.querySelectorAll('[id="stroke2"]').forEach((element) => {
    if (element.hasAttribute('stroke')) element.setAttribute('stroke', secondaryColor);
    element.querySelectorAll('[stroke]').forEach((child) => child.setAttribute('stroke', secondaryColor));
  });

  svg.querySelectorAll('[data-corner-fixed]').forEach((element) => {
    element.removeAttribute('data-corner-fixed');
  });

  return new XMLSerializer().serializeToString(svg);
};

export default function TDesignSmartPage() {
  const [toast, setToast] = useState('');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<ActiveCategory>('用户');
  const [generatedIcons, setGeneratedIcons] = useState<GeneratedTDesignIcon[]>(() => {
    const storedIcons = readGeneratedIcons();
    if (!import.meta.env.DEV) return storedIcons;
    const simulationNames = new Set(simulatedGeneratedIcons.map((icon) => icon.name));
    const storedUserIcons = storedIcons.filter((icon) => !simulationNames.has(icon.name));
    return [...simulatedGeneratedIcons, ...storedUserIcons];
  });
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [generationConcept, setGenerationConcept] = useState('');
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [referenceImageBase64, setReferenceImageBase64] = useState<string | null>(null);
  const [referenceImageMimeType, setReferenceImageMimeType] = useState<string | null>(null);
  const [referenceShapeAnalysis, setReferenceShapeAnalysis] = useState<ReferenceShapeAnalysis | undefined>();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationPhase, setGenerationPhase] = useState('');
  const [generatorError, setGeneratorError] = useState('');
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const generatorTriggerRef = useRef<HTMLButtonElement>(null);
  const generatorPromptRef = useRef<HTMLTextAreaElement>(null);
  const generatorDialogRef = useRef<HTMLElement>(null);
  const isGeneratingRef = useRef(false);
  const generationControllerRef = useRef<AbortController | null>(null);
  const generationTimedOutRef = useRef(false);
  const generatorFileInputRef = useRef<HTMLInputElement>(null);
  const [iconSize, setIconSize] = useState<IconSize>(32);
  const [strokeWidth, setStrokeWidth] = useState(1.5);
  const [cornerRadius, setCornerRadius] = useState(0);
  const [colorType, setColorType] = useState<'single' | 'double'>('single');
  const [primaryColor, setPrimaryColor] = useState('currentColor');
  const [secondaryColor, setSecondaryColor] = useState('#0262f8');

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 1800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    window.localStorage.setItem(generatedIconStorageKey, JSON.stringify(generatedIcons));
  }, [generatedIcons]);

  useEffect(() => {
    isGeneratingRef.current = isGenerating;
  }, [isGenerating]);

  useEffect(() => {
    if (!isGeneratorOpen) return;
    const handlePaste = (event: ClipboardEvent) => {
      const imageItem = Array.from(event.clipboardData?.items || [])
        .find((item) => item.type.startsWith('image/'));
      const file = imageItem?.getAsFile();
      if (file) processReferenceImage(file);
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [isGeneratorOpen]);

  useEffect(() => {
    if (!isGeneratorOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusTimer = window.setTimeout(() => generatorPromptRef.current?.focus(), 0);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isGeneratingRef.current) {
        setIsGeneratorOpen(false);
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = Array.from(generatorDialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), textarea:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      ) || []).filter((element) => element.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      generatorTriggerRef.current?.focus();
    };
  }, [isGeneratorOpen]);

  const visibleCategories = useMemo<ActiveCategory[]>(
    () => generatedIcons.length ? [...categories, generatedCategory] : categories,
    [generatedIcons.length]
  );
  const totalIconCount = importedIconCount + generatedIcons.length;

  const filteredIcons = useMemo(() => {
    const query = search.trim().toLowerCase();
    const activeIcons = activeCategory === generatedCategory
      ? generatedIcons
      : importedCategories[activeCategory];
    return query
      ? activeIcons.filter((icon) =>
          icon.name.includes(query)
          || icon.label.toLowerCase().includes(query)
          || icon.keywords.some((keyword) => keyword.toLowerCase().includes(query))
        )
      : activeIcons;
  }, [activeCategory, generatedIcons, search]);

  const processReferenceImage = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setToast('请选择图片文件');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const image = new Image();
      image.onload = () => {
        const maxSize = 512;
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        const context = canvas.getContext('2d');
        if (!context) {
          setToast('无法读取参考图片');
          return;
        }
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        const analysis = analyzeReferenceShape(canvas, context);
        setReferenceShapeAnalysis(analysis);
        if (analysis) {
          const { x, y, width, height } = analysis.subjectBounds;
          const padding = Math.max(6, Math.round(Math.max(width, height) * 0.2));
          const left = Math.max(0, x - padding);
          const top = Math.max(0, y - padding);
          const right = Math.min(canvas.width, x + width + padding);
          const bottom = Math.min(canvas.height, y + height + padding);
          const cropped = document.createElement('canvas');
          cropped.width = right - left;
          cropped.height = bottom - top;
          const cropContext = cropped.getContext('2d');
          if (cropContext) {
            cropContext.drawImage(canvas, left, top, cropped.width, cropped.height,
              0, 0, cropped.width, cropped.height);
            canvas.width = cropped.width;
            canvas.height = cropped.height;
            context.drawImage(cropped, 0, 0);
          }
        }
        const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(mimeType, 0.82);
        setReferenceImage(dataUrl);
        setReferenceImageBase64(dataUrl.split(',')[1]);
        setReferenceImageMimeType(mimeType);
      };
      image.onerror = () => setToast('参考图片读取失败');
      image.src = String(event.target?.result || '');
    };
    reader.readAsDataURL(file);
  };

  const clearReferenceImage = () => {
    setReferenceImage(null);
    setReferenceImageBase64(null);
    setReferenceImageMimeType(null);
    setReferenceShapeAnalysis(undefined);
    if (generatorFileInputRef.current) generatorFileInputRef.current.value = '';
  };

  const generateIcon = async () => {
    const concept = generationConcept.trim();
    if (!concept && !referenceImageBase64) {
      setToast('请输入图标语义或添加参考图片');
      return;
    }
    setGeneratorError('');
    setIsGenerating(true);
    setGenerationPhase('正在绘制图标…');
    const controller = new AbortController();
    generationControllerRef.current = controller;
    generationTimedOutRef.current = false;
    const timeout = window.setTimeout(() => {
      generationTimedOutRef.current = true;
      controller.abort();
    }, 70000);
    try {
      // Search the current library before drawing. With an uploaded image the
      // matching icon is a starting geometry, while the image decides which
      // strokes must be retained or changed; a preset cannot override it.
      const matchedContext = resolveTDesignGenerationContext(
        concept || '参考图中的主体',
        [...generationReferenceIcons, ...generatedIcons]
      );
      const generationContext = referenceImageBase64
        ? { ...matchedContext, family: undefined }
        : matchedContext;
      if (referenceImageBase64 && referenceImageMimeType && !concept) {
        setGenerationPhase('正在检索图标库…');
        try {
          generationContext.references = await findVisualLibraryMatches(
            `data:${referenceImageMimeType};base64,${referenceImageBase64}`,
            [...generationReferenceIcons, ...generatedIcons]
          );
        } catch (error) {
          console.warn('Current-library visual search failed:', error);
        }
        setGenerationPhase('正在绘制图标…');
      }
      if (referenceImageBase64 && referenceShapeAnalysis) {
        // Disconnected external strokes can sit outside the dominant component.
        // Their combined ratio cannot be inferred reliably from one pixel box.
        generationContext.referenceAspectRatio = referenceShapeAnalysis.shape === 'irregular'
          ? undefined : referenceShapeAnalysis.aspectRatio;
        generationContext.referenceShape = referenceShapeAnalysis.shape;
        generationContext.referenceHasFullRectangularFrame = referenceShapeAnalysis.hasFullRectangularFrame;
        generationContext.referenceHasSingleConnectedSubject = referenceShapeAnalysis.hasSingleConnectedSubject;
        generationContext.referenceInteriorGap = referenceShapeAnalysis.interiorVerticalGap;
        generationContext.referenceHasTopBar = referenceShapeAnalysis.hasTopBar;
        generationContext.referenceTopProtrusions = referenceShapeAnalysis.topProtrusions;
        generationContext.referenceHasCenteredTopTab = referenceShapeAnalysis.hasCenteredTopTab;
        generationContext.referenceFrameAspectRatio = referenceShapeAnalysis.frameAspectRatio;
        generationContext.referenceInteriorSizeRatio = referenceShapeAnalysis.interiorSizeRatio;
      }
      const prompt = buildTDesignGenerationPrompt({
        concept: concept || '参考图中的主体',
        hasReferenceImage: Boolean(referenceImageBase64),
        cornerRadius,
        context: generationContext
      });
      const useLocalModel = import.meta.env.VITE_USE_LOCAL_MODEL === 'true';
      let generatedText: string;
      let sourceModel: string | undefined;
      let externalReferenceLabel: string | undefined;

      if (generationContext.family?.presetSvg) {
        generatedText = generationContext.family.presetSvg;
        sourceModel = referenceImageBase64
          ? `参考归一化 · ${generationContext.family.label}`
          : `固定母版 · ${generationContext.family.label}`;
      } else {
        const localContent: Array<Record<string, unknown>> = [{ type: 'text', text: prompt }];
        if (referenceImageBase64 && referenceImageMimeType) {
          localContent.push({
            type: 'image_url',
            image_url: { url: `data:${referenceImageMimeType};base64,${referenceImageBase64}` }
          });
        }
        const response = await fetch(useLocalModel ? '/local-model/v1/chat/completions' : '/api/generate-icon', {
          method: 'POST',
          signal: controller.signal,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(useLocalModel ? {
            model: 'gemma-3-4b-it',
            messages: [{ role: 'user', content: localContent }],
            temperature: 0.1,
            max_tokens: 4096,
            stream: false
          } : {
            concept: concept || null,
            prompt,
            image: referenceImageBase64 && referenceImageMimeType
              ? { mimeType: referenceImageMimeType, data: referenceImageBase64 }
              : null
          })
        });
        if (!response.ok) {
          if (useLocalModel && response.status >= 500) throw new Error('本地模型尚未启动或仍在加载');
          const errorPayload = await response.json().catch(() => null);
          const referenceHint = errorPayload?.reference?.provider === 'Iconfont'
            && typeof errorPayload.reference.id === 'number'
            && typeof errorPayload.reference.name === 'string'
            ? `Iconfont 已命中「${errorPayload.reference.name}」#${errorPayload.reference.id}，但模型生成失败；`
            : '';
          const rawError = String(errorPayload?.detail || errorPayload?.error || `生成接口错误 ${response.status}`);
          const readableError = rawError.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
          throw new Error(`${referenceHint}${readableError}`);
        }
        const payload = await response.json();
        generatedText = useLocalModel
          ? payload?.choices?.[0]?.message?.content
          : payload.text;
        if (typeof generatedText !== 'string') throw new Error('生成接口没有返回 SVG');
        if (
          payload?.reference?.provider === 'Iconfont'
          && typeof payload.reference.id === 'number'
          && typeof payload.reference.name === 'string'
        ) {
          externalReferenceLabel = payload.reference.match === 'exact-name'
            ? `Iconfont 同名收藏优先「${payload.reference.name}」#${payload.reference.id}`
            : `Iconfont 模糊收藏优先「${payload.reference.name}」#${payload.reference.id}`;
        }
        sourceModel = useLocalModel
          ? generationContext.family
            ? `本地 Gemma 3 4B · ${generationContext.family.label}`
            : '本地 Gemma 3 4B'
          : typeof payload.model === 'string'
            ? generationContext.family
              ? `${payload.model} · ${generationContext.family.label}`
              : payload.model
            : undefined;
        if (sourceModel && externalReferenceLabel) {
          sourceModel = `${sourceModel} · ${externalReferenceLabel}`;
        }
      }

      setGenerationPhase('正在校验图形…');
      let validation = validateTDesignGeneratedIcon(generatedText, generationContext);
      if (!validation.ok && !generationContext.family?.presetSvg) {
        setGenerationPhase('正在修正图形…');
        const spacingCorrection = validation.reason.startsWith('stroke1 与 stroke2')
          ? 'If the reference parts are intentionally attached, put the connected paths together in stroke1. Otherwise preserve the outer silhouette and uniformly shrink or reposition only the separate inner detail until there is enough visible space. Keep its direction and recognizable shape.'
          : '';
        const correctionPrompt = `${prompt}\n\nPREVIOUS SVG (revise its geometry, do not return it unchanged):\n${generatedText}\n\nVALIDATION FAILURE: ${validation.reason}. Fix this specific measurement by moving or uniformly scaling the relevant geometry within the 32×32 artboard. ${spacingCorrection} Do not fix a spacing error by deleting a stroke or changing an opening. ${referenceImageBase64 ? 'Recheck the attached icon stroke by stroke: preserve every visible endpoint, disconnected segment, junction, gap, direction, and internal mark. Ignore any caption outside the icon.' : 'Keep the chosen semantic metaphor recognizable.'} Straighten only rounded corners of actual adjustable rectangular edges. Preserve structural diagonals such as a sloped lid, roof, or perspective face. The page applies the requested corner radius later.`;
        const retryResponse = await fetch(useLocalModel ? '/local-model/v1/chat/completions' : '/api/generate-icon', {
          method: 'POST',
          signal: controller.signal,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(useLocalModel ? {
            model: 'gemma-3-4b-it',
            messages: [{ role: 'user', content: [
              { type: 'text', text: correctionPrompt },
              ...(referenceImageBase64 && referenceImageMimeType
                ? [{ type: 'image_url', image_url: { url: `data:${referenceImageMimeType};base64,${referenceImageBase64}` } }]
                : [])
            ] }],
            temperature: 0.1,
            max_tokens: 4096,
            stream: false
          } : {
            concept: concept || null,
            prompt: correctionPrompt,
            image: referenceImageBase64 && referenceImageMimeType
              ? { mimeType: referenceImageMimeType, data: referenceImageBase64 }
              : null
          })
        });
        if (retryResponse.ok) {
          const retryPayload = await retryResponse.json();
          const retryText = useLocalModel ? retryPayload?.choices?.[0]?.message?.content : retryPayload?.text;
          if (typeof retryText === 'string') validation = validateTDesignGeneratedIcon(retryText, generationContext);
        }
      }
      if (!validation.ok) {
        console.warn('Icon generation validation failed after correction:', validation.reason);
        throw new Error('图标暂未生成成功，系统已尝试自动修正。请再试一次。');
      }

      const label = concept || '参考图图标';
      const newIcon: GeneratedTDesignIcon = {
        name: `generated-${Date.now()}`,
        label,
        keywords: [label, 'AI生成', '自定义'],
        viewBox: '0 0 32 32',
        body: validation.body,
        normalizedSizeVersion: 1,
        standardVersion: TDESIGN_GENERATION_STANDARD_VERSION,
        ...(sourceModel ? { sourceModel } : {})
      };
      setGeneratedIcons((current) => [newIcon, ...current]);
      setActiveCategory(generatedCategory);
      setSearch('');
      setGenerationConcept('');
      clearReferenceImage();
      setIsGeneratorOpen(false);
      setToast(externalReferenceLabel
        ? `已生成“${label}” · 参考 ${externalReferenceLabel}`
        : `已生成“${label}”`);
    } catch (error) {
      setGeneratorError(error instanceof Error && error.name === 'AbortError'
        ? generationTimedOutRef.current ? '生成超过 70 秒，已自动停止。请重试。' : '已取消生成'
        : error instanceof Error ? error.message.slice(0, 150) : '图标生成失败，请稍后重试');
    } finally {
      window.clearTimeout(timeout);
      generationControllerRef.current = null;
      setGenerationPhase('');
      setIsGenerating(false);
    }
  };

  const copyIcon = async (icon: TDesignIcon) => {
    const activeSecondaryColor = colorType === 'double' ? secondaryColor : primaryColor;
    const svg = serializeConfiguredIcon(icon, iconSize, strokeWidth, cornerRadius, primaryColor, activeSecondaryColor);
    await writeClipboard(svg);
    setToast(`已复制“${icon.label}”SVG`);
  };

  const exportIcon = async (icon: TDesignIcon) => {
    try {
      const activeSecondaryColor = colorType === 'double' ? secondaryColor : primaryColor;
      const configuredSvg = serializeConfiguredIcon(
        icon,
        iconSize,
        strokeWidth,
        cornerRadius,
        primaryColor,
        activeSecondaryColor
      );
      const svgDocument = new DOMParser().parseFromString(configuredSvg, 'image/svg+xml');
      if (svgDocument.querySelector('parsererror')) throw new Error('SVG 结构无法解析');
      const svgElement = svgDocument.documentElement as unknown as SVGSVGElement;
      const iconfontSvg = await serializeIconfontSvg(svgElement, iconSize);
      const exportDocument = new DOMParser().parseFromString(iconfontSvg, 'image/svg+xml');
      const exportPath = exportDocument.querySelector('path');
      if (
        exportDocument.querySelector('parsererror')
        || !exportPath
        || exportPath.getAttribute('fill-rule') !== 'nonzero'
        || exportDocument.querySelector('[stroke]')
      ) {
        throw new Error('导出结果未通过 Iconfont 非零填充校验');
      }
      const safeName = icon.name.replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-+|-+$/g, '') || 'icon';
      saveIconfontSvg(iconfontSvg, `${safeName}-iconfont.svg`);
      setToast(`已导出“${icon.label}”Iconfont SVG`);
    } catch (error) {
      setToast(error instanceof Error ? error.message : 'SVG 导出失败');
    }
  };

  const resetControls = () => {
    setIconSize(32);
    setStrokeWidth(1.5);
    setCornerRadius(0);
    setColorType('single');
    setPrimaryColor('currentColor');
    setSecondaryColor('#0262f8');
  };

  const activeSecondaryColor = colorType === 'double' ? secondaryColor : primaryColor;
  const iconStyle = {
    '--td-smart-primary-color': primaryColor,
    '--td-smart-secondary-color': activeSecondaryColor
  } as React.CSSProperties;

  return (
    <div className="td-smart-app">
      <section className="td-smart-resource-header" aria-label="图标资源页标题">
        <div className="td-smart-container td-smart-resource-header-inner">
          <div className="td-smart-title-group">
            <h1>图标资源</h1>
            <span>{totalIconCount} 图标</span>
          </div>
          <div className="td-smart-header-actions">
            <label className="td-smart-search">
              <Search size={16} aria-hidden="true" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="输入图标名称或关键词"
                aria-label="搜索图标"
              />
            </label>
            <button
              ref={generatorTriggerRef}
              type="button"
              className="td-smart-generate-trigger"
              aria-expanded={isGeneratorOpen}
              aria-haspopup="dialog"
              aria-controls="td-smart-generator-dialog"
              onClick={() => {
                setGeneratorError('');
                setIsGeneratorOpen(true);
              }}
            >
              <Sparkles size={16} aria-hidden="true" />
              生成图标
            </button>
          </div>
        </div>
      </section>

      {isGeneratorOpen && (
        <div
          className="td-smart-generator-backdrop"
          onMouseDown={() => {
            if (!isGenerating) setIsGeneratorOpen(false);
          }}
        >
          <section
            ref={generatorDialogRef}
            id="td-smart-generator-dialog"
            className="td-smart-generator"
            role="dialog"
            aria-modal="true"
            aria-labelledby="td-smart-generator-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header className="td-smart-generator-header">
              <div className="td-smart-generator-title">
                <Sparkles size={18} aria-hidden="true" />
                <div>
                  <h2 id="td-smart-generator-title">生成图标</h2>
                  <p>输入图标语义，也可以添加一张参考图。</p>
                </div>
              </div>
              <button
                type="button"
                className="td-smart-generator-dismiss"
                aria-label="关闭生成图标弹窗"
                onClick={() => setIsGeneratorOpen(false)}
                disabled={isGenerating}
              >
                <X size={18} aria-hidden="true" />
              </button>
            </header>

            <div className="td-smart-generator-body">
              <label className="td-smart-generator-prompt">
                <span>图标语义</span>
                <textarea
                  ref={generatorPromptRef}
                  value={generationConcept}
                  onChange={(event) => setGenerationConcept(event.target.value)}
                  placeholder="例如：数据同步、智能审核、文件加密"
                  maxLength={160}
                  disabled={isGenerating}
                />
                <small>{generationConcept.length}/160</small>
              </label>

              <div className="td-smart-generator-reference">
                <span>参考图片 <small>可选</small></span>
                <div
                  className={`td-smart-image-drop ${isDraggingImage ? 'is-dragging' : ''} ${referenceImage ? 'has-image' : ''}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => !isGenerating && generatorFileInputRef.current?.click()}
                  onKeyDown={(event) => {
                    if ((event.key === 'Enter' || event.key === ' ') && !isGenerating) {
                      event.preventDefault();
                      generatorFileInputRef.current?.click();
                    }
                  }}
                  onDragOver={(event) => {
                    event.preventDefault();
                    if (!isGenerating) setIsDraggingImage(true);
                  }}
                  onDragLeave={() => setIsDraggingImage(false)}
                  onDrop={(event) => {
                    event.preventDefault();
                    setIsDraggingImage(false);
                    const file = event.dataTransfer.files?.[0];
                    if (file && !isGenerating) processReferenceImage(file);
                  }}
                >
                  <input
                    ref={generatorFileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) processReferenceImage(file);
                    }}
                    disabled={isGenerating}
                  />
                  {referenceImage ? (
                    <>
                      <img src={referenceImage} alt="参考图预览" />
                      <div><strong>参考图已添加</strong><span>点击或拖入可更换</span></div>
                      <button
                        type="button"
                        aria-label="移除参考图"
                        onClick={(event) => {
                          event.stopPropagation();
                          clearReferenceImage();
                        }}
                        disabled={isGenerating}
                      ><X size={15} /></button>
                    </>
                  ) : (
                    <>
                      <UploadCloud size={24} aria-hidden="true" />
                      <div><strong>上传或拖入图片</strong><span>支持 PNG、JPG、WebP，也可以直接粘贴</span></div>
                    </>
                  )}
                </div>
              </div>
              {generatorError && (
                <p className="td-smart-generator-error" role="alert">{generatorError}</p>
              )}
            </div>

            <footer className="td-smart-generator-footer">
              <div className="td-smart-generator-actions">
                <button type="button" className="td-smart-generator-close" onClick={() => {
                  if (isGenerating) generationControllerRef.current?.abort();
                  else setIsGeneratorOpen(false);
                }}>
                  {isGenerating ? '停止生成' : '取消'}
                </button>
                <button
                  type="button"
                  className="td-smart-generate-submit"
                  onClick={() => void generateIcon()}
                  disabled={isGenerating || (!generationConcept.trim() && !referenceImageBase64)}
                >
                  {isGenerating ? generationPhase : '开始生成'}
                </button>
              </div>
            </footer>
          </section>
        </div>
      )}

      <div className="td-smart-container td-smart-workspace">
        <aside className="td-smart-sidebar" aria-label="图标类型和分类">
          <nav className="td-smart-categories" aria-label="图标分类">
            {visibleCategories.map((category) => (
              <button
                type="button"
                key={category}
                className={category === activeCategory ? 'is-active' : ''}
                aria-current={category === activeCategory ? 'page' : undefined}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </nav>
        </aside>

        <main className="td-smart-content" style={iconStyle}>
          <div className="td-smart-content-heading">
            <h2>{activeCategory} ({filteredIcons.length})</h2>
            {activeCategory === generatedCategory && generatedIcons.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setGeneratedIcons([]);
                  setActiveCategory('用户');
                  setToast('已清空生成记录');
                }}
              >清空生成记录</button>
            )}
          </div>
          {filteredIcons.length ? (
            <div className="td-smart-grid" aria-label={`${activeCategory}描边图标`}>
              {filteredIcons.map((icon) => (
                <article
                  className="td-smart-icon-card"
                  key={icon.name}
                >
                  <button
                    type="button"
                    className="td-smart-icon-preview"
                    onClick={() => void copyIcon(icon)}
                    aria-label={`复制“${icon.label}”SVG`}
                    title={activeCategory === generatedCategory && 'sourceModel' in icon && typeof icon.sourceModel === 'string'
                      ? `生成来源：${icon.sourceModel}`
                      : undefined}
                  >
                    <SmartIconGraphic
                      icon={icon}
                      size={iconSize}
                      strokeWidth={strokeWidth}
                      cornerRadius={cornerRadius}
                    />
                    <span>{icon.label}</span>
                  </button>
                  <div className="td-smart-icon-actions" role="group" aria-label={`${icon.label}操作`}>
                    <button
                      type="button"
                      title="复制 SVG"
                      aria-label={`复制“${icon.label}”SVG`}
                      onClick={() => void copyIcon(icon)}
                    >
                      <Copy size={13} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      title="导出 Iconfont SVG（非零填充）"
                      aria-label={`导出“${icon.label}”Iconfont SVG`}
                      onClick={() => void exportIcon(icon)}
                    >
                      <Download size={13} aria-hidden="true" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="td-smart-empty">没有找到匹配的图标</p>
          )}
        </main>

        <aside className="td-smart-operations" aria-label="图标设置">
          <section>
            <h2>图标大小</h2>
            <div className="td-smart-segmented td-smart-size-options">
              {iconSizes.map((size) => (
                <button
                  type="button"
                  key={size}
                  className={iconSize === size ? 'is-selected' : ''}
                  aria-pressed={iconSize === size}
                  onClick={() => setIconSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2>线条粗细</h2>
            <input
              type="range"
              min="0.5"
              max="2.5"
              step="0.5"
              value={strokeWidth}
              onChange={(event) => setStrokeWidth(Number(event.target.value))}
              aria-label="线条粗细"
            />
            <div className="td-smart-range-marks" aria-hidden="true">
              {[0.5, 1, 1.5, 2, 2.5].map((value) => <span key={value}>{value}</span>)}
            </div>
          </section>

          <section>
            <div className="td-smart-control-title">
              <h2>圆角大小</h2>
              <output>{cornerRadius}</output>
            </div>
            <input
              type="range"
              min="0"
              max="6"
              step="1"
              value={cornerRadius}
              onChange={(event) => setCornerRadius(Number(event.target.value))}
              aria-label="圆角大小"
            />
            <div className="td-smart-range-marks" aria-hidden="true">
              {[0, 1, 2, 3, 4, 5, 6].map((value) => <span key={value}>{value}</span>)}
            </div>
          </section>

          <section>
            <h2>图标颜色</h2>
            <div className="td-smart-segmented">
              <button type="button" className={colorType === 'single' ? 'is-selected' : ''} aria-pressed={colorType === 'single'} onClick={() => setColorType('single')}>单色</button>
              <button type="button" className={colorType === 'double' ? 'is-selected' : ''} aria-pressed={colorType === 'double'} onClick={() => setColorType('double')}>双色</button>
            </div>
          </section>

          <section className={`td-smart-color-grid ${colorType === 'double' ? 'is-double' : ''}`}>
            <label className="td-smart-color-section">
              <span className="td-smart-color-label">线条颜色1</span>
              <span className="td-smart-color-input">
                <input
                  type="color"
                  value={primaryColor === 'currentColor' ? '#2a2a2a' : primaryColor}
                  onChange={(event) => setPrimaryColor(event.target.value)}
                  aria-label="线条颜色1"
                />
                <output>{primaryColor === 'currentColor' ? '当前颜色' : primaryColor}</output>
              </span>
            </label>

            {colorType === 'double' && (
              <label className="td-smart-color-section">
                <span className="td-smart-color-label">线条颜色2</span>
                <span className="td-smart-color-input">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(event) => setSecondaryColor(event.target.value)}
                    aria-label="线条颜色2"
                  />
                  <output>{secondaryColor}</output>
                </span>
              </label>
            )}
          </section>

          <button type="button" className="td-smart-reset" onClick={resetControls}>重置</button>
        </aside>
      </div>

      <div className={`td-smart-toast ${toast ? 'is-visible' : ''}`} role="status" aria-live="polite">{toast}</div>
    </div>
  );
}
