import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import SettingsScreen from './settings';
import Login from '../auth/login';
import PassChange from './passChange';
import SettingsCoach from './settingsCoach';
import SettingsRower from './settingsRower';

// Constants for screen names
const settingsName = 'settings';
const passChangeName = 'passChange';
const settingsCoachName = 'SettingsCoach';
const settingsRowerName = 'SettingsRower';

// Navigator
const Stack = createNativeStackNavigator();

export default function Settingscontainer() {
    return(
        <Stack.Navigator initialRouteName={settingsName} screenOptions={{ headerShown: false }}>
            <Stack.Screen name={settingsName} component={SettingsScreen} />
            <Stack.Screen name={passChangeName} component={PassChange} />
            <Stack.Screen name={settingsCoachName} component={SettingsCoach} />
            <Stack.Screen name={settingsRowerName} component={SettingsRower} />
        </Stack.Navigator>
    );
}
