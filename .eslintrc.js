/* eslint-env node */
module.exports = {
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  root: true,
  ignorePatterns: ["dist"], // Ignore all files
  overrides: [
    {
      // Apply linting only for .ts and .d.ts files
      files: ["src/**/*.ts", "test/**/*.d.ts"],

      // If you have specific rules you want to apply only for these files,
      // you can specify them here. If not, you can remove the rules field.
      rules: {}
    }
  ]
}
