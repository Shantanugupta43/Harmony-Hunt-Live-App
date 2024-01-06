import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, AppState, TouchableOpacity, Share} from 'react-native';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import axios from 'axios';
import IntroScreen from './IntroScreen';



import {
  PlayPauseImageWidget,
  StopImageWidget,
  PreviousImageWidget,
  NextImageWidget,
} from './CustomWidgets'; // Update the import path to match your file structure

export default function App() {


  const [player, setPlayer] = useState(null);
  const [trackData, setTrackData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [tracks, setTracks] = useState([]);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [startPlaying, setStartPlaying] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('dubstep'); 
  const [showAutoplayMessage, setShowAutoplayMessage] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const retryDelay = 5000; // 5 seconds (adjust as needed)
  const [position, setPosition] = useState(0); // Current playback position
  const [duration, setDuration] = useState(0); // Total duration of the song
  const [sliderValue, setSliderValue] = useState(0);
  const [isSliderChanging, setIsSliderChanging] = useState(false);
  const [tracksListened, setTracksListened] = useState(1);


  const handleSliderChange = (value) => {
    setSliderValue(value);
  };
  
  const handleSliderRelease = async (value) => {
    if (player && duration > 0) {
      const newPositionMillis = (value / 100) * duration;
      await player.setPositionAsync(newPositionMillis);
      setPosition(newPositionMillis);
    }
    setIsSliderChanging(false);
  };
  




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

  // Helper function to format time in minutes and seconds
function formatTime(timeMillis) {
  const minutes = Math.floor(timeMillis / 60000);
  const seconds = ((timeMillis % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}



  async function handleBackButton() {
    if (player) {
      await player.stopAsync(); // Stop audio playback
    }
    setStartPlaying(false); // Reset the startPlaying state
    setShowIntro(true); // Show the IntroScreen again
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
        console.log('Audio loaded successfully. 1');
  
        soundObject.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
  
        setPlayer(soundObject);
        setTrackData({
          url: track.audio,
          name: track.name,
          artist: track.artist_name,
          albumCover: track.album_image,
        });
  
        if (AppState.currentState === 'active') {
          await soundObject.playAsync();
          setIsPlaying(true);
        } else {
          await soundObject.playAsync();
        }
  
        setLoadingAudio(false);
        setShowAutoplayMessage(false); // Hide the autoplay message
  
      } catch (error) {
        console.error('Error loading and playing audio:', error);
        fetchTracksByGenre(selectedGenre);
      }
    }
  }

  async function fetchTracksByGenre(genre, retryCount = 0) {
    try {
      setLoadingAudio(true);
  
      // Make the API request
      const response = await axios.get('https://api.jamendo.com/v3.0/tracks', {
        params: {
          tags: `'${genre.toLowerCase()}'`,
          limit: 200,
          client_id: 'API',
          order: 'releasedate_desc',
          vocalinstrumental:'vocal',
          audiodlformat: 'mp32',
        },
      });
  
      // Filter tracks with non-empty "audio" field
      const fetchedTracks = response.data.results.filter(track => track.audio);
  
      if (fetchedTracks.length === 0) {
        console.log(`No tracks found for genre: ${genre}`);
        setLoadingAudio(false);
        setTracksListened(0);
        setTrackData(null);
        setShowIntro(true);
        setStartPlaying(false);
        alert("Our servers are under construction. Please check back later or choose another genre.");
        return;
      }
  
      const tracksWithAlbumCovers = fetchedTracks.map(track => ({
        ...track,
        albumCover: track.album_image,
      }));
  
      setTracks(tracksWithAlbumCovers);
      setCurrentIndex(0); // Start with the first track in the array
  
      const firstTrack = fetchedTracks[0];
  
      setTrackData({
        url: firstTrack.audio,
        name: firstTrack.name,
        artist: firstTrack.artist_name,
        albumCover: firstTrack.album_image,
      });
  
      setLoadingAudio(false);
    } catch (error) {
      console.error('Error fetching track data:', error);
      setLoadingAudio(false);
  
      if (retryCount < 20) {
        setTimeout(() => {
          fetchTracksByGenre(genre, retryCount + 1);
        }, 1000);
      } else {
        console.error('Maximum retry count exceeded. Could not fetch data.');
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
        console.log('Audio loaded successfully. 2');

        soundObject.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);

        setPlayer(soundObject);
        setTrackData({
          url: track.audio,
          name: track.name,
          artist: track.artist_name,
          albumCover: track.album_image,
        });

        if (AppState.currentState === 'active') {
          await soundObject.playAsync();
          setIsPlaying(true);
        } else {
          await soundObject.playAsync();
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
  
      // Load audio with a timeout of 3 seconds
      const loadPromise = soundObject.loadAsync({ uri: url });
  
      const timeoutId = setTimeout(() => {
        console.log('Audio loading timed out');
        clearTimeout(timeoutId);
        soundObject.unloadAsync(); // Stop audio loading
        fetchTracksByGenre(selectedGenre); // Reload the selected genre
      }, 4000); // 3 seconds timeout
  
      // Wait for either successful audio loading or a timeout
      await loadPromise;
      clearTimeout(timeoutId); // Clear the timeout if audio loading was successful
  
      console.log('Audio loaded successfully.');
      setPlayer(soundObject);
      console.log('Setting playback status update listener...');
      soundObject.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
  
      if (AppState.currentState === 'active') {
        await soundObject.playAsync();
        setIsPlaying(true);
      } else {
        await soundObject.playAsync();
      }
    } catch (error) {
      console.error('Error loading and playing audio:', error);
      fetchTracksByGenre(selectedGenre);
    }
  }
  

  async function onPlaybackStatusUpdate(status) {
    if (status.didJustFinish && isPlaying) {
      console.log('Track finished playing. Playing next track...');
      await playNextTrack();
      setTracksListened(tracksListened + 1);
    } else {
      // Update the current playback position and duration
      setPosition(status.positionMillis);
      setDuration(status.durationMillis);
      
      // Update the slider position, ensuring it's within the valid range [0, 100]
      if (!isSliderChanging) {
        const newPosition = (status.positionMillis / status.durationMillis) * 100;
        setSliderValue(newPosition >= 0 ? (newPosition <= 100 ? newPosition : 100) : 0);
      }
    }
  }
  

  const handleStartPlaying = async (selectedGenre) => {
 
    setLoadingAudio(true);
    setSelectedGenre(selectedGenre); // Set the selected genre
    console.log('dont play');
    setStartPlaying(false);
    fetchTracksByGenre(selectedGenre); // Fetch tracks based on selected genre
    console.log('dont play');
    setStartPlaying(false);

    setShowIntro(false);
    console.log('play');
 setStartPlaying(false);
      
      setTimeout(() => {
    setStartPlaying(true);
    console.log('play ttt');
  }, 1200);
  };
  

 return (
  <LinearGradient style={styles.container} colors={['#000000', '#413E41', '#C05471']}>
{trackData && trackData.albumCover !== null ? (
  <Image
    source={{ uri: trackData.albumCover }}
    style={styles.albumCover}
  />
) : (
  <View/>
)}



    <View style={styles.logoContainer}>
      <Image source={require('./assets/logo.png')} style={styles.logo} />
    </View>
    {!showAutoplayMessage && (
  <Text style={styles.tracksListenedText}>
    Hunt Streaks: {tracksListened}
  </Text>
)}

{showIntro ? (
  <IntroScreen onStartPlaying={handleStartPlaying} />
) : trackData ? (
  <>
    <Text style={styles.tophead}>Now Playing</Text>
    {loadingAudio ? (
      <Text style={styles.loadingText}>Loading Audio...</Text>
    ) : (
      <>
{trackData && trackData.albumCover !== null ? (
  <Image
    source={{ uri: trackData.albumCover }}
    style={styles.albumCover}
  />
) : (
  <View/>
)}

        <Text style={styles.songName}>{trackData.name}</Text>
        <Text style={styles.artistName}>{trackData.artist}</Text>

            <View style={styles.timelineContainer}>
            <Slider
            style={{ width: '100%' }}
            value={sliderValue}
            minimumValue={0}
            maximumValue={100}
            onValueChange={handleSliderChange}
            onSlidingStart={() => setIsSliderChanging(true)}
            onSlidingComplete={handleSliderRelease}
            tapToSeek={true}
            minimumTrackTintColor={customSliderStyle.track.backgroundColor}
            maximumTrackTintColor="white" 
            thumbTintColor={customSliderStyle.thumb.backgroundColor}
            />

              <Text style={styles.timelineText}>
                {formatTime(isSliderChanging ? sliderValue * (duration / 100) : position)} / {formatTime(duration)}
              </Text>
            </View>

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
            {showAutoplayMessage && (
              <Text style={styles.autoplayMsg}>
                To enable autoplay for the next song after the current finishes click 'next'
              </Text>
            )}
            <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.backButton} onPress={handleBackButton}>
              <Text style={styles.backButtonText}>Back to Genre Selection</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton} onPress={shareApp}>
              <Image
              source={require('./assets/share.png')} 
              style={styles.shareImage}/>
            </TouchableOpacity>
            </View>


          </>
        )}
      </>
    ) : null}
  </LinearGradient>
);

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    position: 'relative', // Add this to allow absolute positioning within the container
  },

  shareImage: {
    width: 30, 
    height: 30, 
    resizeMode: 'contain', 
  },
  
  logo: {
    width: 200,
    height: 200,
    
  },
  logoContainer: {
    position: 'absolute',
    top: -58,
    left: 0,

  },
  tophead: {
    marginBottom: 30,
    marginTop:-38,
    fontSize: 15,
    color: 'white',
    fontWeight: 'bold',
  },
  songName: {
    marginTop: 10,
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  artistName: {
    fontSize: 12,
    color: 'white',
    marginTop:5,
    marginBottom:12,
  },
  autoplayMsg: {
    fontSize: 13,
    color: 'white',
    marginTop:4,
  },
  button: {
    marginTop: 20,
    width: 150,
  },
  albumCover: {
    ...StyleSheet.absoluteFillObject, // This will make the album cover cover the entire screen
    resizeMode: 'cover', // Ensure the cover mode is set to cover
    opacity: 0.04,
    backgroundColor: '#FFF',
  },
  blankCircle: {
    width: 120,
    height: 120,
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
    marginBottom:20,
    width:350,
    height:20,
    
  },
  tracksListenedText: {
    fontSize: 12,
    color: 'white',
    marginBottom:63,
    marginTop:2,
    marginLeft:230,
    paddingVertical: 6,
    paddingHorizontal: 20,
    backgroundColor: '#6d3480',
    borderRadius: 20,

  },

  buttonContainer: {
    flexDirection: 'row', // Arrange buttons horizontally
    justifyContent: 'space-between', // Space evenly between buttons
    marginTop: 5, // Adjust the margin as needed
    marginLeft: 62,
  },
  
  

  backButton: {
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#222',
    borderRadius: 5,
    marginRight:30,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  loadingText:{
    color: 'white',
    fontWeight: 'bold',
    fontSize:18,
  },

    timelineContainer: {
    width: '80%',
    height: 5, // Adjust the height of the timeline bar as needed
    marginTop: 10, // Adjust the spacing as needed
  },
  timelineText: {
    color: 'white',
    fontSize: 12,
    marginTop: 5, // Adjust the spacing as needed
    textAlign: 'center',
  },

  shareButton: {
    marginTop: 10, // Adjust the margin as needed
    paddingVertical: 10,
    paddingHorizontal: 10,

    alignSelf: 'center', // Center the button horizontally
  },
  shareButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  

}); 

const customSliderStyle = {
  track: {
    height: 4, // Adjust the track height as needed
    backgroundColor: '#C05471', // Change this to track color
  },
  thumb: {
    width: 20, // Adjust the thumb width as needed
    height: 20, // Adjust the thumb height as needed
    backgroundColor: 'white', // Change this to thumb color
  },
};

const shareApp = async () => {
  try {
    const appLink = 'https://play.google.com/store/apps/details?id=com.guptashantanu.harmonyhunt'; // Replace with your app's actual link

    await Share.share({
      message: `Check out Harmony Hunt - Talent Hunting Music Streaming App: ${appLink}`,
      url: appLink,
      title: 'Share App',
    });

    console.log('Shared successfully');
  } catch (error) {
    console.error('Error sharing:', error);
  }
};
