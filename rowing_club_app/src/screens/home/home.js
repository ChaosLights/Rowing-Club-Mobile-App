import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/authContext';
import HomeRower from './homeRower';
import HomeCoach from './homeCoach';
import { useState, useEffect } from 'react';

export default function HomeScreen({ navigation }) {
    //check if logged in
    // if(AuthContext.userUID == null) {
    //     navigation.replace('Login');
    // }

    // const
    const { isCoach } = useContext(AuthContext); // check if user type is coach
    const [content, setContent] = useState();

    useEffect(() => {
        if (isCoach) {
            // set returning content to coach screen
            setContent(<HomeCoach />);
        } else {
            //// set returning content to rower screen
            setContent(<HomeRower />);
        }

    }, [isCoach]);

    return content;
}