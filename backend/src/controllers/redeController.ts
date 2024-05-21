import { getDatabase, ref, set, get, update, remove } from 'firebase/database';
import { database } from '../../firebase';
import Rede from '../models/rede';

class RedeController {
  private database = database;

  // Criar uma nova rede
  async criarRede(rede: Rede): Promise<void> {
    await set(ref(this.database, `redes/${rede.bssid}`), rede);
  }

  // Obter todas as redes
  async obterRedes(): Promise<Rede[]> {
    const snapshot = await get(ref(this.database, 'redes'));
    const redes: Rede[] = [];
    snapshot.forEach((childSnapshot) => {
      const rede: Rede = childSnapshot.val();
      redes.push(rede);
    });
    return redes;
  }

  // Obter uma rede específica pelo BSSID
  async obterRede(bssid: string): Promise<Rede | null> {
    const snapshot = await get(ref(this.database, `redes/${bssid}`));
    const rede: Rede = snapshot.val();
    return rede || null;
  }

  // Atualizar uma rede
  async atualizarRede(bssid: string, dadosAtualizados: Partial<Rede>): Promise<void> {
    await update(ref(this.database, `redes/${bssid}`), dadosAtualizados);
  }

  // Deletar uma rede
  async deletarRede(bssid: string): Promise<void> {
    await remove(ref(this.database, `redes/${bssid}`));
  }
}

export default RedeController;
