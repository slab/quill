
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  ignorePatterns: [
    "packages/blocky-common/src/hash.ts",
    "*.js",
    "*.d.ts"
  ],
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/no-non-null-assertion": 0,
    "@typescript-eslint/no-empty-function": 0,
    "@typescript-eslint/no-this-alias": 0,
    "@typescript-eslint/ban-ts-comment": 1,
    "@typescript-eslint/no-unused-vars": 2,
    "@typescript-eslint/explicit-member-accessibility": [2, {
      accessibility: "no-public"
    }],
    'lines-between-class-members': [
      'error',
      'always',
      { 'exceptAfterSingleLine': true },
    ],
    "no-empty": 1
  },
};
