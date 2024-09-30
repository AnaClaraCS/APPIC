import LeiturasFiltradasController from "../controllers/leiturasFiltradasController";

class LeituraAnaliseService {
  constructor(locais) {
    this.locais = locais; // Recebe a lista de locais
    this.leiturasFiltradasController = new LeiturasFiltradasController();
  }

  obterIdAreaPorIdLocal(idLocal) {
    const local = this.locais.find(local => local.idLocal === idLocal);
    return local ? local.idArea : null;
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

  async salvarLeiturasFiltradas(leiturasFiltradas) {
    for (const leitura of leiturasFiltradas) {
      await this.leiturasFiltradasController.salvarLeituraFiltrada(leitura);
    }
  }  
  
  async analisarLeiturasPorBSSID(leituras) {
    const leiturasPorBSSID = this.agruparLeiturasPorBSSID(leituras);
    const leiturasFiltradas = [];
    let qtd = 0;

    Object.entries(leiturasPorBSSID).forEach(([bssid, leituras]) => {
      const rssiValores = [...new Set(leituras.map(l => l.rssi))];
      const idAreas = [...new Set(leituras.map(l => this.obterIdAreaPorIdLocal(l.idLocal)))];
      qtd++;
      console.log(`--------------------------------------`);
      console.log(`${qtd} -- ${bssid}`);

      // Caso 1: Se todas as leituras têm o mesmo valor de RSSI
      if (rssiValores.length === 1) {
        const rssiUnico = rssiValores[0];
        console.log(`Caso 1 - Todas as leituras têm o mesmo RSSI (${rssiUnico})`);

        if (idAreas.length === 1) {
          console.log(`O bssid ${bssid} e rssi ${rssiUnico} são da Área: ${idAreas[0]}`);
          leiturasFiltradas.push(leituras[0]);
        } else {
          console.log(`O bssid ${bssid} e rssi ${rssiUnico} estão presentes em duas áreas`);
        }
      } 
      // Caso 2: Se as leituras têm valores diferentes de RSSI
      else {
        console.log(`Caso 2 - As leituras têm valores diferentes de RSSI para o bssid ${bssid}`);

        if (idAreas.length === 1) {
          const maiorRSSI = Math.max(...leituras.map(l => l.rssi));
          const leituraMaiorRSSI = leituras.find(l => l.rssi === maiorRSSI);
          console.log(`A maior leitura de RSSI (${maiorRSSI}) do bssid ${bssid} é da Área: ${idAreas[0]}`);
          leiturasFiltradas.push(leituraMaiorRSSI);
        } else {
            // Analisar as áreas onde o bssid está presente
            const maiorRSSIAreaMap = idAreas.map(area => {
              const leiturasDaArea = leituras.filter(l => this.obterIdAreaPorIdLocal(l.idLocal) === area);
              const maiorRSSI = Math.max(...leiturasDaArea.map(l => l.rssi));
              return { area, maiorRSSI };
            });
          
            // Para cada área, salvar a leitura com o maior valor de RSSI
            maiorRSSIAreaMap.forEach(({ area, maiorRSSI }) => {
              const leituraMaiorRSSI = leituras.find(l => this.obterIdAreaPorIdLocal(l.idLocal) === area && l.rssi === maiorRSSI);
              
              if (leituraMaiorRSSI) {
                console.log(`Salvando a leitura com o maior RSSI (${maiorRSSI}) para o bssid ${bssid} na área ${area}`);
                leiturasFiltradas.push(leituraMaiorRSSI);
              }
            });
          }
          
      }
    });

    // Salvar as leituras filtradas no banco de dados
    await this.salvarLeiturasFiltradas(leiturasFiltradas);
    //console.log(leiturasFiltradas);

    return leiturasFiltradas; // Retorna as leituras filtradas após o salvamento
  }
}

export default LeituraAnaliseService;
