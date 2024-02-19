import React from 'react';
import { View, Text } from 'react-native';
import EventsCoach from './eventsCoach';
import EventsRower from './eventsRower';

export default function EventsScreen({ navigation }) {
    // <View>
    //     <Text>{global.userType}</Text>
    // </View>

    if(global.userType == "Coach") {
        return (
            <EventsCoach/>
        );
    } else {
        return (
            <EventsRower/>
        );
    }
}
