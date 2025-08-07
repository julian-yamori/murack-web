import { API_BASE_URL } from "./api_base_url.ts";

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
