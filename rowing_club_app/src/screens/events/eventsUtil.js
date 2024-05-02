import { db } from '../../config/firebase';
import { collection, deleteDoc, doc, query, where, getDocs, Timestamp } from "firebase/firestore";
import { Alert } from 'react-native';

// Fetch Events
export const fetchEvents = async (selection, setEvents) => {
    // check selection is not empty
    if(selection.Length <= 0) {
        // set events list to empty
        setEvents([])
        return;
    }
    let eventList = [];

    for (const ageGroup of selection) {
        // get `Event` documents for select age group
        const q = query(collection(db, "Event"), where("TypeID", "==", ageGroup));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            eventList.push({ ...doc.data(), id: doc.id });
        });
    }
    // Order events by date
    eventList = [...eventList].sort((a, b) => b.Date.seconds - a.Date.seconds)
    // update events list
    setEvents(eventList);
}

// DELETING EVENT
// Button 2 function: Confirmation for event delete
export const confirmDeletion = (eventID, toggleeventUpdate) => {
    Alert.alert(
        'Confirm Deletion',
        'Are you sure you want to delete this notification?',
        [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', onPress: () => deleteEvent(eventID, toggleeventUpdate) },
        ],
        { cancelable: true }
    );
};
// Delete events
export const deleteEvent = async (eventID, toggleeventUpdate) => {
    try {
        await deleteDoc(doc(db, 'Event', eventID));
        toggleeventUpdate();
    } catch (error) {
        console.error('Error deleting event: ', error);
    }
}

// CHECKS FOR EVENT INPUTS
// Check for empty fields
export function checkEmpty(title, user, date, descr) {
    if((title == "") || (user == "") || (date == "") || (descr == "")) {
        Alert.alert(
            'Empty Fields',
            'Please fill in the required fields to add an event.',
            [
            {text: 'OK'},
            ]
        );
        return true
    }
    return false
}
// Check for correct time format
export function checkDateFormat(stringDate) {
    if (!checkStringDate(stringDate)) {
        Alert.alert(
            'Invalid time/date',
            'Please ensure the time and date entered are in the correct format.',
            [
            {text: 'OK'},
            ]
        );
        return false
    }
    return true
}

// DATE FORMATING
// Get date to string from firebase
export function timestampToString(date) {
    return new Date(date.seconds * 1000).toLocaleString();
}
// Check if string date is in the correct
export function checkStringDate(stringDate) {
    // check format
    const format = /^\d{2}:\d{2},\s\d{2}\/\d{2}\/\d{4}$/;
    if (!format.test(stringDate)) {
        return false
    }
    // check date validity
    const [time, dateStr] = stringDate.split(',').map(str => str.trim());
    const [hours, minutes] = time.split(':').map(Number);
    const [day, month, year] = dateStr.split('/').map(Number);
    // check time
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        return false;
    }
    // check day
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day < 1 || day > daysInMonth) {
        return false;
    }
    // check month
    if (month < 1 || month > 12) {
        return false;
    }
    // check year
    if (year < 1000 || year > 9999) {
        return false;
    }

    return true
}
// Get date from string to firebase
export const stringToTimestamp = (dateTimeStr) => {
    // split date and time
    const [time, dateStr] = dateTimeStr.split(',').map(str => str.trim());

    // get time components
    const [hours, minutes] = time.split(':').map(Number);
    // get date components
    const [day, month, year] = dateStr.split('/').map(Number);

    // create new Date object
    const date = new Date(year, month - 1, day, hours, minutes);
    // Convert Date object to Firebase timestamp
    const timestamp = Timestamp.fromDate(date);

    return timestamp;
};
