import type { IconfontSourceIconData } from './iconfont-source-icons.generated';
import type { IconKeylineProfile } from './icon-grid';

const shieldFramePath = 'M12 2.28 L20.44 4.05 V13.28 C20.44 15.54 19.73 16.82 18.14 18.09 L12 21.54 L5.68 18.1 C4.13 16.94 3.37 15.46 3.37 13.27 V4.04 Z';

/**
 * Source-faithful centreline redraws.
 *
 * This file is intentionally hand-maintained. Entries here take precedence over
 * the old medial-axis draft. A name may be added only after its source SVG has
 * been inspected and its topology has been rebuilt as one editable path object.
 */
export const iconfontCuratedIconData = {
  全屏: {
    collectionId: 54209,
    sourceId: '47901518',
    paths: [
      'M9 4 H4 V9 M15 4 H20 V9 M4 15 V20 H9 M20 15 V20 H15'
    ],
    dots: []
  },
  '减-2': {
    collectionId: 54209,
    sourceId: '47901519',
    paths: [
      'M4 4 H20 V20 H4 Z M7 12 H17'
    ],
    dots: []
  },
  清空: {
    collectionId: 54209,
    sourceId: '47901521',
    paths: [
      'M20.1 12 A8.1 8.1 0 1 1 3.9 12 A8.1 8.1 0 1 1 20.1 12 Z M9.4545 9.4545 L14.5455 14.5455 M14.5455 9.4545 L9.4545 14.5455'
    ],
    dots: []
  },
  '眼睛-不可见': {
    collectionId: 54209,
    sourceId: '47901523',
    paths: [
      'M2.5 12 C4.25 7.65 7.75 5.25 12 5.25 C16.25 5.25 19.75 7.65 21.5 12 C19.75 16.35 16.25 18.75 12 18.75 C7.75 18.75 4.25 16.35 2.5 12 Z M15.75 12 A3.75 3.75 0 1 1 8.25 12 A3.75 3.75 0 1 1 15.75 12 Z M3.408 3.197 L21.229 21.016'
    ],
    dots: []
  },
  '加-2': {
    collectionId: 54209,
    sourceId: '47901524',
    paths: [
      'M4 4 H20 V20 H4 Z M12 7 V17 M7 12 H17'
    ],
    dots: []
  },
  '拖拽-竖': {
    collectionId: 54209,
    sourceId: '47901525',
    paths: [],
    dots: [
      { x: 8.5, y: 5.5 },
      { x: 15.5, y: 5.5 },
      { x: 8.5, y: 12 },
      { x: 15.5, y: 12 },
      { x: 8.5, y: 18.5 },
      { x: 15.5, y: 18.5 }
    ]
  },
  提示: {
    collectionId: 54209,
    sourceId: '47901526',
    paths: [
      'M21 12 A9 9 0 1 1 3 12 A9 9 0 1 1 21 12 Z M12.25 11 V16 M11.5 16 H13'
    ],
    dots: [{ x: 12, y: 7.75 }]
  },
  帮助: {
    collectionId: 54209,
    sourceId: '47901527',
    paths: [
      'M21 12 A9 9 0 1 1 3 12 A9 9 0 1 1 21 12 Z M8.565 9.3135 C9.2 7.45 10.55 6.5 12.25 6.5 C14.45 6.5 15.75 7.85 15.75 9.6 C15.75 11.55 12 12.1 12 13.25'
    ],
    dots: [{ x: 12, y: 16 }]
  },
  筛选: {
    collectionId: 54209,
    sourceId: '47901528',
    paths: [
      'M4 4 H20 L14 13 V19 L10 21 V13 Z'
    ],
    dots: []
  },
  '交通-飞机': {
    collectionId: 54209,
    sourceId: '47901529',
    paths: [
      'M12 2.135 C10.95 2.45 10.25 4.05 10.25 6.1 V8.35 L2.63 14.35 V17.31 L10.5 14.67 V18 L8.99 21.35 L12 21.23 L15.05 21.37 L13.5 18 V14.67 L21.37 17.31 V14.35 L13.75 8.35 V6.1 C13.75 4.05 13.05 2.45 12 2.135 Z'
    ],
    dots: []
  },
  放大: {
    collectionId: 54209,
    sourceId: '47901532',
    paths: [
      'M19.25 11.25 A8 8 0 1 1 3.25 11.25 A8 8 0 1 1 19.25 11.25 Z M16.91 16.91 L21.86 21.86 M11.25 7.25 V15.25 M7.25 11.25 H15.25'
    ],
    dots: []
  },
  变大: {
    collectionId: 54209,
    sourceId: '47901533',
    paths: [
      'M15.2 8.8 L20.16 3.84 M15.16 3 H21 V8.84 M8.8 15.2 L3.84 20.16 M3 15.16 V21 H8.84'
    ],
    dots: []
  },
  '交通-公交': {
    collectionId: 54209,
    sourceId: '47901535',
    paths: [
      'M3.5 3 H20.5 V19 H3.5 Z M2 9 H3.5 M20.5 9 H22 M3.5 12 H20.5 M9 6 H15 M3.5 19 V21 M20.5 19 V21'
    ],
    dots: [
      { x: 7.5, y: 15.5 },
      { x: 16.5, y: 15.5 }
    ]
  },
  '分隔符-斜杠': {
    collectionId: 54209,
    sourceId: '47901536',
    paths: ['M10.02 19.91 L13.98 4.09'],
    dots: []
  },
  企业: {
    collectionId: 54209,
    sourceId: '47901537',
    paths: [
      'M3 21 V3 H15 V21 M15 10 H21 V21 M1.5 21 H22.5 M8 8 H10 M8 12 H10'
    ],
    dots: []
  },
  时间日期: {
    collectionId: 54209,
    sourceId: '47901538',
    paths: [
      'M8 3 V7 M16 3 V7 M3 5 H21 V11 H3 M3 5 V21 H12.5 M17.25 14 V18.66 L20.5 21'
    ],
    dots: []
  },
  路线: {
    collectionId: 54209,
    sourceId: '47901539',
    paths: [
      'M4 20 V7.5 C4 5 5.8 3 8 3 C10.2 3 12 4.8 12 7 V16.5 C12 18.45 13.55 20 15.5 20 H16 C18.2 20 20 18.2 20 16 V10 M1 16 L4 20 L7 16'
    ],
    dots: [{ x: 20, y: 6.5 }]
  },
  '时间日期-秒表': {
    collectionId: 54209,
    sourceId: '47901540',
    paths: [
      'M20 13.5 A8 8 0 1 1 4 13.5 A8 8 0 1 1 20 13.5 Z M8.44 2.5 H15.56 M17.4 6.7 L19.3 4.8 M12 9.5 V13.5'
    ],
    dots: []
  },
  银行: {
    collectionId: 54209,
    sourceId: '47901542',
    paths: [
      'M3 8.19 L12 3.69 L21 8.19 V9.19 H3 Z M5 13.27 V17.69 M9.667 13.27 V17.69 M14.333 13.27 V17.69 M19 13.27 V17.69 M3 21.69 H21'
    ],
    dots: []
  },
  '分隔符-箭头': {
    collectionId: 54209,
    sourceId: '47901545',
    paths: ['M7 3 L17 12 L7 21'],
    dots: []
  },
  '侧边-收起': {
    collectionId: 54209,
    sourceId: '47901546',
    paths: [
      'M3 5.25 H21 M3 9.75 H14 M3 14.25 H14 M3 18.75 H21 M16 12 L21 9 V15 Z'
    ],
    dots: []
  },
  历史记录: {
    collectionId: 54209,
    sourceId: '47901547',
    paths: [
      'M4.206 16.5 A9 9 0 1 0 5.636 5.636 M1.964 5.636 L3.8 8.5 L5.636 5.636 M12 7.4 V12.3 L14.8 14.8'
    ],
    dots: []
  },
  回到顶部: {
    collectionId: 54209,
    sourceId: '47901550',
    paths: ['M6 3.25 H18 M12 21 V7 M6.9 12.9 L12 7 L17.1 12.9'],
    dots: []
  },
  '加-3': {
    collectionId: 54209,
    sourceId: '47901551',
    paths: [
      'M21 12 A9 9 0 1 1 3 12 A9 9 0 1 1 21 12 Z M12 7 V17 M7 12 H17'
    ],
    dots: []
  },
  通用: {
    collectionId: 54209,
    sourceId: '47901552',
    paths: [
      'M3 3 H10 V10 H3 Z M14 3 H21 V10 H14 Z M3 14 H10 V21 H3 Z M14 14 H21 V21 H14 Z'
    ],
    dots: []
  },
  定位: {
    collectionId: 54209,
    sourceId: '47901553',
    paths: [
      'M12 2.5 C17 2.5 20.8 6.3 20.8 11 C20.8 15.3 17.6 19.7 12 23 C6.4 19.7 3.2 15.3 3.2 11 C3.2 6.3 7 2.5 12 2.5 Z M14.15 10.5 A2.15 2.15 0 1 1 9.85 10.5 A2.15 2.15 0 1 1 14.15 10.5 Z'
    ],
    dots: []
  },
  旋转: {
    collectionId: 54209,
    sourceId: '47901554',
    paths: [
      'M4.206 16.5 A9 9 0 1 0 5.636 5.636 M1.964 5.636 L3.8 8.5 L5.636 5.636 M14 12 A2 2 0 1 1 10 12 A2 2 0 1 1 14 12 Z'
    ],
    dots: []
  },
  导出: {
    collectionId: 54209,
    sourceId: '47901555',
    paths: ['M10 4 H4 V20 H20 V14 M11 13 L20 4 M15 4 H20 V9'],
    dots: []
  },
  保存: {
    collectionId: 54209,
    sourceId: '47901556',
    paths: [
      'M4 3.5 H16.5 L20.5 7 V20.5 H4 Z M8 3.5 V9 H16 V3.5 M8 20.5 V15 H16 V20.5'
    ],
    dots: []
  },
  通知: {
    collectionId: 54209,
    sourceId: '47901558',
    paths: [
      'M3 18 H21 C19.55 17.05 19 15.35 19 13 V10 A7 7 0 0 0 5 10 V13 C5 15.35 4.45 17.05 3 18 Z M9 21 A3 3 0 0 0 15 21'
    ],
    dots: []
  },
  '拖拽-横': {
    collectionId: 54209,
    sourceId: '47901559',
    paths: [],
    dots: [
      { x: 5.5, y: 8.5 },
      { x: 12, y: 8.5 },
      { x: 18.5, y: 8.5 },
      { x: 5.5, y: 15.5 },
      { x: 12, y: 15.5 },
      { x: 18.5, y: 15.5 }
    ]
  },
  地图: {
    collectionId: 54209,
    sourceId: '47901560',
    paths: [
      'M3 6 L9 3.5 L15 6.5 L21 4 V18 L15 20.5 L9 17.5 L3 20 Z M9 3.5 V17.5 M15 6.5 V20.5'
    ],
    dots: []
  },
  搜索: {
    collectionId: 54209,
    sourceId: '47901561',
    paths: [
      'M19 11.5 A7.5 7.5 0 1 1 4 11.5 A7.5 7.5 0 1 1 19 11.5 Z M16.8 16.8 L21.9 21.9'
    ],
    dots: []
  },
  '反馈-成功': {
    collectionId: 54209,
    sourceId: '47901562',
    paths: [
      'M21 12 A9 9 0 1 1 3 12 A9 9 0 1 1 21 12 Z M6.85 12.35 L10.95 16.4 L17.25 9.65'
    ],
    dots: []
  },
  '减-3': {
    collectionId: 54209,
    sourceId: '47901563',
    paths: ['M21 12 A9 9 0 1 1 3 12 A9 9 0 1 1 21 12 Z M7 12 H17'],
    dots: []
  },
  下午茶: {
    collectionId: 54209,
    sourceId: '47901564',
    paths: [
      'M3.5 4 H20 V12 C20 16.5 16.5 19 12 19 H10 C5.5 19 3.5 15.5 3.5 12 Z M20 6 H22 V9 C22 11.5 20.5 13 19.5 13 M2.2 22 H21.8'
    ],
    dots: []
  },
  减: {
    collectionId: 54209,
    sourceId: '47901565',
    paths: ['M4 12 H20'],
    dots: []
  },
  设置: {
    collectionId: 54209,
    sourceId: '47901566',
    paths: [
      'M12 2.5 L20.5 7.5 V16.5 L12 21.5 L3.5 16.5 V7.5 Z M16.25 12 A4.25 4.25 0 1 1 7.75 12 A4.25 4.25 0 1 1 16.25 12 Z'
    ],
    dots: []
  },
  删除: {
    collectionId: 54209,
    sourceId: '47901567',
    paths: [
      'M3 6 H21 M8 6 L9.5 3.5 H14.5 L16 6 M5 8.5 L5.5 21 H18.5 L19 8.5 M9 11 V17 M15 11 V17'
    ],
    dots: []
  },
  '眼睛-可见': {
    collectionId: 54209,
    sourceId: '47901568',
    paths: [
      'M2.5 12 C4.25 7.1 8.05 4.5 12.3 4.5 C16.55 4.5 20.25 7.1 21.5 12 C20.25 16.9 16.55 19.5 12.3 19.5 C8.05 19.5 4.25 16.9 2.5 12 Z M15.8 12 A3.5 3.5 0 1 1 8.8 12 A3.5 3.5 0 1 1 15.8 12 Z'
    ],
    dots: []
  },
  '反馈-警告': {
    collectionId: 54209,
    sourceId: '47901569',
    paths: ['M21 12 A9 9 0 1 1 3 12 A9 9 0 1 1 21 12 Z M12 6.75 V13.5'],
    dots: [{ x: 12, y: 17 }]
  },
  关闭: {
    collectionId: 54209,
    sourceId: '47901570',
    paths: ['M5.63 5.63 L18.37 18.37 M18.37 5.63 L5.63 18.37'],
    dots: []
  },
  收藏: {
    collectionId: 54209,
    sourceId: '47901571',
    paths: [
      'M12 3.25 L14.65 8.63 L20.58 9.49 L16.29 13.67 L17.3 19.58 L12 16.8 L6.7 19.58 L7.71 13.67 L3.42 9.49 L9.35 8.63 Z'
    ],
    dots: []
  },
  上传: {
    collectionId: 54209,
    sourceId: '47901573',
    paths: [
      'M4 15.5 V21 H20 V15.5 M12 17 V4 M7 9 L12 4 L17 9'
    ],
    dots: []
  },
  锁: {
    collectionId: 54209,
    sourceId: '47901574',
    paths: ['M4 11 H20 V21 H4 Z M6 11 V9 A6 6 0 0 1 18 9 V11'],
    dots: []
  },
  '侧边-展开': {
    collectionId: 54209,
    sourceId: '47901575',
    paths: [
      'M3 5.25 H21 M10 9.75 H21 M10 14.25 H21 M3 18.75 H21 M8 12 L3 9 V15 Z'
    ],
    dots: []
  },
  '时间日期-时间': {
    collectionId: 54209,
    sourceId: '47901576',
    paths: ['M21 12 A9 9 0 1 1 3 12 A9 9 0 1 1 21 12 Z M12 7 V12 L15.4 15.4'],
    dots: []
  },
  '反馈-错误': {
    collectionId: 54209,
    sourceId: '47901577',
    paths: [
      'M21 12 A9 9 0 1 1 3 12 A9 9 0 1 1 21 12 Z M8.4 8.4 L15.6 15.6 M15.6 8.4 L8.4 15.6'
    ],
    dots: []
  },
  加: {
    collectionId: 54209,
    sourceId: '47901578',
    paths: ['M12 4 V20 M4 12 H20'],
    dots: []
  },
  瀑布流: {
    collectionId: 54209,
    sourceId: '47901579',
    paths: [
      'M3 3 H10 V7 H3 Z M14 3 H21 V13 H14 Z M3 11 H10 V21 H3 Z M14 17 H21 V21 H14 Z'
    ],
    dots: []
  },
  闪电: {
    collectionId: 54209,
    sourceId: '47901580',
    paths: ['M13.5 2.2 L12.5 10 H19 L10 21.8 L11 14 H4 Z'],
    dots: []
  },
  刷新: {
    collectionId: 54209,
    sourceId: '47901581',
    paths: ['M4.206 16.5 A9 9 0 1 0 5.636 5.636 M1.964 5.636 L3.8 8.5 L5.636 5.636'],
    dots: []
  },
  缩小: {
    collectionId: 54209,
    sourceId: '47901582',
    paths: [
      'M19 11.5 A7.5 7.5 0 1 1 4 11.5 A7.5 7.5 0 1 1 19 11.5 Z M16.8 16.8 L21.9 21.9 M7.25 11.5 H15.25'
    ],
    dots: []
  },
  '时间日期-日期': {
    collectionId: 54209,
    sourceId: '47901583',
    paths: [
      'M8 3 V7 M16 3 V7 M3 5 H21 V21 H3 Z M3 11 H21'
    ],
    dots: []
  },
  美化: {
    collectionId: 54209,
    sourceId: '47901585',
    paths: [
      'M9.5 3.5 L9 8 L4 12.5 L8.5 14.5 L10.5 19 L14 15.5 L18.5 15 L16.5 10.5 L17.5 6 L13 7 Z M7.6 16.4 L3 21'
    ],
    dots: []
  },
  '交通-出租车': {
    collectionId: 54209,
    sourceId: '47901587',
    paths: [
      'M3 10 L6 4 H18 L21 10 V20 H3 Z M3 12 H21 M9 3 H15 M5.5 20 V22 M18.5 20 V22'
    ],
    dots: [
      { x: 7, y: 15.5 },
      { x: 17, y: 15.5 }
    ]
  },
  开关: {
    collectionId: 54209,
    sourceId: '47901588',
    paths: ['M17.5 4.5 A9 9 0 1 1 6.5 4.5 M12 2 V13'],
    dots: []
  },
  工具箱: {
    collectionId: 54209,
    sourceId: '47901589',
    paths: [
      'M3 6 H21 V21 H3 Z M3 13 H21 M8 6 V3 H16 V6 M8 13 V15 M16 13 V15'
    ],
    dots: []
  },
  '全屏-退出': {
    collectionId: 54209,
    sourceId: '47901590',
    paths: ['M15 3 V9 H21 M9 21 V15 H3'],
    dots: []
  },
  '交通-高铁': {
    collectionId: 54209,
    sourceId: '47901591',
    paths: [
      'M3 11 A9 9 0 0 1 21 11 V21 H3 Z M3 11 H21 M9 6 H15 M5 21 V22 M19 21 V22'
    ],
    dots: [
      { x: 7.5, y: 16 },
      { x: 16.5, y: 16 }
    ]
  },
  标签: {
    collectionId: 54209,
    sourceId: '47901592',
    paths: [
      'M3 13 L13.2 2.8 L21.2 3.3 L21.7 11.3 L11.5 21.5 Z M17.4 7.6 A1.6 1.6 0 1 1 14.2 7.6 A1.6 1.6 0 1 1 17.4 7.6 Z'
    ],
    dots: []
  },
  医疗箱: {
    collectionId: 54209,
    sourceId: '47901594',
    paths: [
      'M3 7 H21 V21 H3 Z M8 7 V3 H16 V7 M12 10 V18 M8 14 H16'
    ],
    dots: []
  },
  发送: {
    collectionId: 54209,
    sourceId: '47901595',
    paths: ['M2.5 9 L22 2.5 L16.5 22 L12 13 Z M12 13 L22 2.5'],
    dots: []
  },
  '单箭头-上': {
    collectionId: 54209,
    sourceId: '47901690',
    paths: ['M7.5 14.5 L12 10 L16.5 14.5'],
    dots: []
  },
  '单箭头-下': {
    collectionId: 54209,
    sourceId: '47901691',
    paths: ['M7.5 9.5 L12 14 L16.5 9.5'],
    dots: []
  },
  '单箭头-左': {
    collectionId: 54209,
    sourceId: '47901692',
    paths: ['M14.5 7.5 L10 12 L14.5 16.5'],
    dots: []
  },
  '单箭头-右': {
    collectionId: 54209,
    sourceId: '47901696',
    paths: ['M9.5 7.5 L14 12 L9.5 16.5'],
    dots: []
  },
  上箭头: {
    collectionId: 54209,
    sourceId: '47901698',
    paths: ['M12 21 V5 M6 11 L12 5 L18 11'],
    dots: []
  },
  '双箭头-右': {
    collectionId: 54209,
    sourceId: '47901699',
    paths: ['M5.5 6.5 L11 12 L5.5 17.5 M12.5 6.5 L18 12 L12.5 17.5'],
    dots: []
  },
  '双箭头-左': {
    collectionId: 54209,
    sourceId: '47901700',
    paths: ['M18.5 6.5 L13 12 L18.5 17.5 M11.5 6.5 L6 12 L11.5 17.5'],
    dots: []
  },
  '双箭头-下': {
    collectionId: 54209,
    sourceId: '47901701',
    paths: ['M6.5 5.5 L12 11 L17.5 5.5 M6.5 12.5 L12 18 L17.5 12.5'],
    dots: []
  },
  右箭头: {
    collectionId: 54209,
    sourceId: '47901702',
    paths: ['M3 12 H19 M13 6 L19 12 L13 18'],
    dots: []
  },
  '双箭头-上': {
    collectionId: 54209,
    sourceId: '47901703',
    paths: ['M6.5 18.5 L12 13 L17.5 18.5 M6.5 11.5 L12 6 L17.5 11.5'],
    dots: []
  },
  左箭头: {
    collectionId: 54209,
    sourceId: '47901704',
    paths: ['M21 12 H5 M11 6 L5 12 L11 18'],
    dots: []
  },
  下箭头: {
    collectionId: 54209,
    sourceId: '47901705',
    paths: ['M12 3 V19 M6 13 L12 19 L18 13'],
    dots: []
  },
  对比: {
    collectionId: 54209,
    sourceId: '47901708',
    paths: [
      'M12 2 V22 M3 4 H12 V20 H3 Z M15 4 H21 V8 M21 10 V14 M21 16 V20 H15'
    ],
    dots: []
  },
  编辑: {
    collectionId: 54209,
    sourceId: '47901709',
    paths: ['M3 19 H7 L19 7 L15 3 L3 15 Z M14 4 L18 8 M3 21 H21'],
    dots: []
  },
  '对齐-底': {
    collectionId: 54209,
    sourceId: '47901710',
    paths: ['M9 3 H15 V17 H9 Z M2 21 H22'],
    dots: []
  },
  等比缩放: {
    collectionId: 54209,
    sourceId: '47901711',
    paths: ['M3 3 H21 V21 H3 Z M7 8 V16 M17 8 V16'],
    dots: [
      { x: 12, y: 9.5 },
      { x: 12, y: 14.5 }
    ]
  },
  '对齐-左': {
    collectionId: 54209,
    sourceId: '47901712',
    paths: ['M3 2 V22 M7 9 H21 V15 H7 Z'],
    dots: []
  },
  表格: {
    collectionId: 54209,
    sourceId: '47901713',
    paths: ['M2 3 H22 V21 H2 Z M8.5 3 V21 M15 3 V21 M2 8 H22 M2 14.5 H22'],
    dots: []
  },
  '对齐-垂直居中': {
    collectionId: 54209,
    sourceId: '47901714',
    paths: ['M9 3 H15 V21 H9 Z M2 12 H7 M17 12 H22'],
    dots: []
  },
  '对齐-右': {
    collectionId: 54209,
    sourceId: '47901715',
    paths: ['M21 2 V22 M3 9 H17 V15 H3 Z'],
    dots: []
  },
  分界线: {
    collectionId: 54209,
    sourceId: '47901716',
    paths: [
      'M3 3 V7 H21 V3 M3 21 V17 H21 V21 M2 12 H6 M8 12 H12 M14 12 H18 M20 12 H22'
    ],
    dots: []
  },
  清除: {
    collectionId: 54209,
    sourceId: '47901717',
    paths: ['M4 14 L14 4 L22 12 L14 20 H7 Z M8 10 L16 18 M14 20 H22'],
    dots: []
  },
  附件: {
    collectionId: 54209,
    sourceId: '47901718',
    paths: [
      'M20.5 11.5 L11.42 20.58 C9.27 22.73 5.78 22.73 3.63 20.58 C1.48 18.43 1.48 14.94 3.63 12.79 L12.83 3.59 C14.2 2.22 16.42 2.22 17.79 3.59 C19.16 4.96 19.16 7.18 17.79 8.55 L8.59 17.75 C8 18.34 7.05 18.34 6.46 17.75 C5.87 17.16 5.87 16.21 6.46 15.62 L14.95 7.13'
    ],
    dots: []
  },
  撤销: {
    collectionId: 54209,
    sourceId: '47901719',
    paths: ['M10 4 L5 9 L10 14 M5 9 H13 C17.5 9 20 12.3 20 16 C20 19.5 17 21 13 21 H10'],
    dots: []
  },
  复制: {
    collectionId: 54209,
    sourceId: '47901720',
    paths: ['M3 6 H18 V21 H3 Z M10 3 H21 V14'],
    dots: []
  },
  '间距-垂直分布': {
    collectionId: 54209,
    sourceId: '47901721',
    paths: ['M3 3 H21 M3 9 H21 V15 H3 Z M3 21 H21'],
    dots: []
  },
  '对齐-水平居中': {
    collectionId: 54209,
    sourceId: '47901722',
    paths: ['M3 9 H21 V15 H3 Z M12 2 V7 M12 17 V22'],
    dots: []
  },
  文字加粗: {
    collectionId: 54209,
    sourceId: '47901723',
    paths: ['M6 3 V21 H13 C17 21 19 19 19 16 C19 13.5 17.5 12 15.5 11.5 C17.3 10.8 18 9.2 18 7.5 C18 4.7 16 3 12.5 3 Z M6 11.5 H13'],
    dots: []
  },
  '排序-降序': {
    collectionId: 54209,
    sourceId: '47901724',
    paths: ['M6 3 V21 M2 17 L6 21 L10 17 M12 5 H22 M12 12 H22 M12 19 H22'],
    dots: []
  },
  文字居右: {
    collectionId: 54209,
    sourceId: '47901725',
    paths: ['M3 4 H21 M8 9 H21 M3 14 H21 M8 19 H21'],
    dots: []
  },
  '间距-水平分布': {
    collectionId: 54209,
    sourceId: '47901726',
    paths: ['M3 2 V22 M9 3 H15 V21 H9 Z M21 2 V22'],
    dots: []
  },
  截图: {
    collectionId: 54209,
    sourceId: '47901727',
    paths: [
      'M4 3.24 V17.43 C4 18.81 5.08 19.92 6.34 19.92 H20.78 M2.52 5.5 H16.09 C17.42 5.5 18.5 6.58 18.5 7.92 V21.54 M4.68 19.08 L20.46 3.59'
    ],
    dots: []
  },
  '语言-中文': {
    collectionId: 54209,
    sourceId: '47901728',
    paths: ['M3 3 H21 V21 H3 Z M8 9 H16 V15 H8 Z M12 6.5 V17.5'],
    dots: []
  },
  '排序-升序': {
    collectionId: 54209,
    sourceId: '47901729',
    paths: ['M6 21 V3 M2 7 L6 3 L10 7 M12 5 H22 M12 12 H22 M12 19 H22'],
    dots: []
  },
  文字居中: {
    collectionId: 54209,
    sourceId: '47901730',
    paths: ['M3 4 H21 M5 9 H19 M3 14 H21 M5 19 H19'],
    dots: []
  },
  链接: {
    collectionId: 54209,
    sourceId: '47901731',
    paths: [
      'M10 13 C11.95 14.95 15.05 14.95 17 13 L20 10 C21.95 8.05 21.95 4.95 20 3 C18.05 1.05 14.95 1.05 13 3 L11.25 4.75 M14 11 C12.05 9.05 8.95 9.05 7 11 L4 14 C2.05 15.95 2.05 19.05 4 21 C5.95 22.95 9.05 22.95 11 21 L12.75 19.25'
    ],
    dots: []
  },
  文字删除线: {
    collectionId: 54209,
    sourceId: '47901732',
    paths: ['M19 6 C17.5 4 15 3 12 3 C8.5 3 6 4.8 6 7.2 C6 9.5 8 10.7 12 12 M5 12 H21 M12 12 C16 13.3 18 14.5 18 17 C18 19.5 15.5 21 12 21 C8.8 21 6.2 20 4.5 18'],
    dots: []
  },
  文字缩进减少: {
    collectionId: 54209,
    sourceId: '47901733',
    paths: ['M3 4 H21 M10 9 H21 M10 14 H21 M3 19 H21 M8 8 L4 12 L8 16'],
    dots: []
  },
  文字缩进增加: {
    collectionId: 54209,
    sourceId: '47901734',
    paths: ['M3 4 H21 M10 9 H21 M10 14 H21 M3 19 H21 M4 8 L8 12 L4 16'],
    dots: []
  },
  文字下标: {
    collectionId: 54209,
    sourceId: '47901735',
    paths: ['M4 4 L13 16 M13 4 L4 16 M15.5 16 C16 14.5 17 14 18.5 14 C20 14 21 14.8 21 16 C21 17.2 20 18 17 20.5 H21'],
    dots: []
  },
  文字列表: {
    collectionId: 54209,
    sourceId: '47901736',
    paths: ['M2 5 L4 7 L7 4 M10 6 H22 M2 12 L4 14 L7 11 M10 13 H22 M2 19 L4 21 L7 18 M10 20 H22'],
    dots: []
  },
  文字无序: {
    collectionId: 54209,
    sourceId: '47901737',
    paths: ['M8 6 H22 M8 12 H22 M8 18 H22'],
    dots: [
      { x: 4, y: 6 },
      { x: 4, y: 12 },
      { x: 4, y: 18 }
    ]
  },
  文字下划线: {
    collectionId: 54209,
    sourceId: '47901738',
    paths: ['M5 3 V11 C5 15 7.5 17 12 17 C16.5 17 19 15 19 11 V3 M4 21 H20'],
    dots: []
  },
  剪切板: {
    collectionId: 54209,
    sourceId: '47901739',
    paths: ['M5 5 H3 V22 H21 V5 H19 M7 3 H17 V7 H7 Z'],
    dots: []
  },
  文字两端对齐: {
    collectionId: 54209,
    sourceId: '47901740',
    paths: ['M3 4 H21 M3 9 H21 M3 14 H21 M3 19 H21'],
    dots: []
  },
  文字背景色: {
    collectionId: 54209,
    sourceId: '47901741',
    paths: ['M10 3 L19 12 L11 20 L2 11 Z M6 7 L15 16 M18 19 C18 17.5 19.5 15.5 21 14 C22.5 15.5 24 17.5 24 19 C24 20.7 22.7 22 21 22 C19.3 22 18 20.7 18 19'],
    dots: []
  },
  '语言-翻译': {
    collectionId: 54209,
    sourceId: '47901742',
    paths: [
      'M5 5 A9 9 0 0 1 20 8 M19 4 L20 8 L16 8 M19 19 A9 9 0 0 1 4 16 M5 20 L4 16 L8 16 M8 17 L12 7 L16 17 M9.7 13 H14.3'
    ],
    dots: []
  },
  '语言-英文': {
    collectionId: 54209,
    sourceId: '47901743',
    paths: [
      'M3 3 H21 V21 H3 Z M7.4 8 H11.2 M7.4 12.25 H10.8 M7.4 16.5 H11.2 M7.4 8 V16.5 M12.4 16.5 V10.7 M12.4 13 C12.4 11.6 13.3 10.7 14.6 10.7 C16 10.7 16.6 11.6 16.6 13 V16.5'
    ],
    dots: []
  },
  文字倾斜: {
    collectionId: 54209,
    sourceId: '47901744',
    paths: ['M10 3 H18 M6 21 H14 M14 3 L10 21'],
    dots: []
  },
  文字颜色: {
    collectionId: 54209,
    sourceId: '47901745',
    paths: ['M5 17 L12 3 L19 17 M8 12 H16 M3 21 H21'],
    dots: []
  },
  自动行高: {
    collectionId: 54209,
    sourceId: '47901746',
    paths: ['M3 3 H21 M3 21 H21 M6 17 L12 6 L18 17 M8.5 13 H15.5'],
    dots: []
  },
  文字有序: {
    collectionId: 54209,
    sourceId: '47901747',
    paths: ['M9 6 H22 M9 12 H22 M9 18 H22 M3 4 V8 M2 4 H4 M2 11 C3 10 5 10 5 11.5 C5 12.5 4 13 2 15 H5 M2 18 H5 L3 20 L5 22 H2'],
    dots: []
  },
  重做: {
    collectionId: 54209,
    sourceId: '47901748',
    paths: ['M14 4 L19 9 L14 14 M19 9 H11 C6.5 9 4 12.3 4 16 C4 19.5 7 21 11 21 H14'],
    dots: []
  },
  自动列宽: {
    collectionId: 54209,
    sourceId: '47901749',
    paths: ['M3 2 V22 M21 2 V22 M6 18 L12 5 L18 18 M8.5 13 H15.5'],
    dots: []
  },
  文字上标: {
    collectionId: 54209,
    sourceId: '47901750',
    paths: ['M4 8 L13 20 M13 8 L4 20 M15.5 4 C16 2.5 17 2 18.5 2 C20 2 21 2.8 21 4 C21 5.2 20 6 17 8.5 H21'],
    dots: []
  },
  文字识别: {
    collectionId: 54209,
    sourceId: '47901751',
    paths: ['M8 3 H3 V8 M16 3 H21 V8 M3 16 V21 H8 M21 16 V21 H16 M8 7 H16 M12 7 V18'],
    dots: []
  },
  文字居左: {
    collectionId: 54209,
    sourceId: '47901752',
    paths: ['M3 4 H21 M3 9 H16 M3 14 H21 M3 19 H16'],
    dots: []
  },
  emoji: {
    collectionId: 54209,
    sourceId: '47901753',
    paths: ['M21 12 A9 9 0 1 1 3 12 A9 9 0 1 1 21 12 Z M7.5 14 C8.5 17 10 18 12 18 C14 18 15.5 17 16.5 14'],
    dots: [
      { x: 8.5, y: 9 },
      { x: 15.5, y: 9 }
    ]
  },
  '人员-信息': {
    collectionId: 54209,
    sourceId: '47901755',
    paths: [
      'M12 3.2 C14 3.2 15.5 4.8 15.5 6.7 V9.6 C15.5 11.6 14 13.1 12 13.1 C10 13.1 8.5 11.6 8.5 9.6 V6.7 C8.5 4.8 10 3.2 12 3.2 Z M2.8 21 C6.6 17.9 11.6 17.2 16.1 18.1 M19 17.8 V20.5 M17.5 21 H20.5'
    ],
    dots: [{ x: 19, y: 14.6 }]
  },
  消息: {
    collectionId: 54209,
    sourceId: '47901756',
    paths: ['M3 3.5 H21 V17.5 H8.8 L3 22 V17.5 Z'],
    dots: [
      { x: 9, y: 10.5 },
      { x: 15, y: 10.5 }
    ]
  },
  排行榜: {
    collectionId: 54209,
    sourceId: '47901757',
    paths: [
      'M5 3 H19 V9.5 C19 14.5 16 17 12 17 C8 17 5 14.5 5 9.5 Z M2 5 V8 C2 9.2 3 10 5 10 M22 5 V8 C22 9.2 21 10 19 10 M12 17 V21 M7.5 22 H16.5'
    ],
    dots: []
  },
  组织管理: {
    collectionId: 54209,
    sourceId: '47901758',
    paths: ['M9 2 H15 V8 H9 Z M2 15 H8 V21 H2 Z M16 15 H22 V21 H16 Z M12 8 V12 M5 15 V12 H19 V15'],
    dots: []
  },
  点赞: {
    collectionId: 54209,
    sourceId: '47901759',
    paths: [
      'M12 21 L4.1 13 C0.7 9.6 1.3 4.4 5.7 2.9 C8.1 2.1 10.4 3.3 12 5.1 C13.6 3.3 15.9 2.1 18.3 2.9 C22.7 4.4 23.3 9.6 19.9 13 Z'
    ],
    dots: []
  },
  用户画像: {
    collectionId: 54209,
    sourceId: '47901760',
    paths: [
      'M7 3 H3 V7 M17 3 H21 V7 M3 17 V21 H7 M21 17 V21 H17 M12 7 C13.2 7 14 8 14 9.2 V11.8 C14 13 13.2 14 12 14 C10.8 14 10 13 10 11.8 V9.2 C10 8 10.8 7 12 7 Z M7.5 18.5 C10.5 17.2 13.5 17.2 16.5 18.5'
    ],
    dots: []
  },
  群组: {
    collectionId: 54209,
    sourceId: '47901761',
    paths: [
      'M10.5 3.3 C12.5 3.3 14 4.8 14 6.7 V9.6 C14 11.6 12.5 13.1 10.5 13.1 C8.5 13.1 7 11.6 7 9.6 V6.7 C7 4.8 8.5 3.3 10.5 3.3 Z M14.4 2.2 C16.4 1 18.5 2.7 18.5 5 V8 C18.5 10 17.3 11.5 15.8 12.2 M2 22 C6.5 18.3 14.5 18.3 19 22 M16.5 16 C19 16.8 21 18.3 22 20.5'
    ],
    dots: []
  },
  公告: {
    collectionId: 54209,
    sourceId: '47901762',
    paths: ['M3 7 H21 V20.5 H3 Z M7.5 7 L12 3 L16.5 7 M7 14 H9 M10.5 14 H17.5'],
    dots: []
  },
  服务: {
    collectionId: 54209,
    sourceId: '47901763',
    paths: [
      'M12 21 L4 13 C1.4 10.4 1.4 6.2 4.1 3.7 C6.7 1.3 10 1.8 12 4.2 L9.8 6.4 C8.8 7.4 8.8 8.7 9.8 9.7 C10.8 10.7 12.1 10.7 13.1 9.7 L14.3 8.5 L20 14.2 M12 4.2 C14 1.8 17.3 1.3 19.9 3.7 C22.6 6.2 22.6 10.4 20 13 L12 21'
    ],
    dots: []
  },
  皇冠: {
    collectionId: 54209,
    sourceId: '47901764',
    paths: ['M3 7 L7 12 L12 4 L17 12 L21 7 L19 19 H5 Z M5 16 H19'],
    dots: []
  },
  护照: {
    collectionId: 54209,
    sourceId: '47901765',
    paths: [
      'M3 2 H21 V22 H3 Z M12 7 C13.2 7 14 8 14 9.2 V11.8 C14 13 13.2 14 12 14 C10.8 14 10 13 10 11.8 V9.2 C10 8 10.8 7 12 7 Z M7.5 18 C10.5 16.7 13.5 16.7 16.5 18'
    ],
    dots: []
  },
  邮件: {
    collectionId: 54209,
    sourceId: '47901766',
    paths: ['M3 5 H21 V19 H3 Z M3 6 L12 13 L21 6'],
    dots: []
  },
  用户: {
    collectionId: 54209,
    sourceId: '47901767',
    paths: [
      'M12 3.1 C14.3 3.1 16 4.9 16 7.2 V10.2 C16 12.5 14.3 14.2 12 14.2 C9.7 14.2 8 12.5 8 10.2 V7.2 C8 4.9 9.7 3.1 12 3.1 Z M3.5 21.5 C7.5 17.2 16.5 17.2 20.5 21.5'
    ],
    dots: []
  },
  VIP: {
    collectionId: 54209,
    sourceId: '47901768',
    paths: ['M2 8 L7 3 H17 L22 8 L12 21 Z M8.5 11 L12 15 L15.5 11'],
    dots: []
  },
  聊天记录: {
    collectionId: 54209,
    sourceId: '47901769',
    paths: ['M21 12 V3.5 H3 V22 L7.5 18.5 H14 M18 14.5 V18.5 L21.5 22'],
    dots: [
      { x: 9, y: 10.5 },
      { x: 15, y: 10.5 }
    ]
  },
  '邮件-下载': {
    collectionId: 54209,
    sourceId: '47901770',
    paths: ['M3 5 H21 V12 M3 5 V19 H14 M3 6 L12 12.5 L21 6 M19 13.5 V20.5 M16.5 18 L19 20.5 L21.5 18'],
    dots: []
  },
  '邮件-已读': {
    collectionId: 54209,
    sourceId: '47901771',
    paths: ['M3 8.5 L12 3.2 L21 8.5 V21 H3 Z M3 8.5 L12 14.5 L21 8.5'],
    dots: []
  },
  '消息-已发送': {
    collectionId: 54209,
    sourceId: '47901772',
    paths: ['M3 3.5 H21 V17.5 H8.8 L3 22 Z M7 10 L11 14 L17 7.5'],
    dots: []
  },
  '人员-加': {
    collectionId: 54209,
    sourceId: '47901773',
    paths: [
      'M12 3.2 C14 3.2 15.5 4.8 15.5 6.7 V9.6 C15.5 11.6 14 13.1 12 13.1 C10 13.1 8.5 11.6 8.5 9.6 V6.7 C8.5 4.8 10 3.2 12 3.2 Z M2.8 21 C6.6 17.9 10.6 17.2 13 18.1 M18.5 15 V22 M15 18.5 H22'
    ],
    dots: []
  },
  '人员-删除': {
    collectionId: 54209,
    sourceId: '47901774',
    paths: [
      'M12 3.2 C14 3.2 15.5 4.8 15.5 6.7 V9.6 C15.5 11.6 14 13.1 12 13.1 C10 13.1 8.5 11.6 8.5 9.6 V6.7 C8.5 4.8 10 3.2 12 3.2 Z M2.8 21 C6.6 17.9 10.6 17.2 13 18.1 M16 15.5 L22 21.5 M22 15.5 L16 21.5'
    ],
    dots: []
  },
  '人员-减': {
    collectionId: 54209,
    sourceId: '47901775',
    paths: [
      'M12 3.2 C14 3.2 15.5 4.8 15.5 6.7 V9.6 C15.5 11.6 14 13.1 12 13.1 C10 13.1 8.5 11.6 8.5 9.6 V6.7 C8.5 4.8 10 3.2 12 3.2 Z M2.8 21 C6.6 17.9 10.6 17.2 13 18.1 M15 20 H22'
    ],
    dots: []
  },
  '消息-添加': {
    collectionId: 54209,
    sourceId: '47901777',
    paths: ['M21 12 V3.5 H3 V22 L7.5 18.5 H14 M19 14 V21 M15.5 17.5 H22.5'],
    dots: [
      { x: 9, y: 10.5 },
      { x: 15, y: 10.5 }
    ]
  },
  礼物: {
    collectionId: 54209,
    sourceId: '47901778',
    paths: ['M3 10 H21 V22 H3 Z M2 6 H22 V10 H2 Z M12 6 V22 M12 6 L8.5 2.5 M12 6 L15.5 2.5'],
    dots: []
  },
  身份证: {
    collectionId: 54209,
    sourceId: '47901779',
    paths: [
      'M2 4 H22 V20 H2 Z M8 7.5 C9.2 7.5 10 8.5 10 9.7 V10.7 C10 12 9.2 13 8 13 C6.8 13 6 12 6 10.7 V9.7 C6 8.5 6.8 7.5 8 7.5 Z M4.5 17 C6.5 15.6 9.5 15.6 12 17 M15 10 H19 M15 14 H19'
    ],
    dots: []
  },
  评论: {
    collectionId: 54209,
    sourceId: '47901780',
    paths: ['M18 6 H3 V22 L7.5 19 H18 Z M11 3 H22 V11'],
    dots: [
      { x: 8.2, y: 12 },
      { x: 13, y: 12 }
    ]
  },
  话题: {
    collectionId: 54209,
    sourceId: '47901781',
    paths: ['M3 3.5 H21 V17.5 H8.8 L3 22 Z M10.5 7 L9.2 14 M15.5 7 L14.2 14 M8 9.5 H17 M7.5 12.5 H16.5'],
    dots: []
  },
  卡包: {
    collectionId: 54209,
    sourceId: '47901783',
    paths: ['M3 3.5 H21 V20.5 H3 Z M3 7.5 H21 M3 11 H8 C8.5 14.5 10 16 12 16 C14 16 15.5 14.5 16 11 H21'],
    dots: []
  },
  '密码箱-打开': {
    collectionId: 54209,
    sourceId: '47901784',
    paths: ['M10.5 4 H3 V20 H10.5 M10.5 2 L20.5 4 V19.5 L10.5 21.5 Z M20.5 7 H22 M20.5 17 H22 M15 10 V14 M5 20 V22 M18.5 19.8 V22'],
    dots: []
  },
  钥匙: {
    collectionId: 54209,
    sourceId: '47901785',
    paths: ['M11 16 A5 5 0 1 1 1 16 A5 5 0 1 1 11 16 Z M9.5 12.5 L20.5 1.5 M17.5 4.5 L21 8 M15 7 L18 10'],
    dots: []
  },
  购物车: {
    collectionId: 54209,
    sourceId: '47901786',
    paths: ['M3 3 H5 V16.33 H19.22 L21.71 6 H5'],
    dots: [
      { x: 5.7, y: 20.26 },
      { x: 18.12, y: 20.26 }
    ]
  },
  银行卡: {
    collectionId: 54209,
    sourceId: '47901787',
    paths: ['M2 4 H22 V20 H2 Z M2 10 H22 M15.48 16.27 H18.21'],
    dots: []
  },
  微信支付: {
    collectionId: 54209,
    sourceId: '47901788',
    paths: ['M19.39 7.72 C17.95 5.43 15.2 4 11.9 4 C6.98 4 3 7.48 3 11.84 C3 13.5 3.67 15.08 4.94 16.33 C5.57 17.33 5.8 18.11 5.73 18.93 C5.69 19.45 5.78 19.82 5.96 20.1 C6.66 20.19 7.38 19.7 8.3 19.37 C8.9 19.15 9.52 19.04 10.16 19.06 C10.83 19.14 11.51 19.18 12.21 19.18 C17.08 19.18 20.8 16.05 20.8 12.01 C20.8 10.41 20.31 8.93 19.39 7.72 Z M6.81 10.1 L9.22 12.78 L19.39 7.72'],
    dots: []
  },
  钱包: {
    collectionId: 54209,
    sourceId: '47901789',
    paths: ['M16.25 7.04 C16.75 7.29 16.75 7.29 17.25 7.29 H21.5 V20.71 H2.5 V8.29 L2.76 7.29 H15.25 C15.75 7.29 15.75 7.29 16.25 7.04 M2.76 7.29 C2.71 6.67 2.89 6.26 2.93 6.17 C3.71 4.41 4.5 4.09 5.5 3.67 L6.41 3.29 H16.25 V7.04 M17.58 13 V14.7'],
    dots: []
  },
  二维码: {
    collectionId: 54209,
    sourceId: '47901790',
    paths: ['M3 3 H9 V9 H3 Z M15 3 H21 V9 H15 Z M3 15 H9 V21 H3 Z M15 15 H18 V18 H15 Z M18 18 H21 V21 H18 Z M12 12 H15 V15 H12 Z'],
    dots: []
  },
  计算: {
    collectionId: 54209,
    sourceId: '47901791',
    paths: ['M3.71 20.29 L20.29 3.71 M3.29 6.27 H9.25 M6.27 3.29 V9.25 M14.75 16.71 H20.71 M14.75 20.71 H20.71'],
    dots: []
  },
  扫描: {
    collectionId: 54209,
    sourceId: '47901792',
    paths: ['M7.24 3 H3 V7.24 M16.76 3 H21 V7.24 M3 12 H21 M3 16.75 V21 H7.24 M16.76 21 H21 V16.75'],
    dots: []
  },
  指纹: {
    collectionId: 54209,
    sourceId: '47901793',
    paths: ['M5 10 C5 6 8 3 12 3 C16 3 19 6 19 10 M3 12 C3 6.5 7 2 12 2 C17 2 21 6.5 21 12 M7 12 C7 9 9 7 12 7 C15 7 17 9 17 12 C17 16 16 19 14 22 M11 11 C11 16 10 19 8 21 M20 15 C20 18 19 20 18 22'],
    dots: []
  },
  转入: {
    collectionId: 54209,
    sourceId: '47901794',
    paths: ['M5.05 5.57 V4 H20.86 V20 H5.05 V18.43 M3.14 12 H14 M11.86 9.02 L14 12 L11.85 14.99'],
    dots: []
  },
  条形码: {
    collectionId: 54209,
    sourceId: '47901795',
    paths: ['M3 4 V20 M6.5 3.5 V20.5 M9 4 V20 M12 4 V20 M15 4 V20 M17.5 3.5 V20.5 M20.5 4.5 V19.5'],
    dots: []
  },
  '盾-危害': {
    collectionId: 54209,
    sourceId: '47901796',
    paths: ['M12 2.28 L20.44 4.05 V13.28 C20.44 15.54 19.73 16.82 18.14 18.09 L12 21.54 L5.68 18.1 C4.13 16.94 3.37 15.46 3.37 13.27 V4.04 Z M9.35 8.64 L14.65 13.94 M14.65 8.63 L9.35 13.94'],
    dots: []
  },
  警报: {
    collectionId: 54209,
    sourceId: '47901797',
    paths: ['M3 20.75 H21.5 M5.06 20.53 V14.53 C5.06 10.18 8.06 6.8 11.89 6.8 C15.72 6.8 18.63 10.19 18.63 14.53 V20.49 M10 20.5 V17.66'],
    dots: [],
    strokeRelativeSegments: [
      { x: 12, y: 2.91, dx: 0, dy: 1, lengthMultiplier: 2 },
      { x: 3.65, y: 6.67, dx: 1, dy: 1, lengthMultiplier: 2 },
      { x: 20.37, y: 6.67, dx: 1, dy: -1, lengthMultiplier: 2 }
    ]
  },
  转出: {
    collectionId: 54209,
    sourceId: '47901798',
    paths: ['M5.05 5.57 V4 H20.86 V20 H5.05 V18.43 M6.66 9.02 L4.52 12 L6.67 14.99 M4.52 12 H15.37'],
    dots: []
  },
  票: {
    collectionId: 54209,
    sourceId: '47901799',
    paths: ['M4 4 H21 V8.47 C20.3 8.95 19.9 10.3 19.9 12.08 C19.9 13.8 20.3 15 21 15.53 V20 H3 V15.53 C3.7 15 4.1 13.7 4.1 11.92 C4.1 10.3 3.7 9 3 8.41 V5 C3 4.45 3.45 4 4 4 Z M10 10 H14 M10 14 H14'],
    dots: []
  },
  插卡: {
    collectionId: 54209,
    sourceId: '47901800',
    paths: ['M18.25 9.38 H21.47 V3 H2.49 V9.38 H5.75 M6 9.38 V6 H18 V21 H6 Z M9 6.25 V20.75 M14.42 15.37 V17.44'],
    dots: []
  },
  '盾-疑问': {
    collectionId: 54209,
    sourceId: '47901801',
    paths: [shieldFramePath, 'M8.57 9.31 C8.93 7.67 10.36 6.5 12.12 6.5 C14.1 6.5 15.52 7.95 15.52 9.75 C15.52 11.35 14.64 12.14 12.54 12.48 L12 13.03'],
    dots: [{ x: 12, y: 16 }]
  },
  红包: {
    collectionId: 54209,
    sourceId: '47901802',
    paths: ['M5 2 H20 V6.65 C20 7.15 19.91 7.44 19.75 7.65 V22 H4 V8.82 C4 8.28 4.1 8 4.3 7.73 C4.1 7.19 4 6.65 4 6.65 V3 C4 2.45 4.45 2 5 2 Z M4.3 7.73 C6.4 8.5 8.2 9 10.01 9.17 C11.33 9.34 12.66 9.34 13.98 9.17 C15.8 8.85 17.5 8.36 19.75 7.65'],
    dots: []
  },
  '盾-安全': {
    collectionId: 54209,
    sourceId: '47901803',
    paths: [shieldFramePath, 'M8.24 11.25 L10.57 13.53 L15.96 8.83'],
    dots: []
  },
  '密码箱-关闭': {
    collectionId: 54209,
    sourceId: '47901804',
    paths: ['M3 4 H21 V19 H3 Z M5 19 V20.65 M19 19 V20.65 M12 8.24 A2.18 2.18 0 1 1 12 12.6 A2.18 2.18 0 1 1 12 8.24 Z M12 12.6 V15.47'],
    dots: []
  },
  支付码: {
    collectionId: 54209,
    sourceId: '47901805',
    paths: ['M7.24 3 H3 V7.24 M16.76 3 H21 V7.24 M6.75 9.6 V14.4 M10.25 9.6 V14.4 M13.75 9.6 V14.4 M17.25 9.6 V14.4 M3 16.75 V21 H7.24 M16.76 21 H21 V16.75'],
    dots: []
  },
  '盾-警告': {
    collectionId: 54209,
    sourceId: '47901806',
    paths: [shieldFramePath, 'M12 7.81 V12.71'],
    dots: [{ x: 12, y: 15.53 }]
  },
  '盾-财产安全': {
    collectionId: 54209,
    sourceId: '47901807',
    paths: [shieldFramePath, 'M10.24 7.6 L12 9.14 L13.84 7.58 M9.35 10.29 H14.74 M12 9.14 V15.47 M9.35 13.29 H14.74'],
    dots: []
  },
  '盾-提示': {
    collectionId: 54209,
    sourceId: '47901808',
    paths: [shieldFramePath, 'M12 10 V16 M10.5 16 H13.5'],
    dots: [{ x: 12, y: 7.75 }]
  },
  认证: {
    collectionId: 54209,
    sourceId: '47901810',
    paths: ['M12 2.34 L14.92 5 H19 V9.08 L21.66 12 L19 14.92 V19 H14.92 L12 21.66 L9.08 19 H5 V14.92 L2.34 12 L5 9.08 V5 H9.08 Z M8.85 12.86 L10.35 14.37 L11.05 15.07 L15.18 11.02'],
    dots: []
  },
  理财产品: {
    collectionId: 54209,
    sourceId: '47901815',
    paths: ['M4.67 5.9 H19.36 L20.28 21.5 H3.72 Z M8.74 5.64 C8.9 3.84 10.26 2.62 12 2.62 C13.74 2.62 15.14 3.84 15.3 5.62 M8.42 14.21 L10.6 12.29 L13.49 14.86 L15.7 12.98'],
    dots: []
  },
  金融日期: {
    collectionId: 54209,
    sourceId: '47901816',
    paths: ['M3 5 H21 V12.95 M3 5 V21 H7.92 M3 11 H21 M8 3 V7 M16 3 V7 M12.3 20.28 L15.12 17.45 L18.66 20.28 L20.78 17.45'],
    dots: []
  },
  兑换: {
    collectionId: 54209,
    sourceId: '47901818',
    paths: ['M7.33 5.3 C10.77 3.05 15.37 3.63 18.18 6.45 C19.7 7.97 20.64 9.91 20.9 12 L18.18 11.47 M16.67 18.7 C13.23 20.95 8.63 20.37 5.82 17.55 C4.3 16.03 3.36 14.09 3.1 12 L5.82 12.53 M7.76 14.83 L10.59 12 L13.07 14.47 L16.24 11.3'],
    dots: []
  },
  金币: {
    collectionId: 54209,
    sourceId: '47901821',
    paths: ['M21 12 A9 9 0 1 1 3 12 A9 9 0 1 1 21 12 Z M10.24 8.14 L12 9.77 L13.84 8.13 M9.35 10.71 H14.74 M12 9.77 V16.89 M9.35 13.71 H14.74'],
    dots: []
  },
  自选: {
    collectionId: 54209,
    sourceId: '47901823',
    paths: ['M5 2.36 H20 V21.15 L12 18.35 L4 21.15 V3.36 C4 2.81 4.45 2.36 5 2.36 Z M9.5 10 H14.5 M12 7.5 V12.5'],
    dots: []
  },
  k线图: {
    collectionId: 54209,
    sourceId: '47901826',
    paths: ['M4 3 V21 M8 6 V15 M6 9 H10 V13 H6 Z M14 3 V21 M12 7 H16 V11 H12 Z M20 5 V19 M18 12 H22 V17 H18 Z'],
    dots: []
  },
  黄金: {
    collectionId: 54209,
    sourceId: '47901827',
    paths: ['M10.14 3.91 H14.54 L15.69 10.31 H8.16 L9.37 4.12 Z M4.55 13.69 H8.96 L10.1 20.09 H2.7 L3.79 13.9 Z M15.87 13.69 H20.28 L21.42 20.09 H13.9 L15.11 13.9 Z'],
    dots: []
  },
  图片: {
    collectionId: 54209,
    sourceId: '47901828',
    paths: ['M3 3 H21 V21 H3 Z M3 19 L13.5 8.5 L21 16'],
    dots: [{ x: 7, y: 8 }]
  },
  WiFi: {
    collectionId: 54209,
    sourceId: '47901830',
    paths: ['M2 7 C7.6 2.5 16.4 2.5 22 7 M5.2 11 C9 8 15 8 18.8 11 M8.5 15 C10.5 13.5 13.5 13.5 15.5 15'],
    dots: [{ x: 12, y: 19 }]
  },
  '图片-加载失败': {
    collectionId: 54209,
    sourceId: '47901831',
    paths: ['M3 4 H21 V12 M3 4 V20 H13 M3 20 L13.29 10.41 L17 14.83 M17.88 16.88 L22.12 21.12 M22.12 16.88 L17.88 21.12'],
    dots: [{ x: 8, y: 9 }]
  },
  显示器: {
    collectionId: 54209,
    sourceId: '47901833',
    paths: ['M2.5 4 H21.5 V17 H2.5 Z M12 17 V21.25 M7 21.25 H17'],
    dots: []
  },
  相机: {
    collectionId: 54209,
    sourceId: '47901834',
    paths: ['M3.38 6.75 H7.62 L9.08 4.79 C9.27 4.54 9.56 4.69 9.52 4.69 H14.48 C14.78 4.69 15.06 4.84 15.25 5.1 L16.48 6.75 H20.63 C21.15 6.75 21.56 7.17 21.56 7.7 V18.36 C21.56 18.89 21.15 19.31 20.63 19.31 H3.38 C2.86 19.31 2.44 18.89 2.44 18.36 V7.7 C2.44 7.17 2.86 6.75 3.38 6.75 Z M15.75 12.56 A3.75 3.75 0 1 1 8.25 12.56 A3.75 3.75 0 1 1 15.75 12.56 Z'],
    dots: []
  },
  录音: {
    collectionId: 54209,
    sourceId: '47901835',
    paths: ['M12 2.44 C14.05 2.44 15.7 4.09 15.7 6.14 V12 C15.7 14.05 14.05 15.7 12 15.7 C9.93 15.7 8.25 14.05 8.25 12 V6.14 C8.25 4.09 9.93 2.44 12 2.44 Z M3.75 12 C3.75 16.16 7.44 19.53 12 19.53 C16.56 19.53 20.25 16.16 20.25 12 M12 19.53 V21.56'],
    dots: []
  },
  路由器: {
    collectionId: 54209,
    sourceId: '47901836',
    paths: ['M2 13 H22 V21 H2 Z M6 13 V3 M18 13 V3 M7 17 H11'],
    dots: [{ x: 16, y: 17 }]
  },
  电话: {
    collectionId: 54209,
    sourceId: '47901837',
    paths: ['M5.01 4 H8.46 L9.92 8.92 L7.44 11.39 C8.75 13.93 10.45 15.63 12.61 16.56 L15.33 14.21 L20 15.55 V19 C20 19.55 19.55 20 19 20 C10.72 19.24 4.76 13.28 4 5 C4 4.45 4.45 4 5.01 4 Z'],
    dots: []
  },
  'WIFI-未连接': {
    collectionId: 54209,
    sourceId: '47901838',
    paths: ['M2 7 C3.3 6 4.7 5.2 6.2 4.5 M10 3.3 C14.3 2.9 18.7 4.2 22 7 M5.2 11 C6.3 10.2 7.5 9.6 8.8 9.2 M13 9 C15.1 9.2 17.1 9.9 18.8 11 M8.5 15 C9.7 14.1 11.1 13.7 12.79 13.73 M2 2 L22 22'],
    dots: [{ x: 12, y: 19 }]
  },
  暂停: {
    collectionId: 54209,
    sourceId: '47901839',
    paths: ['M21 12 A9 9 0 1 1 3 12 A9 9 0 1 1 21 12 Z M9.31 8.27 V15.73 M14.7 8.27 V15.73'],
    dots: []
  },
  视频通话: {
    collectionId: 54209,
    sourceId: '47901840',
    paths: ['M3.33 5 H17.31 V9.74 L21.68 7.58 V16.43 L17.31 14.26 V19 H2.33 V6 C2.33 5.45 2.78 5 3.33 5 Z'],
    dots: [{ x: 6.67, y: 9.34 }]
  },
  USB: {
    collectionId: 54209,
    sourceId: '47901841',
    paths: ['M6 9.05 H18 C18.55 9.05 19 9.5 19 10.05 V21.43 H5 V10.05 C5 9.5 5.45 9.05 6 9.05 Z M7 9.05 V3.52 C7 2.97 7.45 2.52 8 2.52 H17 V9.05 M10.73 17.72 H13.28'],
    dots: [{ x: 10.3, y: 5.79 }, { x: 13.69, y: 5.79 }]
  },
  '相机-禁用': {
    collectionId: 54209,
    sourceId: '47901842',
    paths: ['M3.38 6.75 H6.91 M10.27 4.69 H14.48 L16.48 6.75 H20.63 C21.15 6.75 21.56 7.17 21.56 7.7 V18.36 C21.56 18.89 21.15 19.31 20.63 19.31 H18.72 M14.71 19.31 H3.38 C2.86 19.31 2.44 18.89 2.44 18.36 V7.7 C2.44 7.17 2.86 6.75 3.38 6.75 Z M16.36 14.29 C16.45 13.73 16.5 13.16 16.36 12.59 M9.77 11.59 C9.39 13.37 10.5 15.12 12.4 15.33 M6.47 2.96 L17 21.04'],
    dots: []
  },
  '音量-关闭': {
    collectionId: 54209,
    sourceId: '47901843',
    paths: ['M2.46 8.52 H5.38 L11.47 4.84 V19.17 L5.38 15.5 H2.46 Z M15.38 9.17 L21.04 14.83 M21.04 9.17 L15.38 14.83'],
    dots: []
  },
  '图片-添加': {
    collectionId: 54209,
    sourceId: '47901844',
    paths: ['M3 4 H21 V12 M3 4 V20 H13 M3 20 L13.29 10.41 L17 14.83 M16 18 H21 M18.5 15.5 V20.5'],
    dots: [{ x: 8, y: 9 }]
  },
  '音量-大': {
    collectionId: 54209,
    sourceId: '47901845',
    paths: ['M2.52 8.52 H5.44 L11.52 4.84 V19.17 L5.44 15.5 H2.52 Z M15.48 9.12 C17.48 10.85 17.48 13.68 15.73 15.51 M18.97 5.8 C22.95 9.45 22.95 15.4 18.97 19.09'],
    dots: []
  },
  收音机: {
    collectionId: 54209,
    sourceId: '47901846',
    paths: ['M3.5 7 H21.5 V20 H2.5 V8 C2.5 7.45 2.95 7 3.5 7 Z M3.5 6.75 L14.32 3.6 M7.95 11.5 H6 M7.95 15.5 H6 M18 13.5 A2.5 2.5 0 1 1 13 13.5 A2.5 2.5 0 1 1 18 13.5 Z'],
    dots: []
  },
  打印机: {
    collectionId: 54209,
    sourceId: '47901847',
    paths: ['M3.5 4 H21.5 V15 C21.5 15.55 21.05 16 20.5 16 H18 M6 16 H3.5 C2.95 16 2.5 15.55 2.5 15 V5 C2.5 4.45 2.95 4 3.5 4 M6 16 V12.93 C6 12.38 6.45 11.93 7 11.93 H18 V20 H6 Z M9 8 H7'],
    dots: []
  },
  '音量-小': {
    collectionId: 54209,
    sourceId: '47901848',
    paths: ['M4 8.52 H6.92 L13 4.84 V19.17 L6.92 15.5 H4 Z M18.18 8.31 C20.55 10.3 20.55 13.96 18.74 15.39'],
    dots: []
  },
  蓝牙: {
    collectionId: 54209,
    sourceId: '47901849',
    paths: ['M10 2 L19 8.5 L10 16 V2 M10 8 L4 3 M10 8 L4 13 M10 8 L19 15.5 L10 22 V8 M10 16 L4 21'],
    dots: []
  },
  设备: {
    collectionId: 54209,
    sourceId: '47901850',
    paths: ['M9 3 H21 V21 H14 M8.02 7 V4 C8.02 3.45 8.47 3 9.02 3 M4 7 H14 V21 H3 V8 C3 7.45 3.45 7 4 7 Z M8 18 H9'],
    dots: []
  },
  '录音-关闭': {
    collectionId: 54209,
    sourceId: '47901851',
    paths: ['M9.87 4.25 C10.55 3.12 11.9 2.44 13.2 2.64 C14.65 2.88 15.7 4.37 15.7 6.14 V10.53 M8.25 9.29 V12 C8.25 14.05 9.93 15.7 12 15.7 C12.82 15.7 13.6 15.43 14.29 14.5 M3.75 12 C3.75 16.16 7.44 19.53 12 19.53 C12.65 19.53 13.29 19.37 13.9 19.06 M20.25 12 C20.25 12.67 20.15 13.3 19.95 13.9 M12 19.53 V21.56 M4.63 4.63 L18.69 18.69'],
    dots: []
  },
  视频文件: {
    collectionId: 54209,
    sourceId: '47901852',
    paths: ['M4 3 H21 V21 H3 V4 C3 3.45 3.45 3 4 3 Z M3 7.5 H21 M9.83 3.36 L7.51 7.49 M15.83 3.36 L13.48 7.5 M20.75 7.5 M10.25 11.75 L15.5 14.78 L10.25 17.81 Z'],
    dots: []
  },
  终端: {
    collectionId: 54209,
    sourceId: '47901853',
    paths: ['M3 4 H22 V20 H2 V5 C2 4.45 2.45 4 3 4 Z M6.25 9.17 L9.08 12 L6.25 14.83 M14 16 H18'],
    dots: []
  },
  最小值: {
    collectionId: 54209,
    sourceId: '47901855',
    paths: ['M5.17 2.54 C5.55 8.5 6.8 13.2 8.34 15.15 C8.85 15.75 9.35 16.12 10.15 16.12 M18.83 2.54 C18.45 8.5 17.2 13.2 15.65 15.15 C15.15 15.75 14.65 16.12 13.85 16.12 M3.64 18.21 H4.94 M8.76 18.21 H10.06 M13.88 18.21 H15.19 M19.01 18.21 H20.31 M2.47 21.5 H21.47'],
    dots: []
  },
  折线图: {
    collectionId: 54209,
    sourceId: '47901856',
    paths: ['M3 3 V21 H21 M7.56 13.42 L12 9 L15.01 12 L19.29 7.72'],
    dots: []
  },
  数据显示: {
    collectionId: 54209,
    sourceId: '47901858',
    paths: ['M4 3.5 H21 V16.5 H3 V4.5 C3 3.95 3.45 3.5 4 3.5 Z M12 16.5 V20.5 M8 20.5 H16 M7.75 11.09 L10.31 8.66 L13.28 11 L16.4 8.67'],
    dots: []
  },
  雷达图: {
    collectionId: 54209,
    sourceId: '47901860',
    paths: ['M12 2.5 L21.7 9.93 L18.15 20.75 H6 L2.29 9.75 Z M12 2.5 V8.05 M2.29 9.75 L7.48 11.25 M21.7 9.93 L16.5 11.26 M6 20.75 L9.43 16.58 M18.15 20.75 L14.79 16.55 M12 8.05 L16.5 11.26 L14.42 16.54 L9.66 16.55 L7.48 11.25 Z'],
    dots: []
  },
  平均值: {
    collectionId: 54209,
    sourceId: '47901861',
    paths: ['M7.49 7.48 C8.8 4.1 10.5 2.5 12 2.5 C13.5 2.5 15.2 4.1 16.51 7.48 M5.2 18.24 C5.35 16.7 5.55 15.2 5.76 13.89 M18.8 18.24 C18.65 16.7 18.45 15.2 18.24 13.89 M3.64 10.56 H4.94 M8.76 10.56 H10.06 M13.88 10.56 H15.19 M19.01 10.56 H20.31 M2.47 21.5 H21.47'],
    dots: []
  },
  最大值: {
    collectionId: 54209,
    sourceId: '47901862',
    paths: ['M5 20 C5.5 13 7.2 7 10 4 M19 20 C18.5 13 16.8 7 14 4 M2 22 H22 M3 2 H6 M8 2 H11 M13 2 H16 M18 2 H21'],
    dots: []
  },
  调试: {
    collectionId: 54209,
    sourceId: '47901863',
    paths: ['M4 4 V13 M2 17 H6 M4 17 V20 M12 4 V6.75 M10 7 H14 M12 11 V20 M20 4 V13 M18 17 H22 M20 17 V20'],
    dots: []
  },
  智能AI: {
    collectionId: 54209,
    sourceId: '47901864',
    paths: ['M9.6 2.71 C15.15 1.55 19.75 5.72 19.75 9.04 L22.27 13 L19.77 14.07 V16.6 C19.77 17.93 18.7 19 17.51 19 H15.77 V22 H6.77 V18.44 C6.77 17.68 6.6 16.99 6.28 16.38 M4.77 7.1 L2.16 12.08 M4.77 7.1 L7.38 12.08 M3.07 11 H6.47 M10.3 6 V12'],
    dots: []
  },
  '数据-错误': {
    collectionId: 54209,
    sourceId: '47901865',
    paths: ['M3.5 6.5 C3.5 4.57 7.3 3 12 3 C16.7 3 20.5 4.57 20.5 6.5 C20.5 8.43 16.7 10 12 10 C7.3 10 3.5 8.43 3.5 6.5 Z M3.5 6.5 V17.55 C3.5 19.35 6.8 20.75 11 20.97 M3.5 12 C3.5 13.8 6.8 15.3 11 15.97 M15.03 15.52 L19.98 20.48 M19.98 15.52 L15.03 20.48'],
    dots: []
  },
  条形图: {
    collectionId: 54209,
    sourceId: '47901866',
    paths: ['M3 2 V21 H22 M6 21 V14 M11 21 V7 M16 21 V11 M21 21 V4'],
    dots: []
  },
  散点图: {
    collectionId: 54209,
    sourceId: '47901867',
    paths: ['M3 2 V21 H22'],
    dots: [{ x: 7, y: 15 }, { x: 12, y: 10 }, { x: 17, y: 16 }, { x: 20, y: 6 }]
  },
  代码: {
    collectionId: 54209,
    sourceId: '47901868',
    paths: ['M7 8 L3 12.14 L7 16 M17 8 L21 12.14 L17 16 M14.07 4.27 L9.93 19.73'],
    dots: []
  },
  '数据-节点': {
    collectionId: 54209,
    sourceId: '47901869',
    paths: ['M4.5 4.5 C4.5 3.12 7.86 2 12 2 C16.14 2 19.5 3.12 19.5 4.5 C19.5 5.88 16.14 7 12 7 C7.86 7 4.5 5.88 4.5 4.5 Z M4.5 4.5 V12.67 C4.5 14.05 7.86 15.24 12 15.24 C16.14 15.24 19.5 14.05 19.5 12.67 V4.5 M4.5 8.75 C4.5 10.13 7.86 11 12 11 C16.14 11 19.5 10.13 19.5 8.75 M12 15.24 V18 M14 20 A2 2 0 1 1 10 20 A2 2 0 1 1 14 20 Z M3 20 H10 M14 20 H21'],
    dots: []
  },
  '数据-切换': {
    collectionId: 54209,
    sourceId: '47901870',
    paths: ['M3.5 6.5 C3.5 4.57 7.3 3 12 3 C16.7 3 20.5 4.57 20.5 6.5 C20.5 8.43 16.7 10 12 10 C7.3 10 3.5 8.43 3.5 6.5 Z M3.5 6.5 V17.55 C3.5 19.35 6.8 20.75 11 20.97 M3.5 12 C3.5 13.8 6.8 15.3 11 15.97 M14.64 16.07 H20.59 L18.67 14.15 M20.51 19.53 H14.56 L16.48 21.45'],
    dots: []
  },
  '数据-下载': {
    collectionId: 54209,
    sourceId: '47901871',
    paths: ['M3.5 6.5 C3.5 4.57 7.3 3 12 3 C16.7 3 20.5 4.57 20.5 6.5 C20.5 8.43 16.7 10 12 10 C7.3 10 3.5 8.43 3.5 6.5 Z M3.5 6.5 V17.55 C3.5 19.35 6.8 20.75 11 20.97 M3.5 12 C3.5 13.8 6.8 15.3 11 15.97 M17.56 14 V19.76 M15.06 18.28 L17.56 19.76 L20.06 18.28'],
    dots: []
  },
  数据库: {
    collectionId: 54209,
    sourceId: '47901872',
    paths: ['M3.5 6.5 C3.5 4.57 7.3 3 12 3 C16.7 3 20.5 4.57 20.5 6.5 C20.5 8.43 16.7 10 12 10 C7.3 10 3.5 8.43 3.5 6.5 Z M3.5 6.5 V17.5 C3.5 19.43 7.3 21 12 21 C16.7 21 20.5 19.43 20.5 17.5 V6.5 M3.5 12 C3.5 13.93 7.3 15.5 12 15.5 C16.7 15.5 20.5 13.93 20.5 12'],
    dots: []
  },
  '数据-锁定': {
    collectionId: 54209,
    sourceId: '47901873',
    paths: ['M3.5 6.5 C3.5 4.57 7.3 3 12 3 C16.7 3 20.5 4.57 20.5 6.5 C20.5 8.43 16.7 10 12 10 C7.3 10 3.5 8.43 3.5 6.5 Z M3.5 6.5 V17.55 C3.5 19.35 6.8 20.75 11 20.97 M3.5 12 C3.5 13.8 6.8 15.3 11 15.97 M14.5 16.75 H20.5 V21 H14.5 Z M15.5 16.75 V15.41 C15.5 14.17 16.4 13.17 17.5 13.17 C18.6 13.17 19.5 14.17 19.5 15.41 V16.75'],
    dots: []
  },
  版权: {
    collectionId: 26815,
    sourceId: '18267904',
    paths: ['M21 12 A9 9 0 1 1 3 12 A9 9 0 1 1 21 12 Z M15.5 9.2 C14.6 8.4 13.5 8 12.2 8 C9.8 8 8 9.7 8 12 C8 14.3 9.8 16 12.2 16 C13.5 16 14.6 15.6 15.5 14.8'],
    dots: []
  },
  安全隐私: {
    collectionId: 26815,
    sourceId: '18267905',
    paths: ['M12 2.54 L20 6.32 V12.98 C20 16.4 16.95 19.9 12 21.49 C7.05 20.1 4 16.55 4 13.09 V6.32 L12 2.54 M8.44 11.36 L10.74 13.66 L14.45 9.95'],
    dots: []
  },
  底层架构: {
    collectionId: 26815,
    sourceId: '18267906',
    paths: ['M12.09 3.5 L19.57 7.95 L12.09 12.39 L4.61 7.95 Z M3.36 11.95 L12.09 16.34 L20.65 11.95 M3.36 15.95 L12.09 20.34 L20.65 15.95'],
    dots: []
  },
  仓储仓库: {
    collectionId: 26815,
    sourceId: '18267907',
    paths: ['M3.11 9.35 L12 3.82 L20.89 9.35 M5 8.63 V20.5 H19 V8.63 M9.27 12.04 H14.78 M9.27 16.04 H14.78'],
    dots: []
  },
  饼图图表: {
    collectionId: 26815,
    sourceId: '18267908',
    paths: ['M21 12.5 A9 9 0 1 1 3 12.5 A9 9 0 1 1 21 12.5 Z M12 3.5 V12.5 H21 M12.5 12.5 L18.22 18.22'],
    dots: []
  },
  处方: {
    collectionId: 26815,
    sourceId: '18267909',
    paths: ['M4 5 H8 M16 5 H20 V21 H4 V5 M8 3 H16 V7 H8 Z M12 10 V18 M8 14 H16'],
    dots: []
  },
  发票: {
    collectionId: 26815,
    sourceId: '18267912',
    paths: ['M3 4.43 H20.96 V10.93 H17.93 V19.92 L15.02 18.5 L11.92 20.06 L8.83 18.5 L5.93 19.93 V10.93 H3 Z M5.93 10.93 V7.68 H17.93 V10.93 M9.68 11.46 H14.18 M9.68 14.91 H14.18'],
    dots: []
  },
  分布式: {
    collectionId: 26815,
    sourceId: '18267913',
    paths: ['M12.03 3.31 L15.5 5.31 V9.19 L12.03 11.19 L8.57 9.19 V5.31 Z M6.62 12.69 L10.08 14.69 V18.56 L6.62 20.56 L3.15 18.56 V14.69 Z M17.44 12.69 L20.91 14.69 V18.56 L17.44 20.56 L13.98 18.56 V14.69 Z'],
    dots: []
  },
  存储: {
    collectionId: 26815,
    sourceId: '18267914',
    paths: ['M4.5 4 H15.09 L20 8.91 V20 H4.5 Z M8 4 V8 H13.5 V4 M8 20 V14.5 H16.5 V20 M11.1 17.25 H13.26'],
    dots: []
  },
  订单: {
    collectionId: 26815,
    sourceId: '18267915',
    paths: ['M4 5 H8 M16 5 H20 V20 H4 V5 M8 3.5 H16 V6.5 H8 Z M8.25 10.75 H15.75 M8.25 15.25 H15.75'],
    dots: []
  },
  服务器: {
    collectionId: 26815,
    sourceId: '18267916',
    paths: ['M4.5 4 H19.5 V20.5 H4.5 Z M4.5 9.5 H19.5 M4.5 15 H19.5 M14.25 6.75 H15.75 M14.25 12.25 H15.75 M14.25 17.75 H15.75'],
    dots: []
  },
  分支: {
    collectionId: 26815,
    sourceId: '18267917',
    paths: ['M10 3.5 H14.5 V8 H10 Z M12.25 8 V12 H5.5 V16 M12.25 12 H19 V16 M3.5 16 H7.5 V20 H3.5 Z M17 16 H21 V20 H17 Z'],
    dots: []
  },
  丰富多元: {
    collectionId: 26815,
    sourceId: '18267918',
    paths: ['M4.73 4.38 H9.23 V8.88 H4.73 Z M15.67 15.32 H20.17 V19.82 H15.67 Z M9.23 6.55 H14.73 L17.96 9.58 V15.32 M6.98 8.88 V14.1 L10.13 17.53 H15.67 M17.92 3.22 V8.13 M6.98 15.83 V19.33'],
    dots: []
  },
  工厂: {
    collectionId: 26815,
    sourceId: '18267919',
    paths: ['M8.17 4.45 C9.5 3.55 10.45 3.17 11.95 4.01 C13.1 4.61 14.1 4.82 15.83 3.63 M4 7.5 H11.5 V11 H20 V20.5 H4 Z M7.25 11.01 H8.25'],
    dots: [{ x: 13.25, y: 14.25 }, { x: 16.75, y: 14.25 }, { x: 13.25, y: 17.25 }, { x: 16.75, y: 17.25 }]
  },
  合同: {
    collectionId: 26815,
    sourceId: '18267920',
    paths: ['M4.5 3.5 H19.5 V13.15 M4.5 3.5 V21 H12.25 M8.25 7.25 H15.75 M8.25 10.75 H15.75 M8.25 14.25 H10.25 M22.25 18 A5.25 5.25 0 1 1 11.75 18 A5.25 5.25 0 1 1 22.25 18 Z M17 15.5 L17.74 16.99 L19.38 17.23 L18.19 18.39 L18.47 20.02 L17 19.25 L15.53 20.02 L15.81 18.39 L14.62 17.23 L16.27 16.99 Z'],
    dots: []
  },
  海关港口: {
    collectionId: 26815,
    sourceId: '18267921',
    paths: ['M11.95 3.5 V22.26 M11.95 3.5 L15.95 7.5 C15.95 9.7 14.2 11.45 12.03 11.45 C9.85 11.45 8.1 9.7 8.1 7.5 Z M9.51 15.52 H14.51 M4.37 15.57 C5.2 17.65 8.02 19.4 12.03 19.91 C16.05 19.4 18.85 17.62 19.55 15.67 M2.97 13.2 L6.9 15.37 L4.31 16.93 M20.9 13.2 L16.97 15.37 L19.65 16.98'],
    dots: []
  },
  公益: {
    collectionId: 26815,
    sourceId: '18267922',
    paths: ['M12.25 20.21 L4.23 12.19 C1.3 9.25 3.38 4.75 7.2 4.75 C9.05 4.75 10.5 5.7 12.25 7.45 C14 5.7 15.45 4.75 17.3 4.75 C21.12 4.75 23.2 9.25 20.27 12.19 Z'],
    dots: []
  },
  哈希: {
    collectionId: 26815,
    sourceId: '18267923',
    paths: ['M3.5 4.5 H20 V21 H3.5 Z M10.38 8.28 L9.14 16.79 M14.38 8.28 L13.14 16.79 M8.04 10.46 H15.54 M8.04 14.46 H15.54'],
    dots: []
  },
  技术服务: {
    collectionId: 26815,
    sourceId: '18267924',
    paths: ['M3.5 5 H20.5 V16 H3.5 Z M6.81 20.07 H17.26 M9.62 8.56 L7.67 10.5 L9.62 12.44 M14.38 8.56 L16.33 10.5 L14.38 12.44'],
    dots: []
  },
  降本: {
    collectionId: 26815,
    sourceId: '18267925',
    paths: ['M3 4.5 H21 V19.5 H3 Z M3 8.4 H21 M9.97 11.7 L7.67 14 L9.97 16.3 M14.53 11.7 L16.83 14 L14.53 16.3'],
    dots: []
  },
  接口配置: {
    collectionId: 26815,
    sourceId: '18267926',
    paths: ['M3.5 6 H6 M10 6 H20.5 M10 6 A2 2 0 1 1 6 6 A2 2 0 1 1 10 6 Z M3.5 12 H14 M18 12 H20.5 M18 12 A2 2 0 1 1 14 12 A2 2 0 1 1 18 12 Z M3.5 18 H6 M10 18 H20.5 M10 18 A2 2 0 1 1 6 18 A2 2 0 1 1 10 18 Z'],
    dots: []
  },
  监管风控: {
    collectionId: 26815,
    sourceId: '18267927',
    paths: ['M12.5 2.33 L20.5 6.11 V12.77 C20.5 16.19 17.45 19.69 12.5 21.27 C7.55 19.89 4.5 16.34 4.5 12.87 V6.11 L12.5 2.33 M12.5 8.5 V15.5 M9 12 H16'],
    dots: []
  },
  精确准确: {
    collectionId: 26815,
    sourceId: '18267928',
    paths: ['M5.5 5.5 H19 V19 H5.5 Z M12.25 3.25 V8.26 M12.25 16.77 V21.78 M2.99 12.51 H7.99 M16.51 12.51 H21.51'],
    dots: []
  },
  快速高效: {
    collectionId: 26815,
    sourceId: '18267929',
    paths: ['M8.08 18.93 V6.3 L11.78 2.5 L15.48 6.3 V18.93 M8.08 10.79 L3.5 14.87 V16.78 H8.08 M15.48 10.78 L20.07 14.87 V16.8 H15.48 M11.76 11.28 V21.5'],
    dots: []
  },
  开放: {
    collectionId: 26815,
    sourceId: '18267930',
    paths: ['M14.25 4.5 A2.25 2.25 0 1 1 9.75 4.5 A2.25 2.25 0 1 1 14.25 4.5 Z M20.75 15.75 A2.25 2.25 0 1 1 16.25 15.75 A2.25 2.25 0 1 1 20.75 15.75 Z M7.75 15.75 A2.25 2.25 0 1 1 3.25 15.75 A2.25 2.25 0 1 1 7.75 15.75 Z M14.57 4.95 A7.5 7.5 0 0 1 19.39 13.3 M16.82 17.75 A7.5 7.5 0 0 1 7.18 17.75 M4.61 13.3 A7.5 7.5 0 0 1 9.43 4.95'],
    dots: []
  },
  灵活扩展: {
    collectionId: 26815,
    sourceId: '18267932',
    paths: ['M3.75 8.92 H9.16 L11.5 6.58 M11.5 3.5 H15 V7 H11.5 Z M3.75 12.25 H18 M18 10.5 H21.5 V14 H18 Z M3.75 15.5 H9.16 L11.5 17.84 M11.5 17.5 H15 V21 H11.5 Z'],
    dots: []
  },
  卖家购物车: {
    collectionId: 26815,
    sourceId: '18267933',
    paths: ['M2.96 5.09 H4.37 C4.75 5.09 5.03 5.29 5.11 5.71 L6.89 16.13 C6.96 16.53 7.23 16.75 7.63 16.75 H18.28 C18.69 16.75 18.95 16.53 19.02 16.16 L20.04 9.25 C20.11 8.76 19.79 8.39 19.3 8.39 H6.46'],
    dots: [{ x: 8, y: 20.5 }, { x: 17.5, y: 20.5 }]
  },
  流转: {
    collectionId: 26815,
    sourceId: '18267934',
    paths: ['M17.03 3.53 L19.24 6.5 L17.03 9.49 M19.24 6.5 H5 V12.43 M7.5 15.18 L5.3 18.14 L7.5 21.14 M5.3 18.14 H19.75 V12.23'],
    dots: []
  },
  联盟链: {
    collectionId: 26815,
    sourceId: '18267935',
    paths: ['M12.25 15.03 V3.75 M11.5 8.64 L12.25 3.75 L13 8.64 M12.25 15.03 L2.94 19.88 M7.55 18.08 L2.94 19.88 L6.8 16.78 M12.25 15.03 L21.56 19.88 M16.95 18.08 L21.56 19.88 L17.7 16.78'],
    dots: []
  },
  卖家店铺: {
    collectionId: 26815,
    sourceId: '18267936',
    paths: ['M6 4 H18 L20.25 9 C20.25 11.15 18.7 12.5 16.9 12.5 C15.2 12.5 14 11.25 14 9.5 C14 11.25 13 12.5 11.5 12.5 C10 12.5 9 11.25 9 9.5 C9 11.25 7.8 12.5 6.1 12.5 C4.3 12.5 2.75 11.15 3.75 9 Z M5 14.5 V21 H19 V14.5'],
    dots: []
  },
  管理: {
    collectionId: 26815,
    sourceId: '18267937',
    paths: ['M11.75 2.39 L9.59 4.11 L7.52 4.97 L6.96 7.57 L4.47 8.02 C3.93 8.86 3.6 9.73 3.61 10.09 L5.08 12.39 L3.61 14.41 C3.61 15.05 4.01 16.03 4.48 16.48 L7.07 17.04 L7.55 19.57 C8.16 20.03 9.17 20.4 9.6 20.39 L11.89 18.91 L13.91 20.39 C14.56 20.37 15.55 19.96 15.98 19.53 L16.54 16.93 L19.07 16.45 C19.54 15.85 19.9 14.83 19.89 14.4 L18.56 12.25 L19.9 10.04 C19.88 9.39 19.48 8.45 19.03 8.02 L16.42 7.45 L15.98 4.96 C15.37 4.49 14.35 4.12 13.91 4.11 L11.62 5.58 Z M14.02 12.25 A2.27 2.27 0 1 1 9.48 12.25 A2.27 2.27 0 1 1 14.02 12.25 Z'],
    dots: []
  },
  区块: {
    collectionId: 26815,
    sourceId: '18267938',
    paths: ['M12 2.56 L20.23 7.31 V16.69 L12 21.44 L3.77 16.69 V7.31 Z M3.77 7.31 L12 12.25 L20.23 7.31 M12 12.25 V21.44'],
    dots: []
  },
  平台: {
    collectionId: 26815,
    sourceId: '18267939',
    paths: ['M3.5 5 H20.5 V16 H3.5 Z M7.79 8.57 H16.29 M7.79 12.07 H16.29 M6.81 20.07 H17.26'],
    dots: []
  },
  票据: {
    collectionId: 26815,
    sourceId: '18267940',
    paths: ['M8 5 H20.25 C20.66 5 21 5.34 21 5.75 V9.85 C20 10.2 19.5 11.2 19.5 12.5 C19.5 13.8 20 14.8 21 15.15 V19.25 C21 19.66 20.66 20 20.25 20 H8 M8 5 H3.75 C3.34 5 3 5.34 3 5.75 V9.85 C4 10.2 4.5 11.2 4.5 12.5 C4.5 13.8 4 14.8 3 15.15 V19.25 C3 19.66 3.34 20 3.75 20 H8 M8 5 V20 M12.25 10.25 H15.5 M12.25 14.75 H15.5'],
    dots: []
  },
  全领域规模: {
    collectionId: 26815,
    sourceId: '18267941',
    paths: ['M13.5 4.5 H19 V11 H13.5 Z M4.5 4.5 H10 V9 H4.5 Z M4.5 12.5 H10 V19 H4.5 Z M13.5 14.5 H19 V19 H13.5 Z'],
    dots: []
  },
  欧元: {
    collectionId: 26815,
    sourceId: '18267942',
    paths: ['M21 12 A9 9 0 1 1 3 12 A9 9 0 1 1 21 12 Z M15.08 8.04 C14.35 7.35 13.5 7 12.61 7 C10.5 7 9.02 9.1 9.02 12 C9.02 14.9 10.5 17 12.61 17 C13.5 17 14.35 16.65 15.08 15.96 M7.61 10.5 H11.8 M7.61 13.5 H11.8'],
    dots: []
  },
  美元: {
    collectionId: 26815,
    sourceId: '18267943',
    paths: ['M21 12 A9 9 0 1 1 3 12 A9 9 0 1 1 21 12 Z M14.9 9.68 C14.25 8.9 13.25 8.5 12 8.5 C10.15 8.5 8.92 9.2 8.92 10.38 C8.92 11.58 10.08 12.25 12 12.25 C13.92 12.25 15.08 12.92 15.08 14.13 C15.08 15.3 13.85 16 12 16 C10.75 16 9.75 15.6 9.1 14.82 M12 6.78 V8.5 M12 16 V17.75'],
    dots: []
  },
  人民币: {
    collectionId: 26815,
    sourceId: '18267944',
    paths: ['M21 12 A9 9 0 1 1 3 12 A9 9 0 1 1 21 12 Z M9.53 7.55 L12 10.02 L14.47 7.55 M8.75 11.51 H15.25 M8.75 14.93 H15.25 M12 10.02 V17.29'],
    dots: []
  },
  扫码: {
    collectionId: 26815,
    sourceId: '18267945',
    paths: ['M9 4.25 H5 C4.59 4.25 4.25 4.59 4.25 5 V8.5 M15 4.25 H19 C19.41 4.25 19.75 4.59 19.75 5 V8.5 M4.24 12.07 H19.75 M4.25 15.5 V19 C4.25 19.41 4.59 19.75 5 19.75 H9 M15 19.75 H19 C19.41 19.75 19.75 19.41 19.75 19 V15.5'],
    dots: []
  },
  融资资金: {
    collectionId: 26815,
    sourceId: '18267946',
    paths: ['M21 12 A9 9 0 1 1 3 12 A9 9 0 1 1 21 12 Z M12 8.65 L15.35 12 L12 15.35 L8.65 12 Z'],
    dots: []
  },
  全球跨境: {
    collectionId: 26815,
    sourceId: '18267947',
    paths: ['M19.19 13.18 C18.62 16.85 15.6 19.5 11.93 19.5 C8.12 19.5 5.03 16.41 5.03 12.15 C5.03 8.34 8.12 5.25 11.93 5.25 C15.75 5.25 18.83 8.33 18.83 12.13 M3.6 12.38 C1.8 13.7 1.15 14.95 1.45 15.91 C1.85 17.1 3.9 17.5 6.85 17.43 C10.8 17.33 15.8 15.8 19.19 13.18 C21.7 11.2 22.8 9.3 22.36 8.33 C22 7.4 20.8 7.1 19.16 7.12'],
    dots: []
  },
  上云: {
    collectionId: 26815,
    sourceId: '18267948',
    paths: ['M8.94 18.74 H6.5 C3.72 18.74 1.47 16.49 1.47 13.71 C1.47 11.03 3.58 8.83 6.22 8.69 C6.64 5.91 9 3.8 12.22 3.8 C15.17 3.8 17.61 5.97 18.04 8.8 C20.81 8.87 23.03 11.1 23.03 13.71 C23.03 16.49 20.78 18.74 18 18.74 H15.57 M12.25 19.77 V16.55 M9.6 13.9 L12.25 11.25 L14.9 13.9 L12.25 16.55 Z'],
    dots: []
  },
  商业化全球: {
    collectionId: 26815,
    sourceId: '18267949',
    paths: ['M20.74 11.75 A9 9 0 1 1 2.74 11.75 A9 9 0 1 1 20.74 11.75 Z M5.55 5.49 C6.1 6.1 6.5 6.8 6.25 7.98 C6.02 8.58 6.2 9.2 7 9.38 H7.7 C8.4 9.38 8.8 9.8 9.2 10.7 L9.7 11.63 C10.2 12.1 10.7 11.8 11.2 11.3 C11.6 10.9 11.5 10.1 11.27 9.25 C11 8.4 10.9 7.7 11.17 7.38 C11.5 7 12 7.1 12.5 7.07 C13.5 7 14.4 5.5 15.33 3.72 M14.13 13.75 C15 13.75 15.5 14.2 16.2 14.86 C16.7 15.1 17.4 14.7 18 14.8 C18.6 14.9 18.9 15.3 19.2 16.18 M14.82 19.96 C14.8 18.9 14.4 18.1 13.35 17.34 C12.2 16.5 12 15.4 12.82 14.17 C13.2 13.8 13.7 13.75 14.13 13.75'],
    dots: []
  },
  身份认证: {
    collectionId: 26815,
    sourceId: '18267950',
    paths: ['M2.5 4.5 H21.5 V19.5 H2.5 Z M10.47 11.05 A1.72 1.72 0 1 1 7.03 11.05 A1.72 1.72 0 1 1 10.47 11.05 Z M4 17 C4.4 14.8 6.1 13.75 8.75 13.75 C11.4 13.75 13.1 14.8 13.5 17 M14.97 10.03 H16.44 M14.97 13.97 H18.21'],
    dots: []
  },
  时间周期: {
    collectionId: 26815,
    sourceId: '18267951',
    paths: ['M4.78 4 H19.28 M7.28 4 V8.38 L12.03 11.96 L7.28 15.54 V20.34 M16.78 4 V8.38 L12.03 11.96 L16.78 15.54 V20.34 M4.78 20.34 H19.28 M10.28 17.26 H13.79'],
    dots: []
  },
  时间戳: {
    collectionId: 26815,
    sourceId: '18267952',
    paths: ['M21.5 12 A9 9 0 1 1 3.5 12 A9 9 0 1 1 21.5 12 Z M12.5 7.23 V12 L16.02 15.11'],
    dots: []
  },
  数字化: {
    collectionId: 26815,
    sourceId: '18267953',
    paths: ['M11.74 3.34 V11.8 H20.2 C20.2 16.47 16.4 20.3 11.74 20.3 A8.5 8.5 0 0 1 11.74 3.34 Z M14.74 2.85 C18.03 2.85 20.67 5.5 20.67 8.8 H14.74 Z'],
    dots: []
  },
  图表柱图: {
    collectionId: 26815,
    sourceId: '18267956',
    paths: ['M10.5 4.5 H14 V21 H10.5 Z M4 9 H7.5 V21 H4 Z M17 14 H20.5 V21 H17 Z'],
    dots: []
  },
  溯源: {
    collectionId: 26815,
    sourceId: '18267957',
    paths: ['M21 12 A9 9 0 1 1 3 12 A9 9 0 1 1 21 12 Z M16 12 A4 4 0 1 1 8 12 A4 4 0 1 1 16 12 Z M12 12 L18.35 18.25'],
    dots: []
  },
  稳定可靠: {
    collectionId: 26815,
    sourceId: '18267959',
    paths: ['M14 6 A2 2 0 1 1 10 6 A2 2 0 1 1 14 6 Z M6.75 18 A2 2 0 1 1 2.75 18 A2 2 0 1 1 6.75 18 Z M21.25 18 A2 2 0 1 1 17.25 18 A2 2 0 1 1 21.25 18 Z M10.92 7.68 L5.83 16.32 M13.08 7.68 L18.17 16.32 M6.75 18 H17.25'],
    dots: []
  },
  网络: {
    collectionId: 26815,
    sourceId: '18267960',
    paths: ['M21 12 A9 9 0 1 1 3 12 A9 9 0 1 1 21 12 Z M3 12 H21 M12 3 C14.75 5.7 16.48 8.7 16.48 12 C16.48 15.3 14.75 18.3 12 21 M12 3 C9.25 5.7 7.52 8.7 7.52 12 C7.52 15.3 9.25 18.3 12 21'],
    dots: []
  },
  信用卡银行卡: {
    collectionId: 26815,
    sourceId: '18267961',
    paths: ['M3 5 H21 V19 H3 Z M3 9.06 H21 M14.75 15.75 H17.75'],
    dots: []
  },
  物流: {
    collectionId: 26815,
    sourceId: '18267962',
    paths: ['M10.5 5.25 H21 V17.25 M10.5 5.25 V17.25 M10.5 8.75 H7 L3 12.75 V17.25 M3 17.25 H5.44 M8.56 17.25 H17.44 M20.56 17.25 H21 M14.9 8.75 H21 M9 18.5 A2 2 0 1 1 5 18.5 A2 2 0 1 1 9 18.5 Z M21 18.5 A2 2 0 1 1 17 18.5 A2 2 0 1 1 21 18.5 Z'],
    dots: []
  },
  医疗服务: {
    collectionId: 26815,
    sourceId: '18267963',
    paths: ['M4 7.5 H8.5 V4 H15.5 V7.5 H20 V20 H4 Z M12 11 V16.5 M9.25 13.75 H14.75'],
    dots: []
  },
  医疗机构: {
    collectionId: 26815,
    sourceId: '18267964',
    paths: ['M3.5 3.5 H14 V11.25 H20.5 V20.5 H3.5 Z M7 20.5 V16 H10.5 V20.5 M6.97 8.75 H10.47 M8.72 7 V10.5 M16.97 14.25 H17.5 M16.97 17.25 H17.5'],
    dots: []
  },
  音乐: {
    collectionId: 26815,
    sourceId: '18267966',
    paths: ['M7 18 A2 2 0 1 1 3 18 A2 2 0 1 1 7 18 Z M19.5 17 A2 2 0 1 1 15.5 17 A2 2 0 1 1 19.5 17 Z M7 18 V5.5 L19.5 4.5 V17'],
    dots: []
  },
  身份识别认证: {
    collectionId: 26815,
    sourceId: '18267967',
    paths: ['M7.72 4 H4 V7.49 M16.28 4 H20 V7.49 M4 16.04 V20 H7.72 M20 16.04 V20 H16.28 M14.5 10 A2.5 2.5 0 1 1 9.5 10 A2.5 2.5 0 1 1 14.5 10 Z M7.25 16.5 C7.8 14.7 9.5 13.75 12 13.75 C14.5 13.75 16.2 14.7 16.75 16.5'],
    dots: []
  },
  性能计算: {
    collectionId: 26815,
    sourceId: '18267968',
    paths: ['M5.25 5.25 H18.75 V18.75 H5.25 Z M8.25 2.25 V5.25 M12 2.25 V5.25 M15.75 2.25 V5.25 M8.25 18.75 V21.75 M12 18.75 V21.75 M15.75 18.75 V21.75 M2.25 8.25 H5.25 M2.25 12 H5.25 M2.25 15.75 H5.25 M18.75 8.25 H21.75 M18.75 12 H21.75 M18.75 15.75 H21.75 M9 9 H15 V15 H9 Z'],
    dots: []
  },
  应用场景: {
    collectionId: 26815,
    sourceId: '18267969',
    paths: ['M4.5 4 H10 V9.5 H4.5 Z M14.5 4 H20 V9.5 H14.5 Z M4.5 14 H10 V19.5 H4.5 Z M14.5 14 H20 V19.5 H14.5 Z'],
    dots: []
  },
  隐私保护: {
    collectionId: 26815,
    sourceId: '18267970',
    paths: ['M8 8.5 V6.25 C8 3.9 9.8 2 12.07 2 C14.34 2 16.14 3.9 16.14 6.25 V8.5 M4.5 8.5 H19.5 V21 H4.5 Z M10 12.5 H14 V16.5 H10 Z'],
    dots: []
  },
  数据监管: {
    collectionId: 26815,
    sourceId: '18267971',
    paths: ['M3.5 4 H20.5 V17.5 H3.5 Z M7 20.5 H17 M8.25 10.5 V13 M12.5 8.5 V13 M16.75 10 V13'],
    dots: []
  },
  真实可信: {
    collectionId: 26815,
    sourceId: '18267972',
    paths: ['M11.75 2.39 L8.95 5 H5 V8.95 L2.2 11.75 L5 14.55 V18.5 H8.95 L11.75 21.3 L14.55 18.5 H18.5 V14.55 L21.3 11.75 L18.5 8.95 V5 H14.55 Z M8.82 11.52 L11.12 13.82 L14.83 10.1'],
    dots: []
  },
  印章认证: {
    collectionId: 26815,
    sourceId: '18267973',
    paths: ['M11.75 3 C9.45 3 8.05 4.4 8.05 6.35 C8.05 7.3 8.36 8.08 8.92 8.87 C10.15 10.58 10.38 11.87 9.66 12.56 C9.2 13 8.62 13.68 7.93 13.68 H6.11 L5.07 17.5 H18.5 L17.47 13.68 H15.55 C14.86 13.68 14.27 13.36 13.9 12.79 C13.42 12.05 13.51 10.93 14.58 8.87 C15.39 7.85 15.75 7.1 15.75 6.3 C15.75 4.35 14.25 3 11.75 3 Z M4 20.75 H19.55'],
    dots: []
  },
  文档: {
    collectionId: 26815,
    sourceId: '18267974',
    paths: ['M5.25 3.5 H14.5 L19.5 8.5 V21 H4.5 V4.25 C4.5 3.84 4.84 3.5 5.25 3.5 Z M14.5 3.5 V8.5 H19.5 M8.25 8.5 H10.99 M8.25 12.5 H15.75 M8.25 16.5 H15.75'],
    dots: []
  },
  远程穿透: {
    collectionId: 26815,
    sourceId: '18267975',
    paths: ['M2.5 12 H21.5 M17.25 7.75 L21.5 12 L17.25 16.25 M13 12 V4.5 H7.5 V9 M13 12 V19.5 H7.5 V15.5'],
    dots: []
  },
  证照执照: {
    collectionId: 26815,
    sourceId: '18267976',
    paths: ['M3 5 H21 V19 H3 Z M12 8 L12.74 9.49 L14.38 9.73 L13.19 10.89 L13.47 12.52 L12 11.75 L10.53 12.52 L10.81 10.89 L9.62 9.73 L11.27 9.49 Z M6.5 15.25 H17.5'],
    dots: []
  },
  智能合约: {
    collectionId: 26815,
    sourceId: '18267977',
    paths: ['M3 5 H21 V20 H3 Z M7.5 12 L10.25 14.75 L7.5 17.5 M7 9.25 H17.25 M11.5 12.75 H17.25 M11.5 16.25 H17.25'],
    dots: []
  },
  政府: {
    collectionId: 26815,
    sourceId: '18267978',
    paths: ['M3.63 9.15 L11.98 2.98 L20.37 9.15 Z M5.73 9.47 V16.78 M9.91 9.47 V16.78 M14.09 9.47 V16.78 M18.27 9.47 V16.78 M4 16.97 H20 V20.97 H4 Z'],
    dots: []
  },
  邮件邮箱: {
    collectionId: 26815,
    sourceId: '19410759',
    paths: ['M2.5 7 H20.5 V20.5 H2.5 Z M2.5 7 L11.5 15.78 L20.5 7 M2.5 20.5 L9.15 13.69 M20.5 20.5 L13.85 13.69'],
    dots: []
  }
} as const satisfies Record<string, IconfontSourceIconData>;

