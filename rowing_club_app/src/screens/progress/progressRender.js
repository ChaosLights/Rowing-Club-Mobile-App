import { ScrollView, View, Text, TouchableOpacity, SafeAreaView } from 'react-native'
import { db } from '../../config/firebase';
import { collection, query, where, orderBy, getDocs, onSnapshot } from "firebase/firestore";
import React, { useState, useEffect, useContext } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome'
import Theme from '../../style';
import { AuthContext } from '../../contexts/authContext';

export function renderRower() {
    return (
        <ScrollView>
            <SafeAreaView>
                <View style={{height: 1, backgroundColor: '#E0E0E0', marginVertical: 10}} />
                <TrainingDataView/>
            </SafeAreaView>
        </ScrollView>
    )
}

export function renderCoach() {
    return (
        <ScrollView>
            <SafeAreaView>
                <View style={{height: 1, backgroundColor: '#E0E0E0', marginVertical: 10}} />
                <CoachView/>
            </SafeAreaView>
        </ScrollView>
    )
}

function CoachView() {
    const [rowerData, setRowerData] = useState([]);
    const [rowerNames, setRowerNames] = useState([]);

    // get rower training data
    useEffect(() => {
        async function fetchLatestData() {
            try {
                const dataRef = collection(db, "TrainingData");
                const q = query(dataRef, orderBy("time", "desc"));
                let snapshot = await getDocs(q);
                let rowerDocs = [];
                let map = new Map();
                snapshot.forEach(async doc => {
                    const data = doc.data();
                    const userId = data.UserId;
                    const type = data.Type;
                    let id = `${userId}-${type}`;
                    if(!map.has(id))
                    {
                        rowerDocs.push(data);
                        map.set(id, true);
                    }
                })
                setRowerData(rowerDocs);
            } catch (error) {
                console.log("Error fetching data:" + error);
            }
        }
        fetchLatestData();
    }, [])

    // get rower names
    useEffect(() => {
        try {
            let userNames = [];
            const querySnapshot = onSnapshot(collection(db, "User"), (snapshot) => {
                snapshot.docs.forEach((doc) => {
                    // get user id
                    const userID = doc.id;
                    // get fullname
                    const userName = (doc.data().Firstname +" "+ doc.data().Surname);

                    // add mapped ID and name
                    userNames.push({key: userID, value: userName})
                });
                // set user type list to the updated version
                setRowerNames(userNames);
            });

            // return cleanup function
            return () => querySnapshot();
        } catch (error) {
            console.log("Error fetching data:" + error);
        }
    }, []);

    function getName(userID) {
        const name = rowerNames.find(user => user.key === userID);
        if (name) {
            return name.value;
        }
        // if name cannot be found
        return null;
    }

    function TwoKMView() {
        const twoKMData = rowerData.filter(record => record.Type === '2km');
        return (
            <View>
                {twoKMData.map((record, index) => {
                    return (
                        <View style={Theme.entryContainer} key={index}>
                            <Text>Time: {new Date(record.time).toLocaleDateString("en-US", {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                            })}
                            </Text>
                            <View style={Theme.entryBlock}>
                                <Text style = {{marginRight: 10}}>Name: {getName(record.UserId)}</Text>
                            </View>
                            <View style={Theme.entryBlock}>
                                <Text style = {{marginRight: 10}}>Type: {record.Type}</Text>
                            </View>
                            <View style={Theme.entryBlock}>
                                <Text style = {{marginRight: 10}}>400m: {record.fourHM}</Text>
                            </View>
                            <View style={Theme.entryBlock}>
                                <Text style = {{marginRight: 10}}>800m: {record.eightHM}</Text>
                            </View>
                            <View style={Theme.entryBlock}>
                                <Text style = {{marginRight: 10}}>1200m: {record.twelveHM}</Text>
                            </View>
                            <View style={Theme.entryBlock}>
                                <Text style = {{marginRight: 10}}>1600m: {record.sixteenHM}</Text>
                            </View>
                            <View style={Theme.entryBlock}>
                                <Text style = {{marginRight: 10}}>2000m: {record.twentyHM}</Text>
                            </View>
                        </View>
                    )
                })}
            </View>
        )
    }

    function FiveKMView() {
        const twoKMData = rowerData.filter(record => record.Type === '5km');
        return (
            <View>
                {twoKMData.map((record, index) => {
                    return (
                        <View style={Theme.entryContainer} key={index}>
                            <Text>Time: {new Date(record.time).toLocaleDateString("en-US", {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                            })}
                            </Text>
                            <View style={Theme.entryBlock}>
                                <Text style = {{marginRight: 10}}>Name: {getName(record.UserId)}</Text>
                            </View>
                            <View style={Theme.entryBlock}>
                                <Text style = {{marginRight: 10}}>Type: {record.Type}</Text>
                            </View>
                            <View style={Theme.entryBlock}>
                                <Text style = {{marginRight: 10}}>1000m: {record.oneKM}</Text>
                            </View>
                            <View style={Theme.entryBlock}>
                                <Text style = {{marginRight: 10}}>2000m: {record.twoKM}</Text>
                            </View>
                            <View style={Theme.entryBlock}>
                                <Text style = {{marginRight: 10}}>3000m: {record.threeKM}</Text>
                            </View>
                            <View style={Theme.entryBlock}>
                                <Text style = {{marginRight: 10}}>4000m: {record.fourKM}</Text>
                            </View>
                            <View style={Theme.entryBlock}>
                                <Text style = {{marginRight: 10}}>5000m: {record.fiveKM}</Text>
                            </View>
                        </View>
                    )
                })}
            </View>
        )
    }

    function DistanceView() {
        const twoKMData = rowerData.filter(record => record.Type === '30min');
        return (
            <View>
                {twoKMData.map((record, index) => {
                    return (
                        <View style={Theme.entryContainer} key={index}>
                            <Text>Time: {new Date(record.time).toLocaleDateString("en-US", {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                            })}
                            </Text>
                            <View style={Theme.entryBlock}>
                                <Text style = {{marginRight: 10}}>Name: {getName(record.UserId)}</Text>
                            </View>
                            <View style={Theme.entryBlock}>
                                <Text style = {{marginRight: 10}}>Type: {record.Type}</Text>
                            </View>
                            <View style={Theme.entryBlock}>
                                <Text style = {{marginRight: 10}}>Distance: {record.distance}</Text>
                            </View>
                        </View>
                    )
                })}
            </View>
        )
    }

    const [selectedTab, setSelectedTab] = useState('2000M');

    return (
        <View style={Theme.container}>
            <View style={Theme.tabsContainer}>
                {['2000M', '5000M', '30 Mins'].map((tab) => (
                <TouchableOpacity
                    key={tab}
                    style={[Theme.tab, selectedTab === tab && Theme.activeTab]}
                    onPress={() => setSelectedTab(tab)}
                >
                    <Text style={Theme.tabText}>{`${tab}`}</Text>
                </TouchableOpacity>
                ))}
            </View>
            {rowerData.length > 0 &&
            <View style={Theme.contentContainer}>
                {selectedTab == '2000M' && <TwoKMView/>}
                {selectedTab == '5000M' && <FiveKMView/>}
                {selectedTab == '30 Mins' && <DistanceView/>}
            </View>
            }
        </View>
    )
}

