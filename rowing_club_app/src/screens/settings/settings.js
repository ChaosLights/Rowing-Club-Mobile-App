import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import Theme from '../../style';
import { db } from '../../config/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

export default function SettingsScreen({ navigation }) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleChangePassword = async () => {

        if (currentPassword === '' || newPassword === '' || confirmPassword === '') {
            Alert.alert('Please fill in all fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('New password and confirm password aado not match');
            return;
        }

        const passwordDocumentId = 'ZcF4gkJykIoiwl593D6U';

        try {
            const passwordDocRef = doc(db, 'Passwords', passwordDocumentId);
            const passwordDocSnap = await getDoc(passwordDocRef);

            if (!passwordDocSnap.exists()) {
                Alert.alert('No password document found')
                return;
            }
        

            const storedPassword = passwordDocSnap.data().currentUserPassword;

            if (storedPassword !== currentPassword) {
                Alert.alert('Current passwrd is incorrect');
                return;
            }

            await updateDoc(passwordDocRef, {
                currentUserPassword: newPassword,
            });

            Alert.alert('Password updated successfully');

        } catch (error) {
            console.error("Error updating password: ", error);
            Alert.alert('There was a problem updating the password.');
        }

        console.log('New password:', newPassword);
    };

    const handleLogout = () => {
        console.log('User logged out');

    };

    return (
        <View style={Theme.view}>
            <Text style={Theme.title}>Change Password</Text>
            <TextInput
                style={Theme.input}
                placeholder="Current Password"
                secureTextEntry={true}
                value={currentPassword}
                onChangeText={setCurrentPassword}
            />
            <TextInput
                style={Theme.input}
                placeholder="New Password"
                secureTextEntry={true}
                value={newPassword}
                onChangeText={setNewPassword}
            />
            <TextInput
                style={Theme.input}
                placeholder="Confirm New Password"
                secureTextEntry={true}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />
            <Button title="Change Password" onPress={handleChangePassword} />
            <View style={{ marginVertical: 10 }} />
            <Button title="Logout" onPress={handleLogout} />
        </View>
    );
}
