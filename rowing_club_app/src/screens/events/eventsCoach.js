import React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, FlatList, Modal, TouchableOpacity, TextInput, Button, Pressable, Platform} from 'react-native';
import { MultipleSelectList, SelectList } from 'react-native-dropdown-select-list'
import { DatePicker } from 'react-native-date-picker';
import { db } from '../../config/firebase';
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";
import Theme from '../../style';
import * as eventRender from './eventRender';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function EventsCoach({ navigation }) {
    // const
    const [coachEvents, setEvents] = useState([]);
    const [selected, setSelected] = useState([]);
    const [userTypeList, setUserTypeList] = useState([]);
    const [editEvent, setEditEvent] = useState();
    // modal states
    const [isModalVisible, setModalVisible] = useState(false);
    const [newEventTitle, setNewEventTitle] = useState('');
    const [newEventDate, setNewEventDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [newEventUserType, setNewEventUserType] = useState('');
    const [newEventDescription, setNewEventDescription] = useState('');
    // state functions
    const openModal = () => setModalVisible(true);
    const closeModal = () => setModalVisible(false);
    const toggleDatePicker = () => setShowDatePicker(!showDatePicker);
    // const changeDate = (propDate) => setNewEventDate(propDate);
    
    // const [title, setTitle] = useState(""); //for add event function
    // const [description, setDescription] = useState(""); //for add event function

    // get dropdown options
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

    // update selected user types onto userTypeList
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

    // show each event item will be rendered
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
            {eventRender.renderDesc(item, editEvent)}
        </View>
    );
    

    // get date in format
    function dateFormat(date) {
        return new Date(date.seconds * 1000).toLocaleString();
    }

    // tried implementing add event feature
    const addEvents = async () => {
//      try {
//        await db.collection("Event").add({
//          Title: title,
//          Description: description,
//        });
//
//        setTitle("");
//        setDescription("");
//
//      } catch (error) {
//        console.error("Error adding event: ", error);
//      }
    };

    // display add event popup
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
                {/* <TextInput
                  placeholder="Date"
                  placeholderTextColor="grey"
                  value={dateFormat(newEventDate)}
                  editable={false}
                /> */}
              </TouchableOpacity>
              {/* <Modal
                animationType="slide"
                transparent={true}
                visible={datePicker}
              >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                  <View style={{ backgroundColor: 'maroon', padding: 20, borderRadius: 10, width: '80%' }}>
                    <DatePicker
                      mode="calendar"
                      selected={newEventDate}
                      onDateChange={changeDate}
                    />
                    <TouchableOpacity onPress={toggleDatePicker}>
                      <Text style={{color: 'white'}}> Close </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal> */}
              {/* <DatePicker
                modal
                open={showDatePicker}
                date={newEventDate}
                onConfirm={(date) => {
                  setShowDatePicker(false)
                  setNewEventDate(date)
                }}
                onCancel={() => {
                  setShowDatePicker(false)
                }}
              /> */}



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
      <View style={Theme.floatingButtonContainer}>
          <TouchableOpacity style={Theme.circle1} onPress={openModal}>
            <Icon name="plus" size={25} color="#FFFF" />
          </TouchableOpacity>
      </View>
      <Modal visible={isModalVisible} onRequestClose={closeModal} transparent animationType="slide">
        {renderAddPopup()}
      </Modal>
    </View>
  );
}
