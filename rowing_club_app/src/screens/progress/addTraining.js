import React from 'react';
import ImageScreenRower from './addTrainingRower';
import ImageScreenCoach from './addTrainingCoach';

export default function ImageScreen() {
    let userType = 'Coach'
    if(userType == 'Rower'){
        return <ImageScreenRower/>
    }else{
        return <ImageScreenCoach/>
    }
}