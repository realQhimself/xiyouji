import { useState } from 'react';
import type { Choice } from '../data/types.ts';

interface ChoicePanelProps {
  choices: Choice[];
  visible: boolean;
  onChoose: (choice: Choice) => void;
}

/**
 * Determines a glow color based on the choice's primary stat effect.
 * Gold for daoXin, Red for yaoXing, Blue for yiQi.
 */
function getChoiceGlowClass(choice: Choice): string {
  // Find the stat with the largest positive delta
  let maxStat = '';
  let maxDelta = 0;

  for (const sc of choice.effects.statChanges) {
    if (sc.stat === 'shanYe' || sc.stat === 'eYe') continue;
    const d = sc.setTo !== undefined ? 0 : sc.delta;
    if (d > maxDelta) {
      maxDelta = d;
      maxStat = sc.stat;
    }
  }

  switch (maxStat) {
    case 'daoXin':
      return 'hover:border-dao-gold/60 hover:shadow-[0_0_12px_rgba(212,168,83,0.3)]';
    case 'yaoXing':
      return 'hover:border-yao-red/60 hover:shadow-[0_0_12px_rgba(196,48,48,0.3)]';
    case 'yiQi':
      return 'hover:border-yi-blue/60 hover:shadow-[0_0_12px_rgba(90,154,190,0.3)]';
    default:
      return 'hover:border-paper-dim/40 hover:shadow-[0_0_12px_rgba(232,224,208,0.1)]';
  }
}

function getChoiceSelectedClass(choice: Choice): string {
  let maxStat = '';
  let maxDelta = 0;

  for (const sc of choice.effects.statChanges) {
    if (sc.stat === 'shanYe' || sc.stat === 'eYe') continue;
    const d = sc.setTo !== undefined ? 0 : sc.delta;
    if (d > maxDelta) {
      maxDelta = d;
      maxStat = sc.stat;
    }
  }

  switch (maxStat) {
    case 'daoXin':
      return 'border-dao-gold/80 shadow-[0_0_20px_rgba(212,168,83,0.5)]';
    case 'yaoXing':
      return 'border-yao-red/80 shadow-[0_0_20px_rgba(196,48,48,0.5)]';
    case 'yiQi':
      return 'border-yi-blue/80 shadow-[0_0_20px_rgba(90,154,190,0.5)]';
    default:
      return 'border-paper-dim/60 shadow-[0_0_20px_rgba(232,224,208,0.2)]';
  }
}

/**
 * Choice buttons panel.
 * Shows 2-3 choices vertically stacked with hover glow effects.
 * After selection: selected choice highlights, others fade, then transition.
 */
export default function ChoicePanel({ choices, visible, onChoose }: ChoicePanelProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (!visible || choices.length === 0) return null;

  const handleChoose = (choice: Choice) => {
    if (selectedId) return; // Prevent double-click
    setSelectedId(choice.id);
    // Brief highlight then transition
    setTimeout(() => {
      onChoose(choice);
      setSelectedId(null);
    }, 600);
  };

  return (
    <div className="px-4 md:px-8 pb-6 pt-2">
      <div className="max-w-2xl mx-auto space-y-3">
        {choices.map((choice, index) => {
          const isSelected = selectedId === choice.id;
          const isFadedOut = selectedId !== null && !isSelected;

          return (
            <button
              key={choice.id}
              onClick={() => handleChoose(choice)}
              disabled={selectedId !== null}
              className={`
                w-full text-left px-5 py-4 rounded-lg
                border border-ink-light/60
                bg-ink-dark/60
                text-paper leading-relaxed text-base
                transition-all duration-300 ease-out
                animate-fade-in-up
                ${getChoiceGlowClass(choice)}
                ${isSelected ? getChoiceSelectedClass(choice) : ''}
                ${isFadedOut ? 'opacity-20 scale-[0.98]' : 'opacity-100'}
                ${selectedId === null ? 'active:scale-[0.98]' : ''}
                disabled:cursor-default
              `}
              style={{
                animationDelay: `${index * 120}ms`,
                animationFillMode: 'backwards',
              }}
            >
              {choice.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}
