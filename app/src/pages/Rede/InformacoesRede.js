import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import RedeController from '../../controllers/redeController';

const InformacoesRede = ({ route, navigation }) => {
  const { bssid } = route.params;
  const redeController = new RedeController();

  const [rede, setRede] = useState(null);
  const [nome, setNome] = useState('');
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    carregarRede();
  }, []);

  const carregarRede = async () => {
    try {
      const redeCarregada = await redeController.obterRede(bssid);
      if (redeCarregada) {
        setRede(redeCarregada);
        setNome(redeCarregada.nome);
      } else {
        Alert.alert('Erro', 'Rede não encontrada');
        navigation.goBack();
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao carregar informações da rede');
      navigation.goBack();
    }
  };

  const handleEditar = async () => {
    setNome(rede.nome);
    setEditando(true);
  };

  const handleCancelar = async () => {
    setEditando(false);
  };

  const handleSalvar = async () => {
    if (!validarInputs()) {
      return;
    }
    const redeAtualizada = { nome, x, y, andar };
    try {
      await redeController.atualizarRede(bssid, redeAtualizada);
      Alert.alert('Sucesso', 'Rede atualizada com sucesso');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao atualizar rede');
    }
  };

  const validarInputs = () => {
    if( !nome ){
      Alert.alert('Erro', 'Todos os campos devem ser preenchidos');
      return false;
    }
    return true;
  }

  const handleExcluir = async () => {
    try {
      await redeController.deletarRede(bssid);
      Alert.alert('Sucesso', 'Rede excluída com sucesso');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao excluir rede');
    }
  };

  return (
    <View style={styles.container}>
      {rede && (
        <>
          <Text style={styles.label}>Descrição:</Text>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            editable={editando}
          />
          <Text style={styles.label}>BSSID:</Text>
          <TextInput
            style={styles.input}
            value={bssid}
            editable={false}
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

export default InformacoesRede;
