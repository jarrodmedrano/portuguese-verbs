const path = require('path');

const clientPath = path.resolve(__dirname, 'packages/client');
const apiPath = path.resolve(__dirname, 'packages/api');

const ciApiPath = path.resolve(__dirname, 'out/apps/api');
const ciWebPath = path.resolve(__dirname, 'out/apps/web');

module.exports = {
  scripts: {
    prepare: {
      default: 'nps prepare.install prepare.format',
      install: 'husky install && yarn install',
      format: 'prettier --write "**/*.{ts,tsx,md}',
      network: 'docker network create app_network',
      docker: 'docker compose up',
      ci: {
        web: `npx turbo prune --scope=web && cd out && yarn install --frozen-lockfile`,
        api: `npx turbo prune --scope=api && cd out && yarn install --frozen-lockfile && nps prisma.generate`,
      },
    },
    prebuild: {
      default: 'nps prepare.format',
    },
    test: {
      default: 'nps test.client test.api',
      client: `cd ${clientPath} && npx vitest`,
      api: `cd ${apiPath} && npx vitest`,
      ci: {
        default: 'nps test.ci.client test.ci.api',
        client: `cd ${ciWebPath} && npx vitest --ci`,
        api: `cd ${ciApiPath} && npx vitest --ci`,
      },
    },
    prisma: {
      generate: `cd ${apiPath} && npx prisma generate`,
      studio: `cd ${apiPath} && npx prisma studio`,
      migrate: {
        dev: `cd ${apiPath} && npx prisma migrate dev`,
      },
    },
    build: {
      default: 'npx turbo run build',
      ci: {
        client: 'cd out && npm run build',
        api: 'cd out && npm run build',
      },
    },
    dev: 'docker compose -f docker-compose.dev.yml up --build',
    lint: 'turbo run lint',
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
    prisma: {
      generate: `cd ${apiPath} && npx prisma generate`,
      studio: `cd ${apiPath} && npx prisma studio`,
      migrate: {
        dev: `cd ${apiPath} && npx prisma migrate dev`,
      },
    },
    docker: {
      default: 'COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker-compose -f docker-compose.yml build',
      client: `docker build -t client . -f ${clientPath}/Dockerfile`,
      api: `docker build -t api . -f ${apiPath}/Dockerfile`,
    },
    lintStaged: {
      default: 'nps prettier.fix eslint.fix',
    },
    precommit: {
      default: 'nps lintStaged',
    },
  },
};
