import React from 'react';
import Theme from '../../style';
import { db } from '../../config/firebase';
import { collection, onSnapshot, addDoc, deleteDoc, doc, query, where, getDocs } from "firebase/firestore";

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



// Button 2 Function: Delete events
export const deleteEvent = async (eventID, toggleeventUpdate) => {
    try {
        await deleteDoc(doc(db, 'Event', eventID));
        toggleeventUpdate();
    } catch (error) {
        console.error('Error deleting event: ', error);
    }
}