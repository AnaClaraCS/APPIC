import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import LeituraController from '../../controllers/leituraController';

const Leituras = ({ navigation }) => {
  
  const [leituras, setLeituras] = useState([]);
  const leituraController = new LeituraController();

  useEffect(() => {
    getLeituras();
  }, []);

  const getLeituras = async () => {
    try {
      const leituras = await leituraController.obterLeiturasDetalhadas();
      setLeituras(leituras);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLeituraPress = (leituraId) => {
    navigation.navigate('InformacoesLeitura', { leituraId });
  };

  return (
    <View style={styles.container}>
      <Button
        title="Nova leitura"
        onPress={() => navigation.navigate('NovaLeitura')}
      />

      <Text> Lista de leituras</Text>
      {leituras.length > 0 ? ( 
        <View>
          {leituras.map((leitura) => (
            <TouchableOpacity key={leitura.idLeitura} onPress={() => handleLeituraPress(leitura.idLeitura)}>
              <Text>{`${leitura.localDescricao} - ${leitura.redeNome} - ${leitura.rssi} - ${leitura.data}`}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <Text>Nenhuma leitura encontrada</Text>
      )}
      
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

export default Leituras;
