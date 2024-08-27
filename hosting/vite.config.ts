/// <reference types="vitest" />

import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import Inspect from 'vite-plugin-inspect';
import type { ViteSentryPluginOptions } from 'vite-plugin-sentry';
import viteSentry from 'vite-plugin-sentry';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => {
  const sentryAuthToken = process.env.SENTRY_AUTH_TOKEN ?? '';
  const sentryConfig: ViteSentryPluginOptions = {
    authToken: sentryAuthToken,
    org: 'buysell-technologies-dv',
    project: 'stock-web',
    cleanArtifacts: true,
    cleanSourcemapsAfterUpload: true,
    // NOTE: releaseがないとsourcemapを表示できない。仮でpackage.jsonのversionを使用
    // https://github.com/ikenfin/vite-plugin-sentry/tree/master#share-config-with-sentry-client-library
    release: process.env.npm_package_version,
    deploy: {
      env: mode,
    },
    setCommits: {
      auto: true,
      ignoreMissing: true,
    },
    sourceMaps: {
      include: ['./dist/assets'],
      urlPrefix: '~/assets',
    },
  };

  return {
    build: {
      sourcemap: true,
    },
    test: {
      globals: true,
      environment: 'happy-dom',
      setupFiles: ['./vitest.setup.ts'],
    },
    plugins: [
      react(),
      tsconfigPaths(),
      Inspect(),
      sentryAuthToken !== '' && viteSentry(sentryConfig),
    ],
    server: {
      port: 3000,
    },
  };
});
