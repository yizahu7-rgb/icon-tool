# LucideUI Icon库

这是一个可部署到 Vercel 的 React 图标工具：

- 前端：Vite + React + Tailwind CSS
- 图标：lucide-react
- 云端同步：Firebase Anonymous Auth + Firestore
- AI 生成：Vercel Serverless Function 代理 Gemini API

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
GEMINI_MODEL=gemini-2.5-flash
```

不要给 Gemini key 加 `VITE_` 前缀，否则会暴露到浏览器代码里。

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
