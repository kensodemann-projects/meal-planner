// functions/vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Specify the test environment as 'node' for server-side functions
    environment: 'node',

    // Define files to include and exclude for testing
    include: ['test/**/*.spec.ts'],
    exclude: ['node_modules', 'lib'], // Exclude compiled output

    // Global setup file for common setup logic (e.g., Firebase Mocking)
    // globalSetup: './test/globalSetup.ts',

    // Configuration for TypeScript processing
    deps: {
      inline: true, // Crucial for monorepos or when dealing with linked packages
    },
  },
});
