const jestExpoPreset = require('jest-expo/jest-preset');

const tsxTransformer = jestExpoPreset.transform['\\.[jt]sx?$'];

module.exports = {
  ...jestExpoPreset,
  // Excludes other local git worktrees (.claude/worktrees/) — without this, Jest
  // walks into them and runs their (possibly stale/divergent) tests as if they
  // belonged to this checkout.
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/.claude/worktrees/'],
  modulePathIgnorePatterns: ['<rootDir>/.claude/worktrees/'],
  watchPathIgnorePatterns: ['<rootDir>/.claude/worktrees/'],
  transformIgnorePatterns: [
    '/node_modules/(?!(.pnpm|react-native|@react-native|@react-native-community|expo|@expo|@expo-google-fonts|react-navigation|@react-navigation|@sentry/react-native|native-base|standard-navigation|@inquirer))',
    ...jestExpoPreset.transformIgnorePatterns.slice(1),
  ],
  transform: {
    ...jestExpoPreset.transform,
    '\\.mjs$': tsxTransformer,
  },
};
