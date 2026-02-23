import { createContext, useContext, useEffect, useState } from 'react';
import type { Settings } from '../lib/types/settings';
import { getPublicSettings } from '../lib/api';
import { fallbackPublicSettings } from '../lib/fallbacks';

const SettingsContext = createContext<Settings>(fallbackPublicSettings);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(fallbackPublicSettings);

  useEffect(() => {
    getPublicSettings()
      .then((res) => setSettings(res ?? fallbackPublicSettings))
      .catch(() => setSettings(fallbackPublicSettings));
  }, []);

  useEffect(() => {
    if (settings?.primary_color) {
      document.documentElement.style.setProperty('--primary-color', settings.primary_color);
    }
    if (settings?.favicon_url) {
      let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = settings.favicon_url;
    }
  }, [settings]);

  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  return useContext(SettingsContext);
}
