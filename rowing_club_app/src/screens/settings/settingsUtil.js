import React, { useContext, useCallback } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import { getAuth, signOut, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';
import Theme from '../../style';
import Feather from 'react-native-vector-icons/Feather';

// Initialize Firebase Auth
const auth = getAuth();

// FUNCTION: Logout
export const handleLogout = async () => {
    const auth = getAuth();
    signOut(auth).catch((error) => {
        console.error('Error signing out: ', error);
    });
};

// FUNCTION: Change password
export const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
        Alert.alert('Please fill in all fields');
        return;
    }

    if (newPassword !== confirmPassword) {
        Alert.alert('New password and confirm password do not match');
        return;
    }

    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, currentPassword);

    reauthenticateWithCredential(user, credential).then(() => {
        updatePassword(user, newPassword).then(() => {
            Alert.alert('Success', 'Password updated successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        }).catch((error) => {
            console.error("Error updating password: ", error);
            Alert.alert('Failed to update password', error.message);
        });
    }).catch((error) => {
        console.error("Error re-authenticating: ", error);
        Alert.alert('Re-authentication failed', error.message);
    });
};

export const getCoachContent = (navigation) => {
    return (
        <View>
            <View style={Theme.sectionline} />

            {/* To logout */}
            <TouchableOpacity style={[Theme.navButton, {marginTop: 10}]} onPress={() => navigation.navigate('addUser')}>
                    <Text style={Theme.navButtonFont}>
                        <Feather name={'user-plus'} size={15} />
                        {"   "}
                        Add User
                    </Text>
                </TouchableOpacity>

            {/* Show all users */}
            <TouchableOpacity style={[Theme.navButton, {marginTop: 10}]} onPress={() => navigation.navigate('showUsers')}>
                    <Text style={Theme.navButtonFont}>
                        <Feather name={'users'} size={15} />
                        {"   "}
                        Show all User
                    </Text>
                </TouchableOpacity>
        </View>
    );
};