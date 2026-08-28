const DEFAULT_BASE_URL = 'http://localhost:3000';

function getBaseUrl(): string {
  return process.env.EXPO_PUBLIC_API_BASE_URL || DEFAULT_BASE_URL;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

function buildUrl(path: string, params?: Record<string, string | number | undefined>): string {
  const query = Object.entries(params ?? {})
    .filter((entry): entry is [string, string | number] => entry[1] !== undefined)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');

  return query ? `${getBaseUrl()}${path}?${query}` : `${getBaseUrl()}${path}`;
}

export async function apiGet<T>(path: string, params?: Record<string, string | number | undefined>): Promise<T> {
  const response = await fetch(buildUrl(path, params));

  if (!response.ok) {
    throw new ApiError(`GET ${path} failed with status ${response.status}`, response.status);
  }

  return response.json() as Promise<T>;
}
