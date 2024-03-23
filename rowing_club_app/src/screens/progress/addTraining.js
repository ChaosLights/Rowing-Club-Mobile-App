import React, { useState, useEffect } from 'react';
import ImageScreenRower from './addTrainingRower';
import ImageScreenCoach from './addTrainingCoach';

export default function ImageScreen() {
    const [content, setContent] = useState();
    const refreshContent = async(id) => {
        if(id === "YDYsOFRCBMqhFpDn1buu1"){
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