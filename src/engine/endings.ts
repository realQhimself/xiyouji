// ============================================================
// 西游·心猿 — 结局判定引擎
// ============================================================

import { EndingType } from '../data/types.ts';
import type { GameState, EndingResult, CoreStatKey } from '../data/types.ts';

// ------ 结局文本 ------

const ENDING_TEXTS: Record<EndingType, string> = {
  [EndingType.DouZhanShengFo]: `灵山大殿，佛祖宣号："孙悟空，封斗战胜佛。"

你跪在那里，听到金箍自己碎了。碎片落地的声音很脆，像春天里冰裂的声音。你摸了摸额头——光滑的，什么都没有了。

你站起来，走出大殿。阳光打在脸上，暖的。你回头看了一眼唐僧——他也在笑，笑得跟第一次在五行山下看到你时一模一样。

你心想：原来自由不是翻筋斗云翻出十万八千里。自由是这个箍可以不戴了，但你已经不需要它来约束自己了。`,

  [EndingType.QiTianDaSheng]: `你回到了花果山。

水帘洞还在。但猴子少了很多——五百年太久了，很多都死了，新生的不认识你。一只小猴怯怯地走过来，问："你是谁？"

你说："我是这里的大王。"

它歪着头看你，不太确定该不该信。

你坐在最高的那块石头上，看着天。金箍棒横在膝上。头上的箍还在——没有人替你取掉。它会一直在那里。

你自由了。

但"齐天大圣"四个字，再也没有人叫了。他们叫你"那个妖猴"。`,

  [EndingType.XinYuanGuiZheng]: `佛祖说："孙悟空，封——"

你打断了他。这辈子你打断过很多人，但这一次，你说的声音很轻。

"不用了。"

大殿安静了。唐僧看你。八戒看你。沙僧看你。连佛祖都看着你。

你转身对唐僧说："师父，走吧。咱们回长安。我想吃那边的面。"

唐僧愣了一下，然后笑了。他的笑容你这辈子见过很多次，但这一次最好看。

八戒蹦起来："真的吗？不取经了？太好了！那长安有没有好吃的包子？"

沙僧扛起行李，什么都没说，但走在了最前面。

你们四个人走下灵山。身后是金碧辉煌的佛门，前面是人间的烟火。你头上的箍还在——但你不在乎了。管它呢。`,

  [EndingType.DaShengYunLuo]: `最后的劫难来得没有预兆。一场你连名字都没弄清的灾难——天裂了，地陷了，不知道什么东西从裂缝里涌出来。唐僧挡在身后，你挡在唐僧前面。

你把所有的修为、所有的命、所有的从石头缝里带出来的那股蛮力，全部倒进了金箍棒里。一棒下去。

然后金箍棒落在了地上。慢慢缩小，缩成一根绣花针的大小。

你变回了石头。不大，就是一块普通的石头，放在路边不会有人多看一眼。

唐僧抱着那块石头，走完了最后一段路。他没有哭。他只是从那以后，念经的声音变得很轻很轻。

后来灵山大殿上，佛祖问唐僧要不要封号。唐僧说："给悟空一个吧。"

佛祖说："他已经不在了。"

唐僧说："那就刻在石头上。"`,

  [EndingType.HunShiMoWang]: `你没有上灵山。

在灵山脚下，你转身走了。唐僧在身后叫你的名字，你没有回头。八戒追了两步，被沙僧拉住了。

你不知道自己要去哪儿。但你知道自己不要什么。不要箍，不要经，不要任何人告诉你什么是对什么是错。

后来你找到了一座空山。比花果山高，比花果山冷。你坐在山顶上，金箍棒横在膝上。

来投奔你的妖越来越多。他们叫你大王，然后叫你圣上，最后叫你——魔主。你没纠正他们。你不在乎他们叫你什么。

紧箍咒还在头上。但已经没有人能念动它了。

念咒的那个人，你已经不知道他在哪儿了。

有时候夜深了，你会忽然想起一碗面。一碗长安城的面。然后你把那个念头捏碎了。`,
};

