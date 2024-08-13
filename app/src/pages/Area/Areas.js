import React, { useState, useEffect} from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Pressable } from 'react-native';
import AreaController from '../../controllers/areaController';

const Locais = ({ navigation }) => {
  
  const [areas, setAreas] = useState([]);
  const areaController = new AreaController();

  useEffect(() => {
    getAreas();
  }, []);

  const getAreas = async () => {
    try {
      const areas = await areaController.obterAreas();
      setAreas(areas);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAreaPress = (IdArea) => {
    navigation.navigate('VerArea', { IdArea });
  };

  return (
    <View style={styles.container}>
      <Button
        title="Nova Área"
        onPress={() => navigation.navigate('NovaArea')}
      />
 
      <ScrollView>
        {areas.length > 0 ? ( 
          <View>
            {areas.map((area) => (
              <Pressable key={area.idArea} onPress={() => handleAreaPress(area.idArea)}>
                <Text>{area.descricao}</Text>
              </Pressable>
            ))}
          </View>
        ) : (
          <Text>Nenhuma area encontrada</Text>
        )}
      </ScrollView>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});

export default Locais;
