# HANDOFF.md

Continuation brief for resuming this project on another computer or in a new Codex task.

> Current entry point: read `PROJECT_CONTEXT.md` first, then `ICON_REDRAW_STANDARD.md` and `ICON_REDRAW_PROGRESS.md`. This file is the detailed decision log. Deleted entries remain excluded.

## 2026-09-15: Project memory consolidated

- `PROJECT_CONTEXT.md` was reorganized as the canonical new-task entry point. It now includes the product problems, implemented feature inventory, current stop point, code map, data flow, persistence matrix, real local project path, task-routing table, known limitations, and reusable continuation prompts.
- The active project is `/Users/faker/Documents/New project/icon-tool`. `/Users/faker/Documents/icontool` is currently an empty Git working directory and must not be mistaken for the running Vite project.
- The current icon status remains unchanged: 271 icons have been confirmed overall; `精确准确、快速高效、开放、灵活扩展、区块、红包` were reopened only for the latest size adjustments and still require visual reconfirmation. Do not start another redraw batch until that review is resolved.
- No application behavior or icon geometry was changed during this documentation pass.

## 2026-09-11: Final visible batch confirmed

- The product owner confirmed `音乐、性能计算、数据监管、远程穿透、智能合约` without further changes.
- At that point the latest visible page scope had 271 user-confirmed icons and no pending redraw batch.
- Later visual review reopened `精确准确`, `快速高效`, `开放`, and `灵活扩展` for a slight overall size increase without changing their confirmed topology. Their optical scales are now `1.05`, `1.06`, `0.94`, and `1.06`; they await visual reconfirmation.
- `区块` and `红包` were also reopened for size only. `区块` now uses a circle keyline at `0.9286` (about 26px vertical extent). `红包` uses the prescribed `22×26` vertical keyline; its source 4:5 proportion fits to about `20.8×26px` without distortion.

## 2026-09-11: Category moves persist locally

- Dragging an icon to a semantic category is a maintainer-only local feature, enabled only on `localhost`, `127.0.0.1`, and `::1`. The explanatory drag hint is intentionally hidden.
- `categoryOverrides` saves only under the app-scoped local-storage key and is no longer read from or written to Firestore. A refresh restores the current browser's mappings without exposing or syncing the feature to deployed users.
- Visible category labels are now `基础功能`, `业务类`, `生活服务`, and `金融数据类`. The former `金融类` and `数据与设备` groups are one real `finance-data` category; persisted legacy values `commerce` and `data` migrate into it on read.
- Icon-name overrides now have an explicit labeled editor in the detail dialog and are saved immediately to app-scoped local storage as well as the existing per-user Firestore field. Local names are validated, restored on startup, and take precedence during the initial cloud merge.

## 2026-09-10: Consolidated project and generation standard

- `PROJECT_CONTEXT.md` is now the canonical new-task entry point and contains the architecture, data boundaries, coordinate systems, export behavior, commands, current progress, and continuation prompt.
- `ICON_REDRAW_STANDARD.md` now covers both hand redraws and AI generation. The code contract is versioned as `FS-LINE-2026.09` in `src/icon-generation-standard.ts`.
- The AI 24×24 keylines are exact 0.75-scale mappings of the approved 32×32 keylines. New results must be one absolute-command `<path d="..." fill="none">` within bounds.
- New standard-version icons bypass the old automatic optical rescale, which previously could shrink an already-correct generated circle or special keyline. Legacy custom icons retain compatible safe parsing and optical scaling.

## 2026-08-31: Source calibration batches

