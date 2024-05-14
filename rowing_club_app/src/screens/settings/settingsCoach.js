import React, { useState } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import Theme from '../../style';
import { getAuth, reauthenticateWithCredential, EmailAuthProvider, updatePassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

export default function SettingsCoach({ navigation }) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newUserPassword, setNewUserPassword] = useState('');

    // Initialize Firebase Auth
    const auth = getAuth();

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        try {
            const user = auth.currentUser;
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPassword);
            Alert.alert('Success', 'Password updated successfully!');
            // Clearing input fields
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error("Error during password update: ", error);
            Alert.alert('Error', error.message);
        }
    };

    
    const handleAddUser = async () => {
        if (!newEmail || !newUserPassword) {
            Alert.alert('Error', 'Please fill in all the required fields.');
            return;
        }

    // Basic validation for email format
    if (!newEmail.includes('@')) {
        Alert.alert('Error', 'Invalid email format.');
        return;
    }

    try {
        await createUserWithEmailAndPassword(auth, newEmail, newUserPassword);
        Alert.alert('Success', 'User added successfully!');
        // Clearing input fields
        setNewEmail('');
        setNewUserPassword('');
    } catch (error) {
        console.error("Error adding user: ", error);
        Alert.alert('Error', error.message);
    }
};

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
            <Text style={Theme.title}>Change Password</Text>
            <View style={{marginBottom: 10}} />

            {/* Section to change password */}
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
            
            {/* Section to add new users */}
            <Text style={[Theme.title, { marginTop: 20 }]}>Add New User</Text>
            <View style={{marginBottom: 10}} />
            <TextInput
                style={[Theme.input, Theme.underline]}
                placeholder="New User's Email"
                value={newEmail}
                onChangeText={setNewEmail}
            />
            <View style={{marginBottom: 10}} />
            <TextInput
                style={[Theme.input, Theme.underline]}
                placeholder="New User's Password"
                secureTextEntry={true}
                value={newUserPassword}
                onChangeText={setNewUserPassword}
            />
            <View style={{marginBottom: 10}} />
            <TouchableOpacity style={[Theme.maroonOvalButton, {marginTop: 10}]} onPress={handleAddUser}>
            <Text style={Theme.optionText}>Add User</Text>
            </TouchableOpacity>
            
            {/* Logout button */}
            <View style={{marginBottom: 20}} />
            <TouchableOpacity style={Theme.maroonOvalButton} onPress={() => handleLogout()}>
                <Text style={Theme.optionText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}