/// <reference types="npm:vite/client" />

// deno-lint-ignore no-explicit-any
const env = (import.meta as any).env;

export const API_BASE_URL = env.PROD
  ? "https://murack-api.railway.app"
  : "http://localhost:3000";
