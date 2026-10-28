import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    reporters: ['verbose'],
    env: {
      DOTENV_CONFIG_QUIET: 'true',
      NODE_ENV: 'test',
    },
    onConsoleLog(log) {
      if (
        log.includes('dotenv') ||
        log.includes('injecting env') ||
        log.includes('Kết nối MySQL')
      ) {
        return false;
      }
    },
  },
});
