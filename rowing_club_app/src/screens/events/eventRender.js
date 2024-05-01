import React from 'react';
import { Text, View, TouchableOpacity, Animated } from 'react-native';
import Theme from '../../style';
import * as util from './eventsUtil';
import { AntDesign } from '@expo/vector-icons'; // Import AntDesign for icons


// RENDER EVENT FLATLIST
// Render function for event title
export function renderTitle(item, showDelete, toggleEventUpdate) {
    return (
        <View>
            <Text style={[Theme.h2, {flex: 10}]}>
                { item.Title }
            </Text>
            {showDelete && (
                <TouchableOpacity onPress={() => util.confirmDeletion(item.id, toggleEventUpdate)} style={Theme.floatingCross}>
                    <AntDesign name="closecircle" size={24} color="#f52d56" />
                </TouchableOpacity>
            )}
        </View>
    )
}
// Render function for event date
export function renderDate(item) {
    return (
        <Text style={Theme.body}>
            {dateFormat(item.Date)}
        </Text>
    )
}
// get date in format
function dateFormat(date) {
    return new Date(date.seconds * 1000).toLocaleString();
}
// Render function for event event age group
export function renderGroup(item, userTypeList) {
    // function to get user type string name using TypeID of events
    function getTypeName(typeID) {
        // find the user type that equals to the typeID
        const user = userTypeList.find(user => user.key === typeID);
        if (user) {
            // returning the string literal name of user type
            return user.value;
        }
        // if user cannot be found
        console.error("Queried user type does not exist");
    }
    return (
        <Text style={Theme.body}>
            {"Group: "}
            {getTypeName(item.TypeID)}
        </Text>
    )
}
// Render function for event description
export function renderDesc(item, showDelete) {
    return (
        <Text style={Theme.body}>
            {"\n"}
            {item.Description}
        </Text>
    )
}

// Handling button animation
export const popupShow = (icon1, icon2) => {
    Animated.timing(icon1, {
        toValue: 80,
        duration: 250,
        useNativeDriver: false,
    }).start();
    Animated.timing(icon2, {
        toValue: -80,
        duration: 250,
        useNativeDriver: false,
    }).start();
}
export const popupHide = (icon1, icon2) => {
    Animated.timing(icon1, {
        toValue: 160,
        duration: 250,
        useNativeDriver: false,
    }).start();
    Animated.timing(icon2, {
        toValue: 80,
        duration: 200,
        useNativeDriver: false,
    }).start();
}

// Render function for add event input
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
            <Button title="Add Event" onPress={addEvents} />
            <Button title="Close" onPress={closeModal} />
        </View>
    </View>
);