# icon-tool 项目续接总览

> 文档更新时间：2026-09-16  
> 当前产品：`FS后台设计 Icon库`  
> 当前代码分支：`main`  
> 当前预览：`http://127.0.0.1:4173/`  
> 当前停点：现有可见图标均已完成重绘；其中 6 枚尺寸微调后等待用户复核，不得自行开启新批次。

本文件是新 Codex 任务或新开发者进入本项目的第一入口。项目知识以仓库内 Markdown 为准，不依赖旧聊天记录。

## 1. 必读顺序

开始任何图标工作前，按顺序完整阅读：

1. `PROJECT_CONTEXT.md`：项目架构、运行方式和续接规则。
2. `ICON_REDRAW_STANDARD.md`：唯一有效的绘制、尺寸、拓扑和验收规范。
3. `ICON_REDRAW_PROGRESS.md`：唯一有效的当前批次和确认状态。
4. `HANDOFF.md`：重要历史决策、环境和故障背景。
5. `AGENTS.md`：仓库级开发约束。

`CODEX_HANDOFF.md` 是旧交接资料，只能用于追溯历史，不能覆盖以上文件。

## 2. 项目目标与工作边界

`FS后台设计 Icon库` 是一个 Vite + React + TypeScript 内部工具，用于浏览、筛选、调整、复制、下载和 AI 生成线性图标。正式图标来自 Iconfont 合集 `54209` 与 `26815`，并按原 source ID 人工重建为可编辑中心线路径。

- 来源 SVG 是结构真值，名称只用于检索，不能据名称换成常见图库隐喻。
- 一枚图标只使用一个 SVG `<path>`；不相连结构用同一路径内多个 `M` 子路径。
- 用户确认是最终视觉验收，自动检查和构建不能替代用户确认。
- 每次只处理进度文件中的当前批次；默认按网页最新可见顺序取 10 枚，已删除图标跳过。
- 当前批次尚未确认时，不自行进入下一批。

### 2.1 要解决的产品问题

1. 新系统需要全新图标语言时，从规范定义到批量绘制的投入大、周期长。
2. 既有后台图标库无法覆盖新业务时，补充图标效率低，不同设计师绘制结果容易出现风格偏差。
3. Iconfont 等开源平台存在额度、资源完整度和生成质量限制，难以持续形成统一、可扩展的图标体系。
4. MasterGo 的中心线绘制方式与 Iconfont 的闭合轮廓上传要求不同，传统流程需要借助插件反复转换尺寸、描边和轮廓。

### 2.2 当前已实现的产品能力

| 能力 | 当前实现 |
| --- | --- |
| 图标浏览 | 网格浏览、名称与标签搜索、图标数量统计、语义分类筛选 |
| 全局样式 | 统一调整显示尺寸、物理描边宽度和几何圆角；支持恢复默认值 |
| 图标预览 | 所有基础图标按同一套参数实时预览，支持明暗主题和响应式页面 |
| 参考源复刻 | 依据 Iconfont 合集 `54209`、`26815` 的 source ID 人工重建可编辑中心线路径 |
| AI 新增 | 输入概念生成图标，也可点击、拖拽或粘贴参考图辅助生成 |
| 安全校验 | 新生成结果必须满足单 `<path>`、绝对路径命令、无额外属性和 `24×24` 边界限制 |
| MasterGo 交付 | 复制烘焙过 Keyline 与光学变换的可编辑中心线 SVG，尺寸和描边按用户设置输出 |
| Iconfont 交付 | 导出单路径、闭合填充、`fill-rule="nonzero"` 的 Iconfont SVG |
| 其他输出 | 详情弹窗支持复制 JSX、下载 SVG 和下载 PNG |
| 图标维护 | 支持永久删除、修改名称；名称在本地及当前匿名用户 Firestore 中持久化 |
| 本机分组 | 本地开发环境可拖动图标调整分类，刷新后保留，但不向其他用户同步 |
| 使用指南 | 页面内提供尺寸、描边、圆角、可编辑矢量及接入说明 |

