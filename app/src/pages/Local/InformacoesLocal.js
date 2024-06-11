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

  useEffect(() => {
    // Carregar informações do local ao iniciar o componente
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
        // Tratar caso o local não seja encontrado
        Alert.alert('Erro', 'Local não encontrado');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao carregar informações do local');
    }
  };

  const handleEditar = async () => {
    const localAtualizado = { descricao, x, y, andar };
    try {
      await localController.atualizarLocal(localId, localAtualizado);
      Alert.alert('Sucesso', 'Local atualizado com sucesso');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao atualizar local');
    }
  };

  const handleExcluir = async () => {
    try {
      await localController.deletarLocal(localId);
      Alert.alert('Sucesso', 'Local excluído com sucesso');
      // Voltar para a tela anterior após excluir o local
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao excluir local');
    }
  };

  const cadastrarLeituras = () => {
    // Aqui você pode chamar a função do serviço de local para cadastrar leituras
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
          />
          <Text style={styles.label}>Coordenada X:</Text>
          <TextInput
            style={styles.input}
            value={x}
            onChangeText={setX}
            keyboardType="numeric"
          />
          <Text style={styles.label}>Coordenada Y:</Text>
          <TextInput
            style={styles.input}
            value={y}
            onChangeText={setY}
            keyboardType="numeric"
          />
          <Text style={styles.label}>Andar:</Text>
          <TextInput
            style={styles.input}
            value={andar}
            onChangeText={setAndar}
            keyboardType="numeric"
          />
          <Button title="Editar" onPress={handleEditar} />
          <Button title="Excluir" onPress={handleExcluir} />
          <Button title="Cadastrar Leituras" onPress={cadastrarLeituras} />
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
