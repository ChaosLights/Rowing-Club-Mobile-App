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
    const [notification, addNotification] = useState([]);
    const [checkedDays, setCheckedDays] = useState({});
    const rowerID = "YRhW9fMSA0hd6IixgLaO";

    // get rower group
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

// get group attendance schedule
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

//get notifications
       useEffect(() => {
        onSnapshot(collection(db, "Notification"), (snapshot) => {
        let notificationList = []
         snapshot.docs.map((doc) => notificationList.push({ ...doc.data(), id: doc.id }))
              addNotification(notificationList)
                       })
                           }, [])

        const handleCheckBoxToggle = (day) => {
                setCheckedDays((prevCheckedDays) => ({
                    ...prevCheckedDays,
                    [day]: !prevCheckedDays[day],
                }));
            };

//display notifications
const renderNotification = ({item}) => (
        <View style={Theme.view}>
            <Text style={Theme.h2}>
                {item.overview}
            </Text>
            <Text style={Theme.body}>
                {item.description}
            </Text>
        </View>
    )

// display  days and checkboxes

              const currentDate = new Date();
                  const startOfWeek = new Date(currentDate);
                  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() === 0 ? -6 : 1)); // Adjust for Sunday

                  const weekdays = [];
                  for (let i = 0; i < 7; i++) {
                      const day = new Date(startOfWeek);
                      day.setDate(startOfWeek.getDate() + i);
                      const weekday = day.toLocaleDateString(undefined, { weekday: 'long' });
                      weekdays.push({ fullDate: day, weekday: weekday });
                  }


                  const renderChecklist = ({ item }) => (
                      <View style={Theme.view}>
                          <Text style={Theme.h2}>
                              {item.AgeGroup}
                              {"\n"} {"\n"}Sessions:
                          </Text>
                          <View>
                              {weekdays.map((dayObj, index) => {
                                  const session = item.Sessions.find((s) => {
                                      const [day] = s.split(', ');
                                      return day === dayObj.weekday;
                                  });

                                  // Display the corresponding session time next to the correct day
                                  return (
                                      <View key={index}>
                                          <Text style={Theme.body}>{dayObj.fullDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
                                          <Text>{session ? session.split(', ')[1] : 'No session'}</Text>
                                      </View>
                                  );
                              })}
                          </View>
                          <Text style={Theme.h2}>
                              {"\n"} Days of the Week:
                          </Text>
                          {weekdays.map((dayObj, index) => (
                              <Text key={index} style={Theme.body}>
                                  {dayObj.fullDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                              </Text>
                          ))}
                      </View>
                  );





    // main
    return (
        <View style={Theme.view}>
            <Text style={Theme.title}>Home Page Implementation... {"\n"} </Text>
            <Text style={Theme.h1}>Notifications</Text>
            <FlatList data={notification} renderItem={renderNotification} keyExtractor={item => item.id} />
            <Text style={Theme.h1}>{"\n"}Availability</Text>
            <FlatList data={attendance} renderItem={renderChecklist} keyExtractor={item => item.id} />
        </View>
    );
}
