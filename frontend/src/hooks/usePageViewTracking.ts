import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { analyticsApi } from '../lib/api/client';

const SESSION_STORAGE_KEY = 'atelya-session-id';

function getOrCreateSessionId() {
  const existing = localStorage.getItem(SESSION_STORAGE_KEY);
  if (existing) {
    return existing;
  }

  const sessionId = crypto.randomUUID();
  localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  return sessionId;
}

export function usePageViewTracking() {
  const location = useLocation();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    const fullPath = `${location.pathname}${location.search}`;
    if (lastTrackedPath.current === fullPath) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      lastTrackedPath.current = fullPath;
      analyticsApi
        .trackPageView({
          path: fullPath,
          referrer: document.referrer || null,
          device: window.innerWidth <= 768 ? 'mobile' : 'desktop',
          session_id: getOrCreateSessionId(),
        })
        .catch(() => {
          // Best effort analytics; ignore failures.
        });
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [location.pathname, location.search]);
}

export function getSessionIdForAnalytics() {
  return getOrCreateSessionId();
}
