import {StyleSheet} from 'react-native';

const Theme = StyleSheet.create({
    title: {
        fontSize: 26,
        fontWeight: 'bold',
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
    GreyOvalButton: {
        backgroundColor: 'grey',
        borderRadius: 20, // roundness
        paddingVertical: 10,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    RedButton: {
        backgroundColor: 'red',
        borderRadius: 8,
        paddingHorizontal: 10, // Adjust padding horizontally
        paddingVertical: 5, // Adjust padding vertically
        alignSelf: 'center',
    },
    GreenButton: {
        backgroundColor: 'green',
        borderRadius: 8,
        paddingHorizontal: 10, // Adjust padding horizontally
        paddingVertical: 5, // Adjust padding vertically
        alignSelf: 'center',
    },
    underline: {
        borderBottomWidth: 1,
        borderBottomColor: 'black',
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
    modalCentered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    view: {
        padding: 10,
    },
    //events page
    eventContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: 10,
        padding: 20,
        margin: 10,
        marginBottom: 5,
        width: '95%',
        alignSelf: 'center',
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
    container: {
        flex: 1,
        position: 'relative',
    },
    dropdownContainer: {
        width: '90%',
        alignSelf: 'center',
        marginTop: 15,
    },
    textInput: {
        fontSize: 15,
        borderWidth: 1,
    },
    //floating button starts
    floatingButtonContainer: {
        position: 'absolute',
        bottom: 20,
        right: 20,
    },
    circle1: {
        backgroundColor: 'maroon',
        width: 60,
        height: 60,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    //floating button ends
    //events page ends

    // Progres page

    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: '#800000',
    },
    tabText: {
        color: 'black',
    },
    contentContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    entryContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    }
});

export default Theme;