import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import LocalController from '../../controllers/localController';
import LeituraService from '../../services/LeituraService';

const InformacoesLocal = ({ route, navigation }) => {
  const { localId } = route.params;
  const localController = new LocalController();

  const [local, setLocal] = useState(null);
  const [descricao, setDescricao] = useState('');
  const [x, setX] = useState('');
  const [y, setY] = useState('');
  const [andar, setAndar] = useState('');
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    carregarLocal();
  }, []);

  const carregarLocal = async () => {
    try {
      const localCarregado = await localController.obterLocal(localId);
      if (localCarregado) {
        setLocal(localCarregado);
        setDescricao(localCarregado.descricao);
        setX(localCarregado.x);
        setY(localCarregado.y);
        setAndar(localCarregado.andar);
      } else {
        Alert.alert('Erro', 'Local não encontrado');
        navigation.goBack();
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao carregar informações do local');
      navigation.goBack();
    }
  };

  const handleEditar = async () => {
    setDescricao(local.descricao);
    setX(local.x);
    setY(local.y);
    setAndar(local.andar);
    setEditando(true);
  };

  const handleCancelar = async () => {
    setEditando(false);
  };

  const handleSalvar = async () => {
    if (!validarInputs()) {
      return;
    }
    const localAtualizado = { descricao, x, y, andar };
    try {
      await localController.atualizarLocal(localId, localAtualizado);
      Alert.alert('Sucesso', 'Local atualizado com sucesso');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao atualizar local');
    }
  };

  const validarInputs = () => {
    if( !descricao || !x || !y || !andar ){
      Alert.alert('Erro', 'Todos os campos devem ser preenchidos');
      return false;
    }
    return true;
  }

  const handleExcluir = async () => {
    try {
      await localController.deletarLocal(localId);
      Alert.alert('Sucesso', 'Local excluído com sucesso');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao excluir local');
    }
  };

  const cadastrarLeituras = () => { 
    LeituraService.cadastrarLeituras(localId);
  };

  return (
    <View style={styles.container}>
      {local && (
        <>
          <Text style={styles.label}>Descrição:</Text>
          <TextInput
            style={styles.input}
            value={descricao}
            onChangeText={setDescricao}
            editable={editando}
          />
          <Text style={styles.label}>Coordenada X:</Text>
          <TextInput
            style={styles.input}
            value={x}
            onChangeText={setX}
            keyboardType="numeric"
            editable={editando}
          />
          <Text style={styles.label}>Coordenada Y:</Text>
          <TextInput
            style={styles.input}
            value={y}
            onChangeText={setY}
            keyboardType="numeric"
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
          {editando && (
            <>
              <Button title="Salvar" onPress={handleSalvar} />
              <Button title="Cancelar" onPress={handleCancelar} />
            </>
          )}
          {!editando && (
            <>
            <Button title="Editar" onPress={handleEditar} />
            <Button title="Excluir" onPress={handleExcluir} />
            <Button title="Cadastrar Leituras" onPress={cadastrarLeituras} />
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
});

export default InformacoesLocal;
