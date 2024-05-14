import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SelectList } from 'react-native-dropdown-select-list'
import { db } from '../../config/firebase';
import { collection, onSnapshot, doc, setDoc, arrayUnion, updateDoc, arrayRemove, query, where, getDocs, getDoc } from "firebase/firestore"; import Theme from '../../style';
import { AuthContext } from '../../contexts/authContext';
import Feather from 'react-native-vector-icons/Feather';

export default function HomeScreen({ navigation }) {
    //CONSTS
    const [attendance, addAttendance] = useState([]);
    const [notification, addNotification] = useState([]);
    const [sessionAttendance, setSessionAttendance] = useState({}); // State to track attendance for each session
    const [selectedWeek, setSelectedWeek] = useState('Current week'); // State to track selected week
    const [availability, setAvailability] = useState([]);

    const [selectedAvailability, setSelectedAvailability] = useState({});

    const { typeID, userID, fullname } = useContext(AuthContext);

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

    // FETCH CURRENT AVAILABILITY
    useEffect(() => {
        fetchAvailability();
    }, [selectedWeek, userID]);

    const fetchAvailability = async () => {
        const currentDate = new Date();
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() === 0 ? -6 : 1));

        const formattedStartOfWeek = startOfWeek.toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        try {
            const q = query(collection(db, "Availability"), where("TypeID", "==", typeID), where("Session", ">=", formattedStartOfWeek));

            const querySnapshot = await getDocs(q);

            const availabilityList = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                let value = "";

                if (data.Attending && data.Attending.includes(userID + ", " + fullname)) {
                    value = "Attending";
                } else if (data.Absent && data.Absent.includes(userID + ", " + fullname)) {
                    value = "Absent";
                } else if (data.Sick && data.Sick.includes(userID + ", " + fullname)) {
                    value = "Sick";
                } else if (data["Home Training"] && data["Home Training"].includes(userID + ", " + fullname)) {
                    value = "Home Training";
                }
                availabilityList.push({ dayTime: data.Session, value });
            });

            setAvailability(availabilityList);
        } catch (error) {
            console.error("Error fetching availability:", error);
        }
    };

    useEffect(() => {
        // Update selected availability when availability or selected week changes
        const initialSelectedAvailability = {};
        availability.forEach(item => {
            initialSelectedAvailability[item.dayTime] = item.value;
        });
        setSelectedAvailability(initialSelectedAvailability);
    }, [availability, selectedWeek, userID]);

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
    }, [typeID]);

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
        setSelectedAvailability(prevState => ({
            ...prevState,
            [dayTime]: value
        }));

        try {
            // Attempt to create the document reference
            const sessionDocRef = doc(db, "Availability", `${typeID}-${dayTime}`);

            let sessionData = {
                Session: dayTime,
                TypeID: typeID,
                "Home Training": [],
                Sick: [],
                Absent: [],
                Attending: [],
            };
            // Fetch the existing session data from Firestore
            const sessionDocSnap = await getDoc(sessionDocRef);
            if (sessionDocSnap.exists()) {
                sessionData = sessionDocSnap.data();
            }

            // Check if the selected value is already the same as the current value in the database
            if (sessionData && sessionData[value] && sessionData[value].includes(userID + ", " + fullname)) {
                // Value is already selected, no need to perform updates
                console.log("Attendance value is already the same, no updates needed.");
                return;
            }

            // Create an update object
            const updateField = { [value]: arrayUnion(userID + ", " + fullname) };

            // Determine the old field based on the existing session data
            let oldField;
            if (sessionData) {
                if (sessionData.Attending && sessionData.Attending.includes(userID + ", " + fullname)) {
                    oldField = "Attending";
                } else if (sessionData.Absent && sessionData.Absent.includes(userID + ", " + fullname)) {
                    oldField = "Absent";
                } else if (sessionData.Sick && sessionData.Sick.includes(userID + ", " + fullname)) {
                    oldField = "Sick";
                } else if (sessionData["Home Training"] && sessionData["Home Training"].includes(userID + ", " + fullname)) {
                    oldField = "Home Training";
                }
            }

            // Remove the user ID from the old field if it exists
            if (oldField) {
                updateField[oldField] = arrayRemove(userID + ", " + fullname);
            }

            await setDoc(sessionDocRef, sessionData, { merge: true });
            console.log("Session document created or updated successfully.");


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
            <Text style={Theme.h2}>{"\n"}Sessions:
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
                                <View key={sessionIndex} style={[Theme.TimeContainer, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                                    <Text style={{ color: '#333333' }}>{time}</Text>
                                    {/* Pass the dayTime and session data to handleAttendanceSelection when an option is selected */}
                                    <SelectList
                                        setSelected={(val) => handleAttendanceSelection(dayTime, val)}
                                        data={AttendancePickerData}
                                        defaultValue={selectedAvailability[dayTime]}
                                        search={false}
                                        placeholder={selectedAvailability[dayTime]}
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
        <View>
            <Text style={Theme.maroontitle}>
                <Feather name={'user'} size={20} color="maroon"/>
                {" "}
                {fullname}
            </Text>
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
        </View>
    );

}
