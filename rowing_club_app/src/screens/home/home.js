import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { AuthContext } from '../../contexts/authContext';
import HomeRower from './homeRower';
import HomeCoach from './homeCoach';

export default function HomeScreen({ navigation }) {
    const { isCoach } = useContext(AuthContext); // Directly using isCoach from AuthContext

    // Since isCoach is managed globally, directly render based on its value.
    return isCoach ? <HomeCoach navigation={navigation} /> : <HomeRower navigation={navigation} />;
}
