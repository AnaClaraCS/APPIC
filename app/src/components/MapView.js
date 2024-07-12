import React, { useState, useRef } from 'react';
import { View, Image, Dimensions, StyleSheet, Text } from 'react-native';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';

const { width, height } = Dimensions.get('window');

const MapView = ({ imageSource }) => {
  const imageRef = useRef(null);
  const [imageLayout, setImageLayout] = useState(null);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      const newTranslateX = translateX.value + e.changeX;
      const newTranslateY = translateY.value + e.changeY;

      // Verifica se as novas coordenadas estão dentro dos limites da imagem
      if (
        newTranslateX >= 0 &&
        newTranslateX <= (imageLayout?.width || 0) - 20 &&
        newTranslateY >= 0 &&
        newTranslateY <= (imageLayout?.height || 0) - 20
      ) {
        translateX.value = newTranslateX;
        translateY.value = newTranslateY;
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  const handleImageLayout = () => {
    imageRef.current.measure((x, y, width, height, pageX, pageY) => {
      setImageLayout({ x: pageX, y: pageY, width, height });
    });
  };

  const getRelativeCoordinates = () => {
    if (imageLayout) {
      const relativeX = (translateX.value / imageLayout.width) * 100;
      const relativeY = (translateY.value / imageLayout.height) * 100;
      return { x: relativeX.toFixed(2), y: relativeY.toFixed(2) };
    }
    return { x: 0, y: 0 };
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ReactNativeZoomableView
        zoomEnabled={true}
        maxZoom={2.0}
        minZoom={0.5}
        zoomStep={0.5}
        initialZoom={1.0}
        bindToBorders={true}
        style={styles.zoomableView}
      >
        <Image
          ref={imageRef}
          style={styles.image}
          source={imageSource}
          resizeMode="contain"
          onLayout={handleImageLayout}
        />
        {imageLayout && (
          <GestureDetector gesture={panGesture}>
            <Animated.View style={[styles.marker, animatedStyle]} />
          </GestureDetector>
        )}
      </ReactNativeZoomableView>
      {imageLayout && (
        <View style={styles.coordinatesContainer}>
          <Text style={styles.coordinatesText}>
            Coordenadas Relativas: X = {getRelativeCoordinates().x}%, Y = {getRelativeCoordinates().y}%
          </Text>
        </View>
      )}
    </GestureHandlerRootView>
  );
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
