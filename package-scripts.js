const path = require('path');

const clientPath = path.resolve(__dirname, 'packages/client');
const apiPath = path.resolve(__dirname, 'packages/api');

const ciApiPath = path.resolve(__dirname, 'out/apps/api');
const ciWebPath = path.resolve(__dirname, 'out/apps/web');

module.exports = {
  scripts: {
    clean: {
      default: 'docker system prune',
    },
    network: {
      default: 'docker network create app_network',
    },
    prepare: {
      default: 'nps prepare.install prepare.format',
      install: 'husky install && yarn install',
      format: 'prettier --write "**/*.{ts,tsx,md}',
      docker: 'docker compose up',
      ci: {
        web: `npx turbo prune --scope=web && cd out && yarn install --frozen-lockfile`,
        api: `npx turbo prune --scope=api && cd out && yarn install --frozen-lockfile && nps prisma.generate`,
      },
    },
    prebuild: {
      default: 'nps prepare.format',
    },
    build: {
      default: 'npx turbo run build',
      ci: {
        client: 'cd out && npm run build',
        api: 'cd out && npm run build',
      },
    },
    test: {
      default: 'nps test.client',
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
    dev: {
      default: 'docker compose -f docker-compose.dev.yml up --build',
    },
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
    coverage: 'vitest run --coverage',
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