// ------ 因果语气变体 ------

interface KarmaVariant {
  condition: (state: GameState) => boolean;
  text: string;
}

const KARMA_VARIANTS: Record<EndingType, KarmaVariant[]> = {
  [EndingType.DouZhanShengFo]: [
    {
      condition: (s) => s.stats.eYe >= 4,
      text: '但有时候夜深了，你会想起那些碎掉的东西。成了佛，不代表那些事没发生过。经书里说，这叫"业障"。你觉得这个词太轻了。',
    },
    {
      condition: (s) => s.stats.shanYe >= 6,
      text: '后来你偶尔会下山走走，到人间看看。有人认出你来，不是害怕，是高兴。一个老人拉着孙子说："看，那就是齐天大圣。"你摆了摆手，笑着走了。',
    },
  ],

  [EndingType.QiTianDaSheng]: [
    {
      condition: (s) => s.stats.yiQi >= 40,
      text: '有时候你会朝西边看一眼。你不承认，但你在想他们走到哪儿了。唐僧那个笨和尚，没有你，他怎么过流沙河？',
    },
    {
      condition: (s) => s.stats.eYe >= 6,
      text: '山下的人在路口立了块碑："前方妖山，勿入。"你看见了，但你假装没看见。',
    },
  ],

  [EndingType.XinYuanGuiZheng]: [
    {
      condition: (s) => s.stats.shanYe >= 5,
      text: '后来有人说，长安城里有个毛脸的和尚，带着一群奇怪的人开了间小面馆。面不怎么好吃，但很多人去。因为那个毛脸和尚笑起来，像太阳。',
    },
    {
      condition: (s) => s.stats.eYe >= 4,
      text: '有时候你在面馆里听到有人讲西游的故事。他们把你说成杀神，说你大闹天宫杀了多少天兵。你听着，筷子停了一下，然后继续吃面。唐僧看了你一眼，伸手把你碗里的面添满了。',
    },
  ],

  [EndingType.DaShengYunLuo]: [
    {
      condition: (s) => s.stats.shanYe >= 5,
      text: '后来人间有个传说：在取经路上，如果你遇到一块不起眼的石头，不要踢它。那可能是一个替所有人挡过一劫的猴子。',
    },
  ],

  [EndingType.HunShiMoWang]: [
    {
      condition: (s) => s.stats.yiQi >= 30,
      text: '有一天，一只小猴翻山越岭来找你。它说它是花果山来的。你看着它，看了很久。然后你说："回去告诉它们，我不叫孙悟空了。"小猴走了以后，你在空山里坐了一夜。',
    },
  ],
};

// ------ 辅助函数 ------

/**
 * 找出三维核心数值中最高的那个。
 * 如果有并列，按优先级：道心 > 义气 > 妖性
 */
function getHighestCoreStat(state: GameState): CoreStatKey {
  const { daoXin, yaoXing, yiQi } = state.stats;
  const max = Math.max(daoXin, yaoXing, yiQi);

  // 并列时的优先级：道心 > 义气 > 妖性
  if (daoXin === max) return 'daoXin';
  if (yiQi === max) return 'yiQi';
  return 'yaoXing';
}

/**
 * 检查某个核心数值是否是最高的（包括并列情况下为真）。
 */
function isHighest(state: GameState, stat: CoreStatKey): boolean {
  const { daoXin, yaoXing, yiQi } = state.stats;
  const max = Math.max(daoXin, yaoXing, yiQi);
  return state.stats[stat] === max;
}

// ------ 主判定函数 ------

/**
 * 根据当前游戏状态判定结局。
 *
 * 四层判定逻辑：
 * Layer 1: 提前离队 → 齐天大圣
 * Layer 2: 隐藏结局（大圣陨落 / 混世魔王）
 * Layer 3: 主结局（斗战胜佛 / 心猿归正）
 * Layer 4: 兜底
 */
