import { getDatabase, ref, set, get, update, remove, push } from 'firebase/database';
import { database } from '../../firebase';
import Leitura from '../models/leitura';

class LeituraController {
  private database = database;

  // Criar uma nova leitura
  async criarLeitura(leitura: Omit<Leitura, 'data' | 'idLeitura'>): Promise<void> {
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
    const data = new Date();

    // Criar uma referência única para a nova leitura
    const novaLeituraRef = push(ref(this.database, 'leituras'));
    const idLeitura = novaLeituraRef.key as string; // Assegurando que idLeitura é uma string

    // Combinar a leitura com a data de criação e idLeitura
    const novaLeitura: Leitura = { ...leitura, data, idLeitura };

    // Salvar a nova leitura no Firebase
    await set(novaLeituraRef, novaLeitura);
  }

  // Obter todas as leituras
  async obterLeituras(): Promise<Leitura[]> {
    const snapshot = await get(ref(this.database, 'leituras'));
    const leituras: Leitura[] = [];
    snapshot.forEach((childSnapshot) => {
      const leitura: Leitura = childSnapshot.val();
      leituras.push(leitura);
    });
    return leituras;
  }

  // Obter uma leitura específica pelo ID
  async obterLeitura(idLeitura: string): Promise<Leitura | null> {
    const snapshot = await get(ref(this.database, `leituras/${idLeitura}`));
    const leitura: Leitura = snapshot.val();
    return leitura || null;
  }

  // Atualizar uma leitura
  async atualizarLeitura(idLeitura: string, dadosAtualizados: Partial<Leitura>): Promise<void> {
    await update(ref(this.database, `leituras/${idLeitura}`), dadosAtualizados);
  }

  // Deletar uma leitura
  async deletarLeitura(idLeitura: string): Promise<void> {
    await remove(ref(this.database, `leituras/${idLeitura}`));
  }
}

export default LeituraController;
