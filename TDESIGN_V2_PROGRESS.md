# TDesign 风格 v2 分阶段进度

本文件只记录 TDesign 风格 v2 的导入和验收状态。v1 原有 FS/Iconfont 图标仍以 `ICON_REDRAW_PROGRESS.md` 为准，两套规范不得混用。

## 版本边界

- v1.0：Git 标签 `v1.0.0`，提交 `920aca8`。
- v2 开发分支：`codex/tdesign-v2`。
- v2 尚未发布线上；每个分类都必须完成本地预览并由用户确认后，才进入下一阶段。

## 当前阶段

| 状态 | 样式 / 分类 | 数量 | 图标 |
| --- | --- | ---: | --- |
| 用户已确认 | 描边 / 智能 | 25 | ai、ai-1、ai-article、ai-book-open、ai-chart-bar、ai-coordinate-system、ai-cut、ai-edit、ai-edit-1、ai-education、ai-git-branch、ai-image、ai-image-1、ai-layout、ai-music、ai-screenshot、ai-search、ai-terminal、ai-terminal-1、ai-textformat-italic、ai-tool、ai-video、robot、robot-1、robot-2 |
| 用户已确认 | 描边 / 行动 | 164 | ability-open、accessibility、add、address-book、alarm、alarm-add、alarm-off、analytics、anchor、api、article、assignment、assignment-checked、assignment-code、assignment-error、assignment-user、backup、barcode、book、bookmark、bookmark-add、bookmark-checked、bookmark-double、bookmark-minus、browse、browse-gallery、browse-off、bug-report、calendar-1、calendar-2、calendar-3、calendar-edit、calendar-event、cardmembership、cart、cart-add、chart、chart-add、chat-bubble-help、check、check-double、close、close-rectangle、collection-1、color-invert、contribute、copyright、correct、creditcard、creditcard-add、creditcard-off、currency-exchange、dashboard-1、delete、delete-1、edit、edit-off、explore、explore-off、export、extension、extension-off、fact-check、file-attachment、file-restore、fingerprint、flag、flag-1、flag-2、flag-3、flight-landing、flight-takeoff、flip-to-back、flip-to-front、gift、grid-add、grid-view、heart、help-rectangle、high-level、history、history-setting、home、https、import、install-desktop、install-mobile、institution、institution-checked、internet、jump、jump-double、jump-off、key、leaderboard、lightbulb、lightbulb-circle、lighting-circle、location-1、lock-checked、lock-off、lock-on、lock-time、mark-as-unread、mobile-blocked、mobile-list、mobile-shortcut、mode-embedding、module、money、move、notification-circle、outbox、page-included、pending、percent、poweroff、print、radar、refresh、remove、rocket、saving-pot、search、search-error、secured、send、send-1、send-cancel、sensors、sensors-off、server、setting、setting-1、shop、star-1、star、sticky-note、store、support、task-add-1、task-checked-1、terminal-rectangle-1、theaters、thumb-down、thumb-up、tools、tools-circle、translate、translate-1、trending-down、trending-up、vehicle、verified、view-agenda、view-in-ar、wallet、wealth、wealth-1、work、work-history、work-off、zoom-in、zoom-out |
| 用户已确认 | 描边 / 警报 | 15 | check-circle、close-circle、close-octagon、delete-time、error-circle、error-triangle、help-circle、info-circle、minus-circle、no-result、notification、notification-add、notification-error、shield-error、time |
| 用户已确认 | 描边 / 箭头 | 86 | arrow-down、arrow-down-circle、arrow-down-rectangle、arrow-left、arrow-left-circle、arrow-left-down、arrow-left-down-circle、arrow-left-right-1、arrow-left-right-2、arrow-left-right-3、arrow-left-right-circle、arrow-left-up、arrow-left-up-circle、arrow-right、arrow-right-circle、arrow-right-down、arrow-right-down-circle、arrow-right-up、arrow-right-up-circle、arrow-triangle-down、arrow-triangle-up、arrow-up、arrow-up-circle、arrow-up-down-1、arrow-up-down-2、arrow-up-down-3、arrow-up-down-circle、backtop、backtop-rectangle、caret-down、caret-down-small、caret-left、caret-left-small、caret-right、caret-right-small、caret-up、caret-up-small、chevron-down、chevron-down-circle、chevron-down-double、chevron-down-double-s、chevron-down-rectangle、chevron-down-s、chevron-left、chevron-left-circle、chevron-left-double、chevron-left-double-s、chevron-left-rectangle、chevron-left-s、chevron-right、chevron-right-circle、chevron-right-double、chevron-right-double-s、chevron-right-rectangle、chevron-right-s、chevron-up、chevron-up-circle、chevron-up-double、chevron-up-double-s、chevron-up-rectangle、chevron-up-s、download、enter、expand-horizontal、expand-vertical、fullscreen-1、fullscreen-2、fullscreen-exit、fullscreen-exit-1、highlight、login、logout、move-1、order-adjustment-column、rollback、rollfront、shrink-horizontal、shrink-vertical、size-change、swap、swap-left、swap-right、unfold-less、unfold-more、upload、fullscreen |
| 用户要求跳过（未导入） | 描边 / 品牌 | 40 | — |
| 用户要求跳过（未导入） | 描边 / 建筑 | 103 | — |
| 用户已确认 | 描边 / 图表 | 44 | activity、calculation、chart-3d、chart-analytics、chart-area、chart-area-multi、chart-bar、chart-bubble、chart-column、chart-combo、chart-draw-io、chart-line、chart-line-board、chart-line-data、chart-line-data-1、chart-line-multi、chart-maximum、chart-median、chart-minimum、chart-pie、chart-radar、chart-radial、chart-ring、chart-ring-1、chart-scatter、chart-stacked、fork、mind-map、object-storage、sequence、table、table-add、table-split、tree-catalog、tree-round-dot、tree-round-dot-vertical、tree-square-dot、tree-square-dot-vertical、usercase、usercase-link、view-gantt、view-image、view-organization、tree-list |
| 用户已确认 | 描边 / 沟通 | 22 | chat、chat-add、chat-bubble、chat-bubble-history、chat-bubble-locked、chat-bubble-smile、chat-checked、chat-clear、chat-double、chat-error、chat-heart、chat-message、chat-off、chat-poll、chat-setting、dialog-history、forum、mentioned、questionnaire、questionnaire-double、tips、tips-double |
| 用户已确认 | 描边 / 组件 | 39 | button、calendar、card、chat-bubble-error、column-layout、component-breadcrumb、component-checkbox、component-divider-horizontal、component-divider-vertical、component-dropdown、component-grid、component-input、component-layout、component-radio、component-space、component-steps、component-steps-1、component-stickytool、component-switch、data-display、expand-down、expand-up、form、horizontal、icon、image-carousel、link、link-unlink、menu、page-head、page-tab、scroll-bar、slideshow、tab、table-2、tag、tag-state、typography、vertical |
| 用户已确认 | 描边 / 设计 | 43 | anticlockwise、artboard、brush、clear-formatting-1、collage、contrast、cut、dividers-1、draft、drag-drop、drag-move、edit-1、edit-2、fill-color、focus、format-horizontal-align-bottom、format-horizontal-align-center、format-horizontal-align-top、frame-1、ink、layers、layout、measurement-2、mirror、mosaic、palette-1、pen、pen-ball、pen-brush、pen-fluorescence、pen-mark、pen-quill、placeholder、root-list、rotation、screenshot、sip、slice、table-1、textbox、transform-1、transform-3、view-column |
| 用户已确认 | 描边 / 开发 | 27 | braces、brackets、bug、code、code-1、code-off、command、css3、cursor、flowchart、git-branch、git-commit、git-commit-1、git-merge、git-pull-request、git-repository、git-repository-commits、git-repository-private、graphviz、html5、mermaid、parentheses、plantuml、sitemap、terminal、terminal-rectangle、terminal-window |
| 用户已确认 | 描边 / 设备 | 74 | airplay-wave、audio、automation、barcode-1、base-station、battery、battery-add、battery-charging、battery-low、bluetooth、call、call-1、call-cancel、call-forwarded、call-incoming、call-off、camera、camera-off、cast、cpu、data、data-base、data-checked、data-error、data-search、desktop、desktop-1、device、film、flashlight、gamepad、gps、hard-drive、hotspot-wave、install、keyboard、laptop、mobile、mobile-vibrate、mode-dark、mode-light、mode-preview、mouse、phone-locked、phone-search、precise-monitor、qrcode、remote-wave、rotate、rotate-locked、router-wave、rss、save、scan、sd-card、sensors-1、sim-card、sim-card-1、sim-card-2、tablet、tv、tv-1、tv-2、uninstall、usb、video-camera、watch、widget、wifi、wifi-1、wifi-no、wifi-off、wifi-off-1、keyboard-1 |
| 用户已确认 | 描边 / 文档 | 67 | abstract、add-circle、align-bottom、align-top、align-vertical、attach、attachment-list、automatic-numbering、bulletpoint、chat-bubble-1、chat-bubble-add、chinese-rectangle、clear、clear-formatting、collapsible-block、cut-1、document-location、document-popular、document-update、english-rectangle、error、file-edit、filter-1、font-background、format-painter、format-vertical-align-center、format-vertical-align-left、format-vertical-align-right、frame、functions、hashtag、help、highlighted-block、indent-left、indent-right、japanese-rectangle、korean-rectangle、line-height、list-bug、list-demand、member、merge-cells、mode-text、order、order-ascending、order-descending、order-list、quote、seal、share-1、space、subscript、summary、superscript、text、text-drawing、text-style、textformat-bold、textformat-color、textformat-italic、textformat-longer、textformat-shorter、textformat-strikethrough、textformat-underline、textformat-wrap、view-list、divider-1 |
| 用户要求跳过（未导入） | 描边 / 其他 | 0 | — |
| 用户要求跳过（未导入） | 描边 / 表情 | 47 | — |
| 用户已确认 | 描边 / 文件 | 96 | bill、book-open、book-unknown、catalog、catalog-1、certificate、cloud-download、cloud-upload、collection、constraint、copy、coupon、course、discount、discount-list、download-1、file、file-1、file-add、file-add-1、file-blocked、file-code、file-code-1、file-copy、file-csv、file-download、file-excel、file-export、file-icon、file-image、file-import、file-json、file-locked、file-markdown、file-minus、file-music、file-onenote、file-outlook、file-paste、file-pdf、file-powerpoint、file-safety、file-search、file-setting、file-teams、file-transmit、file-transmit-double、file-txt、file-unknown、file-unlocked、file-word、file-yaml、file-zip、folder、folder-1、folder-add、folder-add-1、folder-blocked、folder-details、folder-export、folder-import、folder-locked、folder-minus、folder-move、folder-off、folder-open、folder-open-1、folder-search、folder-setting、folder-shared、folder-unlocked、folder-zip、hd、link-1、link-transform、media-library、music-1、music-2、paste、rename、screen-4k、subtitle、task、task-1、task-add、task-checked、task-double、task-error、task-location、task-marked、task-setting、task-time、task-visible、template、ticket、upload-1 |
| 用户要求跳过（未导入） | 描边 / 食品 | 54 | — |
| 用户要求跳过（未导入） | 描边 / 手势 | 33 | — |
| 当前批待用户确认 | 描边 / 图片 | 36 | adjustment、animation、animation-1、brightness、brightness-1、center-focus-strong、circle、contrast-1、exposure、face-retouching、fill-color-1、filter-2、filter-3、highlight-1、image、image-1、image-add、image-edit、image-error、image-off、image-search、markup、measurement、measurement-1、palette、panorama-horizontal、panorama-vertical、pantone、portrait、rectangle、round、saturation、sharpness、transform、transform-2、visual-recognition |
| 用户要求跳过（未导入） | 描边 / 字母 | 26 | — |
| 当前批待用户确认 | 描边 / 地图 | 51 | camera-2、compass、compass-1、downscale、earth、indicator、location、location-enlargement、location-error、location-parking-place、location-reduction、location-setting、map、map-3d、map-add、map-aiming、map-blocked、map-bubble、map-cancel、map-chat、map-checked、map-collection、map-connection、map-distance、map-double、map-edit、map-grid、map-information、map-information-1、map-information-2、map-location、map-locked、map-marked、map-navigation、map-outline、map-route-planning、map-ruler、map-safety、map-search、map-search-1、map-setting、map-unlocked、mobile-navigation、navigation-arrow、pin、street-road、street-road-1、subway-line、traffic、traffic-events、upscale |
| 用户要求跳过（未导入） | 描边 / 数学 | 33 | — |
| 当前批待用户确认 | 描边 / 媒体 | 60 | backward、calculator、camera-1、cd、dart-board、download-2、dv、dvd、earphone、film-1、forward、gamepad-1、guitar、ipod、loudspeaker、microphone、microphone-1、microphone-2、movie-clapper、music、music-rectangle-add、next、page-first、page-last、pause、pause-circle-stroke、piano、play-chart、play-circle-stroke、play-circle-stroke-add、play-demo、play-rectangle、previous、radio-1、radio-2、replay、screen-mirroring、screencast、sd-card-1、sensors-2、shutter、sonic、sound、sound-down、sound-high、sound-low、sound-mute、sound-mute-1、sound-up、stop-circle-stroke、tape、video、video-camera-1、video-camera-2、video-camera-dollar、video-camera-minus、video-camera-music、video-camera-off、video-library、voice-wave |
| 用户要求跳过（未导入） | 描边 / 数字 | 24 | — |
| 当前批待用户确认 | 描边 / 系统 | 47 | add-rectangle、app、application、check-rectangle、control-platform、dashboard、ellipsis、filter、filter-clear、filter-off、filter-sort、hard-disk-storage、hourglass、load、mail、menu-application、menu-fold、menu-unfold、minus-rectangle、more、queue、relativity、service、share、shortcut、system-2、system-3、system-application、system-blocked、system-code、system-components、system-coordinate、system-device、system-interface、system-location、system-locked、system-log、system-marked、system-messages、system-regulation、system-search、system-setting、system-storage、system-sum、system-unlocked、view-module、web |
| 当前批待用户确认 | 描边 / 用户 | 44 | certificate-1、cooperate、education、flag-4、gender-female、gender-male、personal-information、user、user-1、user-add、user-arrow-down、user-arrow-left、user-arrow-right、user-arrow-up、user-avatar、user-blocked、user-business、user-checked、user-checked-1、user-circle、user-clear、user-error-1、user-invisible、user-list、user-locked、user-marked、user-password、user-safety、user-search、user-setting、user-talk、user-talk-1、user-talk-off-1、user-time、user-transmit、user-unknown、user-unlocked、user-vip、user-visible、usergroup、usergroup-add、usergroup-circle、usergroup-clear、verify |
| 用户要求跳过（未导入） | 描边 / 天气 | 29 | — |

