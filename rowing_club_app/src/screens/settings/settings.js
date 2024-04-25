import React, { useState, useEffect } from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';
import SettingsCoach from './settingsCoach';
import SettingsRower from './settingsRower';
import { db } from '../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { userId } from './login';
import Theme from '../../style';

//const: screen names
const passChangeName = 'passChange';

export default function SettingsScreen({navigation}) {
    return (
        <View style={Theme.view}>
            <TouchableOpacity style={[Theme.settingButton, {marginTop: 10}]} onPress={() => navigation.navigate(passChangeName)}>
            <Text style={Theme.settingButtonFont}>Change Password</Text>
            </TouchableOpacity>
        </View>
    )
}
