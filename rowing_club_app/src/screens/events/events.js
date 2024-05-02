import React from 'react';
import EventsCoach from './eventsCoach';
import EventsRower from './eventsRower';
import { useState, useEffect } from 'react';

export default function EventsScreen({ navigation }) {
    // const
    const [content, setContent] = useState();

    // check if user is coach or rower
    useEffect(() => {
        if (global.userTypeID === "FWBWX7EOw75rwE20cQD2") {
            // set returning content to coach screen
            setContent(<EventsCoach />);
        } else {
            // set returning content to rower screen
            setContent(<EventsRower />);
        }
    }, [global.userTypeID]);

    return content;
}
