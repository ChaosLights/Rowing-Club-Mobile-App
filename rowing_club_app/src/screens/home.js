import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { db } from '../config/firebase';
import { collection, onSnapshot } from "firebase/firestore";
import Theme from '../style';

export default function HomeScreen({ navigation }) {
    //CONSTS
    const [rowerGroup, setRowerGroup] = useState(null);
    const [attendance, addAttendance] = useState([]);
    const [notification, addNotification] = useState([]);
    const [checkedDays, setCheckedDays] = useState({});
    //const rowerID = "YRhW9fMSA0hd6IixgLaO";       //id for U18
    const rowerID = "0Iz45PGQ70hFnUpo6loC";         //id for 14-15

    //GET ROWERS GROUP
    //from User db
    useEffect(() => {
        onSnapshot(collection(db, "User"), (snapshot) => {
            snapshot.docs.forEach((doc) => {
                const rowData = { ...doc.data(), id: doc.id };
                if (doc.id === rowerID) {
                    setRowerGroup(rowData.AgeGroup);
                    return;
                }
            });
        });
    }, [rowerID]);

    //GET GROUP ATTENDANCE SCHEDULE
    //from GroupAttendance db
    useEffect(() => {
        onSnapshot(collection(db, "GroupAttendance"), (snapshot) => {
            let attendanceList = []
            snapshot.docs.forEach((doc) => {
                const attendanceData = { ...doc.data(), id: doc.id };
                if (attendanceData.AgeGroup === rowerGroup) {
                    attendanceList.push(attendanceData);
                    addAttendance(attendanceList);
                    return;
                }
            });
        });
    }, [rowerGroup]);

    //GET NOTIFIACTIONS
    //from Notification db
    useEffect(() => {
        onSnapshot(collection(db, "Notification"), (snapshot) => {
            let notificationList = []
            snapshot.docs.map((doc) => notificationList.push({ ...doc.data(), id: doc.id }))
            addNotification(notificationList)
        })
    }, [])


    //DISPLAY NOTIFICATIONS
    //from notification const
    //(called in main return function)
    const renderNotification = ({ item }) => (
        <View style={Theme.view}>
            <Text style={Theme.h2}>
                {item.Overview}
            </Text>
            <Text style={Theme.body}>
                {item.Description}
            </Text>
        </View>
    )


    //DISPLAY TRAINING SESSIONS
    //get current date, and date of the start of the week
    const currentDate = new Date();
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() === 0 ? -6 : 1)); // Adjust for Sunday

    //makes weekdays list, storing all dates within the current week
    const weekdays = [];
    for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        const weekday = day.toLocaleDateString(undefined, { weekday: 'long' });
        weekdays.push({ fullDate: day, weekday: weekday });
    }

    //displays ageGroup from database and week titles
    //and calls renderWeek function
    //(called in main return function)
    const renderAttendance = ({ item }) => (
        <View style={Theme.view}>
            <Text style={Theme.h2}>
                {item.AgeGroup}
                {"\n"} {"\n"}Sessions:
            </Text>
            <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1 }}>
                    <Text style={Theme.h3}>Current Week</Text>
                    {renderWeek(item.Sessions, weekdays, 0)}
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={Theme.h3}>Next Week</Text>
                    {renderWeek(item.Sessions, weekdays, 7)}
                </View>
            </View>
        </View>
    );
    

    //displays all training info
    //(called in renderAttendance function)
    const renderWeek = (sessions, weekdays, offset) => {
        return weekdays.map((dayObj, index) => {
            const targetDate = new Date(dayObj.fullDate);
            targetDate.setDate(targetDate.getDate() + offset);
    
            const sessionsForDay = sessions.filter((s) => {
                const [day] = s.split(', ');
                //compares day (days there is training, from notification.Sessions) to weekday (items in weekdays list)
                //if they are equal disply the time (from notification.Sessions) else display "No session"
                return day === targetDate.toLocaleDateString(undefined, { weekday: 'long' }); 
                
            });
    
            return (
                //prints weekday and training times
                <View key={index}>
                    <Text style={Theme.body}>{targetDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
                    {sessionsForDay.length > 0 ? (
                        sessionsForDay.map((session, sessionIndex) => (
                            <Text key={sessionIndex}>{session.split(', ')[1]}{"\n"}</Text> //if weekday = a day where there is training print all sessions on specified day
                        ))
                    ) : (
                        <Text>No session{"\n"}</Text> // if weekday does not have a training session, print "no session"
                    )}
                </View>
            );
        });
    };
    


    // MAIN 
    //prints headings and calls methods renderNotification and renderAttendance to display info
    return (
        <View style={Theme.view}>
            <Text style={Theme.title}>Home Page Implementation! {"\n"} </Text>
            <Text style={Theme.h1}>Notifications</Text>
            <FlatList data={notification} renderItem={renderNotification} keyExtractor={item => item.id} />
            <Text style={Theme.h1}>{"\n"}Availability</Text>
            <FlatList data={attendance} renderItem={renderAttendance} keyExtractor={item => item.id} />
        </View>
    );
}
