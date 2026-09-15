import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpen,
  Box,
  Check as CheckIcon,
  ChevronDown,
  ChevronUp,
  Copy,
  Cpu,
  Download,
  Edit,
  FilePlus2,
  Home,
  LayoutGrid,
  Loader2,
  Moon,
  Plus,
  RotateCcw,
  Search,
  Sun,
  Trash,
  UploadCloud,
  Wand2,
  X as XIcon
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { doc, getFirestore, onSnapshot, setDoc } from 'firebase/firestore';
import { fsBaseIcons } from './fs-base-icons';
import { saveIconfontSvg, serializeIconfontSvg } from './iconfont-export';
import { toMasterGoEditablePath, transformMasterGoPath } from './fs-node-icon';
import { OpticalGridGroup } from './icon-grid';
import {
  buildIconGenerationPrompt,
  GENERATED_ICON_GRID,
  ICON_GENERATION_STANDARD_VERSION
} from './icon-generation-standard';
type Category = 'UI & Nav' | 'Communication' | 'Media' | 'Commerce' | 'Social' | 'Weather' | 'Dev' | 'Misc';
type StrokeJoin = 'round' | 'miter' | 'bevel';
type SemanticCategory = 'all' | 'interface' | 'editing' | 'people' | 'finance-data';

const semanticCategories: ReadonlyArray<{ id: SemanticCategory; label: string }> = [
  { id: 'all', label: '全部' },
  { id: 'interface', label: '基础功能' },
  { id: 'editing', label: '业务类' },
  { id: 'people', label: '生活服务' },
  { id: 'finance-data', label: '金融数据类' }
];

const resolveSemanticCategory = (category: Category): Exclude<SemanticCategory, 'all'> => {
  if (category === 'UI & Nav') return 'interface';
  if (category === 'Misc') return 'editing';
  if (category === 'Social' || category === 'Communication') return 'people';
  return 'finance-data';
};

type IconSvgProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
  strokeWidth?: number | string;
  cornerRadius?: number;
};

interface IconData {
  id: string;
  name: string;
  category: Category;
  tags: string[];
  component: React.ElementType<IconSvgProps>;
  sourceModel?: string;
  styleProfile?: IconStyleProfile;
}

interface IconStyleProfile {
  iconSize: number;
  strokeWidth: number;
  cornerRadius: number;
  referenceLibrary: string;
  standardVersion?: string;
}

interface CustomIconDef {
  id: string;
  name: string;
  svgPaths: string;
  sourceModel?: string;
  styleProfile?: IconStyleProfile;
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const hasFirebaseConfig = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId);
const firebaseApp = hasFirebaseConfig ? initializeApp(firebaseConfig) : null;
const auth = firebaseApp ? getAuth(firebaseApp) : null;
const db = firebaseApp ? getFirestore(firebaseApp) : null;
const appId = import.meta.env.VITE_APP_ID || 'icon-tool-prod';
const DELETED_ICON_STORAGE_KEY = `${appId}:deleted-icon-ids:v1`;
const CATEGORY_OVERRIDE_STORAGE_KEY = `${appId}:category-overrides:v1`;
const ICON_NAME_OVERRIDE_STORAGE_KEY = `${appId}:icon-name-overrides:v1`;
const isLocalCategoryEditor = ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);

const isPersistedSemanticCategory = (value: unknown): value is Exclude<SemanticCategory, 'all'> =>
  value === 'interface' || value === 'editing' || value === 'people' || value === 'finance-data';

const normalizeCategoryOverrides = (value: unknown) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {} as Record<string, Exclude<SemanticCategory, 'all'>>;
  }

  return Object.fromEntries(
    Object.entries(value).flatMap(([iconId, category]) => {
      if (!iconId) return [];
      const migratedCategory = category === 'commerce' || category === 'data' ? 'finance-data' : category;
      return isPersistedSemanticCategory(migratedCategory) ? [[iconId, migratedCategory]] : [];
    })
  ) as Record<string, Exclude<SemanticCategory, 'all'>>;
};

const normalizeIconNameOverrides = (value: unknown) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {} as Record<string, string>;

  return Object.fromEntries(
    Object.entries(value).flatMap(([iconId, name]) => {
      if (!iconId || typeof name !== 'string') return [];
      const normalizedName = name.trim().slice(0, 80);
      return normalizedName ? [[iconId, normalizedName]] : [];
    })
  ) as Record<string, string>;
};

const readLocallyDeletedIconIds = () => {
  try {
    const stored = window.localStorage.getItem(DELETED_ICON_STORAGE_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) ? [...new Set(parsed.filter((id): id is string => typeof id === 'string'))] : [];
  } catch {
    return [];
  }
};

const readLocallyPersistedCategoryOverrides = () => {
  try {
    const stored = window.localStorage.getItem(CATEGORY_OVERRIDE_STORAGE_KEY);
    return stored ? normalizeCategoryOverrides(JSON.parse(stored)) : {};
  } catch {
    return {};
  }
};

const readLocallyPersistedIconNameOverrides = () => {
  try {
    const stored = window.localStorage.getItem(ICON_NAME_OVERRIDE_STORAGE_KEY);
    return stored ? normalizeIconNameOverrides(JSON.parse(stored)) : {};
  } catch {
    return {};
  }
};

const normalizeCornerRadius = (value: number) => {
  if (value === 1.5) return 1;
  return Math.min(6, Math.max(0, Math.round(value)));
};

const SVG_ALLOWED_ELEMENTS = new Set(['path', 'circle', 'ellipse', 'rect', 'line', 'polyline', 'polygon', 'g']);
const SVG_DRAWING_ELEMENTS = new Set(['path', 'circle', 'ellipse', 'rect', 'line', 'polyline', 'polygon']);
const SVG_ALLOWED_ATTRIBUTES = new Set([
  'd',
  'cx',
  'cy',
  'r',
  'rx',
  'ry',
  'x',
  'y',
  'x1',
  'y1',
  'x2',
  'y2',
  'width',
  'height',
  'points',
  'fill',
  'fill-rule',
  'clip-rule',
  'transform',
  'opacity'
]);

type SvgValidationResult = { ok: true; fragment: string } | { ok: false; reason: string };

