import { useState, useCallback, useEffect, useRef } from 'react';
import { useGameState } from './engine/gameState.ts';
import {
  getVisibleChoices,
  getActiveEchoes,
  shouldWhiteBonePermanentLeave,
  evaluateCondition,
} from './engine/conditions.ts';
import { determineEnding } from './engine/endings.ts';
import { storyNodeMap } from './data/story/index.ts';
import type { Choice, StoryNode } from './data/types.ts';

import StartScreen from './components/StartScreen.tsx';
import StatusBar, { getActTitle } from './components/StatusBar.tsx';
import NarrativeBox from './components/NarrativeBox.tsx';
import ChoicePanel from './components/ChoicePanel.tsx';
import SceneTransition from './components/SceneTransition.tsx';
import EndingScreen from './components/EndingScreen.tsx';

type GamePhase = 'start' | 'playing' | 'transition' | 'ending';

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
  const lastActIdRef = useRef<number>(1);

  // Current node (resolved with condition checks)
  const currentNode = phase === 'playing' || phase === 'transition'
    ? resolveNode(state.currentNodeId, state)
    : null;

  // Handle starting the game
  const handleStart = useCallback(() => {
    setPhase('playing');
    setNarrationComplete(false);
    setLastEchoFeedback(null);
  }, []);

  // Handle choice selection
  const handleChoice = useCallback((choice: Choice) => {
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
    dispatch({ type: 'RESET_GAME' });
    setPhase('start');
    setNarrationComplete(false);
    setLastEchoFeedback(null);
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
      {phase === 'start' && <StartScreen onStart={handleStart} />}

      {/* Playing */}
      {phase === 'playing' && currentNode && (
        <>
          <StatusBar
            actTitle={getActTitle(currentNode.actId)}
            stats={state.stats}
          />

          {/* Spacer for fixed header */}
          <div className="h-16 md:h-20 shrink-0" />

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
    </div>
  );
}
