import LeituraController from "../controllers/leituraController";
import LocalController from "../controllers/localController";

class LocalRSSICoordinateService {
  constructor() {
    this.leituraController = new LeituraController();
    this.localController = new LocalController();
  }

  // Método para processar todos os locais de teste e calcular as coordenadas por leitura de RSSI
  async processarLocaisDeTeste() {
    const { locaisBase, locaisTeste } = await this.dividirLocaisBaseETeste();

    for (const localTeste of locaisTeste) {
      console.log(`Processando local teste: ${localTeste.descricao}`);
      const leiturasTeste = await this.leituraController.obterLeiturasPorLocal(localTeste.idLocal);

      let leiturasCoincidentes = [];

      for (const leituraTeste of leiturasTeste) {
        // Obter leituras coincidentes com base no BSSID
        const leiturasBase = await this.encontrarLeiturasCoincidentesPorBssid(leituraTeste.bssid, locaisBase);
        leiturasCoincidentes.push(...leiturasBase);
      }

      const ocorrenciasPorArea = this.contarOcorrenciasPorArea(leiturasCoincidentes);

      if (leiturasCoincidentes.length === 0) {
        console.log(`Nenhuma leitura coincidente encontrada para o local teste: ${localTeste.descricao}`);
        continue;
      }
      
      const areaMaisFrequente = this.encontrarAreaMaisFrequente(ocorrenciasPorArea);
      const leiturasFiltradas = leiturasCoincidentes.filter(leitura => leitura.area === areaMaisFrequente);

      const coordenadasCalculadas = this.calcularMediaCoordenadas(leiturasFiltradas);

      // Exibir a posição real do local de teste, incluindo o idArea
      console.log(`Posição real: (x: ${localTeste.x}, y: ${localTeste.y}, área: ${localTeste.idArea})`);

      // Exibir a posição calculada, incluindo o idArea mais frequente
      console.log(`Posição calculada: (x: ${coordenadasCalculadas.x.toFixed(2)}, y: ${coordenadasCalculadas.y.toFixed(2)}, área: ${areaMaisFrequente})`);
    }
  }

  // Método para encontrar leituras coincidentes por BSSID e filtrar locais de teste
  async encontrarLeiturasCoincidentesPorBssid(bssid, locaisBase) {
    // Obter todas as leituras pelo BSSID
    const leiturasPorBssid = await this.leituraController.obterLeiturasPorBssid(bssid);
    
    // Obter os locais de teste para remover leituras desses locais
    const { locaisTeste } = await this.dividirLocaisBaseETeste();
    const locaisTesteIds = locaisTeste.map(local => local.idLocal);

    // Filtrar leituras que não pertencem a locais de teste
    const leiturasFiltradas = leiturasPorBssid.filter(leitura => !locaisTesteIds.includes(leitura.idLocal));

    let leiturasCoincidentes = [];

    for (const leituraFiltrada of leiturasFiltradas) {
      const localBase = locaisBase.find(local => local.idLocal === leituraFiltrada.idLocal);
      if (localBase) {
        //console.log(`Leitura coincidente encontrada: BSSID: ${leituraFiltrada.bssid}, RSSI: ${leituraFiltrada.rssi}, Local: ${localBase.descricao}, X: ${localBase.x}, Y: ${localBase.y}, Área: ${localBase.idArea}`);
        leiturasCoincidentes.push({
          bssid: leituraFiltrada.bssid,
          rssi: leituraFiltrada.rssi,
          x: localBase.x,
          y: localBase.y,
          area: localBase.idArea
        });
      }
    }

    return leiturasCoincidentes;
  }

  // Contar ocorrências de cada área
  contarOcorrenciasPorArea(leituras) {
    const ocorrencias = {};
    leituras.forEach(leitura => {
      ocorrencias[leitura.area] = (ocorrencias[leitura.area] || 0) + 1;
    });
    return ocorrencias;
  }

  // Encontrar a área mais frequente
  encontrarAreaMaisFrequente(ocorrenciasPorArea) {
    const areas = Object.keys(ocorrenciasPorArea);
    
    if (areas.length === 0) {
      console.log('Nenhuma área foi encontrada para calcular a área mais frequente');
    }
  
    return areas.reduce((a, b) => ocorrenciasPorArea[a] > ocorrenciasPorArea[b] ? a : b);
  }
  

  // Calcular a média das coordenadas (x, y) das leituras filtradas
  calcularMediaCoordenadas(leituras) {
    let somaX = 0;
    let somaY = 0;
    leituras.forEach(leitura => {
      somaX += leitura.x;
      somaY += leitura.y;
    });
    return {
      x: somaX / leituras.length,
      y: somaY / leituras.length
    };
  }

  // Método para dividir os locais entre base e teste
  async dividirLocaisBaseETeste() {
    const locais = await this.localController.obterLocais();
    const locaisTeste = locais.filter(local => local.descricao.includes('Teste'));
    const locaisBase = locais.filter(local => !local.descricao.includes('Teste'));
    return { locaisBase, locaisTeste };
  }
}

export default LocalRSSICoordinateService;
