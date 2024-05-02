/*import React from 'react';
import { useState, useEffect } from 'react';
import { db } from './src/config/firebase.js';
// rowing_club_app/src/config/firebase.js
// rowing_club_app/App.js
import { collection, onSnapshot, query, where } from "firebase/firestore";
import ScreensContainer from './src/screensContainer';

export default function App() {
  // TEST USER VIEWS BY CHANGING global.user AND RELOADING THE APP
  global.user = "FWBWX7EOw75rwE20cQD2" //Coach
  // global.user = "0Iz45PGQ70hFnUpo6loC" //14-15
  // global.user = "njxPjxAazoa9feL0eeKF" //18 and Older

  //const
  global.userTypeID

  // query for user type
  useEffect(() => {
    // query for current user information
    const q = query(collection(db, "User"), where("__name__", "==", global.user));
    const querySnapshot = onSnapshot(q, (snapshot) => {
      global.userTypeID = snapshot.docs[0].data().TypeID
    });

    // return cleanup function
    return () => querySnapshot();
}, [global.user]);

  return (
    <ScreensContainer/>
  );
}
*/

// React and React Native imports for using components and hooks.
import React, { useContext, useEffect, useState } from 'react';
import { View, Text } from 'react-native';

// Navigation imports for handling navigation between screens.
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Custom context for authentication state.
import { AuthProvider } from './src/contexts/authContext';
import ScreensContainer from './src/screensContainer';
import LoginScreen from './src/screens/auth/login';

// Firebase imports for authentication.
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Stack navigator setup using React Navigation.
const Stack = createStackNavigator();

// Main component definition.
export default function App() {
  // State hooks to manage authentication state.
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Effect hook to subscribe to authentication state changes.
  useEffect(() => {
    const auth = getAuth();
    // Subscribe to user authentication state changes.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // If a user is found, set isAuthenticated to true.
        setIsAuthenticated(true);
      } else {
        // No user found, set isAuthenticated to false.
        setIsAuthenticated(false);
      }
      // Set loading to false once authentication check is complete.
      setLoading(false);
    });

    // Cleanup function to unsubscribe from auth listener on component unmount.
    return () => unsubscribe();
  }, []);

  // While checking authentication, display a loading indicator.
  if (loading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Loading...</Text>
    </View>;
  }

  // Provide authentication context and set up navigation.
  return (
    <AuthProvider> {/* Context provider to pass down auth state */}
      <NavigationContainer> {/* Container for managing navigation state */}
        {isAuthenticated ? (
          // If authenticated, show the main app screens.
          <ScreensContainer />
        ) : (
          // If not authenticated, show the login screen.
          <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginScreen} />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </AuthProvider>
  );
}



