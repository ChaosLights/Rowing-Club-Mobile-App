import { ScrollView, View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert, Image } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import { db, storage } from '../../config/firebase';
import { ref, uploadBytes } from 'firebase/storage'
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import React, { useState, useEffect } from 'react';
import * as FileSystem from 'expo-file-system';
import Icon from 'react-native-vector-icons/FontAwesome'

export default function ImageScreenRower() {
    return (
        <ScrollView>
            <SafeAreaView>
                <UploadImageView/>
                <View style={{height: 1, backgroundColor: '#E0E0E0', marginVertical: 10}} />
                <TrainingDataView/>
            </SafeAreaView>
        </ScrollView>
    )
}
function UploadImageView() {
    const [image, setImage] = useState(null);
    
    const pickImage = async () => {
        let permLib = await ImagePicker.getMediaLibraryPermissionsAsync();
        const options = {
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
            selectionLimit: 1,
        }
        if(permLib.granted){
            const result = await ImagePicker.launchImageLibraryAsync(options);
            if(!result.canceled){
                setImage(result.assets[0].uri);
            }
        }else{
            permLib = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if(permLib.granted){
                const result = await ImagePicker.launchImageLibraryAsync(options);
                if(!result.canceled){
                    setImage(result.assets[0].uri);
                }
            }else{
                alert('MediaLiberary permission is required to use Media Liberary.');
            }
        }
    }

    const takeImage = async() => {
        let permCamera = await ImagePicker.getCameraPermissionsAsync();
        const options = {
            mediaType: ImagePicker.MediaTypeOptions.Images,
            base64: false,
            cameraType: ImagePicker.CameraType.back,
            selectionLimit: 1,
        };
        if(permCamera.granted){
            const result = await ImagePicker.launchCameraAsync(options);
            if(!result.canceled){
                setImage(result.assets[0].uri);
            }
        }else{
            permCamera = await ImagePicker.requestCameraPermissionsAsync();
            if(permCamera.granted){
                const result = await ImagePicker.launchCameraAsync(options);
                if(!result.canceled){
                    setImage(result.assets[0].uri);
                }
            }else{
                alert('Camera permission is required to use camera.');
            }
        }
    }
    const uploadMedia = async() => {
        try {
            //Handle image uploading
            const { uri } = await FileSystem.getInfoAsync(image);
            const blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = () => {
                    resolve(xhr.response);
                };
                xhr.onerror = (e) => {
                    reject(new TypeError('Network request failed'));
                };
                xhr.responseType = 'blob';
                xhr.open('GET', uri, true);
                xhr.send(null);
            });

            const filename = image.substring(image.lastIndexOf('/') + 1);
            const storageRef = ref(storage, "images/"+global.user+"/"+filename);

            await uploadBytes(storageRef, blob);
            Alert.alert('Photo Uploaded');
            setImage(null);
        } catch (error) {
            alert('Cannot upload empty image!');
        }
    };

    return (
        <View>
            <View style={style.container}>
                <TouchableOpacity style={{marginRight: 20}} onPress={takeImage}>
                    <View>
                        <Icon name="camera" size={60} color="#800000"/>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={pickImage}>
                    <View>
                        <Icon name="image" size={60} color="#800000"/>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={style.imageContainer}>
                {image && <Image
                    source={{ uri: image }}
                    style={{ width: 300, height: 300 }}
                />}
                <TouchableOpacity style={style.uploadButton} onPress={uploadMedia}>
                    <Text style={style.buttonText}>Upload</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

function TrainingDataView() {
    const [trainingData, setTrainingData] = useState([]);
    useEffect(() => {
        async function fetchData() {
            try {
                let data = [];
                const q = query(collection(db, "TrainingData"), where("UserId", "==", global.user), orderBy("time", "desc"));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    data.push(doc.data());
                });
                setTrainingData(data);
            } catch (error) {
                console.log("Error fetching data:"+error);
            }
        }
        fetchData();
    }, []);

    function TwoKMView(){
        const twoKMData = trainingData.filter(record => record.Type === '2km');
        let counter = 0;
        let totalFourHM = 0, avgFourHM = [];
        let totalEightHM = 0, avgEightHM = [];
        let totalTwelveHM = 0, avgTwelveHM = [];
        let totalSixteenHM = 0, avgSixteenHM = [];
        let totalTwentyHM = 0, avgTwentyHM = [];
        twoKMData.slice().reverse().map((record, index) => {
            let numFourHM = Number(record.fourHM);
            let numEightHM = Number(record.eightHM);
            let numTwelveHM = Number(record.twelveHM);
            let numSixteenHM = Number(record.sixteenHM);
            let numTwentyHM = Number(record.twentyHM);
            totalFourHM += numFourHM;
            totalEightHM += numEightHM;
            totalTwelveHM += numTwelveHM;
            totalSixteenHM += numSixteenHM;
            totalTwentyHM += numTwentyHM;
            counter++;
            if(index != 0){
                avgFourHM.push((totalFourHM-numFourHM)/(counter-1) - numFourHM);
                avgEightHM.push((totalEightHM-numEightHM)/(counter-1) - numEightHM);
                avgTwelveHM.push((totalTwelveHM-numTwelveHM)/(counter-1) - numTwelveHM);
                avgSixteenHM.push((totalSixteenHM-numSixteenHM)/(counter-1) - numSixteenHM);
                avgTwentyHM.push((totalTwentyHM-numTwentyHM)/(counter-1) - numTwentyHM);
            }
        })
        return (
            <View>
                {twoKMData.map((record, index) => {
                    return (
                        <View style={dataStyles.entryContainer} key={index}>
                            <Text>Time: {new Date(record.time).toLocaleDateString("en-US", {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                            })}
                            </Text>
                            <View style={{flexDirection: "row", justifyContent: 'space-between', width: '80%'}}>
                                <Text style = {{marginRight: 10}}>400m: {record.fourHM}</Text>
                                {index != twoKMData.length-1 ? (
                                    avgFourHM[twoKMData.length-2-index] < 0 ? (
                                        <Icon name="arrow-up" size={15} color="green"/>
                                    ) : avgFourHM[twoKMData.length-2-index] > 0 ? (
                                        <Icon style={{marginTop: 2}} name="arrow-down" size={15} color="red"/>
                                    ) : null
                                ) : null
                                }
                            </View>
                            <View style={{flexDirection: "row", justifyContent: 'space-between', width: '80%'}}>
                                <Text style = {{marginRight: 10}}>800m: {record.eightHM}</Text>
                                {index != twoKMData.length-1 ? (
                                    avgEightHM[twoKMData.length-2-index] < 0 ? (
                                        <Icon name="arrow-up" size={15} color="green"/>
                                    ) : avgEightHM[twoKMData.length-2-index] > 0 ? (
                                        <Icon style={{marginTop: 2}} name="arrow-down" size={15} color="red"/>
                                    ) : null
                                ) : null
                                }
                            </View>
                            <View style={{flexDirection: "row", justifyContent: 'space-between', width: '80%'}}>
                                <Text style = {{marginRight: 10}}>1200m: {record.twelveHM}</Text>
                                {index != twoKMData.length-1 ? (
                                    avgTwelveHM[twoKMData.length-2-index] < 0 ? (
                                        <Icon name="arrow-up" size={15} color="green"/>
                                    ) : avgTwelveHM[twoKMData.length-2-index] > 0 ? (
                                        <Icon style={{marginTop: 2}} name="arrow-down" size={15} color="red"/>
                                    ) : null
                                ) : null
                                }
                            </View>
                            <View style={{flexDirection: "row", justifyContent: 'space-between', width: '80%'}}>
                                <Text style = {{marginRight: 10}}>1600m: {record.sixteenHM}</Text>
                                {index != twoKMData.length-1 ? (
                                    avgSixteenHM[twoKMData.length-2-index] < 0 ? (
                                        <Icon name="arrow-up" size={15} color="green"/>
                                    ) : avgSixteenHM[twoKMData.length-2-index] > 0 ? (
                                        <Icon style={{marginTop: 2}} name="arrow-down" size={15} color="red"/>
                                    ) : null
                                ) : null
                                }
                            </View>
                            <View style={{flexDirection: "row", justifyContent: 'space-between', width: '80%'}}>
                                <Text style = {{marginRight: 10}}>2000m: {record.twentyHM}</Text>
                                {index != twoKMData.length-1 ? (
                                    avgTwentyHM[twoKMData.length-2-index] < 0 ? (
                                        <Icon name="arrow-up" size={15} color="green"/>
                                    ) : avgTwentyHM[twoKMData.length-2-index] > 0 ? (
                                        <Icon style={{marginTop: 2}} name="arrow-down" size={15} color="red"/>
                                    ) : null
                                ) : null
                                }
                            </View>
                        </View>
                    )
                })}
            </View>
        )
    }

    function FiveKMView(){
        const fiveKMData = trainingData.filter(record => record.Type === '5km');
        let counter = 0;
        let totalOneKM = 0, avgOneKM = [];
        let totalTwoKM = 0, avgTwoKM = [];
        let totalThreeKM = 0, avgThreeKM = [];
        let totalFourKM = 0, avgFourKM = [];
        let totalFiveKM = 0, avgFiveKM = [];
        fiveKMData.slice().reverse().map((record, index) => {
            let numOneKM = Number(record.oneKM);
            let numTwoKM = Number(record.twoKM);
            let numThreeKM = Number(record.threeKM);
            let numFourKM = Number(record.fourKM);
            let numFiveKM = Number(record.fiveKM);
            totalOneKM += numOneKM;
            totalTwoKM += numTwoKM;
            totalThreeKM += numThreeKM;
            totalFourKM += numFourKM;
            totalFiveKM += numFiveKM;
            counter++;
            if(index != 0){
                avgOneKM.push((totalOneKM-numOneKM)/(counter-1) - numOneKM);
                avgTwoKM.push((totalTwoKM-numTwoKM)/(counter-1) - numTwoKM);
                avgThreeKM.push((totalThreeKM-numThreeKM)/(counter-1) - numThreeKM);
                avgFourKM.push((totalFourKM-numFourKM)/(counter-1) - numFourKM);
                avgFiveKM.push((totalFiveKM-numFiveKM)/(counter-1) - numFiveKM);
            }
        })
        return (
            <View>
                {fiveKMData.map((record, index) => {
                    return (
                        <View style={dataStyles.entryContainer} key={index}>
                            <Text>Time: {new Date(record.time).toLocaleDateString("en-US", {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                            })}
                            </Text>
                            <View style={{flexDirection: "row", justifyContent: 'space-between', width: '80%'}}>
                                <Text style = {{marginRight: 10}}>1000m: {record.oneKM}</Text>
                                {index != fiveKMData.length-1 ? (
                                    avgOneKM[fiveKMData.length-2-index] < 0 ? (
                                        <Icon name="arrow-up" size={15} color="green"/>
                                    ) : avgOneKM[fiveKMData.length-2-index] > 0 ? (
                                        <Icon style={{marginTop: 2}} name="arrow-down" size={15} color="red"/>
                                    ) : null
                                ) : null
                                }
                            </View>
                            <View style={{flexDirection: "row", justifyContent: 'space-between', width: '80%'}}>
                                <Text style = {{marginRight: 10}}>2000m: {record.twoKM}</Text>
                                {index != fiveKMData.length-1 ? (
                                    avgTwoKM[fiveKMData.length-2-index] < 0 ? (
                                        <Icon name="arrow-up" size={15} color="green"/>
                                    ) : avgTwoKM[fiveKMData.length-2-index] > 0 ? (
                                        <Icon style={{marginTop: 2}} name="arrow-down" size={15} color="red"/>
                                    ) : null
                                ) : null
                                }
                            </View>
                            <View style={{flexDirection: "row", justifyContent: 'space-between', width: '80%'}}>
                                <Text style = {{marginRight: 10}}>1200m: {record.threeKM}</Text>
                                {index != fiveKMData.length-1 ? (
                                    avgThreeKM[fiveKMData.length-2-index] < 0 ? (
                                        <Icon name="arrow-up" size={15} color="green"/>
                                    ) : avgThreeKM[fiveKMData.length-2-index] > 0 ? (
                                        <Icon style={{marginTop: 2}} name="arrow-down" size={15} color="red"/>
                                    ) : null
                                ) : null
                                }
                            </View>
                            <View style={{flexDirection: "row", justifyContent: 'space-between', width: '80%'}}>
                                <Text style = {{marginRight: 10}}>1600m: {record.fourKM}</Text>
                                {index != fiveKMData.length-1 ? (
                                    avgFourKM[fiveKMData.length-2-index] < 0 ? (
                                        <Icon name="arrow-up" size={15} color="green"/>
                                    ) : avgFourKM[fiveKMData.length-2-index] > 0 ? (
                                        <Icon style={{marginTop: 2}} name="arrow-down" size={15} color="red"/>
                                    ) : null
                                ) : null
                                }
                            </View>
                            <View style={{flexDirection: "row", justifyContent: 'space-between', width: '80%'}}>
                                <Text style = {{marginRight: 10}}>2000m: {record.fiveKM}</Text>
                                {index != fiveKMData.length-1 ? (
                                    avgFiveKM[fiveKMData.length-2-index] < 0 ? (
                                        <Icon name="arrow-up" size={15} color="green"/>
                                    ) : avgFiveKM[fiveKMData.length-2-index] > 0 ? (
                                        <Icon style={{marginTop: 2}} name="arrow-down" size={15} color="red"/>
                                    ) : null
                                ) : null
                                }
                            </View>
                        </View>
                    )
                })}
            </View>
        )
    }

    function DistanceView(){
        const thirtyMinData = trainingData.filter(record => record.Type === '30min');
        let totalDistance = 0, counter = 0, avgProgress = [];
        thirtyMinData.slice().reverse().map((record, index) => {
            let dis = Number(record.distance);
            totalDistance += dis;
            counter++;
            if(index != 0){
                avgProgress.push((totalDistance-dis)/(counter-1) - dis);
            }
        })
        return (
            <View>
                {thirtyMinData.map((record, index) => {
                    return (
                        <View style={dataStyles.entryContainer} key={index}>
                            <Text>Time: {new Date(record.time).toLocaleDateString("en-US", {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                            })}
                            </Text>
                            <View style={{flexDirection: "row", justifyContent: 'space-between', width: '80%'}}>
                                <Text style = {{marginRight: 10}}>Distance: {record.distance}</Text>
                                {index != thirtyMinData.length-1 ? (
                                    avgProgress[thirtyMinData.length-2-index] < 0 ? (
                                        <Icon name="arrow-up" size={15} color="green"/>
                                    ) : avgProgress[thirtyMinData.length-2-index] > 0 ? (
                                        <Icon style={{marginTop: 2}} name="arrow-down" size={15} color="red"/>
                                    ) : null
                                ) : null
                                }
                            </View>
                        </View>
                    )
                })}
            </View>
        )
    }

    const [selectedTab, setSelectedTab] = useState('2000M');

    return (
        <View style={dataStyles.container}>
            <View style={dataStyles.tabsContainer}>
                {['2000M', '5000M', '30 Mins'].map((tab) => (
                <TouchableOpacity
                    key={tab}
                    style={[dataStyles.tab, selectedTab === tab && dataStyles.activeTab]}
                    onPress={() => setSelectedTab(tab)}
                >
                    <Text style={dataStyles.tabText}>{`${tab}`}</Text>
                </TouchableOpacity>
                ))}
            </View>
            {trainingData.length > 0 &&
            <View style={dataStyles.contentContainer}>
                {selectedTab == '2000M' && <TwoKMView/>}
                {selectedTab == '5000M' && <FiveKMView/>}
                {selectedTab == '30 Mins' && <DistanceView/>}
            </View>
            }
        </View>
    )
}
const dataStyles = StyleSheet.create({
    container: {
      flex: 1,
    },
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

const style = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    uploadButton: {
        borderRadius: 5,
        width: 100,
        height: 50,
        backgroundColor: '#800000', //maroon coloured button
        alignItems: 'center',
        justifyContent: 'center',
        margin: 20,
    },
    imageContainer: {
        marginTop: 10,
        alignItems: 'center',
    }
});