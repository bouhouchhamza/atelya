import { useEffect, useRef, useState } from 'react';

interface UseDeferredMountOptions {
  enabled?: boolean;
  delayMs?: number;
  rootMargin?: string;
  threshold?: number;
}

export function useDeferredMount<TElement extends HTMLElement = HTMLDivElement>({
  enabled = true,
  delayMs = 0,
  rootMargin = '0px',
  threshold = 0,
}: UseDeferredMountOptions = {}) {
  const targetRef = useRef<TElement | null>(null);
  const [isInView, setIsInView] = useState(false);
  const [isDelayElapsed, setIsDelayElapsed] = useState(delayMs <= 0);
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setIsInView(false);
      setShouldMount(false);
      return;
    }

    if (delayMs <= 0) {
      setIsDelayElapsed(true);
      return;
    }

    setIsDelayElapsed(false);
    const timeoutId = window.setTimeout(() => {
      setIsDelayElapsed(true);
    }, delayMs);

    return () => window.clearTimeout(timeoutId);
  }, [delayMs, enabled]);

  useEffect(() => {
    if (!enabled || !targetRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(targetRef.current);
    return () => observer.disconnect();
  }, [enabled, rootMargin, threshold]);

  useEffect(() => {
    if (!enabled || shouldMount) {
      return;
    }

    if (isDelayElapsed || isInView) {
      setShouldMount(true);
    }
  }, [enabled, isDelayElapsed, isInView, shouldMount]);

  return { targetRef, shouldMount, isInView };
}
