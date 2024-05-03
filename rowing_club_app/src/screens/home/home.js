import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { AuthContext } from '../../contexts/authContext';
import HomeRower from './homeRower';
import HomeCoach from './homeCoach';
import { useState, useEffect } from 'react';

// export default function HomeScreen({ navigation }) {
//     // const
//     const [content, setContent] = useState();


//     //global.userTypeID = "YDYsOFRCBMqhFpDn1buu" //coach
//     global.userTypeID = "AmU8s77q7TcDytflxrC8" //rower 18 and over
//     //global.userTypeID = "OyhnLJNs0fEJ0eBT6266" //rower 16-17
//     //global.userTypeID = "Onulbd9Ck9DoxPDN1bZ1" //rower 14-15

//     // check if user is coach or rower
//     useEffect(() => {
//         if (global.userTypeID == "YDYsOFRCBMqhFpDn1buu") {
//             // set returning content to coach screen
//             setContent(<HomeCoach />);
//         } else {
//             //// set returning content to rower screen
//             setContent(<HomeRower />);
//         }

//     }, [global.userTypeID]);

//     return content;
// }

export default function HomeScreen({ navigation }) {
    // const
    const { isCoach } = useContext(AuthContext); // Checking if user type is coach
    const [content, setContent] = useState();

    useEffect(() => {
        if (isCoach) {
            // set returning content to coach screen
            setContent(<HomeCoach />);
        } else {
            //// set returning content to rower screen
            setContent(<HomeRower />);
        }

    }, [global.userTypeID]);

    return content;
}
