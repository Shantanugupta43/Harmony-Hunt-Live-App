import React from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';

export default function IntroScreen({ onStartPlaying }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hi there!</Text>
      <Text style={styles.description}>
        Are you a music enthusiast looking to discover unheard music of various genre and moods? You are at the right place. This app allows you to listen to random tracks of different upcoming new artists and gives you the power to decide your own music taste. Press "Start Playing" to begin.
      </Text>
      <Button title="Start Playing" onPress={onStartPlaying} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    borderRadius: 30,
  },
  title: {
    fontSize: 40,
    marginBottom: 10,
    fontWeight: 'bold',  
    color: '#fff',
  },
  description: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 70,
    color: '#fff',
  }, 


});
