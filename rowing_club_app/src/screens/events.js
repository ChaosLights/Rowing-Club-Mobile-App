import React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { db } from '../config/firebase';
import {collection, onSnapshot} from "firebase/firestore";
import Theme from '../style';

export default function EventsScreen({navigation}) {
    // const
    const [events, addEvents] = useState([]);
    
    // get events
    useEffect(() => {
        onSnapshot(collection(db, "Event"), (snapshot) => {
            let eventList = []
            snapshot.docs.map((doc) => eventList.push({ ...doc.data(), id: doc.id }))
            addEvents(eventList)
        })
    }, [])

    // for each event item
    const renderItem = ({item}) => (
        <View style={Theme.view}>
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
    )
    // get date in format
    function dateFormat(date) {
        return new Date(date.seconds * 1000).toLocaleString()
      }

    // main
    return (
        <View style={Theme.view}>
            <Text style={Theme.title}>Events Page Implementation...{"\n"}</Text>
            <FlatList data={events} renderItem={renderItem} keyExtractor={item => item.id} />
        </View>
    )
}