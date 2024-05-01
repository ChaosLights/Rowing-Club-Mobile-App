import React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, FlatList, Modal, TouchableOpacity, TextInput, Button, Animated} from 'react-native';
import { MultipleSelectList, SelectList } from 'react-native-dropdown-select-list'
import { DatePicker } from 'react-native-date-picker';
import { db } from '../../config/firebase';
import { collection, onSnapshot, query, where, orderBy, addDoc, deleteDoc, getDocs } from "firebase/firestore";
import Theme from '../../style';
import * as eventRender from './eventRender';
import * as util from './eventsUtil';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function EventsCoach({ navigation }) {
    // date list constants
    const [userTypeList, setUserTypeList] = useState([]);
    const [selection, setSelection] = useState([]);
    const [events, setEvents] = useState([]);
    // data bools
    const [showDelete, setShowDelete] = useState(false);
    const toggleShowDelete = () => setShowDelete(!showDelete);
    const [eventUpdate, setEventUpdate] = useState(false);
    const toggleEventUpdate = () => setEventUpdate(!eventUpdate);

    // Popup constants
    const [icon1] = useState(new Animated.Value(160));
    const [icon2] = useState(new Animated.Value(80));
    const [pop, setPop] = useState(false);

    // Input window constants
    const [modalVisibility, setModalVisibility] = useState(false);
    const [newEventTitle, setNewEventTitle] = useState('');
    const [newEventDate, setNewEventDate] = useState(new Date());
    const [newEventUserType, setNewEventUserType] = useState('');
    const [newEventDescription, setNewEventDescription] = useState('');

    // QUARY DATA: Get user types for dropdown options
    useEffect(() => {
        let updatedUserTypeList = [];
        // get `UserType` documents
        const querySnapshot = onSnapshot(collection(db, "UserType"), (snapshot) => {
            // for each non-coach user type
            snapshot.docs.forEach((doc) => {
                const userType = {...doc.data(), id: doc.id};
                if(userType.Type != "Coach") {
                    // add mapped ID and description name of user types
                    updatedUserTypeList.push({key: userType.id, value: userType.Type})
                }
            });
            // set user type list to the updated version
            setUserTypeList(updatedUserTypeList);
        });

        // return cleanup function
        return () => querySnapshot();
    }, []);
    // QUARY DATA: Get events for selected data types
    useEffect(() => {
        util.fetchEvents(selection, setEvents);
    }, [selection, eventUpdate]);
    
    // RENDER: Events
    const renderItem = ({ item }) => (
        // const [event, setEvent] = useState([item.Title, item.Date, item.TypeID]);
        <View style={Theme.eventContainer}>
            {eventRender.renderTitle(item, showDelete, toggleEventUpdate)}
            {eventRender.renderDate(item)}
            {eventRender.renderGroup(item, userTypeList)}
            {eventRender.renderDesc(item, showDelete)}
        </View>
    );
    //RENDER: Popup animation
    const popIn = () => {
        setPop(true);
        eventRender.popupShow(icon1, icon2)
    }
    const popOut = () => {
        setPop(false);
        eventRender.popupHide(icon1, icon2)
    }
    // RENDER: Input window
    const inputWindow = () => (
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
                <TouchableOpacity>
                    <Text> Set Date </Text>
                    {/* TODO: IMPLEMENT */}
                    {/* onPress={toggleDatePicker} */}
                </TouchableOpacity>

                {/* User Type */}
                <SelectList
                    setSelected={val => setNewEventUserType(val)}
                    search={false}
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
                <Button title="Add Event" onPress={addNewEvent} />
                <Button title="Close" onPress={() => setModalVisibility(false)} />
            </View>
        </View>
    );

    // DATABASE: Add new event
    const addNewEvent = async () => {
        try {
            // const docRef = await addDoc(collection(db, 'Events'), {
            //     Title: newEventTitle,
            //     Date: newEventDate,
            //     TypeID: newEventUserType
            //     Description: newEventDescription,
            // });
            const docRef = await addDoc(collection(db, 'Event'), {
                Title: newEventTitle,
                Date: (new  Date()),
                TypeID: newEventUserType,
                Description: newEventDescription,
                TypeID: newEventUserType
            });
            console.log('Event added with ID: ', docRef.id);
        } catch (error) {
            console.error('Error adding event: ', error);
        }
        setModalVisibility(false);
        setNewEventTitle('');
        setNewEventDate(new Date());
        setNewEventUserType('');
        setNewEventDescription('');
        toggleEventUpdate();
    };


    // MAIN
    return(
        <View style={Theme.container}>
            {/* View */}
            <View style={Theme.view}>
                {/* dropdown selection for rower types */}
                <MultipleSelectList
                    setSelected={(val) => setSelection(val)}
                    search={false}
                    data={userTypeList}
                    boxStyles={Theme.dropdownContainer}
                    save="key"
                />

                {/* Show events */}
                <FlatList contentContainerStyle={{ paddingBottom: 180 }} data={events} renderItem={renderItem} keyExtractor={(item) => item.id} />
            </View>

            {/* Component: edit buttons */}
            <View style={Theme.floatingButtonContainer}>
                {/* Button 1: Add events */}
                <Animated.View style={[Theme.circle1, { left: icon1 }]}>
                  <TouchableOpacity onPress={() => setModalVisibility(true)}>
                      <Icon name="plus" size={25} color="#FFFF" />
                  </TouchableOpacity>
                </Animated.View>
                {/* Button 2: Remove events */}
                <Animated.View style={[Theme.circle1, { left: icon2 }]}>
                    <TouchableOpacity onPress={() => toggleShowDelete()}>
                        <Icon name="trash" size={25} color="#FFFF" />
                    </TouchableOpacity>
                </Animated.View>
                {/* Button 3: Show buttons */}
                <TouchableOpacity
                    style={Theme.circle1}
                    onPress={() => {
                        pop === false ? popIn() : popOut();
                    }}
                >
                    <Icon name="pencil" size={25} color="#FFFF" />
                </TouchableOpacity>
            </View>

            {/* Component: Popup for add events */}
            <Modal visible={modalVisibility} onRequestClose={() => setModalVisibility(false)} transparent animationType="slide">
                {inputWindow()}
            </Modal>
        </View>
    );
}
