import {StyleSheet} from 'react-native';

const Theme = StyleSheet.create({
    title: {
        fontSize: 26,
        fontWeight: 'bold',
    },
    eventContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: 10,
        padding: 20,
        margin: 10,
        marginBottom: 5,
        width: '95%',
        alignSelf: 'center',
    },
    maroonOvalButton: {
        backgroundColor: 'maroon',
        borderRadius: 20, // roundness
        paddingVertical: 10,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    underline: {
        borderBottomWidth: 1,
        borderBottomColor: 'black',
    },
    optionBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center', 
        marginTop: 10,
        backgroundColor: 'maroon',
        borderRadius: 40,
        paddingVertical: 10,
        paddingHorizontal: 20,
        width: '80%',
        alignSelf: 'center',
    },
    optionBarButton: {
        marginRight: 50,
        marginLeft: 50,
    },
    optionText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
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