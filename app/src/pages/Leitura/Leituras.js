import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Pressable } from 'react-native';
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

      <ScrollView>
        {leituras.length > 0 ? ( 
          <View>
            {leituras.map((leitura) => (
              <Pressable key={leitura.idLeitura} onPress={() => handleLeituraPress(leitura.idLeitura)}>
                <Text>{`${leitura.localDescricao} - ${leitura.redeNome} - ${leitura.rssi} - ${leitura.data}`}</Text>
              </Pressable>
            ))}
          </View>
        ) : (
          <Text>Nenhuma leitura encontrada</Text>
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

export default Leituras;
