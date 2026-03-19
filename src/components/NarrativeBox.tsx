import { useRef, useEffect } from 'react';
import TypewriterText from './TypewriterText.tsx';

interface NarrativeBoxProps {
  /** Main narration text */
  narration: string;
  /** Conflict text (displayed after narration) */
  conflict: string;
  /** Conditional narration snippets (already filtered, shown after narration) */
  conditionalNarration: string[];
  /** Echo conditions text (karma echoes, already filtered) */
  echoTexts: string[];
  /** Previous choice's echo feedback */
  echoFeedback: string | null;
  /** Callback when all text display is complete */
  onNarrationComplete: () => void;
}

/**
 * Main narrative area. Display order:
 * 1. Echo feedback from previous choice (static, italic, dimmed)
 * 2. Karma echoes (static, with left border)
 * 3. Main narration + conditional narration + conflict (typewriter)
 */
export default function NarrativeBox({
  narration,
  conflict,
  conditionalNarration,
  echoTexts,
  echoFeedback,
  onNarrationComplete,
}: NarrativeBoxProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom as content grows
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  });

  // Build the typewriter text: narration + conditional additions + conflict
  const parts = [narration];
  for (const cn of conditionalNarration) {
    parts.push(cn);
  }
  parts.push(conflict);

  const fullTypewriterText = parts.join('\n\n');

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-4 md:px-8 py-6"
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Echo feedback from previous choice */}
        {echoFeedback && (
          <div className="animate-fade-in">
            <p className="text-paper-dim/70 italic leading-loose text-base">
              {echoFeedback}
            </p>
          </div>
        )}

        {/* Karma echoes - shown with left border accent */}
        {echoTexts.length > 0 && (
          <div className="animate-fade-in space-y-3">
            {echoTexts.map((echo, i) => (
              <div
                key={i}
                className="border-l-2 border-echo-border pl-4 py-1"
              >
                <p className="text-paper-dim/60 italic leading-loose text-sm">
                  {echo}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Main narration + conditional narration + conflict (typewriter) */}
        <div className="animate-fade-in">
          <TypewriterText
            text={fullTypewriterText}
            speed={45}
            onComplete={onNarrationComplete}
            className="text-paper leading-loose text-base md:text-lg whitespace-pre-line"
          />
        </div>
      </div>
    </div>
  );
}
