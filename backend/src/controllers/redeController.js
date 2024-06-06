import { getDatabase, ref, set, get, update, remove } from 'firebase/database';
import { database } from '../../firebase.js';
import Rede from '../models/rede.js';

class RedeController {
  constructor() {
    this.database = database;
  }

  // Função para codificar o BSSID para ser aceito como chave no Firebase
  codificarBSSID(bssid) {
    return bssid.toString().replace(/:/g, '_');
  }

  // Função para decodificar o BSSID para o formato original
  decodificarBSSID(bssid) {
    return bssid.toString.replace(/_/g, ':');
  }

  // Criar uma nova rede
  async criarRede(redeData) {
    const { bssid, nome } = redeData;
    const novaRede = new Rede(bssid, nome);
    novaRede.bssid = this.codificarBSSID(bssid);
    await set(ref(this.database, `redes/${bssidCodificado}`), novaRede);
  }

  // Obter todas as redes
  async obterRedes() {
    const snapshot = await get(ref(this.database, 'redes'));
    const redes = [];
    snapshot.forEach((childSnapshot) => {
      const rede = childSnapshot.val();
      redes.push(rede);
    });
    return redes;
  }

  // Obter uma rede específica pelo BSSID
  async obterRede(bssid) {
    const snapshot = await get(ref(this.database, `redes/${bssid}`));
    const rede = snapshot.val();
    return rede || null;
  }

  // Atualizar uma rede
  async atualizarRede(bssid, dadosAtualizados) {
    await update(ref(this.database, `redes/${bssid}`), dadosAtualizados);
  }

  // Deletar uma rede
  async deletarRede(bssid) {
    await remove(ref(this.database, `redes/${bssid}`));
  }
}

export default RedeController;
