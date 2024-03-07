import React from 'react';
import { View, Text } from 'react-native';
import HomeRower from './homeRower';
import HomeCoach from './homeCoach';

export default function EventsScreen({ navigation }) {
    //userType = "Coach"
    userType = "14-15"

    if(userType == "Coach") {
        return (
            <HomeCoach/>
        );
    } else {
        return (
            <HomeRower/>
        );
    }
}
