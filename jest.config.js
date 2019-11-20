module.exports = {
  collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!<rootDir>/src/static-wrapper.ts'],

  coverageDirectory: 'coverage',

  coverageReporters: ['lcov', 'text-summary'],

  preset: 'ts-jest',

  testEnvironment: 'node',

  testPathIgnorePatterns: ['<rootDir>/coverage/', '<rootDir>/dist/', '<rootDir>/node_modules/'],
};