## 3. 当前状态

准确数量和图标名称始终以 `ICON_REDRAW_PROGRESS.md` 为准。编写本文件时：

- 早期已确认：106 枚。
- 最近批次已确认：165 枚。
- 已确认总数：271 枚。
- 当前待用户确认：6 枚；`精确准确、快速高效、开放、灵活扩展、区块、红包` 在原确认结果上按最新反馈调整整体尺寸，等待复核。最后 5 枚 `音乐、性能计算、数据监管、远程穿透、智能合约` 已于 2026-09-11 确认。
- 当前可见列表没有新的待重绘图标；不要恢复用户已删除的条目。
- 25 枚已删除基础图标已在 `src/fs-base-icons.tsx` 中做源码级永久排除；新浏览器、新匿名用户和新部署都不得恢复。原始 Iconfont JSON 只作为来源档案保留，不代表产品可见列表。
- 当前产品分类：`全部 / 基础功能 / 业务类 / 生活服务 / 金融数据类`。
- 搜索、图标数、新增按钮和分类栏已经设置为页面滚动时吸顶。
- 分类拖动仅供本机维护者使用，线上页面不显示提示，也不能拖动。
- 图标名称可在详情弹窗中编辑，修改后立即持久化。

如果页面顺序或删除状态发生变化，先按实时页面重新核对，再更新进度文件。

## 4. 核心文件地图

| 文件 | 作用 |
| --- | --- |
| `src/App.tsx` | 页面、筛选、预览、AI 生成、Firebase 同步、复制与下载入口 |
| `src/iconfont-curated-icons.ts` | 人工重绘的来源绑定、中心线路径和逐图标光学校正 |
| `src/iconfont-source-icons.generated.ts` | 原始 Iconfont 来源索引，不等于人工完成状态 |
| `src/icon-grid.tsx` | 24 预览网格、32 正式网格和光学缩放组件 |
| `src/icon-generation-standard.ts` | AI 生成规范的代码单一来源、24 画板映射和 Prompt 构造 |
| `src/fs-node-icon.tsx` | 参数化中心线路径与 MasterGo 路径变换 |
| `src/iconfont-export.ts` | Iconfont 闭合轮廓导出 |
| `src/fs-base-icons.tsx` | 基础图标集合 |
| `src/fs-parametric-icons.tsx` | 随描边或圆角动态变化的特殊参数化图标 |
| `src/download-icon-geometry.ts` | `下载`样板的中心线与轮廓几何 |
| `src/home-icon-geometry.ts` | `主页`样板的中心线与内描边几何 |
| `api/generate-icon.ts` | 服务端 Gemini 请求与模型回退 |
| `api/models.ts` | 受令牌保护的模型诊断接口 |
| `firestore.rules` | Firestore 权限规则 |
| `scripts/iconfont-source-*.json` | 两个指定 Iconfont 合集的原始来源数据 |
| `scripts/generate-iconfont-calibration-sheet.mjs` | 生成原轮廓、中心线和叠加对照校准图 |
| `ICON_REDRAW_STANDARD.md` | 人工重绘与 AI 生成都必须遵守的规范 |
| `ICON_REDRAW_PROGRESS.md` | 当前批次、确认数量和执行顺序 |
| `HANDOFF.md` | 已发生的设计决策、修正记录和工程背景 |
| `AGENTS.md` | 新任务必须遵守的仓库级工作方式 |

### 4.1 文档职责，避免相互覆盖

- `PROJECT_CONTEXT.md`：只保存当前仍有效的项目全貌，是新任务第一入口。
- `ICON_REDRAW_STANDARD.md`：只保存绘制、尺寸、拓扑、导出和验收规则，是唯一规范来源。
- `ICON_REDRAW_PROGRESS.md`：只保存当前数量、当前待确认图标和执行顺序，是唯一进度来源。
- `HANDOFF.md`：保存为什么做出某项决定以及历史修正，不用它覆盖当前进度。
- `AGENTS.md`：保存开发代理的行为边界、环境、安全与部署约束。
- `CODEX_HANDOFF.md`：旧资料，仅在追溯历史时阅读。

