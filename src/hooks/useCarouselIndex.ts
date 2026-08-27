import { useEffect, useState } from 'react';

export function useCarouselIndex(length: number, autoAdvanceMs = 5000) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index >= length) setIndex(0);
  }, [length, index]);

  useEffect(() => {
    if (length <= 1 || !autoAdvanceMs) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % length), autoAdvanceMs);
    return () => clearInterval(timer);
  }, [length, autoAdvanceMs]);

  const goPrev = () => setIndex((current) => (current - 1 + length) % length);
  const goNext = () => setIndex((current) => (current + 1) % length);

  return { index, goPrev, goNext, setIndex };
}
