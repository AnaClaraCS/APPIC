import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import MapView from '../../components/MapView'; 
const App = () => {
    const mapImage = require('../../assets/mapas/pavilhao-1-andar1.png'); 

  return (
    <SafeAreaView style={styles.container}>
      <MapView imageSource={mapImage} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
