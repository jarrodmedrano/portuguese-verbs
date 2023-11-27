module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
  extends: ['next', 'plugin:@typescript-eslint/recommended'],
  settings: {
    next: {
      rootDir: 'apps/client',
    },
  },
  rules: {
    // '@next/next/no-html-link-for-pages': ['error', 'apps/client/pages/'],
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'import/no-default-export': ['warn'],
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/no-unstable-nested-components': ['error'],
    'no-console': 'error',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/ban-ts-comment': [
      'error',
      {
        'ts-ignore': 'allow-with-description',
      },
    ],
  },
};
