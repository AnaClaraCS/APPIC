import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import LeituraController from '../../controllers/leituraController';

const NovaLeitura = ({ navigation }) => {
  const leituraController = new LeituraController();

  const [idLocal, setIdLocal] = useState('');
  const [rssi, setRssi] = useState('');
  const [bssid, setBssid] = useState('');

  const handleSave = async () => {
    const leitura = { idLocal, rssi, bssid };

    try {
      await leituraController.criarLeitura(leitura);
      alert('Leitura salva');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar a leitura');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>ID do Sensor:</Text>
      <TextInput
        style={styles.input}
        value={idLocal}
        onChangeText={setIdLocal}
      />
      <Text style={styles.label}>Valor:</Text>
      <TextInput
        style={styles.input}
        value={rssi}
        onChangeText={setRssi}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Timestamp:</Text>
      <TextInput
        style={styles.input}
        value={bssid}
        onChangeText={setBssid}
        keyboardType="numeric"
      />
      <Button title="Salvar" onPress={handleSave} />
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

export default NovaLeitura;