export const iconfontCuratedIconNames = new Set(Object.keys(iconfontCuratedIconData));

/**
 * Entries that have been checked against the original filled Iconfont contour.
 * Their coordinates already live on the 24×24 keyline, so applying the older
 * automatic optical-fit transform would distort the verified source geometry.
 */
export const iconfontCalibratedIconProfiles = {
  全屏: 'square',
  '减-2': 'square',
  清空: 'circle',
  '眼睛-不可见': 'circle',
  '加-2': 'square',
  '拖拽-竖': 'vertical',
  提示: 'circle',
  帮助: 'circle',
  筛选: 'vertical',
  '交通-飞机': 'circle',
  放大: 'circle',
  变大: 'resize',
  '交通-公交': 'circle',
  '分隔符-斜杠': 'vertical',
  企业: 'circle',
  时间日期: 'square',
  路线: 'circle',
  '时间日期-秒表': 'circle',
  银行: 'square',
  '分隔符-箭头': 'arrow',
  '侧边-收起': 'horizontal',
  历史记录: 'circle',
  回到顶部: 'vertical',
  '加-3': 'circle',
  通用: 'square',
  定位: 'circle',
  旋转: 'circle',
  导出: 'square',
  保存: 'square',
  通知: 'circle',
  地图: 'circle',
  搜索: 'circle',
  '反馈-成功': 'circle',
  '减-3': 'circle',
  下午茶: 'circle',
  减: 'horizontal',
  设置: 'circle',
  删除: 'circle',
  '眼睛-可见': 'horizontal',
  '反馈-警告': 'circle',
  关闭: 'close',
  收藏: 'circle',
  上传: 'circle',
  锁: 'circle',
  '侧边-展开': 'horizontal',
  '时间日期-时间': 'circle',
  '反馈-错误': 'circle',
  加: 'square',
  瀑布流: 'square',
  闪电: 'circle',
  刷新: 'circle',
  缩小: 'circle',
  '时间日期-日期': 'square',
  美化: 'circle',
  '交通-出租车': 'circle',
  开关: 'circle',
  工具箱: 'square',
  '全屏-退出': 'square',
  '交通-高铁': 'circle',
  标签: 'square',
  医疗箱: 'square',
  发送: 'square',
  '单箭头-上': 'arrow-horizontal',
  '单箭头-下': 'arrow-horizontal',
  '单箭头-左': 'arrow',
  '单箭头-右': 'arrow',
  上箭头: 'vertical',
  '双箭头-右': 'resize',
  '双箭头-左': 'resize',
  '双箭头-下': 'resize',
  右箭头: 'horizontal',
  '双箭头-上': 'resize',
  左箭头: 'horizontal',
  下箭头: 'vertical',
  对比: 'circle',
  编辑: 'square',
  '对齐-底': 'horizontal',
  等比缩放: 'square',
  '对齐-左': 'square',
  表格: 'square',
  '对齐-垂直居中': 'horizontal',
  '对齐-右': 'square',
  分界线: 'horizontal',
  清除: 'square',
  附件: 'square',
  撤销: 'square',
  复制: 'square',
  '间距-垂直分布': 'square',
  '对齐-水平居中': 'square',
  文字加粗: 'square',
  '排序-降序': 'horizontal',
  文字居右: 'horizontal',
  '间距-水平分布': 'square',
  截图: 'square',
  '语言-中文': 'square',
  '排序-升序': 'horizontal',
  文字居中: 'horizontal',
  链接: 'square',
  文字缩进减少: 'horizontal',
  文字缩进增加: 'horizontal',
  文字列表: 'horizontal',
  剪切板: 'square',
  '语言-翻译': 'circle',
  '语言-英文': 'square',
  重做: 'square',
  自动列宽: 'square',
  文字识别: 'square',
  emoji: 'circle',
  '人员-信息': 'square',
  消息: 'square',
  排行榜: 'square',
  组织管理: 'square',
  点赞: 'circle',
  用户画像: 'square',
  群组: 'circle',
  公告: 'square',
  服务: 'circle',
  皇冠: 'circle',
  护照: 'square',
  邮件: 'horizontal',
  用户: 'circle',
  VIP: 'circle',
  聊天记录: 'circle',
  '邮件-下载': 'horizontal',
  '邮件-已读': 'square',
  '消息-已发送': 'square',
  '人员-加': 'circle',
  '人员-删除': 'circle',
  '人员-减': 'circle',
  '消息-添加': 'circle',
  礼物: 'square',
  身份证: 'horizontal',
  评论: 'circle',
  话题: 'square',
  卡包: 'square',
  '密码箱-打开': 'square',
  钥匙: 'square',
  购物车: 'horizontal',
  银行卡: 'horizontal',
  微信支付: 'circle',
  钱包: 'square',
  计算: 'square',
  扫描: 'square',
  转入: 'square',
  条形码: 'square',
  '盾-危害': 'circle',
  警报: 'circle',
  转出: 'square',
  票: 'horizontal',
  插卡: 'square',
  '盾-疑问': 'circle',
  红包: 'vertical',
  '盾-安全': 'circle',
  '密码箱-关闭': 'square',
  支付码: 'square',
  '盾-警告': 'circle',
  '盾-财产安全': 'circle',
  '盾-提示': 'circle',
  认证: 'circle',
  理财产品: 'square',
  金融日期: 'square',
  兑换: 'circle',
  金币: 'circle',
  自选: 'square',
  黄金: 'square',
  图片: 'square',
  WiFi: 'horizontal',
  '图片-加载失败': 'circle',
  显示器: 'square',
  相机: 'horizontal',
  录音: 'circle',
  路由器: 'circle',
  电话: 'circle',
  'WIFI-未连接': 'circle',
  暂停: 'circle',
  视频通话: 'horizontal',
  USB: 'vertical',
  '相机-禁用': 'circle',
  '音量-关闭': 'circle',
  '图片-添加': 'circle',
  '音量-大': 'horizontal',
  收音机: 'horizontal',
  打印机: 'square',
  '音量-小': 'square',
  设备: 'square',
  '录音-关闭': 'circle',
  视频文件: 'square',
  终端: 'horizontal',
  最小值: 'square',
  折线图: 'square',
  数据显示: 'square',
  雷达图: 'square',
  平均值: 'square',
  调试: 'square',
  智能AI: 'square',
  '数据-错误': 'square',
  代码: 'horizontal',
  '数据-节点': 'square',
  '数据-切换': 'square',
  '数据-下载': 'square',
  数据库: 'square',
  '数据-锁定': 'square',
  精确准确: 'circle',
  快速高效: 'square',
  开放: 'circle',
  灵活扩展: 'square',
  流转: 'circle',
  应用场景: 'square',
  版权: 'circle',
  处方: 'square',
  接口配置: 'square',
  管理: 'circle',
  印章认证: 'vertical',
  文档: 'vertical',
  证照执照: 'horizontal',
  安全隐私: 'circle',
  公益: 'circle',
  身份认证: 'horizontal',
  身份识别认证: 'square',
  隐私保护: 'vertical',
  真实可信: 'circle',
  政府: 'square',
  邮件邮箱: 'horizontal',
  仓储仓库: 'circle',
  发票: 'circle',
  订单: 'square',
  工厂: 'square',
  合同: 'circle',
  海关港口: 'vertical',
  降本: 'horizontal',
  卖家购物车: 'horizontal',
  卖家店铺: 'square',
  票据: 'horizontal',
  全领域规模: 'square',
  欧元: 'circle',
  美元: 'circle',
  人民币: 'circle',
  扫码: 'square',
  融资资金: 'circle',
  全球跨境: 'circle',
  商业化全球: 'circle',
  信用卡银行卡: 'horizontal',
  物流: 'horizontal',
  医疗服务: 'square',
  医疗机构: 'square',
  底层架构: 'square',
  饼图图表: 'circle',
  分布式: 'circle',
  存储: 'square',
  服务器: 'vertical',
  分支: 'square',
  丰富多元: 'circle',
  哈希: 'square',
  技术服务: 'horizontal',
  监管风控: 'circle',
  联盟链: 'circle',
  区块: 'circle',
  平台: 'horizontal',
  上云: 'horizontal',
  时间周期: 'vertical',
  时间戳: 'circle',
  数字化: 'circle',
  图表柱图: 'square',
  溯源: 'circle',
  稳定可靠: 'circle',
  网络: 'circle',
  音乐: 'vertical',
  性能计算: 'square',
  数据监管: 'horizontal',
  远程穿透: 'horizontal',
  智能合约: 'horizontal'
} as const satisfies Record<string, IconKeylineProfile>;

