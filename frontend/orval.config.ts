import { defineConfig } from "orval";

export default defineConfig({
  murackTest: {
    input: "./temp/backend_api.json",
    output: {
      mode: "single",
      target: "./src/gen/backend_api.ts",
      client: "swr",
      httpClient: "fetch",
      override: {
        mutator: {
          path: "src/custom_fetch.ts",
          name: "customFetch",
          extension: ".ts",
        },
      },
    },
    hooks: {
      afterAllFilesWrite: "deno fmt src/gen",
    },
  },
  murackTestZod: {
    input: "./temp/backend_api.json",
    output: {
      mode: "single",
      target: "./src/gen/backend_api.zod.ts",
      client: "zod",
      httpClient: "fetch",
    },
    hooks: {
      afterAllFilesWrite: "deno fmt src/gen",
    },
  },
});