const validateSvgFragment = (fragment: string): SvgValidationResult => {
  const candidate = fragment
    .replace(/```[a-zA-Z]*\n?/g, '')
    .replace(/```/g, '')
    .replace(/^\s*<svg\b[^>]*>/i, '')
    .replace(/<\/svg>\s*$/i, '')
    .trim();

  if (!candidate) return { ok: false, reason: '返回内容为空' };
  if (candidate.length > 24_000) return { ok: false, reason: 'SVG 内容过长' };

  const parsed = new DOMParser().parseFromString(
    `<svg xmlns="http://www.w3.org/2000/svg">${candidate}</svg>`,
    'image/svg+xml'
  );

  if (parsed.querySelector('parsererror')) return { ok: false, reason: 'SVG 语法不完整' };

  const root = parsed.documentElement;
  const elements = Array.from(root.querySelectorAll('*'));
  if (elements.length === 0) return { ok: false, reason: '没有可绘制的 SVG 元素' };
  if (elements.length > 64) return { ok: false, reason: 'SVG 元素数量过多' };

  let drawingElementCount = 0;

  for (const element of elements) {
    const tagName = element.tagName.toLowerCase();
    if (!SVG_ALLOWED_ELEMENTS.has(tagName)) {
      return { ok: false, reason: `包含不支持的 <${tagName}> 元素` };
    }

    if (SVG_DRAWING_ELEMENTS.has(tagName)) drawingElementCount += 1;

    for (const attribute of Array.from(element.attributes)) {
      const attributeName = attribute.name.toLowerCase();
      const value = attribute.value.trim();

      if (!SVG_ALLOWED_ATTRIBUTES.has(attributeName)) {
        return { ok: false, reason: `包含不支持的 ${attributeName} 属性` };
      }
      if (/url\s*\(|javascript:|data:/i.test(value)) {
        return { ok: false, reason: `${attributeName} 属性包含不安全内容` };
      }
      if (attributeName === 'fill' && !/^(none|currentColor)$/i.test(value)) {
        return { ok: false, reason: 'fill 仅允许 none 或 currentColor' };
      }
      if (attributeName === 'opacity') {
        const opacity = Number(value);
        if (!Number.isFinite(opacity) || opacity < 0 || opacity > 1) {
          return { ok: false, reason: 'opacity 必须在 0 到 1 之间' };
        }
      }
    }

    for (const child of Array.from(element.childNodes)) {
      if (child.nodeType === Node.TEXT_NODE && child.textContent?.trim()) {
        return { ok: false, reason: 'SVG 元素内不能包含文本' };
      }
    }
  }

  for (const child of Array.from(root.childNodes)) {
    if (child.nodeType === Node.TEXT_NODE && child.textContent?.trim()) {
      return { ok: false, reason: 'SVG 外层包含多余文本' };
    }
  }

  if (drawingElementCount === 0) return { ok: false, reason: '没有可绘制的 SVG 图形' };

  return { ok: true, fragment: root.innerHTML.trim() };
};

/** Strict contract for newly generated icons. Legacy stored icons keep the broader safe parser above. */
const validateGeneratedIconStandard = (fragment: string): SvgValidationResult => {
  const safe = validateSvgFragment(fragment);
  if (!safe.ok) return safe;

  const parsed = new DOMParser().parseFromString(
    `<svg xmlns="http://www.w3.org/2000/svg">${safe.fragment}</svg>`,
    'image/svg+xml'
  );
  const root = parsed.documentElement;
  const rootElements = Array.from(root.children);
  if (rootElements.length !== 1 || rootElements[0].tagName.toLowerCase() !== 'path') {
    return { ok: false, reason: '新生成图标必须且只能包含一个 <path> 元素' };
  }

  const path = rootElements[0];
  const d = path.getAttribute('d')?.trim() || '';
  if (!d) return { ok: false, reason: 'path 缺少有效的 d 数据' };
  if (path.getAttribute('fill')?.toLowerCase() !== 'none') {
    return { ok: false, reason: '新生成图标必须明确使用 fill="none"' };
  }

  for (const attribute of Array.from(path.attributes)) {
    if (attribute.name !== 'd' && attribute.name !== 'fill') {
      return { ok: false, reason: `新生成 path 不允许 ${attribute.name} 属性` };
    }
  }

  if (/[a-z]/.test(d)) return { ok: false, reason: '路径只能使用绝对坐标命令' };
  const commands = d.match(/[A-Z]/g) || [];
  if (commands.length === 0 || commands.some((command) => !'MLHVCSQTAZ'.includes(command))) {
    return { ok: false, reason: '路径包含不支持的 SVG 命令' };
  }

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const geometry = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  svg.setAttribute('viewBox', `0 0 ${GENERATED_ICON_GRID.canvas} ${GENERATED_ICON_GRID.canvas}`);
  svg.style.cssText = 'position:fixed;left:-10000px;top:-10000px;width:24px;height:24px;visibility:hidden';
  geometry.setAttribute('d', d);
  svg.appendChild(geometry);
  document.body.appendChild(svg);

  try {
    const box = geometry.getBBox();
    const values = [box.x, box.y, box.width, box.height];
    if (values.some((value) => !Number.isFinite(value)) || (box.width <= 0 && box.height <= 0)) {
      return { ok: false, reason: '路径为空或无法计算边界' };
    }
    const tolerance = 0.01;
    if (
      box.x < -tolerance ||
      box.y < -tolerance ||
      box.x + box.width > GENERATED_ICON_GRID.canvas + tolerance ||
      box.y + box.height > GENERATED_ICON_GRID.canvas + tolerance
    ) {
      return { ok: false, reason: '路径超出 24×24 画板' };
    }
  } catch {
    return { ok: false, reason: 'path 的 d 数据无法解析' };
  } finally {
    svg.remove();
  }

  return { ok: true, fragment: `<path d="${d.replace(/&/g, '&amp;').replace(/"/g, '&quot;')}" fill="none"></path>` };
};

const formatModelName = (model: string) =>
  model
    .replace(/^gemini-/, 'Gemini ')
    .replace(/-preview$/, ' Preview')
    .replace(/-/g, ' ')
    .replace(/\bflash\b/i, 'Flash')
    .replace(/\blite\b/i, 'Lite');

const formatSvgNumber = (value: number) => String(Number(value.toFixed(4)));

const downloadSVG = (iconId: string, iconName: string) => {
  const svgElement = document.getElementById(`icon-svg-${iconId}`);
  if (!(svgElement instanceof SVGSVGElement)) return;

  const svgData = serializeMasterGoEditableSvg(svgElement);
  const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${iconName.toLowerCase()}.svg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const downloadPNG = (iconId: string, iconName: string, size: number) => {
  const svgElement = document.getElementById(`icon-svg-${iconId}`);
  if (!svgElement) return;

  const svgData = new XMLSerializer().serializeToString(svgElement);
  const canvas = document.createElement('canvas');
  const scale = 4;
  canvas.width = size * scale;
  canvas.height = size * scale;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const img = new Image();
  const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  img.onload = () => {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const pngUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = pngUrl;
    link.download = `${iconName.toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  img.src = url;
};

const Toast = ({ message, visible }: { message: string; visible: boolean }) => (
  <div
    className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
      visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
    }`}
  >
    <div className="flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-3 text-sm font-medium text-zinc-50 shadow-lg dark:bg-zinc-100 dark:text-zinc-900">
      <CheckIcon size={16} />
      {message}
    </div>
  </div>
);

const IconPreview = ({
  icon,
  id,
  size,
  strokeWidth,
  cornerRadius,
  strokeLinecap,
  strokeLinejoin
}: {
  icon: IconData;
  id?: string;
  size: number;
  strokeWidth: number;
  cornerRadius: number;
  strokeLinecap: 'round' | 'butt';
  strokeLinejoin: StrokeJoin;
}) => {
  const IconComponent = icon.component;
  return (
    <IconComponent
      id={id}
      size={size}
      strokeWidth={strokeWidth}
      cornerRadius={cornerRadius}
      strokeLinecap={strokeLinecap}
      strokeLinejoin={strokeLinejoin}
    />
  );
};

const serializeSvgAsJsx = (svgElement: SVGSVGElement) =>
  new XMLSerializer()
    .serializeToString(svgElement)
    .replace(/\s+id="[^"]*"/, '')
    .replace(/\s+data-icon-grid="[^"]*"/g, '')
    .replace(/\s+data-optical-scale="[^"]*"/g, '')
    .replace(/\s+data-mastergo-editable-d="[^"]*"/g, '')
    .replace(/\s+data-mastergo-inside-stroke="[^"]*"/g, '')
    .replace(/\s+data-mastergo-stroke-width="[^"]*"/g, '')
    .replace(/\s+data-iconfont-outline-d="[^"]*"/g, '')
    .replace(/\bclass=/g, 'className=')
    .replace(/stroke-width/g, 'strokeWidth')
    .replace(/stroke-linecap/g, 'strokeLinecap')
    .replace(/stroke-linejoin/g, 'strokeLinejoin')
    .replace(/fill-rule/g, 'fillRule')
    .replace(/clip-rule/g, 'clipRule');

function serializeMasterGoEditableSvg(svgElement: SVGSVGElement) {
  const sourcePaths = Array.from(svgElement.querySelectorAll<SVGPathElement>('path[d]'));
  const editableSvg = svgElement.cloneNode(true) as SVGSVGElement;
  const editablePaths = Array.from(editableSvg.querySelectorAll<SVGPathElement>('path[d]'));
  const drawingElements = svgElement.querySelectorAll('path,rect,circle,line,polyline,polygon,ellipse');
  const canFlattenToPaths = sourcePaths.length > 0 && sourcePaths.length === editablePaths.length && drawingElements.length === sourcePaths.length;
  const displayWidth = svgElement.width.baseVal.value || Number(svgElement.getAttribute('width')) || 24;
  const displayHeight = svgElement.height.baseVal.value || Number(svgElement.getAttribute('height')) || displayWidth;

  editableSvg.removeAttribute('id');
  editableSvg.setAttribute('stroke-linecap', 'butt');
  editableSvg.setAttribute('stroke-linejoin', 'miter');
  editableSvg.setAttribute('stroke-miterlimit', '4');

  if (canFlattenToPaths) {
    editableSvg.setAttribute('width', formatSvgNumber(displayWidth));
    editableSvg.setAttribute('height', formatSvgNumber(displayHeight));
    editableSvg.setAttribute('viewBox', `0 0 ${formatSvgNumber(displayWidth)} ${formatSvgNumber(displayHeight)}`);
    editableSvg.querySelectorAll('[transform]').forEach((element) => element.removeAttribute('transform'));
    editableSvg.querySelectorAll('g').forEach((group) => group.removeAttribute('stroke-width'));
  }

  editableSvg.querySelectorAll('[data-icon-grid]').forEach((group) => {
    group.removeAttribute('data-icon-grid');
    group.removeAttribute('data-optical-scale');
  });

  editablePaths.forEach((path, index) => {
    const sourcePath = sourcePaths[index];
    const pathData = path.getAttribute('d');
    const editablePathData = path.getAttribute('data-mastergo-editable-d');
    const usesInsideStroke = path.getAttribute('data-mastergo-inside-stroke') === 'true';
    const masterGoStrokeWidth = path.getAttribute('data-mastergo-stroke-width');
    const masterGoPath = editablePathData || toMasterGoEditablePath(pathData || '');
    const matrix = canFlattenToPaths ? sourcePath?.getCTM() : null;
    if (masterGoPath) path.setAttribute('d', matrix ? transformMasterGoPath(masterGoPath, matrix) : masterGoPath);

    if (canFlattenToPaths && sourcePath && matrix) {
      const localStrokeWidth = usesInsideStroke && masterGoStrokeWidth
        ? Number(masterGoStrokeWidth)
        : Number.parseFloat(getComputedStyle(sourcePath).strokeWidth);
      const renderedStrokeWidth = localStrokeWidth * Math.hypot(matrix.a, matrix.b);
      if (Number.isFinite(renderedStrokeWidth) && renderedStrokeWidth > 0) {
        path.setAttribute('stroke-width', formatSvgNumber(renderedStrokeWidth));
        editableSvg.setAttribute('stroke-width', formatSvgNumber(renderedStrokeWidth));
      }
    }
    if (usesInsideStroke) {
      editableSvg.setAttribute('fill', 'none');
      editableSvg.setAttribute('stroke', 'currentColor');
      if (!canFlattenToPaths && masterGoStrokeWidth) editableSvg.setAttribute('stroke-width', masterGoStrokeWidth);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', 'currentColor');
      path.setAttribute('stroke-alignment', 'inner');
      path.setAttribute('style', 'stroke-alignment: inner');
    }
    path.removeAttribute('data-mastergo-editable-d');
    path.removeAttribute('data-mastergo-inside-stroke');
    path.removeAttribute('data-mastergo-stroke-width');
    path.removeAttribute('data-iconfont-outline-d');
  });

  editableSvg.removeAttribute('data-iconfont-collection');
  editableSvg.removeAttribute('data-iconfont-source-id');

  editableSvg.querySelectorAll('rect').forEach((rect) => {
    rect.setAttribute('rx', '0');
    rect.setAttribute('ry', '0');
  });

  return new XMLSerializer().serializeToString(editableSvg);
}

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const isFirstLoad = useRef(true);

  const [iconSize, setIconSize] = useState(32);
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [cornerRadius, setCornerRadius] = useState(1);
  const [isGlobalSpecCollapsed, setIsGlobalSpecCollapsed] = useState(false);
  const strokeLinejoin: StrokeJoin = 'miter';
  const strokeLinecap: 'round' | 'butt' = 'butt';
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [customIcons, setCustomIcons] = useState<CustomIconDef[]>([]);
  const [iconNameOverrides, setIconNameOverrides] = useState<Record<string, string>>(
    readLocallyPersistedIconNameOverrides
  );
  const [deletedIconIds, setDeletedIconIds] = useState<string[]>(readLocallyDeletedIconIds);
  const [uploadedImageBase64, setUploadedImageBase64] = useState<string | null>(null);
  const [uploadedImageMimeType, setUploadedImageMimeType] = useState<string | null>(null);
  const [newIconName, setNewIconName] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const [view, setView] = useState<'icons' | 'guidelines'>('icons');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<SemanticCategory>('all');
  const [categoryOverrides, setCategoryOverrides] = useState<Record<string, Exclude<SemanticCategory, 'all'>>>(
    readLocallyPersistedCategoryOverrides
  );
  const [draggedIconId, setDraggedIconId] = useState<string | null>(null);
  const [dragOverCategory, setDragOverCategory] = useState<Exclude<SemanticCategory, 'all'> | null>(null);
  const [selectedIcon, setSelectedIcon] = useState<IconData | null>(null);
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('正在生成...');
  const [lastGeneratedModel, setLastGeneratedModel] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!auth) {
      setDataLoaded(true);
      return;
    }

    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (error) {
        console.error('Auth error:', error);
        setDataLoaded(true);
      }
    };

    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || !db) return;

    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    const docRef = doc(db, 'artifacts', appId, 'users', user.uid, 'icon_app_state', 'main');

    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists() && isFirstLoad.current) {
          const data = docSnap.data();
          if (typeof data.iconSize === 'number') setIconSize(data.iconSize);
          if (typeof data.strokeWidth === 'number') setStrokeWidth(data.strokeWidth);
          if (typeof data.cornerRadius === 'number') {
            setCornerRadius(normalizeCornerRadius(data.cornerRadius));
          } else if (data.strokeLinejoin === 'miter' || data.strokeLinejoin === 'bevel') {
            setCornerRadius(0);
          }
          setTheme(data.theme === 'dark' || data.theme === 'light' ? data.theme : prefersDark ? 'dark' : 'light');
          if (Array.isArray(data.customIcons)) setCustomIcons(data.customIcons);
          if (data.iconNameOverrides) {
            const cloudIconNameOverrides = normalizeIconNameOverrides(data.iconNameOverrides);
            setIconNameOverrides((localIconNameOverrides) => ({
              ...cloudIconNameOverrides,
              ...localIconNameOverrides
            }));
          }
          if (Array.isArray(data.deletedIconIds)) {
            const cloudDeletedIconIds = data.deletedIconIds.filter((id): id is string => typeof id === 'string');
            setDeletedIconIds((localDeletedIconIds) => [
              ...new Set([...localDeletedIconIds, ...cloudDeletedIconIds])
            ]);
          }
          if (typeof data.uploadedImageBase64 === 'string') setUploadedImageBase64(data.uploadedImageBase64);
          if (typeof data.uploadedImageMimeType === 'string') setUploadedImageMimeType(data.uploadedImageMimeType);
          if (typeof data.newIconName === 'string') setNewIconName(data.newIconName);

          if (data.uploadedImageBase64 && data.uploadedImageMimeType) {
            setUploadedImage(`data:${data.uploadedImageMimeType};base64,${data.uploadedImageBase64}`);
          }
        } else if (!docSnap.exists() && isFirstLoad.current) {
          setTheme(prefersDark ? 'dark' : 'light');
        }

        isFirstLoad.current = false;
        setDataLoaded(true);
      },
      (error) => {
        console.error('Cloud fetch error:', error);
        isFirstLoad.current = false;
        setDataLoaded(true);
      }
    );

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    try {
      window.localStorage.setItem(DELETED_ICON_STORAGE_KEY, JSON.stringify(deletedIconIds));
    } catch (error) {
      console.error('Local deletion save error:', error);
    }
  }, [deletedIconIds]);

  useEffect(() => {
    try {
      window.localStorage.setItem(CATEGORY_OVERRIDE_STORAGE_KEY, JSON.stringify(categoryOverrides));
    } catch (error) {
      console.error('Local category save error:', error);
    }
  }, [categoryOverrides]);

  useEffect(() => {
    try {
      window.localStorage.setItem(ICON_NAME_OVERRIDE_STORAGE_KEY, JSON.stringify(iconNameOverrides));
    } catch (error) {
      console.error('Local icon name save error:', error);
    }
  }, [iconNameOverrides]);

  useEffect(() => {
    if (!user || !db || !dataLoaded) return;

    const timer = window.setTimeout(() => {
      const docRef = doc(db, 'artifacts', appId, 'users', user.uid, 'icon_app_state', 'main');
      setDoc(docRef, {
        iconSize,
        strokeWidth,
        cornerRadius,
        strokeLinejoin,
        theme,
        customIcons,
        iconNameOverrides,
        deletedIconIds,
        uploadedImageBase64,
        uploadedImageMimeType,
        newIconName
      }).catch((err) => console.error('Cloud save error:', err));
    }, 800);

    return () => window.clearTimeout(timer);
  }, [
    user,
    dataLoaded,
    iconSize,
    strokeWidth,
    cornerRadius,
    strokeLinejoin,
    theme,
    customIcons,
    iconNameOverrides,
    deletedIconIds,
    uploadedImageBase64,
    uploadedImageMimeType,
    newIconName
  ]);

  const icons = useMemo(() => {
    const base: IconData[] = fsBaseIcons.map((icon) => ({
      ...icon,
      name: iconNameOverrides[icon.id] || icon.name
    }));

    const generated: IconData[] = customIcons.flatMap((ci) => {
      const validation = validateSvgFragment(ci.svgPaths);
      if (!validation.ok) {
        console.warn(`Skipped invalid custom icon ${ci.id}: ${validation.reason}`);
        return [];
      }

      const safeSvgPaths = validation.fragment;
      return [
        {
          id: ci.id,
          name: iconNameOverrides[ci.id] || ci.name,
          category: 'Misc' as const,
          tags: ['custom', 'ai-generated'],
          sourceModel: ci.sourceModel,
          styleProfile: ci.styleProfile,
          component: (props: IconSvgProps) => (
            <svg
              id={props.id}
              width={props.size}
              height={props.size}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={props.strokeWidth}
              strokeLinecap={props.strokeLinecap || 'round'}
              strokeLinejoin={props.strokeLinejoin || 'round'}
              xmlns="http://www.w3.org/2000/svg"
              className={props.className}
            >
              <OpticalGridGroup
                strokeWidth={props.strokeWidth ?? 2}
                mode={ci.styleProfile?.standardVersion === ICON_GENERATION_STANDARD_VERSION ? 'source' : 'generated'}
              >
                <g dangerouslySetInnerHTML={{ __html: safeSvgPaths }} />
              </OpticalGridGroup>
            </svg>
          )
        }
      ];
    });

    return [...base, ...generated].filter((icon) => !deletedIconIds.includes(icon.id));
  }, [customIcons, iconNameOverrides, deletedIconIds]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    window.setTimeout(() => setToastVisible(false), 2000);
  };

  const copyToClipboard = async (text: string, msg: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(msg);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      showToast(msg);
    }
  };

  const handleDeleteIcon = (id: string) => {
    setDeletedIconIds((prev) => [...new Set([...prev, id])]);
    setCustomIcons((prev) => prev.filter((icon) => icon.id !== id));
    if (selectedIcon?.id === id) setSelectedIcon(null);
    showToast('图标已永久删除');
  };

  const processFile = (file: File | undefined) => {
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 512;
        let { width, height } = img;

        if (width > height && width > maxSize) {
          height *= maxSize / width;
          width = maxSize;
        } else if (height > maxSize) {
          width *= maxSize / height;
          height = maxSize;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0, width, height);
        const outMimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const compressedDataUrl = canvas.toDataURL(outMimeType, 0.8);

        setUploadedImage(compressedDataUrl);
        setUploadedImageBase64(compressedDataUrl.split(',')[1]);
        setUploadedImageMimeType(outMimeType);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const clearUploadedImage = () => {
    setUploadedImage(null);
    setUploadedImageBase64(null);
    setUploadedImageMimeType(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  useEffect(() => {
    if (!isAiModalOpen) return;

    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of Array.from(items)) {
        if (item.type.includes('image')) {
          const file = item.getAsFile();
          if (file) processFile(file);
          break;
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [isAiModalOpen]);

  const filteredIcons = useMemo(
    () =>
      icons.filter((icon) => {
        const normalizedSearch = search.toLowerCase();
        const matchesSearch = (
          !normalizedSearch ||
          icon.name.toLowerCase().includes(normalizedSearch) ||
          icon.tags.some((tag) => tag.toLowerCase().includes(normalizedSearch))
        );
        const iconCategory = categoryOverrides[icon.id] ?? resolveSemanticCategory(icon.category);
        const matchesCategory = activeCategory === 'all' || iconCategory === activeCategory;
        return matchesSearch && matchesCategory;
      }),
    [icons, search, activeCategory, categoryOverrides]
  );

  const moveIconToCategory = (iconId: string, category: Exclude<SemanticCategory, 'all'>) => {
    const icon = icons.find((item) => item.id === iconId);
    if (!icon) return;
    setCategoryOverrides((current) => ({ ...current, [iconId]: category }));
    setDragOverCategory(null);
    setDraggedIconId(null);
    const categoryLabel = semanticCategories.find((item) => item.id === category)?.label ?? '新分类';
    showToast(`${icon.name} 已移至“${categoryLabel}”`);
  };

  const safeIconSize = Math.max(iconSize || 24, 1);
  const scaleRatio = safeIconSize / 24;
  const actualStrokeWidth = Number((strokeWidth / scaleRatio).toFixed(3));
  const safeCornerRadius = normalizeCornerRadius(cornerRadius);
  const actualCornerRadius = Number((safeCornerRadius / scaleRatio).toFixed(3));
  const activeReferenceStyle = 'FS 后台统一描边风格（AntChain / SDICS 原库线性语言）';

  const handleCopyJSX = (icon: IconData) => {
    const svgElement = document.getElementById(`icon-svg-${icon.id}`);
    if (!(svgElement instanceof SVGSVGElement)) return;
    copyToClipboard(serializeSvgAsJsx(svgElement), '已复制 JSX 代码');
  };

  const handleCopySVG = (icon: IconData) => {
    const svgElement = document.getElementById(`icon-svg-${icon.id}`);
    if (!(svgElement instanceof SVGSVGElement)) return;
    copyToClipboard(serializeMasterGoEditableSvg(svgElement), '已复制 MasterGo 可编辑 SVG（折点圆角可调）');
  };

  const handleExportIconfontSVG = async (icon: IconData) => {
    const svgElement = document.getElementById(`icon-svg-${icon.id}`);
    if (!(svgElement instanceof SVGSVGElement)) {
      showToast('没有找到可导出的图标');
      return;
    }

    const safeName = icon.name.trim().replace(/[\\/:*?"<>|]/g, '-') || 'icon';
    const fileName = `${safeName}-iconfont.svg`;

    try {
      showToast('正在转换为 Iconfont 轮廓...');
      const iconfontSvg = await serializeIconfontSvg(svgElement, safeIconSize);
      saveIconfontSvg(iconfontSvg, fileName);
      showToast(`已导出 ${safeIconSize}×${safeIconSize} Iconfont SVG`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Iconfont SVG 导出失败');
    }
  };

  const handleGenerateStyle = async () => {
    const isTextOnly = !uploadedImageBase64;
    if (isTextOnly && !newIconName.trim()) {
      showToast('请上传参考图片或输入图标概念');
      return;
    }

    setIsGenerating(true);
    setLoadingMsg('正在连接 AI 视觉模型...');

    let msgTimer1: number | undefined;
    let msgTimer2: number | undefined;

    try {
      const iconConcept = newIconName.trim() || 'AI Generated Icon';
      const prompt = buildIconGenerationPrompt({
        concept: iconConcept,
        referenceLibrary: activeReferenceStyle,
        displaySize: safeIconSize,
        physicalStrokeWidth: strokeWidth,
        viewBoxStrokeWidth: actualStrokeWidth,
        displayCornerRadius: safeCornerRadius,
        viewBoxCornerRadius: actualCornerRadius,
        minimumGap: Math.max(actualStrokeWidth * 1.5, 1),
        hasReferenceImage: !isTextOnly
      });

      msgTimer1 = window.setTimeout(() => setLoadingMsg('AI 正在进行几何结构推演...'), 6000);
      msgTimer2 = window.setTimeout(() => setLoadingMsg('矢量代码生成中，可能还需要十几秒...'), 15000);

      let generatedSvgPaths: string | null = null;
      let generatedModel: string | null = null;

      try {
        const controller = new AbortController();
        const timeoutId = window.setTimeout(() => controller.abort(), 60000);

        const res = await fetch('/api/generate-icon', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt,
            image:
              uploadedImageBase64 && uploadedImageMimeType
                ? { mimeType: uploadedImageMimeType, data: uploadedImageBase64 }
                : null
          }),
          signal: controller.signal
        });

        window.clearTimeout(timeoutId);

        if (!res.ok) {
          const errorPayload = await res.json().catch(() => null);
          const detail = errorPayload?.detail || errorPayload?.error || `API Error ${res.status}`;
          throw new Error(detail);
        }
        const data = await res.json();
        if (typeof data.text === 'string') {
          const validation = validateGeneratedIconStandard(data.text);
          if (!validation.ok) {
            throw new Error(`生成结果未通过 SVG 校验：${validation.reason}`);
          }
          generatedSvgPaths = validation.fragment;
          if (typeof data.model === 'string') generatedModel = data.model;
        }
      } catch (error: any) {
        console.error('AI Generation failed', error);
        const message =
          error.name === 'AbortError'
            ? '请求超时，请稍后重试'
            : error.message
              ? `AI 失败：${String(error.message).slice(0, 140)}`
              : 'AI 节点拥挤或超时，请稍后重试';
        showToast(message);
        return;
      }

      if (!generatedSvgPaths) {
        showToast('未能生成有效代码，请重试');
        return;
      }

      const newId = `custom-${Date.now()}`;
      setCustomIcons((prev) => [
        {
          id: newId,
          name: newIconName.trim() || 'AI 生成图标',
          svgPaths: generatedSvgPaths,
          styleProfile: {
            iconSize: safeIconSize,
            strokeWidth,
            cornerRadius: safeCornerRadius,
            referenceLibrary: activeReferenceStyle,
            standardVersion: ICON_GENERATION_STANDARD_VERSION
          },
          ...(generatedModel ? { sourceModel: generatedModel } : {})
        },
        ...prev
      ]);

      setIsAiModalOpen(false);
      setNewIconName('');
      setLastGeneratedModel(generatedModel);
      showToast(
        `${isTextOnly ? '创意' : '风格'}解析完成${generatedModel ? ` · ${formatModelName(generatedModel)}` : ''}`
      );
    } catch (globalErr) {
      console.error('Unexpected error in handleGenerateStyle', globalErr);
      showToast('发生意外内部错误');
    } finally {
      setIsGenerating(false);
      if (msgTimer1) window.clearTimeout(msgTimer1);
      if (msgTimer2) window.clearTimeout(msgTimer2);
    }
  };

  const canGenerate = !isGenerating && Boolean(uploadedImageBase64 || newIconName.trim());
  const isLibraryEmpty = icons.length === 0;
  const showIconWorkbench = view === 'icons';

  const resetGlobalSpec = () => {
    setIconSize(32);
    setStrokeWidth(2);
    setCornerRadius(1);
  };

  if (!dataLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
        <div className="flex animate-pulse flex-col items-center gap-4">
          <Loader2 className="animate-spin text-indigo-600" size={36} />
          <p className="text-sm tracking-wider text-zinc-500">正在同步云端工作区...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-200 ${
        theme === 'dark'
          ? 'dark bg-zinc-950 text-zinc-50'
          : showIconWorkbench
            ? 'bg-[var(--color-hm-page)] text-[var(--color-hm-ink)]'
            : 'bg-white text-zinc-900'
      }`}
    >
      <header
        className={`sticky top-0 z-40 w-full flex-none border-b ${
          showIconWorkbench
            ? 'border-[var(--color-hm-border)] bg-[var(--color-hm-surface)] dark:border-zinc-800 dark:bg-zinc-950'
            : 'border-zinc-200 bg-white/75 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/75'
        }`}
      >
        <div className={showIconWorkbench ? 'px-4 sm:px-6 lg:px-8' : 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'}>
          <div className={`flex items-center justify-between ${showIconWorkbench ? 'min-h-[92px] py-4 sm:h-[92px] sm:py-0' : 'h-16'}`}>
            {showIconWorkbench ? (
              <div className="flex min-w-0 items-center gap-5">
                <div className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-[var(--color-hm-accent)] text-white shadow-lg shadow-indigo-500/20 sm:h-16 sm:w-16 sm:rounded-2xl">
                  <Box size={28} strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xl font-bold tracking-tight text-[var(--color-hm-ink)] sm:text-2xl dark:text-zinc-50">
                      FS后台
                    </span>
                    <span className="rounded-full border border-indigo-200 bg-[var(--color-hm-accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--color-hm-accent-strong)] sm:px-4 sm:text-sm dark:border-indigo-900 dark:bg-indigo-950/50 dark:text-indigo-300">
                      Icon智能生成工具
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[var(--color-hm-copy)] dark:text-zinc-400">统一图标标准与组件生成</p>
                </div>
              </div>
            ) : (
              <>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xl font-bold tracking-tight">
                <Box className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                <span>
                  FS后台设计<span className="ml-1 font-normal text-zinc-400">Icon库</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
                <button
                  onClick={() => setView('icons')}
                  className="flex items-center gap-2 text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                >
                  <LayoutGrid size={16} /> 图标
                </button>
                <button
                  onClick={() => setView('guidelines')}
                  className="flex items-center gap-2 text-indigo-600 transition-colors dark:text-indigo-400"
                >
                  <BookOpen size={16} /> 使用规范
                </button>
              </nav>

              <div className="hidden h-6 w-px bg-zinc-200 md:block dark:bg-zinc-800" />

              <button
                onClick={() => setTheme((value) => (value === 'light' ? 'dark' : 'light'))}
                className="rounded-md p-2 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                aria-label="Toggle Theme"
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
            </div>
              </>
            )}
          </div>
        </div>
      </header>

      <div className={showIconWorkbench ? 'px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6' : 'mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'}>
        {view === 'icons' && (
          showIconWorkbench ? (
            <main className="min-w-0 space-y-6">
              <section
                aria-label="全局规范设置"
                className={`rounded-[var(--radius-hm-card)] border border-[var(--color-hm-border)] bg-[var(--color-hm-surface)] px-4 pt-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:px-6 ${isGlobalSpecCollapsed ? 'pb-3' : 'pb-7'}`}
              >
                <div className={`flex flex-col gap-3 pb-3 sm:flex-row sm:items-center sm:justify-between ${isGlobalSpecCollapsed ? '' : 'border-b border-[var(--color-hm-rule)] dark:border-zinc-800'}`}>
                  <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="h-3 w-3 flex-none rounded-full bg-[var(--color-hm-accent)]" aria-hidden="true" />
                    <h1 className="text-lg font-bold text-[var(--color-hm-ink)] dark:text-zinc-50">全局规范设置</h1>
                    <p className="text-sm text-[var(--color-hm-muted)] dark:text-zinc-400">（改动将实时渲染至下面图标）</p>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={resetGlobalSpec}
                      className="inline-flex min-h-9 items-center gap-2 rounded-lg px-2 text-sm font-medium text-[var(--color-hm-muted)] transition-colors duration-150 hover:text-[var(--color-hm-accent-strong)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 active:text-[var(--color-hm-accent)] disabled:cursor-not-allowed disabled:opacity-40 dark:text-zinc-400 dark:hover:text-indigo-300"
                    >
                      <RotateCcw size={17} /> 重置默认
                    </button>
                    <span className="h-4 w-px bg-[var(--color-hm-border)] dark:bg-zinc-700" aria-hidden="true" />
                    <button
                      type="button"
                      onClick={() => setIsGlobalSpecCollapsed((value) => !value)}
                      aria-expanded={!isGlobalSpecCollapsed}
                      aria-controls="global-spec-controls"
                      className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-[var(--color-hm-muted)] transition-colors duration-150 hover:text-[var(--color-hm-accent-strong)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 active:text-[var(--color-hm-accent)] disabled:cursor-not-allowed disabled:opacity-40 dark:text-zinc-400 dark:hover:text-indigo-300"
                    >
                      {isGlobalSpecCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                      {isGlobalSpecCollapsed ? '展开' : '收起'}
                    </button>
                  </div>
                </div>

                {!isGlobalSpecCollapsed && (
                <div id="global-spec-controls" className="grid min-w-0 gap-6 pt-6 min-[900px]:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)_minmax(0,1fr)]">
                  <div className="min-w-0 space-y-3">
                    <label className="block text-sm font-semibold text-[var(--color-hm-copy)] dark:text-zinc-300">
                      尺寸规范 (PX)
                    </label>
                    <div className="flex min-w-0 flex-col gap-2 sm:flex-row">
                      <div className="flex h-11 min-w-0 flex-1 rounded-[var(--radius-hm-control)] bg-[var(--color-hm-soft)] p-1 dark:bg-zinc-800">
                        {[16, 24, 32].map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => setIconSize(size)}
                            className={`h-full min-h-0 flex-1 rounded-[10px] px-3 text-sm font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 active:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-40 ${
                              iconSize === size
                                ? 'bg-[var(--color-hm-white)] text-[var(--color-hm-accent-strong)] shadow-sm dark:bg-zinc-700 dark:text-indigo-300'
                                : 'text-[var(--color-hm-copy)] hover:text-[var(--color-hm-ink)] dark:text-zinc-400 dark:hover:text-zinc-100'
                            }`}
                            aria-pressed={iconSize === size}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                      <div className="flex h-11 w-full flex-none items-center rounded-[var(--radius-hm-control)] border border-[var(--color-hm-border)] bg-transparent px-4 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/15 sm:w-36 dark:border-zinc-700">
                        <input
                          type="number"
                          min="8"
                          max="256"
                          value={iconSize || ''}
                          onChange={(e) => setIconSize(Number(e.target.value) || 0)}
                          className="min-w-0 flex-1 bg-transparent font-mono text-sm font-semibold text-[var(--color-hm-ink)] outline-none dark:text-zinc-50"
                          aria-label="自定义图标尺寸"
                        />
                        <span className="text-xs text-[var(--color-hm-muted)]">px</span>
                      </div>
                    </div>
                  </div>

                  <div className="min-w-0 space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <label className="text-sm font-semibold text-[var(--color-hm-copy)] dark:text-zinc-300">描边宽度 (Stroke)</label>
                      <span className="font-mono text-sm font-semibold text-[var(--color-hm-accent-strong)] dark:text-indigo-300">
                        {strokeWidth} px
                      </span>
                    </div>
                    <div className="flex flex-col items-stretch gap-3 rounded-[var(--radius-hm-control)] bg-[var(--color-hm-soft)] px-4 py-3 sm:h-11 sm:flex-row sm:items-center sm:py-0 dark:bg-zinc-800">
                      <input
                        type="range"
                        min="0.5"
                        max="10"
                        step="0.5"
                        value={strokeWidth}
                        onChange={(e) => setStrokeWidth(parseFloat(e.target.value))}
                        className="global-spec-range min-w-0 flex-1"
                        aria-label="调整全局描边宽度"
                      />
                      <div className="flex w-full flex-none gap-2 sm:w-auto">
                        {[1.5, 2, 2.5].map((value) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setStrokeWidth(value)}
                            className={`min-h-9 min-w-0 flex-1 rounded-md border px-2 font-mono text-xs transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 active:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-40 sm:min-w-12 sm:flex-none ${
                              strokeWidth === value
                                ? 'border-indigo-300 bg-white font-semibold text-[var(--color-hm-accent-strong)] dark:border-indigo-800 dark:bg-zinc-700 dark:text-indigo-300'
                                : 'border-[var(--color-hm-border)] bg-white/70 text-[var(--color-hm-copy)] hover:border-indigo-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300'
                            }`}
                            aria-pressed={strokeWidth === value}
                          >
                            {value.toFixed(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="min-w-0 space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <label className="text-sm font-semibold text-[var(--color-hm-copy)] dark:text-zinc-300">几何圆角 (Radius)</label>
                      <span className="font-mono text-sm font-semibold text-[var(--color-hm-accent-strong)] dark:text-indigo-300">
                        {safeCornerRadius} R
                      </span>
                    </div>
                    <div className="flex flex-col items-stretch gap-3 rounded-[var(--radius-hm-control)] bg-[var(--color-hm-soft)] px-4 py-3 sm:h-11 sm:flex-row sm:items-center sm:py-0 dark:bg-zinc-800">
                      <input
                        type="range"
                        min="0"
                        max="6"
                        step="1"
                        value={safeCornerRadius}
                        onChange={(e) => setCornerRadius(normalizeCornerRadius(parseFloat(e.target.value)))}
                        className="global-spec-range min-w-0 flex-1"
                        aria-label="调整全局几何圆角"
                      />
                      <div className="flex w-full flex-none gap-2 sm:w-auto">
                        {[0, 1, 2].map((value) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setCornerRadius(value)}
                            className={`min-h-9 min-w-0 flex-1 rounded-md border px-2 font-mono text-xs transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 active:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-40 sm:min-w-12 sm:flex-none ${
                              safeCornerRadius === value
                                ? 'border-indigo-300 bg-white font-semibold text-[var(--color-hm-accent-strong)] dark:border-indigo-800 dark:bg-zinc-700 dark:text-indigo-300'
                                : 'border-[var(--color-hm-border)] bg-white/70 text-[var(--color-hm-copy)] hover:border-indigo-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300'
                            }`}
                            aria-pressed={safeCornerRadius === value}
                          >
                            {value}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                )}
              </section>

              <section
                className={`icon-library-shell ${isLibraryEmpty ? 'min-h-[544px]' : 'min-h-[436px]'} overflow-clip rounded-[var(--radius-hm-card)] border border-[var(--color-hm-border)] bg-[var(--color-hm-surface)] shadow-sm dark:border-zinc-800 dark:bg-zinc-900`}
              >
                <div className="sticky top-[92px] z-30 border-b border-[var(--color-hm-rule)] bg-[var(--color-hm-surface)] px-4 py-5 shadow-[0_12px_24px_-24px_rgba(15,23,42,0.45)] sm:px-6 dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full sm:max-w-3xl">
                      <Search className="absolute top-1/2 left-5 -translate-y-1/2 text-[var(--color-hm-muted)]" size={21} />
                      <input
                        id="icon-search"
                        type="search"
                        aria-label="搜索图标"
                        placeholder="按名称或标签搜索图标..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-10 w-full rounded-[var(--radius-hm-control)] border border-[var(--color-hm-border)] bg-transparent pr-5 pl-14 text-sm text-[var(--color-hm-ink)] outline-none transition-colors duration-150 placeholder:text-[var(--color-hm-muted)] hover:border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 dark:border-zinc-700 dark:text-zinc-50 dark:hover:border-indigo-700"
                      />
                    </div>
                    <div className="flex flex-none items-center justify-between gap-4 sm:justify-end">
                      <div className="text-base font-semibold text-[var(--color-hm-copy)] dark:text-zinc-300">
                        共 <span className="text-[var(--color-hm-ink)] dark:text-zinc-50">{filteredIcons.length}</span> 个图标
                      </div>
                      {!isLibraryEmpty && (
                        <button
                          type="button"
                          onClick={() => setIsAiModalOpen(true)}
                          className="inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-xl bg-[var(--color-hm-accent)] px-5 text-sm font-semibold text-white shadow-md shadow-indigo-500/15 transition-colors duration-150 hover:bg-[var(--color-hm-accent-strong)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-indigo-500 active:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-40 sm:text-base"
                        >
                          <Plus size={20} /> 新增图标
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 overflow-x-auto pb-1" aria-label="图标分类">
                    <div className="flex min-w-max items-center gap-2" role="tablist" aria-label="按语义分类筛选">
                      {semanticCategories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        role="tab"
                        aria-selected={activeCategory === category.id}
                        onClick={() => setActiveCategory(category.id)}
                        onDragEnter={(event) => {
                          if (!isLocalCategoryEditor) return;
                          if (category.id === 'all') return;
                          event.preventDefault();
                          setDragOverCategory(category.id);
                        }}
                        onDragOver={(event) => {
                          if (!isLocalCategoryEditor) return;
                          if (category.id === 'all') return;
                          event.preventDefault();
                          event.dataTransfer.dropEffect = 'move';
                          setDragOverCategory(category.id);
                        }}
                        onDragLeave={() => {
                          if (!isLocalCategoryEditor) return;
                          if (category.id !== 'all' && dragOverCategory === category.id) setDragOverCategory(null);
                        }}
                        onDrop={(event) => {
                          if (!isLocalCategoryEditor) return;
                          if (category.id === 'all') return;
                          event.preventDefault();
                          const iconId = event.dataTransfer.getData('text/plain') || draggedIconId;
                          if (iconId) moveIconToCategory(iconId, category.id);
                        }}
                        className={`min-h-11 rounded-lg border px-4 text-sm font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 active:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-40 ${
                          category.id !== 'all' && dragOverCategory === category.id
                            ? 'border-indigo-400 bg-indigo-100 text-indigo-800 ring-2 ring-indigo-500/25 dark:border-indigo-500 dark:bg-indigo-950 dark:text-indigo-200'
                            : activeCategory === category.id
                            ? 'border-indigo-200 bg-[var(--color-hm-accent-soft)] text-[var(--color-hm-accent-strong)] dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300'
                            : 'border-transparent text-[var(--color-hm-copy)] hover:border-[var(--color-hm-border)] hover:bg-[var(--color-hm-soft)] hover:text-[var(--color-hm-ink)] dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
                        }`}
                      >
                        {category.label}
                      </button>
                      ))}
                    </div>
                  </div>
                </div>

                {isLibraryEmpty ? (
                  <div className="flex min-h-[448px] flex-col items-center justify-center px-4 py-12 text-center">
                    <div className="relative mb-8 flex h-28 w-28 items-center justify-center rounded-3xl border border-indigo-100 bg-[var(--color-hm-accent-soft)] text-[var(--color-hm-accent-strong)] dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300">
                      <FilePlus2 size={52} strokeWidth={1.8} />
                      <span className="absolute -right-2 -bottom-2 flex h-11 w-11 items-center justify-center rounded-full border-4 border-[var(--color-hm-surface)] bg-[var(--color-hm-accent)] text-white dark:border-zinc-900">
                        <Plus size={21} strokeWidth={2.3} />
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-[var(--color-hm-ink)] dark:text-zinc-50">从第一个规范图标开始</h2>
                    <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--color-hm-copy)] dark:text-zinc-400">
                      在上方自定义尺寸、描边与几何圆角参数，按统一规范一键创建应用图标。
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsAiModalOpen(true)}
                      className="mt-10 inline-flex min-h-12 items-center gap-3 whitespace-nowrap rounded-xl bg-[var(--color-hm-accent)] px-8 text-base font-semibold text-white shadow-lg shadow-indigo-500/20 transition-colors duration-150 hover:bg-[var(--color-hm-accent-strong)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-500 active:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Plus size={20} /> 新增第一个图标
                    </button>
                  </div>
                ) : filteredIcons.length === 0 ? (
                  <div className="flex min-h-[480px] flex-col items-center justify-center px-4 py-16 text-center">
                    <Search size={40} className="text-[var(--color-hm-muted)]" />
                    <h2 className="mt-6 text-xl font-bold text-[var(--color-hm-ink)] dark:text-zinc-50">未找到图标</h2>
                    <p className="mt-2 text-sm text-[var(--color-hm-copy)] dark:text-zinc-400">尝试使用其他名称、标签或分类。</p>
                  </div>
                ) : (
                  <div className="icon-library-grid grid gap-5 p-4 sm:p-6">
                    {filteredIcons.map((icon) => (
                      <div
                        key={icon.id}
                        onClick={() => setSelectedIcon(icon)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            setSelectedIcon(icon);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                        draggable={isLocalCategoryEditor}
                        aria-grabbed={isLocalCategoryEditor ? draggedIconId === icon.id : undefined}
                        onDragStart={(event) => {
                          if (!isLocalCategoryEditor) return;
                          event.dataTransfer.effectAllowed = 'move';
                          event.dataTransfer.setData('text/plain', icon.id);
                          setDraggedIconId(icon.id);
                        }}
                        onDragEnd={() => {
                          setDraggedIconId(null);
                          setDragOverCategory(null);
                        }}
                        className={`group relative flex aspect-[4/3] min-w-0 flex-col items-center justify-center rounded-2xl bg-[var(--color-hm-surface)] p-4 transition-[background-color,opacity,transform] duration-150 hover:bg-[var(--color-hm-soft)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 active:bg-indigo-50 dark:bg-zinc-950 dark:hover:bg-zinc-900 dark:active:bg-indigo-950/40 ${isLocalCategoryEditor ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'} ${
                          draggedIconId === icon.id ? 'scale-[0.98] opacity-45' : ''
                        }`}
                      >
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleDeleteIcon(icon.id);
                          }}
                          className="absolute top-3 left-3 z-10 rounded-md bg-red-50 p-1.5 text-red-500 opacity-0 transition-opacity duration-150 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 active:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-red-950/40"
                          title="删除图标"
                          aria-label={`删除 ${icon.name}`}
                        >
                          <Trash size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleCopySVG(icon);
                          }}
                          className="absolute top-3 right-3 z-10 rounded-md border border-[var(--color-hm-border)] bg-[var(--color-hm-surface)] p-1.5 text-[var(--color-hm-muted)] opacity-0 transition-[color,opacity] duration-150 group-hover:opacity-100 hover:text-[var(--color-hm-accent-strong)] focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 active:text-indigo-800 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-900"
                          title="复制 SVG"
                          aria-label={`复制 ${icon.name} SVG`}
                        >
                          <Copy size={14} />
                        </button>
                        <button
                          type="button"
                          draggable={false}
                          onClick={(event) => {
                            event.stopPropagation();
                            void handleExportIconfontSVG(icon);
                          }}
                          className="group/export absolute top-12 right-3 z-10 rounded-md border border-[var(--color-hm-border)] bg-[var(--color-hm-surface)] p-1.5 text-[var(--color-hm-muted)] opacity-0 transition-[color,opacity] duration-150 group-hover:opacity-100 hover:text-[var(--color-hm-accent-strong)] focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 active:text-indigo-800 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-900"
                          title="导出 Iconfont SVG"
                          aria-label={`导出 ${icon.name} 的 Iconfont SVG`}
                        >
                          <Download size={14} />
                          <span className="pointer-events-none absolute top-1/2 right-full mr-2 -translate-y-1/2 whitespace-nowrap rounded-md bg-zinc-900 px-2 py-1 text-[11px] font-medium text-white opacity-0 shadow-sm transition-opacity group-hover/export:opacity-100 dark:bg-zinc-100 dark:text-zinc-900">
                            导出 Iconfont SVG
                          </span>
                        </button>
                        <div className="flex flex-1 items-center justify-center text-[var(--color-hm-copy)] transition-colors duration-150 group-hover:text-[var(--color-hm-accent-strong)] dark:text-zinc-300">
                          <IconPreview
                            icon={icon}
                            id={`icon-svg-${icon.id}`}
                            size={safeIconSize}
                            strokeWidth={actualStrokeWidth}
                            cornerRadius={actualCornerRadius}
                            strokeLinecap={strokeLinecap}
                            strokeLinejoin={strokeLinejoin}
                          />
                        </div>
                        <span className="mt-5 w-full truncate text-center text-sm font-semibold text-[var(--color-hm-ink)] dark:text-zinc-200">
                          {icon.name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </main>
          ) : (
          <main className="min-w-0">
              <div className="mb-8 space-y-4">
                <section
                  aria-label="全局图标配置"
                  className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/20"
                >
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div className="space-y-2">
                    <label className="text-xs font-medium tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                      尺寸 (px)
                    </label>
                    <div className="flex w-full items-center gap-1 rounded-lg bg-zinc-200/50 p-1 dark:bg-zinc-800/50">
                      {[16, 24, 32].map((size) => (
                        <button
                          key={size}
                          onClick={() => setIconSize(size)}
                          className={`flex-1 rounded-md px-3 py-1 text-xs transition-all ${
                            iconSize === size
                              ? 'bg-white font-medium text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-50'
                              : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                      <div className="mx-1 hidden h-4 w-px bg-zinc-300 sm:block dark:bg-zinc-600" />
                      <input
                        type="number"
                        min="8"
                        max="256"
                        value={iconSize || ''}
                        onChange={(e) => setIconSize(Number(e.target.value) || 0)}
                        className="w-14 rounded-md bg-transparent px-1 py-1 text-center text-xs text-zinc-900 outline-none transition-colors focus:bg-white dark:text-zinc-50 dark:focus:bg-zinc-700"
                        placeholder="输入"
                      />
                      <span className="pr-1 text-xs text-zinc-500 dark:text-zinc-400">px</span>
                    </div>
                  </div>

                  <div className="min-w-0 space-y-2">
                    <label className="text-xs font-medium tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                      描边宽度
                    </label>
                    <div className="flex h-9 items-center rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-950">
                      <input
                        type="number"
                        min="0.5"
                        max="10"
                        step="0.5"
                        value={strokeWidth || ''}
                        onChange={(e) => setStrokeWidth(Math.min(5, Math.max(0.5, Number(e.target.value) || 0.5)))}
                        className="min-w-0 flex-1 bg-transparent px-3 py-2 font-mono text-sm text-zinc-900 outline-none dark:text-zinc-50"
                        aria-label="全局描边宽度"
                      />
                      <span className="px-3 text-xs text-zinc-500 dark:text-zinc-400">px</span>
                    </div>
                  </div>

                  <div className="min-w-0 space-y-2">
                    <label className="text-xs font-medium tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                      几何圆角
                    </label>
                    <div className="flex h-9 items-center rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-950">
                      <input
                        type="number"
                        min="0"
                        max="6"
                        step="1"
                        value={safeCornerRadius}
                        onChange={(e) => setCornerRadius(normalizeCornerRadius(Number(e.target.value) || 0))}
                        className="min-w-0 flex-1 bg-transparent px-3 py-2 font-mono text-sm text-zinc-900 outline-none dark:text-zinc-50"
                        aria-label="全局几何圆角"
                      />
                      <span className="px-3 text-xs text-zinc-500 dark:text-zinc-400">R</span>
                    </div>
                  </div>
                  </div>
                </section>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div className="w-full sm:max-w-sm">
                    <div className="relative">
                      <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-zinc-400" size={16} />
                      <input
                        id="icon-search"
                        type="search"
                        aria-label="搜索图标"
                        placeholder="按名称或标签搜索..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-md border border-zinc-200 bg-transparent py-2 pr-4 pl-9 text-sm outline-none transition-all placeholder:text-zinc-500 hover:border-zinc-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-zinc-800 dark:hover:border-zinc-700"
                      />
                    </div>
                  </div>

                  <div className="flex flex-shrink-0 items-center justify-between gap-4 sm:justify-end">
                  {lastGeneratedModel && (
                    <div
                      className="hidden items-center gap-1.5 text-xs text-zinc-500 md:flex dark:text-zinc-400"
                      title={`最近一次生成使用模型：${lastGeneratedModel}`}
                    >
                      <Cpu size={14} />
                      最近：{formatModelName(lastGeneratedModel)}
                    </div>
                  )}
                  <div className="text-sm text-zinc-500 dark:text-zinc-400">
                    共 <span className="font-semibold text-zinc-900 dark:text-zinc-100">{filteredIcons.length}</span> 个
                  </div>
                  <button
                    onClick={() => setIsAiModalOpen(true)}
                    className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700"
                  >
                    <Wand2 size={16} />
                    新增图标
                  </button>
                  </div>
                </div>
              </div>

              {filteredIcons.length === 0 ? (
                <div className="py-20 text-center">
                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 dark:bg-zinc-900">
                    {icons.length === 0 ? <Wand2 size={32} /> : <Search size={32} />}
                  </div>
                  <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                    {icons.length === 0 ? '从第一个统一图标开始' : '未找到图标'}
                  </h3>
                  <p className="mt-1 text-zinc-500">
                    {icons.length === 0 ? '设置好尺寸、描边和圆角后，按当前规范生成。' : '尝试使用其他名称或标签。'}
                  </p>
                  {icons.length === 0 && (
                    <button
                      type="button"
                      onClick={() => setIsAiModalOpen(true)}
                      className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
                    >
                      <Wand2 size={16} /> 新增第一个图标
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {filteredIcons.map((icon) => {
                    return (
                      <div
                        key={icon.id}
                        onClick={() => setSelectedIcon(icon)}
                        className="group relative flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border border-zinc-200 bg-white p-6 transition-all hover:border-indigo-500 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-indigo-400"
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteIcon(icon.id);
                          }}
                          className="absolute top-2 left-2 z-10 rounded-md bg-red-50 p-1.5 text-red-500 opacity-0 transition-all group-hover:opacity-100 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40"
                          title="删除图标"
                        >
                          <Trash size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopySVG(icon);
                          }}
                          className="absolute top-2 right-2 z-10 rounded-md border border-zinc-200 bg-white/90 p-1.5 text-zinc-500 opacity-0 shadow-sm transition-all group-hover:opacity-100 hover:text-indigo-600 dark:border-zinc-700 dark:bg-zinc-900/90 dark:hover:text-indigo-400"
                          title="复制 SVG"
                        >
                          <Copy size={14} />
                        </button>
                        <button
                          type="button"
                          draggable={false}
                          onClick={(event) => {
                            event.stopPropagation();
                            void handleExportIconfontSVG(icon);
                          }}
                          className="group/export absolute top-11 right-2 z-10 rounded-md border border-zinc-200 bg-white/90 p-1.5 text-zinc-500 opacity-0 shadow-sm transition-all group-hover:opacity-100 hover:text-indigo-600 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:border-zinc-700 dark:bg-zinc-900/90 dark:hover:text-indigo-400"
                          title="导出 Iconfont SVG"
                          aria-label={`导出 ${icon.name} 的 Iconfont SVG`}
                        >
                          <Download size={14} />
                          <span className="pointer-events-none absolute top-1/2 right-full mr-2 -translate-y-1/2 whitespace-nowrap rounded-md bg-zinc-900 px-2 py-1 text-[11px] font-medium text-white opacity-0 shadow-sm transition-opacity group-hover/export:opacity-100 dark:bg-zinc-100 dark:text-zinc-900">
                            导出 Iconfont SVG
                          </span>
                        </button>
                        <div className="flex flex-1 items-center justify-center text-zinc-700 transition-colors group-hover:text-indigo-600 dark:text-zinc-300 dark:group-hover:text-indigo-400">
                          <IconPreview
                            icon={icon}
                            id={`icon-svg-${icon.id}`}
                            size={safeIconSize}
                            strokeWidth={actualStrokeWidth}
                            cornerRadius={actualCornerRadius}
                            strokeLinecap={strokeLinecap}
                            strokeLinejoin={strokeLinejoin}
                          />
                        </div>
                        <span className="mt-4 w-full truncate text-center text-xs font-medium text-zinc-500 transition-colors group-hover:text-indigo-600 dark:text-zinc-400 dark:group-hover:text-indigo-400">
                          {icon.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </main>
          )
        )}

        {view === 'guidelines' && (
          <main className="mx-auto max-w-3xl flex-1 py-8">
            <article className="max-w-none text-zinc-700 dark:text-zinc-300">
              <h1 className="mb-2 text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">使用规范与指南</h1>
              <p className="mb-8 text-lg text-zinc-500">关于如何在生产项目中正确使用、定制和集成此图标库的说明。</p>

              <hr className="my-8 border-zinc-200 dark:border-zinc-800" />

              <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-950 dark:text-white">1. 尺寸与对齐</h2>
              <p className="mb-4">
                所有新生成图标都在 24×24 viewBox 内绘制，并与正式 32×32 绘制规范等比对应：圆形采用 21×21
                关键线、方形采用 18×18、横向图形不超过 19.5×16.5、纵向图形不超过 16.5×19.5，画板四周至少保留
                0.75 个单位。
              </p>
              <p className="mb-4">
                图标按视觉重心而不是机械边界居中；Keyline 选择同时考虑有效主体、墨量、负空间和方向性，并保持原始长宽比。
                新生成结果必须是单个 &lt;path&gt;，不相连部件使用同一路径内的多个 M 子路径。
              </p>
              <p className="mb-4">建议的常规显示尺寸步进为：</p>
              <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { s: 12, name: '小', desc: '密集 UI' },
                  { s: 16, name: '基础', desc: '按钮内嵌' },
                  { s: 24, name: '标准', desc: '主导航' },
                  { s: 40, name: '大', desc: '空状态' }
                ].map((item) => (
                  <div key={item.s} className="rounded-lg border border-zinc-200 p-4 text-center dark:border-zinc-800">
                    <div className="mb-2 flex h-10 items-center justify-center text-zinc-700 dark:text-zinc-300">
                      <Home size={item.s} />
                    </div>
                    <div className="text-sm font-semibold">{item.s}px</div>
                    <div className="mt-1 text-xs text-zinc-500">
                      {item.name} · {item.desc}
                    </div>
                  </div>
                ))}
              </div>

              <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-950 dark:text-white">2. 描边粗细</h2>
              <p className="mb-4">默认采用 2px 描边。可以根据界面的排版厚度调整描边。</p>
              <ul className="mb-6 list-disc space-y-2 pl-6">
                <li>
                  <code>strokeWidth={1}</code>：适合大型展示图标或细体字。
                </li>
                <li>
                  <code>strokeWidth={2}</code>：推荐，标准粗细。
                </li>
                <li>
                  <code>strokeWidth={3}</code>：适合极小尺寸或强强调。
                </li>
              </ul>

              <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-950 dark:text-white">3. 全局生成规范</h2>
              <p className="mb-4">
                顶部的尺寸、描边宽度和几何圆角共同组成当前图标规范。新增图标会严格按这组参数生成，
                并自动套用相应的圆形、方形、横向或纵向关键线，再进行视觉体量与重心校准。
              </p>

              <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-950 dark:text-white">4. 可编辑矢量</h2>
              <p className="mb-4">
                新增图标采用 24×24 viewBox、中心线描边和基础 SVG 几何构建。关键线校准通过可编辑 SVG 分组完成，
                复制到设计软件后仍可继续调整节点、描边与圆角，不会被转换成不可编辑的填充轮廓。
              </p>

              <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-950 dark:text-white">5. 无障碍访问</h2>
              <p className="mb-4">
                如果图标独立作为按钮使用，请添加 <code>aria-label</code>。如果图标仅作为装饰，请添加{' '}
                <code>aria-hidden="true"</code>。
              </p>
              <pre className="mb-6 overflow-x-auto rounded-lg bg-zinc-100 p-4 text-sm dark:bg-zinc-900">
                {`<button className="flex items-center gap-2">
  <Home size={16} aria-hidden="true" />
  <span>返回首页</span>
</button>

<button aria-label="关闭对话框">
  <X size={24} />
</button>`}
              </pre>

              <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-950 dark:text-white">6. React 集成示例</h2>
              <pre className="overflow-x-auto rounded-lg bg-zinc-100 p-4 text-sm dark:bg-zinc-900">
                {`import { Settings } from 'lucide-react';

export default function NavItem() {
  return (
    <a href="/settings" className="text-zinc-500 hover:text-indigo-600">
      <Settings size={24} strokeWidth={2} strokeLinejoin="round" />
    </a>
  );
}`}
              </pre>
            </article>
          </main>
        )}
      </div>

      {selectedIcon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm" onClick={() => setSelectedIcon(null)} />
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex flex-col items-center p-6">
              <button
                onClick={() => setSelectedIcon(null)}
                className="absolute top-4 right-4 rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
              >
                <XIcon size={20} />
              </button>

              <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-2xl border border-zinc-100 bg-zinc-50 text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100">
                <IconPreview
                  icon={selectedIcon}
                  id={`icon-svg-detail-${selectedIcon.id}`}
                  size={64}
                  strokeWidth={actualStrokeWidth}
                  cornerRadius={actualCornerRadius}
                  strokeLinecap={strokeLinecap}
                  strokeLinejoin={strokeLinejoin}
                />
              </div>

              <div className="mb-3 w-full max-w-xs">
                <label
                  htmlFor={`icon-name-${selectedIcon.id}`}
                  className="block text-center text-xs font-semibold tracking-wide text-zinc-500 dark:text-zinc-400"
                >
                  图标名称
                </label>
                <div className="relative mt-2">
                  <input
                    id={`icon-name-${selectedIcon.id}`}
                    type="text"
                    maxLength={80}
                    aria-label="修改图标名称"
                    value={selectedIcon.name}
                    onChange={(e) => {
                      const newName = e.target.value.slice(0, 80);
                      setSelectedIcon({ ...selectedIcon, name: newName });
                      setIconNameOverrides((current) => {
                        const next = { ...current };
                        if (newName.trim()) next[selectedIcon.id] = newName;
                        else delete next[selectedIcon.id];
                        return next;
                      });
                    }}
                    className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-11 text-center text-xl font-bold text-zinc-900 outline-none transition-colors hover:border-indigo-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/15 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:border-indigo-700 dark:focus:border-indigo-500"
                  />
                  <Edit
                    size={16}
                    className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-zinc-400"
                  />
                </div>
                <p className="mt-2 text-center text-xs text-zinc-400 dark:text-zinc-500">修改后自动永久保存</p>
              </div>
              <div className="mb-6 flex gap-2 text-sm text-zinc-500">
                <span>{selectedIcon.category}</span>
                <span>·</span>
                <span>{selectedIcon.tags.join(', ')}</span>
              </div>

              {(selectedIcon.sourceModel || selectedIcon.styleProfile) && (
                <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
                  {selectedIcon.sourceModel && (
                    <div
                      className="flex items-center gap-1.5 rounded-md bg-zinc-100 px-2.5 py-1.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                      title={selectedIcon.sourceModel}
                    >
                      <Cpu size={13} /> 生成模型：{formatModelName(selectedIcon.sourceModel)}
                    </div>
                  )}
                  {selectedIcon.styleProfile && (
                    <div
                      className="rounded-md border border-indigo-200 bg-indigo-50 px-2.5 py-1.5 text-xs text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300"
                      title={selectedIcon.styleProfile.referenceLibrary}
                    >
                      生成规范：{selectedIcon.styleProfile.standardVersion || '旧版'} · {selectedIcon.styleProfile.iconSize}px ·{' '}
                      {selectedIcon.styleProfile.strokeWidth}px 描边 · R{selectedIcon.styleProfile.cornerRadius}
                    </div>
                  )}
                </div>
              )}

              <div className="mb-3 grid w-full grid-cols-2 gap-3">
                <button
                  onClick={() => handleCopyJSX(selectedIcon)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  <Copy size={16} /> 复制 JSX
                </button>
                <button
                  onClick={() => handleCopySVG(selectedIcon)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                >
                  <Copy size={16} /> 复制 SVG
                </button>
                <button
                  onClick={() => {
                    downloadSVG(selectedIcon.id, selectedIcon.name);
                    showToast('已开始下载 SVG');
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                >
                  <Download size={16} /> 下载 SVG
                </button>
                <button
                  onClick={() => {
                    downloadPNG(selectedIcon.id, selectedIcon.name, safeIconSize);
                    showToast('已开始下载 PNG');
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                >
                  <Download size={16} /> 下载 PNG
                </button>
              </div>

              <button
                onClick={() => handleDeleteIcon(selectedIcon.id)}
                className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash size={14} /> 从库中删除此图标
              </button>
            </div>

            <div className="flex flex-col items-start justify-between gap-2 border-t border-zinc-200 bg-zinc-50 p-4 font-mono text-xs text-zinc-500 sm:flex-row sm:items-center dark:border-zinc-800 dark:bg-zinc-950/50">
              <span>实际物理尺寸: {safeIconSize}px</span>
              <span>描边: {strokeWidth}px</span>
              <span>几何圆角: R{safeCornerRadius}</span>
            </div>
          </div>
        </div>
      )}

      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
            onClick={() => !isGenerating && setIsAiModalOpen(false)}
          />
          <div className="relative max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
            <div className="p-6">
              <button
                onClick={() => setIsAiModalOpen(false)}
                disabled={isGenerating}
                className="absolute top-4 right-4 rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-900 disabled:opacity-50 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
              >
                <XIcon size={20} />
              </button>

              <div className="mb-6 flex flex-col items-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 shadow-sm dark:bg-indigo-900/50 dark:text-indigo-400">
                  <Wand2 size={24} />
                </div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">AI 智能生成图标</h2>
                <p className="mt-1 text-center text-sm text-zinc-500">根据当前全局规范生成，也可上传参考图辅助识别结构。</p>
              </div>

              <div className="mb-4">
                <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  图标名称 / 概念说明
                </label>
                <input
                  type="text"
                  value={newIconName}
                  onChange={(e) => setNewIconName(e.target.value)}
                  placeholder="例如: 火箭、用户设置"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
                  disabled={isGenerating}
                />
              </div>

              <div className="mb-4 rounded-xl border border-indigo-100 bg-indigo-50/60 px-4 py-3 dark:border-indigo-900/60 dark:bg-indigo-950/20">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-wider text-indigo-700 uppercase dark:text-indigo-300">
                    当前生成规范
                  </span>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400">在顶部全局设置中调整</span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-zinc-700 dark:text-zinc-300">
                  <span>{safeIconSize}px 尺寸</span>
                  <span>{strokeWidth}px 描边</span>
                  <span>R{safeCornerRadius} 圆角</span>
                </div>
              </div>

              <div
                onClick={() => !isGenerating && fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  if (!isGenerating) setIsDragging(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (isGenerating) return;
                  const file = e.dataTransfer.files?.[0];
                  if (file?.type.startsWith('image/')) processFile(file);
                }}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all ${
                  isDragging
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                    : uploadedImage
                      ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20'
                      : 'border-zinc-300 hover:border-indigo-400 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800/50'
                }`}
              >
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/svg+xml"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={(e) => processFile(e.target.files?.[0])}
                  disabled={isGenerating}
                />

                {uploadedImage ? (
                  <div className="flex w-full items-center gap-4 text-left">
                    <img src={uploadedImage} alt="已上传的参考图" className="h-16 w-16 flex-none object-contain" />
                    <div className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-indigo-600 dark:text-indigo-400">
                        参考图已上传
                      </span>
                      <span className="mt-1 block text-xs text-zinc-500 dark:text-zinc-400">点击或拖拽可更换</span>
                    </div>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        clearUploadedImage();
                      }}
                      disabled={isGenerating}
                      className="flex flex-none items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2.5 py-2 text-xs font-medium text-zinc-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-red-900 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                      aria-label="移除参考图"
                    >
                      <XIcon size={14} /> 移除
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center text-zinc-500">
                    <UploadCloud size={32} className="mb-3 text-zinc-400" />
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      可选：点击、拖拽或粘贴参考图片
                    </span>
                    <span className="mt-2 text-xs">不传图将按上方名称直接生成。支持 SVG/PNG/JPG</span>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <button
                  onClick={handleGenerateStyle}
                  disabled={!canGenerate}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-medium text-white transition-colors hover:bg-indigo-700 disabled:bg-zinc-200 disabled:text-zinc-400 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-600"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> {loadingMsg}
                    </>
                  ) : (
                    <>
                      <Wand2 size={18} /> 按当前规范生成
                    </>
                  )}
                </button>
                <p className="mt-3 text-center text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                  优先使用 Gemini 3 Flash；配额不足时自动切换到 Flash Lite。
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Toast message={toastMsg} visible={toastVisible} />
    </div>
  );
}
