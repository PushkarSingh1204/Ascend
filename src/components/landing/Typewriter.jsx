// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\components\landing\Typewriter.jsx
import React, { useState, useEffect } from 'react';

/**
 * Custom hook for typewriter text effect.
 * @param {string} text The full text string to type out (can include \n).
 * @param {number} speed Speed in ms per character.
 * @param {number} startDelay Initial delay before typing starts.
 * @returns {{ displayed: string, done: boolean }}
 */
export function useTypewriter(text, speed = 38, startDelay = 600) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);

    let index = 0;
    let timer = null;

    const delayTimeout = setTimeout(() => {
      timer = setInterval(() => {
        index++;
        if (index <= text.length) {
          setDisplayed(text.slice(0, index));
        } else {
          setDone(true);
          clearInterval(timer);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(delayTimeout);
      if (timer) clearInterval(timer);
    };
  }, [text, speed, startDelay]);

  return { displayed, done };
}

/**
 * Typewriter text component with blinking cursor.
 */
export default function Typewriter({ 
  text, 
  speed = 38, 
  startDelay = 600, 
  className = '' 
}) {
  const { displayed, done } = useTypewriter(text, speed, startDelay);

  return (
    <span className={`whitespace-pre-wrap ${className}`}>
      {displayed}
      {!done && (
        <span className="inline-block w-[3px] h-[0.9em] bg-primary align-middle ml-1 animate-blink rounded-full" />
      )}
    </span>
  );
}
