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
const generatedCategory = '我的生成' as const;
type ActiveCategory = ImportedCategory | typeof generatedCategory;

type GeneratedTDesignIcon = TDesignIcon & {
  sourceModel?: string;
  standardVersion: typeof TDESIGN_GENERATION_STANDARD_VERSION;
};

const generatedIconStorageKey = 'tdesign-v2-generated-icons';

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
<path d="M4 28H13M4 28V12L16 4L28 12V14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"/>
</g>
<g id="stroke2">
<path d="M17 22H29M24.5 17.5L29 22L24.5 26.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"/>
</g>`,
  sourceModel: '对话模拟',
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
<path d="M11 5H7L5 7V29H27V7L25 5H21" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"/>
<path data-corner-fixed="true" d="M11 5V3H21V5H11Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"/>
</g>
<g id="stroke2">
<path d="M11 12L21 22M21 12L11 22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"/>
</g>`,
  sourceModel: '参考重绘 · Tabler clipboard-x',
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
      return [{
        name: candidate.name,
        label: candidate.label,
        keywords: Array.isArray(candidate.keywords)
          ? candidate.keywords.filter((keyword): keyword is string => typeof keyword === 'string')
          : [candidate.label],
        viewBox: '0 0 32 32',
        body: validation.body,
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatorError, setGeneratorError] = useState('');
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const generatorTriggerRef = useRef<HTMLButtonElement>(null);
  const generatorPromptRef = useRef<HTMLTextAreaElement>(null);
  const generatorDialogRef = useRef<HTMLElement>(null);
  const isGeneratingRef = useRef(false);
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
    try {
      const prompt = buildTDesignGenerationPrompt({
        concept: concept || '参考图中的主体',
        hasReferenceImage: Boolean(referenceImageBase64)
      });
      const useLocalModel = import.meta.env.DEV;
      const localContent: Array<Record<string, unknown>> = [{ type: 'text', text: prompt }];
      if (referenceImageBase64 && referenceImageMimeType) {
        localContent.push({
          type: 'image_url',
          image_url: { url: `data:${referenceImageMimeType};base64,${referenceImageBase64}` }
        });
      }
      const response = await fetch(useLocalModel ? '/local-model/v1/chat/completions' : '/api/generate-icon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(useLocalModel ? {
          model: 'gemma-3-4b-it',
          messages: [{ role: 'user', content: localContent }],
          temperature: 0.1,
          max_tokens: 4096,
          stream: false
        } : {
          prompt,
          image: referenceImageBase64 && referenceImageMimeType
            ? { mimeType: referenceImageMimeType, data: referenceImageBase64 }
            : null
        })
      });
      if (!response.ok) {
        if (useLocalModel && response.status >= 500) throw new Error('本地模型尚未启动或仍在加载');
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.detail || payload?.error || `生成接口错误 ${response.status}`);
      }
      const payload = await response.json();
      const generatedText = useLocalModel
        ? payload?.choices?.[0]?.message?.content
        : payload.text;
      if (typeof generatedText !== 'string') throw new Error('生成接口没有返回 SVG');
      const validation = validateTDesignGeneratedIcon(generatedText);
      if (!validation.ok) throw new Error(`生成结果未通过规范校验：${validation.reason}`);

      const label = concept || '参考图图标';
      const newIcon: GeneratedTDesignIcon = {
        name: `generated-${Date.now()}`,
        label,
        keywords: [label, 'AI生成', '自定义'],
        viewBox: '0 0 32 32',
        body: validation.body,
        standardVersion: TDESIGN_GENERATION_STANDARD_VERSION,
        ...(useLocalModel
          ? { sourceModel: '本地 Gemma 3 4B' }
          : typeof payload.model === 'string' ? { sourceModel: payload.model } : {})
      };
      setGeneratedIcons((current) => [newIcon, ...current]);
      setActiveCategory(generatedCategory);
      setSearch('');
      setGenerationConcept('');
      clearReferenceImage();
      setIsGeneratorOpen(false);
      setToast(`已生成“${label}”`);
    } catch (error) {
      setGeneratorError(error instanceof Error ? error.message.slice(0, 150) : '图标生成失败，请稍后重试');
    } finally {
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
                <button type="button" className="td-smart-generator-close" onClick={() => setIsGeneratorOpen(false)} disabled={isGenerating}>
                  取消
                </button>
                <button
                  type="button"
                  className="td-smart-generate-submit"
                  onClick={() => void generateIcon()}
                  disabled={isGenerating || (!generationConcept.trim() && !referenceImageBase64)}
                >
                  {isGenerating ? '正在生成…' : '开始生成'}
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
