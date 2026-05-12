import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Archive,
  AtSign,
  Bell,
  BookOpen,
  Box,
  Camera,
  Check as CheckIcon,
  ChevronDown,
  ChevronRight,
  Cloud,
  CloudRain,
  Code,
  Copy,
  Cpu,
  CreditCard,
  Database,
  DollarSign,
  Download,
  Edit,
  File,
  Film,
  Folder,
  GitBranch,
  Globe,
  Heart,
  Home,
  Image as ImageIcon,
  Inbox,
  Info,
  LayoutGrid,
  Loader2,
  Mail,
  Menu,
  Menu as MenuIcon,
  MessageSquare,
  Mic,
  Moon,
  Moon as MoonIcon,
  MoreHorizontal,
  Music,
  Paperclip,
  Pause,
  Phone,
  Play,
  Search,
  Search as SearchIcon,
  Send,
  Settings,
  Share2,
  ShoppingBag,
  ShoppingCart,
  Sun,
  Sun as SunIcon,
  Tag,
  Terminal,
  ThumbsUp,
  Trash,
  UploadCloud,
  User,
  Wand2,
  Wind,
  X,
  X as XIcon
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { doc, getFirestore, onSnapshot, setDoc } from 'firebase/firestore';

type Category = 'UI & Nav' | 'Communication' | 'Media' | 'Commerce' | 'Social' | 'Weather' | 'Dev' | 'Misc';

type IconSvgProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
  strokeWidth?: number | string;
};

interface IconData {
  id: string;
  name: string;
  category: Category;
  tags: string[];
  component: React.ElementType<IconSvgProps>;
}

