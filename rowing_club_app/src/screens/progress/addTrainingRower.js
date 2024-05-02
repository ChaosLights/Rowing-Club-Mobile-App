import { ScrollView, View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert, Image } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import { storage } from '../../config/firebase';
import { ref, uploadBytes } from 'firebase/storage'
import React, { useState } from 'react';
import * as FileSystem from 'expo-file-system';
import { db } from '../../config/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { userId } from '../auth/login';

export default function ImageScreenRower() {
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    
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
        setUploading(true);
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
            const storageRef = ref(storage, "images/"+filename);

            await uploadBytes(storageRef, blob);
            setUploading(false);
            Alert.alert('Photo Uploaded');
            setImage(null);
            //Handle firebase uploading
            const docRef = await addDoc(collection(db, "ImageInput"), {
                ImageName: filename,
                UserId: userId,
            });
        } catch (error) {
            console.error(error);
            alert('Cannot upload empty image!');
            setUploading(false);
        }
    };
    
    return (
        <ScrollView>
            <SafeAreaView style={style.container}>
                <TouchableOpacity style={style.selectButton} onPress={pickImage}>
                    <Text style={style.buttonText}>Pick an Image</Text>
                </TouchableOpacity>
                <TouchableOpacity style={style.selectButton} onPress={takeImage}>
                    <Text style={style.buttonText}>Take an Image</Text>
                </TouchableOpacity>
                <View style={style.imageContainer}>
                    {image && <Image
                        source={{ uri: image }}
                        style={{ width: 300, height: 300 }}
                    />}
                    <TouchableOpacity style={style.uploadButton} onPress={uploadMedia}>
                        <Text style={style.buttonText}>Upload Image</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </ScrollView>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectButton: {
        borderRadius: 5,
        marginBottom: 10,
        width: 150,
        height: 80,
        backgroundColor: '#800000', //maroon coloured button
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
        width: 130,
        height: 50,
        backgroundColor: '#800000', //maroon coloured button
        alignItems: 'center',
        justifyContent: 'center',
        margin: 20,
    },
    imageContainer: {
        marginTop: 30,
        marginBottom: 50,
        alignItems: 'center',
    }
});