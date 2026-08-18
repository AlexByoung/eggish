"use strict";

const LEVEL_NAMES = Object.freeze({
  zh: Object.freeze(['', '糖浆浅滩', '糖箱门廊', '焦糖断桥', '软糖节拍桥', '太妃糖炉廊', '薄荷可可轮班厂', '棉花糖升降站', '棉花糖迷雾地带', '棉花糖雾塔', '棉花糖雾灵殿', '雾潮分岔站', '棉花糖毕业回廊', '雾散镜光桥', '镜子花园', '小泥人被抓走了', '一个人的机关路', '寻找小泥人', '小泥人回来了', '风中的两条路', '糖果大考验']),
  en: Object.freeze(['', 'Syrup Shallows', 'Sugar Crate Arcade', 'Caramel Broken Bridge', 'Gummy Rhythm Bridge', 'Toffee Furnace Walk', 'Mint Cocoa Shiftworks', 'Marshmallow Lift Station', 'Marshmallow Mistlands', 'Marshmallow Fog Tower', 'Marshmallow Mist Spirit Hall', 'Fogtide Junction', 'Marshmallow Graduation Gallery', 'Mirrorlight Clearing', 'Mirror Garden', 'Mudling Taken', 'The Solo Mechanism Road', 'Finding Mudling', 'Mudling Returns', 'Two Roads in the Wind', 'The Grand Candy Trial'])
});

