import React from 'react';
import {View, Text} from 'react-native';
import Theme from '../style';

export default function HomeScreen({navigation}) {
    return (
        <View style={Theme.view}>
            <Text style={Theme.title}>Home Page Implementation...</Text>
            <Text style={Theme.h4}>(ziad + izzy)</Text>
        </View>
    )
}