### 4.2 前端主要数据流

```text
Iconfont 原始 SVG
  -> 人工中心线重建 / 参数化路径
  -> fsBaseIcons 图标清单
  -> 全局尺寸、描边、圆角与光学校正
  -> 网页预览
  -> MasterGo 可编辑 SVG / Iconfont 闭合轮廓 SVG / JSX / PNG

文本概念或参考图片
  -> /api/generate-icon
  -> Gemini 3 系列模型回退
  -> 严格 SVG 校验
  -> 当前用户 customIcons
  -> 与基础图标共用预览和导出链路
```

## 5. 图标坐标与输出链路

### 正式人工重绘

- 画板：`32×32`。
- 方形/密集结构：中心线路径 `24×24`。
- 圆形/大型/稀疏结构：`28×28`。
- 纵向结构：`22×26`。
- 横向结构：`26×22`。
- 左右纯箭头：`10×18`；上下纯箭头：`18×10`。
- 关闭：`18.5×18.5`。
- 变大/变小：`22×22`。
- 描边是独立物理值，不能从中心线尺寸中预减。

具体光学判断、特殊案例和验收方法见 `ICON_REDRAW_STANDARD.md`，不得只凭外接框机械选档。

### AI 新生成图标

AI 使用 `24×24` 可编辑 viewBox，并把正式网格等比映射为：

- 方形 `18×18`
- 圆形/大型 `21×21`
- 纵向 `16.5×19.5`
- 横向 `19.5×16.5`
- 左右纯箭头 `7.5×13.5`
- 上下纯箭头 `13.5×7.5`
- 关闭 `13.875×13.875`
- 变大/变小 `16.5×16.5`
- 最小画板留白 `0.75`

代码规范版本为 `FS-LINE-2026.09`。新生成结果必须通过严格校验：只有一个 `<path>`、`fill="none"`、绝对路径命令、无额外属性、几何不越出 `24×24`。通过新版校验的图标直接使用模型给出的规范坐标，不再由旧的自动光学缩放二次改尺寸；旧的云端自定义图标仍使用较宽松的安全解析和兼容缩放，以免升级后无故消失。

### MasterGo 与 Iconfont

- “复制 SVG”用于 MasterGo：把 viewBox、Keyline 和光学变换烘焙进中心线坐标，保留一个可编辑矢量对象，并写回用户设置的物理描边宽度。
- MasterGo 显示的是中心线路径尺寸：例如方形应为 `24×24`，圆形应为 `28×28`，不能因描边变成 22 或 26。
- “导出 Iconfont SVG”用于字库：输出闭合填充轮廓和 `fill-rule="nonzero"`。
- 两条导出链路用途不同，不能互换。

## 6. 数据与服务边界

### Firebase

- 浏览器端使用匿名登录和 Firestore。
- 每个匿名用户保存自己的图标库，不是默认团队共享库。
- 拖动图标调整分类是项目维护者的本机功能，只在 `localhost`、`127.0.0.1` 或 `::1` 启用。分类映射仅写入当前浏览器的本地存储，不进入 Firestore，因此不会同步或暴露给部署页面的其他使用者；刷新后仍恢复本机记录。
- 图标重命名通过详情面板中的明确名称输入框完成；名称修改立即写入本地存储并同步到当前用户的 Firestore，刷新后继续使用修改后的名称。
- 页面语义分类为“基础功能、业务类、生活服务、金融数据类”；旧版持久化分类 `commerce` 与 `data` 在读取时自动合并迁移为 `finance-data`。
- 删除 ID 同时作为本地 tombstone 保存；重建列表或重置样式时不得清空。
- 产品级删除与个人删除必须区分：维护者确认删除的基础图标进入源码永久排除名单；普通用户从个人库删除仍使用 localStorage 与 Firestore tombstone。
- 缺少 Firebase 环境变量时应用仍能打开，但不会云同步。

