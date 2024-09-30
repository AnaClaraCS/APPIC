import LeiturasFiltradasController from "../controllers/leiturasFiltradasController";
import LocalController from "../controllers/localController";
import BSSIDAreaController from "../controllers/bssidAreaController"; // Importa o controlador responsável pelos BSSIDs por área.

class TestarPrecisaoService {
  constructor(locais, leituras) {
    this.locais = locais; // Lista de locais
    this.leituras = leituras; // Lista de leituras
    this.leiturasFiltradasController = new LeiturasFiltradasController();
    this.localController = new LocalController();
    this.bssidAreaController = new BSSIDAreaController(); // Adiciona o controlador para lidar com BSSIDs por área.
  }

  // Método 1: Filtra leituras por local e retorna apenas BSSID e RSSI
  filtrarLeiturasPorLocal(local) {
    const leiturasFiltradas = this.leituras.filter(
      leitura => leitura.idLocal === local.idLocal
    );
    
    return leiturasFiltradas.map(leitura => ({
      bssid: leitura.bssid,
      rssi: leitura.rssi,
    }));
  }

  // Novo Método: Verifica se todos os BSSIDs de uma área aparecem nas leituras do local
  async verificarBSSIDsPorArea(local, leiturasFiltradas) {
    const idArea = local.idArea;

    // Busca os BSSIDs da área no banco de dados
    const bssidsDaArea = await this.bssidAreaController.buscarBSSIDsPorArea(idArea);

    if (!bssidsDaArea || bssidsDaArea.length === 0) {
      console.log(`Nenhum BSSID encontrado para a área ${idArea}`);
      return false;
    }

    // Extrai os BSSIDs das leituras filtradas
    const bssidsDoLocal = new Set(leiturasFiltradas.map(leitura => leitura.bssid));

    // Verifica se todos os BSSIDs da área estão presentes nas leituras do local
    for (const bssid of bssidsDaArea) {
      if (!bssidsDoLocal.has(bssid)) {
        console.log(`BSSID ${bssid} da área ${idArea} não encontrado nas leituras do local.`);
        return false; // Se um BSSID não estiver presente, retorna false.
      }
    }

    console.log(`Todos os BSSIDs da área ${idArea} estão presentes nas leituras do local.`);
    return true; // Retorna true se todos os BSSIDs da área forem encontrados.
  }

  // Método 2: Compara leituras de BSSID/RSSI com leituras filtradas no banco
  // Método 2: Compara leituras de BSSID/RSSI com leituras filtradas no banco
async compararLeiturasComBanco(leiturasBSSIDRSSI) {
  const resultados = [];

  for (const leitura of leiturasBSSIDRSSI) {
    const { bssid, rssi } = leitura;
    const leiturasNoBanco = await this.leiturasFiltradasController.buscarLeiturasFiltradasPorBSSID(bssid);

    if (leiturasNoBanco.length > 0) {
      // Para cada leitura do banco associada ao bssid
      leiturasNoBanco.forEach(leituraBanco => {
        // Calcular a diferença de RSSI
        const diffRSSI = Math.abs(leituraBanco.rssi - rssi);

        // Adicionar a leitura com a diferença de RSSI no resultado
        resultados.push({
          idLocal: leituraBanco.idLocal,  // idLocal da leitura no banco
          diffRSSI,                       // Diferença de RSSI
        });
      });
    }
  }

  return resultados;
}


