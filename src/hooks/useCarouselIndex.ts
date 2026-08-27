import { useEffect, useState } from 'react';

export type CarouselDirection = 'forward' | 'backward';

export function useCarouselIndex(length: number, autoAdvanceMs = 5000) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<CarouselDirection>('forward');

  useEffect(() => {
    if (index >= length) setIndex(0);
  }, [length, index]);

  useEffect(() => {
    if (length <= 1 || !autoAdvanceMs) return;
    const timer = setInterval(() => {
      setDirection('forward');
      setIndex((i) => (i + 1) % length);
    }, autoAdvanceMs);
    return () => clearInterval(timer);
  }, [length, autoAdvanceMs]);

  const goPrev = () => {
    setDirection('backward');
    setIndex((current) => (current - 1 + length) % length);
  };
  const goNext = () => {
    setDirection('forward');
    setIndex((current) => (current + 1) % length);
  };

  return { index, direction, goPrev, goNext, setIndex };
}
