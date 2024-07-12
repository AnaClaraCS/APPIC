import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import CalculoService from '../../services/Calculo3Service'; 

const ResultadoLeiturasScreen = () => {
  const [resultado, setResultado] = useState(0);

  useEffect(() => {
    async function carregarLeiturasFiltradas() {
      try {
        const  resultado = await CalculoService.calcularLeiturasFiltradas();
        setResultado(resultado);
      } catch (error) {
        console.error('Erro ao carregar:', error);
        // Tratar o erro conforme necessário
      }
    }

    carregarLeiturasFiltradas();
  }, []);

  const handleLeituraPress = (idLeitura) => {
    // Implementação do handler para quando uma leitura é pressionada
    console.log('Leitura pressionada:', idLeitura);
  };

  return (
    <Text>Vazio = {resultado}</Text>
    // <ScrollView style={styles.container}>
    //   {Object.entries(contagemPorLocal).map(([local, contagem]) => (
    //     <View key={local} style={styles.localItem}>
    //       <Text style={styles.localText}>{`${local}: ${contagem} leituras`}</Text>
    //     </View>
    //   ))}
    //   {/* {leituras.map((leitura, index) => (
    //     <Pressable key={`${leitura.idLeitura}-${index}`} onPress={() => handleLeituraPress(leitura.idLeitura)} style={styles.leituraItem}>
    //       <Text>{`${leitura.idLeitura} - ${leitura.rssi} - ${leitura.data} - ${leitura.redeNome} - ${leitura.BSSID} - ${leitura.localDescricao}`}</Text>
    //     </Pressable>
    //   ))} */}
    // </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  leituraItem: {
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
});

export default ResultadoLeiturasScreen;
