const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

/** @type {import('jest').Config} */
const customJestConfig = {
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: ["**/__tests__/**/*.test.(ts|tsx)"],
  collectCoverageFrom: [
    "src/lib/**/*.{ts,tsx}",
    "!src/lib/mockData.ts",
    "!src/lib/api.ts",
  ],
};

module.exports = createJestConfig(customJestConfig);