function TrainingDataView() {
    const [trainingData, setTrainingData] = useState([]);
    const { userID } = useContext(AuthContext);
    useEffect(() => {
        async function fetchTrainingData() {
            try {
                let data = [];
                const q = query(collection(db, "TrainingData"), where("UserId", "==", userID), orderBy("time", "desc"));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    data.push(doc.data());
                });
                setTrainingData(data);
            } catch (error) {
                console.log("Error fetching data:" + error);
            }
        }
        fetchTrainingData();
    }, [userID]);

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
                        <View style={Theme.entryContainer} key={index}>
                            <Text>Time: {new Date(record.time).toLocaleDateString("en-US", {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                            })}
                            </Text>
                            <View style={Theme.entryBlock}>
                                <Text style = {{marginRight: 10}}>400m: {record.fourHM}</Text>
                                {index != twoKMData.length-1 ? (
                                    avgFourHM[twoKMData.length-2-index] < 0 ? (
                                        <Icon name="arrow-up" size={15} color="red"/>
                                    ) : avgFourHM[twoKMData.length-2-index] > 0 ? (
                                        <Icon style={{marginTop: 2}} name="arrow-down" size={15} color="green"/>
                                    ) : null
                                ) : null
                                }
                            </View>
                            <View style={Theme.entryBlock}>
                                <Text style = {{marginRight: 10}}>800m: {record.eightHM}</Text>
                                {index != twoKMData.length-1 ? (
                                    avgEightHM[twoKMData.length-2-index] < 0 ? (
                                        <Icon name="arrow-up" size={15} color="red"/>
                                    ) : avgEightHM[twoKMData.length-2-index] > 0 ? (
                                        <Icon style={{marginTop: 2}} name="arrow-down" size={15} color="green"/>
                                    ) : null
                                ) : null
                                }
                            </View>
                            <View style={Theme.entryBlock}>
                                <Text style = {{marginRight: 10}}>1200m: {record.twelveHM}</Text>
                                {index != twoKMData.length-1 ? (
                                    avgTwelveHM[twoKMData.length-2-index] < 0 ? (
                                        <Icon name="arrow-up" size={15} color="red"/>
                                    ) : avgTwelveHM[twoKMData.length-2-index] > 0 ? (
                                        <Icon style={{marginTop: 2}} name="arrow-down" size={15} color="green"/>
                                    ) : null
                                ) : null
                                }
                            </View>
                            <View style={Theme.entryBlock}>
                                <Text style = {{marginRight: 10}}>1600m: {record.sixteenHM}</Text>
                                {index != twoKMData.length-1 ? (
                                    avgSixteenHM[twoKMData.length-2-index] < 0 ? (
                                        <Icon name="arrow-up" size={15} color="red"/>
                                    ) : avgSixteenHM[twoKMData.length-2-index] > 0 ? (
                                        <Icon style={{marginTop: 2}} name="arrow-down" size={15} color="green"/>
                                    ) : null
                                ) : null
                                }
                            </View>
                            <View style={Theme.entryBlock}>
                                <Text style = {{marginRight: 10}}>2000m: {record.twentyHM}</Text>
                                {index != twoKMData.length-1 ? (
                                    avgTwentyHM[twoKMData.length-2-index] < 0 ? (
                                        <Icon name="arrow-up" size={15} color="red"/>
                                    ) : avgTwentyHM[twoKMData.length-2-index] > 0 ? (
                                        <Icon style={{marginTop: 2}} name="arrow-down" size={15} color="green"/>
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
                        <View style={Theme.entryContainer} key={index}>
                            <Text>Time: {new Date(record.time).toLocaleDateString("en-US", {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                            })}
                            </Text>
                            <View style={Theme.entryBlock}>
                                <Text style = {{marginRight: 10}}>1000m: {record.oneKM}</Text>
                                {index != fiveKMData.length-1 ? (
                                    avgOneKM[fiveKMData.length-2-index] < 0 ? (
                                        <Icon name="arrow-up" size={15} color="red"/>
                                    ) : avgOneKM[fiveKMData.length-2-index] > 0 ? (
                                        <Icon style={{marginTop: 2}} name="arrow-down" size={15} color="green"/>
                                    ) : null
                                ) : null
                                }
                            </View>
                            <View style={Theme.entryBlock}>
                                <Text style = {{marginRight: 10}}>2000m: {record.twoKM}</Text>
                                {index != fiveKMData.length-1 ? (
                                    avgTwoKM[fiveKMData.length-2-index] < 0 ? (
                                        <Icon name="arrow-up" size={15} color="red"/>
                                    ) : avgTwoKM[fiveKMData.length-2-index] > 0 ? (
                                        <Icon style={{marginTop: 2}} name="arrow-down" size={15} color="green"/>
                                    ) : null
                                ) : null
                                }
                            </View>
                            <View style={Theme.entryBlock}>
                                <Text style = {{marginRight: 10}}>3000m: {record.threeKM}</Text>
                                {index != fiveKMData.length-1 ? (
                                    avgThreeKM[fiveKMData.length-2-index] < 0 ? (
                                        <Icon name="arrow-up" size={15} color="red"/>
                                    ) : avgThreeKM[fiveKMData.length-2-index] > 0 ? (
                                        <Icon style={{marginTop: 2}} name="arrow-down" size={15} color="green"/>
                                    ) : null
                                ) : null
                                }
                            </View>
                            <View style={Theme.entryBlock}>
                                <Text style = {{marginRight: 10}}>4000m: {record.fourKM}</Text>
                                {index != fiveKMData.length-1 ? (
                                    avgFourKM[fiveKMData.length-2-index] < 0 ? (
                                        <Icon name="arrow-up" size={15} color="red"/>
                                    ) : avgFourKM[fiveKMData.length-2-index] > 0 ? (
                                        <Icon style={{marginTop: 2}} name="arrow-down" size={15} color="green"/>
                                    ) : null
                                ) : null
                                }
                            </View>
                            <View style={Theme.entryBlock}>
                                <Text style = {{marginRight: 10}}>5000m: {record.fiveKM}</Text>
                                {index != fiveKMData.length-1 ? (
                                    avgFiveKM[fiveKMData.length-2-index] < 0 ? (
                                        <Icon name="arrow-up" size={15} color="red"/>
                                    ) : avgFiveKM[fiveKMData.length-2-index] > 0 ? (
                                        <Icon style={{marginTop: 2}} name="arrow-down" size={15} color="green"/>
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
                        <View style={Theme.entryContainer} key={index}>
                            <Text>Time: {new Date(record.time).toLocaleDateString("en-US", {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                            })}
                            </Text>
                            <View style={Theme.entryBlock}>
                                <Text style = {{marginRight: 10}}>Distance: {record.distance}</Text>
                                {index != thirtyMinData.length-1 ? (
                                    avgProgress[thirtyMinData.length-2-index] < 0 ? (
                                        <Icon name="arrow-up" size={15} color="red"/>
                                    ) : avgProgress[thirtyMinData.length-2-index] > 0 ? (
                                        <Icon style={{marginTop: 2}} name="arrow-down" size={15} color="green"/>
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
        <View style={Theme.container}>
            <View style={Theme.tabsContainer}>
                {['2000M', '5000M', '30 Mins'].map((tab) => (
                <TouchableOpacity
                    key={tab}
                    style={[Theme.tab, selectedTab === tab && Theme.activeTab]}
                    onPress={() => setSelectedTab(tab)}
                >
                    <Text style={Theme.tabText}>{`${tab}`}</Text>
                </TouchableOpacity>
                ))}
            </View>
            {trainingData.length > 0 &&
            <View style={Theme.contentContainer}>
                {selectedTab == '2000M' && <TwoKMView/>}
                {selectedTab == '5000M' && <FiveKMView/>}
                {selectedTab == '30 Mins' && <DistanceView/>}
            </View>
            }
        </View>
    )
}
