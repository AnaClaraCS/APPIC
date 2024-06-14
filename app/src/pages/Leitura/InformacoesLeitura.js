import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, Pressable } from 'react-native';
import LeituraController from '../../controllers/leituraController';

const InformacoesLeitura = ({ route, navigation }) => {
  const { leituraId } = route.params;
  const leituraController = new LeituraController();

  const [leitura, setLeitura] = useState(null);
  const [rede, setRede] = useState(null);
  const [local, setLocal] = useState(null);

  useEffect(() => {
    carregarLeitura();
  }, []);

  const carregarLeitura = async () => {
    try {
      const leituraCarregado = await leituraController.obterLeitura(leituraId);
      if (leituraCarregado) {
        setLeitura(leituraCarregado);
        const rede = await leituraController.obterRedeLeitura(leituraId)
        setRede(rede);
        const local = await leituraController.obterLocalLeitura(leituraId)
        setLocal(local);
      } else {
        Alert.alert('Erro', 'Leitura não encontrado');
        navigation.goBack();
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao carregar informações do leitura');
      navigation.goBack();
    }
  };

  const handleExcluir = async () => {
    try {
      await leituraController.deletarLeitura(leituraId);
      Alert.alert('Sucesso', 'Leitura excluído com sucesso');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao excluir leitura');
    }
  };

  return (
    <View style={styles.container}>
      {leitura && rede && local && (
        <>
          <Text style={styles.label}>Descrição do local:</Text>
          <Text style={styles.text}> {local.descricao} </Text>
          <Text style={styles.label}> Coordenada do local:</Text>
          <Text style={styles.text}> x: {local.x}, y: {local.y}, andar: {local.andar}</Text>

          <Text style={styles.label}>Nome da rede:</Text>
          <Text style={styles.text}> {rede.nome} </Text>
          <Text style={styles.label}>BSSID:</Text>
          <Text style={styles.text}> {rede.bssid} </Text>

          <Text style={styles.label}>RSSI:</Text>
          <Text style={styles.text}> {leitura.rssi} </Text>
          <Text style={styles.label}>Data:</Text>
          <Text style={styles.text}> {leitura.data} </Text>

          
          <Button title="Excluir" onPress={handleExcluir} />
          
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
      fontWeight: 'bold',
    },
    text: {
      fontSize: 16,
      marginBottom: 16,
    },
  });

export default InformacoesLeitura;
