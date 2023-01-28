module.exports = {
  extends: ['next'],
  settings: {
    next: {
      rootDir: 'packages/client',
    },
  },
  root: true,
  rules: {
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'no-console': 'error',
  },
};
