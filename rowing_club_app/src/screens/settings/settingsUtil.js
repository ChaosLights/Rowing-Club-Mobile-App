import React, { useContext, useCallback } from 'react';
import { Alert } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';

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