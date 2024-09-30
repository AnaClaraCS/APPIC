import { getDatabase, ref, set, get, child } from 'firebase/database';

class LeituraFiltradaController {
  constructor() {
    this.database = getDatabase(); // Inicializa o banco de dados do Firebase
  }

  // Método para salvar uma leitura filtrada usando o mesmo id da leitura original
  async salvarLeituraFiltrada(leitura) {
    const { bssid, idLeitura } = leitura;

    try {
      // Define a referência para leituras filtradas aninhadas no nó do BSSID
      const leituraRef = ref(this.database, `leituras_filtradas/${bssid}/${idLeitura}`);
      await set(leituraRef, leitura);
      console.log(`Leitura filtrada salva com sucesso: ${idLeitura}`);
    } catch (error) {
      console.error('Erro ao salvar leitura filtrada:', error);
      throw error; // Repropaga o erro
    }
  }

  // Método para buscar todas as leituras filtradas de um determinado BSSID
  async buscarLeiturasFiltradasPorBSSID(bssid) {
    try {
      // Define a referência para as leituras filtradas de um determinado BSSID
      const leiturasRef = ref(this.database, `leituras_filtradas/${bssid}`);
      const snapshot = await get(leiturasRef);

      if (snapshot.exists()) {
        const leituras = snapshot.val();
        return Object.values(leituras); // Retorna as leituras filtradas como array
      } else {
        //console.log(`Nenhuma leitura encontrada para o BSSID: ${bssid}`);
        return [];
      }
    } catch (error) {
      console.error('Erro ao buscar leituras filtradas por BSSID:', error);
      throw error; // Repropaga o erro
    }
  }
}

export default LeituraFiltradaController;
