import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { AuthContext } from '../../contexts/authContext';
import Theme from '../../style'

export default function Login( {navigation} ) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setUserUID } = useContext(AuthContext);
    const auth = getAuth();
    const navGlobal  = {navigation};

    // function to handle login
    const handleLogin = async () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                setUserUID(user.uid);
                navigation.replace('ScreensContainer');
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
            <Text style={Theme.title} >Rowing App</Text>
            <TextInput
                style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1, marginVertical: 10, paddingLeft: 10 }}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingLeft: 10 }}
                placeholder="Password"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
            />
            <TouchableOpacity style={[Theme.navButton, {marginTop: 10}]} onPress={handleLogin}>
                <Text style={Theme.navButtonFont}>Login</Text>
            </TouchableOpacity>
        </View>
    )
}