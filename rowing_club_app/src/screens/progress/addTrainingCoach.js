import React, { useState, useEffect} from 'react';
import { Image, Button, TextInput, SafeAreaView, View, ScrollView, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { storage } from '../../config/firebase';
import { ref, listAll, getDownloadURL, deleteObject, getMetadata } from 'firebase/storage'
import RNPickerSelect from 'react-native-picker-select';
import Toast from 'react-native-root-toast';
import { db } from '../../config/firebase';
import { collection, addDoc } from 'firebase/firestore';

let currentImage = null;

export default function ImageScreenCoach() {
    const [refresh, setRefresh] = useState(0);
    return (
        <ScrollView>
            <SafeAreaView>
                <View style={style.container}>
                    <DisplayImage refresh={refresh} setRefresh={setRefresh}/>
                    <RaceDataInput refresh={refresh} setRefresh={setRefresh}/>
                </View>
            </SafeAreaView>
        </ScrollView>
    )
}

function DisplayImage({ refresh, setRefresh }){
    const [imageIndex, setImageIndex] = useState(0);
    const [images, setImages] = useState([]);
 
    async function fetchImage() {
        setImages([]);
        setImageIndex(0);
        const storageRef = ref(storage, "images/");
        try {
            const userFolders = await listAll(storageRef);
            for (const userRef of userFolders.prefixes) {
                const imagesList = await listAll(userRef);
                for (const itemRef of imagesList.items) {
                    try {
                        const imgUrl = await getDownloadURL(itemRef);
                        const metaData = await getMetadata(itemRef);
                        setImages((prevImages) => [...prevImages, { url: imgUrl, user: (userRef._location.path_).slice(7), time: metaData.timeCreated, ref: itemRef._location.path_}]);
                    } catch (error) {
                        throw error;
                    }
                }
            }
        } catch (error) {
            alert('Error fetching the images:' + error);
        }
    }
    useEffect(() => {
        fetchImage();
    }, [refresh]);
    useEffect(() => {
        if(images.length != 0){
            currentImage = images[imageIndex];
        }else{
            currentImage = null;
        }
    }, [images]);

    function switchImage(index) {
        if(index >= 0 && index < images.length){
            setImageIndex(index);
            currentImage = images[index];
        }else if(index < 0){
            Toast.show('This is the first image!', {
                duration: 500,
                position: Toast.positions.CENTER,
            });
        }else{
            Toast.show('This is the last image!', {
                duration: 500,
                position: Toast.positions.CENTER,
            });
        }
    };

    return (
        <View>
            {images.length > 0 &&
            <View style={style.imageContainer}>
                <Button title="Prev" onPress={() => switchImage(imageIndex-1)} color='#800000'/>
                <Image
                    source={{ uri: images[imageIndex].url }}
                    style={{ width: 300, height: 300 }}
                />
                <Button title="Next" onPress={() => switchImage(imageIndex+1)} color='#800000'/>
            </View>
            }
        </View>
    );
}

function RaceDataInput({ refresh, setRefresh }){
    const [raceType, setRaceType] = useState('2km');
    let fourHM = '', eightHM = '', twelveHM = '', sixteenHM = '', twentyHM = '';
    let oneKM = '', twoKM = '', threeKM = '', fourKM = '', fiveKM = '';
    let distance = '';

    async function onConfirm(){
        if(raceType == '2km'){
            await addDoc(collection(db, "TrainingData"), {
                Type: raceType,
                UserId: currentImage.user,
                time: currentImage.time,
                fourHM: fourHM,
                eightHM: eightHM,
                twelveHM: twelveHM,
                sixteenHM: sixteenHM,
                twentyHM: twentyHM,
            });
        }else if(raceType == '5km'){
            await addDoc(collection(db, "TrainingData"), {
                Type: raceType,
                UserId: currentImage.user,
                time: currentImage.time,
                oneKM: oneKM,
                twoKM: twoKM,
                threeKM: threeKM,
                fourKM: fourKM,
                fiveKM: fiveKM,
            });
        }else{
            await addDoc(collection(db, "TrainingData"), {
                Type: raceType,
                UserId: currentImage.user,
                time: currentImage.time,
                distance: distance,
            });
        }
        const imgRef = ref(storage, currentImage.ref);
        await deleteObject(imgRef);
        setRefresh(refresh+1);
    }
    const submitData = () => {
        let canSubmit = false;
        if(currentImage == null){
            Toast.show('No image available!', {
                duration: 500,
                position: Toast.positions.CENTER,
            });
            return;
        }
        if(raceType == '2km'){
            if(fourHM != '' && eightHM != '' && twelveHM != '' && sixteenHM != '' && twentyHM != ''){
                if(!isNaN(+fourHM) && !isNaN(+eightHM) && !isNaN(+twelveHM) && !isNaN(+sixteenHM) && !isNaN(+twentyHM)){
                    canSubmit = true;
                }else{
                    Toast.show('Data is invalid!', {
                        duration: 500,
                        position: Toast.positions.CENTER,
                    });
                }
            }else{
                Toast.show('Please fill in all the data!', {
                    duration: 500,
                    position: Toast.positions.CENTER,
                });
            }
        }else if(raceType == '5km'){
            if(oneKM != '' && twoKM != '' && threeKM != '' && fourKM != '' && fiveKM != ''){
                if(!isNaN(+oneKM) && !isNaN(+twoKM) && !isNaN(+threeKM) && !isNaN(+fourKM) && !isNaN(+fiveKM)){
                    canSubmit = true;
                }else{
                    Toast.show('Data is invalid!', {
                        duration: 500,
                        position: Toast.positions.CENTER,
                    });
                }
            }else{
                Toast.show('Please fill in all the data!', {
                    duration: 500,
                    position: Toast.positions.CENTER,
                });
            }
        }else{
            if(distance != ''){
                if(!isNaN(+distance)){
                    canSubmit = true;
                }else{
                    Toast.show('Distance is invalid!', {
                        duration: 500,
                        position: Toast.positions.CENTER,
                    });
                }
            }else{
                Toast.show('Please fill in the distance!', {
                    duration: 500,
                    position: Toast.positions.CENTER,
                });
            }
        }
        if(canSubmit){
            Alert.alert(
                "Please Confirm",
                "Are you sure you want to submit the data?",
                [
                  {
                    text: "Cancel",
                    style: "cancel"
                  },
                  { text: "Confirm", onPress: () => {onConfirm()} }
                ],
                {
                  cancelable: true,
                }
              );
        }
    }
    const TwoKMDisplay = () => {
        return (
            <View>
                <View style={style.inputContainer}>
                    <Text style={style.inputLabel}>400m</Text>
                    <TextInput
                        style={style.inputBox}
                        placeholder="Enter time data..."
                        onEndEditing={(value) => {fourHM = value.nativeEvent.text}}
                    />
                </View>
                <View style={style.inputContainer}>
                    <Text style={style.inputLabel}>800m</Text>
                    <TextInput
                        style={style.inputBox}
                        placeholder="Enter time data..."
                        onEndEditing={(value) => {eightHM = value.nativeEvent.text}}
                    />
                </View>
                <View style={style.inputContainer}>
                    <Text style={style.inputLabel}>1200m</Text>
                    <TextInput
                        style={style.inputBox}
                        placeholder="Enter time data..."
                        onEndEditing={(value) => {twelveHM = value.nativeEvent.text}}
                    />
                </View>
                <View style={style.inputContainer}>
                    <Text style={style.inputLabel}>1600m</Text>
                    <TextInput
                        style={style.inputBox}
                        placeholder="Enter time data..."
                        onEndEditing={(value) => {sixteenHM = value.nativeEvent.text}}
                    />
                </View>
                <View style={style.inputContainer}>
                    <Text style={style.inputLabel}>2000m</Text>
                    <TextInput
                        style={style.inputBox}
                        placeholder="Enter time data..."
                        onEndEditing={(value) => {twentyHM = value.nativeEvent.text}}
                    />
                </View>
            </View>
        );
    }
    
    const FiveKMDisplay = () => {
        return (
            <View>
                <View style={style.inputContainer}>
                    <Text style={style.inputLabel}>1000m</Text>
                    <TextInput
                        style={style.inputBox}
                        placeholder="Enter time data..."
                        onEndEditing={(value) => {oneKM = value.nativeEvent.text}}
                    />
                </View>
                <View style={style.inputContainer}>
                    <Text style={style.inputLabel}>2000m</Text>
                    <TextInput
                        style={style.inputBox}
                        placeholder="Enter time data..."
                        onEndEditing={(value) => {twoKM = value.nativeEvent.text}}
                    />
                </View>
                <View style={style.inputContainer}>
                    <Text style={style.inputLabel}>3000m</Text>
                    <TextInput
                        style={style.inputBox}
                        placeholder="Enter time data..."
                        onEndEditing={(value) => {threeKM = value.nativeEvent.text}}
                    />
                </View>
                <View style={style.inputContainer}>
                    <Text style={style.inputLabel}>4000m</Text>
                    <TextInput
                        style={style.inputBox}
                        placeholder="Enter time data..."
                        onEndEditing={(value) => {fourKM = value.nativeEvent.text}}
                    />
                </View>
                <View style={style.inputContainer}>
                    <Text style={style.inputLabel}>5000m</Text>
                    <TextInput
                        style={style.inputBox}
                        placeholder="Enter time data..."
                        onEndEditing={(value) => {fiveKM = value.nativeEvent.text}}
                    />
                </View>
            </View>
        );
    };
    
    const ThirtyMinDisplay = () => {
        return (
            <View>
                <View style={style.inputContainer}>
                    <Text style={style.inputLabel}>Distance</Text>
                    <TextInput
                        style={style.inputBox}
                        placeholder="Enter distance..."
                        onEndEditing={(value) => {distance = value.nativeEvent.text}}
                    />
                </View>
            </View>
        );
    };
    return (
        <View>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <Text style={style.selectTitle}>Race Type</Text>
                <RNPickerSelect
                    placeholder={{ label: "Select a race type", value: null }}
                    onValueChange={(raceType) => setRaceType(raceType)}
                    items={[
                        { label: '2 km', value: '2km' },
                        { label: '5 km', value: '5km' },
                        { label: '30 mins', value: '30min' },
                    ]}
                    value={raceType}
                    style={pickerSelectStyles}
                />
            </View>
            {raceType == '2km' && <TwoKMDisplay/>}
            {raceType == '5km' && <FiveKMDisplay/>}
            {raceType == '30min' && <ThirtyMinDisplay/>}
            <View style={{marginTop: 20}}>
                <TouchableOpacity style={style.submitButton} onPress={submitData}>
                    <Text style={style.submitText}>Submit</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 4,
      color: 'black',
      textAlign: 'center',
      paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 0.5,
      borderColor: 'purple',
      borderRadius: 8,
      color: 'black',
      textAlign: 'center',
      paddingRight: 30, // to ensure the text is never behind the icon
    },
    iconContainer: {
      top: 5,
      right: 15,
    },
  });
const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageContainer: {
        marginTop: 30,
        marginBottom: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    selectTitle: {
        color: '#800000',
        fontWeight: 'bold',
    },
    inputContainer: {
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    inputLabel: {
        fontSize: 16,
        width: 65,
        textAlign: 'left',
        marginRight: 10,
        color: '#800000',
        justifyContent: 'center',
    },
    inputBox: {
        borderWidth: 2,
        borderColor: '#800000',
        paddingHorizontal: 5,
        width: 150,
    },
    submitButton: {
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#800000', 
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
    }
});