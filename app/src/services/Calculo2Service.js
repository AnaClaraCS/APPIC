import LeituraController from '../controllers/leituraController.js';
import LocalController from '../controllers/localController.js';

/*
  As coordenadas são calculadas usando cada leitura igual no banco de dados

  Precisão: 8,20 m
*/

class CalculoService {
  static async calcularLeiturasFiltradas() {
    const idsLocais = ['-O-7V5bo3TimVbKxffY9', '-O-7VJr_1l5izOZKiwJM', '-O-7VQZhovZ5dZ_fZQje',
    '-O-7VSpieitRSQtXTe_5', '-O-7VcPJ86SMEbCQu65t', '-O-7Vf5T4ghYgCnH7IfV', '-O-7VisE9jFh5Z5nRNTK', 
    '-O-7VkdxWTCT9AwdxFFO', '-O-7VwZoTXnG4TEe6Xml', '-O-7Vyk_or_IAYZDzzc9', '-O-7W1ZAol7aOQ78VhTj',
    '-O-7W6943hepmdMbBe9a' ];

    const idLocalEspecifico = [ '-O-7WEMIJoIn4JA3mi8y', '-O-7WGq6REke3WWl3Ax_',
    '-O-7WdNfFFWMWXlrAeXU', '-O-7WfX6HRdMoFBMQ8rx', '-O-7Wl_6oZknzeK37Mr9', '-O-7Wnsj9UHijK9bNkYf',
    '-O-7Wt16PbTYJ0ua77ZG', '-O-7WuK1Npu3Ztn7sLHz'];

    const margem = 0;

    // Passo 1: Obter todas as leituras dos locais especificados
    const bancoDados = await this.obterLeiturasPorLocais(idsLocais);

    
    let resultadoLeitura=0;
    
    for(const idLocal of idLocalEspecifico){
      // Passo 2: Obter todas as leituras do local específico
      const leiturasEnviadas = await this.obterLeiturasPorLocal(idLocal);

      // Passo 3: Filtrar leituras por rede com um valor de RSSI dentro da margem
      const leiturasFiltradas = this.filtrarLeiturasPorRede(leiturasEnviadas, bancoDados, margem);

      // Passo 4: Associar local e rede a cada leitura filtrada
      const leiturasComDetalhes = await this.associarDetalhesLeituras(leiturasFiltradas);
      
      const coordenadasMedias = await this.calcularMediaCoordenadas(leiturasComDetalhes);
      console.log(coordenadasMedias);
      resultadoLeitura += await this.verifica(idLocal, coordenadasMedias);
    }

    console.log("Resultado: "+resultadoLeitura/idLocalEspecifico.length);

    return resultadoLeitura;
  }

  static async verifica(idLocal, coordenadasMedias) {
    const localController = new LocalController();
    const local = await localController.obterLocal(idLocal);
    const { x, y, andar } = coordenadasMedias;
    //console.log(local);
    
    const distancia = Math.sqrt(Math.pow((local.x - x), 2) + Math.pow((local.y - y), 2));
    console.log("Objetivo: ( "+local.x+", "+local.y+", "+local.andar+") - Encontrado: ( "+
    x+", "+y+", "+andar+")");
    console.log("Distancia: "+distancia);
    if(Math.round(andar) == local.andar){
      console.log("Acertou o andar");
    }
    else{
      console.log("Errou o andar")
    }

    return distancia;
  }

  static async obterLeiturasPorLocais(idsLocais) {
    const leituras = [];

    for (const idLocal of idsLocais) {
      const leituraController = new LeituraController();
      const leiturasLocal = await leituraController.obterLeiturasPorLocal(idLocal);
      leituras.push(...leiturasLocal);
    }

    return leituras;
  }

  static async obterLeiturasPorLocal(idLocal) {
    const leituraController = new LeituraController();
    const leiturasLocal = await leituraController.obterLeiturasPorLocal(idLocal);
    return leiturasLocal;
  }

  static filtrarLeiturasPorRede(leiturasEspecificas, todasLeituras, margem) {
    const leiturasFiltradas = [];
  
    leiturasEspecificas.forEach((leituraEspecifica) => {
      const { rssi, BSSID } = leituraEspecifica;
  
      const leiturasSimilares = todasLeituras.filter((leitura) => {
        return leitura.BSSID === BSSID && Math.abs(leitura.rssi - rssi) <= margem;
      });
  
      leiturasFiltradas.push(...leiturasSimilares);
    });
  
    // Ordenar por intensidade de sinal RSSI (do mais forte para o mais fraco)
    leiturasFiltradas.sort((a, b) => b.rssi - a.rssi);
  
    // Pegar apenas as 20 leituras mais fortes
    const leiturasMaisFortes = leiturasFiltradas.slice(0, 20);
  
    return leiturasMaisFortes;
  }

  static async associarDetalhesLeituras(leituras) {
    const leituraController = new LeituraController();

    const leiturasComDetalhes = await Promise.all(leituras.map(async (leitura) => {
      const local = await leituraController.obterLocalLeitura(leitura.idLeitura);
      //const rede = await leituraController.obterRedeLeitura(leitura.idLeitura);

      return {
        ...leitura,
        //localDescricao: local.descricao,
        localX: local.x,
        localY: local.y,
        localAndar: local.andar,
        //redeNome: rede.nome,
        //idLocal: local.idLocal // Incluindo idLocal para referência
      };
    }));

    return leiturasComDetalhes;
  }

  
  static async calcularMediaCoordenadas(leiturasComDetalhes) {

    // Calcular média das coordenadas
    let somaX = 0;
    let somaY = 0;
    let somaZ = 0;

    leiturasComDetalhes.forEach((leitura) => {
      somaX += Number(leitura.localX);
      somaY += Number(leitura.localY);
      somaZ += Number(leitura.localAndar);
    });

    const total = leiturasComDetalhes.length;
    const coordenadasMedias = {
      x: somaX / total,
      y: somaY / total,
      andar: somaZ / total
    };

    return coordenadasMedias;
  }

  
  
  
  
  
}

export default CalculoService;

