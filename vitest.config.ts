import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
   test: {
     clearMocks: true,
     restoreMocks: true,
     unstubGlobals: true,
     setupFiles: ['./__tests__/test-setup.ts'],
    coverage: {
      include: ['app/**', 'shared/**', "lib/**", "features/**"],
    },
     environment: 'jsdom',
   },
});
