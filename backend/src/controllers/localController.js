import { getDatabase, ref, set, get, update, remove } from 'firebase/database';
import { database } from '../../firebase.js';
import Local from '../models/local';

class LocalController {
  constructor() {
    this.database = database;
  }

  // Criar um novo local
  async criarLocal(local) {
    await console.log("Chegamos no controller");
    const idLocal = await push(ref(this.database, 'locais')).key;
    const novoLocal = { ...local, idLocal };
    console.log(novoLocal);
    await set(ref(this.database, `locais/${idLocal}`), novoLocal);
  }

  // Obter todos os locais
  async obterLocais() {
    const snapshot = await get(ref(this.database, 'locais'));
    const locais = [];
    snapshot.forEach((childSnapshot) => {
      const local = childSnapshot.val();
      locais.push(local);
    });
    return locais;
  }

  // Obter um local específico pelo ID
  async obterLocal(id) {
    const snapshot = await get(ref(this.database, `locais/${id}`));
    const local = snapshot.val();
    return local || null;
  }

  // Atualizar um local
  async atualizarLocal(id, dadosAtualizados) {
    await update(ref(this.database, `locais/${id}`), dadosAtualizados);
  }

  // Deletar um local
  async deletarLocal(id) {
    await remove(ref(this.database, `locais/${id}`));
  }
}

export default LocalController;
