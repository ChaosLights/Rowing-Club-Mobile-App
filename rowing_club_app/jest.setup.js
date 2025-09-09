import '@testing-library/jest-native/extend-expect';

// Mock Firebase
jest.mock('./src/config/firebase', () => ({
  db: {},
  auth: {},
}));

// Mock Firebase Firestore
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  getDocs: jest.fn(),
  onSnapshot: jest.fn(),
}));

// Mock React Native components that might cause issues
jest.mock('react-native-vector-icons/FontAwesome', () => 'Icon');

// Mock Expo modules
jest.mock('expo-status-bar', () => ({
  StatusBar: 'StatusBar',
}));

// Mock React Navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
  useRoute: () => ({
    params: {},
  }),
  useFocusEffect: jest.fn(),
}));

// Silence the warning: Animated: `useNativeDriver` is not supported
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock global userTypeID
global.userTypeID = 'test-user-type';