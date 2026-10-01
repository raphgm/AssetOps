import { defineConfig } from "vitest/config";
import path from "path";
export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname, "src"), "server-only": path.resolve(__dirname, "tests/empty.ts") } },
  test: {
    environment: "node", testTimeout: 60000, hookTimeout: 120000, fileParallelism: false,
    globalSetup: ["tests/global-setup.ts"],
    env: { DATABASE_URL: "postgresql://assetops:assetops@localhost:5432/assetops_test", SESSION_SECRET: "test-secret-test-secret-test-secret-123456", GROQ_API_KEY: "" },
  },
});
