import React from 'react';
import HomeRower from './homeRower';
import HomeCoach from './homeCoach';
import { useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { AuthContext } from '../../contexts/authContext';

export default function HomeScreen({ navigation }) {
    // authentication const
    const auth = getAuth();
    const { userUID } = useContext(AuthContext);
    const { userID } = useContext(AuthContext);
    // const
    const [content, setContent] = useState();

    //check if logged in
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                navigation.replace('Login');
            }
        });

        return () => unsubscribe(); // Cleanup on unmount
    }, []);

    // set correct content
    useEffect(() => {
        if (global.userTypeID == "YDYsOFRCBMqhFpDn1buu") {
            // set returning content to coach screen
            setContent(<HomeCoach />);
        } else {
            //// set returning content to rower screen
            setContent(<HomeRower />);
        }

    }, [global.userTypeID]);

    return content;

}

