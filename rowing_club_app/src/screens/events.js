import React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { db } from '../config/firebase';
import { collection, onSnapshot, query, where, orderBy} from "firebase/firestore";
import Theme from '../style';

export default function EventsScreen({ navigation }) {
    // const
    const [events, addEvents] = useState([]);

    // Fetch events for U13
    const fetchU13Events = async () => {
        const q = query(collection(db, "Event"),
            where("category", "==", "Younger"),
            orderBy("date", "asc") // Order by timestamp in ascending order
        );
        const querySnapshot = await onSnapshot(q, (snapshot) => {
            let eventList = [];
            snapshot.docs.map((doc) => eventList.push({ ...doc.data(), id: doc.id }));
            addEvents(eventList);
        });
    };

    // Fetch events for U18
    const fetchU18Events = async () => {
        const q = query(collection(db, "Event"),
            where("category", "==", "Older"),
            orderBy("date", "asc") // Order by timestamp in ascending order
        );
        const querySnapshot = await onSnapshot(q, (snapshot) => {
            let eventList = [];
            snapshot.docs.map((doc) => eventList.push({ ...doc.data(), id: doc.id }));
            addEvents(eventList);
        });
    };

    // for each event item
    const renderItem = ({ item }) => (
        <View style={Theme.eventContainer}>
            <Text style={Theme.h2}>
                {item.title}
            </Text>
            <Text style={Theme.body}>
                {dateFormat(item.date)}
            </Text>
            <Text style={Theme.body}>
                {"\n"}
                {item.description}
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
            <View style={Theme.optionBar}>
                <TouchableOpacity style={Theme.optionBarButton} onPress={fetchU13Events}>
                    <Text style={Theme.optionText}>U13</Text>
                </TouchableOpacity>
                <TouchableOpacity style={Theme.optionBarButton} onPress={fetchU18Events}>
                    <Text style={Theme.optionText}>U18</Text>
                </TouchableOpacity>
            </View>
            <FlatList data={events} renderItem={renderItem} keyExtractor={item => item.id} />
        </View>
    );
}
