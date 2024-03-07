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
    optionBarButton: {
        marginRight: 50,
        marginLeft: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'maroon',
        borderRadius: 40,
        marginTop: 10,
        marginBottom: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        width: '60%',
        alignSelf: 'center',
    },
    optionText: {
        fontSize: 16,
        lineHeight: 21,
        letterSpacing: 0.25,
        fontWeight: 'bold',
        color: 'white',
    },
    circle: {
     backgroundColor: '#f52d56',
     width: 60,
     height: 60,
     position: 'absolute',
     bottom: 40,
     right: 40,
     borderRadius: 50,
     justifyContent: 'center',
     alignItems: 'center',
    },
    dropdownContainer: {
        width: '90%',
        alignSelf: 'center',
        marginTop: 15,
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
        alignItems: 'center',
        justifyContent: 'center',
    },
    container1: {
    //add here!!
    },
    modalCentered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    view: {
        padding: 10,
    },
    textInput: {
        fontSize: 15,
        borderWidth: 1,
    }
});

export default Theme;