## 实现约束

- v2 新绘制和新生成图标的唯一尺寸规范为 `TDESIGN_V2_STANDARD.md`：`32×32` 母版、四边 `2px` 出血位、`28×28` 最大绘制区，以及水平 `26×22`、方形 `24×24`、垂直 `22×26`、圆形 `28×28` 四套 Keyline。
- `32×32` 母版上的复合图标断口上限调整为 `2.5px`，仍按 `0.5px` 递增；其他输出尺寸随图形等比例缩放。
- Keyline 只作为视觉辅助线：按对象形象选择模板，必要时允许越过辅助线，禁止为了贴线改变物体比例。斜线使用 `45°` 或 `15°` 倍数，并同时检查实体与负形夹角；文字和三维透视图形的端部切面应与栅格或外轮廓相切。
- 来源为 TDesign Icons 官方仓库的 `svg/*.svg`，按 MIT 许可使用；版权声明见 `THIRD_PARTY_NOTICES.md`。
- 保留官方 `viewBox`、路径/图形元素顺序、2px 描边、`stroke-linecap="square"`、填充层几何和多层星标结构；描边模式的 `fill1 / fill2` 按官方网页逻辑动态设为透明。
- 不套用 v1 的单 `<path>`、32×32 Keyline、MasterGo 中心线或 Iconfont 轮廓导出规则。
- 默认 `/` 显示 v2 第一阶段页面；`/?version=1` 仅用于回看已冻结的 v1 工作台。
- 点击图标复制独立 SVG；未导入内容不伪造图标数据。
- 左侧只显示已经导入且有内容的「智能」「行动」「警报」「箭头」「图表」「沟通」「组件」「设计」「开发」「设备」「文档」「文件」「图片」「地图」「媒体」「系统」「用户」17 个分类；未导入的空分类全部隐藏。当前只有描边内容，因此样式切换控件整体移除，分类列表直接从侧栏顶部开始。当前默认打开本次合并验收的最后一个「用户」。

