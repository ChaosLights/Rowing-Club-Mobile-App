module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-vector-icons|react-native-safe-area-context|react-native-screens|react-native-reanimated|react-native-gesture-handler|@react-navigation|expo-status-bar|expo)/)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: [
    '**/__tests__/**/*.(test|spec).[jt]s?(x)',
    '**/*.(test|spec).[jt]s?(x)',
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.test.{js,jsx}',
    '!src/config/firebase.js',
  ],
};