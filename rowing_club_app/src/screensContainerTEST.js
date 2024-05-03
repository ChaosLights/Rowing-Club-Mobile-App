import React, { useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Login from './screens/auth/loginTEST';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

//const: nav
const Tab = createBottomTabNavigator();

export default function ScreensContainer( {navigation}) {

    // Initial Login check
    useEffect(() => {
        const auth = getAuth();

        // const unsubscribe = onAuthStateChanged(auth, (user) => {
        //     if (user) {
        //         navigation.replace('ScreenContainer');
        //     } else {
        //         navigation.replace('Login');
        //     }
        // });

        // return () => unsubscribe(); // Cleanup on unmount
    }, []);

    // function to handle logout
    const handleLogout = async () => {
        const auth = getAuth();
        console.log('HandleLogout');
        signOut(auth).then(() => {
            console.log('User logged out');
            navigation.replace('Login');
        }).catch((error) => {
            console.error('Error signing out: ', error);
        });
    };

    return (
        // <NavigationContainer>
        //     <Stack.Navigator initialRouteName={"Home"} >
        //         <Stack.Screen name="Home" component={ScreensContainer} options={{ headerShown: false }} />
        //         <Stack.Screen name="Login" component={Login} />
        //     </Stack.Navigator>
        // </NavigationContainer>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>
                SCREENS CONTAINER PAGE TEST{"\n"}
            </Text>
            <Button title="Log Out" onPress={handleLogout} />
        </View>
    );
}