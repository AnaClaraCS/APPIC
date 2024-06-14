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
      throw new Error(`Rede com BSSID ${leitura.bssid} não encontrada.`);
    }

    const data = new Date().toLocaleString(); 
    const idLeitura = push(ref(this.database, 'leituras')).key; 
    const novaLeitura = { ...leitura, data: data, idLeitura };
    
    await set(ref(this.database, `leituras/${idLeitura}`), novaLeitura);
    return idLeitura;
  }
  
  // Obter todas as leituras
  async obterLeituras() {
    const snapshot = await get(ref(this.database, 'leituras'));
    const leituras = [];
    snapshot.forEach((childSnapshot) => {
      const leitura = childSnapshot.val();
      leituras.push(leitura);
    });
    return leituras;
  }
  
  // Obter uma leitura específica pelo ID
  async obterLeitura(idLeitura) {
    const snapshot = await get(ref(this.database, `leituras/${idLeitura}`));
    const leitura = snapshot.val();
    return leitura || null;
  }
  
  // Atualizar uma leitura
  async atualizarLeitura(idLeitura, dadosAtualizados) {
    await update(ref(this.database, `leituras/${idLeitura}`), dadosAtualizados);
  }
  
  // Deletar uma leitura
  async deletarLeitura(idLeitura) {
    await remove(ref(this.database, `leituras/${idLeitura}`));
  }

  async obterLocalLeitura(idLeitura){
    const leitura = await this.obterLeitura(idLeitura);
    const localController = new LocalController();
    let local = await localController.obterLocal(leitura.idLocal);
    if(!local){
      local = new Local({
        andar: 0,
        descricao: "Local não encontrado",
        x: 0,
        y: 0,
        idLocal: ""
      });
    }
    return local;
  }

  async obterRedeLeitura(idLeitura){
    const leitura = await this.obterLeitura(idLeitura);
    const redeController = new RedeController();
    let rede = await redeController.obterRede(leitura.bssid);
    if(!rede){
      rede = new Rede(
        bssid= leitura.bssid,
        nome= "Rede não encontrada"
      );
    }
    return rede;
  }

  async obterLeiturasDetalhadas() {
    const leituras = await this.obterLeituras(); 
    const localController = new LocalController();
    const redeController = new RedeController();
    
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
  
}

export default LeituraController;

export async function deletarLeiturasPorLocal(idLocal) {
  const leituraController = new LeituraController();
  const leituras = await leituraController.obterLeituras();

  // Deletar leituras associadas ao local
  const deletePromises = leituras
    .filter(leitura => leitura.idLocal === idLocal)
    .map(leitura => leituraController.deletarLeitura(leitura.idLeitura));
    deletarLeiturasPorLocal
  // Esperar que todas as leituras sejam deletadas
  await Promise.all(deletePromises);
}