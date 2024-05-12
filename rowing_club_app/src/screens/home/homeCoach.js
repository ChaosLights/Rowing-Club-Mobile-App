import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal, Button, TextInput, Alert, StyleSheet } from 'react-native';
import { db } from '../../config/firebase';
import { collection, onSnapshot, addDoc, deleteDoc, doc, query, where, getDocs } from "firebase/firestore";
import Theme from '../../style';
import { SelectList } from 'react-native-dropdown-select-list'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';

export default function HomeScreen({ navigation }) {
    //CONSTS
    // attendance schedule and notifications states
    const [attendance, addAttendance] = useState([]);
    const [notification, addNotification] = useState([]);
    const [selectedWeek, setSelectedWeek] = useState('currentWeek'); // State to track selected week
    const [selectedAgeGroup, setSelectedAgeGroup] = useState([]);
    const [userTypeList, setUserTypeList] = useState([]);
    const [isEditMode, setEditMode] = useState(false); // New state for edit mode
    const [selectedTypeID, setSelectedTypeID] = useState([]);
    const [availabilityData, setAvailability] = useState([]);


    //modal states
    const [isModalVisible, setModalVisible] = useState(false);
    const [newNotificationOverview, setNewNotificationOverview] = useState('');
    const [newNotificationDescription, setNewNotificationDescription] = useState('');
    //modal functions
    const openModal = () => setModalVisible(true);
    const closeModal = () => setModalVisible(false);

    // Edit Mode States
    const toggleEditMode = () => {
        setEditMode(!isEditMode); // Toggle edit mode
    };

    const confirmDeletion = (notificationId) => {
        Alert.alert(
            'Confirm Deletion',
            'Are you sure you want to delete this notification?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', onPress: () => deleteNotification(notificationId) },
            ],
            { cancelable: true }
        );
    };

    const typeIDx = "AmU8s77q7TcDytflxrC8"; // id for over 18
    let typeID = "Onulbd9Ck9DoxPDN1bZ1"; //id for 14-15

    const WeekPickerData = [
        { key: 'Current Week', value: 'currentWeek' },
        { key: 'Next Week', value: 'nextWeek' },

    ]

    function getTypeIDByValue(value) {
        for (var i = 0; i < userTypeList.length; i++) {
            if (userTypeList[i].value === value) {

                return userTypeList[i].key;
            }
        }
        return null;
    }

    function getValueByTypeID(typeID) {
        for (var i = 0; i < userTypeList.length; i++) {
            if (userTypeList[i].key === typeID) {
                return userTypeList[i].value;
            }
        }
        return null;
    }

    useEffect(() => {
        let typeID = getTypeIDByValue(selectedAgeGroup);

        setSelectedTypeID(typeID);

    }, [selectedAgeGroup]);


    // FETCH CURRENT AVAILABILITY
    useEffect(() => {
        fetchAvailability();
    }, [selectedTypeID]);

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
            const q = query(collection(db, "Availability"), where("TypeID", "==", selectedTypeID), where("Session", ">=", formattedStartOfWeek));
            console.log("Age Group Selected:", selectedTypeID, selectedAgeGroup);
            const querySnapshot = await getDocs(q);

            const availabilityList = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();

                // Check if properties exist before accessing their length
                const attendingList = data.Attending ? [...data.Attending] : [];
                const homeList = data["Home Training"] ? [...data["Home Training"]] : [];
                const absentList = data.Absent ? [...data.Absent] : [];
                const sickList = data.Sick ? [...data.Sick] : [];

                // Push data into availabilityList
                availabilityList.push({
                    dayTime: data.Session, 
                    typeId: data.TypeID, 
                    attending: attendingList,
                    home: homeList,
                    absent: absentList,
                    sick: sickList
                });
            });

            setAvailability(availabilityList);
            console.log("Availability list:", availabilityList);
        } catch (error) {
            console.error("Error fetching availability:", error);
        }
    };


    function fetchUserName(userID) {
        // get User table
        let firstname = "";
        let surname = "";
        onSnapshot(collection(db, "User"), (snapshot) => {
            
            console.log("checking user table");
            snapshot.docs.forEach((doc) => {
                const user = { ...doc.data(), id: doc.id };
                if (user.id == userID) {
                    console.log("equal!!!!", user.Firstname, user.Surname);
                    firstname = user.Firstname;
                    surname = user.Surname;
                    console.log(firstname, surname);
                }
            });
            
        });
        return (<Text style={Theme.inputLabel}> {firstname} {surname}</Text>)
    }

    
    

    const getAttendingByDayTime = (inputDayTime) => {
        // Filter the availabilityData list to find an item with the same dayTime
        const matchingItem = availabilityData.find(item => item.dayTime === inputDayTime);
    
        // If a matching item is found, return its attending list
        if (matchingItem) {
            return (
                <Text>
                    <Text style={Theme.inputLabel}>Attending:</Text>{"\n"}
                    {matchingItem.attending.join("\n")}
                    {"\n\n"}
                    <Text style={Theme.inputLabel}>Absent:</Text>{"\n"}
                    {matchingItem.absent.join("\n")}
                    {"\n\n"}
                    <Text style={Theme.inputLabel}>Sick:</Text>{"\n"}
                    {matchingItem.sick.join("\n")}
                    {"\n\n"}
                    <Text style={Theme.inputLabel}>Home Training:</Text>{"\n"}
                    {matchingItem.home.join("\n")}
                    {"\n\n"}

                </Text>
            );
        } else {
            // If no matching item is found, return an empty string
            return (<Text style={Theme.inputLabel}>-</Text>);
        }
    };
    
    




    // get dropdown options
    useEffect(() => {
        // get UserType table
        onSnapshot(collection(db, "UserType"), (snapshot) => {
            let updatedUserTypeList = [];
            // for each non-coach user type
            snapshot.docs.forEach((doc) => {
                const userType = { ...doc.data(), id: doc.id };
                if (userType.Type != "Coach") {
                    // add ID and descriptive name onto updatedUserTypeList via mapping
                    updatedUserTypeList.push({ key: userType.id, value: userType.Type });
                }
            });
            // set the user type list to the updated version
            setUserTypeList(updatedUserTypeList);
            //console.log("userTypeID list:", updatedUserTypeList);
        });
    }, []);


    //// Fetch attendance schedule from RecurringSchedule collection
    useEffect(() => {
        console.log("Fetching attendance schedule...");
        onSnapshot(collection(db, "RecuringSchedule"), (snapshot) => {
            let attendanceList = []
            snapshot.docs.forEach((doc) => {
                const attendanceData = { ...doc.data(), id: doc.id };
                var typeID = getTypeIDByValue(selectedAgeGroup);
                if (attendanceData.TypeID === typeID) {
                    attendanceList.push(attendanceData);
                    addAttendance(attendanceList);
                    attendanceList = [];
                    return;
                }
                else if (selectedAgeGroup.length === 0) {
                    attendanceList.push(attendanceData);
                    addAttendance(attendanceList);
                    attendanceList = [];
                }

            });
        });
    }, [selectedAgeGroup]);

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




    //ADD NEW NOTICICATION
    //to Notification db
    const addNewNotification = async () => {
         // check field inputs
         if((newNotificationOverview == "") || (newNotificationDescription == "")) {
         Alert.alert(
             'Empty Fields',
             'Please fill in the required fields to add an event.',
             [
             {text: 'OK'},
             ]
         );
         return
     }
     // add notification
        try {
            const docRef = await addDoc(collection(db, 'Notification'), {
                Overview: newNotificationOverview,
                Description: newNotificationDescription,
            });
        } catch (error) {
            console.error('Error adding notification: ', error);
        }
        closeModal();
        setNewNotificationOverview('');
        setNewNotificationDescription('');
    };

    //DELETE NOTIFICATION
    //from Notification db
    const deleteNotification = async (notificationId) => {

        try {
            await deleteDoc(doc(db, 'Notification', notificationId));
            console.log('Notification deleted successfully!');
        } catch (error) {
            console.error('Error deleting notification: ', error);
        }
    };

    //display notifications
    // (called in main return function)
    const renderNotification = ({ item }) => (
        <View style={Theme.eventContainer}>
            <View style={Theme.notificationHeader}>
                <Text style={Theme.h2}>{item.Overview}</Text>
                {isEditMode && (
                    <TouchableOpacity onPress={() => confirmDeletion(item.id)} style={Theme.deleteButton}>
                        <Ionicons name="close-circle-outline" size={28} color="maroon" />
                    </TouchableOpacity>
                )}
            </View>
            <Text style={[Theme.body, { marginBottom: 15 }]}>{item.Description}</Text>
        </View>
    );

    // DISPLAY NOTICITATION POPUP
    // (called in main return function)
    const renderNotificationPopup = () => (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' }}>
                <TextInput
                    placeholder="Overview"
                    placeholderTextColor="grey"
                    value={newNotificationOverview}
                    onChangeText={text => setNewNotificationOverview(text)}
                    style={{ marginBottom: 10, borderWidth: 1, padding: 8, borderRadius: 5 }}
                />
                <TextInput
                    placeholder="Description"
                    placeholderTextColor="grey"
                    value={newNotificationDescription}
                    onChangeText={text => setNewNotificationDescription(text)}
                    style={{ marginBottom: 10, borderWidth: 1, padding: 8, borderRadius: 5 }}
                />
                <Button title="Add Notification" onPress={addNewNotification} />
                <Button title="Close" onPress={closeModal} />
            </View>
        </View>
    );

    // displays week titles
    // and calls renderWeek function
    // (called in main return function)
    const renderAttendance = ({ item }) => (
        <View style={Theme.view}>
            <Text style={Theme.h2}>{"\n"}Week:
            </Text>
            <SelectList
                style={Theme.maroonOvalButton}
                setSelected={(val) => setSelectedWeek(val)}
                data={WeekPickerData}
                placeholder='Current Week'
                save="value"
                search={false}
                boxStyles={{ backgroundColor: 'maroon' }}
                dropdownStyles={{ backgroundColor: 'maroon' }}
                dropdownTextStyles={{ color: 'white' }}
                inputStyles={{ color: 'white' }}
            />
            <Text style={Theme.h2}>
                {"\n"}
                {selectedAgeGroup.length === 0 ? `Age Group:` : `Age Group: ${selectedAgeGroup}`}
            </Text>
            <SelectList
                style={Theme.maroonOvalButton}
                setSelected={(val) => setSelectedAgeGroup(val)}
                data={userTypeList}
                placeholder='Age Group'
                save="value"
                search={false}
                boxStyles={{ backgroundColor: 'maroon' }}
                dropdownStyles={{ backgroundColor: 'maroon' }}
                dropdownTextStyles={{ color: 'white' }}
                inputStyles={{ color: 'white' }}
            //defaultValue={initialSelectedValue}
            />
            <Text style={Theme.h2}>{"\n"}Sessions:
            </Text>
            <View style={{ flexDirection: 'row' }}>
                {selectedWeek === 'currentWeek' && (
                    <View style={{ flex: 1 }}>
                        <Text style={Theme.h3}>Current Week </Text>
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
            
    
            // prints weekday and training times
            return (
                <View key={index} style={Theme.eventContainer}>
                    <Text style={Theme.h2}>{targetDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
                    {sessionsForDay.length > 0 ? (
                        sessionsForDay.map((session, sessionIndex) => {
                            const displayedDateTime = `${targetDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}, ${session.split(', ')[1]}`;
                            return (
                                <View key={sessionIndex} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={[{flex:1}, Theme.h2]}>{session.split(', ')[1]}</Text>
                                    <Text style={{flex:1}}>{getAttendingByDayTime(displayedDateTime)} {fetchUserName("hGSQNMnQa4Bjt0zb0L5i")}</Text>
                                </View>
                            );
                        })
                    ) : (
                        <Text>No session{"\n"}</Text>
                    )}
                </View>
            );
        });
    };
    

    // MAIN 
    // prints headings and calls methods renderNotification, renderAttendance and renderNotifiactionPopup to display info
    // Inside the main return function
    return (
        <FlatList
            data={[
                { sectionTitle: 'Notifications', data: notification },
                { sectionTitle: 'Attendance', data: attendance },
            ]}
            renderItem={({ item }) => (
                <View style={Theme.V1}>

                    <View style={Theme.headerContainer}>
                        <Text style={Theme.title}>{item.sectionTitle}</Text>
                        {item.sectionTitle === 'Notifications' && (
                            <View style={Theme.buttonContainer}>
                                <TouchableOpacity
                                    style={Theme.editCircle}
                                    onPress={toggleEditMode}
                                >
                                    <Feather name={isEditMode ? 'edit-3' : 'edit-2'} size={20} color="#FFFFFF"/>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    <FlatList
                        data={item.sectionTitle === 'Notifications' ? notification : attendance}
                        renderItem={item.sectionTitle === 'Notifications' ? renderNotification : renderAttendance}
                        keyExtractor={(item) => item.id}
                    />

                    {item.sectionTitle === 'Notifications' && isEditMode && (
                        <>
                            <View style={Theme.addButtonContainer}>
                                <TouchableOpacity
                                    style={Theme.addCircle}
                                    onPress={openModal}
                                >
                                    <Ionicons name={isModalVisible ? 'duplicate' : 'duplicate-outline'} size={20} color="#FFFFFF"/>
                                </TouchableOpacity>
                            </View>
                            <Modal
                                visible={isModalVisible}
                                onRequestClose={closeModal}
                                transparent
                                animationType="slide"
                            >
                                {renderNotificationPopup()}
                            </Modal>
                        </>
                    )}
                </View>
            )}
            keyExtractor={(item, index) => index.toString()}
        />
    );

};
