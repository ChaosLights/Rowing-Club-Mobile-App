import React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { MultipleSelectList } from 'react-native-dropdown-select-list'
import { db } from '../../config/firebase';
import { collection, onSnapshot, query, where, orderBy} from "firebase/firestore";
import Theme from '../../style';

export default function EventsCoach({ navigation }) {
    // const
    const [events, addEvents] = useState([]);
    const [selected, setSelected] = useState([]);
    const [userTypeList, setUserTypeList] = useState([]);

    // get dropdown options
    useEffect(() => {
        // get UserType table
        onSnapshot(collection(db, "UserType"), (snapshot) => {
            let updatedUserTypeList = [];
            // for each non-coach user type
            snapshot.docs.forEach((doc) => {
                const userType = { ...doc.data(), id: doc.id };
                if (userType.Type != "Coach") {
                    // add ID and descriptive name onto updatedUserTypeList via mapping
                    updatedUserTypeList.push({key: userType.id, value: userType.Type});
                }
            });
            // set the user type list to the updated version
            setUserTypeList(updatedUserTypeList);
        });
    }, []);

    // fetch events for U13
    const fetchU13Events = async () => {
        const q = query(collection(db, "Event"),
            where("TypeID", "==", "Onulbd9Ck9DoxPDN1bZ1"),
            orderBy("Date", "desc") // order by latest event for at the top
        );
        const querySnapshot = await onSnapshot(q, (snapshot) => {
            let eventList = [];
            snapshot.docs.map((doc) => eventList.push({ ...doc.data(), id: doc.id }));
            addEvents(eventList);
        });
    };

    // fetch events for U18
    const fetchU18Events = async () => {
        const q = query(collection(db, "Event"),
            where("TypeID", "==", "AmU8s77q7TcDytflxrC8"),
            orderBy("Date", "desc") // Order by timestamp in ascending order
        );
        const querySnapshot = await onSnapshot(q, (snapshot) => {
            let eventList = [];
            snapshot.docs.map((doc) => eventList.push({ ...doc.data(), id: doc.id }));
            addEvents(eventList);
            console.log(eventList); //TEST
        });
    };

    // fetch events for selected age group
    const fetchEvents = async () => {
        let eventList = [];
        selected.forEach(ageGroup => {
            // query events for certain age group
            const q = query(collection(db, "Event"),
                where("TypeID", "==", ageGroup),
                orderBy("Date", "desc") // order by latest event for at the top
            );
            const querySnapshot = onSnapshot(q, (snapshot) => {
                snapshot.docs.map((doc) => eventList.push({ ...doc.data(), id: doc.id }));
            });
        })
        addEvents(eventList);
    };

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
                {item.TypeID}
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
            <Text style={Theme.title}>Coach View!!{"\n"}</Text>
            
            <MultipleSelectList // dropdown for different rower types
                setSelected={(val) => setSelected(val)}
                search = {false}
                data = {userTypeList}
                boxStyles={{width: '90%'}} // MOVE TO STYLE SHEET??
                save="key"
            />

            <View style={Theme.optionBar}>
                <TouchableOpacity style={Theme.optionBarButton} onPress={fetchEvents}>
                    <Text style={Theme.optionText}>Search</Text>
                </TouchableOpacity>
            </View>

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
