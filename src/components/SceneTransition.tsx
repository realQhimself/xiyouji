import { useState, useEffect, useRef } from 'react';

interface SceneTransitionProps {
  /** Whether a transition is active */
  active: boolean;
  /** Optional act title to show during act transitions */
  actTitle?: string | null;
  /** Optional transition text (e.g. 幕间过渡) */
  transitionText?: string | null;
  /** Called when the transition is fully complete (after fade back in) */
  onComplete: () => void;
}

/**
 * Scene transition overlay.
 * Fades to black, optionally shows act title or transition text,
 * then fades back out.
 */
export default function SceneTransition({
  active,
  actTitle,
  transitionText,
  onComplete,
}: SceneTransitionProps) {
  const [phase, setPhase] = useState<'idle' | 'fadeIn' | 'hold' | 'fadeOut'>('idle');
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    // Clear all timers on cleanup
    return () => {
      for (const t of timersRef.current) clearTimeout(t);
      timersRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (!active) {
      setPhase('idle');
      return;
    }

    // Clear previous timers
    for (const t of timersRef.current) clearTimeout(t);
    timersRef.current = [];

    // Start fade in
    setPhase('fadeIn');

    const hasContent = actTitle || transitionText;
    const holdDuration = transitionText ? 3500 : hasContent ? 2000 : 800;

    const t1 = setTimeout(() => {
      setPhase('hold');

      const t2 = setTimeout(() => {
        setPhase('fadeOut');

        const t3 = setTimeout(() => {
          setPhase('idle');
          onCompleteRef.current();
        }, 800);

        timersRef.current.push(t3);
      }, holdDuration);

      timersRef.current.push(t2);
    }, 800);

    timersRef.current.push(t1);

    return () => {
      for (const t of timersRef.current) clearTimeout(t);
      timersRef.current = [];
    };
  }, [active, actTitle, transitionText]);

  if (phase === 'idle' && !active) return null;

  return (
    <div
      className={`
        fixed inset-0 z-[100] flex items-center justify-center
        bg-ink-black
        transition-opacity duration-700 ease-in-out
        ${phase === 'fadeIn' || phase === 'hold' ? 'opacity-100' : 'opacity-0'}
        ${phase === 'idle' ? 'pointer-events-none' : 'pointer-events-auto'}
      `}
    >
      {(phase === 'hold' || phase === 'fadeOut') && (
        <div className="text-center px-8 animate-fade-in">
          {actTitle && (
            <h1 className="text-2xl md:text-3xl text-dao-gold tracking-[0.2em] mb-4">
              {actTitle}
            </h1>
          )}
          {transitionText && (
            <p className="text-paper-dim leading-loose text-base md:text-lg max-w-lg whitespace-pre-line">
              {transitionText}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
