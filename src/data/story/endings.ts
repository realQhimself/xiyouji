import type { StoryNode } from '../types';

/**
 * 第五幕：结局
 *
 * 结局判定逻辑在 engine/endings.ts 中实现。
 * 此文件仅定义结局展示节点——一个特殊的 "ending" 节点，
 * 作为所有主线的终点。当游戏引擎遇到 nextNodeId === "ending" 时，
 * 应触发结局判定函数，而非常规节点渲染。
 *
 * 五种结局：
 * 1. 斗战胜佛（正统成佛）
 * 2. 齐天大圣（不归之猴）
 * 3. 心猿归正（以义成道）
 * 4. 大圣陨落（悲剧牺牲·隐藏）
 * 5. 混世魔王（黑化堕魔·隐藏）
 */

/**
 * 结局入口节点。
 *
 * 这是一个特殊节点：没有选项（choices 为空）。
 * 当玩家从 4-3 灵山前夜选择后抵达此节点，
 * 游戏引擎应调用 determineEnding() 计算最终结局，
 * 并切换到结局展示 UI，而非常规叙事 UI。
 *
 * narration 和 conflict 仅作为结局前的过渡文字展示。
 */
const endingNodes: StoryNode[] = [
  {
    id: 'ending',
    actId: 5,
    title: '灵山',
    narration:
      '天亮了。金光从灵山顶上倾泻下来，照亮了你们走过的每一步路。\n\n你站在灵山大殿前，身后是唐僧、八戒、沙僧。风从很远的地方吹过来，带着花果山的味道——也许是你的错觉。',
    conflict:
      '大殿的门缓缓打开。佛祖就在里面。这一刻，你心里没有紧张，没有期待，只有一种很深的平静——或者，是一种很深的不甘。',
    choices: [],
    echoConditions: [],
    transitionText: null,
    conditionalNarration: [],
  },
  /**
   * 齐天大圣提前结局入口节点。
   * 当玩家在紧箍初罚或三打白骨精时选择永久离队，
   * 游戏引擎跳转到此节点，触发齐天大圣结局。
   */
  {
    id: 'ending-qtds',
    actId: 5,
    title: '花果山',
    narration:
      '一个筋斗翻了十万八千里。风灌进耳朵，什么都听不见了——师父的念经声、八戒的嘟囔、沙僧的沉默，统统甩在了身后。\n\n花果山在云头下面越来越大。水帘洞的瀑布还在响。',
    conflict:
      '你落在山顶的那块石头上。这里是你出生的地方。你回来了。',
    choices: [],
    echoConditions: [],
    transitionText: null,
    conditionalNarration: [],
  },
];

export default endingNodes;
