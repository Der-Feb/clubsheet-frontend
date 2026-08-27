import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jsxNesting from "eslint-plugin-validate-jsx-nesting";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  
  // Plugin for HTML5 DOM nesting validation
  {
    plugins: {
      "validate-jsx-nesting": jsxNesting,
    },
    rules: {
      "validate-jsx-nesting/no-invalid-jsx-nesting": "error",
    },
  },

  // Custom rule overrides
  {
    rules: {
      "react/void-dom-elements-no-children": "error",
      "react/no-danger-with-children": "error",
    },
  },

  // Override default ignores of eslint-config-next
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;