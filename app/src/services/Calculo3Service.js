import LeituraController from '../controllers/leituraController.js';
import LocalController from '../controllers/localController.js';

/*
As coordenadas são calculadas usando como peso a qtd de leiturais iguais / qtd total de 
leituras de um local

Precisão: 4,84 m

Foi o que mais chegou perto, talvez a ideia de similaridade seja boa, mas precisa
melhorar a logica para q calcula isso

*/

class CalculoService {
  static async calcularLeiturasFiltradas() {
    const idsLocais = ['-O-7V5bo3TimVbKxffY9', '-O-7VJr_1l5izOZKiwJM', '-O-7VQZhovZ5dZ_fZQje',
    '-O-7VSpieitRSQtXTe_5', '-O-7VcPJ86SMEbCQu65t', '-O-7Vf5T4ghYgCnH7IfV', '-O-7VisE9jFh5Z5nRNTK', 
    '-O-7VkdxWTCT9AwdxFFO', '-O-7VwZoTXnG4TEe6Xml', '-O-7Vyk_or_IAYZDzzc9', '-O-7W1ZAol7aOQ78VhTj',
    '-O-7W6943hepmdMbBe9a' ];

    const idLocalEspecifico = ['-O-7WEMIJoIn4JA3mi8y', '-O-7WEMIJoIn4JA3mi8y', '-O-7WGq6REke3WWl3Ax_',
    '-O-7WdNfFFWMWXlrAeXU', '-O-7WfX6HRdMoFBMQ8rx', '-O-7Wl_6oZknzeK37Mr9', '-O-7Wnsj9UHijK9bNkYf',
    '-O-7Wt16PbTYJ0ua77ZG', '-O-7WuK1Npu3Ztn7sLHz'];

    const margem = 0;

    // Passo 1: Obter todas as leituras dos locais especificados
    const bancoDados = await this.obterLeiturasPorLocais(idsLocais);

    // Passo 2: Obter todas as leituras do local específico
    //const leiturasLocalEspecifico = await this.obterLeiturasPorLocal(idLocalEspecifico);

    // Passo 3: Filtrar leituras por rede com um valor de RSSI dentro da margem
    // const leiturasFiltradas = this.filtrarLeiturasPorRede(leiturasLocalEspecifico, bancoDados, margem);

    // Passo 4: Associar local e rede a cada leitura filtrada
    // const leiturasComDetalhes = await this.associarDetalhesLeituras(leiturasFiltradas);
    
    // Passo 5: Contar leituras por local
    // const contagemPorLocal = this.contarLeiturasPorLocal(leiturasComDetalhes);

    // Calcular média ponderada das coordenadas dos locais mais frequentes
    // const mediaPonderadaCoordenadas = await this.calcularMediaPonderadaCoordenadas(contagemPorLocal, leiturasComDetalhes);

    let resultadoLocal=0;

    for(const idLocal of idLocalEspecifico){
      const leiturasLocalEspecifico = await this.obterLeiturasPorLocal(idLocal);
  
      const contagemPorLocal = this.filtrarContar(leiturasLocalEspecifico, bancoDados, margem);
  
      const coordenadasPorLocalPonderado = await this.calcularCoordenadasPorLocalPonderado(contagemPorLocal);
  
      resultadoLocal += await this.verifica(idLocal, coordenadasPorLocalPonderado);
    }

    console.log("Resultado: "+resultadoLocal/idLocalEspecifico.length);


    return resultadoLocal;

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

  static async obterTotalLeiturasPorLocal(idLocal) {
    const total = (await this.obterLeiturasPorLocal(idLocal)).length;
    return total;
  }

  
  static filtrarContar(leiturasLocal, leiturasTodos, margem) {
    const contagemPorLocal = {};
  
    for (const leituraLocal of leiturasLocal) {
      const { rssi, bssid } = leituraLocal;
  
      for (const leitura of leiturasTodos) {
        if (leitura.bssid === bssid && Math.abs(leitura.rssi - rssi) <= margem) {
          if (!contagemPorLocal[leitura.idLocal]) {
            contagemPorLocal[leitura.idLocal] = {
              contagem: 0 
            };
          }
          contagemPorLocal[leitura.idLocal].contagem++;
        }
      }
    }
    return contagemPorLocal;
  }
  
  
  static async verifica(idLocal, coordenadasPorLocalPonderado) {
    const localController = new LocalController();
    const local = await localController.obterLocal(idLocal);
    const { x, y, andar } = coordenadasPorLocalPonderado;
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
  
  static async calcularCoordenadasPorLocalPonderado(contagem) {
    //console.log(contagem);
    
      // Converter o objeto contagem em um array de objetos { idLocal, contagem }
  const locaisComContagem = Object.entries(contagem).map(([idLocal, { contagem }]) => ({ idLocal, contagem }));

  // Ordenar os locais mais frequentes pelo campo 'contagem' em ordem decrescente e pega os 3 primeiros
  const locaisMaisFrequentes = locaisComContagem.sort((a, b) => b.contagem - a.contagem).slice(0, 3);

    let somaX = 0;
    let somaY = 0;
    let somaAndar = 0;
    let total = 0;
    
    const localController = new LocalController();
    
    for (const localContagem of locaisMaisFrequentes) {
      const local = await localController.obterLocal(localContagem.idLocal);
      const qtd = await this.obterTotalLeiturasPorLocal(local.idLocal);
      
      somaX += local.x * (localContagem.contagem/qtd);
      somaY += local.y * (localContagem.contagem/qtd);
      somaAndar += local.andar * (localContagem.contagem/qtd);
      total += (localContagem.contagem/qtd);
    }
    
    // Evitar divisão por zero
    const x = total !== 0 ? somaX / total : 0;
    const y = total !== 0 ? somaY / total : 0;
    const andar = total !== 0 ? somaAndar / total : 0;
    
    //console.log("X: " + x + " - Y: " + y + " - Z: " + andar);
    
    return { x, y, andar };
  } 

  // static filtrarLeiturasPorRede(leiturasLocal, leiturasTodos, margem) {
  //   const leiturasFiltradas = [];

  //   for (const leituraLocal of leiturasLocal) {
  //     const { rssi, bssid } = leituraLocal;

  //     const leiturasSimilares = leiturasTodos.filter(leitura => {
  //       return leitura.bssid === bssid && Math.abs(leitura.rssi - rssi) <= margem;
  //     });

  //     leiturasFiltradas.push(...leiturasSimilares);
  //   }

  //   return leiturasFiltradas;
  // }

  // static contarLeiturasPorLocal(leituras) {
  //   const contagemPorLocal = {};
  
  //   leituras.forEach(leitura => {
  //     const localDescricao = leitura.localDescricao;
  //     const idLocal = leitura.idLocal;
  
  //     if (!contagemPorLocal[localDescricao]) {
  //       contagemPorLocal[localDescricao] = {
  //         idLocal: idLocal,
  //         descricao: localDescricao,
  //         contagem: 0
  //       };
  //     }
  //     contagemPorLocal[localDescricao].contagem++;
  //   });
  //   console.log("CONTAR")
  //   return contagemPorLocal;
  // }

  // static async associarDetalhesLeituras(leituras) {
  //   const leituraController = new LeituraController();
  
  //   const leiturasComDetalhes = await Promise.all(leituras.map(async (leitura) => {
  //     const local = await leituraController.obterLocalLeitura(leitura.idLeitura);
  //     const rede = await leituraController.obterRedeLeitura(leitura.idLeitura);
  
  //     return {
  //       ...leitura,
  //       localDescricao: local.descricao,
  //       localX: local.x,
  //       localY: local.y,
  //       localAndar: local.andar,
  //       redeNome: rede.nome
  //     };
  //   }));
  
  //   return leiturasComDetalhes;
  // }


  // static async calcularMediaPonderadaCoordenadas(contagemPorLocal, leiturasComDetalhes) {
  //   const locaisMaisFrequentes = Object.entries(contagemPorLocal).sort((a, b) => b[1].contagem - a[1].contagem).slice(0, 3);
  //   let somaX = 0;
  //   let somaY = 0;
  //   let somaZ = 0;
  //   let somaPesos = 0;
  
  //   for (const [localDescricao, { idLocal, contagem }] of locaisMaisFrequentes) {
  //     const leiturasLocais = leiturasComDetalhes.filter(leitura => leitura.localDescricao === localDescricao);
      
  //     for (const leitura of leiturasLocais) {
  //       somaX += leitura.localX * contagem;
  //       somaY += leitura.localY * contagem;
  //       somaZ += leitura.localAndar * contagem; // Considerando andar como a coordenada Z
  //     }
      
  //     somaPesos += contagem * leiturasLocais.length; // Multiplica a contagem pelo número de leituras locais encontradas
  //   }
  
  //   // Evitar divisão por zero
  //   const mediaX = somaPesos !== 0 ? somaX / somaPesos : 0;
  //   const mediaY = somaPesos !== 0 ? somaY / somaPesos : 0;
  //   const mediaZ = somaPesos !== 0 ? somaZ / somaPesos : 0; // Média ponderada da coordenada Z
  
  //   console.log("X: " + mediaX + " - Y: " + mediaY + " - Z: " + mediaZ);
  
  //   return { mediaX, mediaY, mediaZ };
  // }
  
}

export default CalculoService;

