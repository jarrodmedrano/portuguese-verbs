import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      reporter: ['text', 'json', 'html'],
      provider: 'istanbul', // or 'c8'
    },
  },
});
