import React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Animated} from 'react-native';
import { MultipleSelectList } from 'react-native-dropdown-select-list'
import { db } from '../../config/firebase';
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";
import Theme from '../../style';
import * as eventRender from './eventRender';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function EventsCoach({ navigation }) {
    // const
    const [coachEvents, setEvents] = useState([]);
    const [selected, setSelected] = useState([]);
    const [userTypeList, setUserTypeList] = useState([]);
    const [editEvent, setEditEvent] = useState();
    const [icon1] = useState(new Animated.Value(-160));
    const [icon2] = useState(new Animated.Value(80));
    const [pop, setPop] = useState(true);

    // get dropdown options
    useEffect(() => {
        // get UserType table
        const querySnapshot = onSnapshot(collection(db, "UserType"), (snapshot) => {
            let updatedUserTypeList = [];
            // for each non-coach user type
            snapshot.docs.forEach((doc) => {
                const userType = { ...doc.data(), id: doc.id };
                if (userType.Type != "Coach") {
                    // add ID and descriptive name onto updatedUserTypeList via mapping
                    updatedUserTypeList.push({key: userType.id, value: userType.Type});
                }
            });
            // set the user type list to the updated version
            setUserTypeList(updatedUserTypeList);
        });

        // return cleanup function
        return () => querySnapshot();
    }, []);

    // fetch events for selected age group
    useEffect(() => {
      let eventList = [];
      console.log(selected.length);
      if(selected.length <= 0) {
        setEvents(eventList);
      } else {
        // for each selected age group from the dropdown
        selected.forEach(ageGroup => {
            // query events for certain age group
            const q = query(collection(db, "Event"),
                where("TypeID", "==", ageGroup),
                orderBy("Date", "desc") // order by latest event for at the top
            );
            // add queried events onto eventList
            const querySnapshot = onSnapshot(q, (snapshot) => {
                snapshot.docs.map((doc) => eventList.push({ ...doc.data(), id: doc.id }));
                // sort newly added events by date
                eventList.sort((a, b) => b.Date - a.Date);
                // re-set events array to include new events
                setEvents(eventList);
            });
        })
      }
    }, [selected]);

    // show each event item will be rendered
    const renderItem = ({ item }) => (
        <View style={Theme.eventContainer}>
            <View style={{flex: 1, flexDirection: 'row'}}>
                {eventRender.renderTitle(item, editEvent)}
                {eventRender.renderEdit(item, editEvent, setEditEvent)}
            </View>
            <Text style={Theme.body}>
                {dateFormat(item.Date)}
            </Text>
            {eventRender.renderGroup(item, editEvent, userTypeList)}
            {eventRender.renderDesc(item, editEvent)}
        </View>
    );

    // get date in format
    function dateFormat(date) {
        return new Date(date.seconds * 1000).toLocaleString();
    }

  // handle button animation
  const popIn = () => {
    setPop(true);
    Animated.timing(icon1, {
      toValue: -160,
      duration: 500,
      useNativeDriver: false,
    }).start();
    Animated.timing(icon2, {
      toValue: 80,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }

  const popOut = () => {
    setPop(false);
    Animated.timing(icon1, {
      toValue: -90,
      duration: 500,
      useNativeDriver: false,
    }).start();
    Animated.timing(icon2, {
      toValue: -60,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }

    // main
  return (
    <View style={Theme.container}>
      <View style={Theme.contentContainer}>
        {/* dropdown selection for different rower types */}
        <MultipleSelectList
          setSelected={(val) => setSelected(val)}
          search={false}
          data={userTypeList}
          boxStyles={Theme.dropdownContainer}
          save="key"
        />
        {/* show events */}
        <FlatList data={coachEvents} renderItem={renderItem} keyExtractor={(item) => item.id} />
      </View>
      <View style={Theme.floatingButtonContainer}>
        <Animated.View style={[Theme.circle1, { bottom: icon1 }]}>
          <TouchableOpacity>
            <Icon name="plus" size={25} color="#FFFF" />
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={[Theme.circle1, { top: icon2 }]}>
          <TouchableOpacity>
            <Icon name="trash" size={25} color="#FFFF" />
          </TouchableOpacity>
        </Animated.View>
        <TouchableOpacity
          style={Theme.circle1}
          onPress={() => {
            pop === false ? popIn() : popOut();
          }}
        >
          <Icon name="pencil" size={25} color="#FFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
