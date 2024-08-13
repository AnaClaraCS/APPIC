import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image } from 'react-native';
import AreaController from '../../controllers/areaController';
import { launchImageLibrary } from 'react-native-image-picker';

const InformacoesArea = ({ route, navigation }) => {
  const { IdArea } = route.params;
  const areaController = new AreaController();

  const [area, setArea] = useState(null);
  const [descricao, setDescricao] = useState('');
  const [andar, setAndar] = useState('');
  const [imagem, setImagem] = useState('');
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    carregarArea();
  }, []);

  const carregarArea = async () => {
    try {
      const areaCarregada = await areaController.obterArea(IdArea);
      if (areaCarregada) {
        setArea(areaCarregada);
        setDescricao(areaCarregada.descricao);
        setAndar(areaCarregada.andar);
        setImagem(areaCarregada.imagem);
        console.log(areaCarregada.imagem);
      } else {
        Alert.alert('Erro', 'Área não encontrada');
        navigation.goBack();
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao carregar informações da área');
      navigation.goBack();
    }
  };

  const handleEditar = () => {
    setEditando(true);
  };

  const handleCancelar = () => {
    setEditando(false);
  };

  const handleSalvar = async () => {
    if (!validarInputs()) {
      return;
    }
    const areaAtualizada = { descricao, andar };
    try {
      await areaController.atualizarArea(IdArea, areaAtualizada, imagem);
      setEditando(false);
      Alert.alert('Sucesso', 'Área atualizada com sucesso');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao atualizar área');
    }
  };

  const validarInputs = () => {
    if (!descricao || !andar || !imagem) {
      Alert.alert('Erro', 'Todos os campos devem ser preenchidos');
      return false;
    }
    return true;
  };

  const handleExcluir = async () => {
    try {
      await areaController.deletarArea(IdArea);
      Alert.alert('Sucesso', 'Área excluída com sucesso');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao excluir área');
    }
  };

  const handleEscolherImagem = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('Usuário cancelou a seleção de imagem');
      } else if (response.error) {
        console.log('Erro:', response.error);
      } else {
        const { uri } = response.assets[0];
        setImagem(uri);
      }
    });
  };

  return (
    <View style={styles.container}>
      {area && (
        <>
          <Text style={styles.label}>Descrição:</Text>
          <TextInput
            style={styles.input}
            value={descricao}
            onChangeText={setDescricao}
            editable={editando}
          />
          <Text style={styles.label}>Andar:</Text>
          <TextInput
            style={styles.input}
            value={andar}
            onChangeText={setAndar}
            keyboardType="numeric"
            editable={editando}
          />
          <Text style={styles.label}>Imagem:</Text>
          {imagem ? (
            <Image source={{ uri: imagem }} style={styles.image} />
          ) : (
            <Text style={styles.noImageText}>Nenhuma imagem selecionada</Text>
          )}
          {editando && (
            <>
              <Button title="Escolher Imagem" onPress={handleEscolherImagem} />
              <Button title="Salvar" onPress={handleSalvar} />
              <Button title="Cancelar" onPress={handleCancelar} />
            </>
          )}
          {!editando && (
            <>
              <Button title="Editar" onPress={handleEditar} />
              <Button title="Excluir" onPress={handleExcluir} />
            </>
          )}
        </>
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
  image: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
});

export default InformacoesArea;
