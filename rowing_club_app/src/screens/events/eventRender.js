import React from 'react';
import { Text, View, TextInput, TouchableOpacity } from 'react-native';
import Theme from '../../style';

export function renderTitle(item, editEvent) {
    if (item == editEvent) {
        return (
            <TextInput
                editable
                style={[Theme.textInput, {flex: 10, marginRight: 5}]}
                value={item.Title}
            />
        )
    }
    return (
        <Text style={[Theme.h2, {flex: 10}]}>
            { item.Title }
        </Text>
    )
}

export function renderEdit(item, editEvent, setEditEvent) {
    if (item == editEvent) {
        return (
            <TouchableOpacity style={{flex: 2}} onPress={() => setEditEvent()}>
                <Text style={{fontSize: 15 }}>Done</Text>
            </TouchableOpacity>
        )
    }
    return (
        <TouchableOpacity style={{flex: 1}} onPress={() => setEditEvent(item)}>
            <Text style={{fontSize: 15 }}>Edit</Text>
        </TouchableOpacity>
    )
}

export function renderGroup(item, editEvent, userTypeList) {
    // get the type string name using TypeID of events
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

    if (item == editEvent) {
        return (
            <TextInput
            style={[Theme.textInput, {flex: 10, marginRight: 5}]}
            value={"Group: " + getTypeName(item.TypeID)}
        />
        )
    }
    return (
        <Text style={Theme.body}>
            {"Group: "}
            {getTypeName(item.TypeID)}
        </Text>
    )
}

export function renderDesc(item, editEvent) {
    if (item == editEvent) {
        return (
            <View>
                <Text style={Theme.body}>
                    {"\n"}
                </Text>
                <TextInput
                    multiline
                    style={[Theme.textInput, {flex: 10, marginRight: 5}]}
                    value={item.Description}
                />
            </View>
        )
    }
    return (
        <Text style={Theme.body}>
            {"\n"}
            {item.Description}
        </Text>
    )
}