- The product owner requires strict source-order review in batches of 10. Never start the next batch until the current batch is confirmed in the web preview.
- Batch 1: `全屏`, `减-2`, `下载`, `清空`, `眼睛-不可见`, `加-2`, `拖拽-竖`, `提示`, `帮助`, `筛选`.
- Batch 1 was confirmed in the web preview on 2026-09-03. `眼睛-不可见` now uses the circle envelope because its diagonal makes the complete source contour nearly square; the previous horizontal envelope made it visibly undersized.
- Batch 2: `交通-飞机`, `放大`, `变大`, `主页`, `交通-公交`, `分隔符-斜杠`, `企业`, `时间日期`, `路线`, `时间日期-秒表`.
- Batch 2 was confirmed in the web preview on 2026-09-03. `交通-公交` includes the source side-mirror strokes and corrected body side positions. `交通-飞机`, `交通-公交`, `企业`, and `路线` use the larger irregular-shape envelope; the route stem and upper curve are continuous.
- Batch 3: `银行`, `变小`, `分隔符-箭头`, `侧边-收起`, `历史记录`, `回到顶部`, `加-3`, `通用`, `定位`, `旋转`.
- Batch 3 was confirmed in the web preview on 2026-09-04. `变小` keeps its source-bound parametric implementation and its inward arrow tips were moved closer to reduce excessive centre spacing. `银行` and `通用` use the smaller square envelope; `定位` uses the larger envelope.
- Batch 4: `导出`, `保存`, `通知`, `地图`, `搜索`, `反馈-成功`, `减-3`, `下午茶`, `减`, `设置`. All ten are in `iconfontCalibratedIconNames` and are waiting for user approval.
- Batch 4 was confirmed in the web preview on 2026-09-04. `地图`, `下午茶`, and `设置` use the larger envelope; `地图` additionally uses a `0.96` optical scale because it sits between the square and large keyline tiers.
- Batch 5: `删除`, `眼睛-可见`, `反馈-警告`, `关闭`, `收藏`, `上传`, `锁`, `侧边-展开`, `时间日期-时间`, `反馈-错误`. All ten are in `iconfontCalibratedIconNames` and are waiting for user approval.
- Batch 5 was confirmed in the web preview on 2026-09-04. `锁` was changed from the square to the larger envelope after its compact two-part silhouette appeared substantially undersized.
- Batch 6: `加`, `瀑布流`, `闪电`, `刷新`, `缩小`, `时间日期-日期`, `美化`, `交通-出租车`, `开关`, `工具箱`.
- Batch 6 was confirmed in the web preview on 2026-09-08. Circular-arrow geometry for `刷新` was refined during review: its arrow is an independent rounded three-point polyline and the arc connects at one arrow tail.
- Batch 7: `全屏-退出`, `交通-高铁`, `标签`, `医疗箱`, `发送`, `单箭头-上`, `单箭头-下`, `单箭头-左`, `单箭头-右`, `上箭头`. All ten are in `iconfontCalibratedIconNames` and are waiting for user approval.
- Batch 7 was confirmed in the web preview on 2026-09-08.
- A later cross-batch review moved `标签` and `发送` from the circle to the square keyline because their complete pointed silhouettes looked too large despite large internal voids.
- Batch 8: `双箭头-右`, `双箭头-左`, `双箭头-下`, `右箭头`, `双箭头-上`, `左箭头`, `下箭头`, `对比`, `编辑`, `对齐-底`. All ten are in `iconfontCalibratedIconNames` and are waiting for user approval.
- During Batch 8 review, `对比` was enlarged from the square to the circle keyline because its dashed right edge and large internal void made the square footprint look too small.
- Batch 8 was confirmed in the web preview on 2026-09-08.
- Batch 9: `等比缩放`, `对齐-左`, `表格`, `对齐-垂直居中`, `对齐-右`, `分界线`, `清除`, `附件`, `撤销`, `复制`. All ten are in `iconfontCalibratedIconNames` and are waiting for user approval.
- During Batch 9 review, `附件` and `撤销` moved from the circle to the square keyline because their continuous directional curves looked too large at the full `28×28` footprint.
- Batch 9 was confirmed in the web preview on 2026-09-08.
- After icons were deleted in the UI, the product owner required all later grouping to follow the latest visible page order rather than the old static source order. The six still-visible items before `链接` (`对齐-水平居中`, `排序-降序`, `间距-水平分布`, `截图`, `语言-中文`, `排序-升序`) are confirmed. Deleted entries are skipped. `截图` remains two continuous crop-frame sections plus a plain upper-right diagonal line; it has no arrowhead.
- Current visible-order batch, explicitly anchored by the product owner at `链接`: `链接`, `文字缩进减少`, `文字缩进增加`, `文字列表`, `剪切板`, `语言-翻译`, `语言-英文`, `重做`, `自动列宽`, `文字识别`. `链接` was redrawn after review to restore the source's 45-degree interlocking double-link silhouette instead of the rejected narrow vertical `S/8` shape. `语言-翻译` restores the source `A`; `语言-英文` restores the complete `En` mark, with the inner letter group reduced and horizontally centered independently of the frame.
- Cross-batch refinement: `语言-中文` keeps its confirmed outer frame, while the inner `中` glyph is reduced and centered independently so it no longer crowds the frame.
- The batch anchored at `链接` was confirmed after the `链接`, `语言-英文`, and `语言-中文` refinements.
- Current visible-order batch: `emoji`, `人员-信息`, `消息`, `排行榜`, `组织管理`, `点赞`, `用户画像`, `群组`, `公告`, `服务`. The old drafts for `点赞`, `公告`, and `服务` used unrelated common-library metaphors; they are now redrawn as the source heart, hanging notice board, and interlocking-heart service mark. `组织管理`, `消息`, and `用户画像` also restore their source node shapes and semantic details.
- The `emoji` through `服务` batch was confirmed by the product owner.
- Current visible-order batch: `皇冠`, `护照`, `邮件`, `用户`, `VIP`, `聊天记录`, `邮件-下载`, `邮件-已读`, `消息-已发送`, `人员-加`. `护照` restores the source portrait instead of a globe; `VIP` removes invented diamond facets; `聊天记录` restores the single message frame, two dots, and lower-right record mark. The attempted family-style unification for `邮件-下载` and `邮件-已读` was rejected. Both now follow the original Iconfont source 1:1: the download variant has right/bottom clearance for its arrow, while the read variant is a vertical open envelope with no checkmark.
- `人员-加` keeps the source plus position while shortening the shoulder line to the source endpoint, restoring a clear gap between the person silhouette and `+`.
- During review, `皇冠` and `VIP` moved from the square to the larger keyline because their angular outlines contain large internal voids and appeared undersized.
- The batch from `皇冠` through `人员-加` was confirmed after source-faithful mail variants, person/plus spacing, and larger `皇冠`/`VIP` sizing were applied.
- Current visible-order batch: `人员-删除`, `人员-减`, `消息-添加`, `礼物`, `身份证`, `评论`, `话题`, `卡包`, `密码箱-打开`, `钥匙`. The three person-status icons share the same source person base and keep clear symbol spacing. `消息-添加`, `评论`, and `话题` restore their source bubble structures; `密码箱-打开` restores the perspective door; `钥匙` restores the lower-left ring and upper-right shaft direction.
- During review, `钥匙` moved from the large to the square keyline because its long diagonal shaft already carries strong directional weight and appeared oversized.
- During review, `消息-添加` and `评论` moved from the square to the larger keyline because their interrupted/stacked bubble contours and lightweight status details appeared undersized.
- `聊天记录` and `消息-添加` both use the large keyline, but their clock and plus marks produce different total SVG bounds. They therefore use optical scales `0.892` and `0.94` respectively, so the shared bubble outline—not the whole variant bounds—renders at the same size.
- The batch from `人员-删除` through `钥匙` was confirmed by the product owner after matching the rendered `聊天记录` bubble outline to `消息-添加`.
- Cross-batch size refinement: `用户`, `人员-加`, `人员-删除`, and `人员-减` remain on the large keyline but now share a `0.94` optical scale after all four appeared slightly oversized.
- Current visible-order batch: `购物车`, `银行卡`, `微信支付`, `钱包`, `计算`, `扫描`, `转入`, `条形码`, `盾-危害`, `警报`. The redraw restores the source cart wheels and continuous frame, the WeChat Pay contour-linked payment stroke, the wallet's integrated top/card construction, the arithmetic-symbol `计算` geometry, the full-width scanner line, the source-directed entry arrow, all seven barcode strokes, the original shield proportions, and the source alarm base structure.
- During review, the three warning rays on `警报` became stroke-relative geometry: each ray uses the selected stroke width as its thickness and a centreline length of exactly `2 × strokeWidth`.
- `警报` moved from the square to the large keyline after review because its three lightweight rays enlarge the total bounds while the hollow siren body remains visually undersized.
- The batch from `购物车` through `警报` was confirmed by the product owner after the alarm-ray and icon-family size refinements.
- Current visible-order batch: `转出`, `票`, `插卡`, `盾-疑问`, `红包`, `盾-安全`, `密码箱-关闭`, `支付码`, `盾-警告`, `盾-财产安全`. The batch restores the reverse transfer direction, ticket side notches, inserted-card topology, the source red-envelope flap, the closed safe's circular control, the payment code's four bars, and the distinct question/check/exclamation/RMB semantics inside the shared source shield.
- During review, the five completed shield variants (`盾-危害`, `盾-疑问`, `盾-安全`, `盾-警告`, `盾-财产安全`) moved from the square to the large keyline because their tapered outline and large inner cavity appeared undersized. The full large keyline then appeared slightly oversized, so all five now share a `0.94` optical scale.
- The batch from `转出` through `盾-财产安全` was confirmed by the product owner.
- Current visible-order batch: `盾-提示`, `认证`, `理财产品`, `金融日期`, `兑换`, `金币`, `自选`, `黄金`, `图片`, `WiFi`. It restores the source information mark inside the shield, certification badge, handled investment bag, calendar trend, circular exchange arrows, single RMB coin, bookmark-plus favorite, three-bar gold layout, image frame, and WiFi arc stack.
- `盾-提示` follows the confirmed shield family sizing: large keyline with `0.94` optical scale. `WiFi` uses the horizontal keyline because its complete arc group, rather than the bottom point, defines the visual extent.
- During review, `认证` moved from the square to the large keyline because its notched badge perimeter and large inner cavity made the square rendering appear undersized.
- The batch from `盾-提示` through `WiFi` was confirmed by the product owner after enlarging `认证` to the large keyline.
- Current visible-order batch: `图片-加载失败`, `显示器`, `相机`, `录音`, `路由器`, `电话`, `WIFI-未连接`, `暂停`, `视频通话`, `USB`. The redraw restores the failed-image frame opening, source monitor stand, camera lens proportions, complete microphone capsule and pickup arc, router indicators, telephone contour, interrupted disconnected-WiFi arcs, pause circle, video-camera body, and USB contacts.
- During review, `图片-加载失败` and `路由器` were too small on the square keyline and too large at the full large keyline; both now use the large keyline with `0.9286` optical scale, yielding an approximately `26px` centreline extent.
- The batch from `图片-加载失败` through `USB` was confirmed by the product owner after setting `图片-加载失败` and `路由器` to the intermediate `26px` extent.
- Current visible-order batch: `相机-禁用`, `音量-关闭`, `图片-添加`, `音量-大`, `收音机`, `打印机`, `音量-小`, `设备`, `录音-关闭`, `视频文件`. It restores shared camera/image/speaker bases, source-relative slash interruptions, radio antenna and knob proportions, printer paper topology, device layering, muted microphone segmentation, and the original video-file slate.
- Cross-batch refinement: `电话` remains on the large keyline but uses `0.9286` optical scale after the full `28px` rendering appeared oversized.
- During current-batch review, `音量-关闭` moved from the horizontal to the large keyline because the separated speaker and close mark appeared undersized.
- During current-batch review, `打印机` had an incomplete left shell caused by an incorrect subpath close; the left shell now explicitly continues from the paper opening back to the top edge.
- During current-batch review, the earlier right-arc extension on `录音-关闭` was reverted after clarification. The microphone body remains unchanged, while the diagonal slash keeps its centre and angle but is shortened by about 10% at both ends.
- The batch from `相机-禁用` through `视频文件` was confirmed by the product owner after phone/mute sizing, printer-shell completion, and the shortened muted-microphone slash.
- Combined visible-order review batch, reopened at the product owner's request: `终端`, `最小值`, `折线图`, `数据显示`, `雷达图`, `平均值`, `调试`, `智能AI`, `数据-错误`, `代码`, `数据-节点`, `数据-切换`, `数据-下载`, `数据库`, `数据-锁定`, `精确准确`, `快速高效`, `开放`, `灵活扩展`, `流转`. The first ten retain their source-calibrated terminal, chart, slider, AI, database-error, and code structures. The second ten restore the source-specific database variants, square crosshair, vertical booster/rocket, three-node open network, three-branch expansion structure, and paired rectangular return arrows.
- The database state icons are not forced onto one generic silhouette: `数据-节点` keeps the source's narrower cylinder and outlined bottom node, while `数据-切换`, `数据-下载`, `数据库`, `数据-锁定`, and the preceding `数据-错误` use the wider source cylinder and preserve the lower-right clearance required by each state mark.
- During the combined-batch review, `精确准确` moved from the square to the large keyline because its four projecting ticks and large internal void made the `24×24` rendering appear undersized; its internal crosshair proportions remain unchanged.
- During the combined-batch review, `快速高效` was corrected from a closed generic up-arrow outline to the source's open-bottom booster structure with two side wings and an independent central thrust line.
- During the combined-batch review, `开放` appeared oversized and its three connector segments did not read as one circle. It now uses three equal-radius node rings, three segments of one concentric circular path, and a `0.90` optical scale on the large keyline.
- During the combined-batch review, `流转` moved from the square to the large keyline because the two open rectangular return arrows appeared undersized; their source proportions remain unchanged.
- The combined 20-icon batch from `终端` through `流转` was confirmed by the product owner after the `精确准确`, `快速高效`, `开放`, and `流转` refinements.
- Current visible-order batch: `应用场景`, `版权`, `处方`, `查验`, `接口配置`, `管理`, `印章认证`, `文档`, `证照执照`, `安全隐私`. `查验` retains its previously confirmed parametric source reconstruction. The other nine restore the source four-tile grid, copyright ring, prescription clipboard, three circular sliders, gear, sloped stamp, folded document, star-marked licence, and source-specific shield/check proportions.
- During review, `查验` retained its source topology but its complete centreline footprint was enlarged from approximately `21px` to `24px`; the three frame corners, lens, and handle move together while the selected physical stroke width remains unchanged.
- The batch from `应用场景` through `安全隐私` was confirmed by the product owner after enlarging `查验` while retaining its source topology.
- Current visible-order batch: `公益`, `身份认证`, `身份识别认证`, `隐私保护`, `真实可信`, `政府`, `邮件邮箱`, `仓储仓库`, `发票`, `订单`. It restores the source heart-shaped charity mark, horizontal identity card, four-corner identity scanner, padlock-based privacy mark, notched trust badge, three-bay government building, fully folded envelope, warehouse shelves, layered zigzag invoice, and clipboard order.
- Cross-batch correction: `安全隐私` now closes its shield explicitly back at the top point, preventing the corner-radius pipeline from producing a leaf-like overlap at the apex while retaining the source's curved lower shield.
- During current-batch review, `仓储仓库` and `发票` appeared undersized on the square keyline. Both now use the large keyline with a `26/28` optical scale, preserving their internal source proportions and physical stroke width.
- The batch from `公益` through `订单` was confirmed by the product owner after correcting the earlier `安全隐私` shield apex and enlarging `仓储仓库` and `发票` to an intermediate `26px` footprint.
- Current visible-order batch: `工厂`, `合同`, `海关港口`, `降本`, `卖家购物车`, `卖家店铺`, `票据`, `全领域规模`, `欧元`, `美元`. It restores the factory ribbon and stroke-relative window points, document certification medallion, source anchor construction, cost-reduction window, handle-free seller cart, awning-only seller shop, notched divided ticket, staggered four-module scale mark, and the complete circular euro/dollar marks.
- During current-batch review, `合同` moved from the vertical keyline to the large keyline because its separated document and certification-medallion structure appeared undersized; all parts scale together.
- During current-batch review, `卖家店铺` was aligned to the approved storefront style: straight canopy top, sloped sides, three evenly paced rounded scallops, and a U-shaped lower shop body without added doors or windows.
- The batch from `工厂` through `美元` was confirmed by the product owner after enlarging `合同` and aligning `卖家店铺` with the approved three-scallop storefront style.
- Current visible-order batch: `人民币`, `扫码`, `融资资金`, `全球跨境`, `商业化全球`, `信用卡银行卡`, `物流`, `医疗服务`, `医疗机构`, `底层架构`. It restores the circular RMB mark, scan corners and scanline, circle-and-diamond funding mark, orbital cross-border globe, continent-based commercial globe, source card stripe/detail, source logistics body, distinct medical kit and institution, and the three-layer architecture stack.
- During current-batch review, `全球跨境` remained on the large keyline and received a `1.08` optical scale because its sparse globe-and-orbit structure appeared undersized.
- During current-batch review, `物流` was rebuilt as a complete left-cab/right-cargo truck with connected bodywork and two equal wheels; the prior partial contour did not match the source visual style.
- The logistics truck's lower body line is hidden only inside each wheel. Its four visible segments terminate exactly at the circle intersections, so the baseline remains visually connected to both wheels without showing a horizontal stroke inside them.
- The batch from `人民币` through `底层架构` was confirmed by the product owner after enlarging `全球跨境` and rebuilding the logistics truck with a connected, wheel-aware lower baseline.
- Current visible-order batch: `饼图图表`, `分布式`, `存储`, `服务器`, `分支`, `丰富多元`, `哈希`, `技术服务`, `监管风控`, `联盟链`. It restores the pie-sector construction, three hexagonal distributed nodes, floppy-disk storage mark, unified three-tier server, hierarchy branch nodes, source two-node diversity path, framed hash, monitor/code service mark, source risk-control shield line, and three-way alliance skeleton.
- During review, the product owner specified a centered cross inside `监管风控`; the earlier diagonal internal mark was replaced while the shield outline and size remain unchanged.
- During review, `联盟链` was corrected from a plain three-ended Y to the source's three-direction pointed branch, with connected narrow tips at the upper, lower-left, and lower-right ends.
- The batch from `饼图图表` through `联盟链` was confirmed by the product owner after replacing the risk-control interior with a centered cross and restoring the alliance chain's three connected pointed ends.
- Current visible-order batch: `区块`, `平台`, `上云`, `时间周期`, `时间戳`, `数字化`, `图表柱图`, `溯源`, `稳定可靠`, `网络`. It restores the three-face cube, content-line monitor, cloud with diamond up-arrow, source hourglass, circular clock, split pie, three outlined bars, concentric trace target, three-ring triangular stability network, and latitude/longitude globe.
- During current-batch review, `上云` retained its horizontal keyline and received a `1.08` optical scale because the open cloud body and small internal arrow appeared undersized; its complete geometry scales together while physical stroke width remains unchanged.
- During current-batch review, `数字化` received a `0.90` optical scale because its closed pie body and right-angle dividers appeared oversized on the full circular keyline; both pie sections keep their source spacing and scale together.
- During current-batch review, `溯源` was corrected from a clock-like outline to two concentric rings joined by a radial lower-right bar. `稳定可靠` was corrected from a pendant-like triangle to three equal hollow circles connected by three triangle edges.
- Cross-batch correction: `时间周期` retained the source hourglass topology and received a `0.90` optical scale after appearing oversized; all hourglass parts scale together while stroke width remains unchanged.
- The batch from `区块` through `网络` was confirmed by the product owner after enlarging `上云`, reducing `数字化`, and restoring the source topology of `溯源` and `稳定可靠`.
- Current visible-order remainder: `音乐`, `性能计算`, `数据监管`, `远程穿透`, `智能合约`. Only five icons remain after `网络` in the latest webpage order; deleted icons are not reinserted to fill a ten-icon batch. The five restore the source double-note, pin-grid processor, chart monitor, shared-axis penetration arrow, and contract command panel.
- Cross-batch correction: `眼睛-不可见` uses its initially confirmed complete flattened eye and circular pupil. The diagonal slash keeps the initial angle but is shortened to `90%` of its initial length; split-arc and circular-outline experiments remain rejected.
- During final-batch review, `音乐`, `性能计算`, `数据监管`, and `远程穿透` each received a `1.10` optical scale because sparse stems, pins, short bars, and open frames made their effective visual bodies smaller than their nominal geometric bounds.
- Calibrated 24×24 source paths now use `OpticalGridGroup` mode `source` (scale 1). This fixes the previous second optical-fit pass that distorted verified source geometry.
- `scripts/generate-iconfont-calibration-sheet.mjs` generates original contour / current centreline / overlay sheets for each 10-icon review batch.
- MasterGo copy now bakes the live SVG/viewBox/keyline transform into the editable path coordinates, normalizes the copied `viewBox` to the selected pixel size, and writes the rendered physical stroke width onto the path. This prevents MasterGo from exposing the compensated internal stroke width or the 24/32-unit reference canvas instead of the user's size settings.
- Keyline dimensions are centreline geometry dimensions, not stroke-inclusive visible bounds. Canonical fitting must not subtract the stroke: square paths are `24×24`, circle paths are `28×28`, vertical paths fit within `22×26`, and horizontal paths fit within `26×22` in MasterGo. Stroke width remains the independently selected physical value.
- Pure left/right separator arrows use a dedicated `10×18` centreline keyline (`18×10` when rotated vertically). The standalone close icon uses a dedicated `18.5×18.5` keyline. These profiles do not apply to compound icons that merely contain an arrow or cross.
- Batch 7 extends the pure-arrow rule to `单箭头-*`: left/right use `arrow` (`10×18`), while up/down use the distinct `arrow-horizontal` profile (`18×10`). `全屏-退出` uses the same square keyline as the confirmed `全屏` icon.
- The paired diagonal resize icons `变大` and `变小` use a dedicated `22×22` centreline keyline.
- Circular-arrow icons keep the circular arc and arrow corner as separate structures inside one SVG path. The arrow is one continuous three-point polyline so its middle tip responds to `R0/R1/R2`; the arc connects to one arrow tail, never to the arrow's middle tip. Both arrow legs are equal and visibly distinct. `旋转`, `历史记录`, and `刷新` share this geometry; do not bridge gaps with auxiliary segments or mere proximity.
- `上传` and `锁` remain on the circle keyline and use `0.90` optical scale; user comparison found `0.92` too large and `0.80` too small.
- Current stop point: the final visible batch from `音乐` through `智能合约` has been confirmed. Show the six reopened size refinements (`精确准确、快速高效、开放、灵活扩展、区块、红包`) in the web preview and wait for visual reconfirmation. Do not continue automatically.

