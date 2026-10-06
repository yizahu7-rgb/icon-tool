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

前端通过 Vite 启动。需要本地调试 Gemini 接口时，使用 `vercel dev`；也可在界面内切换到本地兼容模型服务（默认地址为 `http://127.0.0.1:8080/v1/chat/completions`）。

## Gemini 配置

仅在 Vercel 或本地服务端环境设置下列变量，切勿加 `VITE_` 前缀：

```env
GEMINI_API_KEY=
GEMINI_MODELS=
GEMINI_MODELS_DEBUG_TOKEN=
```

`GEMINI_MODELS` 可选，使用英文逗号分隔模型名；留空时按内置 Gemini 3 系列回退顺序请求。`/api/models` 仅在设置 `GEMINI_MODELS_DEBUG_TOKEN` 并带对应 Bearer Token 时可访问。

## 部署

推送 `main` 会触发 Vercel 部署。配置：Framework Preset 为 Vite，Build Command 为 `npm run build`，Output Directory 为 `dist`，并在服务端环境变量中配置 `GEMINI_API_KEY`。
