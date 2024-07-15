import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Pressable } from 'react-native';
import RedeController from '../../controllers/redeController';

const GerenciarRedes = ({ navigation }) => {
  
  const [redes, setRedes] = useState([]);
  const redeController = new RedeController();

  useEffect(() => {
    getRedes();
  }, []);

  const getRedes = async () => {
    try {
      const redes = await redeController.obterRedes();
      setRedes(redes);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRedePress = (bssid) => {
    navigation.navigate('InformacoesRede', { bssid });
  };

  return (
    <View style={styles.container}>
      <Button
        title="Nova rede"
        onPress={() => navigation.navigate('NovaRede')}
      />
      <Button
        title="Redes perto"
        onPress={() => navigation.navigate('NovaRede')}
      />

      <ScrollView>
        {redes.length > 0 ? ( 
          <View>
            {redes.map((rede) => (
              <Pressable key={rede.bssid} onPress={() => handleRedePress(rede.bssid)}>
                <Text>{rede.nome} - {rede.bssid} </Text>
              </Pressable>
            ))}
          </View>
        ) : (
          <Text>Nenhuma rede encontrada</Text>
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

export default GerenciarRedes;
