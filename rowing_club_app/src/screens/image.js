import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert, Image } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import { storage } from '../config/firebase';
import { ref, uploadBytes } from 'firebase/storage'
import React, { useState } from 'react';
import * as FileSystem from 'expo-file-system';

const ImageScreen = () => {
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if(!result.canceled){
            setImage(result.assets[0].uri);
        }
    }

    const uploadMedia = async() => {
        setUploading(true);

        try {
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
            console.log(storage);
            const storageRef = ref(storage, filename);

            await uploadBytes(storageRef, blob);
            setUploading(false);
            Alert.alert('Photo Uploaded');
            setImage(null);
        } catch (error) {
            console.error(error);
            setUploading(false);
        }
    };

    return (
        <SafeAreaView style={style.container}>
            <TouchableOpacity style={style.selectButton} onPress={pickImage}>
                <Text style={style.buttonText}>Pick an Image</Text>
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
    )
}

export default ImageScreen;

const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectButton: {
        borderRadius: 5,
        width: 150,
        height: 150,
        backgroundColor: 'blue',
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
        width: 150,
        height: 50,
        backgroundColor: 'red',
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