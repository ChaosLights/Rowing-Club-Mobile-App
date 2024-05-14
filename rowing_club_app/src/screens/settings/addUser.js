import React, { useState } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import Theme from '../../style';
import { createUserWithEmailAndPassword, } from 'firebase/auth';


export default function AddUser() {
    const [newEmail, setNewEmail] = useState('');
    const [newUserPassword, setNewUserPassword] = useState('');

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
    }

    return (
        <View style={Theme.view}>
            {/* Title */}
            <Text style={[Theme.title, {paddingBottom: 15}]}>Add New User</Text>

            {/* Email */}
            <TextInput
                placeholder="New User's Email"
                placeholderTextColor="grey"
                secureTextEntry={true}
                value={newEmail}
                onChangeText={text => setNewEmail(text)}
                style={Theme.settingInput}
            />

            {/* Password */}
            <TextInput
                placeholder="New User's Password"
                placeholderTextColor="grey"
                secureTextEntry={true}
                value={newUserPassword}
                onChangeText={text => setNewUserPassword(text)}
                style={Theme.settingInput}
            />

            {/* Add buttons */}
            <TouchableOpacity style={[Theme.maroonOvalButton, {marginTop: 10}]} onPress={handleAddUser}>
                <Text style={Theme.optionText}>Add User</Text>
            </TouchableOpacity>
        </View>
    );
}