const TEXT = Object.freeze({
  'game.title': { zh: '蛋仔快跑', en: 'Danzai Dash' },
  'game.subtitle': { zh: '世界可以乱，但我的糖罐子不能空。', en: 'The world can be a mess, but my candy jar cannot be empty.' },
  'menu.start': { zh: '开始游戏', en: 'START GAME' },
  'menu.continue': { zh: '继续 · 第 {level} 关', en: 'CONTINUE · LEVEL {level}' },
  'menu.levelSelect': { zh: '选择关卡', en: 'LEVEL SELECT' },
  'menu.endingPreview': { zh: '开发模式 · 结局动画预览', en: 'DEV MODE · ENDING PREVIEW' },
  'menu.settings': { zh: '设置', en: 'SETTINGS' },
  'menu.language': { zh: '语言', en: 'LANGUAGE' },
  'menu.fullscreen': { zh: '全屏游玩', en: 'PLAY FULLSCREEN' },
  'menu.back': { zh: '返回', en: 'BACK' },
  'install.title': { zh: '在 Safari 中全屏游玩', en: 'Play fullscreen in Safari' },
  'install.copy': { zh: 'Safari 不允许网页自动隐藏地址栏。添加到主屏幕后，再从图标打开即可进入独立全屏模式。', en: 'Safari does not let websites hide its address bar automatically. Add the game to your Home Screen, then launch it from the icon for standalone fullscreen play.' },
  'install.share': { zh: '点击 Safari 工具栏里的“分享”按钮。', en: 'Tap the Share button in the Safari toolbar.' },
  'install.home': { zh: '选择“添加到主屏幕”。', en: 'Choose “Add to Home Screen”.' },
  'install.launch': { zh: '从主屏幕上的“蛋仔快跑”图标启动游戏。', en: 'Launch the game from its Home Screen icon.' },
  'install.close': { zh: '知道了', en: 'GOT IT' },
  'select.help': { zh: '所有关卡均可自由选择，通关状态会保留。', en: 'Choose any level freely. Completed levels stay marked.' },
  'settings.help': { zh: '声音与画面偏好会和进度一起保存。', en: 'Audio and visual preferences are stored with your progress.' },
  'settings.master': { zh: '主音量', en: 'MASTER' },
  'settings.music': { zh: '音乐', en: 'MUSIC' },
  'settings.sfx': { zh: '音效', en: 'SFX' },
  'settings.soundOn': { zh: '声音：开启', en: 'SOUND: ON' },
  'settings.soundMuted': { zh: '声音：静音', en: 'SOUND: MUTED' },
  'settings.motionFull': { zh: '动态效果：完整', en: 'MOTION: FULL' },
  'settings.motionReduced': { zh: '动态效果：减少', en: 'MOTION: REDUCED' },
  'settings.clearSave': { zh: '清除全部存档', en: 'CLEAR ALL SAVE DATA' },
  'settings.clearConfirm': { zh: '确定要清除全部关卡进度和设置吗？此操作无法撤销。', en: 'Clear all level progress and settings? This cannot be undone.' },
  'settings.clearConfirmAgain': { zh: '请再次确认：永久清除《蛋仔快跑》的全部本地存档？', en: 'Confirm again: permanently clear all local Danzi Run save data?' },
  'pause.title': { zh: '已暂停', en: 'PAUSED' },
  'pause.help': { zh: '游戏停在你离开的地方。', en: 'The game is resting right where you left it.' },
  'pause.resume': { zh: '继续', en: 'RESUME' },
  'pause.restart': { zh: '重新开始本关', en: 'RESTART LEVEL' },
  'pause.main': { zh: '主菜单', en: 'MAIN MENU' },
  'clear.next': { zh: '下一关', en: 'NEXT LEVEL' },
  'clear.replay': { zh: '重玩', en: 'REPLAY' },
  'clear.replayLevel': { zh: '重玩本关', en: 'REPLAY LEVEL' },
  'clear.level': { zh: '关卡完成！', en: 'LEVEL CLEAR!' },
  'clear.all': { zh: '全部完成！', en: 'ALL CLEAR!' },
  'clear.detail': { zh: '第 {level} 关完成', en: 'Level {level} complete' },
  'clear.allDetail': { zh: '已完成全部 {total} 项上游挑战', en: 'All {total} upstream challenges complete' },
  'hud.attempt': { zh: '尝试 {count}', en: 'ATTEMPT {count}' },
  'hud.deaths': { zh: '死亡 {count}', en: 'DEATHS {count}' },
  'hud.level': { zh: '第 {level} 关', en: 'L{level}' },
  'hud.controls': { zh: '移动  ← →    跳跃  空格 ×2    暂停  ESC', en: 'MOVE  ← →    JUMP  SPACE ×2    PAUSE  ESC' },
  'hud.controlsTouch': { zh: '左下左右移动    点击右半屏跳跃 ×2', en: 'MOVE LEFT/RIGHT    TAP RIGHT HALF TO JUMP ×2' },
  'guide.jump': { zh: '按空格键跳跃', en: 'PRESS SPACE TO JUMP' },
  'dialogue.continue': { zh: '点击继续  ▶', en: 'CLICK TO CONTINUE  ▶' },
  'speaker.player': { zh: '蛋仔', en: 'Danzai' },
  'speaker.mud': { zh: '小泥人', en: 'Mudling' },
  'ending.title': { zh: '故事结束', en: 'THE END' },
  'ending.thanks': { zh: '谢谢陪伴蛋仔走了这么远。', en: 'Thank you for accompanying Danzai this far.' },
  'load.error': { zh: 'Phaser 加载失败。请检查网络连接并刷新页面。', en: 'Phaser failed to load. Check your internet connection and refresh the page.' },
  'state.locked': { zh: '未解锁', en: 'locked' },
  'state.complete': { zh: '已完成', en: 'complete' },
  'state.available': { zh: '可游玩', en: 'available' }
});

