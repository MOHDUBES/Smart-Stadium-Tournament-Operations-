import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: {
        browser: true,
        node: true,
        window: true,
        document: true,
        fetch: true,
        console: true,
        process: true,
        vi: true,
        describe: true,
        it: true,
        expect: true,
        beforeEach: true
      }
    },
    rules: {
      "no-unused-vars": "off",
      "no-console": "warn",
      "no-undef": "off"
    }
  }
];
