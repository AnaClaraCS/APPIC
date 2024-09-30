import React, { useState } from 'react';
import { View, Text, Button, ScrollView } from 'react-native';
import LocalService from '../../services/LocalService';
import SeparaLeituras from '../../services/SeparaLeituras'
import LeituraAnaliseService from '../../services/LeituraAnaliseService';
import TestarPrecisaoService from '../../services/TestarPrecisaoService';
import FrequenciaBSSIDPorAreaService from '../../services/FrequenciaBSSIDPorAreaService';
import BSSIDExclusivosPorAreaService from '../../services/BSSIDExclusivosPorAreaService';

const LocalSimilarityScreen = () => {
  const [loading, setLoading] = useState(false);


  // Função para processar os BSSIDs e classificá-los por área
  const processar = async () => {
    setLoading(true); // Inicia o carregamento
    try {
      const localService = new LocalService();
      const { locaisTeste, locaisBase } = await localService.classificarLocais();
      console.log("Terminou local service -----------------");
  
      const separaLeituras = new SeparaLeituras();
      const leiturasBase = await separaLeituras.filtrarLeiturasPorLocais(locaisBase);
      const leiturasTeste = await separaLeituras.filtrarLeiturasPorLocais(locaisTeste);
      
      console.log("Terminou separa leituras --------------");
  
      //const leituraAnaliseService = new LeituraAnaliseService(locaisBase);
      //const leiturasFiltradas = await leituraAnaliseService.analisarLeiturasPorBSSID(leiturasBase); // Certifique-se de aguardar a Promise aqui
  
      // console.log("Terminou análise das leituras --------------");
  
      //const frequencia = new BSSIDExclusivosPorAreaService(locaisBase);
      //frequencia.analisarBSSIDExclusivosPorArea(leiturasBase);

      const testarPrecisaoService = new TestarPrecisaoService(locaisTeste, leiturasTeste);
      testarPrecisaoService.principal();
     
  
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  };
  

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button title="Processar" onPress={processar} />
      
      {loading && <Text>Processando...</Text>}

     
    </View>
  );
};

export default LocalSimilarityScreen;
