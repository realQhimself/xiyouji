// ============================================================
// 西游·心猿 — 游戏类型定义
// ============================================================

// ------ 数值系统 ------

/** 三条核心数值 + 因果双计数器 */
export interface Stats {
  /** 道心：修行觉悟、克制、慈悲 (0-100, 初始30) */
  daoXin: number;
  /** 妖性：野性、破坏欲、自由执念 (0-100, 初始30) */
  yaoXing: number;
  /** 义气：同伴情感纽带 (0-100, 初始30) */
  yiQi: number;
  /** 善业计数器 (>=0) */
  shanYe: number;
  /** 恶业计数器 (>=0) */
  eYe: number;
}

/** 核心三维数值的键 */
export type CoreStatKey = 'daoXin' | 'yaoXing' | 'yiQi';

/** 所有可变数值的键（含因果） */
export type StatKey = keyof Stats;

// ------ 旗标系统 ------

/** 灵山前夜三选一的自我定义 */
export type LingshanAffirm = 'worth_it' | 'another_shackle' | 'for_them';

/** 布尔旗标 */
export interface Flags {
  /** 离开菩提祖师时是否心怀感恩 */
  FLAG_subodhi_gratitude: boolean;
  /** 五行山下是否有过反思 */
  FLAG_mountain_reflection: boolean;
  /** 大闹天宫是否源于"想被承认" */
  FLAG_heaven_desire: boolean;
  /** 紧箍初罚时是否接受约束 */
  FLAG_band_acceptance: boolean;
  /** 三打白骨精是否彻底决裂（离队） */
  FLAG_whiteBone_rupture: boolean;
  /** 是否承认六耳猕猴是自己的一部分 */
  FLAG_sixEar_acknowledge: boolean;
  /** 是否尝试与牛魔王和平解决 */
  FLAG_bullKing_peace: boolean;
  /** 灵山前夜的最终自我定义（三选一，null = 尚未选择） */
  FLAG_lingshan_affirm: LingshanAffirm | null;
}

export type BooleanFlagKey = Exclude<keyof Flags, 'FLAG_lingshan_affirm'>;

// ------ 三打白骨精专用 ------

/** 三打白骨精三回合的选择记录 */
export interface WhiteBoneRound {
  round1: '1A' | '1B' | null;
  round2: '2A' | '2B' | '2C' | null;
  round3: '3A' | '3B' | '3C' | null;
}

// ------ 效果系统 ------

/** 单条数值变动 */
export interface StatEffect {
  stat: StatKey;
  delta: number;
  /** 特殊：是否直接设置为某个值而非增量（如"道心归零"） */
  setTo?: number;
}

/** 单条旗标变动 */
export interface FlagEffect {
  flag: keyof Flags;
  value: boolean | LingshanAffirm;
}

/** 选项产生的所有效果 */
export interface ChoiceEffects {
  statChanges: StatEffect[];
  flagChanges: FlagEffect[];
}

// ------ 故事节点 ------

/** 因果回声条件 */
export interface EchoCondition {
  /** 条件表达式，如 "恶业 >= 3"、"FLAG_subodhi_gratitude == true" */
  condition: string;
  /** 满足条件时插入的回声文字 */
  text: string;
}

/** 单个选项 */
export interface Choice {
  /** 选项唯一标识（如 "1-1A", "3-2-1B"） */
  id: string;
  /** 选项显示文字 */
  text: string;
  /** 选择后产生的效果 */
  effects: ChoiceEffects;
  /** 显示条件表达式，为 null 则无条件显示 */
  condition: string | null;
  /** 条件不满足时的隐藏提示（仅用于开发参考，不对玩家显示） */
  hiddenLabel: string | null;
  /** 下一个节点 ID */
  nextNodeId: string;
  /** 选择后的回声反馈文字 */
  echoFeedback: string;
  /** 三打白骨精专用：此选项对应的回合标签 */
  whiteBoneTag?: string;
}

/** 故事节点 */
export interface StoryNode {
  /** 节点唯一 ID（如 "1-1", "3-2-r1"） */
  id: string;
  /** 所属幕次（1-5） */
  actId: number;
  /** 节点标题（如 "破石而出"） */
  title: string;
  /** 情境铺陈 + 冲突触发文本 */
  narration: string;
  /** 冲突触发文本（单独存储，方便 UI 分段显示） */
  conflict: string;
  /** 可选项列表 */
  choices: Choice[];
  /** 因果回声条件列表 */
  echoConditions: EchoCondition[];
  /** 幕间过渡文字（可选） */
  transitionText: string | null;
  /** 条件追加旁白（如根据旗标追加文字） */
  conditionalNarration: EchoCondition[];
  /**
   * 节点级显示条件。不满足时跳过此节点，进入下一个节点。
   * null 表示无条件（始终显示）。
   * 使用与 Choice.condition 相同的表达式语法。
   */
  condition?: string | null;
  /** 当此节点被跳过时，应跳转到的节点 ID */
  skipToNodeId?: string | null;
}

// ------ 结局 ------

/** 五种结局类型 */
export enum EndingType {
  /** 斗战胜佛 — 正统成佛 */
  DouZhanShengFo = 'dou_zhan_sheng_fo',
  /** 齐天大圣 — 不归之猴 */
  QiTianDaSheng = 'qi_tian_da_sheng',
  /** 心猿归正 — 以义成道 */
  XinYuanGuiZheng = 'xin_yuan_gui_zheng',
  /** 大圣陨落 — 悲剧牺牲（隐藏） */
  DaShengYunLuo = 'da_sheng_yun_luo',
  /** 混世魔王 — 黑化堕魔（隐藏） */
  HunShiMoWang = 'hun_shi_mo_wang',
}

/** 结局判定结果 */
export interface EndingResult {
  ending: EndingType;
  /** 结局主文字 */
  mainText: string;
  /** 因果语气变体追加段落 */
  karmaVariants: string[];
}

// ------ 游戏状态 ------

/** 历史选择记录 */
export interface HistoryEntry {
  nodeId: string;
  choiceId: string;
}

/** 完整游戏状态 */
export interface GameState {
  stats: Stats;
  flags: Flags;
  /** 当前节点 ID */
  currentNodeId: string;
  /** 选择历史 */
  history: HistoryEntry[];
  /** 三打白骨精的回合记录 */
  whiteBoneRounds: WhiteBoneRound;
  /** 是否已永久离队（提前触发齐天大圣结局线） */
  permanentLeave: boolean;
  /** 游戏是否结束 */
  isEnded: boolean;
  /** 最终结局（游戏结束后） */
  ending: EndingResult | null;
  /** 比丘国是否选择了 C（大圣陨落隐藏结局条件之一） */
  biquguoChoiceC: boolean;
  /** 是否在某次战斗中选择以命相搏（大圣陨落条件之一） */
  selfSacrifice: boolean;
}
