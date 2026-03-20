import { useState, useEffect, useCallback, useRef, type MutableRefObject } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  /** Parent can pass a ref to receive the skip function */
  onSkipRef?: MutableRefObject<(() => void) | null>;
  className?: string;
}

/**
 * Typewriter effect component.
 * Displays text character by character.
 * Click anywhere on the component (or call onSkipRef) to skip.
 */
export default function TypewriterText({
  text,
  speed = 50,
  onComplete,
  onSkipRef,
  className = '',
}: TypewriterTextProps) {
  const [displayedLength, setDisplayedLength] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCompleteRef = useRef(onComplete);

  // Keep the onComplete ref up to date
  onCompleteRef.current = onComplete;

  // Reset when text changes
  useEffect(() => {
    setDisplayedLength(0);
    setIsComplete(false);
  }, [text]);

  // Detect completion
  useEffect(() => {
    if (displayedLength >= text.length && !isComplete) {
      setIsComplete(true);
      onCompleteRef.current?.();
    }
  }, [displayedLength, text.length, isComplete]);

  // Typewriter interval
  useEffect(() => {
    if (isComplete || displayedLength >= text.length) return;

    intervalRef.current = setInterval(() => {
      setDisplayedLength((prev) => {
        if (prev >= text.length) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return prev;
        }
        return prev + 1;
      });
    }, speed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, speed, isComplete, displayedLength]);

  // Skip to full text
  const handleSkip = useCallback(() => {
    if (isComplete) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDisplayedLength(text.length);
    setIsComplete(true);
    onCompleteRef.current?.();
  }, [isComplete, text.length]);

  // Expose skip function to parent
  useEffect(() => {
    if (onSkipRef) {
      onSkipRef.current = handleSkip;
    }
    return () => {
      if (onSkipRef) onSkipRef.current = null;
    };
  }, [onSkipRef, handleSkip]);

  const displayedText = text.slice(0, displayedLength);

  return (
    <div onClick={handleSkip} className={`select-none ${className}`}>
      {displayedText.split('\n').map((line, i, arr) => (
        <span key={i}>
          {line}
          {i < arr.length - 1 && <br />}
        </span>
      ))}
      {!isComplete && (
        <span className="typewriter-cursor inline-block ml-0.5 text-dao-gold">
          |
        </span>
      )}
    </div>
  );
}
