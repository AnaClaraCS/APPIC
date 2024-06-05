import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const NovoLocal = ({ navigation }) => {
  const [descricao, setDescricao] = useState('');
  const [coordX, setCoordX] = useState('');
  const [coordY, setCoordY] = useState('');
  const [andar, setAndar] = useState('');

  const handleSave = async () => {
    const local = { descricao, coordX, coordY, andar };
    console.log(local);

    try {
      const response = await fetch('http://10.0.2.2:3000/api/locais', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(local),
      });

      if (response.ok) {
        navigation.goBack();
      } else {
        alert('Erro ao salvar o local em response');
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar o local');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Descrição:</Text>
      <TextInput
        style={styles.input}
        value={descricao}
        onChangeText={setDescricao}
      />
      <Text style={styles.label}>Coordenada X:</Text>
      <TextInput
        style={styles.input}
        value={coordX}
        onChangeText={setCoordX}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Coordenada Y:</Text>
      <TextInput
        style={styles.input}
        value={coordY}
        onChangeText={setCoordY}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Andar:</Text>
      <TextInput
        style={styles.input}
        value={andar}
        onChangeText={setAndar}
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

export default NovoLocal;
