import { Platform } from 'react-native';

// Expo Router's web target has two execution contexts: an initial Node-based
// SSR/static-render pass (no `document`), and the real browser after hydration.
// `msw/browser` throws outside an actual browser, so the SSR pass must skip
// mocking entirely — it never resolves queries itself, only the client does.
const isRealBrowser = Platform.OS === 'web' && typeof document !== 'undefined';

// There's no real backend yet (see CLAUDE.md — every feature reads through
// src/mocks/ for now), so gating strictly on __DEV__ meant every release
// build (including EAS's "preview" internal-distribution APKs, built with
// __DEV__ false) shipped with nothing able to load. EXPO_PUBLIC_ENABLE_MOCKS
// lets a specific build profile opt back in without touching this file —
// see eas.json's "preview" profile.
const mocksEnabled = __DEV__ || process.env.EXPO_PUBLIC_ENABLE_MOCKS === 'true';

export async function enableMocking() {
  if (!mocksEnabled) {
    return;
  }

  // enableMocking() is fire-and-forget from _layout.tsx (nothing awaits it),
  // so a thrown/rejected error here previously vanished silently — every
  // screen just failed to load with no trace of why. Logging keeps the next
  // "mocks silently didn't start" case from taking hours to track down
  // again (see polyfills.ts's MessageEvent stub for the first one).
  try {
    if (Platform.OS === 'web') {
      if (!isRealBrowser) {
        return;
      }
      const { worker } = await import('./browser');
      await worker.start({ onUnhandledRequest: 'bypass' });
      return;
    }

    const { server } = await import('./native');
    server.listen({ onUnhandledRequest: 'warn' });
  } catch (error) {
    console.error('[enableMocking] failed to start mock server:', error);
  }
}
