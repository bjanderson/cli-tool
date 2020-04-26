module.exports = {
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/static-function-wrapper.ts',
    '!<rootDir>/src/index.ts',
    '!<rootDir>/src/**/index.ts',
  ],

  coverageDirectory: 'coverage',

  coverageReporters: ['lcov', 'text-summary'],

  preset: 'ts-jest',

  testEnvironment: 'node',

  testPathIgnorePatterns: [
    '<rootDir>/coverage/',
    '<rootDir>/design/',
    '<rootDir>/dist/',
    '<rootDir>/docs/',
    '<rootDir>/node_modules/',
  ],
};
