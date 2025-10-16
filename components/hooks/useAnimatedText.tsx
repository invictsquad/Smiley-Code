import { animate } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

export function useAnimatedText(text: string, delimiter: string = '') {
  const [cursor, setCursor] = useState(0);
  const [startingCursor, setStartingCursor] = useState(0);
  const prevText = useRef(text);
  const prevCursor = useRef(0);

  useEffect(() => {
    if (prevText.current !== text) {
      const newStartingCursor = text.startsWith(prevText.current) ? prevCursor.current : 0;
      setStartingCursor(newStartingCursor);
      prevText.current = text;
    }
  }, [text]);

  useEffect(() => {
    const parts = text.split(delimiter);
    const duration = delimiter === '' ? 8 : // Character animation
                    delimiter === ' ' ? 4 : // Word animation
                    2; // Chunk animation
    
    const controls = animate(startingCursor, parts.length, {
      duration,
      ease: 'easeOut',
      onUpdate(latest) {
        const newCursor = Math.floor(latest);
        setCursor(newCursor);
        prevCursor.current = newCursor;
      },
    });

    return () => controls.stop();
  }, [startingCursor, text, delimiter]);

  return text.split(delimiter).slice(0, cursor).join(delimiter);
}
