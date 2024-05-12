// Importing necessary functions and data from Firebase and React
import React, { createContext, useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

// Creating a React context with default values
export const AuthContext = createContext({
    // User ID for Authentication
    userUID: null,
    setUserUID: () => {},
    // Boolean to indicate if user is coach
    isCoach: false,
    setIsCoach: () => {},
    // User document ID for data querying
    userID: null,
    setUserID: () => {},
});

// Component provides the auth context values to its children
export const AuthProvider = ({ children }) => {
    // const
    const [userUID, setUserUID] = useState(null); // State to hold user's UID
    const [isCoach, setIsCoach] = useState(false); // State to indicate if the user is a coach
    const [userID, setUserID] = useState(null); // State to hold user's ID
    const [typeID, setTypeID] = useState(null); //State holds user's TypeID

    useEffect(() => {
        const fetchUserType = async () => {
            if (!userUID) return; // Exits the function early if userUID isn't set

            try {
                // Query the 'User' collection to find a document where UserUID matches the logged-in user's UID
                const usersRef = collection(db, 'User');
                const q = query(usersRef, where("UserUID", "==", userUID));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    // Assuming the userUID is unique, take the first document found
                    const doc = querySnapshot.docs[0];
                    const typeID = doc.data().TypeID;

                    // Set isCoach
                    if (typeID == "YDYsOFRCBMqhFpDn1buu") {
                        setIsCoach(true);
                    } else {
                        setIsCoach(false);
                    }
                    //set TypeID
                    setTypeID(typeID);

                    // Set userID
                    setUserID(doc.id);
                }
            } catch (error) {
                console.error("Error fetching user type:", error);
                setIsCoach(false);
            }
        };

        fetchUserType();
    }, [userUID]); // This runs whenever userUID changes

    // Provides the userUID, setUserUID, isCoach, and setIsCoach to any children
    return (
        <AuthContext.Provider value={{ userUID, setUserUID, isCoach, setIsCoach, userID, setUserID, typeID, setTypeID }}>
            {children}
        </AuthContext.Provider>
      );
};
