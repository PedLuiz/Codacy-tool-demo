module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2022: true,
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: ["eslint:recommended"],
  ignorePatterns: ["**/node_modules/**", "**/dist/**", "**/build/**"],
  rules: {
    "no-unused-vars": "warn",
    eqeqeq: "warn",
    "no-console": "warn",
  },
};
