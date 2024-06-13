import { getDatabase, ref, set, get, update, remove, push } from 'firebase/database';
//import { getDatabase, ref, set, get, update, remove, push } from '../firebase.js';
import { database } from '../firebase.js';
import Local from '../models/local.js';
import { deletarLeiturasPorLocal } from './leituraController.js';

class LocalController {
  constructor() {
    this.database = database;
  }

  // Criar um novo local
  async criarLocal(localData) {
    const idLocal = await push(ref(this.database, 'locais')).key;
    const novoLocal = new Local(localData, idLocal);
    await set(ref(this.database, `locais/${idLocal}`), novoLocal);
    return idLocal;
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
  async deletarLocal(idLocal) {
    await deletarLeiturasPorLocal(idLocal);
    await remove(ref(this.database, `locais/${idLocal}`));
  }
}

export default LocalController;
