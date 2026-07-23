import { Platform } from 'react-native';

// Expo Router's web target has two execution contexts: an initial Node-based
// SSR/static-render pass (no `document`), and the real browser after hydration.
// `msw/browser` throws outside an actual browser, so the SSR pass must skip
// mocking entirely — it never resolves queries itself, only the client does.
const isRealBrowser = Platform.OS === 'web' && typeof document !== 'undefined';

export async function enableMocking() {
  if (!__DEV__) {
    return;
  }

  if (Platform.OS === 'web') {
    if (!isRealBrowser) {
      return;
    }
    const { worker } = await import('./browser');
    await worker.start({ onUnhandledRequest: 'bypass' });
    return;
  }

  const { server } = await import('./native');
  server.listen();
}
