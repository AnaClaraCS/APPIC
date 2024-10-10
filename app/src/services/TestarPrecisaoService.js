import LeiturasFiltradasController from "../controllers/leiturasFiltradasController";
import LocalController from "../controllers/localController";
import BSSIDAreaController from "../controllers/bssidAreaController"; // Importa o controlador responsável pelos BSSIDs por área.
import CalcularPosicaoService from "./CalcularPosicaoService";

class TestarPrecisaoService {
  constructor(locais, leituras) {
    this.locais = locais; // Lista de locais
    this.leituras = leituras; // Lista de leituras
    this.leiturasFiltradasController = new LeiturasFiltradasController();
    this.localController = new LocalController();
    this.calcularPosicaoService = new CalcularPosicaoService();
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

  async principal() {
    let somaDiferenca =0;
    let qtdAreasErradas = 0;
    let qtd = 0;

    for (const local of this.locais) {
      console.log(`---------------------------`);
      console.log(`${qtd} - Local original: ${JSON.stringify(local)}`);

      const leituras = this.filtrarLeiturasPorLocal(local);
      
      const posicaoCalculada = await this.calcularPosicaoService.calcular(leituras);
      if (!posicaoCalculada) {
        console.log(`continue`);
        continue;
      } else if(posicaoCalculada.idArea === local.idArea){
        somaDiferenca += this.calculaDiferenca(local, posicaoCalculada);
        qtd++;
      } else{
        console.log(`Área errada`);
        qtdAreasErradas ++;
      }

    }

    if (qtd > 0) {
      const media = somaDiferenca / qtd;

      console.log(`Média das diferenças: ${somaDiferenca}, ${qtd}`);
    } else {
      console.log('Nenhuma diferença significativa encontrada.');
    }

    console.log(`Áreas erradas: ${qtdAreasErradas}`);
  }

  async calculaDiferenca(local, posicaoCalculada) {
    // Calcula as diferenças entre as coordenadas X e Y e a distância em pixels
    const difX = Math.pow(local.x - posicaoCalculada.x, 2); // Não é necessário Math.abs
    const difY = Math.pow(local.y - posicaoCalculada.y, 2);
    const distanciaPixels = Math.sqrt(difX + difY);
    
    // Define as escalas de acordo com o ID da posição calculada
    let escala = 0; // Valor inicial para a escala
  
    if (posicaoCalculada.idArea === '-O4GP7W98__nCdgrkI_-') {
      escala = 0.044444444;
    } else if (posicaoCalculada.idArea === '-O4kyYrDcPqEVCjpB2uy') {
      escala = 0.088888889;
    } else {
      // Tratamento de erro para IDs desconhecidos
      console.warn(`ID desconhecido: ${posicaoCalculada.idArea}. Usando escala padrão.`);
      escala = 1; // Defina uma escala padrão ou lance um erro
    }
  
    // Calcula a distância em metros
    const distanciaMetros = distanciaPixels * escala;
  
    // Log para depuração
    
    console.log(`Distância em metros: ${distanciaMetros}`);
    
    return distanciaMetros;
  }
  
}

export default TestarPrecisaoService;
