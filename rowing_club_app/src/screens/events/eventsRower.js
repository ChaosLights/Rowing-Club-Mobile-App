/*import React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { db } from '../../config/firebase';
import { collection, onSnapshot, query, where, orderBy} from "firebase/firestore";
import Theme from '../../style';
import * as util from './eventsUtil';

export default function EventsRower({ navigation }) {
    // const
    const [userTypeID, setUserTypeID] = useState();
    const [rowerEvents, setEvents] = useState([]);

    useEffect(() => {
        // query for current user information
        const q1 = query(collection(db, "User"), where("__name__", "==", global.user));
        const querySnapshot1 = onSnapshot(q1, (snapshot) => {
            // set the user typeID to userTypeID
            setUserTypeID(snapshot.docs[0].data().TypeID);
        });

        // query for events
        let eventList = [];
        const q2 = query(collection(db, "Event"),
            orderBy("Date", "desc") // order by latest event for at the top
        );
        const querySnapshot2 = onSnapshot(q2, (snapshot) => {
            snapshot.docs.forEach((doc) => {
                const event = { ...doc.data(), id: doc.id };
                if (event.TypeID === userTypeID) {
                    // add ID and descriptive name onto updatedUserTypeList via mapping
                    eventList.push(event);
                    // re-set events array to include new events
                    setEvents(eventList);
                }
            });
        });

        // Return cleanup functions
        return () => {
            querySnapshot1();
            querySnapshot2();
        };
    }, [userTypeID]);

    // RENDER
    const renderItem = ({ item }) => (
        <View style={Theme.eventContainer}>
            <Text style={Theme.h2}>
                {item.Title}
            </Text>
            <Text style={Theme.body}>
                {util.timestampToString(item.Date)}
            </Text>
            <Text style={Theme.body}>
                {"\n"}
                {item.Description}
            </Text>
        </View>
    );

    // MAIN
    return (
        <View style={Theme.view}>
            //{ <Text style={Theme.body}>{"\n"}</Text> }
            <FlatList data={rowerEvents} renderItem={renderItem} keyExtractor={item => item.id} />
        </View>
    );
}*/

import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList } from 'react-native';
import { db } from '../../config/firebase';
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { AuthContext } from '../../contexts/authContext';
import Theme from '../../style';

export default function EventsRower({ navigation }) {
    const { userUID } = useContext(AuthContext);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        if (!userUID) return;  // Ensure userUID is not undefined

        // Fetching the user's type ID first
        const userQuery = query(collection(db, "User"), where("UserUID", "==", userUID));
        let unsubscribeUser = onSnapshot(userQuery, (snapshot) => {
            if (!snapshot.empty) {
                const userTypeID = snapshot.docs[0].data().TypeID;

                // Once userTypeID is fetched, fetch events related to this type
                if (userTypeID) {
                    const eventsQuery = query(collection(db, "Event"), where("TypeID", "==", userTypeID));
                    const unsubscribeEvents = onSnapshot(eventsQuery, (eventSnapshot) => {
                        const loadedEvents = eventSnapshot.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data()
                        }));
                        setEvents(loadedEvents);
                    });

                    return () => unsubscribeEvents();
                }
            }
        });

        return () => unsubscribeUser();
    }, [userUID]);  // Dependency array includes userUID to re-run effect when userUID changes

    return (
        <View style={Theme.view}>
            <FlatList
                data={events}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={Theme.eventContainer}>
                        <Text style={Theme.h2}>{item.Title}</Text>
                        <Text style={Theme.body}>{item.Date}</Text> {/* Modify according to your date format needs */}
                        <Text style={Theme.body}>{item.Description}</Text>
                    </View>
                )}
            />
        </View>
    );
}


