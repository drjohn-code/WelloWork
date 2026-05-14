import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // We write long-form marketing copy directly in JSX. Escaping every
      // apostrophe/quote to HTML entities reduces readability with no real
      // benefit, since React's JSX text rendering handles these safely.
      "react/no-unescaped-entities": "off",
    },
  },
]);

export default eslintConfig;
