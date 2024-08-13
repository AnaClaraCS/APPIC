import React, { useState, useRef } from 'react';
import { View, Image, Dimensions, StyleSheet, Text } from 'react-native';


const MapView = ({ imageSource }) => {
  
  
};

const styles = StyleSheet.create({
  zoomableView: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  marker: {
    width: 20,
    height: 20,
    backgroundColor: 'red',
    borderRadius: 10,
    position: 'absolute',
  },
  coordinatesContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 5,
    borderRadius: 5,
  },
  coordinatesText: {
    fontSize: 14,
  },
});

export default MapView;

