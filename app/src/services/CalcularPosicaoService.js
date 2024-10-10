import LeiturasFiltradasController from "../controllers/leiturasFiltradasController";
import LocalController from "../controllers/localController";
import BSSIDAreaController from "../controllers/bssidAreaController"; // Importa o controlador responsável pelos BSSIDs por área.

class CalcularPosicaoService {
  constructor(locais, leituras) {
    this.locais = locais; // Lista de locais
    this.leituras = leituras; // Lista de leituras
    this.leiturasFiltradasController = new LeiturasFiltradasController();
    this.localController = new LocalController();
    this.bssidAreaController = new BSSIDAreaController(); // Adiciona o controlador para lidar com BSSIDs por área.
  }

  // Recebe uma lista de leitras {bssid-rssi} e retorna uma posição {x,y,idArea}
  async calcular(leituras) {
    try {
      
    // Busca as áreas cujos BSSIDs estão presentes nas leituras do local
    const idsAreasValidas = await this.buscarAreasComTodosBSSIDs(leituras);

    if (idsAreasValidas.length === 0) {
      console.log('Nenhuma área válida encontrada para o local.');
      return null;
    }

    const comparacao = await this.compararLeiturasComBanco(leituras, idsAreasValidas);

    // Calcula a posição usando apenas as áreas válidas
    const posicaoCalculada = await this.calcularPosicao(comparacao);
    console.log(`Posição calculada: `, posicaoCalculada);

    return posicaoCalculada;

    } catch (error) {
      console.error('Erro durante o calcular posição:', error);
    }
  }

  // Recebe uma lista de leituras e retorna uma lista de idAreas
  async buscarAreasComTodosBSSIDs(leituras) {
    const areasBSSIDs = await this.bssidAreaController.buscarTodasAreasEBSSIDs();
    const bssidsDoLocal = new Set(leituras.map(leitura => leitura.bssid));
    let areasValidas = [];
  
    // 1. Verifica os BSSIDs exclusivos primeiro
    for (const [idArea, areaData] of Object.entries(areasBSSIDs)) {
      const bssidsExclusivos = areaData.lista_bssid_exclusivos || []; // Garante que bssidsExclusivos seja um array
      const bssids100Frequentes = areaData.lista_bssid_100frequentes || []; // Garante que bssids100Frequentes seja um array
  
      // Verificar se a área tem BSSIDs exclusivos e se eles estão nas leituras do local
      if (bssidsExclusivos.length > 0 && bssidsExclusivos.every(bssid => bssidsDoLocal.has(bssid))) {
        // Se houver BSSID exclusivo compatível, retorna somente essa área
        console.log(`Área ${idArea} possui BSSIDs exclusivos e é válida.`);
        return [idArea];
      }
    }
  
    // 2. Se nenhuma área for válida por BSSIDs exclusivos, verifica os BSSIDs 100% frequentes
    for (const [idArea, areaData] of Object.entries(areasBSSIDs)) {
      const bssids100Frequentes = areaData.lista_bssid_100frequentes || []; // Garante que bssids100Frequentes seja um array
  
      // Se a área não tiver BSSIDs 100% frequentes ou todos os BSSIDs 100% frequentes da área estiverem presentes nas leituras do local
      if (bssids100Frequentes.length === 0 || bssids100Frequentes.every(bssid => bssidsDoLocal.has(bssid))) {
        areasValidas.push(idArea);
      }
    }
  
    console.log(`Áreas válidas com BSSIDs 100% frequentes: ${areasValidas}`);
    
    return areasValidas; // Retorna as áreas válidas, se houver, após a verificação dos BSSIDs 100% frequentes
  }
  
  

  // Compara leituras de BSSID/RSSI com leituras filtradas no banco
  async compararLeiturasComBanco(leituras, areasValidas) {
    const resultados = [];

    for (const leitura of leituras) {
      const { bssid, rssi } = leitura;
      const leiturasNoBanco = await this.leiturasFiltradasController.buscarLeiturasFiltradasPorBSSID(bssid);

      if (leiturasNoBanco.length > 0) {
        // Para cada leitura do banco associada ao bssid
        for (const leituraBanco of leiturasNoBanco) {
          // Calcular a diferença de RSSI
          const diffRSSI = Math.abs(leituraBanco.rssi - rssi);

          const local = await this.localController.obterLocal(leituraBanco.idLocal);
          const idArea = local.idArea;
          if (areasValidas.includes(idArea)) {
            // Adicionar a leitura com a diferença de RSSI no resultado
            resultados.push({
              idLocal: leituraBanco.idLocal,  // idLocal da leitura no banco
              diffRSSI,                       // Diferença de RSSI
            });
          }
        }
      }
    }
    return resultados;
  }

  // Recebe as eituras filtradas por area e retorna a posição {x,y, idArea}
  async calcularPosicao(resultadosComparacao) {
    const agrupadosPorArea = {};

    for (const resultado of resultadosComparacao) {
      const local = await this.localController.obterLocal(resultado.idLocal);
      const idArea = local.idArea;

      if (!agrupadosPorArea[idArea]) {
        agrupadosPorArea[idArea] = {
          totalPeso: 0,
          somaX: 0,
          somaY: 0,
          somaDiffRSSI: 0,
          quantidade: 0,
        };
      }

      const peso = 1 / (resultado.diffRSSI + 1); // Evita divisão por zero

      agrupadosPorArea[idArea].somaX += local.x * peso;
      agrupadosPorArea[idArea].somaY += local.y * peso;
      agrupadosPorArea[idArea].totalPeso += peso;
      agrupadosPorArea[idArea].somaDiffRSSI += resultado.diffRSSI;
      agrupadosPorArea[idArea].quantidade++;
    }
    console.log(agrupadosPorArea);

    let areaComMenorDiffRSSI = null;
    let menorMediaDiffRSSI = Infinity;

    for (const [idArea, dados] of Object.entries(agrupadosPorArea)) {
      const mediaDiffRSSI = dados.somaDiffRSSI / dados.quantidade;

      if (mediaDiffRSSI < menorMediaDiffRSSI) {
        menorMediaDiffRSSI = mediaDiffRSSI;
        areaComMenorDiffRSSI = {
          idArea,
          totalPeso: dados.totalPeso,
          somaX: dados.somaX,
          somaY: dados.somaY,
          mediaDiffRSSI,
        };
      }
    }

    if (!areaComMenorDiffRSSI) {
      console.log(`Nenhuma área válida encontrada.`);
      return null;
    }

    const mediaX = areaComMenorDiffRSSI.somaX / areaComMenorDiffRSSI.totalPeso;
    const mediaY = areaComMenorDiffRSSI.somaY / areaComMenorDiffRSSI.totalPeso;

    //console.log(`Área com menor média de RSSI: ${areaComMenorDiffRSSI.idArea}, Posição estimada (X: ${mediaX}, Y: ${mediaY})`);

    return {
      idArea: areaComMenorDiffRSSI.idArea,
      x: mediaX,
      y: mediaY,
    };
  }



}

export default CalcularPosicaoService;