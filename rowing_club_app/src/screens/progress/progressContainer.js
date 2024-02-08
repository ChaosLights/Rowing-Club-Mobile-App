import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//screens
import ProgressScreen from './progress';
import AddTrainingScreen from './addTraining';

//const: screen names
const progressName = 'Progress';
const addTrainingName = 'AddTraining';
//const: nav
const Stack = createNativeStackNavigator();

export default function ProgressContainer() {
    return(
        <Stack.Navigator initialRouteName={progressName} screenOptions={({headerShown:false})}>
            <Stack.Screen name={progressName} component={ProgressScreen} />
            <Stack.Screen name={addTrainingName} component={AddTrainingScreen} />
        </Stack.Navigator>
    );
}
