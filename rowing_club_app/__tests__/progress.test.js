import React from 'react';
import { render, screen } from '@testing-library/react-native';
import ProgressScreen from '../src/screens/progress/progress';
import { AuthContext } from '../src/contexts/authContext';

// Mock the progressRender module to avoid Firebase dependencies
jest.mock('../src/screens/progress/progressRender', () => ({
  renderRower: jest.fn(() => null),
  renderCoach: jest.fn(() => null),
}));

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
};

// Mock AuthContext values
const mockAuthContext = {
  isCoach: false,
  userID: 'test-user-id'
};

const mockAuthContextCoach = {
  isCoach: true,
  userID: 'test-coach-id'
};

describe('ProgressScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly for rower', () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <ProgressScreen navigation={mockNavigation} />
      </AuthContext.Provider>
    );
    
    expect(screen.getByText('Add New Training Record')).toBeTruthy();
  });

  test('renders correctly for coach', () => {
    render(
      <AuthContext.Provider value={mockAuthContextCoach}>
        <ProgressScreen navigation={mockNavigation} />
      </AuthContext.Provider>
    );
    
    expect(screen.getByText('Record Image Data')).toBeTruthy();
  });

  test('component function exists and is callable', () => {
    expect(typeof ProgressScreen).toBe('function');
    expect(ProgressScreen.name).toBe('ProgressScreen');
  });
});