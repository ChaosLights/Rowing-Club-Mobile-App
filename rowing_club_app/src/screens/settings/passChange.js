import React, { useState } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import Theme from '../../style';
import { getAuth, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';
const login = 'login';

export default function PassChange() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const auth = getAuth();

    const handleChangePassword = async () => {
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

    return (
        <View style={Theme.view}>
            {/* Title */}
            <Text style={[Theme.title, {paddingBottom: 15}]}>Change Password</Text>

            {/* Current Password */}
            <TextInput
                placeholder="Current Password"
                placeholderTextColor="grey"
                secureTextEntry={true}
                value={currentPassword}
                onChangeText={text => setCurrentPassword(text)}
                style={Theme.settingInput}
            />

            {/* New Password */}
            <TextInput
                placeholder="New Password"
                placeholderTextColor="grey"
                secureTextEntry={true}
                value={newPassword}
                onChangeText={text => setNewPassword(text)}
                style={Theme.settingInput}
            />

            {/* Confirm Password */}
            <TextInput
                placeholder="Confirm New Password"
                placeholderTextColor="grey"
                secureTextEntry={true}
                value={confirmPassword}
                onChangeText={text => setConfirmPassword(text)}
                style={Theme.settingInput}
            />

            {/* Add buttons */}
            <TouchableOpacity style={[Theme.maroonOvalButton, {marginTop: 10}]} onPress={handleChangePassword}>
                <Text style={Theme.optionText}>Change Password</Text>
            </TouchableOpacity>
        </View>
    );
}