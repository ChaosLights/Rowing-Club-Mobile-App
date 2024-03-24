import React from 'react';
import HomeRower from './homeRower';
import HomeCoach from './homeCoach';
import { useState, useEffect } from 'react';

export default function HomeScreen({ navigation }) {
    // const
    const [content, setContent] = useState();


    //global.userTypeID = "YDYsOFRCBMqhFpDn1buu" //coach
    global.userTypeID = "AmU8s77q7TcDytflxrC8" //rower 18 and over
    //global.userTypeID = "OyhnLJNs0fEJ0eBT6266" //rower 16-17

    // check if user is coach or rower
    useEffect(() => {
        if (global.userTypeID == "YDYsOFRCBMqhFpDn1buu") {
            // set returning content to coach screen
            setContent(<HomeCoach />);
            console.log("COACH");
        } else {
            //// set returning content to rower screen
            setContent(<HomeRower />);
            console.log("ROWER");
            console.log("Test 1: " + global.userTypeID);
            console.log("YDYsOFRCBMqhFpDn1buu");
        }

    }, [global.userTypeID]);

    return content;

}
