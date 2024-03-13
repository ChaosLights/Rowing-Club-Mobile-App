import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SelectList } from 'react-native-dropdown-select-list'
import { db } from '../../config/firebase';
import { collection, onSnapshot, doc, setDoc, arrayUnion, updateDoc, arrayRemove } from "firebase/firestore";
import Theme from '../../style';

export default function HomeScreen({ navigation }) {
    //CONSTS
    const [attendance, addAttendance] = useState([]);
    const [notification, addNotification] = useState([]);
    const [sessionAttendance, setSessionAttendance] = useState({}); // State to track attendance for each session
    const [selectedWeek, setSelectedWeek] = useState('Current week'); // State to track selected week
    const [availability, setAvailability] = useState([]);

    //const typeID = "AmU8s77q7TcDytflxrC8"; // id for over 18
    //const typeID = "Onulbd9Ck9DoxPDN1bZ1"; //id for 14-15

    const typeID = global.userTypeID;

    const AttendancePickerData = [
        { key: 'Not Attending', value: 'Absent' },
        { key: 'Attending', value: 'Attending' },
        { key: 'Sick', value: 'Sick' },
        { key: 'Home Training', value: 'Home Training' },
    ]

    const WeekPickerData = [
        { key: 'Current Week', value: 'Current week' },
        { key: 'Next Week', value: 'Next week' },

    ]

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
    const handleAttendanceSelection = async (dayTime, value) => {
        console.log(`Session ${dayTime} attendance set to: ${value}`);
        setSessionAttendance(prevState => ({
            ...prevState,
            [dayTime]: value
        }));

        // Update availability list
        setAvailability(prevState => {
            const updatedAvailability = [...prevState];
            const index = updatedAvailability.findIndex(item => item.dayTime === dayTime);
            if (index !== -1) {
                updatedAvailability[index] = { dayTime, value };
            } else {
                updatedAvailability.push({ dayTime, value });
            }
            return updatedAvailability;
        });

        console.log(availability);
        try {
            // Attempt to create the document reference
            const sessionDocRef = doc(db, "Availability", `${typeID}-${dayTime}`);
            console.log("Session document reference:", sessionDocRef);

            const sessionData = {
                Session: dayTime,
                TypeID: typeID
            };

            await setDoc(sessionDocRef, sessionData, { merge: true });
            console.log("Session document created or updated successfully.");

            const updateField = { [value]: arrayUnion(global.user) };
            // Remove user's ID from the old field if it's different from the new field
            for (const attendanceField of ['Attending', 'Absent', 'Sick', 'HomeTraining']) {
                if (attendanceField !== value && sessionData.hasOwnProperty(attendanceField)) {
                    // Check if the user's ID exists in the old field before attempting to remove it
                    if (sessionData[attendanceField]) {
                        // Remove user's ID from the old field and add it to the update object
                        updateField[attendanceField] = arrayRemove(global.userID);
                    }
                }
            }
            await updateDoc(sessionDocRef, updateField);
            console.log("Attendance updated successfully.");
        } catch (error) {
            // Log any errors encountered during document reference creation
            console.error("Error creating session document reference:", error);
        }
    }

    // displays week titles
    // and calls renderWeek function
    // (called in main return function)
    const renderAttendance = ({ item }) => (
        <View style={Theme.view}>
            <SelectList
                style={Theme.maroonOvalButton}
                setSelected={(val) => setSelectedWeek(val)}
                data={WeekPickerData}
                placeholder='Current week'
                save="value"
                search={false}
                boxStyles={{ backgroundColor: 'maroon' }}
                dropdownStyles={{ backgroundColor: 'maroon' }}
                dropdownTextStyles={{ color: 'white' }}
                inputStyles={{ color: 'white' }}
            />
            <Text style={Theme.h2}>{"\n"}Sessions: {global.user}
            </Text>
            <View style={{ flexDirection: 'row' }}>
                {selectedWeek === 'Current week' && (
                    <View style={{ flex: 1 }}>
                        <Text style={Theme.h3}>Current Week</Text>
                        {renderWeek(item.Sessions, weekdays, 0)}
                    </View>
                )}
                {selectedWeek === 'Next week' && (
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

    // Function to display all training information for a given week
    // (called in renderAttendance function)
    const renderWeek = (sessions, weekdays, offset) => {
        return weekdays.map((dayObj, index) => {
            // Create a new Date object for the current day in the loop
            const targetDate = new Date(dayObj.fullDate);
            // Add the offset value to the day, affecting the date displayed
            targetDate.setDate(targetDate.getDate() + offset);

            // Filter the sessions array to only include sessions for the current day
            const sessionsForDay = sessions.filter((s) => {
                const [day, time] = s.split(', ');
                // Compare the day in the session data with the current day's localized name
                return day === targetDate.toLocaleDateString(undefined, { weekday: 'long' });
            });

            return (
                // prints weekday and training times
                <View key={index} style={Theme.eventContainer}>
                    <Text style={[Theme.h3, { marginBottom: 10 }]}>
                        {/* Display the full date (weekday, month, day, and year) for the current day */}
                        {targetDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
                    {sessionsForDay.length > 0 ? (
                        sessionsForDay.map((session, sessionIndex) => {
                            const date = targetDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                            const [day, time] = session.split(', ');
                            const dayTime = `${date}, ${time}`;
                            return (
                                <View key={sessionIndex} style={[Theme.GreyOvalButton, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                                    <Text style={{ color: 'white' }}>{time}</Text>
                                    {/* Pass the dayTime and session data to handleAttendanceSelection when an option is selected */}
                                    <SelectList
                                        setSelected={(val) => handleAttendanceSelection(dayTime, val)}
                                        data={AttendancePickerData}

                                        search={false}
                                        onChange={(val) => console.log('Selected:', val)} // Add an onChange handler to log the selected value
                                        placeholder={"Select"}
                                        save="value"
                                        boxStyles={{ backgroundColor: '#F5F5F5' }}
                                        dropdownStyles={{ backgroundColor: '#F5F5F5' }}
                                    />
                                </View>
                            )
                        })
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
        <FlatList
            data={[
                { sectionTitle: "Notifications", data: notification },
                { sectionTitle: "Attendance", data: attendance }
            ]}
            renderItem={({ item }) => (
                <View style={Theme.view}>
                    <Text style={Theme.h1}>{item.sectionTitle}</Text>
                    <FlatList
                        data={item.data}
                        renderItem={item.sectionTitle === "Notifications" ? renderNotification : renderAttendance}
                        keyExtractor={item => item.id}
                    />
                </View>
            )}
            keyExtractor={(item, index) => index.toString()}
        />
    );

}
