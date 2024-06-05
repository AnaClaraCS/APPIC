import { getDatabase, ref, set, get, update, remove } from 'firebase/database';
import { database } from '../../firebase.js';
//import Rede from '../models/rede';

class RedeController {
  constructor() {
    this.database = database;
  }

  // Criar uma nova rede
  async criarRede(rede) {
    await set(ref(this.database, `redes/${rede.bssid}`), rede);
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
