import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import ImageScreen from '../src/screens/progress/addTraining';
import { AuthContext } from '../src/contexts/authContext';

// Mock the child components to avoid firebase dependencies
jest.mock('../src/screens/progress/addTrainingRower', () => {
  return function MockedImageScreenRower() {
    return null;
  };
});

jest.mock('../src/screens/progress/addTrainingCoach', () => {
  return function MockedImageScreenCoach() {
    return null;
  };
});

// Mock AuthContext values
const mockAuthContext = {
  isCoach: false,
  userID: 'test-user-id'
};

const mockAuthContextCoach = {
  isCoach: true,
  userID: 'test-coach-id'
};

// Mock global userTypeID
global.userTypeID = 'test-type-id';

describe('ImageScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing for rower', () => {
    const component = render(
      <AuthContext.Provider value={mockAuthContext}>
        <ImageScreen />
      </AuthContext.Provider>
    );
    expect(component).toBeTruthy();
  });

  test('renders without crashing for coach', () => {
    const component = render(
      <AuthContext.Provider value={mockAuthContextCoach}>
        <ImageScreen />
      </AuthContext.Provider>
    );
    expect(component).toBeTruthy();
  });

  test('component function exists and is callable', () => {
    expect(typeof ImageScreen).toBe('function');
    expect(ImageScreen.name).toBe('ImageScreen');
  });
});