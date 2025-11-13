import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";

export default tseslint.config(
  {
    ignores: ["dist/**", "coverage/**", "node_modules/**", "vitest.config.ts", "eslint.config.mjs"]
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
        sourceType: "module"
      }
    },
    plugins: { import: importPlugin },
    rules: {
      "import/order": ["error", { "newlines-between": "always" }],
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
      "no-console": "off"
    }
  },
  prettier
);