## Context

This is a Vite + React icon library tool with Firebase per-user sync, Vercel deployment, and Gemini-powered SVG icon generation.

Repository: `https://github.com/yizahu7-rgb/icon-tool.git`

Branch: `main`

## Product Requirements Already Established

- Teammates need a practical internal icon tool, not a marketing site.
- Each person has their own icon library.
- Gemini secrets stay server-side.
- Prefer Gemini 3-family models; Gemini 2.5 quality was not acceptable.
- GitHub syncs code; committed handoff documents sync project context.
- Do not copy `~/.codex` between computers.

## Implemented Features

- Source-matched AntChain/SDICS line-icon browsing, search, category filters, size, stroke, and geometric-radius controls.
- JSX/SVG copy and SVG/PNG download.
- Custom icon support and editable icon names.
- AI icon generation from text or an optional compressed reference image.
- Vercel serverless Gemini endpoint with server-side key handling.
- Firebase Anonymous Auth and per-user Firestore state.
- Light/dark mode and responsive navigation.
- Gemini model fallback with the actual successful model returned by the API.

## Changes In The Current Continuation

- Imported source SVG data from the two approved Iconfont collections:
  - AntChain collection `26815`.
  - SDICS collection `54209`.
  - Exact source SVGs are stored under `scripts/iconfont-source-*.json`.
  - The generated medial-axis data in `src/iconfont-source-icons.generated.ts` is now considered an **uncertified draft only**. It split complex icons at graph branches and produced disconnected or malformed paths in MasterGo; it must not be treated as finished source-faithful artwork.
