import React from 'react';
import { TouchableOpacity, View, Text, Image } from 'react-native';

// Custom Widget for Play/Pause Button with Image
export function PlayPauseImageWidget({ isPlaying, onPress, playImage, pauseImage }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View>
        <Image source={isPlaying ? pauseImage : playImage} style={{ width: 40, height: 45,marginLeft:40 }} />
      </View>
    </TouchableOpacity>
  );
}

// Custom Widget for Stop Button with Image
export function StopImageWidget({ onPress, stopImage }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View>
        <Image source={stopImage} style={{ width: 40, height: 45, marginLeft:40 }} />
      </View>
    </TouchableOpacity>
  );
}

// Custom Widget for Previous Button with Image
export function PreviousImageWidget({ onPress, previousImage }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View>
        <Image source={previousImage} style={{ width: 40, height: 45,marginLeft:40 }}/>
      </View>
    </TouchableOpacity>
  );
}

// Custom Widget for Next Button with Image
export function NextImageWidget({ onPress, nextImage }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View>
        <Image source={nextImage}  style={{ width: 40, height: 45, marginLeft:40 }}/>
      </View>
    </TouchableOpacity>
  );
}