const LOCALIZED_LINES = new Map([
  ['蛋仔要找到糖果河源头\n因为蛋蛋太唐了', 'Danzai must find the source of the Candy River.\nBecause Dandan is simply too Tang.'],
  ['糖箱门廊：箱子不会自己走。推一下吧。', 'Sugar Crate Arcade: Crates do not move by themselves. Give one a push.'],
  ['焦糖断桥：上游更干了。慢慢走，也会到。', 'Caramel Broken Bridge: It is drier upstream. Take it slowly—you will get there.'],
  ['软糖节拍桥：节拍乱了。准备好再出发。', 'Gummy Rhythm Bridge: The rhythm is broken. Move when you are ready.'],
  ['太妃糖炉廊：火很急。蛋仔不急。', 'Toffee Furnace Walk: The fire is impatient. Danzai is not.'],
  ['薄荷可可轮班厂：尖刺在轮班。等一下也行。', 'Mint Cocoa Shiftworks: The spikes work in shifts. Waiting is fine.'],
  ['棉花糖升降站：梯子慢慢爬，弹簧会自己弹。', 'Marshmallow Lift Station: Climb steadily; the spring will do the bouncing.'],
  ['棉花糖迷雾地带：看不清没关系，先看懂节拍。', 'Marshmallow Mistlands: If you cannot see far, read the rhythm nearby.'],
  ['棉花糖雾塔：五层机关，一层一层来。', 'Marshmallow Fog Tower: Five floors of mechanisms—one floor at a time.'],
  ['棉花糖雾灵殿：它冲过来时，机关就是武器。', 'Marshmallow Mist Spirit Hall: When it charges, the mechanisms become your weapon.'],
  ['雾潮分岔站：看不清也要选，选了就往前。', 'Fogtide Junction: Even in the fog, choose a route and keep moving.'],
  ['棉花糖毕业回廊：前面学过的，差不多都来点。', 'Marshmallow Graduation Gallery: Nearly everything you learned returns here.'],
  ['World 2：棉花糖迷雾', 'World 2: Marshmallow Mist'],
  ['World 2 Boss：棉花糖雾灵', 'World 2 Boss: Marshmallow Mist Spirit'],
  ['World 2：雾潮分岔站', 'World 2: Fogtide Junction'],
  ['World 2：棉花糖迷雾·毕业测验', 'World 2: Marshmallow Mist Graduation Trial'],
  ['World 3：焦糖镜花园', 'World 3: Caramel Mirror Garden'],
  ['World 3：镜子花园', 'World 3: Mirror Garden'],
  ['World 3：小泥人被抓走了', 'World 3: Mudling Taken'],
  ['World 3：一个人的机关路', 'World 3: The Solo Mechanism Road'],
  ['World 3：寻找小泥人', 'World 3: Finding Mudling'],
  ['World 3：小泥人回来了', 'World 3: Mudling Returns'],
  ['World 3：风中的两条路', 'World 3: Two Roads in the Wind'],
  ['最终关：糖果大考验', 'Final Level: The Grand Candy Trial'],
  ['世界一 · 焦糖原野', 'World 1 · Caramel Wilds'],
  ['世界二 · 棉花糖迷雾', 'World 2 · Marshmallow Mist'],
  ['世界三 · 焦糖镜花园', 'World 3 · Caramel Mirror Garden'],
  ['站稳再弹。', 'Get steady before you bounce.'],
  ['先把动作想起来。', 'Remember the moves first.'],
  ['只看炮口。', 'Watch the cannon mouth.'],
  ['下面看炮，云往上。', 'Watch the cannon below; ride the cloud upward.'],
  ['先爬，再等。', 'Climb first, then wait.'],
  ['快慢都看清楚。', 'Read both the fast and slow rhythm.'],
  ['眼前这一拍就好。', 'Only this beat matters.'],
  ['两个糖罐，是同一条路。', 'The two candy jars share one road.'],
  ['糖罐换位置，风再把路线推歪一点。', 'The jars trade places, then the wind bends the route.'],
  ['风会一直推。轻轻反着走就好。', 'The wind keeps pushing. Lean gently against it.'],
  ['先弹上去。分路以后，左边稳一点。', 'Bounce up first. After the split, the left route is steadier.'],
  ['先往右走。最后，还要回来。', 'Go right first. At the end, you must come back.'],
  ['我们……不迷路了。', 'We… are not lost anymore.'],
  ['那就叫你小泥人吧。上来，顺路带你走。', 'Then I will call you Mudling. Hop on—I will take you along.'],
  ['我以为你走掉了。', 'I thought you had left.'],
  ['我只是绕了点路。上来吧。', 'I only took a detour. Climb on.'],
  ['这次，我知道路了。', 'This time, I know the way.'],
  ['那就走吧。别又掉进架子里。', 'Then let’s go. Try not to fall into another rack.'],
  ['我的小人？', 'My little figure?'],
  ['那些黑点……不是我的鞋印吧。', 'Those dark marks… are not my footprints, are they?'],
  ['往上走。罐子应该不会把我倒着吐出来吧。', 'Up we go. The jar will not spit me out upside down, right?'],
  ['……嗯，选哪边都行吧。', '…Either route should be fine, right?'],
  ['……哦，好像这个世界的功课做完了。', '…Oh. I think this world’s lessons are done.'],
  ['就送到这里吧。前面的路，你已经会自己走了。', 'This is where I stop. You already know how to walk the road ahead.'],
  ['谢谢你陪我走过这么远。', 'Thank you for coming this far with me.'],
  ['也谢谢你，一次都没有把我忘下。', 'And thank you for never leaving me behind.'],
  ['再见，小泥人。以后也要记得回家的路。', 'Goodbye, Mudling. Remember the way home.'],
  ['World 2 的最后一小片空闲。', 'One last quiet patch of World 2.'],
  ['引诱点', 'LURE POINT'],
  ['额外雾糖 +1', 'BONUS MIST CANDY +1'],
  ['绕远路 →', 'SAFE DETOUR →'],
  ['看不清的近路 ↗', 'FOGGY SHORTCUT ↗'],
  ['额外雾糖', 'BONUS MIST CANDY'],
  ['小泥人', 'Mudling'],
  ['蛋仔', 'Danzai'],
  ['WAIT, THEN STEP ON', 'WAIT, THEN STEP ON']
]);

