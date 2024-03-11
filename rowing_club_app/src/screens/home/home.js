import React from 'react';
import { View, Text } from 'react-native';
import HomeRower from './homeRower';
import HomeCoach from './homeCoach';

export default function EventsScreen({ navigation }) {
    // const
    const [content, setContent] = useState();

    // check if user is coach or rower
    useEffect(() => {
        if (global.userTypeID === "YDYsOFRCBMqhFpDn1buu") {
            // set returning content to coach screen
            setContent(<HomeCoach />);
        } else {
            // set returning content to rower screen
            setContent(<HomeRower />);
        }
    }, [global.userTypeID]);

    return content;
}
