import React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { db } from '../../config/firebase';
import { collection, onSnapshot, query, where, orderBy} from "firebase/firestore";
import Theme from '../../style';

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
            console.log(userTypeID);
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
                    console.log(event.Title); //TEST
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

    // for each event item
    const renderItem = ({ item }) => (
        <View style={Theme.eventContainer}>
            <Text style={Theme.h2}>
                {item.Title}
            </Text>
            <Text style={Theme.body}>
                {dateFormat(item.Date)}
            </Text>
            <Text style={Theme.body}>
                {"\n"}
                {item.Description}
            </Text>
        </View>
    );

    // get date in format
    function dateFormat(date) {
        return new Date(date.seconds * 1000).toLocaleString();
    }

    // main
    return (
        <View style={Theme.container}>
            <Text style={Theme.title}>Rower View!!{"\n"}</Text>
            <FlatList data={rowerEvents} renderItem={renderItem} keyExtractor={item => item.id} />
        </View>
    );
}