interface CustomIconDef {
  id: string;
  name: string;
  svgPaths: string;
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

const CATEGORIES: Category[] = [
  'UI & Nav',
  'Communication',
  'Media',
  'Commerce',
  'Social',
  'Weather',
  'Dev',
  'Misc'
];

const INITIAL_ICONS: IconData[] = [
  { id: 'home', name: 'Home', category: 'UI & Nav', tags: ['house', 'main', 'index'], component: Home },
  { id: 'settings', name: 'Settings', category: 'UI & Nav', tags: ['gear', 'preferences', 'options'], component: Settings },
  { id: 'user', name: 'User', category: 'UI & Nav', tags: ['person', 'account', 'profile'], component: User },
  { id: 'bell', name: 'Bell', category: 'UI & Nav', tags: ['notification', 'alarm', 'alert'], component: Bell },
  { id: 'menu', name: 'Menu', category: 'UI & Nav', tags: ['hamburger', 'nav', 'list'], component: MenuIcon },
  { id: 'more-horizontal', name: 'More', category: 'UI & Nav', tags: ['dots', 'ellipsis', 'menu'], component: MoreHorizontal },
  { id: 'chevron-right', name: 'ChevronRight', category: 'UI & Nav', tags: ['arrow', 'next'], component: ChevronRight },
  { id: 'chevron-down', name: 'ChevronDown', category: 'UI & Nav', tags: ['arrow', 'expand'], component: ChevronDown },
  { id: 'search', name: 'Search', category: 'UI & Nav', tags: ['find', 'magnifier'], component: SearchIcon },
  { id: 'x', name: 'Close', category: 'UI & Nav', tags: ['close', 'cancel', 'remove'], component: XIcon },
  { id: 'check', name: 'Check', category: 'UI & Nav', tags: ['tick', 'confirm', 'success'], component: CheckIcon },
  { id: 'info', name: 'Info', category: 'UI & Nav', tags: ['help', 'details'], component: Info },
  { id: 'mail', name: 'Mail', category: 'Communication', tags: ['email', 'letter', 'message'], component: Mail },
  { id: 'message-square', name: 'Message', category: 'Communication', tags: ['chat', 'comment'], component: MessageSquare },
  { id: 'phone', name: 'Phone', category: 'Communication', tags: ['call', 'contact'], component: Phone },
  { id: 'send', name: 'Send', category: 'Communication', tags: ['paperplane', 'submit'], component: Send },
  { id: 'inbox', name: 'Inbox', category: 'Communication', tags: ['email', 'receive'], component: Inbox },
  { id: 'mic', name: 'Microphone', category: 'Communication', tags: ['audio', 'record', 'voice'], component: Mic },
  { id: 'play', name: 'Play', category: 'Media', tags: ['start', 'video', 'audio'], component: Play },
  { id: 'pause', name: 'Pause', category: 'Media', tags: ['stop', 'wait'], component: Pause },
  { id: 'image', name: 'Image', category: 'Media', tags: ['picture', 'photo', 'gallery'], component: ImageIcon },
  { id: 'music', name: 'Music', category: 'Media', tags: ['audio', 'song', 'note'], component: Music },
  { id: 'camera', name: 'Camera', category: 'Media', tags: ['photo', 'lens', 'picture'], component: Camera },
  { id: 'film', name: 'Film', category: 'Media', tags: ['video', 'movie', 'cinema'], component: Film },
  { id: 'shopping-cart', name: 'Cart', category: 'Commerce', tags: ['buy', 'purchase', 'store'], component: ShoppingCart },
  { id: 'credit-card', name: 'Card', category: 'Commerce', tags: ['payment', 'money', 'buy'], component: CreditCard },
  { id: 'dollar-sign', name: 'Dollar', category: 'Commerce', tags: ['money', 'currency', 'cash'], component: DollarSign },
  { id: 'tag', name: 'Tag', category: 'Commerce', tags: ['label', 'price', 'sale'], component: Tag },
  { id: 'shopping-bag', name: 'Bag', category: 'Commerce', tags: ['buy', 'purchase', 'store'], component: ShoppingBag },
  { id: 'heart', name: 'Heart', category: 'Social', tags: ['like', 'love', 'favorite'], component: Heart },
  { id: 'share-2', name: 'Share', category: 'Social', tags: ['network', 'connect'], component: Share2 },
  { id: 'thumbs-up', name: 'ThumbsUp', category: 'Social', tags: ['like', 'approve', 'good'], component: ThumbsUp },
  { id: 'at-sign', name: 'SocialHandle', category: 'Social', tags: ['social', 'network', 'mention'], component: AtSign },
  { id: 'git-branch', name: 'Repository', category: 'Social', tags: ['code', 'developer', 'git'], component: GitBranch },
  { id: 'sun', name: 'Sun', category: 'Weather', tags: ['day', 'light', 'warm'], component: SunIcon },
  { id: 'moon', name: 'Moon', category: 'Weather', tags: ['night', 'dark', 'sleep'], component: MoonIcon },
  { id: 'cloud', name: 'Cloud', category: 'Weather', tags: ['weather', 'sky', 'overcast'], component: Cloud },
  { id: 'cloud-rain', name: 'Rain', category: 'Weather', tags: ['water', 'precipitation'], component: CloudRain },
  { id: 'wind', name: 'Wind', category: 'Weather', tags: ['breeze', 'air', 'blow'], component: Wind },
  { id: 'code', name: 'Code', category: 'Dev', tags: ['programming', 'html', 'brackets'], component: Code },
  { id: 'terminal', name: 'Terminal', category: 'Dev', tags: ['console', 'cli', 'prompt'], component: Terminal },
  { id: 'database', name: 'Database', category: 'Dev', tags: ['storage', 'sql', 'data'], component: Database },
  { id: 'cpu', name: 'CPU', category: 'Dev', tags: ['processor', 'hardware', 'chip'], component: Cpu },
  { id: 'globe', name: 'Globe', category: 'Dev', tags: ['world', 'internet', 'network'], component: Globe },
  { id: 'archive', name: 'Archive', category: 'Misc', tags: ['box', 'storage', 'save'], component: Archive },
  { id: 'paperclip', name: 'Paperclip', category: 'Misc', tags: ['attachment', 'file', 'link'], component: Paperclip },
  { id: 'file', name: 'File', category: 'Misc', tags: ['document', 'paper', 'page'], component: File },
  { id: 'folder', name: 'Folder', category: 'Misc', tags: ['directory', 'files'], component: Folder }
];

const sanitizeSvgFragment = (fragment: string) =>
  fragment
    .replace(/```[a-zA-Z]*\n?/g, '')
    .replace(/```/g, '')
    .replace(/<svg[^>]*>/gi, '')
    .replace(/<\/svg>/gi, '')
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<foreignObject[\s\S]*?>[\s\S]*?<\/foreignObject>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/\son\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '')
    .trim();

