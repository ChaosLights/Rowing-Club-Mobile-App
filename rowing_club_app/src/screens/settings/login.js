import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';

let userId = 'FWBWX7EOw75rwE20cQD2';

export default function Login({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {

        // Querying the Firestore database for a user document with matching Username and Password
        const usersRef = collection(db, 'User');
        const q = query(usersRef, where('Username', '==', username), where('Password', '==', password));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            userId = userDoc.id; // This is the document ID, which is the userId

            // Navigate to the home page and pass the userId for use in the settings page
            navigation.navigate('Home', { userId });
        } else {
            Alert.alert('Incorrect details', 'The username or password you entered is incorrect.');
        }
    };
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Login Page</Text>
            <TextInput
                style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1, marginVertical: 10 }}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
                placeholder="Password"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
            />
            <Button title="Login" onPress={handleLogin} />
        </View>
    );
}

export { userId };
