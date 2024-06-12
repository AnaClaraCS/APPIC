import { getDatabase, ref, set, get, update, remove, push } from 'firebase/database';
import { database } from '../firebase.js';
import Leitura from '../models/leitura.js';
import LocalController from './localController';
import RedeController from './redeController';

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

  async obterLeiturasDetalhadas() {
    const leituras = await this.obterLeituras(); 
    const localController = new LocalController();
    const redeController = new RedeController();

    const leiturasDetalhadas = await Promise.all(leituras.map(async (leitura) => {
      const local = await localController.obterLocal(leitura.idLocal);
      if (!local) {
        //console.log(`Local não encontrado para idLocal: ${leitura.idLocal}`);
        // Você pode decidir como tratar esse caso, por exemplo, atribuir uma descrição padrão
        return {
          ...leitura,
          localDescricao: 'Local não encontrado',
          redeNome: ''
        };
      }
  
      const rede = await redeController.obterRede(leitura.bssid);
      if (!rede) {
        //console.log(`Rede não encontrada para bssid: ${leitura.bssid}`);
        // Você pode decidir como tratar esse caso, por exemplo, atribuir um nome de rede padrão
        return {
          ...leitura,
          localDescricao: local.descricao,
          redeNome: 'Rede não encontrada'
        };
      }
  
      return {
        ...leitura,
        localDescricao: local.descricao,
        redeNome: rede.nome
      };


    }));
  

    return leiturasDetalhadas;
  }

}

export default LeituraController;
