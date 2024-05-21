import { getDatabase, ref, set, get, update, remove } from 'firebase/database';
import { database } from '../../firebase';
import Local from '../models/local';

class LocalController {
  private database = database;

  // Criar um novo local
  async criarLocal(local: Local): Promise<void> {
    await set(ref(this.database, `locais/${local.idLocal}`), local);
  }

  // Obter todos os locais
  async obterLocais(): Promise<Local[]> {
    const snapshot = await get(ref(this.database, 'locais'));
    const locais: Local[] = [];
    snapshot.forEach((childSnapshot) => {
      const local: Local = childSnapshot.val();
      locais.push(local);
    });
    return locais;
  }

  // Obter um local específico pelo ID
  async obterLocal(id: string): Promise<Local | null> {
    const snapshot = await get(ref(this.database, `locais/${id}`));
    const local: Local = snapshot.val();
    return local || null;
  }

  // Atualizar um local
  async atualizarLocal(id: string, dadosAtualizados: Partial<Local>): Promise<void> {
    await update(ref(this.database, `locais/${id}`), dadosAtualizados);
  }

  // Deletar um local
  async deletarLocal(id: string): Promise<void> {
    await remove(ref(this.database, `locais/${id}`));
  }
}

export default LocalController;
