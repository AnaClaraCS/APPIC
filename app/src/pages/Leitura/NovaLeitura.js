import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const NovaLeitura = ({ navigation }) => {
  const [sensorId, setSensorId] = useState('');
  const [value, setValue] = useState('');
  const [timestamp, setTimestamp] = useState('');

  const handleSave = async () => {
    const leitura = { sensorId, value, timestamp };

    try {
      const response = await fetch('http://localhost:3000/locais', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leitura),
      });

      if (response.ok) {
        navigation.goBack();
      } else {
        alert('Erro ao salvar a leitura');
      }
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
        value={sensorId}
        onChangeText={setSensorId}
      />
      <Text style={styles.label}>Valor:</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={setValue}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Timestamp:</Text>
      <TextInput
        style={styles.input}
        value={timestamp}
        onChangeText={setTimestamp}
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