export function determineEnding(state: GameState): EndingResult {
  let endingType: EndingType;

  // ============ Layer 1: 提前离队 ============
  if (state.flags.FLAG_whiteBone_rupture && state.permanentLeave) {
    endingType = EndingType.QiTianDaSheng;
    return buildEndingResult(endingType, state);
  }

  // ============ Layer 2: 隐藏结局 ============

  // 大圣陨落：义气>=70 AND 道心>=50 AND 比丘国选C AND 以命相搏
  if (
    state.stats.yiQi >= 70 &&
    state.stats.daoXin >= 50 &&
    state.biquguoChoiceC &&
    state.selfSacrifice
  ) {
    endingType = EndingType.DaShengYunLuo;
    return buildEndingResult(endingType, state);
  }

  // 混世魔王：妖性>=80 AND 恶业>=6 AND !FLAG_sixEar_acknowledge AND lingshan="another_shackle"
  if (
    state.stats.yaoXing >= 80 &&
    state.stats.eYe >= 6 &&
    !state.flags.FLAG_sixEar_acknowledge &&
    state.flags.FLAG_lingshan_affirm === 'another_shackle'
  ) {
    endingType = EndingType.HunShiMoWang;
    return buildEndingResult(endingType, state);
  }

  // ============ Layer 3: 主结局 ============

  // 斗战胜佛：道心最高 AND 五行山反思 AND 灵山"值了"
  if (
    isHighest(state, 'daoXin') &&
    state.flags.FLAG_mountain_reflection &&
    state.flags.FLAG_lingshan_affirm === 'worth_it'
  ) {
    endingType = EndingType.DouZhanShengFo;
    return buildEndingResult(endingType, state);
  }

  // 心猿归正：义气最高 AND 灵山"为了他们"
  if (
    isHighest(state, 'yiQi') &&
    state.flags.FLAG_lingshan_affirm === 'for_them'
  ) {
    endingType = EndingType.XinYuanGuiZheng;
    return buildEndingResult(endingType, state);
  }

  // ============ Layer 4: 兜底 ============
  const highest = getHighestCoreStat(state);

  if (highest === 'yaoXing') {
    endingType = EndingType.QiTianDaSheng;
  } else if (highest === 'yiQi') {
    endingType = EndingType.XinYuanGuiZheng;
  } else {
    endingType = EndingType.DouZhanShengFo;
  }

  return buildEndingResult(endingType, state);
}

/**
 * 构建完整的结局结果，包含主文字和因果语气变体。
 */
function buildEndingResult(
  ending: EndingType,
  state: GameState,
): EndingResult {
  const mainText = ENDING_TEXTS[ending];

  // 收集满足条件的因果语气变体
  const variants = KARMA_VARIANTS[ending];
  const karmaVariants = variants
    .filter((v) => v.condition(state))
    .map((v) => v.text);

  return {
    ending,
    mainText,
    karmaVariants,
  };
}

// ------ 结局中文名映射（UI 展示用） ------

export const ENDING_DISPLAY_NAMES: Record<EndingType, string> = {
  [EndingType.DouZhanShengFo]: '斗战胜佛',
  [EndingType.QiTianDaSheng]: '齐天大圣',
  [EndingType.XinYuanGuiZheng]: '心猿归正',
  [EndingType.DaShengYunLuo]: '大圣陨落',
  [EndingType.HunShiMoWang]: '混世魔王',
};

/** 结局副标题 */
export const ENDING_SUBTITLES: Record<EndingType, string> = {
  [EndingType.DouZhanShengFo]: '正统成佛',
  [EndingType.QiTianDaSheng]: '不归之猴',
  [EndingType.XinYuanGuiZheng]: '以义成道',
  [EndingType.DaShengYunLuo]: '悲剧牺牲',
  [EndingType.HunShiMoWang]: '黑化堕魔',
};
