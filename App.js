import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, AppState } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as SplashScreen from 'expo-splash-screen';
import { Audio } from 'expo-av';
import axios from 'axios';
import IntroScreen from './IntroScreen';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';

import {
  PlayPauseImageWidget,
  StopImageWidget,
  PreviousImageWidget,
  NextImageWidget,
} from './CustomWidgets'; // Update the import path to match your file structure

export default function App() {
  const fontsLoad = useFonts({
    helvetica: require('./assets/fonts/HelveticaNowDisplay-ExtraBold.ttf'),
  });

  if (!fontsLoad) {
    return <AppLoading />;
  }

  const [player, setPlayer] = useState(null);
  const [trackData, setTrackData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [tracks, setTracks] = useState([]);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [startPlaying, setStartPlaying] = useState(false);

  async function playSound() {
    if (!player || !trackData || !trackData.url) {
      return;
    }

    try {
      if (isPlaying) {
        console.log('Pausing sound...');
        await player.pauseAsync();
        setIsPlaying(false);
      } else {
        console.log('Playing sound...');
        await player.playAsync();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing sound:', error);
      setIsPlaying(false);
    }
  }

  async function stopSound() {
    if (player && (isPlaying || player.isPlaying)) {
      console.log('Stopping sound...');
      await player.stopAsync();
      setIsPlaying(false);
    }
  }

  async function fetchRandomTrack() {
    try {
      console.log('API fetched');
      const response = await axios.get('https://api.jamendo.com/v3.0/tracks', {
        params: {
          limit: 150,
          streamable: 'true',
          fstreamlimit: '8000_80000',
          client_id: '82dafe99',
          language: 'en',
          order: 'popularity_week',
        },
      });

      const fetchedTracks = response.data.results;
      if (fetchedTracks.length === 0) {
        console.log('No tracks found.');
        return;
      }

      const tracksWithAlbumCovers = fetchedTracks.map((track) => ({
        ...track,
        albumCover: track.album_image,
      }));

      setTracks(tracksWithAlbumCovers);

      console.log('randomised');

      const randomIndex = Math.floor(Math.random() * fetchedTracks.length);
      setCurrentIndex(randomIndex);
      const track = fetchedTracks[randomIndex];

      setTrackData({
        url: track.audio,
        name: track.name,
        artist: track.artist_name,
        albumCover: track.album_image,
      });
    } catch (error) {
      console.error('Error fetching track data:', error);
    }
  }

  async function playNextTrack() {
    console.log('playNextTrack: Starting...');
    if (currentIndex >= 0 && !loadingAudio) {
      setLoadingAudio(true);

      const nextIndex = (currentIndex + 1) % tracks.length;

      setCurrentIndex(nextIndex);
      const track = tracks[nextIndex];

      try {
        if (player) {
          await player.unloadAsync();
        }

        const soundObject = new Audio.Sound();
        console.log('Loading audio from:', track.audio);
        await soundObject.loadAsync({ uri: track.audio });
        console.log('Audio loaded successfully.');

        soundObject.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);

        setPlayer(soundObject);
        setTrackData({
          url: track.audio,
          name: track.name,
          artist: track.artist_name,
          albumCover: track.album_image,
        });

        if (!AppState.currentState.match(/active/)) {
          await soundObject.playAsync();
        } else {
          await soundObject.playAsync();
          setIsPlaying(true);
        }

        setLoadingAudio(false);
      } catch (error) {
        console.error('Error loading and playing audio:', error);
        setLoadingAudio(false);
      }
    }
  }

  async function playPreviousTrack() {
    console.log('playPreviousTrack: Starting...');
    if (currentIndex >= 0 && !loadingAudio) {
      setLoadingAudio(true);

      const previousIndex = (currentIndex - 1 + tracks.length) % tracks.length;
      console.log('playPreviousTrack: Previous index:', previousIndex);
      setCurrentIndex(previousIndex);
      const track = tracks[previousIndex];

      try {
        if (player) {
          await player.unloadAsync();
        }

        const soundObject = new Audio.Sound();
        console.log('Loading audio from:', track.audio);
        await soundObject.loadAsync({ uri: track.audio });
        console.log('Audio loaded successfully.');

        soundObject.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);

        setPlayer(soundObject);
        setTrackData({
          url: track.audio,
          name: track.name,
          artist: track.artist_name,
          albumCover: track.album_image,
        });

        if (!AppState.currentState.match(/active/)) {
          await soundObject.playAsync();
        } else {
          await soundObject.playAsync();
          setIsPlaying(true);
        }

        setLoadingAudio(false);
      } catch (error) {
        console.error('Error loading and playing audio:', error);
        setLoadingAudio(false);
      }
    }
  }

  useEffect(() => {
    async function load() {
      try {
        await Audio.setAudioModeAsync({
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
        });

        await fetchRandomTrack();
      } catch (e) {
        console.warn(e);
      }
    }

    load();

    return async () => {
      if (player) {
        await player.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    if (startPlaying && trackData && trackData.url) {
      if (player) {
        player.unloadAsync().then(() => {
          loadAndPlayAudio(trackData.url);
        });
      } else {
        loadAndPlayAudio(trackData.url);
      }
    }
  }, [startPlaying, trackData]);

  useEffect(() => {
    if (player) {
      player.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
    }
  }, [player]);

  async function loadAndPlayAudio(url) {
    const soundObject = new Audio.Sound();
    try {
      console.log('Loading audio from:', url);
      await soundObject.loadAsync({ uri: url });
      console.log('Audio loaded successfully.');
      setPlayer(soundObject);
      console.log('Setting playback status update listener...');
      soundObject.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);

      if (!AppState.currentState.match(/active/)) {
        await soundObject.playAsync();
      } else {
        await soundObject.playAsync();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error loading and playing audio:', error);
    }
  }

  async function onPlaybackStatusUpdate(status) {
    if (status.didJustFinish && isPlaying) {
      console.log('Track finished playing. Playing next track...');
      await playNextTrack();
    }
  }

  const handleStartPlaying = async () => {
    await fetchRandomTrack();
    setStartPlaying(false);
    setShowIntro(false);
    await playNextTrack();
    setStartPlaying(true);
  };
  
  return (
    <LinearGradient style={styles.container} colors={['#000000', '#413E41', '#C05471']}>
    <View style={styles.logoContainer}>
    <Image source={require('./assets/logo.png')} style={styles.logo} /> 
    </View> 
    {showIntro ? (
      <IntroScreen onStartPlaying={handleStartPlaying} />
    ) : trackData ? (
      <>
          <Text style={styles.tophead}>Now Playing</Text>
          <Image
            source={{ uri: trackData.albumCover }}
            style={styles.albumCover}
          />
          <Text style={styles.songName}>{trackData.name}</Text>
          <Text style={styles.artistName}>{trackData.artist}</Text>

          <View style={styles.imageContainer}>
            <PreviousImageWidget
              onPress={playPreviousTrack}
              previousImage={require('./assets/previous.png')}
            />
            <PlayPauseImageWidget
              isPlaying={isPlaying}
              onPress={playSound}
              playImage={require('./assets/play.png')}
              pauseImage={require('./assets/pause.png')}
            />

            <NextImageWidget
              onPress={playNextTrack}
              nextImage={require('./assets/next.png')}
            />

            <StopImageWidget
              onPress={stopSound}
              stopImage={require('./assets/stop.png')}
            />
          </View>
        </>
      ) : null}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 200,
    height: 200,
    
  },
  logoContainer: {
    position: 'absolute',
    top: 0,
    left: 0,

  },
  tophead: {
    marginBottom: 30,
    marginTop:63,
    fontSize: 28,
    color: 'white',
    fontFamily: 'helvetica',
  },
  songName: {
    marginTop: 10,
    fontSize: 28,
    color: 'white',
    fontFamily: 'helvetica',
  },
  artistName: {
    fontSize: 16,
    color: 'white',
  },
  button: {
    marginTop: 20,
    width: 150,
  },
  albumCover: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 10,
  },
  blankCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'gray',
    marginBottom: 10,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 50,
    marginRight: 40,
  },
});
