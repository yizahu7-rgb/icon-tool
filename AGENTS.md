# AGENTS.md

本仓库仅维护 TDesign v2 图标工具。开始图标、生成或导出相关修改前，完整阅读：

1. `TDESIGN_V2_STANDARD.md`
2. `TDESIGN_V2_ICON_GENERATION_GUIDE.md`
3. `TDESIGN_V2_PROGRESS.md`
4. 本文件

## 技术边界

- 前端：Vite、React、TypeScript、Tailwind CSS。
- 图标母版：32×32；SVG 源图使用中心线描边，Iconfont 导出时转换为非零填充的闭合轮廓。
- 图标库：`src/tdesign-*-icons.ts`；页面：`src/TDesignSmartPage.tsx`。
- `src/fs-node-icon.tsx` 只保留 v2 所需的 SVG 路径圆角与变换工具，不能恢复旧版 24×24 图标组件。
- AI：浏览器调用 `POST /api/generate-icon`，服务端再请求 OpenAI 或 OpenAI-compatible API；密钥仅使用服务端 `OPENAI_API_KEY`，绝不能使用 `VITE_` 前缀。
- 服务端用 `OPENAI_BASE_URL` 配置 API 根地址，用 `OPENAI_API_MODE` 选择 `responses` 或 `chat_completions`；`OPENAI_MODEL` 优先于 `OPENAI_MODELS`。

## 修改原则

- 生成图标必须先参考成熟图标库中的同语义图形；无参考时才使用最简单、无歧义的通用隐喻。
- 遵守四种 Keyline：水平 26×22、方形 24×24、垂直 22×26、圆形 28×28；特殊图形可为视觉平衡突破辅助线。
- 圆角配置只影响可调整的外轮廓；内部点、细节、语义性大圆角均需保持原状。
- 提交前运行 `npm run build`；推送 `main` 会触发 Vercel 部署。

远程仓库：`https://github.com/yizahu7-rgb/icon-tool.git`。
