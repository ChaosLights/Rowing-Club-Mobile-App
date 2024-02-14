import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import CheckBox from 'react-native-checkbox';
import { db } from '../config/firebase';
import { collection, onSnapshot } from "firebase/firestore";
import Theme from '../style';



export default function HomeScreen({ navigation }) {
    // state
    const [rowerGroup, setRowerGroup] = useState(null);
    const [attendance, addAttendance] = useState([]);
    const [checkedDays, setCheckedDays] = useState({});
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

        const handleCheckBoxToggle = (day) => {
                setCheckedDays((prevCheckedDays) => ({
                    ...prevCheckedDays,
                    [day]: !prevCheckedDays[day],
                }));
            };

        const renderItem = ({ item }) => (
            <View style={Theme.view}>
                <Text style={Theme.h2}>{item.group}</Text>
                {Object.keys(item).map((day) => {
                    if (day !== 'group' && day !== 'id') {
                        const time = item[day]; // Assuming the time is stored as a string
                        return (
                            <View key={day} style={Theme.checkboxContainer}>
                                <CheckBox
                                    label={`${day}: ${time}`}
                                    checked={checkedDays[day]}
                                    onChange={() => handleCheckBoxToggle(day)}
                                />
                            </View>
                        );
                    }
                    return null;
                })}
            </View>
        );



    // main
    return (
        <View style={Theme.view}>
            <Text style={Theme.title}>Home Page Implementation...</Text>

            <FlatList data={attendance} renderItem={renderItem} keyExtractor={item => item.id} />
        </View>
    );
}
