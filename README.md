# 蛋仔快跑 / Danzi Run

《蛋仔快跑》是一个使用 Phaser 3 制作的原创横版平台解谜游戏，共 20 关。项目保持为纯静态 HTML、CSS、JavaScript 和本地图片资源，不需要 Node.js、数据库或构建工具。

## 本地运行

直接打开 `index.html`，或在仓库根目录运行：

```text
python -m http.server 8765 --bind 127.0.0.1
```

然后打开 `http://127.0.0.1:8765/index.html`。

## 操作

- 桌面端：方向键移动，空格跳跃，`R` 重开当前关卡，`Esc`/`P` 暂停。
- 移动端：左下角左右键移动，点击画面右半区跳跃，左上角齿轮打开暂停和重新开始菜单。
- 游戏建议横屏运行；竖屏时会暂停并显示旋转提示。

## Safari 与全屏游玩

普通 Safari 标签页不允许网页在打开时自动隐藏地址栏。游戏会根据 Safari 当前可见区域动态调整画布，避免地址栏展开或收起时压住游戏和触控按钮。

若要隐藏 Safari 浏览器栏，在 iPhone 或 iPad 的 Safari 中打开正式网址，点击“全屏游玩”，然后按照提示选择“分享”→“添加到主屏幕”。之后从主屏幕上的《蛋仔快跑》图标启动，即可使用独立 PWA 模式。左下角方向键已经针对横屏触控放大，并使用半透明底色减少对关卡画面的遮挡。

## 存档

进度保存在当前浏览器当前域名的 `localStorage` 中，存档键保持为 `block-hero.progress.v1`。

存档包含版本、已解锁和已完成关卡、累计死亡、语言、音量、静音、动态效果偏好和持久收集品。不同浏览器、设备、浏览器配置文件和域名拥有彼此独立的存档。关卡检查点与玩家位置不会写入长期存档。

如果存档损坏，游戏会输出警告并安全回退到新游戏；如果 `localStorage` 被浏览器阻止，游戏继续运行并在当前页面会话内保留内存进度。设置菜单中的“清除全部存档”需要连续确认两次。

## Render Static Site

仓库根目录的 `render.yaml` 定义免费 Static Site：

- Service Type：Static Site
- Root Directory：留空（仓库根目录）
- Build Command：`echo "Static Phaser game - no build required"`
- Publish Directory：`.`
- Auto Deploy：On Commit

将仓库连接到 Render Blueprint 或手动创建 Static Site 后，每次推送到所选分支都会自动部署。项目没有 History API 路由，因此不需要额外 Rewrite。

## 发布新版本

1. 本地通过 HTTP 运行并测试游戏。
2. 提交需要发布的代码和资源。
3. 推送到 Render 所连接的 GitHub 默认分支。
4. 等待 Render 自动部署完成，并始终使用稳定的 `onrender.com` 服务域名测试存档延续。
