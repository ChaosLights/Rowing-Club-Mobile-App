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
    navButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: 'maroon',
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
        elevation: 2, // Android
    },
    navButtonFont: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
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
    TimeContainer: {
        backgroundColor: '#F0F0F0',
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

    //Home edit
    V1: {
        padding: 10,
        backgroundColor: 'white',
    },
    Hc: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Centers items evenly
    },
    coachContainer: {
        flexDirection: 'column', // Set to column to align vertically
        alignItems: 'Right', // Center the text
    },
    headerContainer: {
        flexDirection: 'row', // Align horizontally
        justifyContent: 'space-between', // Space evenly
        alignItems: 'center', // Center vertically
    },
    buttonContainer: {
        flex: 1, // Allows button to fill available space
        alignItems: 'Center', // Centers items horizontally
        justifyContent: 'center',
    },
    addButtonContainer: {
        alignItems: 'center', // Center the 'Add +' button
    },
    buttonText: {
        color: 'black',
        justifyContent: 'center',
        textAlign: 'center',
        fontSize: 16,
    },
    notificationHeader: {
        flexDirection: 'row', // Aligns the text and button horizontally
        justifyContent: 'space-between', // Spaces the elements evenly
        alignItems: 'center', // Centers them vertically
    },
    deleteButton: {
        position: 'absolute',
        right: 0,
    },
    editCircle: {
        backgroundColor: 'maroon',
        padding: 10,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: 0,
    },
    addCircle: {
        backgroundColor: 'maroon',
        padding: 10,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },

    //events page starts
    eventContainer: {
        backgroundColor: '#D9D6D2',
        borderRadius: 10,
        padding: 20,
        margin: 10,
        marginBottom: 5,
        width: '100%',
        alignSelf: 'center',
    },
    optionBarButton: {
        marginRight: 50,
        marginLeft: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'maroon',
        borderRadius: 40,
        margin: 10,
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
        width: '100%',
        alignSelf: 'center',
        marginTop: 15,
    },
    textInput: {
        fontSize: 15,
        borderWidth: 1,
    },
    TextInputMask: {
        fontSize: 15,
        borderWidth: 1,
        padding: 6,
        borderRadius: 5,
        marginBottom: 10,
    },
    dateButton: {
        paddingVertical: 5,
        backgroundColor: 'maroon',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    dateButtonFont: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
    },
    dateButtonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 10,
    },
    floatingCross: {
        position: 'absolute',
        right: 0,
    },
    //floating button starts
    floatingButtonContainer: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    circleFill: {
        backgroundColor: 'maroon',
        width: 60,
        height: 60,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 20,
    },
    circle: {
        backgroundColor: 'maroon',
        width: 60,
        height: 60,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 20,
    },
    //floating button ends
    //events page ends
});

export default Theme;