### 状态存储矩阵

| 数据 | localStorage | Firestore | 说明 |
| --- | --- | --- | --- |
| 已删除图标 ID | 是 | 是 | 本地和云端取并集；属于永久 tombstone，禁止重建时清空 |
| 图标名称覆盖 | 是 | 是 | 本地值在首次云端合并时优先；名称最长 80 字符 |
| 分类覆盖 | 是 | 否 | 仅本机维护用途，不同步给线上其他用户 |
| 自定义 AI 图标 | 否 | 是 | 保存在当前匿名用户的 `customIcons` 中 |
| 尺寸、描边、圆角、主题 | 否 | 是 | 800ms 防抖写入当前匿名用户文档 |
| AI 参考图片与输入草稿 | 否 | 是 | 图片先压缩到最长边 512px，再保存 Base64 与 MIME 类型 |

Firestore 文档路径：

```text
artifacts/{appId}/users/{user.uid}/icon_app_state/main
```

这里的 `user.uid` 来自 Firebase Anonymous Auth，因此默认是“每位用户自己的图标库”，不是团队共享库。匿名身份跨浏览器或清理站点数据后不会自然迁移。

### Gemini

- API key 只允许使用服务端 `GEMINI_API_KEY`，禁止添加 `VITE_` 前缀。
- 模型顺序由 `GEMINI_MODELS` 覆盖；未设置时以 `api/generate-icon.ts` 中的 `DEFAULT_MODELS` 为准。
- 普通 `vite` 开发服务器不模拟 `/api/*`；本地调试 AI 接口使用 `vercel dev`。
- AI 返回内容在浏览器进入状态前必须先经过安全解析与新版严格生成校验。

## 7. 本地运行与部署

```bash
npm install
cp .env.example .env.local
npm run dev
```

构建和预览：

```bash
npm run build
npm run preview
```

其他脚本：

```bash
npm run icons:generate
```

该命令用于重新生成 Iconfont 来源索引；生成结果不等于完成了人工 1:1 重绘，不能据此修改确认状态。

Vercel 配置：Vite，构建命令 `npm run build`，输出目录 `dist`，根目录 `./`。

环境变量：

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
VITE_APP_ID=yizalucky-icon-tool
GEMINI_API_KEY=
GEMINI_MODELS=
GEMINI_MODELS_DEBUG_TOKEN=
```

`.env.local` 不提交仓库。服务端变量不得使用 `VITE_` 前缀。

### 环境与仓库位置

- GitHub：`https://github.com/yizahu7-rgb/icon-tool.git`
- 正式项目目录：`/Users/faker/Documents/New project/icon-tool`
- 当前 Codex 窗口可能显示另一个空目录 `/Users/faker/Documents/icontool`；执行项目前先用 `pwd`、`package.json` 和 `src/App.tsx` 确认真实目录，不能把文档或代码写入空仓库。
- 普通 Vite 服务只提供前端；需要测试 `/api/generate-icon` 时使用 `vercel dev`。

## 8. 标准续接流程

1. 读取本页和三份必读 Markdown，不回顾旧会话。
2. 查看 `git status --short`，保留用户已有修改，不重置、不批量清理。
3. 打开本地预览，按网页最新可见顺序核对当前组。
4. 从来源 ID 获取原始 SVG；先还原拓扑，再决定尺寸档位和光学校正。
5. 每枚图标保持单 `<path>`，完成后同步更新 `ICON_REDRAW_PROGRESS.md`；新经验同时写入 `ICON_REDRAW_STANDARD.md`。
6. 只做当前组；构建并刷新本地预览后等待用户确认。
7. 用户确认后，把当前组转为“用户已确认”，再开始下一组。

除涉及隐私、外部发布、付费、删除数据或系统要求的授权外，项目内常规读取、编辑、构建和刷新预览直接执行，不重复询问。

### 8.1 按任务类型选择入口

