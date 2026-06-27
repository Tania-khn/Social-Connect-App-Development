/**
 * ESLint configuration for SocialConnect
 * Extends the React Native community config + Prettier integration.
 */
module.exports = {
  root: true,
  extends: [
    '@react-native',
    'prettier',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  env: {
    'react-native/react-native': true,
    es2021: true,
    node: true,
    jest: true,
  },
  rules: {
    'prettier/prettier': 'error',
    'react/react-in-jsx-scope': 'off',
    'react-native/no-inline-styles': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    'no-console': ['warn', {allow: ['warn', 'error']}],
  },
  ignorePatterns: ['node_modules/', 'android/', 'ios/', 'build/'],
};
