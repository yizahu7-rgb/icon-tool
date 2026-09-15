import React from 'react';
import {
  iconfontCalibratedIconNames,
  iconfontCalibratedIconOpticalScales,
  iconfontCalibratedIconProfiles,
  iconfontCuratedIconData
} from './iconfont-curated-icons';
import { fsIconNodes } from './fs-icon-nodes.generated';
import { createMasterGoIcon } from './fs-node-icon';
import { fsParametricIcons, type FsParametricIconProps } from './fs-parametric-icons';
import { createIconfontSourceIcon } from './iconfont-source-icon';
import {
  iconfontSolidIconNames,
  iconfontSourceIconData,
  type IconfontSourceIconData
} from './iconfont-source-icons.generated';

type Category = 'UI & Nav' | 'Communication' | 'Media' | 'Commerce' | 'Social' | 'Weather' | 'Dev' | 'Misc';
type LucideIconName = keyof typeof fsIconNodes;

type IconSvgProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
  strokeWidth?: number | string;
  cornerRadius?: number;
};

type IconSpec = readonly [name: string, icon: LucideIconName];

interface IconGroup {
  category: Category;
  items: readonly IconSpec[];
}

const groups: readonly IconGroup[] = [
  {
    category: 'UI & Nav',
    items: [
      ['全屏', 'Maximize'], ['减-2', 'CircleMinus'], ['下载', 'Download'], ['清空', 'Eraser'],
      ['指南针', 'Compass'], ['眼睛-不可见', 'EyeOff'], ['加-2', 'CirclePlus'], ['拖拽-竖', 'GripVertical'],
      ['提示', 'Info'], ['帮助', 'CircleQuestionMark'], ['筛选', 'ListFilter'], ['交通-飞机', 'Plane'],
      ['云-上传', 'CloudUpload'], ['筛选-填充', 'ListFilterPlus'], ['放大', 'ZoomIn'], ['变大', 'Expand'],
      ['主页', 'House'], ['交通-公交', 'BusFront'], ['分隔符-斜杠', 'Slash'], ['企业', 'Building2'],
      ['时间日期', 'CalendarClock'], ['路线', 'Route'], ['时间日期-秒表', 'Timer'], ['点-小', 'Dot'],
      ['银行', 'Landmark'], ['变小', 'Shrink'], ['云-失败', 'CloudOff'], ['分隔符-箭头', 'MoveRight'],
      ['侧边-收起', 'PanelLeftClose'], ['历史记录', 'History'], ['调色盘', 'Palette'], ['云', 'Cloud'],
      ['回到顶部', 'ArrowUpToLine'], ['加-3', 'SquarePlus'], ['通用', 'Shapes'], ['定位', 'MapPin'],
      ['旋转', 'RotateCw'], ['导出', 'Share2'], ['保存', 'Save'], ['发送-填充', 'SendHorizontal'],
      ['通知', 'Bell'], ['拖拽-横', 'GripHorizontal'], ['地图', 'Map'], ['搜索', 'Search'],
      ['反馈-成功', 'CircleCheck'], ['减-3', 'SquareMinus'], ['下午茶', 'Coffee'], ['减', 'Minus'],
      ['设置', 'Settings'], ['删除', 'Trash2'], ['眼睛-可见', 'Eye'], ['反馈-警告', 'TriangleAlert'],
      ['关闭', 'X'], ['收藏', 'Star'], ['点-大', 'Circle'], ['上传', 'Upload'],
      ['锁', 'LockKeyhole'], ['侧边-展开', 'PanelLeftOpen'], ['时间日期-时间', 'Clock3'], ['反馈-错误', 'CircleX'],
      ['加', 'Plus'], ['瀑布流', 'Columns3'], ['闪电', 'Zap'], ['刷新', 'RefreshCw'],
      ['缩小', 'ZoomOut'], ['时间日期-日期', 'CalendarDays'], ['收藏-已收藏', 'Star'], ['美化', 'WandSparkles'],
      ['云-下载', 'CloudDownload'], ['交通-出租车', 'CarTaxiFront'], ['开关', 'ToggleLeft'], ['工具箱', 'BriefcaseBusiness'],
      ['全屏-退出', 'Minimize'], ['交通-高铁', 'TrainFront'], ['标签', 'Tag'], ['勾', 'Check'],
      ['医疗箱', 'BriefcaseMedical'], ['发送', 'Send'],
      ['单箭头-上', 'ChevronUp'], ['单箭头-下', 'ChevronDown'], ['单箭头-左', 'ChevronLeft'],
      ['三角-右', 'TriangleRight'], ['三角-下', 'ChevronDown'], ['三角-上', 'Triangle'],
      ['单箭头-右', 'ChevronRight'], ['三角-左', 'ChevronLeft'], ['上箭头', 'ArrowUp'],
      ['双箭头-右', 'ChevronsRight'], ['双箭头-左', 'ChevronsLeft'], ['双箭头-下', 'ChevronsDown'],
      ['右箭头', 'ArrowRight'], ['双箭头-上', 'ChevronsUp'], ['左箭头', 'ArrowLeft'], ['下箭头', 'ArrowDown']
    ]
  },
  {
    category: 'Misc',
    items: [
      ['对比', 'Columns2'], ['编辑', 'Pencil'], ['对齐-底', 'AlignEndHorizontal'], ['等比缩放', 'Scaling'],
      ['对齐-左', 'AlignStartVertical'], ['表格', 'Table2'], ['对齐-垂直居中', 'AlignCenterHorizontal'],
      ['对齐-右', 'AlignEndVertical'], ['分界线', 'SeparatorHorizontal'], ['清除', 'Eraser'], ['附件', 'Paperclip'],
      ['撤销', 'Undo2'], ['复制', 'Copy'], ['间距-垂直分布', 'AlignVerticalDistributeCenter'],
      ['对齐-水平居中', 'AlignCenterVertical'], ['文字加粗', 'Bold'], ['排序-降序', 'ArrowDownWideNarrow'],
      ['文字居右', 'TextAlignEnd'], ['间距-水平分布', 'AlignHorizontalDistributeCenter'], ['截图', 'ScanLine'],
      ['语言-中文', 'Languages'], ['排序-升序', 'ArrowUpNarrowWide'], ['文字居中', 'TextAlignCenter'], ['链接', 'Link2'],
      ['文字删除线', 'Strikethrough'], ['文字缩进减少', 'ListIndentDecrease'], ['文字缩进增加', 'ListIndentIncrease'],
      ['文字下标', 'Subscript'], ['文字列表', 'List'], ['文字无序', 'ListTree'], ['文字下划线', 'Underline'],
      ['剪切板', 'Clipboard'], ['文字两端对齐', 'TextAlignJustify'], ['文字背景色', 'PaintBucket'],
      ['语言-翻译', 'Languages'], ['语言-英文', 'Languages'], ['文字倾斜', 'Italic'], ['文字颜色', 'Baseline'],
      ['自动行高', 'MoveVertical'], ['文字有序', 'ListOrdered'], ['重做', 'Redo2'], ['自动列宽', 'MoveHorizontal'],
      ['文字上标', 'Superscript'], ['文字识别', 'ScanText'], ['文字居左', 'TextAlignStart'], ['emoji', 'Smile'],
      ['引用', 'Quote']
    ]
  },
  {
    category: 'Social',
    items: [
      ['人员-信息', 'UserRoundSearch'], ['消息', 'MessageSquare'], ['排行榜', 'Trophy'], ['组织管理', 'Network'],
      ['点赞', 'ThumbsUp'], ['用户画像', 'ContactRound'], ['群组', 'UsersRound'], ['公告', 'Megaphone'],
      ['服务', 'Headset'], ['皇冠', 'Crown'], ['护照', 'BookUser'], ['邮件', 'Mail'], ['用户', 'UserRound'],
      ['VIP', 'Gem'], ['聊天记录', 'MessagesSquare'], ['邮件-下载', 'MailCheck'], ['邮件-已读', 'MailOpen'],
      ['消息-已发送', 'SendHorizontal'], ['人员-加', 'UserRoundPlus'], ['人员-删除', 'UserRoundX'],
      ['人员-减', 'UserRoundMinus'], ['点赞-填充', 'ThumbsUp'], ['消息-添加', 'MessageSquarePlus'],
      ['礼物', 'Gift'], ['身份证', 'BadgeCheck'], ['评论', 'MessageCircle'], ['话题', 'Hash'], ['协同', 'Handshake']
    ]
  },
  {
    category: 'Commerce',
    items: [
      ['卡包', 'WalletCards'], ['密码箱-打开', 'Vault'], ['钥匙', 'KeyRound'], ['购物车', 'ShoppingCart'],
      ['银行卡', 'CreditCard'], ['微信支付', 'SmartphoneNfc'], ['钱包', 'Wallet'], ['二维码', 'QrCode'],
      ['计算', 'Calculator'], ['扫描', 'ScanLine'], ['指纹', 'FingerprintPattern'], ['转入', 'LogIn'], ['条形码', 'Barcode'],
      ['盾-危害', 'ShieldX'], ['警报', 'Siren'], ['转出', 'LogOut'], ['票', 'Ticket'], ['插卡', 'CreditCard'],
      ['盾-疑问', 'ShieldQuestionMark'], ['红包', 'WalletMinimal'], ['盾-安全', 'ShieldCheck'], ['密码箱-关闭', 'LockKeyhole'],
      ['支付码', 'ScanQrCode'], ['盾-警告', 'ShieldAlert'], ['盾-财产安全', 'ShieldCheck'], ['盾-提示', 'ShieldPlus'],
      ['支付宝支付', 'CircleDollarSign'], ['认证', 'BadgeCheck'], ['理财', 'ChartNoAxesCombined'],
      ['理财产品', 'PackageOpen'], ['金融日期', 'CalendarRange'], ['充值', 'BadgeDollarSign'], ['兑换', 'Repeat2'],
      ['卖出', 'TrendingDown'], ['买入', 'TrendingUp'], ['金币', 'Coins'], ['基金', 'ChartPie'], ['自选', 'Star'],
      ['数据转换', 'Replace'], ['金融循环', 'RefreshCcw'], ['k线图', 'ChartCandlestick'], ['黄金', 'Gem']
    ]
  },
  {
    category: 'Media',
    items: [
      ['图片', 'Image'], ['播放', 'Play'], ['WiFi', 'Wifi'], ['图片-加载失败', 'ImageOff'], ['耳机', 'Headphones'],
      ['显示器', 'Monitor'], ['相机', 'Camera'], ['录音', 'Mic'], ['路由器', 'Router'], ['电话', 'Phone'],
      ['WIFI-未连接', 'WifiOff'], ['暂停', 'Pause'], ['视频通话', 'Video'], ['USB', 'Usb'], ['相机-禁用', 'CameraOff'],
      ['音量-关闭', 'VolumeX'], ['图片-添加', 'ImagePlus'], ['音量-大', 'Volume2'], ['收音机', 'Radio'],
      ['打印机', 'Printer'], ['音量-小', 'Volume1'], ['蓝牙', 'Bluetooth'], ['设备', 'Cpu'], ['录音-关闭', 'MicOff'],
      ['视频文件', 'FileVideoCamera'], ['终端', 'Terminal']
    ]
  },
  {
    category: 'Dev',
    items: [
      ['环形图', 'ChartPie'], ['最小值', 'ArrowDownToLine'], ['折线图', 'ChartNoAxesCombined'], ['面积图', 'ChartArea'],
      ['数据显示', 'Gauge'], ['饼状图', 'ChartPie'], ['雷达图', 'Radar'], ['平均值', 'Sigma'], ['最大值', 'ArrowUpToLine'],
      ['调试', 'Bug'], ['智能AI', 'Bot'], ['数据-错误', 'DatabaseZap'], ['条形图', 'ChartNoAxesColumn'],
      ['散点图', 'ChartScatter'], ['代码', 'Code'], ['数据-节点', 'GitBranch'], ['数据-切换', 'ArrowLeftRight'],
      ['数据-下载', 'DatabaseBackup'], ['数据库', 'Database'], ['数据-锁定', 'DatabaseZap']
    ]
  },
  {
    category: 'UI & Nav',
    items: [
      ['精确准确', 'Crosshair'], ['快速高效', 'Rocket'], ['开放', 'Orbit'], ['灵活扩展', 'Puzzle'],
      ['流转', 'Repeat2'], ['应用场景', 'LayoutDashboard']
    ]
  },
  {
    category: 'Misc',
    items: [
      ['版权', 'Copyright'], ['处方', 'ClipboardPlus'], ['查验', 'ScanSearch'], ['接口配置', 'SlidersHorizontal'],
      ['管理', 'Settings2'], ['印章认证', 'Stamp'], ['文档', 'FileText'], ['证照执照', 'BookOpenCheck']
    ]
  },
  {
    category: 'Social',
    items: [
      ['安全隐私', 'ShieldCheck'], ['公益', 'HeartHandshake'], ['身份认证', 'BadgeCheck'],
      ['身份识别认证', 'ScanFace'], ['隐私保护', 'ShieldCheck'], ['真实可信', 'BadgeCheck'],
      ['政府', 'Building2'], ['邮件邮箱', 'Mail']
    ]
  },
  {
    category: 'Commerce',
    items: [
      ['仓储仓库', 'Warehouse'], ['发票', 'ReceiptText'], ['订单', 'ClipboardList'], ['工厂', 'Factory'],
      ['合同', 'FileSignature'], ['海关港口', 'Anchor'], ['降本', 'BadgeDollarSign'],
      ['卖家购物车', 'ShoppingCart'], ['卖家店铺', 'Store'], ['票据', 'Receipt'], ['全领域规模', 'Globe2'],
      ['欧元', 'BadgeEuro'], ['美元', 'BadgeDollarSign'], ['人民币', 'Banknote'], ['扫码', 'ScanQrCode'],
      ['融资资金', 'HandCoins'], ['全球跨境', 'Earth'], ['商业化全球', 'BriefcaseBusiness'],
      ['信用卡银行卡', 'CreditCard'], ['物流', 'Truck'], ['医疗服务', 'HeartPulse'], ['医疗机构', 'Hospital']
    ]
  },
  {
    category: 'Dev',
    items: [
      ['底层架构', 'Layers3'], ['饼图图表', 'ChartPie'], ['分布式', 'Boxes'], ['存储', 'Save'],
      ['服务器', 'Server'], ['分支', 'GitFork'], ['丰富多元', 'Waypoints'], ['哈希', 'Hash'],
      ['技术服务', 'SquareCode'], ['监管风控', 'ShieldEllipsis'], ['联盟链', 'Network'], ['区块', 'Box'],
      ['平台', 'PanelsTopLeft'], ['上云', 'CloudUpload'], ['时间周期', 'RefreshCw'], ['时间戳', 'Clock3'],
      ['数字化', 'Binary'], ['图表柱图', 'ChartNoAxesColumn'], ['溯源', 'Route'], ['稳定可靠', 'ShieldCheck'],
      ['网络', 'Network'], ['音乐', 'Music2'], ['性能计算', 'Gauge'], ['数据监管', 'DatabaseBackup'],
      ['远程穿透', 'RadioTower'], ['智能合约', 'FileCode2']
    ]
  }
];

