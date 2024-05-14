import React, { useContext, useCallback } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, Alert, Linking } from 'react-native';
import { AuthContext } from '../../contexts/authContext';
import { useState, useEffect } from 'react';
import Theme from '../../style';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Feather from 'react-native-vector-icons/Feather';
import { getAuth, signOut } from 'firebase/auth';
import * as util from './settingsUtil';

//const: screen names
const passChangeName = 'passChange';

export default function SettingsScreen({ navigation }) {
    // const
    const { isCoach } = useContext(AuthContext);
    const [content, setContent] = useState();
    // Initialize Firebase Auth
    const auth = getAuth();

    // Waiting for isCoach to be determined
    if (isCoach === undefined) {
        return <ActivityIndicator size="large" />;
    }

    // set returning content to coach screen
    useEffect(() => {
        if (isCoach) {
            // set returning content to coach screen
            const content = util.getCoachContent(navigation);
            setContent(content);
        } else {
            setContent(null);
        }

    }, [isCoach]);

    // Nottingham & Union Rowing Club website URL
    const url = "https://nurc.co.uk"

    // function to open the website
    const openWebsite = useCallback(async () => {
        // check if link can be openned
        const supported = await Linking.canOpenURL(url);
    
        if (supported) {
            // open link if supported
            await Linking.openURL(url);
        } else {
            // error message alerted if link unspoorted
            Alert.alert(`Don't know how to open this URL: ${url}`);
        }
    }, [url]);

    return (
        <View style={Theme.view}>
            {/* To website */}
            <TouchableOpacity style={[Theme.navButton, {marginTop: 10}]} onPress={openWebsite}>
                <Text style={Theme.navButtonFont}>
                    <MaterialCommunityIcons name={'web'} size={17} />
                    {"   "}
                    Visit Club Website
                </Text>
            </TouchableOpacity>

            {/* Extra contents for coach users */}
            {content}

            <View style={Theme.sectionline} />

            {/* To change password */}
            <TouchableOpacity style={[Theme.navButton, {marginTop: 10}]} onPress={() => navigation.navigate('passChange')}>
                <Text style={Theme.navButtonFont}>
                    <MaterialIcons name={'password'} size={15} />
                    {"   "}
                    Change Password
                </Text>
            </TouchableOpacity>

            {/* To logout */}
            <TouchableOpacity style={[Theme.navButton, {marginTop: 10}]} onPress={util.handleLogout}>
                <Text style={Theme.navButtonFont}>
                    <MaterialCommunityIcons name={'logout'} size={18} />
                    {"   "}
                    Logout
                </Text>
            </TouchableOpacity>
        </View>
    );

}