- Excluded 31 genuinely filled or mixed-fill glyphs from the linear base library, per product direction. Functional stroke primitives such as pause bars and drag dots remain.
- Added `ICON_REDRAW_STANDARD.md`. The approved replacement workflow is now manual, source-faithful centreline reconstruction on a 32×32 grid, one SVG `<path>` object per icon, followed by per-icon visual, parameter, MasterGo, and Iconfont checks.
- Completed the first certified sample icon: `下载` from collection `54209`, source id `47901520`.
  - It is reconstructed directly from the original 1024-grid contour midpoints, not from Lucide or automatic skeleton output.
  - It uses `viewBox="0 0 32 32"`, one `<path>` element, butt caps, miter joins, and responsive radius `0 / 1 / 2`.
  - MasterGo copy uses the unrounded centreline vertices so each intended corner remains a single editable node. Standard SVG cannot retain MasterGo's non-destructive corner-radius metadata, so the current UI radius is intentionally not baked into this copy variant.
  - Iconfont export now bypasses raster tracing for this certified sample. It expands the same geometry into positively wound closed Bézier contours, merges overlaps with vector boolean union, and emits one SVG `<path>` element with `fill-rule="nonzero"`.
- Added the second sample candidate: `主页` from collection `54209`, source id `47901534`.
  - Its five-point house silhouette is reconstructed from the original source on a 32×32 grid; the short centered door keeps the source proportion.
  - The preview and Iconfont export use one closed nonzero path with a fixed outer keyline and a true inward-growing outline.
  - The MasterGo copy swaps in the unrounded five-node house path and marks it as an inner stroke so its intended vertices remain editable.
  - It still needs the user's final MasterGo import check before being marked certified.
