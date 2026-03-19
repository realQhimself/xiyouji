// ============================================================
// 西游·心猿 — 条件评估引擎
// ============================================================

import type {
  GameState,
  Choice,
  EchoCondition,
  WhiteBoneRound,
} from '../data/types.ts';

// ------ 中文数值名 → 状态键 映射 ------

const STAT_NAME_MAP: Record<string, keyof GameState['stats']> = {
  '道心': 'daoXin',
  '妖性': 'yaoXing',
  '义气': 'yiQi',
  '善业': 'shanYe',
  '恶业': 'eYe',
};

// ------ 旗标名 → flags 键 映射 ------

const FLAG_NAME_MAP: Record<string, keyof GameState['flags']> = {
  'FLAG_subodhi_gratitude': 'FLAG_subodhi_gratitude',
  'FLAG_mountain_reflection': 'FLAG_mountain_reflection',
  'FLAG_heaven_desire': 'FLAG_heaven_desire',
  'FLAG_band_acceptance': 'FLAG_band_acceptance',
  'FLAG_whiteBone_rupture': 'FLAG_whiteBone_rupture',
  'FLAG_sixEar_acknowledge': 'FLAG_sixEar_acknowledge',
  'FLAG_bullKing_peace': 'FLAG_bullKing_peace',
  'FLAG_lingshan_affirm': 'FLAG_lingshan_affirm',
};

// ------ 条件解析器 ------

/**
 * 评估单条条件表达式。
 *
 * 支持的格式：
 * - 数值比较：  "妖性 >= 60"、"恶业 >= 3"、"道心 > 50"、"义气 < 40"
 * - 旗标布尔：  "FLAG_subodhi_gratitude == true"、"FLAG_whiteBone_rupture == false"
 * - 旗标字符串："FLAG_lingshan_affirm == worth_it"
 * - 否定旗标：  "!FLAG_sixEar_acknowledge"（等价于 == false）
 * - 永久离队：  "permanentLeave == true"
 * - 复合条件：  用 " AND " 或 " && " 连接多个子条件
 */
