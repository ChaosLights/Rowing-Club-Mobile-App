import React, { useState, useEffect } from 'react';
import { Image, Button, TextInput, View, ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { storage } from '../../config/firebase';
import { ref, listAll, getDownloadURL } from 'firebase/storage'
import RNPickerSelect from 'react-native-picker-select';
import Toast from 'react-native-root-toast';

export default function ImageScreenCoach() {
    const [raceType, setRaceType] = useState('');
    const [image, setImage] = useState([]);
    const [showImage, setShowImage] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);

    async function fetchImage() {
        const storageRef = ref(storage, "images/");
        let images = [];
        try {
            const res = await listAll(storageRef);
            const promises = res.items.map(async (itemRef) => {
                try {
                    const imgUrl = await getDownloadURL(itemRef);
                    images.push({ url: imgUrl });
                } catch (error) {
                    alert('Error while fetching the images: ', error);
                }
            });
            await Promise.all(promises);
        } catch (error) {
            console.error('Error listing files:', error);
        }
        setImage(images);
        setShowImage(true);
    }
    useEffect(() => {
        fetchImage();
    }, []);

    function switchImage(index) {
        if(index >= 0 && index < image.length){
            setImageIndex(index);
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
        <ScrollView>
            <View style={style.container}>
                {showImage && image.length > 0 &&
                <View style={style.imageContainer}>
                    <Button title="Prev" onPress={() => switchImage(imageIndex-1)} color='#800000'/>
                    <Image
                        source={{ uri: image[imageIndex].url }}
                        style={{ width: 300, height: 300 }}
                    />
                    <Button title="Next" onPress={() => switchImage(imageIndex+1)} color='#800000'/>
                </View>
                }
                <Text style={style.selectTitle}>Race Type</Text>
                <RNPickerSelect
                    placeholder={{ label: "Select a race type", value: null }}
                    onValueChange={(raceType) => setRaceType(raceType)}
                    items={[
                        { label: '2 km', value: '2km' },
                        { label: '5 km', value: '5km' },
                        { label: '30 mins', value: '30min' },
                    ]}
                    style={style.select}
                />
                {raceType == '2km' && <TwoKMDisplay/>}
                {raceType == '5km' && <FiveKMDisplay/>}
                {raceType == '30min' && <ThirtyMinDisplay/>}
            </View>
        </ScrollView>
    );
}
const TwoKMDisplay = () => {
    return (
        <View>
            <View style={style.inputContainer}>
                <Text style={style.inputLabel}>400m</Text>
                <TextInput
                    style={style.inputBox}
                    placeholder="Enter time data..."
                />
            </View>
            <View style={style.inputContainer}>
                <Text style={style.inputLabel}>800m</Text>
                <TextInput
                    style={style.inputBox}
                    placeholder="Enter time data..."
                />
            </View>
            <View style={style.inputContainer}>
                <Text style={style.inputLabel}>1200m</Text>
                <TextInput
                    style={style.inputBox}
                    placeholder="Enter time data..."
                />
            </View>
            <View style={style.inputContainer}>
                <Text style={style.inputLabel}>1600m</Text>
                <TextInput
                    style={style.inputBox}
                    placeholder="Enter time data..."
                />
            </View>
            <View style={style.inputContainer}>
                <Text style={style.inputLabel}>2000m</Text>
                <TextInput
                    style={style.inputBox}
                    placeholder="Enter time data..."
                />
            </View>
            <View style={{marginTop: 20}}>
                <Button title="Submit" onPress={() => {}} color='#800000' />
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
                />
            </View>
            <View style={style.inputContainer}>
                <Text style={style.inputLabel}>2000m</Text>
                <TextInput
                    style={style.inputBox}
                    placeholder="Enter time data..."
                />
            </View>
            <View style={style.inputContainer}>
                <Text style={style.inputLabel}>3000m</Text>
                <TextInput
                    style={style.inputBox}
                    placeholder="Enter time data..."
                />
            </View>
            <View style={style.inputContainer}>
                <Text style={style.inputLabel}>4000m</Text>
                <TextInput
                    style={style.inputBox}
                    placeholder="Enter time data..."
                />
            </View>
            <View style={style.inputContainer}>
                <Text style={style.inputLabel}>5000m</Text>
                <TextInput
                    style={style.inputBox}
                    placeholder="Enter time data..."
                />
            </View>
            <View style={{marginTop: 20}}>
                <Button title="Submit" onPress={() => {}} color='#800000' />
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
                />
            </View>
            <View style={{marginTop: 20}}>
                <Button title="Submit" onPress={() => {}} color='#800000' />
            </View>
        </View>
    );
};


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
        justifyContent: 'center',
    },
    select: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'gray',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30,
        justifyContent: 'center',
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
    }
});