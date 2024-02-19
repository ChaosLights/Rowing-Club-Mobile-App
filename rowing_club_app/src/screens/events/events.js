import React from 'react';
import { View, Text } from 'react-native';
import EventsCoach from './eventsCoach';
import EventsRower from './eventsRower';

export default function EventsScreen({ navigation }) {
    userType = "Coach"
    userType = "14-15"

    if(userType == "Coach") {
        return (
            <EventsCoach/>
        );
    } else {
        return (
            <EventsRower/>
        );
    }
}
