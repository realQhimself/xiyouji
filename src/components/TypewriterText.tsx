import { useState, useEffect, useCallback, useRef } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
}

/**
 * Typewriter effect component.
 * Displays text character by character.
 * Click anywhere on the component to skip and show full text instantly.
 */
export default function TypewriterText({
  text,
  speed = 50,
  onComplete,
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

  // Typewriter interval
  useEffect(() => {
    if (isComplete) return;

    intervalRef.current = setInterval(() => {
      setDisplayedLength((prev) => {
        if (prev >= text.length) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setIsComplete(true);
          onCompleteRef.current?.();
          return prev;
        }
        return prev + 1;
      });
    }, speed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, speed, isComplete]);

  // Skip to full text
  const handleSkip = useCallback(() => {
    if (isComplete) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDisplayedLength(text.length);
    setIsComplete(true);
    onCompleteRef.current?.();
  }, [isComplete, text.length]);

  const displayedText = text.slice(0, displayedLength);

  return (
    <div onClick={handleSkip} className={`cursor-pointer select-none ${className}`}>
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
