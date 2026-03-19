import type { StoryNode } from '../types';

/**
 * 第三幕：金与环（取经路·上半程）
 * 幕主题：我能不能在被误解时，仍然选择守护？
 *
 * 三幕结构：3个主枢纽 + 3个插入事件 + 1个大转折
 *
 * 节点流：3-0 → 3-A → 3-B → 3-1 → 3-C (conditional) → 3-2-r1 → 3-2-r2 → 3-2-r3 → 3-3 → 4-1
 */
const act3Nodes: StoryNode[] = [
  // ═══════════════════════════════════════════════════
  // 节点 3-0：枢纽前置——唐僧揭帖
  // ═══════════════════════════════════════════════════
  {
    id: '3-0',
    actId: 3,
    title: '唐僧揭帖',
    narration:
      '五百年后，有人揭了山上的金帖。大山松动了，光漏进来。你用力挣了一下——整座山炸开了。\n\n站在你面前的是一个瘦弱的和尚，手里拿着根禅杖，风一吹感觉就能倒。他叫唐三藏。他说是观音菩萨让他来的。他要去西天取经，问你愿不愿意保护他。',
    conflict:
      '你看着他。五百年来你第一次看到活人。他的眼睛干净得不像话。',
    choices: [
      {
        id: '3-0A',
        text: '你看了一眼天，看了一眼地，最后看着他说："行。你救了我，我保你。"',
        effects: {
          statChanges: [{ stat: 'yiQi', delta: 8 }],
          flagChanges: [],
        },
        condition: null,
        hiddenLabel: null,
        nextNodeId: '3-A',
        echoFeedback:
          '他笑了。你不记得上一次有人对你笑是什么时候。',
      },
      {
        id: '3-0B',
        text: '你伸了个懒腰，骨头响了一串。"取经？听着挺无聊。但总比被压着强。走吧。"',
        effects: {
          statChanges: [
            { stat: 'yaoXing', delta: 3 },
            { stat: 'yiQi', delta: 3 },
          ],
          flagChanges: [],
        },
        condition: null,
        hiddenLabel: null,
        nextNodeId: '3-A',
        echoFeedback:
          '他跟在你后面，脚步很小。你放慢了速度，但你不承认。',
      },
      {
        id: '3-0C',
        text: '你盯着他看了很久，心想：这人活不过三天。但你还是点了头——不是为他，是为了自由。',
        effects: {
          statChanges: [
            { stat: 'daoXin', delta: 3 },
            { stat: 'yaoXing', delta: 3 },
          ],
          flagChanges: [],
        },
        condition: null,
        hiddenLabel: null,
        nextNodeId: '3-A',
        echoFeedback:
          '走出山的时候，阳光刺得你眯了好一会儿眼。五百年没见过这么亮的光了。',
      },
    ],
    echoConditions: [
      {
        condition: '恶业 >= 4',
        text: '你走出山的时候，附近的村民远远地看着你，没有一个人敢靠近。他们记得五百年前的事。',
      },
    ],
    transitionText: null,
    conditionalNarration: [],
  },

  // ═══════════════════════════════════════════════════
  // 插入事件 3-A：收八戒
  // ═══════════════════════════════════════════════════
  {
    id: '3-A',
    actId: 3,
    title: '收八戒',
    narration:
      '高老庄有个妖怪霸占了人家的女儿。你本以为是个硬茬，结果打了两下就跪地求饶了。肥头大耳，满嘴跑火车。唐僧说他叫猪悟能。',
    conflict:
      '他管唐僧叫师父，管你叫"猴哥"。你看着他那张脸——',
    choices: [
      {
        id: '3-AA',
        text: '"叫什么猴哥！叫齐天大圣！" 但嘴上嫌弃，脚步没停——你在前面带路了。',
        effects: {
          statChanges: [
            { stat: 'yaoXing', delta: 2 },
            { stat: 'yiQi', delta: 3 },
          ],
          flagChanges: [],
        },
        condition: null,
        hiddenLabel: null,
        nextNodeId: '3-B',
        echoFeedback:
          '八戒走在你后面，嘴里嘟嘟囔囔的。你忽然觉得这条路好像没那么安静了。',
      },
      {
        id: '3-AB',
        text: '没搭理他。多一个少一个无所谓。但晚上你把自己的干粮分了一半给他，没说为什么。',
        effects: {
          statChanges: [{ stat: 'yiQi', delta: 5 }],
          flagChanges: [],
        },
        condition: null,
        hiddenLabel: null,
        nextNodeId: '3-B',
        echoFeedback:
          '八戒走在你后面，嘴里嘟嘟囔囔的。你忽然觉得这条路好像没那么安静了。',
      },
      {
        id: '3-AC',
        text: '你忽然笑了。这家伙虽然蠢，但跟花果山那帮猴子有点像——傻乎乎的，让人讨厌不起来。',
        effects: {
          statChanges: [
            { stat: 'yiQi', delta: 5 },
            { stat: 'daoXin', delta: 2 },
          ],
          flagChanges: [],
        },
        condition: null,
        hiddenLabel: null,
        nextNodeId: '3-B',
        echoFeedback:
          '八戒走在你后面，嘴里嘟嘟囔囔的。你忽然觉得这条路好像没那么安静了。',
      },
    ],
    echoConditions: [],
    transitionText: null,
    conditionalNarration: [],
  },

  // ═══════════════════════════════════════════════════
  // 插入事件 3-B：夜谈
  // ═══════════════════════════════════════════════════
  {
    id: '3-B',
    actId: 3,
    title: '夜谈',
    narration:
      '某天晚上赶路途中，师徒四人在破庙歇脚。八戒和沙僧先睡了。唐僧坐在那里念经，你蹲在屋顶上看月亮。\n\n月亮跟花果山看到的是同一个。',
    conflict:
      '唐僧忽然开口问了一句："悟空，你想家吗？"',
    choices: [
      {
        id: '3-BA',
        text: '"想什么家，老孙的家就是天地之间。" 其实你在想水帘洞。',
        effects: {
          statChanges: [{ stat: 'yaoXing', delta: 3 }],
          flagChanges: [],
        },
        condition: null,
        hiddenLabel: null,
        nextNodeId: '3-1',
        echoFeedback:
          '唐僧没再问了。风吹过破庙，把他的经文翻了一页。',
      },
      {
        id: '3-BB',
        text: '"……想。" 只说了一个字。',
        effects: {
          statChanges: [
            { stat: 'yiQi', delta: 5 },
            { stat: 'daoXin', delta: 3 },
          ],
          flagChanges: [],
        },
        condition: null,
        hiddenLabel: null,
        nextNodeId: '3-1',
        echoFeedback:
          '唐僧笑了。他难得笑。他说：\'等取完经，我陪你回花果山看看。\'',
      },
      {
        id: '3-BC',
        text: '没说话。但你从屋顶跳下来，在唐僧旁边坐了一会儿。',
        effects: {
          statChanges: [
            { stat: 'yiQi', delta: 5 },
            { stat: 'daoXin', delta: 5 },
          ],
          flagChanges: [],
        },
        condition: null,
        hiddenLabel: null,
        nextNodeId: '3-1',
        echoFeedback:
          '两个人坐了很久，一句话没说。但那是出发以来，你觉得最不冷的一个晚上。',
      },
    ],
    echoConditions: [],
    transitionText: null,
    conditionalNarration: [],
  },

  // ═══════════════════════════════════════════════════
  // 主枢纽 3-1：紧箍初罚（★ 关键节点 / 镜像一呼应）
  // ═══════════════════════════════════════════════════
  {
    id: '3-1',
    actId: 3,
    title: '紧箍初罚',
    narration:
      '六个强盗拦路。在你眼里他们就是六只蚂蚁。你一棒一个。血溅在路上，热的。唐僧的脸白了。他开始念咒——紧箍咒。\n\n你的头像是被一只无形的手攥住了，越收越紧。疼。不是打架那种痛快的疼，是屈辱的疼。',
    conflict:
      '你跪在地上，满头是汗。你想起菩提祖师赶你走的那天——那天也是跪着的。但那次是你自愿的。这次不是。',
    choices: [
      // A：暴怒飞走
      {
        id: '3-1A',
        text: '疼痛中暴怒，拳头攥紧——差一点就要对他动手了。最后你飞走了。',
        effects: {
          statChanges: [{ stat: 'yaoXing', delta: 8 }],
          flagChanges: [
            { flag: 'FLAG_band_acceptance', value: false },
          ],
        },
        condition: null,
        hiddenLabel: null,
        nextNodeId: '3-C',
        echoFeedback:
          '你坐在云头上，额头上还有箍的勒痕。你摸了摸那道红印——比五行山还让你觉得屈辱。',
      },
      // A2：隐藏选项 — 永久离队（条件：妖性 >= 60）
      {
        id: '3-1A2',
        text: '"不忍了。" 你转身就走，一个筋斗翻回花果山。',
        effects: {
          statChanges: [{ stat: 'yaoXing', delta: 20 }],
          flagChanges: [
            { flag: 'FLAG_whiteBone_rupture', value: true },
          ],
        },
        condition: '妖性 >= 60',
        hiddenLabel: '（此选项需要足够高的妖性才会出现）',
        nextNodeId: 'ending-qtds',
        echoFeedback:
          '花果山还在。猴子们围上来叫大王。你笑了。可你知道——有什么东西断了，粘不回去了。',
      },
      // B：接受约束
      {
        id: '3-1B',
        text: '疼得满地打滚，但心里没有恨。你想：是我杀了人，该受这个。',
        effects: {
          statChanges: [{ stat: 'daoXin', delta: 10 }],
          flagChanges: [
            { flag: 'FLAG_band_acceptance', value: true },
          ],
        },
        condition: null,
        hiddenLabel: null,
        nextNodeId: '3-C',
        echoFeedback:
          '唐僧看你的眼神变了。不是刚才的愤怒，变成了一种你看不懂的东西。很多年后你才知道那叫心疼。',
      },
      // C：嬉皮笑脸
      {
        id: '3-1C',
        text: '嬉皮笑脸说"师父别念了别念了，老孙知道错了"——其实心里什么都没服。',
        effects: {
          statChanges: [
            { stat: 'yiQi', delta: 3 },
            { stat: 'yaoXing', delta: 5 },
          ],
          flagChanges: [
            { flag: 'FLAG_band_acceptance', value: false },
          ],
        },
        condition: null,
        hiddenLabel: null,
        nextNodeId: '3-C',
        echoFeedback:
          '唐僧叹了口气。八戒在一旁说：\'猴哥，你嘴上说改，身上可一点没改。\'他说得对。',
      },
    ],
    echoConditions: [
      {
        condition: '恶业 >= 3',
        text: '紧箍收紧的时候，你忽然想起天兵天将那些脸。他们被你打的时候，是不是也是这种疼？',
      },
    ],
    transitionText: null,
    conditionalNarration: [
      {
        condition: 'FLAG_subodhi_gratitude == true',
        text: '两次跪，味道完全不一样。',
      },
    ],
  },

  // ═══════════════════════════════════════════════════
  // 插入事件 3-C：路遇旧迹（因果专属事件）
  // 仅在 恶业 >= 3 时触发，否则跳过至 3-2-r1
  // ═══════════════════════════════════════════════════
  {
    id: '3-C',
    actId: 3,
    title: '路遇旧迹',
    narration:
      '取经路上经过一个小镇。镇口立了块碑，上面写着你看不太懂的人间文字。沙僧替你念了："此处曾遭天灾妖祸，百姓流离。"\n\n你抬头看了看周围。房子的墙是新砌的，但地基上还有旧的焦痕。',
    conflict:
      '你不确定这跟你有没有关系。但胸口闷了一下。',
    condition: '恶业 >= 3',
    skipToNodeId: '3-2-r1',
    choices: [
      {
        id: '3-CA',
        text: '走。跟我没关系。',
        effects: {
          statChanges: [{ stat: 'yaoXing', delta: 3 }],
          flagChanges: [],
        },
        condition: null,
        hiddenLabel: null,
        nextNodeId: '3-2-r1',
        echoFeedback:
          '八戒看了你一眼，想说什么，又咽了回去。',
      },
      {
        id: '3-CB',
        text: '你没说话，但走得比平时慢了一点。',
        effects: {
          statChanges: [
            { stat: 'daoXin', delta: 5 },
            { stat: 'shanYe', delta: 1 },
          ],
          flagChanges: [],
        },
        condition: null,
        hiddenLabel: null,
        nextNodeId: '3-2-r1',
        echoFeedback:
          '唐僧什么都没问。但那天晚上他念经的时候，多念了一遍。',
      },
      {
        id: '3-CC',
        text: '你让沙僧去镇上买点东西，顺便留了些银两。"别说是我给的。"',
        effects: {
          statChanges: [
            { stat: 'yiQi', delta: 3 },
            { stat: 'shanYe', delta: 2 },
          ],
          flagChanges: [],
        },
        condition: null,
        hiddenLabel: null,
        nextNodeId: '3-2-r1',
        echoFeedback:
          '你不知道的是，镇上的老人后来跟孩子说：\'今天来了个毛脸的行者，眼神凶，心不坏。\'',
      },
    ],
    echoConditions: [],
    transitionText: null,
    conditionalNarration: [],
  },

  // ═══════════════════════════════════════════════════
  // 主枢纽 3-2：三打白骨精（★★ 核心节点 / 三回合组合判定）
  // ═══════════════════════════════════════════════════
  //
  // 回合一：村姑
  // ═══════════════════════════════════════════════════
  {
    id: '3-2-r1',
    actId: 3,
    title: '三打白骨精·村姑',
    narration:
      '前方来了个年轻姑娘，提着饭篮子，笑意盈盈。唐僧觉得是好人，八戒流着口水凑了上去。但你的火眼金睛看穿了——是妖怪。白骨精。你一棒打下去，她倒了，化成一滩烂肉。\n\n唐僧的脸又白了。"你怎么能打死人！"',
    conflict:
      '你怎么跟唐僧解释？',
    choices: [
      {
        id: '3-2-1A',
        text: '耐心蹲下来指给他看——"师父你看，这不是人，这是妖怪变的！"',
        effects: {
          statChanges: [{ stat: 'daoXin', delta: 3 }],
          flagChanges: [],
        },
        condition: null,
        hiddenLabel: null,
        nextNodeId: '3-2-r2',
        echoFeedback:
          '唐僧半信半疑地看了一眼地上那滩东西，脸上的怒意消了一些，但没有完全消。',
        whiteBoneTag: '1A',
      },
      {
        id: '3-2-1B',
        text: '烦了。"我的火眼金睛还能看错？信不信随你。"',
        effects: {
          statChanges: [{ stat: 'yaoXing', delta: 5 }],
          flagChanges: [],
        },
        condition: null,
        hiddenLabel: null,
        nextNodeId: '3-2-r2',
        echoFeedback:
          '唐僧不说话了。但他看你的眼神变了——像看一个陌生人。',
        whiteBoneTag: '1B',
      },
    ],
    echoConditions: [],
    transitionText: null,
    conditionalNarration: [],
  },

  // ═══════════════════════════════════════════════════
  // 回合二：老妇
  // ═══════════════════════════════════════════════════
  {
    id: '3-2-r2',
    actId: 3,
    title: '三打白骨精·老妇',
    narration:
      '白骨精又变成老妇来寻"女儿"。你又看穿了，又一棒。唐僧念了紧箍咒。八戒在旁边煽风点火："师父，这猴子就是杀性重，怕是野性未消！"',
    conflict:
      '八戒的话刺进了你的耳朵。',
    choices: [
      {
        id: '3-2-2A',
        text: '你据理力争——"呆子你懂什么！那是妖怪不是人！"',
        effects: {
          statChanges: [
            { stat: 'daoXin', delta: 3 },
            { stat: 'yiQi', delta: 2 },
          ],
          flagChanges: [],
        },
        condition: null,
        hiddenLabel: null,
        nextNodeId: '3-2-r3',
        echoFeedback:
          '八戒缩了缩脖子，不敢再说了。唐僧叹了口气，念经的声音更低了。',
        whiteBoneTag: '2A',
      },
      {
        id: '3-2-2B',
        text: '你冷笑一声，不说话了。解释？不配。',
        effects: {
          statChanges: [{ stat: 'yaoXing', delta: 5 }],
          flagChanges: [],
        },
        condition: null,
        hiddenLabel: null,
        nextNodeId: '3-2-r3',
        echoFeedback:
          '空气冷了下来。你站在前面，背影比平时更硬。',
        whiteBoneTag: '2B',
      },
      {
        id: '3-2-2C',
        text: '你走过去一把揪起八戒的耳朵——"再多嘴试试？"',
        effects: {
          statChanges: [
            { stat: 'yaoXing', delta: 5 },
            { stat: 'yiQi', delta: -5 },
            { stat: 'eYe', delta: 1 },
          ],
          flagChanges: [],
        },
        condition: null,
        hiddenLabel: null,
        nextNodeId: '3-2-r3',
        echoFeedback:
          '八戒疼得嗷嗷叫。沙僧拉住了你的胳膊，没说话，但手劲很大。',
        whiteBoneTag: '2C',
      },
    ],
    echoConditions: [],
    transitionText: null,
    conditionalNarration: [],
  },

  // ═══════════════════════════════════════════════════
  // 回合三：老翁（★ 核心判定点 / 镜像一·后半呼应）
  // ═══════════════════════════════════════════════════
  {
    id: '3-2-r3',
    actId: 3,
    title: '三打白骨精·老翁',
    narration:
      '白骨精第三次来了，变成了老翁。你犹豫了一瞬——不是怕打不过，是怕打完之后那个眼神。那个你在菩提祖师脸上、在天庭神仙脸上、在唐僧脸上见过的眼神——"你是妖。"\n\n你还是打了。老翁碎了。白骨精的原形露了一瞬就散了。\n\n唐僧写了一张贬书。要你走。',
    conflict:
      '他的手在抖。但字写得很认真。沙僧低着头不说话。八戒别着脸。贬书递到你面前。',
    choices: [
      // 3A：跪别
      {
        id: '3-2-3A',
        text: '跪下，对唐僧磕了三个头。眼眶热了，但没有掉下来。然后你转身飞走了。',
        effects: {
          statChanges: [
            { stat: 'yiQi', delta: 10 },
            { stat: 'daoXin', delta: 5 },
          ],
          flagChanges: [
            { flag: 'FLAG_whiteBone_rupture', value: false },
          ],
        },
        condition: null,
        hiddenLabel: null,
        nextNodeId: '3-3',
        echoFeedback:
          '你飞出去很远才停下来。回头看的时候，唐僧的身影已经小得像一粒沙。你发现贬书没有拿——他可能一直举在手里等你回来接。',
        whiteBoneTag: '3A',
      },
      // 3B：撕贬书决裂
      {
        id: '3-2-3B',
        text: '一把撕了贬书。"行，你不要我，我也不稀罕你这经！" 一个筋斗翻走了。',
        effects: {
          statChanges: [{ stat: 'yaoXing', delta: 10 }],
          flagChanges: [
            { flag: 'FLAG_whiteBone_rupture', value: true },
          ],
        },
        condition: null,
        hiddenLabel: null,
        nextNodeId: '3-3',
        echoFeedback:
          '金箍棒重了。不是真的重了，是你手上没力气了。风把那张撕碎的贬书吹散了，一片一片的，像雪。',
        whiteBoneTag: '3B',
      },
      // 3C：折好贬书、托付沙僧
      {
        id: '3-2-3C',
        text: '接过贬书，折好放进怀里。然后轻声对沙僧说："照顾好师父。他不知道什么是妖。" 走了。',
        effects: {
          statChanges: [
            { stat: 'yiQi', delta: 15 },
            { stat: 'daoXin', delta: 8 },
          ],
          flagChanges: [
            { flag: 'FLAG_whiteBone_rupture', value: false },
          ],
        },
        condition: null,
        hiddenLabel: null,
        nextNodeId: '3-3',
        echoFeedback:
          '沙僧点了一下头。他说：\'大师兄，路上小心。\' 你嗯了一声，走了。那是你这辈子飞得最慢的一个筋斗。',
        whiteBoneTag: '3C',
      },
    ],
    echoConditions: [],
    transitionText: null,
    conditionalNarration: [
      {
        condition: 'FLAG_subodhi_gratitude == true',
        text: '这一刻，你想起了菩提祖师。又是一个师父叫你走。上一次是怕你惹祸，这一次是觉得你就是祸。',
      },
    ],
  },

  // ═══════════════════════════════════════════════════
  // 主枢纽 3-3 / 大转折：真假美猴王（★★ 核心节点 / 镜像三）
  // 此节点仅在悟空未永久离队时触发
  // ═══════════════════════════════════════════════════
  {
    id: '3-3',
    actId: 3,
    title: '真假美猴王',
    narration:
      '你离队后不久，唐僧被打伤了。打他的人——是另一个你。一模一样的脸，一模一样的金箍棒，一模一样的筋斗云。他甚至建了一个"假取经团队"，连八戒和沙僧都分不清。\n\n你找到他了。面对面站着。风停了。\n\n他看着你笑。那个笑容你认识——是你在大闹天宫时的笑。',
    conflict:
      '你知道他是谁。他就是你。他是你心里那个从没被五行山压服的部分，是你被唐僧赶走时想过的每一个黑暗念头。六耳猕猴。\n\n你的另一面。',
    condition: 'permanentLeave == false',
    skipToNodeId: 'ending-qtds',
    choices: [
      // A：毫不犹豫举棒
      {
        id: '3-3A',
        text: '毫不犹豫地举棒打下去。"你不是我。"',
        effects: {
          statChanges: [
            { stat: 'daoXin', delta: 8 },
            { stat: 'eYe', delta: 1 },
          ],
          flagChanges: [
            { flag: 'FLAG_sixEar_acknowledge', value: false },
          ],
        },
        condition: null,
        hiddenLabel: null,
        nextNodeId: '4-1',
        echoFeedback:
          '六耳猕猴碎了。你看着那些碎片散落，忽然觉得胸口空了一块。好像自己也少了什么。',
      },
      // B：犹豫——让他去
      {
        id: '3-3B',
        text: '你犹豫了。心想：要不就让他去吧。他比我更像真正的孙悟空——不用受气，不用低头，不用戴着这个破箍。',
        effects: {
          statChanges: [{ stat: 'yaoXing', delta: 10 }],
          flagChanges: [
            { flag: 'FLAG_sixEar_acknowledge', value: false },
          ],
        },
        condition: null,
        hiddenLabel: null,
        nextNodeId: '4-1',
        echoFeedback:
          '你站了很久，最后还是举棒了。但那一棒打下去的时候，你分不清打的是他还是自己。',
      },
      // C：承认——然后举棒
      {
        id: '3-3C',
        text: '你放下棒子，看着他说了一句话："你是我。但我不走你那条路了。" 然后举棒。',
        effects: {
          statChanges: [
            { stat: 'daoXin', delta: 15 },
            { stat: 'yiQi', delta: 5 },
            { stat: 'shanYe', delta: 1 },
          ],
          flagChanges: [
            { flag: 'FLAG_sixEar_acknowledge', value: true },
          ],
        },
        condition: null,
        hiddenLabel: null,
        nextNodeId: '4-1',
        echoFeedback:
          '六耳猕猴在消散之前看了你一眼。那个眼神你会记很久——他不是恨，是遗憾。像在说：\'你确定？\'你确定。',
      },
    ],
    echoConditions: [
      {
        condition: '善业 >= 4',
        text: '如来在旁边看完了全程。他没有说话，但你感到他看你的眼神变了。不是怜悯，是某种……认可。',
      },
    ],
    transitionText: null,
    conditionalNarration: [],
  },
];

export default act3Nodes;
