import React from 'react';
import EventsCoach from './eventsCoach';
import EventsRower from './eventsRower';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/authContext';

export default function EventsScreen({ navigation }) {
    // const
    const [content, setContent] = useState();
    const {isCoach} = useContext(AuthContext);

    // check if user is coach or rower
    useEffect(() => {
        if (isCoach) {
            // set returning content to coach screen
            setContent(<EventsCoach />);
        } else {
            // set returning content to rower screen
            setContent(<EventsRower />);
        }
    }, [global.userTypeID]);


    return content;
}
