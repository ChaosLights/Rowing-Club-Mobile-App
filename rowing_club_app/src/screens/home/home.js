import React from 'react';
import { useState, useEffect } from 'react';
import HomeRower from './homeRower';
import HomeCoach from './homeCoach';

export default function EventsScreen({ navigation }) {
    userType = "Coach"
    // userType = "14-15"

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
