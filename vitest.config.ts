import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
  define: {
    "process.env.MONGODB_URI_TEST": JSON.stringify(process.env.MONGODB_URI_TEST),
    "process.env.DB_NAME_TEST": JSON.stringify(process.env.DB_NAME_TEST),
  },
});
