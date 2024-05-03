import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { AuthContext } from '../../contexts/authContext';

export default function Login({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setUserUID } = useContext(AuthContext); // Using AuthContext to set user UID globally

    const handleLogin = async () => {
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                setUserUID(user.uid); // Set user UID in global context
                
                // Navigate to 'home' screen after successful login
                navigation.navigate('home');
            })
            .catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                Alert.alert('Login Failed', errorMessage);
            });
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Login Page</Text>
            <TextInput
                style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1, marginVertical: 10 }}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
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
