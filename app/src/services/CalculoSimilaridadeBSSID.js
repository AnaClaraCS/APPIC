import LocalController from "../controllers/localController";
import LeituraController from "../controllers/leituraController";


class LocalSimilarityService {
  constructor() {
    this.localController = new LocalController();
  }

  // Método para dividir os locais entre base e teste
  async dividirLocaisBaseETeste() {
    const locais = await this.localController.obterLocais();
    const locaisTeste = locais.filter(local => local.descricao.includes('Teste'));
    const locaisBase = locais.filter(local => !local.descricao.includes('Teste'));
    console.log(`33333333333333`);
    return { locaisBase, locaisTeste };
  }

  // Calcular a posição e a área para um local de teste usando a similaridade
  async calcularPosicaoEAreaPorSimilaridade(localTeste, locaisBase) {
    let somaPesos = 0;
    let somaX = 0;
    let somaY = 0;
    const areaPesos = {}; // Para calcular a área mais provável
    console.log(`4444444444`);

    for (const localBase of locaisBase) {
      // Calcular a similaridade entre os dois locais
      const similaridade = await this.calcularSimilaridadeEntreLocais(localTeste.idLocal, localBase.idLocal);
      console.log(similaridade);
      // Usar a similaridade como peso para calcular as coordenadas
      somaPesos += similaridade;
      somaX += localBase.x * similaridade;
      somaY += localBase.y * similaridade;

      // Acumular pesos para as áreas
      areaPesos[localBase.idArea] = (areaPesos[localBase.idArea] || 0) + similaridade;
    }

    // Calcular coordenadas ponderadas
    const coordenadasCalculadas = {
      x: somaPesos ? somaX / somaPesos : 0,
      y: somaPesos ? somaY / somaPesos : 0,
    };

    // Calcular a área mais provável (a área com maior peso)
    const areaCalculada = Object.keys(areaPesos).reduce((a, b) => areaPesos[a] > areaPesos[b] ? a : b);

    return { coordenadasCalculadas, areaCalculada };
  }

  // Método para processar todos os locais de teste e exibir as informações calculadas
  async processarLocaisDeTeste() {
    const { locaisBase, locaisTeste } = await this.dividirLocaisBaseETeste();
    let qtd = 0;
    let mediaX = 0;
    let mediaY = 0;
    let maiorDistanciaX = 0;
    let maiorDistanciaY = 0;
    console.log(`2222222222222`);

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
      maiorDistanciaX = Math.max(maiorDistanciaX, diferencaX);
      maiorDistanciaY = Math.max(maiorDistanciaY, diferencaY);
      mediaX += diferencaX;
      mediaY += diferencaY;


      // Adicionar resultado à lista
      resultados.push({
        descricao: localTeste.descricao,
        xReal: localTeste.x,
        yReal: localTeste.y,
        areaReal: localTeste.idArea,
        xCalculada: coordenadasCalculadas.x,
        yCalculada: coordenadasCalculadas.y,
        areaCalculada: areaMaisFrequente
      });
    }

    mediaY /= qtd;
    console.log(`Médias nas coordenadas: (x: ${mediaX.toFixed(2)}, y: ${mediaY.toFixed(2)})`);
    console.log(`Maior distância (x: ${maiorDistanciaX.toFixed(2)}, y: ${maiorDistanciaY.toFixed(2)})`);
    return resultados;
  }

  // Calcular similaridade entre dois locais com base nas leituras
  async calcularSimilaridadeEntreLocais(idLocal1, idLocal2) {
    //const { default: LeituraController } = await import('../controllers/leituraController');
    const leituraController = new LeituraController();

    const leiturasLocal1 = await leituraController.obterLeiturasPorLocal(idLocal1);
    const leiturasLocal2 = await leituraController.obterLeiturasPorLocal(idLocal2);

    const mapaLeituras1 = this.criarMapaLeituras(leiturasLocal1);
    const mapaLeituras2 = this.criarMapaLeituras(leiturasLocal2);

    const bssidsComuns = Object.keys(mapaLeituras1).filter(bssid => bssid in mapaLeituras2);

    if (bssidsComuns.length === 0) {
      return 0;
    }

    let somaDiferencas = 0;
    bssidsComuns.forEach(bssid => {
      const diferencaRssi = Math.abs(mapaLeituras1[bssid] - mapaLeituras2[bssid]);
      somaDiferencas += diferencaRssi;
    });

    const diferencaMedia = somaDiferencas / bssidsComuns.length;
    const similaridade = 1 - diferencaMedia / 100;

    return Math.max(0, similaridade);
  }

  criarMapaLeituras(leituras) {
    const mapa = {};
    leituras.forEach(leitura => {
      mapa[leitura.bssid] = leitura.rssi;
    });
    return mapa;
  }
}

export default LocalSimilarityService;
