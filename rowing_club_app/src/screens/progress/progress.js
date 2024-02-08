import React from 'react';
import {View, Text, Button} from 'react-native';
import Theme from '../../style';
//screens
import AddTrainingScreen from './addTraining';

//const: screen names
const addTrainingName = 'AddTraining';

export default function ProgressScreen({navigation}) {
    return (
        <View style={Theme.view}>
            <Text style={Theme.title}>
                Progress Page
            </Text>
            <Text style={Theme.body}>
                {"\n"}{"\n"}
                (Don't need to implement this page yet. Just implement addTraining.js. 
                This page is just to nagivate to the add training page)
            </Text>
            <Button
                title="Add New Training Record"
                onPress={() => navigation.navigate('AddTraining')}
            />
        </View>
    )
}