import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native'; // Added imports for View and Text
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from './src/contexts/authContext';
import ScreensContainer from './src/screensContainer';
// import ScreensContainer from './src/screensContainerTEST';
import LoginScreen from './src/screens/auth/login';
// import LoginScreen from './src/screens/auth/loginTEST';
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Stack = createStackNavigator();

export default function App() {
    // const
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const auth = getAuth();

    // check authentication to set initial content
    useEffect(() => {
        setLoading(true)

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuthenticated(true);
            } else {
                setAuthenticated(false);
            }
            setLoading(false);
        });

        return () => unsubscribe(); // Cleanup on unmount
    }, []);

    // Show loading while authentication is being performed
    if (loading) {
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Loading...</Text></View>;
    }

    // Main
    return (
        <AuthProvider>
            <NavigationContainer>
                <Stack.Navigator {...{initialRouteName: authenticated ? "Login" : "Login"}} screenOptions={{headerShown:false}} >
                    <Stack.Screen name="Login" options={{ gestureDirection: 'horizontal-inverted' }} component={LoginScreen} />
                    <Stack.Screen name="ScreensContainer" options={{  }} component={ScreensContainer} />
                </Stack.Navigator>
            </NavigationContainer>
        </AuthProvider>
    )
}