import { getDatabase, ref, set, get, update } from 'firebase/database';
import BssidArea from '../models/BssidArea'; // Importa o model de BssidArea

class BssidAreaController {
  constructor() {
    this.database = getDatabase(); // Inicializa o banco de dados do Firebase
  }

  async salvarBssidArea(bssidArea) {
    const { idArea, lista_bssid } = bssidArea;

    try {
      const areaRef = ref(this.database, `bssid_area/${idArea}`);
      await set(areaRef, {
        idArea: idArea,
        lista_bssid: lista_bssid
      });
      console.log(`BssidArea salva/atualizada com sucesso para a área: ${idArea}`);
    } catch (error) {
      console.error('Erro ao salvar BssidArea:', error);
      throw error; // Repropaga o erro
    }
  }

  async adicionarBssidParaArea(idArea, bssid) {
    try {
      const areaRef = ref(this.database, `bssid_area/${idArea}`);
      const snapshot = await get(areaRef);

      if (snapshot.exists()) {
        const bssidArea = snapshot.val();
        const bssidList = Array.isArray(bssidArea.lista_bssid) ? bssidArea.lista_bssid : [];

        if (!bssidList.includes(bssid)) {
          bssidList.push(bssid);
          await update(areaRef, { lista_bssid: bssidList });
          console.log(`BSSID ${bssid} adicionado à área ${idArea}`);
        } else {
          console.log(`BSSID ${bssid} já está associado à área ${idArea}`);
        }
      } else {
        const novaBssidArea = new BssidArea(idArea, [bssid]);
        await this.salvarBssidArea(novaBssidArea);
      }
    } catch (error) {
      console.error('Erro ao adicionar BSSID à área:', error);
      throw error; // Repropaga o erro
    }
  }

  async buscarBssidPorArea(idArea) {
    try {
      const areaRef = ref(this.database, `bssid_area/${idArea}`);
      const snapshot = await get(areaRef);

      if (snapshot.exists()) {
        const bssidArea = snapshot.val();
        return Array.isArray(bssidArea.lista_bssid) ? bssidArea.lista_bssid : [];
      } else {
        console.log(`Nenhuma BSSID encontrada para a área: ${idArea}`);
        return [];
      }
    } catch (error) {
      console.error('Erro ao buscar BSSID por área:', error);
      throw error; // Repropaga o erro
    }
  }

  async buscarTodasAreasEBSSIDs() {
    try {
      const areasRef = ref(this.database, 'bssid_area');
      const snapshot = await get(areasRef);

      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        console.log('Nenhuma área encontrada.');
        return {}; // Retorna um objeto vazio se não houver áreas
      }
    } catch (error) {
      console.error('Erro ao buscar todas as áreas e BSSID:', error);
      throw error; // Repropaga o erro
    }
  }
}

export default BssidAreaController;