## 验证记录

- `npm run build`：通过。
- `git diff --check`：通过。
- 按最新完整参考图修正页面结构：图标资源区固定居中 `1200px`，内部为 `113px` 左栏、`64px` 间隔、`670px` 六列图标区、`48px` 间隔和 `305px` 设置栏。
- 页面初版按 TDesign 原站显示为 `30×30px`；当前按产品要求把基础图标候选尺寸调整为 `32×32px`，名称仍为 `12px`、图标单元高仍为 `100px`。v2 新生成图标的 `32×32` 母版和四套 Keyline 已在 `TDESIGN_V2_STANDARD.md` 固化；官方导入图标继续保留原始 viewBox。
- 右侧配置新增 `16 / 24 / 32 / 48px` 四档图标尺寸，默认 `32px`；网格预览和复制 SVG 的外部尺寸同步变化，重置恢复 `32px`。
- 修正物理描边与圆角：预览会按原始 `viewBox` 与所选尺寸反向补偿线宽和圆角；复制 SVG 时会把路径和矩形坐标烘焙到目标尺寸并归一化 `viewBox`，因此 MasterGo 不再把线宽或圆角随 24→32/48 的画布缩放二次放大。
- 当前圆角以 SVG 弧线烘焙进可编辑矢量路径，导入 MasterGo 后可继续编辑锚点和控制柄；标准 SVG 不能携带 MasterGo 私有的非破坏性“节点圆角数值”，若要求属性面板继续显示同一圆角值，需要后续通过 MasterGo 插件/API 写入。
- 圆角配置现只处理 `stroke1 / fill1` 外轮廓主层；`stroke2 / fill2` 内部符号、分隔线、孔洞、文字和状态细节保持官方原始几何，网页预览与复制 SVG 共用同一规则。
- 修正 `api / 接口` 的官方混合路径：四个外部括号保留在 `stroke1`，中心点拆入 `stroke2`，因此调整圆角时中心点不再被圆角算法缩没；导入脚本包含同一语义分层覆盖。
- 2048×1086 本地浏览器实测：容器宽 `1200px`、左右各 `424px`；25 枚图标顺序与参考图一致。
- 搜索交互验证：搜索 `robot` 后正确显示 3 枚，清空后恢复 25 枚。
- 页面控制台：无错误。
- 点击复制反馈：通过。
- 「行动」164 枚图标从 TDesign 官方 `develop` 分支的 `manifest.outline.Action` 与对应 `svg/*.svg` 生成，名称、数量、官方顺序、`viewBox`、元素层级和路径顺序均已核对。
- 本地页面实测默认显示 `行动 (164)`，首枚为 `ability-open`，末枚为 `zoom-out`；切换到 `智能 (25)` 再切回行动均正常，浏览器控制台无错误。
- 七个已导入分类的可见图标名称已全部中文化；英文官方源名称仍保留为内部稳定标识和搜索词。页面标题、源文件入口、复制提示、圆角单位和默认颜色文本也已改为中文。
- 「警报」15 枚图标从 TDesign 官方 `develop` 分支的 `manifest.outline.Alert` 与对应 `svg/*.svg` 生成，首枚为 `check-circle`、末枚为 `time`；可见名称均为中文，英文源名称继续作为搜索别名。
- 圆角目标识别会排除与 `fill2 / stroke2` 几何相同的内部路径；因此通知类图标即使把铃舌描边嵌在 `stroke1` 组内，铃舌也不会随外轮廓圆角变化。
- 本地页面实测默认显示 `警报 (15)`，15 枚中文名称与官方顺序一致；英文 `notification` 可检索到「通知 / 添加通知 / 错误通知」，中文 `盾牌` 可检索到「盾牌错误」，切换到 `行动 (164)` 再返回警报正常，浏览器控制台无错误。
- 「箭头」86 枚图标从 TDesign 官方 `develop` 分支的 `manifest.outline.Arrows` 与对应 `svg/*.svg` 生成，首枚为 `arrow-down`、末枚为 `fullscreen`；可见名称全部使用中文，英文源名称继续作为搜索别名。
- 本地页面实测默认显示 `箭头 (86)`，86 枚名称均为唯一中文名称；英文 `chevron-right` 可检索到 6 枚右向折线箭头，中文 `全屏` 可检索到 5 枚全屏变体，切换到 `警报 (15)` 再返回箭头正常，浏览器控制台无错误。
- 用户明确要求跳过「品牌」和「建筑」两个分类；两类未生成本地图标数据，也未标记为已完成。
- 「图表」44 枚图标从 TDesign 官方 `develop` 分支的 `manifest.outline.Charts` 与对应 `svg/*.svg` 生成，首枚为 `activity`、末枚为 `tree-list`；可见名称全部使用中文，英文源名称继续作为搜索别名。
- 图表分类数据校验通过：44 枚名称与官方清单数量和顺序完全一致，名称与中文标签各自无重复，全部保留 `0 0 24 24` 官方 viewBox；英文 `chart-line` 可检索 5 枚折线图，中文 `树形` 可检索 6 枚树形图标。
- 用户输入“下一组”确认「描边 → 图表」验收通过，并开始「描边 → 沟通」。
- 「沟通」22 枚图标从 TDesign 官方 `develop` 分支的 `manifest.outline.Communication` 与对应 `svg/*.svg` 生成，首枚为 `chat`、末枚为 `tips-double`；可见名称全部使用中文，英文源名称继续作为搜索别名。
- 沟通分类数据校验通过：22 枚名称与官方清单数量和顺序完全一致，名称与中文标签各自无重复，全部保留 `0 0 24 24` 官方 viewBox；英文 `chat-bubble` 可检索 4 枚聊天气泡，中文 `问卷` 可检索 2 枚问卷图标。
- 本地页面实测默认显示 `沟通 (22)`，首枚为「聊天」、末枚为「双提示」；图表 → 沟通切换正常。点击已跳过的品牌或建筑会保持沟通分类，并明确提示“已按要求跳过”，不再误报为下一阶段导入。
- 用户输入“继续”确认「描边 → 沟通」验收通过，并开始「描边 → 组件」。
- 「组件」39 枚图标从 TDesign 官方 `develop` 分支的 `manifest.outline.Component` 与对应 `svg/*.svg` 生成，首枚为 `button`、末枚为 `vertical`；可见名称全部使用中文，英文源名称继续作为搜索别名。
- 描边模式的官方 `fill1 / fill2` 白色占位层已按 TDesign 官方网页链路改为动态透明层：网页预览使用 `transparent`，复制 SVG 也会逐层写入 `fill="transparent"`；图层 ID、几何和顺序继续保留，未来真正需要遮挡时改用路径断口、裁剪或蒙版，不依赖白色背景。
- 本地浏览器核验组件分类共找到 49 个 `fill1 / fill2` 层、58 个实际填色节点，计算后的填色全部为透明，白色可见节点为 0；控制台无错误。
- 用户输入“继续下一分类”确认「描边 → 组件」验收通过，并开始「描边 → 设计」。
- 「设计」43 枚图标从 TDesign 官方 `develop` 分支的 `manifest.outline.Design` 与对应 `svg/*.svg` 生成，首枚为 `anticlockwise`、末枚为 `view-column`；可见名称均为唯一中文名称，英文源名称继续作为搜索别名。
- `drag-drop / 拖放` 的官方源文件属于以实心路径表达描边颜色的 `specifiedIcons`；按用户要求，本地不沿用该实心例外，改为 `fill="none"` 的线性中心线结构：重叠画板放入 `stroke1`，鼠标指针放入 `stroke2`，全局圆角只改变外部画板结构。
- 本地浏览器核验线性「拖放」仅包含 `stroke1 / stroke2` 两条路径，两条路径的属性和计算结果均为 `fill="none"`；设计分类仍为 43 枚，页面控制台无错误。
- 用户输入“继续”确认「描边 → 设计」验收通过，并开始「描边 → 开发」。
- 「开发」27 枚图标从 TDesign 官方 `develop` 分支的 `manifest.outline.Development` 与对应 `svg/*.svg` 生成，首枚为 `braces`、末枚为 `terminal-window`；可见名称均为唯一中文名称，英文源名称继续作为搜索别名。
- 修正官方 `braces` 的错误中文关键词“牙套 / 矫正器”，本地搜索词改为“花括号 / 大括号”；`brackets / parentheses` 分别显示为“方括号 / 圆括号”。
- 圆角算法新增固有大圆角保护：源半径达到 `2.5` 的圆形节点、仓库外壳和大转弯不再随全局圆角滑杆重算；小直线折角仍可调，内部 `stroke2 / fill2` 继续完全不参与外部圆角处理。
- 圆角算法定向校验通过：`git-repository` 的书脊大圆角与 `git-merge` 的合并大转弯在圆角值 4 时保持原始曲线，普通直线折角仍生成可编辑圆弧。
- 本地页面实测默认显示 `开发 (27)`；搜索“括号”准确返回“花括号 / 方括号 / 圆括号”，47 个填充节点全部透明、可见白色填充为 0，控制台无错误。
- 用户输入“继续”确认「描边 → 开发」验收通过，并开始「描边 → 设备」。
- 「设备」74 枚图标从 TDesign 官方 `develop` 分支的 `manifest.outline.Device` 与对应 `svg/*.svg` 生成，首枚为 `airplay-wave`、末枚为 `keyboard-1`；数量、官方顺序、名称唯一性和 `0 0 24 24` viewBox 均已校验，可见名称全部使用唯一中文名称，英文源名称继续作为搜索别名。
- 修正设备分类中不准确或含英文的上游关键词：`call-off`、`mobile`、`mode-light`、`rss`、`video-camera`、`watch` 等使用符合图形语义的中文标签和搜索词。
- 本地页面实测默认显示 `设备 (74)`，首枚为「隔空播放」、末枚为「键盘二」；搜索“电话卡”准确返回三枚电话卡图标，71 个填充节点全部透明、可见白色填充为 0，控制台无错误。
- 用户补充内部小点规则：所有点状细节均不得随全局圆角变化。圆角算法现将宽高不超过 `0.25` 个源坐标单位的独立微型子路径视为固定语义细节，即使它与外轮廓共用 `stroke1`，节点、大小和形状也保持不变；定向校验确认“数据”两枚指示点和“手机振动”的底部点在圆角 `0 → 6` 时完全一致，而外部矩形正常圆角化。
- 用户输入“继续”确认修正后的「描边 → 设备」验收通过，并开始「描边 → 文档」。
- 「文档」67 枚图标从 TDesign 官方 `develop` 分支的 `manifest.outline.Document` 与对应 `svg/*.svg` 生成，首枚为 `abstract`、末枚为 `divider-1`；数量、官方顺序、名称与中文标签唯一性均已校验。除官方 `font-background` 保留原始 `0 0 24 25` viewBox 外，其余 66 枚均为 `0 0 24 24`。
- 文档分类的可见名称全部中文化，并修正 `bulletpoint / functions / space / list-bug` 等不自然或易误解的上游翻译；官方 `summary` 实心路径和 `automatic-numbering` 点状填充由硬编码黑色改为 `currentColor`，可跟随全局颜色。
- 本地页面实测默认显示 `文档 (67)`，首枚为「摘要」、末枚为「分隔线」；搜索“文本框”准确返回中文、英文、日文、韩文四枚文本框图标，32 个遮罩填充节点全部透明、可见白色填充为 0，`summary` 计算颜色与当前主色一致，控制台无错误。
- 用户确认「描边 → 文档」并明确要求跳过「其他」与「表情」，直接进入「文件」；两类均未生成本地图标数据，点击分类会提示“已按要求跳过”并保持当前文件分类。
- 「文件」96 枚图标从 TDesign 官方 `develop` 分支的 `manifest.outline.File` 与对应 `svg/*.svg` 生成，首枚为 `bill`、末枚为 `upload-1`；数量、官方顺序、名称与中文标签唯一性均已校验，全部保留 `0 0 24 24` viewBox。
- 文件分类可见名称全部中文化：格式缩写和产品英文名称改为“逗号分隔文件 / 数据交换文件 / 标记文本文件 / 笔记文件 / 邮件文件 / 便携文档 / 演示文稿 / 纯文本文件 / 文字文档 / 配置文件”等中文语义名称；官方英文源名仍可用于搜索。
- 本地页面实测默认显示 `文件 (96)`，首枚为「账单」、末枚为「上传文件」；搜索 `file-code` 准确返回「代码文件一 / 代码文件二」，可见白色填充为 0，控制台无错误。
- 用户确认「描边 → 文件」，并要求把截图框出的「食品 / 手势 / 字母 / 数学 / 数字 / 天气」全部跳过，将其余分类一次性导入；六类均未生成图标数据，并统一使用“已按要求跳过”提示。
- 本次一次性导入「图片」36 枚、「地图」51 枚、「媒体」60 枚、「系统」47 枚和「用户」44 枚，当前共 238 枚。除下述产品删除项外，五类的官方顺序、源名称、唯一中文标签和 `0 0 24 24` viewBox 均与 TDesign 官方 manifest 对齐。
- 本地浏览器逐类实测：`图片 (36)` 从「调整」到「视觉识别」、`地图 (51)` 从「地图相机」到「提高分辨率」、`媒体 (60)` 从「后退」到「语音波形」、`系统 (47)` 从「添加矩形」到「网页」、`用户 (44)` 从「用户证书」到「验证」；五类可见白色填充均为 0，控制台无错误。
- 按用户截图永久删除媒体分类的 `pause-circle / play / play-circle / stop / stop-circle`（圆形暂停、播放、圆形播放、停止、圆形停止）和系统分类的 `loading`（加载中）；删除项进入导入脚本的源码级排除集合，后续重新生成分类时也不会恢复。
- `menu-application / more / ellipsis`（应用菜单、更多、省略号）被设为固定几何图标：网页预览和复制 SVG 均忽略全局圆角值，始终保留官方原始节点与方形点阵。
- 顶部图标总数改为直接汇总 17 个已导入分类的数组长度，当前实际值为 `940 图标`；原 `2355 图标 | 设计源文件` 静态信息已移除。
- 左侧样式控件、分类容器和分类按钮统一使用侧栏内容区的 `100%` 宽度，不再使用超过可用宽度的 `109px` 固定值，因此描边底块和选中分类底块不会越过右侧分隔线。
- 用户进一步要求移除单独的「描边」状态块；页面已删除该无交互价值的控件和对应 CSS，分类列表不保留原控件的空白占位。

## 下一步

等待用户一次性确认当前「图片 / 地图 / 媒体 / 系统 / 用户」五个分类。未确认前不提交推送、不部署线上。