const CHINESE_LINE_OVERRIDES = new Map([
  ['WAIT, THEN STEP ON', '等待，再踏上平台'],
  ['World 2：棉花糖迷雾', '世界二：棉花糖迷雾'],
  ['World 2 Boss：棉花糖雾灵', '世界二首领：棉花糖雾灵'],
  ['World 2：雾潮分岔站', '世界二：雾潮分岔站'],
  ['World 2：棉花糖迷雾·毕业测验', '世界二：棉花糖迷雾·毕业测验'],
  ['World 3：焦糖镜花园', '世界三：焦糖镜花园'],
  ['World 3：镜子花园', '世界三：镜子花园'],
  ['World 3：小泥人被抓走了', '世界三：小泥人被抓走了'],
  ['World 3：一个人的机关路', '世界三：一个人的机关路'],
  ['World 3：寻找小泥人', '世界三：寻找小泥人'],
  ['World 3：小泥人回来了', '世界三：小泥人回来了'],
  ['World 3：风中的两条路', '世界三：风中的两条路']
]);

function textFor(key, values = {}) {
  const entry = TEXT[key];
  let value = entry?.[currentLanguage === 'en' ? 'en' : 'zh'] ?? key;
  Object.entries(values).forEach(([name, replacement]) => {
    value = value.replaceAll(`{${name}}`, String(replacement));
  });
  return value;
}

function localizeText(value) {
  if (typeof value !== 'string') return value;
  if (currentLanguage === 'en') return LOCALIZED_LINES.get(value) || value;
  return CHINESE_LINE_OVERRIDES.get(value) || value;
}

function getLevelName(level) {
  return LEVEL_NAMES[currentLanguage === 'en' ? 'en' : 'zh'][level] || '';
}

