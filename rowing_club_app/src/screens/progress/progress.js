import React from 'react';
import {View, Text, Button, TouchableOpacity} from 'react-native';
import Theme from '../../style';

//const: screen names
const addTrainingName = 'AddTraining';

export default function ProgressScreen({navigation}) {
    return (
        <View style={Theme.view}>
            <Text style={Theme.title}>
                Progress Page
            </Text>

            <Text style={Theme.body}>
                {"\n"}
                Training data presentation feature to be implemented in future updates.
            </Text>


            {/* To change password */}
            <TouchableOpacity style={[Theme.navButton, {marginTop: 10}]} onPress={() => navigation.navigate(addTrainingName)}>
            <Text style={Theme.navButtonFont}>Add New Training Record</Text>
            </TouchableOpacity>
            
        </View>
    )
}