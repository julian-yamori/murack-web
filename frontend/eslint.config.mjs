import js from "@eslint/js";
import typescriptEslintParser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier/flat";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import reactRefreshPlugin from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: [
      "**/public/**",
      "**/node_modules/**",
      "orval.config.ts",
      "vite.config.ts",
      "src/gen/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    files: ["**/*.{ts,tsx}"],

    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parser: typescriptEslintParser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },

    plugins: {
      "react-hooks": reactHooksPlugin,
      "react-refresh": reactRefreshPlugin,
    },

    rules: {
      ...reactHooksPlugin.configs.recommended.rules,
      ...reactRefreshPlugin.configs.vite.rules,
    },
  },
  prettierConfig,
];
