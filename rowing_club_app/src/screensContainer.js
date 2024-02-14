import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
//screens
import HomeScreen from './screens/home';
import EventsScreen from './screens/events';
import ProgressContainer from './screens/progress/progressContainer';
import SettingsScreen from './screens/settings/settings';
import ImageScreen from './screens/image';

//const: screen names
const homeName = 'Home';
const eventsName = 'Events';
const progressContainerName = 'ProgressContainer';
const settingsName = 'Settings';
const imageName = 'Image';
//const: nav
const Tab = createBottomTabNavigator();

export default function ScreensContainer() {
    return(
        <NavigationContainer>
            <Tab.Navigator 
                initialRouteName={homeName}
                screenOptions = {({route}) => ({
                    tabBarIcon: ({focused, color, size}) => {
                        let iconName;
                        let routeName = route.name;

                        if(routeName === homeName) {
                            iconName = focused ? 'home' : 'home-outline';
                        } else if(routeName === eventsName) {
                            iconName = focused ? 'calendar' : 'calendar-outline';
                        } else if(routeName === progressContainerName) {
                            iconName = focused ? 'body' : 'body-outline';
                        } else if(routeName === settingsName) {
                            iconName = focused ? 'settings' : 'settings-outline';
                        } else if(routeName == imageName) {
                            iconName = focused ? 'camera' : 'camera-outline';
                        }

                        return <Ionicons name={iconName} size={size} color={color}/>
                    },
                    tabBarActiveTintColor: 'maroon',
                    tabBarInactiveTintColor: 'grey',
                    tabBarLabelStyle: {paddingBottom: 10, fontSize: 10},
                    tabBarStyle: {padding: 10, height: 100}

                })}
            >
                <Tab.Screen name={homeName} component={HomeScreen}/>
                <Tab.Screen name={eventsName} component={EventsScreen}/>
                <Tab.Screen name={progressContainerName} component={ProgressContainer}/>
                <Tab.Screen name={settingsName} component={SettingsScreen}/>
                <Tab.Screen name={imageName} component={ImageScreen} />

            </Tab.Navigator>
        </NavigationContainer>
    );
}