- Completed and received user approval for the third certified sample: `查验` from collection `26815`, source id `18267910`.
  - It is rebuilt on a 32×32 grid from the source contour, with three parametric frame corners and an intrinsic magnifier curve.
  - All semantic pieces are subpaths of one SVG `<path>`; radius 0/1/2 changes only the three frame corners.
- Applied the certified structural contract to the complete 296-icon linear library, but this is only a structural draft and is **not** a complete visual redraw.
  - Every rendered base icon now contains exactly one drawing `<path>` and no sibling `rect`, `circle`, `line`, polyline, polygon, or ellipse shapes.
  - Multiple semantic pieces remain `M` subpaths inside that single vector object.
  - Source-derived icons now canonicalize baked outline fillets to sharp MasterGo-editable nodes before applying the live radius.
  - All 296 rendered icons carry their Iconfont collection id and source id for traceability.
  - Browser audit at radius 0/2 found 267 icons with genuine responsive corners; the other 29 consist only of straight strokes, circles, dots, crosses, or intrinsic curves and intentionally do not change.
  - The duplicate Chinese name `链接` is explicitly bound to the SDICS `54209` diagonal chain source used by this library, not the unrelated AntChain overlapping-squares glyph.
  - `勾` and `变小` received explicit source-centreline parametric redraws so their intended arrow/check bends are controlled by the global radius.
