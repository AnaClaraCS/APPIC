import { getDatabase, ref, set, get, update, remove, push } from 'firebase/database';
import { database } from '../firebase';

class LeituraService {
  constructor() {
    this.database = database;
  }

  // Função para filtrar leituras por uma lista de locais
  async filtrarLeiturasPorLocais(locais) {
    try {
      const leiturasRef = ref(this.database, 'leituras'); // Referência ao nó de "leituras" no banco de dados
      const snapshot = await get(leiturasRef); // Obter todas as leituras do banco de dados

      const idsLocais = locais.map(local => local.idLocal); // Extrair os IDs dos locais da lista
      const leiturasFiltradas = [];

      // Percorrer todas as leituras e filtrar apenas as que pertencem aos locais fornecidos
      snapshot.forEach((childSnapshot) => {
        const leiturasPorBssid = childSnapshot.val(); // Obter todas as leituras de um BSSID
        Object.values(leiturasPorBssid).forEach((leitura) => {
          if (idsLocais.includes(leitura.idLocal)) {
            leiturasFiltradas.push(leitura); // Adicionar a leitura filtrada à lista
          }
        });
      });

      return leiturasFiltradas; // Retornar as leituras filtradas
    } catch (error) {
      console.error('Erro ao filtrar leituras por locais:', error);
      throw error;
    }
  }
}

export default LeituraService;
