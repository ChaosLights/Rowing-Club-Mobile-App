import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//screens
import SettingsScreen from './settings'
import PassChange from './passChange';
import AddUser from './addUser';
import ShowUsers from './showUsers';

//const: screen names
const settingsName = 'settings';
const passChangeName = 'passChange';
const addUserName = 'addUser';
const showUsersName = 'showUsers'

//const: nav
const Stack = createNativeStackNavigator();

export default function Settingscontainer() {
    return(
        <Stack.Navigator initialRouteName={settingsName} screenOptions={({headerShown:false})}>
            <Stack.Screen name={settingsName} component={SettingsScreen} />
            <Stack.Screen name={passChangeName} component={PassChange} />
            <Stack.Screen name={addUserName} component={AddUser} />
            <Stack.Screen name={showUsersName} component={ShowUsers} />
        </Stack.Navigator>
    );
}