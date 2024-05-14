import React from 'react';
import { useState, useEffect } from 'react';
import { Text, View, FlatList } from 'react-native';
import { db } from '../../config/firebase';
import { collection, onSnapshot } from "firebase/firestore";
import Theme from '../../style';

export default function ShowUsers() {
    // const
    const [userTypes, setUserTypes] = useState([]);
    const [users, setUsers] = useState([]);
    const [userData, setUserData] = useState([]);

    // QUARY DATA: Get user types for dropdown options
    useEffect(() => {
        let updatedUserTypeList = [];
        // get `UserType` documents
        const querySnapshot = onSnapshot(collection(db, "UserType"), (snapshot) => {
            // for each non-coach user type
            snapshot.docs.forEach((doc) => {
                // add mapped ID and description name of user types
                updatedUserTypeList.push({key: doc.id, value: doc.data().Type})
            });
            // set user type list to the updated version
            setUserTypes(updatedUserTypeList);
        });

        // return cleanup function
        return () => querySnapshot();
    }, []);

    // get rower names
    useEffect(() => {
        try {
            let userNames = [];
            const querySnapshot = onSnapshot(collection(db, "User"), (snapshot) => {
                snapshot.docs.forEach((doc) => {
                    // get user id
                    const userID = doc.id;
                    // get user type id
                    const userTypeID = doc.data().TypeID;
                    // get fullname
                    const userName = (doc.data().Firstname +" "+ doc.data().Surname);
                    // get user UID
                    const userUID = doc.data().UserUID;

                    // add mapped ID and name
                    userNames.push({key: userID, name: userName, typeID: userTypeID, Uid: userUID})
                });
                // set user type list to the updated version
                setUsers(userNames);
            });

            // return cleanup function
            return () => querySnapshot();
        } catch (error) {
            console.log("Error fetching data:" + error);
        }
    }, []);

    // function toget user type names
    function getUserType(typeData) {
        // const type = typeData.value;
        if (typeData) {
            return typeData.value;
        }
        // if name cannot be found
        return null;
    }

    // retrieve user data
    useEffect(() => {
        const items = [];
        for(let user of users){
            const type = userTypes.find(data => data.key === user.typeID);
            typeName = getUserType(type);
            items.push({key: user.key, name: user.name, type: typeName, Uid: user.Uid});
        }
        setUserData(items);
    }, [users, userTypes]);

    // RENDER: Users
    const renderItem = ({ item }) => (
        // const [event, setEvent] = useState([item.Title, item.Date, item.TypeID]);
        <View style={Theme.eventContainer}>
            <Text style={[Theme.h2, {flex: 10}]}>
                { item.name }
            </Text>
            <Text style={Theme.body}>
                {"User Type: "}
                { item.type }
            </Text>
            <Text style={Theme.body}>
                {"Firebase ID: "}
                { item.key }
            </Text>
            <Text style={Theme.body}>
                {"UID: "}
                { item.Uid }
            </Text>
        </View>
    );
    
    return (
        <View style={Theme.view}>
            {/* Show events */}
            <FlatList data={userData} renderItem={renderItem} keyExtractor={(item) => item.key} />
        </View>
    );
}