import type { StoryNode } from '../types';

/**
 * 第二幕：天不收（大闹天宫）
 * 幕主题：天地之间有没有谁能管我？
 */
const act2Nodes: StoryNode[] = [
  // ═══════════════════════════════════════════════════
  // 节点 2-1：天庭招安
  // ═══════════════════════════════════════════════════
  {
    id: '2-1',
    actId: 2,
    title: '天庭招安',
    narration:
      '天庭来人了。说是太白金星，白胡子老头，笑呵呵的，说话软绵绵的。他说玉帝请你上天做官。"弼马温"——你不知道这是什么官，但听到"天庭"两个字的时候，胸口跳了一下。\n\n你到了天上，才知道——弼马温是养马的。',
    conflict:
      '天庭的神仙看你的眼神，跟你在花果山当大王时别人看你的眼神完全不一样。他们在笑，但那种笑不是跟你一起笑，是在笑你。',
    choices: [
      {
        id: '2-1A',
        text: '怒从心起——掀翻马厩，一棒打碎御马监的门，打出南天门。"老孙不伺候了！"',
        effects: {
          statChanges: [
            { stat: 'yaoXing', delta: 10 },
            { stat: 'eYe', delta: 1 },
          ],
          flagChanges: [],
        },
        condition: null,
        hiddenLabel: null,
        nextNodeId: '2-2',
        echoFeedback:
          '南天门后面传来一片骂声。你一个筋斗翻回花果山，胸口的火烧了一路。',
      },
      {
        id: '2-1B',
        text: '没有发作。但你记住了每一个笑你的人的脸。你不动声色地离开了，心想：好，我让你们看看什么叫齐天大圣。',
        effects: {
          statChanges: [
            { stat: 'yaoXing', delta: 5 },
            { stat: 'daoXin', delta: 3 },
          ],
          flagChanges: [
            { flag: 'FLAG_heaven_desire', value: true },
          ],
        },
        condition: null,
        hiddenLabel: null,
        nextNodeId: '2-2',
        echoFeedback:
          '你走得很慢。慢到每经过一个大殿，都看清了门上写的字。你在心里记了一笔账。',
      },
      {
        id: '2-1C',
        text: '你生气的不是官小。你生气的是——你真的以为他们拿你当自己人。',
        effects: {
          statChanges: [{ stat: 'daoXin', delta: 5 }],
          flagChanges: [
            { flag: 'FLAG_heaven_desire', value: true },
          ],
        },
        condition: null,
        hiddenLabel: null,
        nextNodeId: '2-2',
        echoFeedback:
          '你坐在云头上，低头看着人间。风很大，但你觉得冷的不是风。',
      },
    ],
    echoConditions: [],
    transitionText: null,
    conditionalNarration: [],
  },

  // ═══════════════════════════════════════════════════
  // 节点 2-2：蟠桃会（★ 关键节点）
  // ═══════════════════════════════════════════════════
  {
    id: '2-2',
    actId: 2,
    title: '蟠桃会',
    narration:
      '第二次上天，你得了个"齐天大圣"的名号。听着大，其实是个空架子。然后蟠桃会到了，所有神仙都请了。你没在名单上。\n\n你站在蟠桃园里，满树的桃子在风里晃。仙女们说漏了嘴——"齐天大圣？没请他。"',
    conflict:
      '桃子的香味很甜。你的怒火也很甜——甜到发苦。',
    choices: [
      {
        id: '2-2A',
        text: '搅翻蟠桃会，偷吃仙丹，打到凌霄宝殿前。老子叫天庭今天不安宁。',
        effects: {
          statChanges: [
            { stat: 'yaoXing', delta: 15 },
            { stat: 'eYe', delta: 3 },
          ],
          flagChanges: [],
        },
        condition: null,
        hiddenLabel: null,
        nextNodeId: '2-3',
        echoFeedback:
          '你一边砸一边笑，笑到后来自己都不知道在笑什么。凌霄宝殿前，没有人能拦住你。痛快。真痛快。可痛快过后，嘴里全是仙丹的苦味。',
      },
      {
        id: '2-2B',
        text: '偷了蟠桃和仙丹，但没有砸场子。带回花果山分给猴子们。天庭不要我，我自在便是。',
        effects: {
          statChanges: [
            { stat: 'yiQi', delta: 8 },
            { stat: 'yaoXing', delta: 5 },
            { stat: 'eYe', delta: 1 },
          ],
          flagChanges: [],
        },
        condition: null,
        hiddenLabel: null,
        nextNodeId: '2-3',
        echoFeedback:
          '猴子们吃着蟠桃开心得满地打滚。你靠在石头上看着它们笑，心里忽然安静了。但你知道——天庭不会放过这件事。',
      },
      {
        id: '2-2C',
        text: '去找太白金星——这个老头当初请你上天时笑呵呵的，你想问他一句：你到底知不知道他们是在耍我？',
        effects: {
          statChanges: [
            { stat: 'daoXin', delta: 5 },
            { stat: 'yiQi', delta: 3 },
          ],
          flagChanges: [],
        },
        condition: null,
        hiddenLabel: null,
        nextNodeId: '2-3',
        echoFeedback:
          '太白金星的笑脸僵了一瞬。他叹了口气说：\'大圣，有些事情，老朽也做不了主啊。\'你看着他，忽然觉得他也不过是个棋子。',
      },
    ],
    echoConditions: [
      {
        condition: 'eYe >= 2',
        text: '你路过瑶池的时候，有个仙娥看见你，吓得摔碎了酒壶。那种眼神你在花果山从没见过——是怕。',
      },
    ],
    transitionText: null,
    conditionalNarration: [],
  },

  // ═══════════════════════════════════════════════════
  // 节点 2-3：天兵压境
  // ═══════════════════════════════════════════════════
  {
    id: '2-3',
    actId: 2,
    title: '天兵压境',
    narration:
      '不管你在蟠桃会做了什么，天庭都来了。十万天兵，密密麻麻地铺满了花果山外的天空。你的猴子们吓得躲在水帘洞里不敢出来。',
    conflict:
      '你站在山头，金箍棒横在肩上。对面是哪吒、二郎神、四大天王。你认得他们——有些还跟你喝过酒。',
    choices: [
      {
        id: '2-3A',
        text: '来啊。你的棒子痒了很久了。',
        effects: {
          statChanges: [
            { stat: 'yaoXing', delta: 8 },
            { stat: 'eYe', delta: 2 },
          ],
          flagChanges: [],
        },
        condition: null,
        hiddenLabel: null,
        nextNodeId: '2-4',
        echoFeedback:
          '那一仗打了三天三夜。你不记得打伤了多少人，只记得金箍棒上的血被雨洗了一遍又一遍。',
      },
      {
        id: '2-3B',
        text: '打归打，但你跟猴子们说了一句："你们躲好。这事是我惹的，跟你们没关系。"',
        effects: {
          statChanges: [
            { stat: 'yiQi', delta: 10 },
            { stat: 'yaoXing', delta: 3 },
          ],
          flagChanges: [],
        },
        condition: null,
        hiddenLabel: null,
        nextNodeId: '2-4',
        echoFeedback:
          '猴子们从石缝里看你打仗。后来老猴跟小猴说：\'你们大王那天的背影，比山还大。\'',
      },
      {
        id: '2-3C',
        text: '你看着天兵的阵势，心里闪过一个念头：如果当初没有上天，就不会有今天。',
        effects: {
          statChanges: [
            { stat: 'daoXin', delta: 5 },
            { stat: 'yaoXing', delta: 3 },
          ],
          flagChanges: [],
        },
        condition: null,
        hiddenLabel: null,
        nextNodeId: '2-4',
        echoFeedback:
          '打到一半，你忽然走了神——二郎神的刀劈过来的时候，你脑子里想的居然是花果山的月亮。',
      },
    ],
    echoConditions: [],
    transitionText: null,
    conditionalNarration: [],
  },

  // ═══════════════════════════════════════════════════
  // 节点 2-4：佛掌合拢（★ 关键节点 / 镜像二·前半）
  // ═══════════════════════════════════════════════════
  {
    id: '2-4',
    actId: 2,
    title: '佛掌合拢',
    narration:
      '你打到了天庭最深处，没有人拦得住你。然后他来了。如来佛祖。你从没见过这么大的手掌，大到遮住了整片天空。\n\n你翻了十万八千里的筋斗云，以为到了天边，在一根柱子上写下"齐天大圣到此一游"。然后发现，那根柱子是他的手指。',
    conflict:
      '如来的手掌正在合拢。你用尽全力也翻不出去了。压力从四面八方涌来，骨头在响。',
    choices: [
      {
        id: '2-4A',
        text: '"就算被压一万年，老孙也绝不服！" 你用最后的力气，朝那只手掌打了一棒。',
        effects: {
          statChanges: [
            { stat: 'yaoXing', delta: 15 },
            { stat: 'daoXin', delta: 0, setTo: 0 },
          ],
          flagChanges: [
            { flag: 'FLAG_mountain_reflection', value: false },
          ],
        },
        condition: null,
        hiddenLabel: null,
        nextNodeId: '3-0',
        echoFeedback:
          '大山落下来的时候，你的嘴还在骂。五百年后，山下的村民说，每到刮大风的夜晚，都能听到山里有什么东西在嚎叫。',
      },
      {
        id: '2-4B',
        text: '在被压住的最后一瞬，你忽然安静了。不是服了，是忽然累了。心里浮出一个念头——"我……是不是错了？"',
        effects: {
          statChanges: [{ stat: 'daoXin', delta: 10 }],
          flagChanges: [
            { flag: 'FLAG_mountain_reflection', value: true },
          ],
        },
        condition: null,
        hiddenLabel: null,
        nextNodeId: '3-0',
        echoFeedback:
          '大山落下来的时候，你闭上了眼。五百年后，山下的村民说，每年春天，山缝里都会长出一朵小花来。很安静。',
      },
    ],
    echoConditions: [],
    transitionText:
      '五百年。日升日落一十八万两千五百次。你从山缝里看天空，起初看到的是仇恨，后来看到的是云。',
    conditionalNarration: [
      {
        condition: 'FLAG_mountain_reflection == true',
        text: '有时候你会想起菩提祖师的话。他说你会惹祸。你没信。现在你被压在这里，终于开始觉得——他说的每个字都是对的。',
      },
    ],
  },
];

export default act2Nodes;