export const iconfontCalibratedIconNames = new Set(Object.keys(iconfontCalibratedIconProfiles));

/** Per-icon fine adjustment for glyphs whose visual weight falls between keyline tiers. */
export const iconfontCalibratedIconOpticalScales = {
  地图: 0.96,
  下午茶: 0.94,
  删除: 0.94,
  上传: 0.9,
  锁: 0.9,
  用户: 0.94,
  '人员-加': 0.94,
  '人员-删除': 0.94,
  '人员-减': 0.94,
  聊天记录: 0.892,
  '消息-添加': 0.94,
  '盾-危害': 0.94,
  '盾-疑问': 0.94,
  '盾-安全': 0.94,
  '盾-警告': 0.94,
  '盾-财产安全': 0.94,
  '盾-提示': 0.94,
  '图片-加载失败': 0.9286,
  路由器: 0.9286,
  '图片-添加': 0.9286,
  电话: 0.9286,
  精确准确: 1.05,
  快速高效: 1.06,
  开放: 0.94,
  灵活扩展: 1.06,
  区块: 0.9286,
  安全隐私: 0.94,
  仓储仓库: 0.9286,
  发票: 0.9286,
  全球跨境: 1.08,
  上云: 1.08,
  数字化: 0.9,
  时间周期: 0.9,
  音乐: 1.1,
  性能计算: 1.1,
  数据监管: 1.1,
  远程穿透: 1.1
} as const;
