import React from 'react';
import {View, Text} from 'react-native';
import Theme from '../../style';

export default function AddTrainingScreen({navigation}) {
    return (
        <View style={Theme.view}>
            <Text style={Theme.title}>Add Training Page Implementation...</Text>
            <Text style={Theme.body}>
                {"\n"}{"\n"}
                (Swipe to the right to return back to progress page.)
            </Text>
        </View>
    )
}