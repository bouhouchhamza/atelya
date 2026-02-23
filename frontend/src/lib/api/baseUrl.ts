const LOCAL_DEV_HOSTS = new Set(['127.0.0.1', 'localhost']);

function trimTrailingSlash(value: string) {
  return value.replace(/\/$/, '');
}

function resolveApiBaseUrl() {
  const envValue = (
    import.meta.env.VITE_API_URL ??
    import.meta.env.VITE_API_BASE_URL ??
    ''
  ).trim();

  if (typeof window === 'undefined') {
    return trimTrailingSlash(envValue || 'http://127.0.0.1:8000');
  }

  const defaultFromCurrentHost = `${window.location.protocol}//${window.location.hostname}:8000`;

  if (!envValue) {
    return trimTrailingSlash(defaultFromCurrentHost);
  }

  try {
    const parsed = new URL(envValue);
    const isLocalDevPair =
      LOCAL_DEV_HOSTS.has(parsed.hostname) &&
      LOCAL_DEV_HOSTS.has(window.location.hostname);

    if (isLocalDevPair) {
      const port = parsed.port || '8000';
      return trimTrailingSlash(`${parsed.protocol}//${window.location.hostname}:${port}`);
    }

    return trimTrailingSlash(parsed.toString());
  } catch {
    return trimTrailingSlash(envValue);
  }
}

export const API_BASE_URL = resolveApiBaseUrl();
