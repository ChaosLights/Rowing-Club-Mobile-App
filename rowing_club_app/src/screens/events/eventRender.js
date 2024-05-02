import React from 'react';
import { Text, View, TouchableOpacity, Animated } from 'react-native';
import Theme from '../../style';
import * as util from './eventsUtil';
import { AntDesign } from '@expo/vector-icons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';

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
            {util.timestampToString(item.Date)}
        </Text>
    )
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

// RENDER EDIT BUTTONS
// render add event button
export function plusButton(icon, selected, setModalVisibility) {
    if(selected) {
        return (
            <Animated.View style={[Theme.circleFill, { left: icon }]}>
                <TouchableOpacity onPress={() => setModalVisibility(true)}>
                    <Ionicons name="duplicate" size={25} color="#FFFF"/>
                </TouchableOpacity>
            </Animated.View>
        )
    } else {
        return (
            <Animated.View style={[Theme.circle, { left: icon }]}>
                <TouchableOpacity onPress={() => setModalVisibility(true)}>
                    <Ionicons name="duplicate-outline" size={25} color="#FFFF"/>
                </TouchableOpacity>
            </Animated.View>
        )
    }
}// render add delete button
export function deleteButton(icon, selected, toggleShowDelete) {
    if(selected) {
        return (
            <Animated.View style={[Theme.circleFill, { left: icon }]}>
                    <TouchableOpacity onPress={() => toggleShowDelete()}>
                        <Ionicons name="trash" size={25} color="#FFFF" />
                    </TouchableOpacity>
                </Animated.View>
        )
    } else {
        return (
            <Animated.View style={[Theme.circleFill, { left: icon }]}>
                <TouchableOpacity onPress={() => toggleShowDelete()}>
                    <Ionicons name="trash-outline" size={25} color="#FFFF" />
                </TouchableOpacity>
            </Animated.View>
        )
    }
}
// Handling buttons animation
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