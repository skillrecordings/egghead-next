module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  parserOptions: {ecmaVersion: 8}, // to enable features such as async/await
  ignorePatterns: ['node_modules/*', '.next/*', '.out/*', '!.prettierrc.js'], // We don't want to lint generated files nor node_modules, but we want to lint .prettierrc.js (ignored by default by eslint)
  extends: ['plugin:react-hooks/recommended'],
  overrides: [
    // This configuration will apply only to TypeScript files
    {
      files: ['src/**/*.ts', 'src/**/*.tsx'],
      parser: '@typescript-eslint/parser',
      settings: {react: {version: 'detect'}},
      env: {
        browser: true,
        node: true,
        es6: true,
      },
      extends: [
        'plugin:react/recommended',
        'plugin:react-hooks/recommended', // React hooks rules
        'plugin:jsx-a11y/recommended', // Accessibility rules
      ],
      rules: {
        'react/no-unescaped-entities': 'off',
        'react/prop-types': 'off', // We will use TypeScript's types for component props instead
        'jsx-a11y/anchor-is-valid': 'off', // This rule is not compatible with Next.js's <Link /> components
      },
    },
  ],
}
