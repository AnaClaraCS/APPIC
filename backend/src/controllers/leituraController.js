import { getDatabase, ref, set, get, update, remove, push } from 'firebase/database';
import { database } from '../../firebase.js';

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

    // Criar a data de criação
    const data = new Date().toLocaleString(); // Converte a data para uma string no formato ISO 8601

    // Criar uma referência única para a nova leitura
    const idLeitura = push(ref(this.database, 'leituras')).key; // Assegurando que idLeitura é uma string

    // Combinar a leitura com a data de criação e idLeitura
    const novaLeitura = { ...leitura, data: data, idLeitura };
    console.log(novaLeitura);
    console.log(novaLeitura.data);

    // Salvar a nova leitura no Firebase
    await set(ref(this.database, `leituras/${idLeitura}`), novaLeitura);
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
}

export default LeituraController;