const createFsIcon = (iconName: LucideIconName, displayName: string, semanticName: string) => {
  const curatedData = (iconfontCuratedIconData as Record<string, IconfontSourceIconData>)[semanticName];
  const ParametricIcon = fsParametricIcons[semanticName];
  const sourceData = (iconfontSourceIconData as Record<string, IconfontSourceIconData>)[semanticName];
  if (curatedData) return createIconfontSourceIcon(
    curatedData,
    `Fs${displayName}`,
    iconfontCalibratedIconNames.has(semanticName),
    iconfontCalibratedIconProfiles[semanticName as keyof typeof iconfontCalibratedIconProfiles],
    iconfontCalibratedIconOpticalScales[semanticName as keyof typeof iconfontCalibratedIconOpticalScales] ?? 1
  );
  if (ParametricIcon) {
    const SourceBoundParametricIcon = (props: IconSvgProps) => React.createElement(ParametricIcon, {
      ...props,
      'data-iconfont-collection': sourceData?.collectionId,
      'data-iconfont-source-id': sourceData?.sourceId
    } as FsParametricIconProps);
    SourceBoundParametricIcon.displayName = `Fs${displayName}`;
    return SourceBoundParametricIcon;
  }

  if (sourceData) return createIconfontSourceIcon(sourceData, `Fs${displayName}`);

  return createMasterGoIcon(fsIconNodes[iconName], `Fs${displayName}`) as React.ElementType<IconSvgProps>;
};

export const fsBaseIcons = groups.flatMap((group, groupIndex) =>
  group.items.filter(([name]) => !iconfontSolidIconNames.has(name)).map(([name, iconName], itemIndex) => ({
    id: `fs-base-${String(groupIndex + 1).padStart(2, '0')}-${String(itemIndex + 1).padStart(3, '0')}`,
    name,
    category: group.category,
    tags: [name, ...name.toLowerCase().split(/[-\s]+/), iconName.toLowerCase(), 'fs', '32px', '基础图标'],
    component: createFsIcon(iconName, `${groupIndex + 1}${itemIndex + 1}`, name)
  }))
);
