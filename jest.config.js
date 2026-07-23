const jestExpoPreset = require('jest-expo/jest-preset');

const tsxTransformer = jestExpoPreset.transform['\\.[jt]sx?$'];

module.exports = {
  ...jestExpoPreset,
  setupFilesAfterEnv: ['./jest.setup.js'],
  transformIgnorePatterns: [
    '/node_modules/(?!(.pnpm|react-native|@react-native|@react-native-community|expo|@expo|@expo-google-fonts|react-navigation|@react-navigation|@sentry/react-native|native-base|standard-navigation|msw|@mswjs|@open-draft|rettime|headers-polyfill|is-node-process|outvariant|strict-event-emitter|until-async|@inquirer))',
    ...jestExpoPreset.transformIgnorePatterns.slice(1),
  ],
  transform: {
    ...jestExpoPreset.transform,
    '\\.mjs$': tsxTransformer,
  },
};
