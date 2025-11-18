module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: ["eslint:recommended", "plugin:vue/vue3-essential", "plugin:@typescript-eslint/recommended"],
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: "latest",
    sourceType: "module"
  },
  rules: {
    "vue/multi-word-component-names": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^ignore" }
    ]
  },
  ignorePatterns: [".nuxt", "dist", "node_modules"]
};
