import { View, Text, StyleSheet, Button, TouchableOpacity, ActivityIndicator, SafeAreaView, PermissionsAndroid, Alert, Image } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome';
import Slider from '@react-native-community/slider';
import { useProgress } from 'react-native-track-player';
import TrackPlayer, { RepeatMode } from 'react-native-track-player';
import { SetupService } from '../setupPlayer';
import getSongs from '../getTracks'


const track3 = {
    id: 'track3',
    url: 'file:///storage/emulated/0/Music/file_example_MP3_1MG.mp3',
    title: 'Track 1',
    artist: 'Artist 1',
};
const track2 = {
    id: 'track2',
    url: 'file:///storage/emulated/0/Music/aajana.mp3',
    title: 'Track 2',
    artist: 'Artist 1',
};

const track1 = {
    id: 'StorageSong',
    url: 'file:///storage/emulated/0/Music/file_example_MP3_1MG.mp3',
    title: 'AA Jaana',
    artist: 'Artist 1',
};


const Player = ({ route }) => {
    const [track, setTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const { position, duration } = useProgress()
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const [repeat, setRepeat] = useState(false)
    const [random, setRandom] = useState(false)
    const [songsList, setSongsList] = useState(null)
    const [like, setLike] = useState(false)

    useEffect(() => {
        async function run() {
            const isSetup = await SetupService();
            setIsPlayerReady(isSetup);

            TrackPlayer.add([track2, track3, track1])
            var title = await TrackPlayer.getCurrentTrack()
            var pos = await TrackPlayer.getTrack(title)
            setTrack(pos.title)
            if (Platform.OS === 'android') {
                isReadGranted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                );
            }
            if (isReadGranted === PermissionsAndroid.RESULTS.GRANTED) {
                //TODO
                console.log("Permission Granted")
            }
            else {
                Alert.alert("Storage Read Permission Required")
            }
        }
        run();
        TrackPlayer.reset()
    }, []);


    const forward = async () => {
        var title = await TrackPlayer.getCurrentTrack()
        var pos = await TrackPlayer.getTrack(title)
        setTrack(pos.title)
        TrackPlayer.skipToNext()
    }
    const backward = async () => {
        var title = await TrackPlayer.getCurrentTrack()
        var pos = await TrackPlayer.getTrack(title)
        setTrack(pos.title)
        TrackPlayer.skipToPrevious()

    }
    const repeatMode = async () => {
        if (repeat == true || repeat == false) {
            if (repeat) {
                TrackPlayer.setRepeatMode(RepeatMode.Off)
                //  console.log(await TrackPlayer.getRepeatMode())
            }

            else {
                TrackPlayer.setRepeatMode(RepeatMode.Track)
                //  console.log("Repeat On", await TrackPlayer.getRepeatMode())
            }
            setRepeat(!repeat)
        }
    }
    const shuffleMode = async () => {
        setRandom(!random)
        var currentQueue = await TrackPlayer.getQueue();
        TrackPlayer.reset()
        // console.log(currentQueue)
        var currentQueue = currentQueue.sort(() => 0.5 - Math.random())
        // console.log(currentQueue)
        TrackPlayer.add(currentQueue)
        var title = await TrackPlayer.getCurrentTrack()
        var pos = await TrackPlayer.getTrack(title)
        setTrack(pos.title)
        await TrackPlayer.play()
    }
    const liked = async ()=>{
        setLike(!like)
    }





    return (
        <View>
            <View style={styles.musicBackground}>
                <Image style={{ height: '95%', width: '95%', borderRadius: 10 }}
                    source={require('../assets/images/musicBackground.jpg')} />
            </View>
            <View style={styles.TrackLikeContainer}>
            <Text style={styles.trackName}>{track}</Text>
            <Text>{
                like? <Icon name='heart' color='#1DB954' size={30} onPress={liked}/>:<Icon name='heart' color='white' size={30} onPress={liked}/>
                }</Text>
            
            </View>
        
            <View>

                <Slider
                    style={{ height: 40, backgroundColor: "#191414" }}
                    minimumTrackTintColor="#1DB954"
                    maximumTrackTintColor="white"
                    thumbTintColor="white"
                    minimumValue={0}
                    maximumValue={duration}
                    value={position}
                    onSlidingComplete={value => {
                        TrackPlayer.pause();
                        TrackPlayer.seekTo(value)
                        TrackPlayer.play();
                    }}
                />
                <View style={styles.time}>
                    <Text style={styles.timeFont}> {position.toFixed(0)}{"s"}</Text>
                    <Text style={styles.timeFont}>{duration.toFixed(0)}{"s"}</Text>
                </View>
            </View>
            <View style={styles.controls}>
                <View>{
                    random ? <Icon name='random' size={30} color="white" onPress={shuffleMode} /> : <Icon name='random' size={30} color="grey" onPress={shuffleMode} />
                }
                </View>

                <Icon name='step-backward' size={30} color="white" onPress={backward} />
                <View>
                    {
                        isPlaying ? <Icon name='pause' size={60} color="white" onPress={() => {
                            TrackPlayer.pause()
                            setIsPlaying(false)

                        }} /> : <Icon name='play' size={60} color="white" onPress={() => {
                            TrackPlayer.play()
                            setIsPlaying(true)
                        }} />
                    }
                </View>
                <Icon name='step-forward' size={30} color="white" onPress={forward} />
                <View>{
                    repeat ? <Icon name='retweet' size={30} color="white" onPress={repeatMode} /> : <Icon name='retweet' size={30} color="grey" onPress={repeatMode} />
                }
                </View>

            </View>
        </View>
    );

}
const styles = StyleSheet.create({
    controls: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        backgroundColor: "#191414",
        alignItems: "center",
    },
    time: {
        justifyContent: "space-between",
        flexDirection: "row",
        backgroundColor: "#191414"
    },
    timeFont: {
        color: "white",
    },
    trackName: {
        fontWeight: "900",
        fontSize: 20,
        color: "white",
        backgroundColor: "#191414",
   
    },
    musicBackground: {
        height: '70%',
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#191414"
    },
    TrackLikeContainer:{
        flexDirection:"row",
        backgroundColor: "#191414",
        justifyContent:"space-around",

    }

})

export default Player