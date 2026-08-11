import 'fast-text-encoding';
import 'react-native-url-polyfill/auto';

// MSW v2 references MessageEvent/Event/EventTarget/BroadcastChannel
// internally for its WebSocket support, even when only HTTP handlers are
// registered — none of these exist in Hermes. Without this,
// setupServer(...).listen() throws `ReferenceError: Property 'MessageEvent'
// doesn't exist` and mocking silently never starts. Minimal stubs, not real
// implementations — just enough structure for MSW's own internals to not
// crash on construction.
function defineMockGlobal(name: string) {
  if (typeof (globalThis as Record<string, unknown>)[name] === 'undefined') {
    (globalThis as Record<string, unknown>)[name] = class {
      type: string;
      constructor(type: string, eventInitDict?: Record<string, unknown>) {
        this.type = type;
        Object.assign(this, eventInitDict);
      }
    };
  }
}

['MessageEvent', 'Event', 'EventTarget', 'BroadcastChannel'].forEach(defineMockGlobal);
