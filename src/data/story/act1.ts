import type { StoryNode } from '../types';

/**
 * 第一幕：石中生（花果山）
 * 幕主题：我是谁？
 */
const act1Nodes: StoryNode[] = [
  // ═══════════════════════════════════════════════════
  // 节点 1-1：破石而出
  // ═══════════════════════════════════════════════════
  {
    id: '1-1',
    actId: 1,
    title: '破石而出',
    narration:
      '混沌散去，光刺进来。你感到自己被一股力量推出某个极窄的缝隙——不是出生，更像是裂开。睁眼的一瞬间，天地都在看你，风声像是被吓住了，停了一拍才继续吹。山顶的石头碎了一地，你浑身湿漉漉地站在碎石中间，什么都不懂，但什么都不怕。',
    conflict:
      '水帘洞就在瀑布后面，所有猴子都不敢跳。你站在洞口前，水声震耳。',
    choices: [
      {
        id: '1-1A',
        text: '"跳。" 想都没想，身体比念头快。',
        effects: {
          statChanges: [{ stat: 'yaoXing', delta: 5 }],
          flagChanges: [],
        },
        condition: null,
        hiddenLabel: null,
        nextNodeId: '1-2',
        echoFeedback:
          '落地的时候，水花炸开，身体里有什么东西跟着炸开了——痛快。',
      },
      {
        id: '1-1B',
        text: '回头看了一眼身后的猴群，心里忽然觉得——如果我跳了，它们就有家了。然后跳。',
        effects: {
          statChanges: [{ stat: 'yiQi', delta: 5 }],
          flagChanges: [],
        },
        condition: null,
        hiddenLabel: null,
        nextNodeId: '1-2',
        echoFeedback:
          '落地的时候，你第一件事是回头喊了一声。洞外的猴子听见了，一个接一个跳了进来。',
      },
      {
        id: '1-1C',
        text: '盯着水帘看了很久，心里浮出一个念头：这后面是什么？不是为了谁，就是想知道。',
        effects: {
          statChanges: [{ stat: 'daoXin', delta: 5 }],
          flagChanges: [],
        },
        condition: null,
        hiddenLabel: null,
        nextNodeId: '1-2',
        echoFeedback:
          '落地的时候，你在水帘洞里站了很久，摸着石壁上的纹路，像在读一本没有字的书。',
      },
    ],
    echoConditions: [],
    transitionText: null,
    conditionalNarration: [],
  },

  // ═══════════════════════════════════════════════════
  // 节点 1-2：求道的代价
  // ═══════════════════════════════════════════════════
  {
    id: '1-2',
    actId: 1,
    title: '求道的代价',
    narration:
      '你做了多久的猴王？百年？还是三百年？记不清了。只记得有一天，一只老猴死在你旁边，眼睛还睁着。你忽然意识到：你也会死。这个念头像一根刺，扎进去就拔不出来。你决定离开花果山，去找一个能教你不死的人。\n\n一路上，你弯过腰、低过头、被人赶过、被狗追过、在雨里走过不知道多少天的山路。',
    conflict:
      '终于，你跪在菩提祖师门前。他没有马上开门。你跪了三天。第二天的时候，你心里有了动摇——',
    choices: [
      {
        id: '1-2A',
        text: '我是花果山之王，从没给任何人跪过这么久。凭什么？',
        effects: {
          statChanges: [{ stat: 'yaoXing', delta: 5 }],
          flagChanges: [],
        },
        condition: null,
        hiddenLabel: null,
        nextNodeId: '1-3',
        echoFeedback:
          '门开了。你站起来的时候膝盖在发抖，但你用力站得很直。',
      },
      {
        id: '1-2B',
        text: '能跪多久就跪多久。如果连死都怕，跪算什么。',
        effects: {
          statChanges: [{ stat: 'daoXin', delta: 8 }],
          flagChanges: [],
        },
        condition: null,
        hiddenLabel: null,
        nextNodeId: '1-3',
        echoFeedback:
          '门开了。你站起来的时候，忽然发现膝盖已经不疼了。',
      },
      {
        id: '1-2C',
        text: '跪不跪无所谓，反正也没人看见。不丢人。',
        effects: {
          statChanges: [
            { stat: 'yiQi', delta: 3 },
            { stat: 'yaoXing', delta: 2 },
          ],
          flagChanges: [],
        },
        condition: null,
        hiddenLabel: null,
        nextNodeId: '1-3',
        echoFeedback:
          '门开了。你拍了拍腿上的土，嘿嘿笑了一声，走了进去。',
      },
    ],
    echoConditions: [],
    transitionText: null,
    conditionalNarration: [],
  },

  // ═══════════════════════════════════════════════════
  // 节点 1-3：菩提逐徒（★ 关键节点 / 镜像一·前半）
  // ═══════════════════════════════════════════════════
  {
    id: '1-3',
    actId: 1,
    title: '菩提逐徒',
    narration:
      '你学会了筋斗云，学会了七十二变，学会了很多在山上想都不敢想的本事。但菩提祖师今天把你叫到后山，表情是你从没见过的那种——不是生气，是一种看穿了什么的平静。\n\n他说："你日后必定惹出大祸。到那一日，不许说是我的徒弟。去吧。"',
    conflict:
      '他转身走了。没有多说一个字。风把他的袍角吹起来又放下。你站在原地。',
    choices: [
      {
        id: '1-3A',
        text: '心里有一个念头浮上来——"师父不过如此。天地之大，我已无所畏惧。"',
        effects: {
          statChanges: [{ stat: 'yaoXing', delta: 10 }],
          flagChanges: [
            { flag: 'FLAG_subodhi_gratitude', value: false },
          ],
        },
        condition: null,
        hiddenLabel: null,
        nextNodeId: '1-4',
        echoFeedback:
          '筋斗云比来时快了十倍。你心想，这就是自由的速度。',
      },
      {
        id: '1-3B',
        text: '跪下磕了三个头。心里发了一个愿："终有一日证大道，不负师恩。"',
        effects: {
          statChanges: [{ stat: 'daoXin', delta: 10 }],
          flagChanges: [
            { flag: 'FLAG_subodhi_gratitude', value: true },
          ],
        },
        condition: null,
        hiddenLabel: null,
        nextNodeId: '1-4',
        echoFeedback:
          '筋斗云翻出去的时候，你回了一次头。后山空了，连他站过的脚印都被风吹平了。',
      },
      {
        id: '1-3C',
        text: '难过了一阵，但一翻筋斗云就把伤感甩在了身后。回花果山喝酒去！',
        effects: {
          statChanges: [
            { stat: 'yiQi', delta: 5 },
            { stat: 'yaoXing', delta: 3 },
          ],
          flagChanges: [
            { flag: 'FLAG_subodhi_gratitude', value: false },
          ],
        },
        condition: null,
        hiddenLabel: null,
        nextNodeId: '1-4',
        echoFeedback:
          '筋斗云翻到一半，你忽然笑出声来——不知道在笑什么，但就是想笑。',
      },
    ],
    echoConditions: [],
    transitionText: null,
    conditionalNarration: [],
  },

  // ═══════════════════════════════════════════════════
  // 节点 1-4：归山回声
  // ═══════════════════════════════════════════════════
  {
    id: '1-4',
    actId: 1,
    title: '归山回声',
    narration:
      '回到花果山，猴子们围上来，又叫又跳。但你站在水帘洞前忽然顿住了——这个地方怎么变小了？不，是你变了。山没变，水帘没变，是你的眼睛看东西的方式不一样了。',
    conflict:
      '一只小猴拉着你的手说："大王，你是不是变厉害了？"\n\n你蹲下来，看着它的眼睛。',
    choices: [
      {
        id: '1-4A',
        text: '"厉害？哈哈！你大王我现在一个筋斗十万八千里！天上地下没人管得了我！"',
        effects: {
          statChanges: [{ stat: 'yaoXing', delta: 5 }],
          flagChanges: [],
        },
        condition: null,
        hiddenLabel: null,
        nextNodeId: '2-1',
        echoFeedback:
          '猴子们欢呼起来。你跳到最高的石头上，风吹着你的毛。你笑得很大声，大声到自己都觉得有点空。',
      },
      {
        id: '1-4B',
        text: '摸了摸小猴的头，没说话。心里想：我学了这么多本事，但师父最后还是把我赶走了。本事有什么用。',
        effects: {
          statChanges: [{ stat: 'daoXin', delta: 5 }],
          flagChanges: [],
        },
        condition: null,
        hiddenLabel: null,
        nextNodeId: '2-1',
        echoFeedback:
          '猴子们安静下来，围着你坐成一圈。它们不懂你在想什么，但它们愿意等。',
      },
      {
        id: '1-4C',
        text: '"厉害不厉害不重要，重要的是——大王回来了！今晚喝酒！"',
        effects: {
          statChanges: [{ stat: 'yiQi', delta: 8 }],
          flagChanges: [],
        },
        condition: null,
        hiddenLabel: null,
        nextNodeId: '2-1',
        echoFeedback:
          '那一晚喝了很多。你搂着几只老猴，说了很多胡话。月亮很大。你觉得这就够了。',
      },
    ],
    echoConditions: [],
    transitionText: null,
    conditionalNarration: [],
  },
];

export default act1Nodes;
