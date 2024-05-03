// Importing necessary functions and data from Firebase and React
import React, { createContext, useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

// Creating a React context with default values
export const AuthContext = createContext({
  userUID: null,      // This will hold the UID of the logged-in user
  setUserUID: () => {}, // Function to update the userUID
  isCoach: false,     // Boolean flag to indicate if the user is a coach
  setIsCoach: () => {} // Function to update the isCoach flag
});

// Component provides the auth context values to its children
export const AuthProvider = ({ children }) => {
  const [userUID, setUserUID] = useState(null); // State to hold user's UID
  const [isCoach, setIsCoach] = useState(false); // State to indicate if the user is a coach

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
          const userDoc = querySnapshot.docs[0];
          const typeID = userDoc.data().TypeID;

          // Fetch the document from 'UserType' collection that matches the typeID
          const userTypeDocRef = doc(db, 'UserType', typeID);
          const userTypeDocSnap = await getDoc(userTypeDocRef);

          // Set isCoach to true if the type is "Coach", otherwise false
          if (userTypeDocSnap.exists() && userTypeDocSnap.data().Type === "Coach") {
            setIsCoach(true);
          } else {
            setIsCoach(false);
          }
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
    <AuthContext.Provider value={{ userUID, setUserUID, isCoach, setIsCoach }}>
      {children}
    </AuthContext.Provider>
  );
};
