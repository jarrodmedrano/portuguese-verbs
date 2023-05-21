const path = require('path');

const apiPath = path.resolve(__dirname, 'packages/api');

module.exports = {
  scripts: {
    prebuild: 'yarn run format',
    build: 'nps prebuild && yarn prebuild && yarn turbo run build',
    dev: 'turbo run dev --parallel',
    lint: 'turbo run lint',
    format: 'prettier --write "**/*.{ts,tsx,md}"',
    preview: 'vite preview',
    eslint: {
      default: 'eslint "**/*.+(js|jsx|ts|tsx)"',
      fix: 'eslint --fix "**/*.+(js|jsx|ts|tsx)"',
    },
    prettier: {
      default: 'prettier --check "**/*.+(js|jsx|ts|tsx|json|yml|yaml|md|css)"',
      fix: 'prettier --write "**/*.+(js|jsx|ts|tsx|json|yml|yaml|md|css)"',
    },
    prepare: 'husky install',
    preCommit: 'lint-staged',
    test: {
      default: 'vitest',
      ui: 'vitest --ui',
    },
    coverage: 'vitest run --coverage',
    composeNetwork: 'docker network create app_network',
    compose: 'COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker-compose -f docker-compose.yml build',
    composeUp: 'docker compose up',
    composeUpDev: 'docker compose -f docker-compose.dev.yml up --build',
    prisma: {
      generate: `cd ${apiPath} && npx prisma generate`,
      studio: `cd ${apiPath} && npx prisma studio`,
      migrate: {
        dev: `cd ${apiPath} && npx prisma migrate dev`,
      },
    },
  },
};
