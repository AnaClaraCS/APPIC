import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import LocalController from '../../controllers/localController';

const NovoLocal = ({ route, navigation }) => {
  const { idArea, x, y } = route.params;
  const localController = new LocalController();
  const [descricao, setDescricao] = useState('');
  // const [x, setX] = useState('');
  // const [y, setY] = useState('');

  const handleSalvar = async () => {
    if(!validarInputs()){
      return;
    }
    const local = { descricao, x, y, idArea};

    try {
      await localController.criarLocal(local);
      alert('Local salvo');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar o local'+local);
    }
  };

  const validarInputs = () => {
    if(!x || !y || !idArea){
      Alert.alert('Erro', 'Erro ao passar informações da área do local');
      return false;
    }
    else if( !descricao ){
      Alert.alert('Erro', 'Todos os campos devem ser preenchidos');
      return false;
    }
    return true;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Descrição:</Text>
      <TextInput
        style={styles.input}
        value={descricao}
        onChangeText={setDescricao}
      />
      <Text style={styles.label}>Coordenada X: {x}</Text>
      {/* <TextInput
        style={styles.input}
        value={x}
        onChangeText={setX}
        keyboardType="numeric"
      /> */}
      <Text style={styles.label}>Coordenada Y:{y}</Text>
      {/* <TextInput
        style={styles.input}
        value={y}
        onChangeText={setY}
        keyboardType="numeric"
      /> */}
      <Text style={styles.label}>idArea:{idArea}</Text>
      <Button title="Salvar" onPress={handleSalvar} />
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