  // Método 3: Agrupa leituras por área e calcula a posição apenas nas áreas válidas
async calcularPosicaoPorArea(resultadosComparacao, idsAreasValidas) {
  const agrupadosPorArea = {};

  for (const resultado of resultadosComparacao) {
    const local = await this.localController.obterLocal(resultado.idLocal);
    const idArea = local.idArea;

    // Filtra para incluir apenas áreas válidas
    if (!idsAreasValidas.includes(idArea)) {
      continue; // Pula áreas que não estão na lista de IDs válidos
    }

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

  console.log(`Área com menor média de RSSI: ${areaComMenorDiffRSSI.idArea}, Posição estimada (X: ${mediaX}, Y: ${mediaY})`);

  return {
    idArea: areaComMenorDiffRSSI.idArea,
    x: mediaX,
    y: mediaY,
    mediaDiffRSSI: areaComMenorDiffRSSI.mediaDiffRSSI,
  };
}


// Novo Método: Busca as áreas cujos BSSIDs estão completamente presentes nas leituras do local
async buscarAreasComTodosBSSIDs(local, leiturasFiltradas) {
  // Busca todas as áreas e seus BSSIDs salvos no banco de dados
  const areasBSSIDs = await this.bssidAreaController.buscarTodasAreasEBSSIDs();

  const areasValidas = [];

  for (const area of areasBSSIDs) {
    const { idArea, bssids } = area; // bssids é um array de BSSIDs dessa área.

    if (bssids.length === 0) {
      console.log(`Nenhum BSSID encontrado para a área ${idArea}`);
      continue; // Pula essa área se não houver BSSIDs cadastrados
    }

    // Extrai os BSSIDs das leituras filtradas
    const bssidsDoLocal = new Set(leiturasFiltradas.map(leitura => leitura.bssid));

    // Verifica se todos os BSSIDs da área estão presentes nas leituras do local
    const todosBSSIDsPresentes = bssids.every(bssid => bssidsDoLocal.has(bssid));

    if (todosBSSIDsPresentes) {
      console.log(`Todos os BSSIDs da área ${idArea} estão presentes nas leituras do local.`);
      areasValidas.push(idArea); // Adiciona a área à lista de áreas válidas
    } else {
      console.log(`Nem todos os BSSIDs da área ${idArea} estão presentes nas leituras do local.`);
    }
  }

  return areasValidas; // Retorna a lista de IDs de áreas válidas
}



  // Atualiza o método principal para chamar a verificação de BSSIDs
  async testar(local) {
    try {
      const leituras = await this.filtrarLeiturasPorLocal(local);

    // Busca as áreas cujos BSSIDs estão presentes nas leituras do local
    const idsAreasValidas = await this.buscarAreasComTodosBSSIDs(local, leituras);

    if (idsAreasValidas.length === 0) {
      console.log('Nenhuma área válida encontrada para o local.');
      return null;
    }

    const comparacao = await this.compararLeiturasComBanco(leituras);

    // Calcula a posição usando apenas as áreas válidas
    const posicaoCalculada = await this.calcularPosicaoPorArea(comparacao, idsAreasValidas);
    console.log(`Posição calculada: `, posicaoCalculada);

    return posicaoCalculada;

    } catch (error) {
      console.error('Erro durante o teste:', error);
    }
  }

  async principal() {
    let somaX = 0;
    let somaY = 0;
    let qtdAreasErradas = 0;
    let qtd = 0;

    for (const local of this.locais) {
      console.log(`---------------------------`);
      console.log(`${qtd} - Local original: ${JSON.stringify(local)}`);
      
      const posicaoCalculada = await this.testar(local);
      if (!posicaoCalculada) {
        continue;
      }

      const { areaErrada, difX, difY } = this.calculaDiferenca(local, posicaoCalculada);
      qtdAreasErradas += areaErrada;

      if (difX !== 0 || difY !== 0) {
        somaX += difX;
        somaY += difY;
        qtd++;
      }
    }

    if (qtd > 0) {
      const mediaX = somaX / qtd;
      const mediaY = somaY / qtd;

      console.log(`Média das diferenças: x=${somaX}, y=${somaY}, ${qtd}`);
    } else {
      console.log('Nenhuma diferença significativa encontrada.');
    }

    console.log(`Áreas erradas: ${qtdAreasErradas}`);
  }

  async calculaDiferenca(local, posicaoCalculada) {
    if (local.idArea !== posicaoCalculada.idArea) {
      console.log(`Área errada`);
      return {
        areaErrada: 1,
        difX: 0,
        difY: 0
      };
    } else {
      const difX = Math.abs(local.x - posicaoCalculada.x);
      const difY = Math.abs(local.y - posicaoCalculada.y);
      console.log(`Diferença: x=${difX}, y=${difY}`);
      return {
        areaErrada: 0,
        difX: difX,
        difY: difY
      };
    }
  }
}

export default TestarPrecisaoService;