const downloadSVG = (iconId: string, iconName: string) => {
  const svgElement = document.getElementById(`icon-svg-${iconId}`);
  if (!svgElement) return;

  const svgData = new XMLSerializer().serializeToString(svgElement);
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

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const isFirstLoad = useRef(true);

  const [iconSize, setIconSize] = useState(24);
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [customIcons, setCustomIcons] = useState<CustomIconDef[]>([]);
  const [iconNameOverrides, setIconNameOverrides] = useState<Record<string, string>>({});
  const [deletedIconIds, setDeletedIconIds] = useState<string[]>([]);
  const [uploadedImageBase64, setUploadedImageBase64] = useState<string | null>(null);
  const [uploadedImageMimeType, setUploadedImageMimeType] = useState<string | null>(null);
  const [newIconName, setNewIconName] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const [view, setView] = useState<'icons' | 'guidelines'>('icons');
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Set<Category>>(new Set());
  const [selectedIcon, setSelectedIcon] = useState<IconData | null>(null);
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('正在生成...');
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
          setTheme(data.theme === 'dark' || data.theme === 'light' ? data.theme : prefersDark ? 'dark' : 'light');
          if (Array.isArray(data.customIcons)) setCustomIcons(data.customIcons);
          if (data.iconNameOverrides) setIconNameOverrides(data.iconNameOverrides);
          if (Array.isArray(data.deletedIconIds)) setDeletedIconIds(data.deletedIconIds);
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
    if (!user || !db || !dataLoaded) return;

    const timer = window.setTimeout(() => {
      const docRef = doc(db, 'artifacts', appId, 'users', user.uid, 'icon_app_state', 'main');
      setDoc(docRef, {
        iconSize,
        strokeWidth,
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
    theme,
    customIcons,
    iconNameOverrides,
    deletedIconIds,
    uploadedImageBase64,
    uploadedImageMimeType,
    newIconName
  ]);

  const icons = useMemo(() => {
    const generated: IconData[] = customIcons.map((ci) => ({
      id: ci.id,
      name: iconNameOverrides[ci.id] || ci.name,
      category: 'Misc',
      tags: ['custom', 'ai-generated'],
      component: (props: IconSvgProps) => (
        <svg
          id={props.id}
          width={props.size}
          height={props.size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={props.strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          xmlns="http://www.w3.org/2000/svg"
          className={props.className}
          dangerouslySetInnerHTML={{ __html: ci.svgPaths }}
        />
      )
    }));

    const baseIcons = INITIAL_ICONS.map((icon) => ({
      ...icon,
      name: iconNameOverrides[icon.id] || icon.name
    }));

    return [...generated, ...baseIcons].filter((icon) => !deletedIconIds.includes(icon.id));
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
    if (selectedIcon?.id === id) setSelectedIcon(null);
    showToast('图标已删除');
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

  const toggleCategory = (cat: Category) => {
    const next = new Set(selectedCategories);
    if (next.has(cat)) next.delete(cat);
    else next.add(cat);
    setSelectedCategories(next);
  };

  const filteredIcons = useMemo(
    () =>
      icons.filter((icon) => {
        const normalizedSearch = search.toLowerCase();
        const matchesSearch =
          !normalizedSearch ||
          icon.name.toLowerCase().includes(normalizedSearch) ||
          icon.tags.some((tag) => tag.toLowerCase().includes(normalizedSearch));
        const matchesCategory = selectedCategories.size === 0 || selectedCategories.has(icon.category);
        return matchesSearch && matchesCategory;
      }),
    [icons, search, selectedCategories]
  );

  const categoryCounts = useMemo(() => {
    const counts: Record<Category, number> = Object.fromEntries(CATEGORIES.map((category) => [category, 0])) as Record<
      Category,
      number
    >;
    icons.forEach((icon) => {
      counts[icon.category] += 1;
    });
    return counts;
  }, [icons]);

  const safeIconSize = Math.max(iconSize || 24, 1);
  const scaleRatio = safeIconSize / 24;
  const actualStrokeWidth = Number((strokeWidth / scaleRatio).toFixed(3));

  const handleCopyJSX = (icon: IconData) => {
    const componentName = icon.id.startsWith('custom-') ? 'CustomIcon' : icon.name.replace(/[^A-Za-z0-9_$]/g, '');
    const jsx = `<${componentName} size={${safeIconSize}} strokeWidth={${actualStrokeWidth}} />`;
    copyToClipboard(jsx, '已复制 JSX 代码');
  };

  const handleCopySVG = (icon: IconData) => {
    const svgElement = document.getElementById(`icon-svg-${icon.id}`);
    if (!svgElement) return;
    const svgData = new XMLSerializer().serializeToString(svgElement);
    copyToClipboard(svgData, '已复制 SVG 代码');
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
      const prompt = isTextOnly
        ? `You are a world-class SVG icon engineer and vector artist.
Your task is to generate a clean, minimalist SVG line icon representing the concept: "${iconConcept}".

STRICT SVG MATH AND ALIGNMENT RULES:
1. STYLE: Lucide-style minimalist line art. Use simple, bold geometric shapes.
2. VIEWBOX GRID: The canvas is exactly 24x24. ALL X and Y coordinates MUST strictly be between 0 and 24.
3. SIZE & SAFE ZONE: The main visual elements MUST be contained within a 20x20 safe zone, centered at (12, 12). DO NOT let the icon touch the 0 or 24 edges.
4. ATTRIBUTES: DO NOT output stroke, stroke-width, stroke-linecap, or stroke-linejoin attributes.
5. FILL: Set fill="none" for outlined paths. If a shape is solid, use fill="currentColor".
6. OUTPUT FORMAT: ONLY output raw internal SVG elements, such as <path>, <circle>, <rect>, or <polygon>. DO NOT wrap them in <svg> tags. DO NOT use markdown formatting.`
        : `You are a world-class SVG icon engineer and vector artist.
Your task is to accurately replicate the uploaded raster icon into a clean, minimalist SVG vector graphic.

STRICT SVG MATH AND ALIGNMENT RULES:
1. VIEWBOX GRID: The canvas is exactly 24x24. ALL X and Y coordinates MUST strictly be between 0 and 24.
2. SIZE & SAFE ZONE: The main visual elements MUST be contained within a 20x20 safe zone, centered at (12, 12). DO NOT let the icon touch the 0 or 24 edges.
3. TOPOLOGY & STRUCTURE: Observe the original image carefully. Use precise SVG paths to replicate the exact structure without unnatural overlaps or broken intersections.
4. ATTRIBUTES: DO NOT output stroke, stroke-width, stroke-linecap, or stroke-linejoin attributes.
5. FILL: Set fill="none" for outlined paths. If a shape is solid, use fill="currentColor".
6. OUTPUT FORMAT: ONLY output raw internal SVG elements, such as <path>, <circle>, <rect>, or <polygon>. DO NOT wrap them in <svg> tags. DO NOT use markdown formatting.`;

      msgTimer1 = window.setTimeout(() => setLoadingMsg('AI 正在进行几何结构推演...'), 6000);
      msgTimer2 = window.setTimeout(() => setLoadingMsg('矢量代码生成中，可能还需要十几秒...'), 15000);

      let generatedSvgPaths: string | null = null;
      let delay = 1000;

      for (let i = 0; i < 2; i += 1) {
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
            generatedSvgPaths = sanitizeSvgFragment(data.text);
            break;
          }
          break;
        } catch (error: any) {
          if (i === 1) {
            console.error('AI Generation failed after 2 tries', error);
            const message =
              error.name === 'AbortError'
                ? '请求超时，请稍后重试'
                : error.message
                  ? `AI 失败：${String(error.message).slice(0, 70)}`
                  : 'AI 节点拥挤或超时，请稍后重试';
            showToast(message);
            return;
          }

          await new Promise((resolve) => window.setTimeout(resolve, delay));
          delay *= 2;
        }
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
          svgPaths: generatedSvgPaths
        },
        ...prev
      ]);

      setIsAiModalOpen(false);
      setNewIconName('');
      showToast(`${isTextOnly ? '创意' : '风格'}解析完成，已生成图标`);
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
        theme === 'dark' ? 'dark bg-zinc-950 text-zinc-50' : 'bg-white text-zinc-900'
      }`}
    >
      <header className="sticky top-0 z-40 w-full flex-none border-b border-zinc-200 bg-white/75 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/75">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                className="p-2 -ml-2 text-zinc-500 hover:text-zinc-900 lg:hidden dark:text-zinc-400 dark:hover:text-zinc-50"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu size={24} />
              </button>
              <div className="flex items-center gap-2 text-xl font-bold tracking-tight">
                <Box className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                <span>
                  LucideUI<span className="ml-1 font-normal text-zinc-400">Icon库</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
                <button
                  onClick={() => setView('icons')}
                  className={`flex items-center gap-2 transition-colors ${
                    view === 'icons'
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50'
                  }`}
                >
                  <LayoutGrid size={16} /> 图标
                </button>
                <button
                  onClick={() => setView('guidelines')}
                  className={`flex items-center gap-2 transition-colors ${
                    view === 'guidelines'
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50'
                  }`}
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
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
        {view === 'icons' && (
          <>
            <aside
              className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-zinc-200 bg-white transition-transform duration-300 lg:static lg:translate-x-0 lg:border-none lg:bg-transparent dark:border-zinc-800 dark:bg-zinc-950 ${
                mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
            >
              <div className="flex h-full flex-col p-6 lg:p-0">
                <div className="mb-6 flex items-center justify-between lg:hidden">
                  <span className="text-lg font-bold">分类</span>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-2 -mr-2">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">按名称/标签搜索</h3>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                      <input
                        type="text"
                        placeholder="搜索图标..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-md border border-transparent bg-zinc-100 py-2 pr-4 pl-9 text-sm outline-none transition-all placeholder:text-zinc-500 focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 dark:bg-zinc-900 dark:focus:bg-zinc-950"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">分类筛选</h3>
                      {selectedCategories.size > 0 && (
                        <button
                          onClick={() => setSelectedCategories(new Set())}
                          className="text-xs text-indigo-600 hover:underline dark:text-indigo-400"
                        >
                          清除
                        </button>
                      )}
                    </div>
                    <div className="space-y-1">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => toggleCategory(cat)}
                          className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors ${
                            selectedCategories.has(cat)
                              ? 'bg-indigo-50 font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                              : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-50'
                          }`}
                        >
                          <span>{cat}</span>
                          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                            {categoryCounts[cat]}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {mobileMenuOpen && (
              <div
                className="fixed inset-0 z-40 bg-zinc-900/50 backdrop-blur-sm lg:hidden"
                onClick={() => setMobileMenuOpen(false)}
              />
            )}

            <main className="min-w-0 flex-1">
              <div className="mb-8 flex flex-col justify-between gap-4 rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 sm:flex-row sm:items-center dark:border-zinc-800 dark:bg-zinc-900/20">
                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                      尺寸 (px)
                    </label>
                    <div className="flex items-center gap-1 rounded-lg bg-zinc-200/50 p-1 dark:bg-zinc-800/50">
                      {[16, 24, 32].map((size) => (
                        <button
                          key={size}
                          onClick={() => setIconSize(size)}
                          className={`rounded-md px-3 py-1 text-xs transition-all ${
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

                  <div className="hidden h-10 w-px bg-zinc-200 md:block dark:bg-zinc-800" />

                  <div className="max-w-[160px] min-w-[120px] flex-1 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                        描边宽度
                      </label>
                      <div className="flex items-center rounded-md bg-zinc-200/50 dark:bg-zinc-800/50">
                        <input
                          type="number"
                          min="0.1"
                          max="10"
                          step="0.1"
                          value={strokeWidth || ''}
                          onChange={(e) => setStrokeWidth(Number(e.target.value) || 0)}
                          className="w-12 rounded-md bg-transparent px-1 py-0.5 text-center font-mono text-xs text-zinc-900 outline-none transition-colors focus:bg-white dark:text-zinc-50 dark:focus:bg-zinc-700"
                        />
                        <span className="pr-1.5 text-[10px] text-zinc-500 dark:text-zinc-400">px</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="5"
                      step="0.5"
                      value={strokeWidth}
                      onChange={(e) => setStrokeWidth(parseFloat(e.target.value))}
                      className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-zinc-200 accent-indigo-600 dark:bg-zinc-800"
                    />
                  </div>
                </div>

                <div className="mt-4 flex flex-shrink-0 items-center justify-between gap-4 sm:mt-0 sm:justify-end">
                  <div className="text-sm text-zinc-500 dark:text-zinc-400">
                    共 <span className="font-semibold text-zinc-900 dark:text-zinc-100">{filteredIcons.length}</span> 个
                  </div>
                  <button
                    onClick={() => setIsAiModalOpen(true)}
                    className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700"
                  >
                    <Wand2 size={16} />
                    风格匹配
                  </button>
                </div>
              </div>

              {filteredIcons.length === 0 ? (
                <div className="py-20 text-center">
                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 dark:bg-zinc-900">
                    <SearchIcon size={32} />
                  </div>
                  <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">未找到图标</h3>
                  <p className="mt-1 text-zinc-500">尝试使用其他关键词或清除分类筛选。</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {filteredIcons.map((icon) => {
                    const IconComponent = icon.component;
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
                        <div className="flex flex-1 items-center justify-center text-zinc-700 transition-colors group-hover:text-indigo-600 dark:text-zinc-300 dark:group-hover:text-indigo-400">
                          <IconComponent id={`icon-svg-${icon.id}`} size={safeIconSize} strokeWidth={actualStrokeWidth} />
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
          </>
        )}

        {view === 'guidelines' && (
          <main className="mx-auto max-w-3xl flex-1 py-8">
            <article className="max-w-none text-zinc-700 dark:text-zinc-300">
              <h1 className="mb-2 text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">使用规范与指南</h1>
              <p className="mb-8 text-lg text-zinc-500">关于如何在生产项目中正确使用、定制和集成此图标库的说明。</p>

              <hr className="my-8 border-zinc-200 dark:border-zinc-800" />

              <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-950 dark:text-white">1. 尺寸与对齐</h2>
              <p className="mb-4">所有图标都在 24x24px 的 viewBox 内绘制。建议的常规尺寸步进为：</p>
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

              <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-950 dark:text-white">3. 无障碍访问</h2>
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

              <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-950 dark:text-white">4. React 集成示例</h2>
              <pre className="overflow-x-auto rounded-lg bg-zinc-100 p-4 text-sm dark:bg-zinc-900">
                {`import { Settings } from 'lucide-react';

export default function NavItem() {
  return (
    <a href="/settings" className="text-zinc-500 hover:text-indigo-600">
      <Settings size={24} strokeWidth={2} />
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
                {React.createElement(selectedIcon.component, {
                  id: `icon-svg-detail-${selectedIcon.id}`,
                  size: 64,
                  strokeWidth: actualStrokeWidth
                })}
              </div>

              <div className="group/title relative mb-1 flex items-center gap-2">
                <input
                  type="text"
                  value={selectedIcon.name}
                  onChange={(e) => {
                    const newName = e.target.value;
                    setSelectedIcon({ ...selectedIcon, name: newName });
                    setIconNameOverrides((prev) => ({ ...prev, [selectedIcon.id]: newName }));
                  }}
                  className="w-full max-w-[220px] border-b-2 border-transparent bg-transparent pb-1 text-center text-2xl font-bold text-zinc-900 outline-none transition-colors hover:border-zinc-300 focus:border-indigo-500 dark:text-zinc-50 dark:hover:border-zinc-700"
                />
                <Edit
                  size={16}
                  className="pointer-events-none absolute -right-6 text-zinc-400 opacity-0 transition-opacity group-hover/title:opacity-100"
                />
              </div>
              <div className="mb-6 flex gap-2 text-sm text-zinc-500">
                <span>{selectedIcon.category}</span>
                <span>·</span>
                <span>{selectedIcon.tags.join(', ')}</span>
              </div>

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
              <span>相对换算描边: strokeWidth={actualStrokeWidth}</span>
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
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
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
                <p className="mt-1 text-center text-sm text-zinc-500">输入名称直接生成，或上传参考图提取匹配风格。</p>
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
                  <div className="flex w-full flex-col items-center">
                    <img src={uploadedImage} alt="Uploaded" className="mb-3 h-16 w-16 object-contain drop-shadow-md" />
                    <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                      已选择参考图标，点击或拖拽更换
                    </span>
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
                      <Wand2 size={18} /> 开始生成
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Toast message={toastMsg} visible={toastVisible} />
    </div>
  );
}