- The remaining icons have passed the batch structural and parameter checks, but only the three samples above have completed explicit user visual certification. Do not describe all 296 icons as individually MasterGo-certified until their source-by-source visual review is complete.
- On 2026-08-28 the product owner explicitly rejected treating the automatic batch as visually complete and requested a fresh icon-by-icon redraw. `ICON_REDRAW_PROGRESS.md` is now the source of truth for that effort. Entries in `src/iconfont-curated-icons.ts` override the old medial-axis draft; icons not listed there or in an approved parametric sample remain unfinished.

- Added a shared 24×24 optical grid system for base, parametric, and AI-generated icons.
  - Circle keyline: 20×20; square: 18×18; horizontal: 20×16; vertical: 16×20.
  - Geometry is optically scaled while stroke width and geometric corner radius are inversely compensated.
  - Existing Lucide optical offsets are preserved; generated icons with obvious center drift are corrected.
- Rebuilt the point-bearing status icons (`盾-疑问`, `盾-警告`, `锁`, `密码箱-关闭`, `反馈-警告`, `提示`, `帮助`) as parametric paths.
  - Each dot is part of the same path as its related glyph rather than an independent circle or rectangle.
  - Dot width, dot height, and the question/exclamation gap all follow the configured physical stroke width after optical scaling.
  - The shield, warning-triangle, and lock variants retain MasterGo-editable path geometry.
