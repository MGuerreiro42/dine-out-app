import { Platform } from 'react-native';

import { getRefreshToken, setRefreshToken } from '@/lib/secureTokenStorage';

// Android emulator's `localhost` is the emulator itself, not the host machine
// running the backend — 10.0.2.2 is the emulator's documented alias for it.
const DEFAULT_BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

function getBaseUrl(): string {
  return process.env.EXPO_PUBLIC_API_BASE_URL || DEFAULT_BASE_URL;
}

export class ApiError extends Error {
  status: number;
  body?: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

let accessToken: string | null = null;
let sessionExpiredHandler: (() => void) | null = null;
let refreshPromise: Promise<string | null> | null = null;

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function setSessionExpiredHandler(handler: () => void): void {
  sessionExpiredHandler = handler;
}

function buildUrl(path: string, params?: Record<string, string | number | undefined>): string {
  const query = Object.entries(params ?? {})
    .filter((entry): entry is [string, string | number] => entry[1] !== undefined)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');

  return query ? `${getBaseUrl()}${path}?${query}` : `${getBaseUrl()}${path}`;
}

function buildHeaders(hasBody: boolean): HeadersInit {
  const headers: Record<string, string> = {};
  if (hasBody) {
    headers['Content-Type'] = 'application/json';
  }
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  return headers;
}

async function parseErrorBody(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return undefined;
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return undefined as T;
  }
  return response.json() as Promise<T>;
}

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const refreshToken = await getRefreshToken();
        if (!refreshToken) {
          return null;
        }

        const response = await fetch(`${getBaseUrl()}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
          return null;
        }

        const data = (await response.json()) as { accessToken: string; refreshToken: string };
        accessToken = data.accessToken;
        await setRefreshToken(data.refreshToken);
        return data.accessToken;
      } catch {
        return null;
      }
    })().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  params?: Record<string, string | number | undefined>,
): Promise<T> {
  const url = buildUrl(path, params);
  const hasToken = accessToken !== null;
  const hasBody = body !== undefined;

  const response = await fetch(url, {
    method,
    headers: buildHeaders(hasBody),
    body: hasBody ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401 && hasToken) {
    const newAccessToken = await refreshAccessToken();

    if (newAccessToken) {
      const retryResponse = await fetch(url, {
        method,
        headers: buildHeaders(hasBody),
        body: hasBody ? JSON.stringify(body) : undefined,
      });

      if (!retryResponse.ok) {
        if (retryResponse.status === 401) {
          sessionExpiredHandler?.();
        }
        throw new ApiError(
          `${method} ${path} failed with status ${retryResponse.status}`,
          retryResponse.status,
          await parseErrorBody(retryResponse),
        );
      }

      return parseResponse<T>(retryResponse);
    }

    sessionExpiredHandler?.();
    throw new ApiError(`${method} ${path} failed with status ${response.status}`, response.status, await parseErrorBody(response));
  }

  if (!response.ok) {
    throw new ApiError(`${method} ${path} failed with status ${response.status}`, response.status, await parseErrorBody(response));
  }

  return parseResponse<T>(response);
}

export function apiGet<T>(path: string, params?: Record<string, string | number | undefined>): Promise<T> {
  return request<T>('GET', path, undefined, params);
}

export function apiPost<T>(path: string, body?: unknown): Promise<T> {
  return request<T>('POST', path, body);
}

export function apiPut<T>(path: string, body?: unknown): Promise<T> {
  return request<T>('PUT', path, body);
}

export function apiDelete<T = void>(path: string): Promise<T> {
  return request<T>('DELETE', path);
}
