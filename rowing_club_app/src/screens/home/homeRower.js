import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SelectList } from 'react-native-dropdown-select-list'
import { db } from '../../config/firebase';
import { collection, onSnapshot } from "firebase/firestore";
import Theme from '../../style';

export default function HomeScreen({ navigation }) {
    //CONSTS
    const [attendance, addAttendance] = useState([]);
    const [notification, addNotification] = useState([]);
    const [sessionAttendance, setSessionAttendance] = useState({}); // State to track attendance for each session
    const [selectedWeek, setSelectedWeek] = useState('Current week'); // State to track selected week

    const typeID = "AmU8s77q7TcDytflxrC8"; // id for over 18
    //const typeID = "Onulbd9Ck9DoxPDN1bZ1"; //id for 14-15

    const AttendancePickerData = [
        {key:'Not Attending', value:'Absent'},
        {key:'Attending', value:'Attending'},
        {key:'Sick', value:'Sick'},
        {key:'Home Training', value:'Home Training'},
    
      ]
    
      const WeekPickerData = [
        {key:'Current Week', value:'Current week'},
        {key:'Next Week', value:'Next week'},
    
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
            <SelectList
                style={Theme.maroonOvalButton}
                setSelected={(val) => setSelectedWeek(val)}
                data={WeekPickerData}
                placeholder='Current week'
                save="value"
                search={false}
                boxStyles={{backgroundColor:'maroon'}}
                dropdownStyles={{backgroundColor:'maroon'}}
                dropdownTextStyles={{color:'white'}}
                inputStyles={{color:'white'}}
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
                    <Text style={[Theme.h3, { marginBottom: 10 }]}>
                        {targetDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
                    {sessionsForDay.length > 0 ? (
                        sessionsForDay.map((session, sessionIndex) => (
                            <View key={sessionIndex} style={[Theme.GreyOvalButton, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                                <Text style={{ color: 'white' }}>{session.split(', ')[1]}</Text>
                                <SelectList
                                    setSelected={(val) => handleAttendanceSelection(index, val)} // Pass the parameters to handleAttendanceSelection
                                    data={AttendancePickerData}
                                    search={false}
                                    onChange={(val) => console.log('Selected:', val)} // Add an onChange handler to log the selected value
                                    placeholder={"Select"}
                                    save="value"
                                    boxStyles={{backgroundColor:'#F5F5F5'}}
                                    dropdownStyles={{backgroundColor:'#F5F5F5'}}
                                />
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