- Updated the Gemini prompt so future icons follow the same keylines, optical-volume, density, centering, and smooth-curve rules.
- Added strict client-side validation for AI-generated and stored custom SVG fragments.
  - Only basic drawing elements and a small attribute allowlist are accepted.
  - Parser errors, unsupported markup, unsafe URL-like values, oversized output, and text nodes are rejected.
  - Invalid output is never added to the icon library.
- Stored the successful Gemini model on each newly generated custom icon.
- Added compact UI feedback for the most recently used model and model metadata in icon details.
- Made Gemini fallback configurable with server-side `GEMINI_MODELS`.
- Protected `/api/models`; it now requires `GEMINI_MODELS_DEBUG_TOKEN` and a Bearer authorization header.
- Removed the obsolete `GEMINI_MODEL=gemini-2.5-flash` example.
- Added current `AGENTS.md` and `HANDOFF.md` to the repository.

## Gemini Configuration

Default fallback order:

```text
gemini-3.1-flash-lite-preview
gemini-3-flash-preview
gemini-3.1-flash-lite
```

Optional override:

```env
GEMINI_MODELS=gemini-3.1-flash-lite-preview,gemini-3-flash-preview,gemini-3.1-flash-lite
```

Model quotas are separate. A model may appear in the model list while still having `0 / 0` usable quota. The server falls back on unavailable, overloaded, rate-limit, and quota responses.

