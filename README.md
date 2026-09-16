# FS后台设计 Icon库

## 项目文档

新任务或新开发者从 `PROJECT_CONTEXT.md` 开始。图标工作依次读取：

1. `PROJECT_CONTEXT.md`：架构、运行、数据边界与续接流程
2. `ICON_REDRAW_STANDARD.md`：完整绘制和验收规范
3. `ICON_REDRAW_PROGRESS.md`：唯一当前批次与确认状态
4. `HANDOFF.md`：历史决策和环境背景
5. `AGENTS.md`：编码代理约束

项目知识以这些 Markdown 为准，不要求回顾旧聊天。

这是一个可部署到 Vercel 的 React 图标工具：

- 前端：Vite + React + Tailwind CSS
- 基础图标：Iconfont 合集 `54209` 与 `26815` 的来源绑定、人工重绘中心线路径
- 页面功能图标：`lucide-react`
- 图标网格：人工重绘使用 32×32 正式画板；AI 生成使用等比映射的 24×24 可编辑画板
- 云端同步：Firebase Anonymous Auth + Firestore
- AI 生成：Vercel Serverless Function 代理 Gemini API

当前已支持图标搜索与分类、全局尺寸/描边/圆角调整、参考图辅助 AI 生成、MasterGo 可编辑 SVG 复制、Iconfont 闭合轮廓导出、JSX/SVG/PNG 输出、图标重命名与删除。完整功能、数据边界和当前停点统一查看 `PROJECT_CONTEXT.md`。

## 本地运行

```bash
npm install
cp .env.example .env.local
npm run dev
```

`npm run dev` 可以调试图标库界面。AI 生成接口在 Vercel 环境里可用；如果要本地调试 `/api/generate-icon`，使用 Vercel CLI 的 `vercel dev`。

## Firebase 配置

在 Firebase Console 创建项目，然后开启：

1. Authentication -> Anonymous 登录
2. Firestore Database

把 Firebase Web App 配置填入 `.env.local` 或 Vercel 环境变量：

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_APP_ID=icon-tool-prod
```

如果这些变量为空，应用仍能打开，但不会同步到云端。

Firestore 规则已经放在 `firestore.rules`。如果你安装了 Firebase CLI，可以用下面命令发布规则：

```bash
firebase login
firebase use <你的 Firebase project id>
firebase deploy --only firestore:rules
```

## Gemini 配置

Gemini key 只放在 Vercel 的服务端环境变量里：

```env
GEMINI_API_KEY=
GEMINI_MODELS=
```

不要给 Gemini key 加 `VITE_` 前缀，否则会暴露到浏览器代码里。

`GEMINI_MODELS` 可选，使用英文逗号分隔模型名；留空时依次尝试
`gemini-3.1-flash-lite-preview`、`gemini-3-flash-preview`、`gemini-3.1-flash-lite`。
界面会记录每个 AI 图标实际使用的模型。

新生成图标遵守 `FS-LINE-2026.09`：仅一个 `<path>`、绝对坐标、`fill="none"`、无额外样式属性，并严格限制在 24×24 画板内。完整规则见 `ICON_REDRAW_STANDARD.md`，代码单一来源为 `src/icon-generation-standard.ts`。

临时模型诊断接口 `/api/models` 默认关闭。如需启用，在服务端设置
`GEMINI_MODELS_DEBUG_TOKEN`，并通过 `Authorization: Bearer <token>` 请求。不要把该令牌提交到仓库。

## 部署到 Vercel

1. 把项目推到 GitHub。
2. 在 Vercel 导入仓库。
3. Framework Preset 选择 Vite。
4. Build Command 使用 `npm run build`。
5. Output Directory 使用 `dist`。
6. 在 Project Settings -> Environment Variables 填入上面的 Firebase 和 Gemini 变量。
7. 点击 Deploy。

部署完成后，把 Vercel 生成的网址发给同事即可。

## 上线前检查

- Firebase Anonymous Auth 已开启
- Firestore Database 已创建
- Firestore 规则已发布
- Vercel 环境变量已填写 Firebase 配置
- Vercel 环境变量已填写 `GEMINI_API_KEY`
- 本地 `npm run build` 可以通过

## 数据说明

当前版本使用匿名登录，每位同事会有自己的图标库状态。如果要让所有人共享同一套自定义图标，需要把 Firestore 路径改成团队共享集合，并重新设置安全规则。

图标名称和删除记录会保存到当前匿名用户数据；名称及删除记录另有本地备份。拖动图标调整分类只在本机开发地址启用，分类覆盖只写入当前浏览器的 localStorage，不会同步给线上其他用户。

产品维护者已确认删除的 39 枚基础图标在源码层永久排除，因此不会因新浏览器、新匿名用户或重新部署而恢复；当前产品底库实际可见 257 枚。原始 Iconfont JSON 仍作为来源档案保留，不等于线上可见图标清单。
