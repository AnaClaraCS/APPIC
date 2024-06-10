// screens/NovaRede.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import RedeController from '../../controllers/redeController';

const NovaRede = ({ navigation }) => {
  const redeController = new RedeController();
  const [nome, setNome] = useState('');
  const [bssid, setBssid] = useState('');

  const handleSave = async () => {
    const rede = { nome, bssid };

    try {
      await redeController.criarRede(rede);
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar a rede');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome:</Text>
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
      />
      <Text style={styles.label}>BSSID:</Text>
      <TextInput
        style={styles.input}
        value={bssid}
        onChangeText={setBssid}
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

export default NovaRede;
