import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//screens
import SettingsScreen from './settings';
import Login from './login';


//const: screen names
const settingsName = 'settings';
const loginName = 'login';

//const: nav
const Stack = createNativeStackNavigator();

export default function Settingscontainer() {
    return(
        <Stack.Navigator initialRouteName={settingsName} screenOptions={({headerShown:false})}>
            <Stack.Screen name={settingsName} component={SettingsScreen} />
            <Stack.Screen name={loginName} component={Login} />
        </Stack.Navigator>
    );
}