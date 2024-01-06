import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function IntroScreen({ onStartPlaying }) {
  const genres = [
    { name: 'Dubstep', colorStart: '#FF9F00', colorEnd: '#DC2430' },
    { name: 'Pop', colorStart: '#D8008D', colorEnd: '#FF0A87' },
    { name: 'Rock', colorStart: '#183CA8', colorEnd: '#41B6E6' },
    { name: 'Electronic', colorStart: '#00B4DB', colorEnd: '#0083B0' },
    { name: 'HipHop', colorStart: '#FF5A00', colorEnd: '#FFAA00' },
    { name: 'Jazz', colorStart: '#D8008D', colorEnd: '#FF0A87' },
    { name: 'Indie', colorStart: '#3A3897', colorEnd: '#A3A1FF' },
    { name: 'Film Score', colorStart: '#7B4397', colorEnd: '#DC2430' },
    { name: 'Classical', colorStart: '#DA4453', colorEnd: '#89216B' },
    { name: 'Chillout', colorStart: '#C0392B', colorEnd: '#8E44AD' },
    { name: 'Ambient', colorStart: '#2C3E50', colorEnd: '#4CA1AF' },
    { name: 'Folk', colorStart: '#1E8BC3', colorEnd: '#55E6C1' },
    { name: 'Metal', colorStart: '#F64747', colorEnd: '#E74C3C' },
    { name: 'Latin', colorStart: '#45B39D', colorEnd: '#E6B0AA' },
    { name: 'RNB', colorStart: '#48C9B0', colorEnd: '#1F618D' },
    { name: 'Reggae', colorStart: '#3FC380', colorEnd: '#27AE60' },
    { name: 'Punk', colorStart: '#F9690E', colorEnd: '#D35400' },
    { name: 'Country', colorStart: '#F7CA18', colorEnd: '#F39C12' },
    { name: 'House', colorStart: '#663399', colorEnd: '#674172' },
    { name: 'Blues', colorStart: '#0097E6', colorEnd: '#8ED9FC' },
  ];

  const [selectedGenre, setSelectedGenre] = useState('All genres');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose a genre</Text>

      <View style={styles.genresContainer}>
        {genres.map((genre, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setSelectedGenre(genre.name)}
          >
            <LinearGradient
              colors={[genre.colorStart, genre.colorEnd]}
              style={[
                styles.genreBox,
                selectedGenre === genre.name && styles.selectedGenreBox,
              ]}
            >
              <Text
                style={[
                  styles.genreText,
                  selectedGenre === genre.name && styles.selectedGenreText,
                ]}
              >
                {genre.name}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => {
          onStartPlaying(`'${selectedGenre.toLowerCase()}'`); // Pass the lowercase genre
        }}
      >
        <Text style={styles.startButtonText}>Start Playing</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 0,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 20,
    marginBottom:90,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff',
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 9,
  },
  genreBox: {
    width: 62,  // Adjust the width here
    height: 60, // Adjust the height here
    borderRadius: 10,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedGenreBox: {
    borderWidth: 2,
    borderColor: '#fff',
  },
  genreText: {
    fontSize: 12, // Adjust the font size here
    color: '#fff',
  },
  selectedGenreText: {
    fontWeight: 'bold',
  },
  startButton: {
    backgroundColor: '#DC2430',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
