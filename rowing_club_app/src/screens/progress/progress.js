import React from 'react';
import { useState, useEffect, useContext } from 'react';
import {View, Text, Button, TouchableOpacity} from 'react-native';
import Theme from '../../style';
import * as progresRender from './progressRender'
import { AuthContext } from '../../contexts/authContext';

//const: screen names
const addTrainingName = 'AddTraining';

export default function ProgressScreen({navigation}) {
    const { isCoach } = useContext(AuthContext);
    const [button, setButton] = useState("");
    useEffect(() => {
        if(isCoach){
            setButton("Record Image Data");
        }else{
            setButton("Add New Training Record");
        }
    }, [isCoach]);

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
            {isCoach ? progresRender.renderCoach() : progresRender.renderRower()}
        </View>
    )
}