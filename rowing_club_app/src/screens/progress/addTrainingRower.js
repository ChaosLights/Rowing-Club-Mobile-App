import { ScrollView, View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert, Image } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import { db, storage } from '../../config/firebase';
import { ref, uploadBytes } from 'firebase/storage'
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import React, { useState, useEffect } from 'react';
import * as FileSystem from 'expo-file-system';
import { db } from '../../config/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { userId } from '../auth/login';

//import Icon from 'react-native-vector-icons/FontAwesome'

export default function ImageScreenRower() {
    return (
        <ScrollView>
            <SafeAreaView>
                <UploadImageView/>
                <View style={{height: 1, backgroundColor: '#E0E0E0', marginVertical: 10}} />
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

const style = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 5,
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