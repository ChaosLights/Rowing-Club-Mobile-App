import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { db } from '../../config/firebase';
import { collection, onSnapshot } from "firebase/firestore";
import Theme from '../../style';

export default function HomeScreen({ navigation }) {
    //CONSTS
    const [attendance, addAttendance] = useState([]);
    const [notification, addNotification] = useState([]);
    const [sessionAttendance, setSessionAttendance] = useState({}); // State to track attendance for each session
    const [selectedWeek, setSelectedWeek] = useState('currentWeek'); // State to track selected week

    const typeID = "AmU8s77q7TcDytflxrC8"; // id for over 18
    //const typeID = "Onulbd9Ck9DoxPDN1bZ1"; //id for 14-15

    //GET GROUP ATTENDANCE SCHEDULE
    //from RecuringSchedule db
    useEffect(() => {
        console.log("Fetching attendance schedule...");
        onSnapshot(collection(db, "RecuringSchedule"), (snapshot) => {
            let attendanceList = []
            snapshot.docs.forEach((doc) => {
                const attendanceData = { ...doc.data(), id: doc.id };
                if (attendanceData.TypeID === typeID) {
                    attendanceList.push(attendanceData);
                    addAttendance(attendanceList);
                    return;
                }
            });
        });
    }, []);

    //GET NOTIFIACTIONS
    //from Notification db
    useEffect(() => {
        console.log("Fetching notifications...");
        onSnapshot(collection(db, "Notification"), (snapshot) => {
            let notificationList = []
            snapshot.docs.map((doc) => notificationList.push({ ...doc.data(), id: doc.id }))
            addNotification(notificationList)
        })
    }, [])

    //display notifications
    // called in main
    const renderNotification = ({ item }) => (
        <View style={Theme.eventContainer}>
            <Text style={Theme.h2}>
                {item.Overview}
            </Text>
            <Text style={Theme.body}>
            {item.Description}
            </Text>
        </View>
    );

    // Function to handle attendance selection
    const handleAttendanceSelection = (sessionIndex, value) => {
        console.log(`Session ${sessionIndex} attendance set to: ${value}`);
        setSessionAttendance(prevState => ({
            ...prevState,
            [sessionIndex]: value // Update attendance for the selected session
        }));
    }

    // displays week titles
    // and calls renderWeek function
    // (called in main return function)
    const renderAttendance = ({ item }) => (
        <View style={Theme.view}>
            <Picker
                style={Theme.maroonOvalButton}
                selectedValue={selectedWeek}
                onValueChange={(itemValue, itemIndex) => setSelectedWeek(itemValue)}
            >
                <Picker.Item label="Current Week" value="currentWeek" />
                <Picker.Item label="Next Week" value="nextWeek" />
            </Picker>
            <Text style={Theme.h2}>{"\n"}Sessions:
            </Text>
            <View style={{ flexDirection: 'row' }}>
                {selectedWeek === 'currentWeek' && (
                    <View style={{ flex: 1 }}>
                        <Text style={Theme.h3}>Current Week</Text>
                        {renderWeek(item.Sessions, weekdays, 0)}
                    </View>
                )}
                {selectedWeek === 'nextWeek' && (
                    <View style={{ flex: 1 }}>
                        <Text style={Theme.h3}>Next Week</Text>
                        {renderWeek(item.Sessions, weekdays, 7)}
                    </View>
                )}
            </View>
        </View>
    );

    // DISPLAY TRAINING SESSIONS
    // set current date, and date of the start of the week
    const currentDate = new Date();
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() === 0 ? -6 : 1));

    // makes weekdays list, storing all dates within the current week
    const weekdays = [];
    for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        const weekday = day.toLocaleDateString(undefined, { weekday: 'long' });
        weekdays.push({ fullDate: day, weekday: weekday });
    }

    // displays all training info
    // (called in renderAttendance function)
    const renderWeek = (sessions, weekdays, offset) => {
        return weekdays.map((dayObj, index) => {
            const targetDate = new Date(dayObj.fullDate);
            targetDate.setDate(targetDate.getDate() + offset);

            const sessionsForDay = sessions.filter((s) => {
                const [day] = s.split(', ');
                return day === targetDate.toLocaleDateString(undefined, { weekday: 'long' });
            });

            return (
                // prints weekday and training times
                <View key={index} style={Theme.eventContainer}>
                    <Text style={Theme.h3}>{targetDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
                    {sessionsForDay.length > 0 ? (
                        sessionsForDay.map((session, sessionIndex) => (
                            <View key={sessionIndex} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text>{session.split(', ')[1]}</Text>
                                <Picker
                                    selectedValue={sessionAttendance[sessionIndex] || 'Attending'} // Use sessionAttendance state
                                    style={Theme.maroonOvalButton}
                                    onValueChange={(value) => handleAttendanceSelection(sessionIndex, value)}
                                >
                                    <Picker.Item label="Attending" value="Attending" />
                                    <Picker.Item label="Absent" value="Absent" />
                                </Picker>
                            </View>
                        ))
                    ) : (
                        <Text>No session{"\n"}</Text>
                    )}

                </View>
            );
        });
    };

    // MAIN 
    // prints headings and calls methods renderNotification and renderAttendance to display info
    return (
        <ScrollView>
            <View style={Theme.view}>
                <Text style={Theme.title}>Home Page Implementation! Rower View {"\n"} </Text>
                <Text style={Theme.h1}>Notifications</Text>
                <FlatList data={notification} renderItem={renderNotification} keyExtractor={item => item.id} />
                <Text style={Theme.h1}>{"\n"}Attendance</Text>
                <FlatList data={attendance} renderItem={renderAttendance} keyExtractor={item => item.id} />
            </View>
        </ScrollView>
    );
}
