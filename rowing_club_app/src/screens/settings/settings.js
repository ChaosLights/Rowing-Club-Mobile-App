import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import SettingsCoach from './settingsCoach';
import SettingsRower from './settingsRower';
import { db } from '../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function SettingsScreen({ route, navigation }) {
    const [userType, setUserType] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const defaultUserId = 'FWBWX7EOw75rwE20cQD2';
    const userId = route?.params?.userId || defaultUserId;

    useEffect(() => {
        const fetchUserType = async () => {
            try {
                // Fetch the user document from Firestore using the userId
                const userDocRef = doc(db, 'User', userId);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    // Get the TypeID from the user document
                    const typeID = userDocSnap.data().TypeID;

                    // Fetch the corresponding user type from the UserType collection
                    const userTypeDocRef = doc(db, 'UserType', typeID);
                    const userTypeDocSnap = await getDoc(userTypeDocRef);

                    if (userTypeDocSnap.exists()) {
                        // Set the user type based on the document
                        setUserType(userTypeDocSnap.data().Type);
                    }
                }
            } catch (error) {
                console.error("Error fetching user type: ", error);
                // Handle any errors, such as showing an alert or setting an error state
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserType();
    }, [userId]);

    if (isLoading) {
        return <ActivityIndicator size="large" />;
    }

    // Conditional rendering based on the userType
    if (userType === "Coach") {
        return <SettingsCoach navigation={navigation} />;
    } else {
        // If the userType is anything other than "Coach", render SettingsRower
        return <SettingsRower navigation={navigation} />;
    }
}
