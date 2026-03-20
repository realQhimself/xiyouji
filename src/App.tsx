import { useState, useCallback, useEffect, useRef } from 'react';
import { useGameState, loadSave, clearSave } from './engine/gameState.ts';
import {
  getVisibleChoices,
  getActiveEchoes,
  shouldWhiteBonePermanentLeave,
  evaluateCondition,
} from './engine/conditions.ts';
import { determineEnding } from './engine/endings.ts';
import { storyNodeMap } from './data/story/index.ts';
import type { Choice, StoryNode, Stats } from './data/types.ts';

import StartScreen from './components/StartScreen.tsx';
import StatusBar, { getActTitle } from './components/StatusBar.tsx';
import NarrativeBox from './components/NarrativeBox.tsx';
import ChoicePanel from './components/ChoicePanel.tsx';
import SceneTransition from './components/SceneTransition.tsx';
import EndingScreen from './components/EndingScreen.tsx';

type GamePhase = 'start' | 'playing' | 'transition' | 'ending';

/** 数值变化提示 */
interface StatDelta {
  label: string;
  delta: number;
  color: string;
}

const STAT_LABELS: Record<string, { label: string; color: string }> = {
  daoXin: { label: '道心', color: 'text-dao-gold' },
  yaoXing: { label: '妖性', color: 'text-yao-red-bright' },
  yiQi: { label: '义气', color: 'text-yi-blue-bright' },
  shanYe: { label: '善业', color: 'text-karma-good' },
  eYe: { label: '恶业', color: 'text-karma-bad' },
};

function calcStatDeltas(oldStats: Stats, newStats: Stats): StatDelta[] {
  const deltas: StatDelta[] = [];
  for (const key of Object.keys(STAT_LABELS) as (keyof Stats)[]) {
    const diff = newStats[key] - oldStats[key];
    if (diff !== 0) {
      const info = STAT_LABELS[key]!;
      deltas.push({ label: info.label, delta: diff, color: info.color });
    }
  }
  return deltas;
}

/**
 * Background gradient based on current act/scene.
 */
function getBackgroundGradient(actId: number, nodeId: string): string {
  // Battle scenes in act 2
  if (actId === 2 && (nodeId === '2-3' || nodeId === '2-4')) {
    return 'linear-gradient(180deg, #1a0505 0%, #0a0a0f 50%, #120808 100%)';
  }

  switch (actId) {
    case 1: // Hua Guo Shan: deep green + moonlight white
      return 'linear-gradient(180deg, #0a1a0a 0%, #0a0a0f 40%, #0f0f18 100%)';
    case 2: // Heaven: gold + purple
      return 'linear-gradient(180deg, #1a1508 0%, #0a0a0f 40%, #0f0a18 100%)';
    case 3: // Journey: sunset orange + sand
      return 'linear-gradient(180deg, #1a1208 0%, #0a0a0f 40%, #14100a 100%)';
    case 4: // Act 4: warmer version of act 3
      return 'linear-gradient(180deg, #1a1008 0%, #0a0a0f 40%, #18120a 100%)';
    case 5: // Ling Shan: pure gold + white
      return 'linear-gradient(180deg, #1a1505 0%, #0a0a0f 30%, #1a1808 100%)';
    default:
      return 'linear-gradient(180deg, #0a0a0f 0%, #0a0a0f 100%)';
  }
}

/**
 * Resolve the current node, handling conditional skips.
 * If a node has a `condition` that's not met, follow skipToNodeId chain.
 */
function resolveNode(nodeId: string, state: Parameters<typeof evaluateCondition>[1]): StoryNode | null {
  const maxHops = 10; // safety limit
  let currentId = nodeId;

  for (let i = 0; i < maxHops; i++) {
    const node = storyNodeMap.get(currentId);
    if (!node) return null;

    // Check if node has a condition and whether it's met
    if (node.condition && !evaluateCondition(node.condition, state)) {
      if (node.skipToNodeId) {
        currentId = node.skipToNodeId;
        continue;
      }
      return null; // No skip target, dead end
    }

    return node;
  }

  return null;
}

