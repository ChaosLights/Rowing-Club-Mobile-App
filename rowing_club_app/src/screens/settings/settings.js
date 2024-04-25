import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert, Linking } from 'react-native';
import Theme from '../../style';

//const: screen names
const passChangeName = 'passChange';

export default function SettingsScreen({navigation}) {
    const url = "https://nurc.co.uk"
    const handlePress = useCallback(async () => {
        // Checking if the link is supported for links with custom URL scheme.
        const supported = await Linking.canOpenURL(url);
    
        if (supported) {
          // Opening the link with some app, if the URL scheme is "http" the web link should be opened
          // by some browser in the mobile
          await Linking.openURL(url);
        } else {
          Alert.alert(`Don't know how to open this URL: ${url}`);
        }
    }, [url]);

    return (
        <View style={Theme.view}>
            {/* To change password */}
            <TouchableOpacity style={[Theme.navButton, {marginTop: 10}]} onPress={() => navigation.navigate(passChangeName)}>
            <Text style={Theme.navButtonFont}>Change Password</Text>
            </TouchableOpacity>
            {/* To website */}
            <TouchableOpacity style={[Theme.navButton, {marginTop: 10}]} onPress={handlePress}>
            <Text style={Theme.navButtonFont}>Visit Club Website</Text>
            </TouchableOpacity>
        </View>
    )
}
