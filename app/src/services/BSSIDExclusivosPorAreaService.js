import BssidAreaController from '../controllers/bssidAreaController'; // Importa o controller para salvar no Firebase

class FrequenciaBSSIDPorAreaService {
  constructor(locais) {
    this.locais = locais;
    this.bssidAreaController = new BssidAreaController(); // Instancia o controller para salvar BSSIDs no Firebase
  }

  obterIdAreaPorIdLocal(idLocal) {
    const local = this.locais.find(local => local.idLocal === idLocal);
    return local ? local.idArea : null;
  }

  agruparLeiturasPorArea(leituras) {
    const leiturasPorArea = {};

    leituras.forEach(leitura => {
      const idArea = this.obterIdAreaPorIdLocal(leitura.idLocal);

      if (idArea) {
        if (!leiturasPorArea[idArea]) {
          leiturasPorArea[idArea] = [];
        }
        leiturasPorArea[idArea].push(leitura);
      }
    });

    return leiturasPorArea;
  }

  agruparLeiturasPorBSSID(leituras) {
    return leituras.reduce((grupos, leitura) => {
      const { bssid } = leitura;
      if (!grupos[bssid]) {
        grupos[bssid] = [];
      }
      grupos[bssid].push(leitura);
      return grupos;
    }, {});
  }

  calcularBSSIDComFrequenciaTotal(leituras) {
    const leiturasPorArea = this.agruparLeiturasPorArea(leituras);
    const bssidFrequenciaTotal = {};

    // Itera sobre cada área
    for (const [idArea, leiturasNaArea] of Object.entries(leiturasPorArea)) {
      const leiturasPorBSSID = this.agruparLeiturasPorBSSID(leiturasNaArea);
      const totalLocaisNaArea = new Set(leiturasNaArea.map(leitura => leitura.idLocal)).size;

      bssidFrequenciaTotal[idArea] = [];

      for (const [bssid, leiturasDoBSSID] of Object.entries(leiturasPorBSSID)) {
        const locaisDistintos = new Set(leiturasDoBSSID.map(leitura => leitura.idLocal)).size;
        const frequencia = locaisDistintos === totalLocaisNaArea ? 100 : 0;

        if (frequencia === 100) {
          bssidFrequenciaTotal[idArea].push({ bssid, leituras: leiturasDoBSSID });
        }
      }
    }

    return bssidFrequenciaTotal;
  }

  calcularMediaRSSI(bssidPorArea) {
    const bssidComMediaRSSI = {};

    Object.entries(bssidPorArea).forEach(([idArea, bssidData]) => {
      bssidComMediaRSSI[idArea] = bssidData.map(({ bssid, leituras }) => {
        const mediaRSSI = leituras.reduce((total, l) => total + l.rssi, 0) / leituras.length;
        return { bssid, mediaRSSI };
      });

      // Ordena os BSSID pela média de RSSI e seleciona no máximo 5
      bssidComMediaRSSI[idArea] = bssidComMediaRSSI[idArea]
        .sort((a, b) => b.mediaRSSI - a.mediaRSSI)
        .slice(0, 5);
    });

    return bssidComMediaRSSI;
  }

  // Nova função para identificar BSSIDs exclusivos por área
  identificarBSSIDExclusivos(leiturasPorArea) {
    const bssidAreasMap = {};

    // Mapeia os BSSIDs para todas as áreas em que aparecem
    Object.entries(leiturasPorArea).forEach(([idArea, leiturasNaArea]) => {
      const leiturasPorBSSID = this.agruparLeiturasPorBSSID(leiturasNaArea);

      for (const bssid in leiturasPorBSSID) {
        if (!bssidAreasMap[bssid]) {
          bssidAreasMap[bssid] = new Set();
        }
        bssidAreasMap[bssid].add(idArea);
      }
    });

    const bssidExclusivosPorArea = {};

    // Filtra os BSSIDs que aparecem em apenas uma área
    Object.entries(bssidAreasMap).forEach(([bssid, areas]) => {
      if (areas.size === 1) {
        const idArea = Array.from(areas)[0];
        if (!bssidExclusivosPorArea[idArea]) {
          bssidExclusivosPorArea[idArea] = [];
        }
        bssidExclusivosPorArea[idArea].push(bssid);
      }
    });

    return bssidExclusivosPorArea;
  }

  async salvarBSSIDSelecionados(bssidComMediaRSSI, bssidExclusivosPorArea) {
    // Para cada área, salvar os BSSIDs selecionados e exclusivos no Firebase
    for (const [idArea, bssidData] of Object.entries(bssidComMediaRSSI)) {
      const listaBssid = bssidData.map(({ bssid }) => bssid);
      const listaBssidExclusivos = bssidExclusivosPorArea[idArea] || [];

      // Salva os BSSIDs no Firebase utilizando o BssidAreaController
      console.log(`listaBssid: ${listaBssid}`);
      console.log(`listaBssidExclusivos: ${listaBssidExclusivos}`);
      try {
        await this.bssidAreaController.salvarBssidArea({
          idArea,
          bssid_100frequentes: listaBssid || [],
          bssid_exclusivos: listaBssidExclusivos || []
        });
        console.log(`BSSIDs salvos com sucesso para a área: ${idArea}`);
      } catch (error) {
        console.error(`Erro ao salvar BSSIDs para a área ${idArea}:`, error);
      }
    }
  }

  async analisarBSSIDExclusivosPorArea(leituras) {
    // Passo 0: Filtrar as leituras com RSSI menor que -70
    const leiturasFiltradas = leituras.filter(leitura => leitura.rssi >= -70);

    // Passo 1: Calcular a frequência de BSSID com 100% por área
    let bssidFrequenciaTotal = this.calcularBSSIDComFrequenciaTotal(leiturasFiltradas);

    // Passo 2: Calcular a média de RSSI para os BSSID restantes e selecionar os 5 com maior média
    const bssidComMediaRSSI = this.calcularMediaRSSI(bssidFrequenciaTotal);

    // Passo 3: Identificar BSSIDs exclusivos por área
    const bssidExclusivosPorArea = this.identificarBSSIDExclusivos(bssidFrequenciaTotal);

    // Exibir resultados
    Object.entries(bssidComMediaRSSI).forEach(([idArea, bssidData]) => {
      console.log(`Área: ${idArea}`);
      bssidData.forEach(({ bssid, mediaRSSI }) => {
        console.log(`BSSID: ${bssid} - Média de RSSI: ${mediaRSSI.toFixed(2)}`);
      });
      console.log('--------------------------------------');
    });

    // Exibir BSSIDs exclusivos
    Object.entries(bssidExclusivosPorArea).forEach(([idArea, bssids]) => {
      console.log(`Área: ${idArea} - BSSID Exclusivos: ${bssids.join(', ')}`);
      console.log('--------------------------------------');
    });

    // Passo 4: Salvar os BSSID selecionados e exclusivos no Firebase
    await this.salvarBSSIDSelecionados(bssidComMediaRSSI, bssidExclusivosPorArea);

    return { bssidComMediaRSSI, bssidExclusivosPorArea }; // Retorna os BSSIDs selecionados e exclusivos por área
  }
}

export default FrequenciaBSSIDPorAreaService;
