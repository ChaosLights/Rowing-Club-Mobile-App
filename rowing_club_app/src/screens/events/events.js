import React from 'react';
import EventsCoach from './eventsCoach';
import EventsRower from './eventsRower';
import { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, onSnapshot, query, where } from "firebase/firestore";

export default function EventsScreen({ navigation }) {
    // const
    const [content, setContent] = useState([]);

    // query user type
    useEffect(() => {
        // query for current user information
        const q = query(collection(db, "User"), where("__name__", "==", global.user));
        const querySnapshot = onSnapshot(q, (snapshot) => {
            if (snapshot.docs[0].data().TypeID === "YDYsOFRCBMqhFpDn1buu") {
                // set returning content to coach screen
                setContent(<EventsCoach />);
            } else {
                // set returning content to rower screen
                setContent(<EventsRower />);
            }
        });

        // return cleanup function
        return () => querySnapshot();
    }, []);

    return content;
}
