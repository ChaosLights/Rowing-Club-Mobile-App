import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//screens
import SettingsScreen from './settings';
import Login from '../auth/login';

import PassChange from './passChange';

//const: screen names
const settingsName = 'settings';
const passChangeName = 'passChange';

//const: nav
const Stack = createNativeStackNavigator();

export default function Settingscontainer() {
    return(
        <Stack.Navigator initialRouteName={settingsName} screenOptions={({headerShown:false})}>
            <Stack.Screen name={settingsName} component={SettingsScreen} />
            <Stack.Screen name={passChangeName} component={PassChange} />
        </Stack.Navigator>
    );
}