module.exports = {
  preset: 'ts-jest',
  collectCoverageFrom: ['src/**/*.ts'],
  testMatch: ['**/*.steps.ts'],
  coveragePathIgnorePatterns: ['src/Medalla/Infrastructure/Repository/*'],
  transform: {
    '^.+\\.(ts|tsx|js)$': 'ts-jest'
  }
};
