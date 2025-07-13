/// <reference types="npm:vite/client" />

// deno-lint-ignore no-explicit-any
const env = (import.meta as any).env;

const API_BASE_URL = env.PROD
  ? "https://murack-api.railway.app"
  : "http://localhost:3000";

export async function customFetch<T>(
  contextUrl: string,
  options: RequestInit,
): Promise<T> {
  const requestUrl = new URL(contextUrl, API_BASE_URL);

  const response = await fetch(requestUrl, options);

  return {
    ...response,
    data: await getBody(response),
  } as T;
}

function getBody(c: Response): Promise<unknown> {
  const contentType = c.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    return c.json();
  }

  return c.text();
}
