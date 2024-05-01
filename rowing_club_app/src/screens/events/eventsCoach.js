import React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, FlatList, Modal, TouchableOpacity, TextInput, Button, Animated} from 'react-native';
import { MultipleSelectList, SelectList } from 'react-native-dropdown-select-list'
import { DatePicker } from 'react-native-date-picker';
import { db } from '../../config/firebase';
import { collection, onSnapshot, query, where, orderBy, deleteDoc } from "firebase/firestore";
import Theme from '../../style';
import * as eventRender from './eventRender';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function EventsCoach({ navigation }) {
    // const
    const [coachEvents, setEvents] = useState([]);
    const [selected, setSelected] = useState([]);
    const [userTypeList, setUserTypeList] = useState([]);
    const [editEvent, setEditEvent] = useState();
    const [showDelete, setShowDelete] = useState(false);

    // modal states
    const [isModalVisible, setModalVisible] = useState(false);
    const [newEventTitle, setNewEventTitle] = useState('');
    const [newEventDate, setNewEventDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [newEventUserType, setNewEventUserType] = useState('');
    const [newEventDescription, setNewEventDescription] = useState('');
    // botton modal
    const [icon1] = useState(new Animated.Value(-160));
    const [icon2] = useState(new Animated.Value(80));
    const [pop, setPop] = useState(true);

    // state functions
    const openModal = () => setModalVisible(true);
    const closeModal = () => setModalVisible(false);
    const toggleDatePicker = () => setShowDatePicker(!showDatePicker);
    const toggleShowDelete = () => setShowDelete(!showDelete);

    // Get event dropdown options
    useEffect(() => {
        // get UserType table
        const querySnapshot = onSnapshot(collection(db, "UserType"), (snapshot) => {
            let updatedUserTypeList = [];
            // for each non-coach user type
            snapshot.docs.forEach((doc) => {
                const userType = { ...doc.data(), id: doc.id };
                if (userType.Type != "Coach") {
                    // add ID and descriptive name onto updatedUserTypeList via mapping
                    updatedUserTypeList.push({key: userType.id, value: userType.Type});
                }
            });
            // set the user type list to the updated version
            setUserTypeList(updatedUserTypeList);
        });

        // return cleanup function
        return () => querySnapshot();
    }, []);

    // Update selected user types onto userTypeList
    useEffect(() => {
        let eventList = [];
        if(selected.length <= 0) {
            // return empty array if no user type selected
            setEvents(eventList);
        } else {
            // for each selected age group from the dropdown
            selected.forEach(ageGroup => {
                // query events for certain age group
                const q = query(collection(db, "Event"),
                where("TypeID", "==", ageGroup),
                orderBy("Date", "desc") // order by latest event for at the top
                );
                // add queried events onto eventList
                const querySnapshot = onSnapshot(q, (snapshot) => {
                    snapshot.docs.map((doc) => eventList.push({ ...doc.data(), id: doc.id }));
                    // sort newly added events by date
                    eventList.sort((a, b) => b.Date - a.Date);
                    // re-set events array to include new events
                    setEvents(eventList);
                });
            })
        }
    }, [selected]);

    // get date in format
    function dateFormat(date) {
        return new Date(date.seconds * 1000).toLocaleString();
    }

    // Rendering events
    const renderItem = ({ item }) => (
        // const [event, setEvent] = useState([item.Title, item.Date, item.TypeID]);
        <View style={Theme.eventContainer}>
            <View style={{flex: 1, flexDirection: 'row'}}>
                {eventRender.renderTitle(item, editEvent)}
                {eventRender.renderEdit(item, editEvent, setEditEvent)}
            </View>
            <Text style={Theme.body}>
                {dateFormat(item.Date)}
            </Text>
            {eventRender.renderGroup(item, editEvent, userTypeList)}
            {eventRender.renderDesc(item, showDelete)}
        </View>
    );

    // Handling button animation
    const popIn = () => {
        setPop(true);
        Animated.timing(icon1, {
            toValue: -160,
            duration: 500,
            useNativeDriver: false,
        }).start();
        Animated.timing(icon2, {
            toValue: 80,
            duration: 500,
            useNativeDriver: false,
        }).start();
    }
    const popOut = () => {
        setPop(false);
        Animated.timing(icon1, {
            toValue: -90,
            duration: 500,
            useNativeDriver: false,
        }).start();
        Animated.timing(icon2, {
            toValue: -60,
            duration: 500,
            useNativeDriver: false,
        }).start();
    }

    // Button 1 Function: Display add event popup
    const renderAddPopup = () => (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' }}>
                {/* Title */}
                <TextInput
                    placeholder="Title"
                    placeholderTextColor="grey"
                    value={newEventTitle}
                    onChangeText={text => setNewEventTitle(text)}
                    style={{ marginBottom: 10, borderWidth: 1, padding: 8, borderRadius: 5 }}
                />
                {/* Date */}
                <TouchableOpacity onPress={toggleDatePicker}>
                    <Text> Set Date </Text>
                    {/* TODO: IMPLEMENT */}
                </TouchableOpacity>

                {/* User Type */}
                <SelectList
                    setSelected={val => setNewEventUserType(val)}
                    data={userTypeList}
                    boxStyles={{marginBottom: 10, borderWidth: 1, padding: 8, borderRadius: 5 }}
                    save="key"
                />
                {/* Description */}
                <TextInput
                    placeholder="Description"
                    placeholderTextColor="grey"
                    multiline
                    value={newEventDescription}
                    onChangeText={text => setNewEventDescription(text)}
                    style={{ marginBottom: 10, borderWidth: 1, padding: 8, borderRadius: 5 }}
                />
                {/* Add & Close buttons */}
                <Button title="Add Event" onPress={null} />
                <Button title="Close" onPress={closeModal} />
            </View>
        </View>
    );

    // Button 1 Function: Add event
    const addEvents = async () => {
        // TODO: IMPLEMENT
    };

    // Button 2 Function: Show delete buttons
    const showDeleteButtons = async () => {
        toggleShowDelete();
    };

    
    // Button 2 Function: Delete events
    const deleteNotification = async (eventID) => {
        try {
            await deleteDoc(doc(db, 'Event', eventID));
        } catch (error) {
            console.error('Error deleting event: ', error);
        }
    }

    // main
    return (
        <View style={Theme.container}>
            <View style={Theme.view}>
                {/* dropdown selection for different rower types */}
                <MultipleSelectList
                    setSelected={(val) => setSelected(val)}
                    search={false}
                    data={userTypeList}
                    boxStyles={Theme.dropdownContainer}
                    save="key"
                />
                {/* show events */}
                <FlatList data={coachEvents} renderItem={renderItem} keyExtractor={(item) => item.id} />
            </View>

            {/* Edit buttons */}
            <View style={Theme.floatingButtonContainer}>
                {/* Button 1: Add events */}
                <Animated.View style={[Theme.circle1, { bottom: icon1 }]}>
                  <TouchableOpacity onPress={openModal}>
                      <Icon name="plus" size={25} color="#FFFF" />
                  </TouchableOpacity>
                </Animated.View>
                {/* Button 2: Remove events */}
                <Animated.View style={[Theme.circle1, { top: icon2 }]}>
                    <TouchableOpacity onPress={showDeleteButtons}>
                        <Icon name="trash" size={25} color="#FFFF" />
                    </TouchableOpacity>
                </Animated.View>
                <TouchableOpacity
                    style={Theme.circle1}
                    onPress={() => {
                        pop === false ? popIn() : popOut();
                    }}
                >
                    <Icon name="pencil" size={25} color="#FFFF" />
                </TouchableOpacity>
            </View>
            
            {/* Popup for add events */}
            <Modal visible={isModalVisible} onRequestClose={closeModal} transparent animationType="slide">
                {renderAddPopup()}
            </Modal>
        </View>
    );
}
