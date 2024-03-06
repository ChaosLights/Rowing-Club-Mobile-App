import React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { MultipleSelectList } from 'react-native-dropdown-select-list'
import { db } from '../../config/firebase';
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";
import Theme from '../../style';

export default function EventsCoach({ navigation }) {
    // const
    const [coachEvents, setEvents] = useState([]);
    const [selected, setSelected] = useState([]);
    const [userTypeList, setUserTypeList] = useState([]);

    // get dropdown options
    useEffect(() => {
        // get UserType table
        const querySnapshot = onSnapshot(collection(db, "UserType"), (snapshot) => {
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

        // return cleanup function
        return () => querySnapshot();
    }, []);

    // fetch events for selected age group
    const fetchEvents = () => {
        let eventList = [];
        // for each selected age group from the dropdown
        selected.forEach(ageGroup => {
            // query events for certain age group
            const q = query(collection(db, "Event"),
                where("TypeID", "==", ageGroup),
                orderBy("Date", "desc") // order by latest event for at the top
            );
            // add queried events onto eventList
            const querySnapshot = onSnapshot(q, (snapshot) => {
                snapshot.docs.map((doc) => eventList.push({ ...doc.data(), id: doc.id }));
                // sort newly added events by date
                eventList.sort((a, b) => b.Date - a.Date);
                // re-set events array to include new events
                setEvents(eventList);
            });
        })
    };

    // get the type string name using TypeID of events
    function getTypeName(typeID) {
        // find the user type that equals to the typeID
        const user = userTypeList.find(user => user.key === typeID);
        if (user) {
            // returning the string literal name of user type
            return user.value;
        }
        // if user cannot be found
        console.error("Queried user type does not exist");
    }

    // show each event item will be rendered
    const renderItem = ({ item }) => (
        <View style={Theme.eventContainer}>
            <Text style={Theme.h2}>
                {item.Title}
            </Text>
            <Text style={Theme.body}>
                {dateFormat(item.Date)}
            </Text>
            <Text style={Theme.body}>
                {"Group: "}
                {getTypeName(item.TypeID)}
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
            <FlatList data={coachEvents} renderItem={renderItem} keyExtractor={item => item.id} />
        </View>
    );
}
