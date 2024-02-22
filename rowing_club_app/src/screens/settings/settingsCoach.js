import React, { useState } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import Theme from '../../style';
import { db } from '../../config/firebase';
import { doc, updateDoc, getDoc, collection, addDoc } from 'firebase/firestore';
const login = 'login';

export default function SettingsCoach({ navigation }) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [newUserPassword, setNewUserPassword] = useState('');

    const handleChangePassword = async () => {
        if (currentPassword === '' || newPassword === '' || confirmPassword === '') {
            Alert.alert('Please fill in all fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('New password and confirm password do not match');
            return;
        }

        const passwordDocumentId = 'ZcF4gkJykIoiwl593D6U';

        try {
            const passwordDocRef = doc(db, 'Passwords', passwordDocumentId);
            const passwordDocSnap = await getDoc(passwordDocRef);

            if (!passwordDocSnap.exists()) {
                Alert.alert('No password document found');
                return;
            }

            const storedPassword = passwordDocSnap.data().currentUserPassword;

            if (storedPassword !== currentPassword) {
                Alert.alert('Current password is incorrect');
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
    };

    const handleAddUser = async () => {
        if (!newUsername || !newUserPassword) {
            Alert.alert('Error', 'Please fill in all the required fields.');
            return;
        }

        try {
            await addDoc(collection(db, 'User'), {
                Username: newUsername,
                Password: newUserPassword,
                // Additional fields if need be
            });

            Alert.alert('Success', 'User added successfully!');
            setNewUsername('');
            setNewUserPassword('');
        } catch (error) {
            console.error("Error adding user: ", error);
            Alert.alert('Error', 'There was a problem adding the new user.');
        }
    };

    const handleLogout = () => {
        console.log('User logged out');
        navigation.navigate(login);
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
                placeholder="New User's Username"
                value={newUsername}
                onChangeText={setNewUsername}
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
            <TouchableOpacity style={Theme.maroonOvalButton} onPress={handleLogout}>
                <Text style={Theme.optionText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}