To temporarily enable model diagnostics:

```env
GEMINI_MODELS_DEBUG_TOKEN=<random server-side secret>
```

Then request `/api/models` with:

```text
Authorization: Bearer <token>
```

Leave the variable unset in production when diagnostics are not needed.

## Firebase

Project used during setup: `yizalucky`

Required services:

- Authentication with Anonymous sign-in enabled.
- Firestore Database enabled.

State path:

```text
artifacts/{appId}/users/{user.uid}/icon_app_state/main
```

This path and `firestore.rules` preserve the “每个人自己的库” requirement.

## Environment Setup

Create `.env.local` on every local computer from `.env.example`. Never commit real values.

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

`GEMINI_API_KEY`, `GEMINI_MODELS`, and `GEMINI_MODELS_DEBUG_TOKEN` are server-side variables and must never use a `VITE_` prefix.

## Resume Workflow

```bash
git pull
npm ci
npm run dev
```

Use `vercel dev` to exercise `/api/*` locally.

Before publishing:

```bash
npm run build
git status --short
git add <changed-files>
git commit -m "Describe the change"
git push origin main
```

## Verification Status

`npm run build` passed after the current changes. Vite still reports the existing warning that the main JavaScript chunk exceeds 500 kB; this is not a build failure.

The two Iconfont collections now have independent hand-authored centerline entries in `src/iconfont-curated-icons.ts` for every non-solid icon. This means the UI no longer falls back to the rejected automatic medial-axis paths. These entries are still in the source-overlay calibration phase; only `下载`, `主页`, and `查验` are user-confirmed samples. Track the distinction in `ICON_REDRAW_PROGRESS.md` and do not describe the remaining entries as 1:1 complete until they have been overlaid and checked individually.

Deleted icon IDs are permanent tombstones. They are saved immediately in local storage under the current app ID and merged with Firestore deletion IDs when cloud sync is available. Never reset or discard `deletedIconIds` as part of a library rebuild, a global-style reset, or source-data regeneration.

`npm ci` currently reports dependency advisories. Review with `npm audit` before deciding on upgrades; do not run a forced audit fix without checking breaking changes.

## Recommended Next Work

1. Add automated unit tests for SVG validation and the Gemini fallback response paths.
2. Add export/import for personal libraries so anonymous users can move data across browsers.
3. Consider code splitting to reduce the initial bundle, especially Firebase loading.
4. Add real login only if users need stable cross-device identity.
5. Add a separate shared library mode only if the user requests team-wide shared icons.
