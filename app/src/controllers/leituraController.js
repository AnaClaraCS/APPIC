import { getDatabase, ref, set, get, update, remove, push } from 'firebase/database';
import { database } from '../firebase.js';
import Leitura from '../models/leitura.js';
import LocalController from './localController';
import RedeController from './redeController';
import Local from '../models/local.js';
import Rede from '../models/rede.js';


class LeituraController {
  constructor() {
    this.database = database;
  }
  
  // Criar uma nova leitura
  async criarLeitura(leitura) {
    // Verificar se o idLocal existe
    const localSnapshot = await get(ref(this.database, `locais/${leitura.idLocal}`));
    if (!localSnapshot.exists()) {
      throw new Error(`Local com ID ${leitura.idLocal} não encontrado.`);
    }
    
    // Verificar se o bssid existe
    const redeSnapshot = await get(ref(this.database, `redes/${leitura.bssid}`));
    if (!redeSnapshot.exists()) {
      console.log(`Rede com BSSID ${leitura.bssid} não encontrada.`);
    }

    const data = new Date().toLocaleString(); 
    const idLeitura = push(ref(this.database, `leituras/${leitura.bssid}`)).key;
    const novaLeitura = { ...leitura, data: data, idLeitura };

    await set(ref(this.database, `leituras/${leitura.bssid}/${idLeitura}`), novaLeitura);
    return idLeitura;
  }
  
  // Obter todas as leituras
  async obterLeituras() {
    const snapshot = await get(ref(this.database, 'leituras'));
    const leituras = [];
    snapshot.forEach((childSnapshot) => {
      const bssid = childSnapshot.key;
      const leiturasPorBssid = childSnapshot.val();
      Object.values(leiturasPorBssid).forEach((leitura) => {
          leituras.push(leitura);
      });
  });
    return leituras;
  }
  
  // Obter uma leitura específica pelo ID
  async obterLeitura(idLeitura) {
    const snapshot = await get(ref(this.database, `leituras`));
    let leitura = null;
    snapshot.forEach((childSnapshot) => {
        const leiturasPorBssid = childSnapshot.val();
        Object.values(leiturasPorBssid).forEach((leituraPorId) => {
            if (leituraPorId.idLeitura === idLeitura) {
                leitura = leituraPorId;
            }
        });
    });
    return leitura;
  }

  // Obter todas as leituras de um BSSID específico
async obterLeiturasPorBssid(bssid) {
  const snapshot = await get(ref(this.database, `leituras/${bssid}`));
  const leituras = [];

  if (snapshot.exists()) {
    const leiturasPorBssid = snapshot.val();
    Object.values(leiturasPorBssid).forEach((leitura) => {
      leituras.push(leitura);
    });
  }

  return leituras;
}
  
  // Atualizar uma leitura
  async atualizarLeitura(idLeitura, dadosAtualizados) {
    await update(ref(this.database, `leituras/${dadosAtualizados.bssid}/${idLeitura}`), dadosAtualizados);
  }

  // Deletar uma leitura
  async deletarLeitura(idLeitura) {
    const snapshot = await get(ref(this.database, `leituras`));
    snapshot.forEach((childSnapshot) => {
        const bssid = childSnapshot.key;
        remove(ref(this.database, `leituras/${bssid}/${idLeitura}`));
    });
  }

  async obterLeiturasDetalhadas() {
    const leituras = await this.obterLeituras(); 
    
    const leiturasDetalhadas = await Promise.all(leituras.map(async (leitura) => {
      const local = await this.obterLocalLeitura(leitura.idLeitura);
      const rede = await this.obterRedeLeitura(leitura.idLeitura);
      
      return {
        ...leitura,
        localDescricao: local.descricao ,
        redeNome: rede.nome 
      };
    }));
    return leiturasDetalhadas;
  }

  async obterLocalLeitura(idLeitura){
    const leitura = await this.obterLeitura(idLeitura);
    const localController = new LocalController();
    const local = localController.obterLocal(leitura.idLocal);
    if(!local){
      console.log("Erro ao obter local de leitura");
    }
    return local;
  }

  async obterRedeLeitura(idLeitura){
    const leitura = await this.obterLeitura(idLeitura);
    const redeController = new RedeController();
    const rede = redeController.obterRede(leitura.bssid);
    if(!rede){
      console.log("Erro ao obter rede de leitura");
    }
    return rede;
  }

  async obterLeiturasPorLocais(idsLocais) {
    try {
      const todasLeituras = await this.obterLeituras();
      const leituras = todasLeituras.filter(leitura => idsLocais.includes(leitura.idLocal));
      return leituras;
    } catch (error) {
      console.error('Erro ao obter leituras por locais:', error);
      throw error;
    }
  }

  async obterLeiturasPorLocal(idLocal) {
    try {
      const todasLeituras = await this.obterLeituras();
      const leituras = todasLeituras.filter(leitura => leitura.idLocal === idLocal);
      return leituras;
    } catch (error) {
      console.error('Erro ao obter leituras por local:', error);
      throw error;
    }
  }
}

export default LeituraController;

export async function deletarLeiturasPorLocal(idLocal) {
  const leituraController = new LeituraController();
  const leituras = await leituraController.obterLeituras();

  // Filtrar e deletar leituras associadas ao local
  const deletePromises = leituras
    .filter(leitura => leitura.idLocal === idLocal)
    .map(leitura => leituraController.deletarLeitura(leitura.idLeitura));

  // Esperar que todas as leituras sejam deletadas
  await Promise.all(deletePromises);
}