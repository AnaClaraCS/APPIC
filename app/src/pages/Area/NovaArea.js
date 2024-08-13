import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image } from 'react-native';
import AreaController from '../../controllers/areaController';
import { launchImageLibrary } from 'react-native-image-picker';

const NovaArea = ({ navigation }) => {
  const areaController = new AreaController();
  const [descricao, setDescricao] = useState('');
  const [andar, setAndar] = useState('');
  const [imagem, setImagem] = useState('');

  const handleSalvar = async () => {
    if(!validarInputs()){
      return;
    }
    const area = { descricao, andar};

    try {
      await areaController.criarArea(area, imagem);
      Alert.alert('Sucesso', 'Área salva');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar área' + area);
    }
  };

  const validarInputs = () => {
    if( !descricao || !andar || !imagem ){
      Alert.alert('Erro', 'Todos os campos devem ser preenchidos');
      return false;
    }
    return true;
  }

  const handleEscolherImagem = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('Usuário cancelou a seleção de imagem');
      } else if (response.error) {
        console.log('Erro:', response.error);
      } else {
        const { uri } = response.assets[0];
        console.log(uri);
        setImagem(uri);
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Descrição:</Text>
      <TextInput
        style={styles.input}
        value={descricao}
        onChangeText={setDescricao}
      />
      <Text style={styles.label}>Andar:</Text>
      <TextInput
        style={styles.input}
        value={andar}
        onChangeText={setAndar}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Imagem:</Text>
      {imagem && <Image source={{ uri: imagem }} style={styles.image} />}
      <Button title="Escolher Imagem" onPress={handleEscolherImagem} />
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
  image: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
});

export default NovaArea;
