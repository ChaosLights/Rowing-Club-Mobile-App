import React from 'react';
import { useState, useEffect } from 'react';
import {View, Text, Button, TouchableOpacity} from 'react-native';
import Theme from '../../style';
import * as progresRender from './progressRender'

//const: screen names
const addTrainingName = 'AddTraining';

export default function ProgressScreen({navigation}) {
    const [button, setButton] = useState("");
    useEffect(() => {
        if(global.userTypeID === "YDYsOFRCBMqhFpDn1buu"){
            setButton("Record Image Data");
        }else{
            setButton("Add New Training Record");
        }
    }, [global.userTypeID]);

    return (
        <View style={Theme.view}>
            <Text style={Theme.title}>
                Progress Page
            </Text>
            
            {/* To add training image or record data */}
            <TouchableOpacity style={[Theme.navButton, {marginTop: 10}]} onPress={() => navigation.navigate(addTrainingName)}>
                <Text style={Theme.navButtonFont}>{button}</Text>
            </TouchableOpacity>

            {/* Show Progress Data */}
            {progresRender.renderData()}
        </View>
    )
}

// function getTraining() {
//     if(global.userTypeID == YDYsOFRCBMqhFpDn1buu) {
//         return
//     }
//     return (progresRender.renderData())
// }