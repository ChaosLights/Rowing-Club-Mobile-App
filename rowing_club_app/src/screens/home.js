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
    const rowerID = "1";

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

        const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

        const renderItem = ({ item }) => {
          const sortedDays = Object.keys(item)
            .filter((day) => day !== 'group' && day !== 'id')
            .sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b));
              return (
                <View style={Theme.view}>
                  <Text style={Theme.h2}>{item.group}</Text>
                  {sortedDays.map((day) => (
                    <View key={day} style={Theme.checkboxContainer}>
                      <CheckBox
                        label={`${day}: ${item[day]}`}
                        checked={checkedDays[day]}
                        onChange={() => handleCheckBoxToggle(day)}
                      />
                    </View>
                  ))}
                </View>
              );
        };




    // main
    return (
        <View style={Theme.view}>
            <Text style={Theme.title}>Home Page Implementation...</Text>

            <FlatList data={attendance} renderItem={renderItem} keyExtractor={item => item.id} />
        </View>
    );
}
