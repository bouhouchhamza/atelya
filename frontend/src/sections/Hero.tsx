import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import type { ModelKey } from '../three/Model';
import { useTheme } from '../contexts/ThemeContext';
import { useDeferredMount } from '../hooks/useDeferredMount';
import { useSettings } from '../contexts/SettingsContext';

const Hero3D = lazy(() => import('../three/Hero3D'));

const products: Array<{
  key: ModelKey;
  label: string;
  subtitle: string;
  badge?: string;
}> = [
  {
    key: 'earbuds',
    label: 'Wireless Earbuds',
    subtitle: 'Premium sound with active noise cancellation',
    badge: 'New',
  },
  {
    key: 'smartwatch',
    label: 'Smartwatch',
    subtitle: 'Track your fitness and stay connected all day',
  },
  {
    key: 'keyboard',
    label: 'Mechanical Keyboard',
    subtitle: 'Precision typing with tactile response and comfort',
  },
  {
    key: 'mouse',
    label: 'Gaming Mouse',
    subtitle: 'Fast response with ergonomic control and accuracy',
  },
  {
    key: 'speaker',
    label: 'Portable Speaker',
    subtitle: 'Room-filling sound in a compact premium design',
  },
];

export default function Hero() {
  const settings = useSettings();
  const [activeModel, setActiveModel] = useState<ModelKey>('earbuds');
  const { theme, toggleTheme } = useTheme();
  const [isDesktop, setIsDesktop] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth > 768 : false
  );
  const {
    targetRef: heroMediaRef,
    shouldMount: shouldLoad3D,
    isInView: isHeroVisible,
  } = useDeferredMount<HTMLDivElement>({
    enabled: isDesktop,
    delayMs: 1000,
    rootMargin: '160px 0px',
    threshold: 0.3,
  });

  useEffect(() => {
    const query = window.matchMedia('(min-width: 769px)');
    const updateViewport = (event: MediaQueryListEvent) => setIsDesktop(event.matches);

    setIsDesktop(query.matches);
    query.addEventListener('change', updateViewport);

    return () => {
      query.removeEventListener('change', updateViewport);
    };
  }, []);

  const activeProduct = useMemo(
    () => products.find((product) => product.key === activeModel) ?? products[0],
    [activeModel]
  );

  const fallbackMedia = (
    <div className="absolute inset-0">
      <img
        src="/fallback/hero-earbuds.webp"
        alt="Wireless Earbuds"
        className="h-full w-full object-cover object-center"
        loading="eager"
        decoding="async"
        fetchPriority="high"
      />
    </div>
  );

  return (
    <section className="relative w-full overflow-hidden bg-zinc-100 dark:bg-zinc-950">
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-200/50 via-transparent to-zinc-300/30 dark:from-zinc-800/50 dark:to-zinc-900/40" />

      <div className="relative mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-16">
        <header className="flex items-center justify-between">
          <span className="text-sm font-semibold tracking-[0.28em] text-zinc-900 dark:text-zinc-100">
            {settings?.store_name ?? 'ATELYA'}
          </span>
          <button
            type="button"
            aria-label="Dark mode toggle"
            onClick={toggleTheme}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-300/80 bg-white/80 text-zinc-700 transition hover:bg-white dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </button>
        </header>

        <div className="mt-10 grid items-center gap-10 lg:grid-cols-2">
          <div className="max-w-xl">
            <span className="inline-flex rounded-full bg-zinc-900 px-3 py-1 text-xs font-medium text-white dark:bg-white dark:text-zinc-900">
              {activeProduct.badge ?? 'Featured'}
            </span>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 lg:text-6xl">
              {settings?.hero_title ?? activeProduct.label}
            </h1>
            <p className="mt-4 max-w-lg text-base text-zinc-600 dark:text-zinc-400 lg:text-lg">
              {settings?.hero_subtitle ?? activeProduct.subtitle}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={settings?.hero_cta_primary_url ?? '/shop'}
                className="rounded-full bg-black px-8 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                {settings?.hero_cta_primary_text ?? 'Shop Now'}
              </a>
              <a
                href={settings?.hero_cta_secondary_url ?? '/shop'}
                className="rounded-full border border-zinc-300 bg-white px-8 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
              >
                {settings?.hero_cta_secondary_text ?? 'Learn More'}
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-2.5">
              {products.map((product) => (
                <button
                  key={product.key}
                  type="button"
                  onClick={() => setActiveModel(product.key)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    activeModel === product.key
                      ? 'bg-black text-white dark:bg-white dark:text-zinc-900'
                      : 'border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800'
                  }`}
                >
                  {product.label}
                </button>
              ))}
            </div>
          </div>

          <div
            ref={heroMediaRef}
            className="relative h-[320px] overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500 shadow-[0_32px_80px_rgba(76,29,149,0.35)] ring-1 ring-white/30 md:h-[420px] lg:h-[560px] dark:ring-white/10"
          >
            <span className="absolute left-5 top-5 z-20 rounded-full bg-white px-3 py-1 text-xs font-semibold text-zinc-900">
              {activeProduct.badge ?? 'Featured'}
            </span>
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(255,255,255,0.22),transparent_58%)]" />

            {isDesktop && shouldLoad3D ? (
              <div className="absolute inset-0">
                <Suspense fallback={fallbackMedia}>
                  <Hero3D
                    modelKey={activeModel}
                    theme={theme}
                    enableAutoRotate={isDesktop && isHeroVisible}
                  />
                </Suspense>
              </div>
            ) : (
              fallbackMedia
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
