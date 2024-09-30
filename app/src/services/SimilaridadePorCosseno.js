class LocalSimilarityService {
    constructor() {
      this.localController = new LocalController();
      this.leituraController = new LeituraController();
    }
  
    // Método para dividir os locais entre base e teste
    async dividirLocaisBaseETeste() {
      const locais = await this.localController.obterLocais();
  
      const locaisTeste = locais.filter(local => local.descricao.includes('teste'));
      const locaisBase = locais.filter(local => !local.descricao.includes('teste'));
  
      return { locaisBase, locaisTeste };
    }
  
    // Criar vetores de leituras de RSSI para um local
    async criarVetorRSSI(idLocal) {
      const leituras = await this.leituraController.obterLeiturasPorLocal(idLocal);
      const vetorRSSI = {};
  
      // Criar um vetor onde a chave é o BSSID e o valor é o RSSI
      leituras.forEach(leitura => {
        vetorRSSI[leitura.bssid] = leitura.rssi;
      });
  
      return vetorRSSI;
    }
  
    // Calcular similaridade cosseno entre dois locais
    async calcularSimilaridadeCosseno(idLocal1, idLocal2) {
      const vetor1 = await this.criarVetorRSSI(idLocal1);
      const vetor2 = await this.criarVetorRSSI(idLocal2);
  
      let numerador = 0;
      let somaQuadrados1 = 0;
      let somaQuadrados2 = 0;
  
      // Iterar pelos bssids presentes em ambos os vetores
      for (const bssid in vetor1) {
        const rssi1 = vetor1[bssid];
        const rssi2 = vetor2[bssid] || 0;
  
        numerador += rssi1 * rssi2;
        somaQuadrados1 += rssi1 * rssi1;
        somaQuadrados2 += rssi2 * rssi2;
      }
  
      // Evitar divisão por zero
      if (somaQuadrados1 === 0 || somaQuadrados2 === 0) {
        return 0;
      }
  
      // Calcular a similaridade cosseno
      return numerador / (Math.sqrt(somaQuadrados1) * Math.sqrt(somaQuadrados2));
    }
  
    // Calcular a posição e a área para um local de teste usando a similaridade cosseno
    async calcularPosicaoEAreaPorSimilaridade(localTeste, locaisBase) {
      let somaPesos = 0;
      let somaX = 0;
      let somaY = 0;
      
      const areaPesos = {}; // Para calcular a área mais provável
  
      for (const localBase of locaisBase) {
        // Calcular a similaridade cosseno entre os dois locais
        const similaridade = await this.calcularSimilaridadeCosseno(localTeste.idLocal, localBase.idLocal);
  
        // Usar a similaridade como peso para calcular as coordenadas
        somaPesos += similaridade;
        somaX += localBase.x * similaridade;
        somaY += localBase.y * similaridade;
  
        // Acumular pesos para as áreas
        if (areaPesos[localBase.idArea]) {
          areaPesos[localBase.idArea] += similaridade;
        } else {
          areaPesos[localBase.idArea] = similaridade;
        }
      }
  
      // Calcular coordenadas ponderadas
      const coordenadasCalculadas = {
        x: somaPesos ? somaX / somaPesos : 0,
        y: somaPesos ? somaY / somaPesos : 0
      };
  
      // Calcular a área mais provável (a área com maior peso)
      const areaCalculada = Object.keys(areaPesos).reduce((a, b) => areaPesos[a] > areaPesos[b] ? a : b);
  
      return { coordenadasCalculadas, areaCalculada };
    }
  
    // Método para processar todos os locais de teste e exibir as informações calculadas
    async processarLocaisDeTeste() {
      const { locaisBase, locaisTeste } = await this.dividirLocaisBaseETeste();
      const qtd = 0;
      const mediaX = 0;
      const mediaY = 0;
      const maiorDistanciaX = 0;
      const maiorDistanciaY = 0;
  
  
      for (const localTeste of locaisTeste) {
        const { coordenadasCalculadas, areaCalculada } = await this.calcularPosicaoEAreaPorSimilaridade(localTeste, locaisBase);
  
        // Exibir no console as coordenadas reais, calculadas, e a diferença
        const diferencaX = Math.abs(localTeste.x - coordenadasCalculadas.x);
        const diferencaY = Math.abs(localTeste.y - coordenadasCalculadas.y);
  
        console.log(`Local Teste: ${localTeste.descricao}`);
        console.log(`Coordenadas Reais: (x: ${localTeste.x}, y: ${localTeste.y})`);
        console.log(`Coordenadas Calculadas: (x: ${coordenadasCalculadas.x.toFixed(2)}, y: ${coordenadasCalculadas.y.toFixed(2)})`);
        console.log(`Área Real: ${localTeste.idArea}`);
        console.log(`Área Calculada: ${areaCalculada}`);
        console.log(`Diferença nas coordenadas: (x: ${diferencaX.toFixed(2)}, y: ${diferencaY.toFixed(2)})`);
        console.log('---------------------------------------------');
        
        qtd++;
        if(maiorDistanciaX < diferencaX) maiorDistanciaX = diferencaX;
        if(maiorDistanciaY < diferencaY) maiorDistanciaY = diferencaY;
        mediaX+=diferencaX;
        mediaY+=diferencaY;

      }
      mediaX/=qtd;
      mediaY/=qtd;
      console.log(`Medias nas coordenadas: (x: ${mediaX.toFixed(2)}, y: ${mediaY.toFixed(2)})`);
      console.log(`Maior distancia (x: ${maiorDistanciaX.toFixed(2)}, y: ${maiorDistanciaY.toFixed(2)})`);
    }
  }
  
  export default LocalSimilarityService;
  