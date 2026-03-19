import type { StoryNode } from '../types';

/**
 * 第四幕：火与心（取经路·下半程）
 * 幕主题：我到底在为谁走这条路？
 */
const act4Nodes: StoryNode[] = [
  // ═══════════════════════════════════════════════════
  // 节点 4-1：火焰山·旧友（★ 关键节点）
  // ═══════════════════════════════════════════════════
  {
    id: '4-1',
    actId: 4,
    title: '火焰山·旧友',
    narration:
      '火焰山。热浪扑面，空气都在扭曲。你需要铁扇公主的芭蕉扇才能过去。而铁扇公主是牛魔王的妻子。牛魔王——你五百年前的结拜兄弟。\n\n你还记得那时候的事。七十二洞妖王结拜，喝了一坛酒，对着月亮拍了胸脯。那时候没有紧箍，没有唐僧，没有取经。你就是你。\n\n但红孩儿（他和铁扇公主的儿子）被你送给了观音当了善财童子。他们恨你。',
    conflict:
      '牛魔王站在你面前。他比你记忆里老了很多。他看你的眼神里没有当年的笑意。',
    choices: [
      {
        id: '4-1A',
        text: '直接强取芭蕉扇。旧情是旧情，取经是取经。"兄弟，得罪了。"',
        effects: {
          statChanges: [
            { stat: 'yiQi', delta: -5 },
            { stat: 'yaoXing', delta: 5 },
            { stat: 'eYe', delta: 1 },
          ],
          flagChanges: [
            { flag: 'FLAG_bullKing_peace', value: false },
          ],
        },
        condition: null,
        hiddenLabel: null,
        nextNodeId: '4-2',
        echoFeedback:
          '芭蕉扇拿到了。但牛魔王倒在地上的时候，你没有看他的脸。你不敢看。',
      },
      {
        id: '4-1B',
        text: '先坐下来好好谈。叙旧，解释红孩儿的事，试图和解。',
        effects: {
          statChanges: [
            { stat: 'yiQi', delta: 8 },
            { stat: 'daoXin', delta: 5 },
          ],
          flagChanges: [
            { flag: 'FLAG_bullKing_peace', value: true },
          ],
        },
        condition: null,
        hiddenLabel: null,
        nextNodeId: '4-2',
        echoFeedback:
          '牛魔王喝了你递过去的酒，叹了口气："老弟，你变了。"你说："是啊，被压了五百年。"两个人沉默了很久。',
      },
      {
        id: '4-1C',
        text: '你看着他，忽然不想打了。转身走。"老牛，我不跟你抢。这火焰山，我绕过去。"',
        effects: {
          statChanges: [
            { stat: 'daoXin', delta: 10 },
            { stat: 'yiQi', delta: 5 },
            { stat: 'shanYe', delta: 1 },
          ],
          flagChanges: [
            { flag: 'FLAG_bullKing_peace', value: true },
          ],
        },
        condition: null,
        hiddenLabel: null,
        nextNodeId: '4-2',
        echoFeedback:
          '你绕了很远的路。但那天晚上你一个人坐在山崖上的时候，觉得胸口那块地方——是松的。\n\n八戒嘟囔说绕路要多走半年。唐僧没说话，但脚步更慢了。',
      },
    ],
    echoConditions: [
      {
        condition: 'eYe >= 5',
        text: '铁扇公主在山上远远看着你，声音是嘶哑的："孙悟空，你毁了我的家，还想要什么？"这句话比火焰山还烫。',
      },
    ],
    transitionText: null,
    conditionalNarration: [
      {
        condition: 'yaoXing >= 60',
        text: '牛魔王冷笑："你说的话，有几句是真的？跟天庭打的时候你讲义气，跟我讲什么义气？" 他不信你。和谈失败，强制进入冲突。',
      },
    ],
  },

  // ═══════════════════════════════════════════════════
  // 节点 4-2：众生之苦（比丘国）
  // ═══════════════════════════════════════════════════
  {
    id: '4-2',
    actId: 4,
    title: '众生之苦',
    narration:
      '比丘国的国王要用一千一百一十一个小儿的心肝做药引。你能听到笼子里孩子的哭声，穿过好几堵墙，穿进你的脑子里。',
    conflict:
      '唐僧说："救他们。" 你想说：废话还用你说。但你低头看了看自己的手——这双手打死过多少人？它有资格救人吗？',
    choices: [
      {
        id: '4-2A',
        text: '想什么想。救。',
        effects: {
          statChanges: [
            { stat: 'yiQi', delta: 5 },
            { stat: 'shanYe', delta: 2 },
          ],
          flagChanges: [],
        },
        condition: null,
        hiddenLabel: null,
        nextNodeId: '4-3',
        echoFeedback:
          '孩子被放出来的时候，哭声变成了笑声。你站在人群外面看着，忽然手足无措——你不知道该怎么面对笑声。',
      },
      {
        id: '4-2B',
        text: '你去救了，但你比平时更暴力。那个国丈是妖怪，你把他打得连原形都碎了。心里的火借着正义的名义烧了起来。',
        effects: {
          statChanges: [
            { stat: 'yaoXing', delta: 5 },
            { stat: 'shanYe', delta: 1 },
            { stat: 'eYe', delta: 1 },
          ],
          flagChanges: [],
        },
        condition: null,
        hiddenLabel: null,
        nextNodeId: '4-3',
        echoFeedback:
          '国丈的血染了半个大殿。唐僧没有念紧箍咒。但他看你的眼神，让你觉得念了。',
      },
      {
        id: '4-2C',
        text: '你救了孩子，然后蹲下来，让一个最小的孩子骑在你的肩膀上。八戒在后面说你变了，你说："滚。" 但嘴角勾了一下。',
        effects: {
          statChanges: [
            { stat: 'yiQi', delta: 8 },
            { stat: 'daoXin', delta: 5 },
            { stat: 'shanYe', delta: 2 },
          ],
          flagChanges: [],
        },
        condition: null,
        hiddenLabel: null,
        nextNodeId: '4-3',
        echoFeedback:
          '那个孩子骑在你肩膀上，揪着你的毛不撒手。你疼得龇牙咧嘴，但没推开他。后来他在你肩上睡着了。你走了很久都没把他放下来。',
      },
    ],
    echoConditions: [],
    transitionText: null,
    conditionalNarration: [],
  },

  // ═══════════════════════════════════════════════════
  // 节点 4-3：灵山前夜（★★ 终极抉择 / 镜像二·后半）
  // ═══════════════════════════════════════════════════
  {
    id: '4-3',
    actId: 4,
    title: '灵山前夜',
    narration:
      '灵山就在前方了。你能看到山顶的金光。明天，一切就要结束了。\n\n今晚师徒四人在山脚下歇息。八戒鼾声如雷，沙僧守着行李，唐僧在打坐。你一个人坐在山崖边上，双脚悬空，看着来路。\n\n来路看不到头。你知道那条路上有什么——\n\n花果山的月亮，菩提祖师的背影，五行山下的五百年，紧箍第一次勒紧的疼，白骨精散落的骨头，六耳猕猴消散前的眼神，牛魔王倒在地上或者递过来的酒壶，孩子骑在你肩膀上的重量。',
    conflict:
      '所有的路，都走到了这里。明天就是灵山。你问自己最后一个问题——',
    choices: [
      {
        id: '4-3A',
        text: '"这一路，值了。"',
        effects: {
          statChanges: [{ stat: 'daoXin', delta: 10 }],
          flagChanges: [
            { flag: 'FLAG_lingshan_affirm', value: 'worth_it' },
          ],
        },
        condition: null,
        hiddenLabel: null,
        nextNodeId: 'ending',
        echoFeedback:
          '你看了很久的星星。它们跟五百年前一模一样。但你看它们的眼睛不一样了。你忽然觉得，连紧箍都没那么紧了。',
      },
      {
        id: '4-3B',
        text: '"这一路，不过是另一个紧箍咒。"',
        effects: {
          statChanges: [{ stat: 'yaoXing', delta: 10 }],
          flagChanges: [
            { flag: 'FLAG_lingshan_affirm', value: 'another_shackle' },
          ],
        },
        condition: null,
        hiddenLabel: null,
        nextNodeId: 'ending',
        echoFeedback:
          '你摸了摸头上的箍。它还在。从第一天到现在，从来没有松过。明天要成佛了——然后呢？',
      },
      {
        id: '4-3C',
        text: '"这一路，不是为了佛，是为了他们。"',
        effects: {
          statChanges: [{ stat: 'yiQi', delta: 10 }],
          flagChanges: [
            { flag: 'FLAG_lingshan_affirm', value: 'for_them' },
          ],
        },
        condition: null,
        hiddenLabel: null,
        nextNodeId: 'ending',
        echoFeedback:
          '身后传来八戒说梦话的声音，好像在叫嫦娥。你笑了一下。唐僧不知道什么时候走到了你旁边，披了一件袈裟在你肩上。他没说话。你也没说话。',
      },
    ],
    echoConditions: [],
    transitionText: null,
    conditionalNarration: [],
  },
];

export default act4Nodes;
