import React, { useState, useEffect, useContext } from 'react';
import ImageScreenRower from './addTrainingRower';
import ImageScreenCoach from './addTrainingCoach';
import { AuthContext } from '../../contexts/authContext';

export default function ImageScreen() {
    const [content, setContent] = useState();
    const {isCoach} = useContext(AuthContext);
    const refreshContent = async(id) => {
        if(isCoach){
            setContent(<ImageScreenCoach/>);
        }else{
            setContent(<ImageScreenRower/>);
        }
    }
    useEffect(() => {
        refreshContent(global.userTypeID);
    }, [global.userTypeID]);

    return content;
}