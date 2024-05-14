import React, { useContext, useState, useCallback } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, Linking } from 'react-native';
import Theme from '../../style';
import { db } from '../../config/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
const login = 'login';
import { getAuth, signOut, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';
import { AuthContext } from '../../contexts/authContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import navigation from './settings';

export default function SettingsRower() {

    // Initialize Firebase Auth
    const auth = getAuth();

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

    // function to handle logout
    const handleLogout = async () => {
        const auth = getAuth();
        console.log('HandleLogout');
        signOut(auth).catch((error) => {
            console.error('Error signing out: ', error);
        });
    };

    return (
        <View style={Theme.view}>
            {/* To change password */}
            <TouchableOpacity style={[Theme.navButton, {marginTop: 10}]} onPress={() => navigation.navigate(passChangeName)}>
                <Text style={Theme.navButtonFont}>
                    <MaterialIcons name={'password'} size={15} />
                    {"  "}
                    Change Password
                </Text>
            </TouchableOpacity>

            {/* To logout */}
            <TouchableOpacity style={[Theme.navButton, {marginTop: 10}]} onPress={handleLogout}>

                <Text style={Theme.navButtonFont}>
                    <MaterialCommunityIcons name={'logout'} size={18} />
                    {"  "}
                    Logout
                </Text>
            </TouchableOpacity>

            <View style={Theme.sectionline} />

            {/* To website */}
            <TouchableOpacity style={[Theme.navButton, {marginTop: 10}]} onPress={openWebsite}>
                <Text style={Theme.navButtonFont}>
                    <MaterialCommunityIcons name={'web'} size={17} />
                    {"  "}
                    Visit Club Website
                </Text>
            </TouchableOpacity>
        </View>
    )


    // const [currentPassword, setCurrentPassword] = useState('');
    // const [newPassword, setNewPassword] = useState('');
    // const [confirmPassword, setConfirmPassword] = useState('');

    // // { userUID } = useContext(AuthContext); // Assuming you are passing the user's UID for use.
    // const auth = getAuth();

    // const handleChangePassword = async () => {
    //     if (!currentPassword || !newPassword || !confirmPassword) {
    //         Alert.alert('Please fill in all fields');
    //         return;
    //     }

    //     if (newPassword !== confirmPassword) {
    //         Alert.alert('New password and confirm password do not match');
    //         return;
    //     }

    //     const user = auth.currentUser;
    //     const credential = EmailAuthProvider.credential(user.email, currentPassword);

    //     reauthenticateWithCredential(user, credential).then(() => {
    //         updatePassword(user, newPassword).then(() => {
    //             Alert.alert('Success', 'Password updated successfully!');
    //             setCurrentPassword('');
    //             setNewPassword('');
    //             setConfirmPassword('');
    //         }).catch((error) => {
    //             console.error("Error updating password: ", error);
    //             Alert.alert('Failed to update password', error.message);
    //         });
    //     }).catch((error) => {
    //         console.error("Error re-authenticating: ", error);
    //         Alert.alert('Re-authentication failed', error.message);
    //     });
    // };

    // const handleLogout = () => {
    //     signOut(auth).then(() => {
    //         // User signed out
    //         console.log('User logged out');
    //         navigation.replace('Login');
    //     }).catch((error) => {
    //         console.error('Error signing out: ', error);
    //     });
    // };

    // return (
    //     <View style={Theme.view}>
    //         <Text style={Theme.title}>Change Password</Text>
    //         <View style={{marginBottom: 10}} />
    //         <TextInput
    //             style={[Theme.input, Theme.underline]}
    //             placeholder="Current Password"
    //             placeholderTextColor="#808080"
    //             secureTextEntry={true}
    //             value={currentPassword}
    //             onChangeText={setCurrentPassword}
    //         />
    //         <View style={{marginBottom: 10}} />
    //         <TextInput
    //             style={[Theme.input, Theme.underline]}
    //             placeholder="New Password"
    //             placeholderTextColor="#808080"
    //             secureTextEntry={true}
    //             value={newPassword}
    //             onChangeText={setNewPassword}
    //         />
    //         <View style={{marginBottom: 10}} />
    //         <TextInput
    //             style={[Theme.input, Theme.underline]}
    //             placeholder="Confirm New Password"
    //             placeholderTextColor="#808080"
    //             secureTextEntry={true}
    //             value={confirmPassword}
    //             onChangeText={setConfirmPassword}
    //         />
    //         <View style={{marginBottom: 10}} />
    //         <TouchableOpacity style={[Theme.maroonOvalButton, {marginTop: 10}]} onPress={handleChangePassword}>
    //             <Text style={Theme.optionText}>Change Password</Text>
    //         </TouchableOpacity>

    //         <TouchableOpacity style={Theme.maroonOvalButton} onPress={handleLogout}>
    //             <Text style={Theme.optionText}>Logout</Text>
    //         </TouchableOpacity>
    //     </View>
    // );
}