export default function App() {
  const [state, dispatch] = useGameState();
  const [phase, setPhase] = useState<GamePhase>('start');
  const [narrationComplete, setNarrationComplete] = useState(false);
  const [lastEchoFeedback, setLastEchoFeedback] = useState<string | null>(null);
  const [transitionActTitle, setTransitionActTitle] = useState<string | null>(null);
  const [transitionText, setTransitionText] = useState<string | null>(null);
  const [pendingNodeId, setPendingNodeId] = useState<string | null>(null);
  const [statDeltas, setStatDeltas] = useState<StatDelta[]>([]);
  const lastActIdRef = useRef<number>(1);

  // Current node (resolved with condition checks)
  const currentNode = phase === 'playing' || phase === 'transition'
    ? resolveNode(state.currentNodeId, state)
    : null;

  // Handle starting a new game
  const handleStart = useCallback(() => {
    clearSave();
    dispatch({ type: 'RESET_GAME' });
    setPhase('playing');
    setNarrationComplete(false);
    setLastEchoFeedback(null);
    setStatDeltas([]);
  }, [dispatch]);

  // Handle continuing from save
  const handleContinue = useCallback(() => {
    const saved = loadSave();
    if (saved) {
      dispatch({ type: 'LOAD_SAVE', payload: saved });
      const node = storyNodeMap.get(saved.currentNodeId);
      if (node) {
        lastActIdRef.current = node.actId;
      }
      setPhase('playing');
      setNarrationComplete(false);
      setLastEchoFeedback(null);
      setStatDeltas([]);
    } else {
      // 存档无效，重新开始
      handleStart();
    }
  }, [dispatch, handleStart]);

  // Handle choice selection
  const handleChoice = useCallback((choice: Choice) => {
    // 记录选择前的数值，用于计算变化量
    const prevStats = { ...state.stats };

    // Record whiteBoneTag if present
    if (choice.whiteBoneTag) {
      const roundNum = parseInt(choice.whiteBoneTag[0]!) as 1 | 2 | 3;
      dispatch({
        type: 'RECORD_WHITE_BONE_ROUND',
        payload: { round: roundNum, tag: choice.whiteBoneTag },
      });
    }

    // Track biquguoChoiceC
    if (choice.id === '4-2C') {
      dispatch({ type: 'SET_BIQUGUO_C' });
    }

    // Save echo feedback for display in next scene
    setLastEchoFeedback(choice.echoFeedback);

    // Apply choice effects via MAKE_CHOICE
    dispatch({
      type: 'MAKE_CHOICE',
      payload: {
        nodeId: state.currentNodeId,
        choice,
      },
    });

    // After state update, determine what happens next.
    // We need the nextNodeId from the choice.
    const nextId = choice.nextNodeId;

    // Check permanent leave conditions:
    // 1. Hidden option 3-1A2 directly triggers permanent leave
    if (choice.id === '3-1A2') {
      dispatch({ type: 'SET_PERMANENT_LEAVE' });
    }

    // 2. After white bone round 3, check combined rupture intensity
    if (choice.whiteBoneTag?.startsWith('3')) {
      // Build the new whiteBoneRounds to check
      const newRounds = { ...state.whiteBoneRounds };
      newRounds.round3 = choice.whiteBoneTag as typeof newRounds.round3;

      // Calculate new yaoXing (approximate - effects already dispatched)
      let newYaoXing = state.stats.yaoXing;
      for (const sc of choice.effects.statChanges) {
        if (sc.stat === 'yaoXing') {
          newYaoXing = sc.setTo !== undefined ? sc.setTo : newYaoXing + sc.delta;
        }
      }
      newYaoXing = Math.max(0, Math.min(100, newYaoXing));

      if (shouldWhiteBonePermanentLeave(newRounds, newYaoXing)) {
        dispatch({ type: 'SET_PERMANENT_LEAVE' });
      }
    }

    // Check for act transition or ending
    const currentActId = currentNode?.actId ?? 1;

    // Get the next node to check its act
    const nextNode = storyNodeMap.get(nextId);
    const nextActId = nextNode?.actId ?? currentActId;

    // Check if this is the ending node
    const isEndingNode = nextId === 'ending' || nextId === 'ending-qtds';

    // Check if there's a transitionText on the current node
    const currentTransitionText = currentNode?.transitionText ?? null;

    // 计算数值变化提示（在任何场景切换前显示）
    const computedStats = { ...prevStats };
    for (const sc of choice.effects.statChanges) {
      if (sc.setTo !== undefined) {
        computedStats[sc.stat] = sc.setTo;
      } else {
        computedStats[sc.stat] += sc.delta;
      }
    }
    const deltas = calcStatDeltas(prevStats, computedStats);
    if (deltas.length > 0) {
      setStatDeltas(deltas);
      setTimeout(() => setStatDeltas([]), 2500);
    }

    if (isEndingNode) {
      // Transition to ending
      setTransitionActTitle(null);
      setTransitionText(currentTransitionText);
      setPendingNodeId(nextId);
      setPhase('transition');
      return;
    }

    // Check for act change
    if (nextActId !== currentActId || currentTransitionText) {
      setTransitionActTitle(nextActId !== currentActId ? getActTitle(nextActId) : null);
      setTransitionText(currentTransitionText);
      setPendingNodeId(null); // Will use state's currentNodeId after transition
      setPhase('transition');
      lastActIdRef.current = nextActId;
      return;
    }

    // Normal scene change
    setNarrationComplete(false);
    lastActIdRef.current = nextActId;
  }, [state, currentNode, dispatch]);

  // Handle transition completion
  const handleTransitionComplete = useCallback(() => {
    if (pendingNodeId === 'ending' || pendingNodeId === 'ending-qtds') {
      // Determine and set ending
      const endingResult = determineEnding(state);
      dispatch({ type: 'SET_ENDING', payload: endingResult });
      setPhase('ending');
    } else {
      setPhase('playing');
      setNarrationComplete(false);
    }
    setTransitionActTitle(null);
    setTransitionText(null);
    setPendingNodeId(null);
  }, [pendingNodeId, state, dispatch]);

  // Handle restart
  const handleRestart = useCallback(() => {
    clearSave();
    dispatch({ type: 'RESET_GAME' });
    setPhase('start');
    setNarrationComplete(false);
    setLastEchoFeedback(null);
    setStatDeltas([]);
    lastActIdRef.current = 1;
  }, [dispatch]);

  // Check if we landed on ending node directly (from state change)
  useEffect(() => {
    if (phase === 'playing' && (state.currentNodeId === 'ending' || state.currentNodeId === 'ending-qtds')) {
      const endingResult = determineEnding(state);
      dispatch({ type: 'SET_ENDING', payload: endingResult });
      setPhase('ending');
    }
  }, [phase, state, dispatch]);

  // Get current act for background
  const currentActId = currentNode?.actId ?? lastActIdRef.current;

  // Visible choices
  const visibleChoices = currentNode
    ? getVisibleChoices(currentNode.choices, state)
    : [];

  // Echo texts (karma echoes)
  const echoTexts = currentNode
    ? getActiveEchoes(currentNode.echoConditions, state)
    : [];

  // Conditional narration
  const conditionalNarrationTexts = currentNode
    ? getActiveEchoes(currentNode.conditionalNarration, state)
    : [];

  return (
    <div
      className="game-bg min-h-svh flex flex-col"
      style={{ background: getBackgroundGradient(currentActId, state.currentNodeId) }}
    >
      {/* Start Screen */}
      {phase === 'start' && <StartScreen onStart={handleStart} onContinue={handleContinue} />}

      {/* Playing */}
      {phase === 'playing' && currentNode && (
        <>
          <StatusBar
            actTitle={getActTitle(currentNode.actId)}
            sceneTitle={currentNode.title}
            stats={state.stats}
          />

          {/* Spacer for fixed header */}
          <div className="h-24 md:h-28 shrink-0" />

          <NarrativeBox
            key={currentNode.id}
            narration={currentNode.narration}
            conflict={currentNode.conflict}
            conditionalNarration={conditionalNarrationTexts}
            echoTexts={echoTexts}
            echoFeedback={lastEchoFeedback}
            onNarrationComplete={() => setNarrationComplete(true)}
          />

          <ChoicePanel
            key={`choices-${currentNode.id}`}
            choices={visibleChoices}
            visible={narrationComplete}
            onChoose={handleChoice}
          />

          {/* Bottom safe area */}
          <div className="h-4 shrink-0" />
        </>
      )}

      {/* Scene Transition */}
      <SceneTransition
        active={phase === 'transition'}
        actTitle={transitionActTitle}
        transitionText={transitionText}
        onComplete={handleTransitionComplete}
      />

      {/* Ending Screen */}
      {phase === 'ending' && state.ending && (
        <EndingScreen
          ending={state.ending}
          state={state}
          onRestart={handleRestart}
        />
      )}

      {/* Stat Change Toast */}
      {statDeltas.length > 0 && (
        <div className="fixed top-16 right-4 z-[90] flex flex-col gap-1.5 animate-fade-in">
          {statDeltas.map((d, i) => (
            <div
              key={i}
              className={`
                stat-delta-toast px-3 py-1.5 rounded-md
                bg-ink-dark/90 backdrop-blur-sm
                border border-ink-light/40
                text-sm tracking-wider
                ${d.color}
              `}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {d.label} {d.delta > 0 ? '+' : ''}{d.delta}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
