import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import Theme from '../../style';
import { getAuth, signOut, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';
import { AuthContext } from '../../contexts/authContext';

export default function SettingsRower({ navigation }) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // { userUID } = useContext(AuthContext); // Assuming you are passing the user's UID for use.
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

    const handleLogout = () => {
        signOut(auth).then(() => {
            // User signed out
            console.log('User logged out');
            navigation.navigate('login');
        }).catch((error) => {
            console.error('Error signing out: ', error);
        });
    };

    return (
        <View style={Theme.view}>
            <Text style={Theme.title}>Change Password</Text>
            <View style={{marginBottom: 10}} />
            <TextInput
                style={[Theme.input, Theme.underline]}
                placeholder="Current Password"
                placeholderTextColor="#808080"
                secureTextEntry={true}
                value={currentPassword}
                onChangeText={setCurrentPassword}
            />
            <View style={{marginBottom: 10}} />
            <TextInput
                style={[Theme.input, Theme.underline]}
                placeholder="New Password"
                placeholderTextColor="#808080"
                secureTextEntry={true}
                value={newPassword}
                onChangeText={setNewPassword}
            />
            <View style={{marginBottom: 10}} />
            <TextInput
                style={[Theme.input, Theme.underline]}
                placeholder="Confirm New Password"
                placeholderTextColor="#808080"
                secureTextEntry={true}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />
            <View style={{marginBottom: 10}} />
            <TouchableOpacity style={[Theme.maroonOvalButton, {marginTop: 10}]} onPress={handleChangePassword}>
                <Text style={Theme.optionText}>Change Password</Text>
            </TouchableOpacity>

            <TouchableOpacity style={Theme.maroonOvalButton} onPress={handleLogout}>
                <Text style={Theme.optionText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}