| 新任务内容 | 首先查看 | 必须同步更新 |
| --- | --- | --- |
| 继续重绘一组图标 | `ICON_REDRAW_PROGRESS.md`、`ICON_REDRAW_STANDARD.md` | 进度文件；出现新经验时同步规范 |
| 修改图标尺寸或形状 | 来源 SVG、`src/iconfont-curated-icons.ts` | 规范中的误判原因与最终规则 |
| 修改 AI 生成规则 | `src/icon-generation-standard.ts`、规范第 8 节 | 代码与 Markdown 必须保持一致 |
| 修改 MasterGo 复制 | `src/fs-node-icon.tsx`、`src/App.tsx` | `PROJECT_CONTEXT.md` 与 `HANDOFF.md` |
| 修改 Iconfont 导出 | `src/iconfont-export.ts` | 导出与验收说明 |
| 修改数据持久化 | `src/App.tsx`、`firestore.rules` | 存储矩阵、README 和 HANDOFF |
| 修改分类、搜索或页面交互 | `src/App.tsx`、`src/index.css` | 只在行为边界变化时更新总览 |
| 修改 Gemini 模型或 API | `api/generate-icon.ts`、`api/models.ts` | `.env.example`、README、HANDOFF、AGENTS |

## 9. 常见误区

- 自动中轴算法只能定位参考，不能作为最终路径。
- 不能因名称熟悉就替换来源形状。
- 不能用圆头、圆角或重叠遮盖断线、错连和缺失结构。
- 不能仅看总外接框判断大小；附属点、引脚、箭头和大留白常导致视觉体量误判。
- 不能对宽高分别缩放；必须保持来源长宽比。
- 不能把“构建通过”写成“用户已确认”。
- 不要恢复已删除图标或按旧静态顺序补位。
- 不要把本机分类覆盖写入 Firestore；该能力明确不对所有用户同步。
- 不要把 MasterGo 中心线 SVG 和 Iconfont 闭合轮廓 SVG 混用。
- 不要因为 `npm run build` 通过就把待确认图标改成用户已确认。

## 10. 当前已知限制与后续候选

- 匿名用户数据缺少跨浏览器、跨设备迁移能力；优先候选是图标库导入/导出。
- 还没有自动化测试覆盖新版 SVG 校验、Gemini 回退和两条导出链路。
- Firebase 相关代码使主 JavaScript 包偏大，Vite 构建存在超过 500kB 的既有警告，可后续按需拆包。
- `npm ci` 存在依赖安全提示，升级前必须先评估破坏性变化，禁止直接执行强制修复。
- 只有在明确提出团队共享需求时才新增共享库模式；不能改变当前“每人自己的库”的默认数据边界。
- 只有在明确需要稳定跨设备身份时才引入正式登录。

## 11. 新建 Codex 任务可直接使用的开场指令

### 继续图标批次

> 阅读 `/Users/faker/Documents/New project/icon-tool` 中的 `PROJECT_CONTEXT.md`、`ICON_REDRAW_STANDARD.md`、`ICON_REDRAW_PROGRESS.md`、`HANDOFF.md` 和 `AGENTS.md`，以仓库 Markdown 为唯一项目上下文，不回顾旧会话。只处理进度文件中的当前一组图标，严格按 source ID、单 `<path>`、中心线和最新 Keyline 规范执行；完成后构建、刷新 `http://127.0.0.1:4173/` 并等待我确认。项目内常规读取、编辑、构建和刷新默认同意，不要反复询问。

### 继续产品功能开发

> 阅读 `/Users/faker/Documents/New project/icon-tool` 中的 `PROJECT_CONTEXT.md`、`HANDOFF.md` 和 `AGENTS.md`，再根据任务内容读取对应专项规范。以仓库 Markdown 和当前代码为准，不回顾旧会话；保留已有修改和用户数据，不清空删除记录，不改变“每位用户自己的库”边界。完成修改后运行 `npm run build`，刷新 `http://127.0.0.1:4173/` 供我检查。
