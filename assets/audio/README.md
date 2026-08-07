# Audio assets

阶段六A 不包含正式音乐文件。将后续授权确认的音乐放在此目录，并在
`js/audio-config.js` 中为对应事件填写 `path`；管理器只会预加载配置了路径的文件。

建议命名：

- `music/menu-loop.ogg` — 主菜单循环音乐
- `music/level-loop.ogg` — 关卡循环音乐

短音效目前由 Web Audio 程序化合成，无需外部文件。若以后改用音频文件，应继续通过
`audio-config.js` 注册，避免在关卡代码中散落路径和音量参数。
