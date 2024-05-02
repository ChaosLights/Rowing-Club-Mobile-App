import React, { useContext } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { AuthContext } from '../../contexts/authContext';
import SettingsCoach from './settingsCoach';
import SettingsRower from './settingsRower';

export default function SettingsScreen({ navigation }) {
    const { isCoach } = useContext(AuthContext);

    if (isCoach === undefined) { // Waiting for isCoach to be determined
        return <ActivityIndicator size="large" />;
    }

    return isCoach ? <SettingsCoach navigation={navigation} /> : <SettingsRower navigation={navigation} />;
}
