# TDesign v2 图标工具

基于 TDesign 设计语言的 32×32 中心线 SVG 图标库与生成工具。当前项目只保留 v2；旧版 24×24 图标库、Firebase 同步和相关素材已移除。

## 功能

- 浏览、中文搜索和复制 17 个已导入的描边图标分类
- 按 v2 规范调整外部轮廓圆角；内置细节、大圆角和点状元素不受该配置影响
- 输入文字或上传参考图生成图标，并按 32×32 母版和 Keyline 规则校验
- 复制可编辑中心线 SVG；导出符合 Iconfont 要求、采用 `fill-rule="nonzero"` 的闭合填充 SVG

## 规范与维护

- [完整绘制规范](./TDESIGN_V2_STANDARD.md)
- [图标生成规范](./TDESIGN_V2_ICON_GENERATION_GUIDE.md)
- [分类导入进度](./TDESIGN_V2_PROGRESS.md)
- [第三方许可](./THIRD_PARTY_NOTICES.md)

## 本地运行

```bash
npm install
cp .env.example .env.local
npm run dev
```

前端通过 Vite 启动。本地调试 `/api/generate-icon` 时使用 `vercel dev`；只有显式设置 `VITE_USE_LOCAL_MODEL=true` 时，界面才改用本机 `/local-model/v1/chat/completions` 兼容接口。

## OpenAI-compatible 配置

仅在 Vercel 或本地服务端环境设置下列变量，切勿加 `VITE_` 前缀：

```env
OPENAI_API_KEY=
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_API_MODE=responses
OPENAI_MODEL=
OPENAI_MODELS=
OPENAI_MODELS_DEBUG_TOKEN=
```

`OPENAI_BASE_URL` 可切换到公司的 OpenAI-compatible 网关。`OPENAI_API_MODE` 支持 `responses` 和 `chat_completions`。`OPENAI_MODEL` 用于固定单个模型并优先于 `OPENAI_MODELS`；两者均未设置时，服务端依次尝试 `gpt-6.1-sol`、`gpt-6-luna`。文本和可选 Base64 参考图都由服务端发送。

`/api/models` 默认关闭。只有设置 `OPENAI_MODELS_DEBUG_TOKEN` 并携带对应 Bearer Token 时才能访问诊断接口。

## 部署

推送 `main` 会触发 Vercel 部署。配置：Framework Preset 为 Vite，Build Command 为 `npm run build`，Output Directory 为 `dist`。在 Production 环境中配置 `OPENAI_API_KEY`、`OPENAI_BASE_URL`、`OPENAI_API_MODE` 和 `OPENAI_MODEL` 后，再触发新的部署使变量生效。