export function evaluateCondition(
  condition: string,
  state: GameState,
): boolean {
  // 空条件 = 无条件 = true
  if (!condition || condition.trim() === '') return true;

  const trimmed = condition.trim();

  // 复合条件：AND / &&
  if (trimmed.includes(' AND ') || trimmed.includes(' && ')) {
    const separator = trimmed.includes(' AND ') ? ' AND ' : ' && ';
    const parts = trimmed.split(separator);
    return parts.every((part) => evaluateCondition(part.trim(), state));
  }

  // 复合条件：OR / ||
  if (trimmed.includes(' OR ') || trimmed.includes(' || ')) {
    const separator = trimmed.includes(' OR ') ? ' OR ' : ' || ';
    const parts = trimmed.split(separator);
    return parts.some((part) => evaluateCondition(part.trim(), state));
  }

  // 否定旗标简写: "!FLAG_xxx"
  if (trimmed.startsWith('!FLAG_')) {
    const flagName = trimmed.slice(1); // 去掉 "!"
    if (flagName in FLAG_NAME_MAP) {
      const key = FLAG_NAME_MAP[flagName]!;
      return !state.flags[key];
    }
    return false;
  }

  // permanentLeave
  if (trimmed.startsWith('permanentLeave')) {
    const match = trimmed.match(/permanentLeave\s*(==|===|!=)\s*(\w+)/);
    if (match) {
      const [, op, val] = match;
      const boolVal = val === 'true';
      return op === '!=' ? state.permanentLeave !== boolVal : state.permanentLeave === boolVal;
    }
    return false;
  }

  // biquguoChoiceC
  if (trimmed.startsWith('biquguoChoiceC')) {
    const match = trimmed.match(/biquguoChoiceC\s*(==|===)\s*(\w+)/);
    if (match) {
      const boolVal = match[2] === 'true';
      return state.biquguoChoiceC === boolVal;
    }
    return false;
  }

  // selfSacrifice
  if (trimmed.startsWith('selfSacrifice')) {
    const match = trimmed.match(/selfSacrifice\s*(==|===)\s*(\w+)/);
    if (match) {
      const boolVal = match[2] === 'true';
      return state.selfSacrifice === boolVal;
    }
    return false;
  }

  // 旗标条件: "FLAG_xxx == value" / "FLAG_xxx != value"
  const flagMatch = trimmed.match(
    /^(FLAG_\w+)\s*(==|===|!=|!==)\s*(.+)$/,
  );
  if (flagMatch) {
    const [, flagName, operator, rawValue] = flagMatch;
    if (flagName! in FLAG_NAME_MAP) {
      const key = FLAG_NAME_MAP[flagName!]!;
      const actualValue = state.flags[key];
      const targetValue = rawValue!.trim();

      // 布尔比较
      if (targetValue === 'true' || targetValue === 'false') {
        const boolTarget = targetValue === 'true';
        if (operator === '==' || operator === '===') {
          return actualValue === boolTarget;
        }
        return actualValue !== boolTarget;
      }

      // null 比较
      if (targetValue === 'null') {
        if (operator === '==' || operator === '===') {
          return actualValue === null;
        }
        return actualValue !== null;
      }

      // 字符串比较（如 lingshan_affirm）：去掉引号
      const cleanTarget = targetValue.replace(/['"]/g, '');
      if (operator === '==' || operator === '===') {
        return actualValue === cleanTarget;
      }
      return actualValue !== cleanTarget;
    }
    return false;
  }

  // 数值比较: "妖性 >= 60"、"道心 > 50" 等
  const statMatch = trimmed.match(
    /^(.+?)\s*(>=|<=|>|<|==|!=)\s*(\d+)$/,
  );
  if (statMatch) {
    const [, statName, operator, numStr] = statMatch;
    const cleanStatName = statName!.trim();
    const targetNum = parseInt(numStr!, 10);

    if (cleanStatName in STAT_NAME_MAP) {
      const key = STAT_NAME_MAP[cleanStatName]!;
      const actualValue = state.stats[key];

      switch (operator) {
        case '>=': return actualValue >= targetNum;
        case '<=': return actualValue <= targetNum;
        case '>':  return actualValue > targetNum;
        case '<':  return actualValue < targetNum;
        case '==': return actualValue === targetNum;
        case '!=': return actualValue !== targetNum;
        default:   return false;
      }
    }

    // 也可能是英文键名
    const englishStatMap: Record<string, keyof GameState['stats']> = {
      daoXin: 'daoXin',
      yaoXing: 'yaoXing',
      yiQi: 'yiQi',
      shanYe: 'shanYe',
      eYe: 'eYe',
    };
    if (cleanStatName in englishStatMap) {
      const key = englishStatMap[cleanStatName]!;
      const actualValue = state.stats[key];

      switch (operator) {
        case '>=': return actualValue >= targetNum;
        case '<=': return actualValue <= targetNum;
        case '>':  return actualValue > targetNum;
        case '<':  return actualValue < targetNum;
        case '==': return actualValue === targetNum;
        case '!=': return actualValue !== targetNum;
        default:   return false;
      }
    }
  }

  // 无法解析的条件，安全起见返回 false
  console.warn(`[条件引擎] 无法解析条件: "${condition}"`);
  return false;
}

// ------ 选项过滤 ------

/**
 * 过滤出当前状态下可见的选项。
 * 条件为 null 的选项始终显示。
 */
export function getVisibleChoices(
  choices: Choice[],
  state: GameState,
): Choice[] {
  return choices.filter((choice) => {
    if (choice.condition === null) return true;
    return evaluateCondition(choice.condition, state);
  });
}

// ------ 因果回声 ------

/**
 * 返回当前状态下满足条件的所有回声文本。
 */
export function getActiveEchoes(
  echoes: EchoCondition[],
  state: GameState,
): string[] {
  return echoes
    .filter((echo) => evaluateCondition(echo.condition, state))
    .map((echo) => echo.text);
}

// ------ 三打白骨精 决裂强度 ------

/**
 * 计算三打白骨精的决裂强度。
 *
 * 规则：
 * - 回合一选 1B → +1
 * - 回合二选 2B 或 2C → +1
 * - 回合三选 3B → +2
 *
 * 如果 决裂强度 >= 3 且 妖性 >= 50 → 触发永久离队
 */
export function calcWhiteBoneRuptureIntensity(
  rounds: WhiteBoneRound,
): number {
  let intensity = 0;

  if (rounds.round1 === '1B') intensity += 1;
  if (rounds.round2 === '2B' || rounds.round2 === '2C') intensity += 1;
  if (rounds.round3 === '3B') intensity += 2;

  return intensity;
}

/**
 * 判断三打白骨精是否触发永久离队。
 */
export function shouldWhiteBonePermanentLeave(
  rounds: WhiteBoneRound,
  yaoXing: number,
): boolean {
  const intensity = calcWhiteBoneRuptureIntensity(rounds);
  return intensity >= 3 && yaoXing >= 50;
}