function getMistBossHudText(phase, state, hits, trapArmed) {
  if (currentLanguage === 'en') {
    const idle = phase === 1
      ? 'PHASE 1 · Use the crate for distance, then lure it into spikes'
      : phase === 2
        ? (trapArmed ? 'PHASE 2 · Trap ready; lure it into the crate' : 'PHASE 2 · Push the crate onto the center button')
        : 'PHASE 3 · Dodge twice; aim the second charge at a trap';
    return ({
      idle,
      warning: `PHASE ${phase} · TARGET LOCKED—JUMP AWAY!`,
      charging: `PHASE ${phase} · DODGE!`,
      comboPause: 'PHASE 3 · FIRST DODGE CLEAR; PREPARE FOR THE SECOND',
      recovery: `HITS ${hits} / 3 · SAFE RECOVERY WINDOW`,
      defeated: 'MIST SPIRIT DISPERSED · EXIT OPEN'
    })[state] || '';
  }
  let idle = `第 ${phase} 阶段 · 观察它的方向`;
  if (phase === 1) idle = '第一阶段 · 借箱子拉开距离，再去糖印引它撞刺';
  if (phase === 2) idle = trapArmed
    ? '第二阶段 · 陷阱就绪，引它撞向箱子'
    : '第二阶段 · 把箱子推到中央按钮上';
  if (phase === 3) idle = '第三阶段 · 连躲两次，第二次引向尖刺或箱子';
  return ({
    idle,
    warning: `第 ${phase} 阶段 · 目标锁定，立刻跳开！`,
    charging: `第 ${phase} 阶段 · 闪开！`,
    comboPause: '第三阶段 · 第一次已躲过，准备第二次',
    recovery: `命中 ${hits} / 3 · 安全恢复时间`,
    defeated: '雾灵消散 · 出口已经开启'
  })[state] || '';
}

function applyDomLanguage() {
  const language = currentLanguage === 'en' ? 'en' : 'zh';
  document.documentElement.lang = language === 'en' ? 'en' : 'zh-CN';
  document.title = textFor('game.title');
  const set = (selector, key) => {
    const element = document.querySelector(selector);
    if (element) element.textContent = textFor(key);
  };
  set('#title-menu h1', 'game.title'); set('#title-menu p', 'game.subtitle');
  set('#open-level-select', 'menu.levelSelect'); set('#open-settings', 'menu.settings');
  set('#open-language', 'menu.language'); set('#level-select-menu h1', 'menu.levelSelect');
  set('#fullscreen-button', 'menu.fullscreen');
  set('#install-help-title', 'install.title'); set('#install-help-copy', 'install.copy');
  set('#install-help-step-share', 'install.share'); set('#install-help-step-home', 'install.home');
  set('#install-help-step-launch', 'install.launch'); set('#install-help-close', 'install.close');
  set('#ending-preview-button', 'menu.endingPreview');
  set('#level-select-menu p', 'select.help'); set('#level-select-back', 'menu.back');
  set('#settings-menu h1', 'menu.settings'); set('#settings-menu p', 'settings.help');
  set('#clear-save-button', 'settings.clearSave');
  set('#settings-back', 'menu.back'); set('#pause-menu h1', 'pause.title');
  set('#pause-menu p', 'pause.help'); set('#resume-button', 'pause.resume');
  set('#restart-button', 'pause.restart'); set('#pause-level-select', 'menu.levelSelect');
  set('#return-title-button', 'pause.main'); set('#next-level-button', 'clear.next');
  set('#clear-level-select-button', 'menu.levelSelect'); set('#load-error', 'load.error');
  const labels = document.querySelectorAll('.audio-settings label');
  ['settings.master', 'settings.music', 'settings.sfx'].forEach((key, index) => {
    if (labels[index]?.firstChild) labels[index].firstChild.nodeValue = `${textFor(key)} `;
  });
  document.querySelector('#game')?.setAttribute(
    'aria-label',
    language === 'en' ? `${textFor('game.title')} 2D platform game` : `${textFor('game.title')} 2D 平台游戏`
  );
  document.querySelector('#title-menu')?.setAttribute('aria-label', textFor('pause.main'));
  document.querySelector('#level-select-menu')?.setAttribute('aria-label', textFor('menu.levelSelect'));
  document.querySelector('#settings-menu')?.setAttribute('aria-label', textFor('menu.settings'));
  document.querySelector('#pause-menu')?.setAttribute('aria-label', textFor('pause.title'));
}
