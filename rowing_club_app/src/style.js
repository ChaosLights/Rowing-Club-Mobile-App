import {StyleSheet} from 'react-native';

const Theme = StyleSheet.create({
    title: {
        fontSize: 26,
        fontWeight: 'bold',
    },
    h1: { 
        fontSize: 20,
        fontWeight: 'bold',
    },
    h2: { 
        fontSize: 15,
        fontWeight: 'bold',
    },
    body: {
        fontSize: 15,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    view: {
        padding: 10,
    },
});

export default Theme;