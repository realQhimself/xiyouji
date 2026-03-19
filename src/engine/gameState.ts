// ============================================================
// 西游·心猿 — 状态管理 (useReducer)
// ============================================================

import { useReducer } from 'react';
import type {
  GameState,
  Choice,
  HistoryEntry,
  EndingResult,
  WhiteBoneRound,
} from '../data/types.ts';

// ------ 初始状态 ------

const INITIAL_STATS = {
  daoXin: 30,
  yaoXing: 30,
  yiQi: 30,
  shanYe: 0,
  eYe: 0,
} as const;

const INITIAL_FLAGS = {
  FLAG_subodhi_gratitude: false,
  FLAG_mountain_reflection: false,
  FLAG_heaven_desire: false,
  FLAG_band_acceptance: false,
  FLAG_whiteBone_rupture: false,
  FLAG_sixEar_acknowledge: false,
  FLAG_bullKing_peace: false,
  FLAG_lingshan_affirm: null,
} as const;

const INITIAL_WHITE_BONE: WhiteBoneRound = {
  round1: null,
  round2: null,
  round3: null,
};

export const INITIAL_NODE_ID = '1-1';

export function createInitialState(): GameState {
  return {
    stats: { ...INITIAL_STATS },
    flags: { ...INITIAL_FLAGS },
    currentNodeId: INITIAL_NODE_ID,
    history: [],
    whiteBoneRounds: { ...INITIAL_WHITE_BONE },
    permanentLeave: false,
    isEnded: false,
    ending: null,
    biquguoChoiceC: false,
    selfSacrifice: false,
  };
}

// ------ Action 类型 ------

export type GameAction =
  | {
      type: 'MAKE_CHOICE';
      payload: {
        nodeId: string;
        choice: Choice;
      };
    }
  | {
      type: 'SET_ENDING';
      payload: EndingResult;
    }
  | {
      type: 'SET_PERMANENT_LEAVE';
    }
  | {
      type: 'RECORD_WHITE_BONE_ROUND';
      payload: {
        round: 1 | 2 | 3;
        tag: string;
      };
    }
  | {
      type: 'SET_BIQUGUO_C';
    }
  | {
      type: 'SET_SELF_SACRIFICE';
    }
  | {
      type: 'RESET_GAME';
    };

// ------ 工具函数 ------

/** 将核心三维数值限制在 0-100 */
function clampCoreStat(value: number): number {
  return Math.max(0, Math.min(100, value));
}

/** 因果计数器不低于 0 */
function clampKarma(value: number): number {
  return Math.max(0, value);
}

// ------ Reducer ------

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'MAKE_CHOICE': {
      const { nodeId, choice } = action.payload;
      const { effects, nextNodeId } = choice;

      // 1. 应用数值变动
      const newStats = { ...state.stats };
      for (const se of effects.statChanges) {
        if (se.setTo !== undefined) {
          // 直接设置（如"道心归零"）
          newStats[se.stat] = se.setTo;
        } else {
          newStats[se.stat] += se.delta;
        }
      }

      // 2. 钳制数值范围
      newStats.daoXin = clampCoreStat(newStats.daoXin);
      newStats.yaoXing = clampCoreStat(newStats.yaoXing);
      newStats.yiQi = clampCoreStat(newStats.yiQi);
      newStats.shanYe = clampKarma(newStats.shanYe);
      newStats.eYe = clampKarma(newStats.eYe);

      // 3. 应用旗标变动
      const newFlags = { ...state.flags };
      for (const fe of effects.flagChanges) {
        // 类型安全赋值
        if (fe.flag === 'FLAG_lingshan_affirm') {
          newFlags.FLAG_lingshan_affirm = fe.value as typeof newFlags.FLAG_lingshan_affirm;
        } else {
          (newFlags[fe.flag] as boolean) = fe.value as boolean;
        }
      }

      // 4. 记录历史
      const newHistory: HistoryEntry[] = [
        ...state.history,
        { nodeId, choiceId: choice.id },
      ];

      // 5. 三打白骨精回合标签记录
      let newWhiteBone = state.whiteBoneRounds;
      if (choice.whiteBoneTag) {
        newWhiteBone = { ...newWhiteBone };
        const tag = choice.whiteBoneTag;
        if (tag.startsWith('1')) {
          newWhiteBone.round1 = tag as WhiteBoneRound['round1'];
        } else if (tag.startsWith('2')) {
          newWhiteBone.round2 = tag as WhiteBoneRound['round2'];
        } else if (tag.startsWith('3')) {
          newWhiteBone.round3 = tag as WhiteBoneRound['round3'];
        }
      }

      // 6. 比丘国C / 以命相搏标记（通过 choice.id 判断）
      let { biquguoChoiceC, selfSacrifice } = state;
      if (choice.id === '4-2C') {
        biquguoChoiceC = true;
      }
      // selfSacrifice 可由特定战斗选项触发，这里通过特殊 id 约定
      if (choice.id.includes('sacrifice')) {
        selfSacrifice = true;
      }

      return {
        ...state,
        stats: newStats,
        flags: newFlags,
        currentNodeId: nextNodeId,
        history: newHistory,
        whiteBoneRounds: newWhiteBone,
        biquguoChoiceC,
        selfSacrifice,
      };
    }

    case 'SET_ENDING': {
      return {
        ...state,
        isEnded: true,
        ending: action.payload,
      };
    }

    case 'SET_PERMANENT_LEAVE': {
      return {
        ...state,
        permanentLeave: true,
      };
    }

    case 'RECORD_WHITE_BONE_ROUND': {
      const { round, tag } = action.payload;
      const newWB = { ...state.whiteBoneRounds };
      if (round === 1) newWB.round1 = tag as WhiteBoneRound['round1'];
      if (round === 2) newWB.round2 = tag as WhiteBoneRound['round2'];
      if (round === 3) newWB.round3 = tag as WhiteBoneRound['round3'];
      return { ...state, whiteBoneRounds: newWB };
    }

    case 'SET_BIQUGUO_C': {
      return { ...state, biquguoChoiceC: true };
    }

    case 'SET_SELF_SACRIFICE': {
      return { ...state, selfSacrifice: true };
    }

    case 'RESET_GAME': {
      return createInitialState();
    }

    default:
      return state;
  }
}

// ------ Custom Hook ------

export function useGameState() {
  return useReducer(gameReducer, undefined, createInitialState);
}
