import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { db } from '../config/firebase';
import { collection, onSnapshot } from "firebase/firestore";
import Theme from '../style';

export default function HomeScreen({ navigation }) {
    // state
    const [rowerGroup, setRowerGroup] = useState(null);
    const [attendance, addAttendance] = useState([]);
    const rowerID = "1"; // Assuming rowerID is stored as a string in Firestore

    // get rower group
    useEffect(() => {
        onSnapshot(collection(db, "Rower"), (snapshot) => {
            snapshot.docs.forEach((doc) => {
                const rowData = { ...doc.data(), id: doc.id };
                if (rowData.rowerID === rowerID) {
                    setRowerGroup(rowData.group);
                    return;
                }
            });
        });
    }, [rowerID]);

    useEffect(() => {
            onSnapshot(collection(db, "GroupAttendance"), (snapshot) => {
            let attendanceList = []
                snapshot.docs.forEach((doc) => {

                    const attendanceData = { ...doc.data(), id: doc.id };
                    if (attendanceData.group === rowerGroup) {
                        attendanceList.push(attendanceData);
                        addAttendance(attendanceList);
                        return;
                    }

                });
            });
        }, [rowerGroup]);

        const renderItem = ({item}) => (
                <View style={Theme.view}>
                    <Text style={Theme.h2}>
                        {item.group}
                    </Text>
                    <Text style={Theme.body}>
                        Monday: {item.Monday}
                    </Text>
                    <Text style={Theme.body}>
                        Tuesday: {item.Tuesday}
                    </Text>
                    <Text style={Theme.body}>
                       Wednesday: {item.Wednesday}
                    </Text>
                    <Text style={Theme.body}>
                        Thursday: {item.Thursday}
                    </Text>
                    <Text style={Theme.body}>
                        Friday: {item.Friday}
                    </Text>
                    <Text style={Theme.body}>
                        Saturday: {item.Saturday}
                    </Text>
                    <Text style={Theme.body}>
                        Sunday: {item.Sunday}
                    </Text>
                </View>
            )


    // main
    return (
        <View style={Theme.view}>
            <Text style={Theme.title}>Home Page Implementation...</Text>
            <Text style={Theme.h4}>(ziad + izzy)</Text>
            <Text style={Theme.body}>Rower Group: {rowerGroup}</Text>
            <FlatList data={attendance} renderItem={renderItem} keyExtractor={item => item.id} />
        </View>
    );
}
