class FrequenciaBSSIDPorAreaService {
    constructor(locais) {
      this.locais = locais; // Lista de locais
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
  
    calcularFrequenciaBSSIDPorArea(leituras) {
      const leiturasPorArea = this.agruparLeiturasPorArea(leituras);
      const frequenciaPorArea = {};
  
      // Itera sobre cada área e calcula a frequência dos BSSIDs
      for (const [idArea, leiturasNaArea] of Object.entries(leiturasPorArea)) {
        const leiturasPorBSSID = this.agruparLeiturasPorBSSID(leiturasNaArea);
        const totalLocaisNaArea = new Set(leiturasNaArea.map(leitura => leitura.idLocal)).size;
  
        frequenciaPorArea[idArea] = {};
  
        for (const [bssid, leiturasDoBSSID] of Object.entries(leiturasPorBSSID)) {
          // Quantidade de locais distintos onde esse BSSID apareceu na área
          const locaisDistintos = new Set(leiturasDoBSSID.map(leitura => leitura.idLocal)).size;
  
          // Calcula a frequência do BSSID na área
          const frequencia = (locaisDistintos / totalLocaisNaArea) * 100;
  
          frequenciaPorArea[idArea][bssid] = {
            locaisDistintos,
            totalLocaisNaArea,
            frequencia: `${frequencia.toFixed(2)}%`
          };
        }
      }
  
      return frequenciaPorArea;
    }
  
    analisarFrequenciaBSSIDPorArea(leituras) {
      const frequenciaPorArea = this.calcularFrequenciaBSSIDPorArea(leituras);
  
      // Exibe os resultados no console
      Object.entries(frequenciaPorArea).forEach(([idArea, bssidData]) => {
        console.log(`Área: ${idArea}`);
        Object.entries(bssidData).forEach(([bssid, dados]) => {
          console.log(`,${bssid}, ${dados.frequencia}`);
        });
        console.log('--------------------------------------');
      });
  
      return frequenciaPorArea; // Retorna a frequência calculada por área
    }
  }
  
  export default FrequenciaBSSIDPorAreaService;
  