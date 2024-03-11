import React from 'react';
import HomeRower from './homeRower';
import HomeCoach from './homeCoach';
import { useState, useEffect } from 'react';

export default function HomeScreen({ navigation }) {
    // const
    const [content, setContent] = useState();

    // check if user is coach or rower
    useEffect(() => {
        if (global.userTypeID === "YDYsOFRCBMqhFpDn1buu") {
            // set returning content to coach screen
            setContent(<HomeCoach />);
        } else {
            // set returning content to rower screen
            setContent(<HomeRower />);
        }
    }, [global.userTypeID]);

    return content;
}
