/*import React, { useContext } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { AuthContext } from '../../contexts/authContext';
import SettingsCoach from './settingsCoach';
import SettingsRower from './settingsRower';

//import React, { useCallback } from 'react';
//import { View, Text, TouchableOpacity, Alert, Linking } from 'react-native';
//import Theme from '../../style';

//const: screen names
//const passChangeName = 'passChange';

export default function SettingsScreen({ navigation }) {
    const { isCoach } = useContext(AuthContext);

    if (isCoach === undefined) { // Waiting for isCoach to be determined
        return <ActivityIndicator size="large" />;
    }

    return isCoach ? <SettingsCoach navigation={navigation} /> : <SettingsRower navigation={navigation} />;
}

export default function SettingsScreen({navigation}) {
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
            //{ To change password }
            <TouchableOpacity style={[Theme.navButton, {marginTop: 10}]} onPress={() => navigation.navigate(passChangeName)}>
            <Text style={Theme.navButtonFont}>Change Password</Text>
            </TouchableOpacity>

            //{ To website }
            <TouchableOpacity style={[Theme.navButton, {marginTop: 10}]} onPress={openWebsite}>
            <Text style={Theme.navButtonFont}>Visit Club Website</Text>
            </TouchableOpacity>
        </View>
    )
}*/

import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, Linking } from 'react-native';
import { AuthContext } from '../../contexts/authContext';
import Theme from '../../style';

export default function SettingsScreen({ navigation }) {
    const { isCoach } = useContext(AuthContext);

    if (isCoach === undefined) {  // Ensuring the context has loaded
        return <ActivityIndicator size="large" />;
    }

    const handleOptionsPress = () => {
        if (isCoach) {
            navigation.navigate('SettingsCoach');
        } else {
            navigation.navigate('SettingsRower');
        }
    };

        // Function to open the club's website
    const openWebsite = async () => {
        const url = "https://nurc.co.uk";
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        } else {
            Alert.alert(`Can't open this URL: ${url}`);
        }
    };

    return (
        <View style={Theme.view}>
            <TouchableOpacity
                style={[Theme.navButton, { marginTop: 10 }]}
                onPress={handleOptionsPress}
            >
                <Text style={Theme.navButtonFont}>Options</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[Theme.navButton, { marginTop: 10 }]}
                onPress={openWebsite}
            >
                <Text style={Theme.navButtonFont}>Visit Club Website</Text>
            </TouchableOpacity>
        </View>
    );
}


