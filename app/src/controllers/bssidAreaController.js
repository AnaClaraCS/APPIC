import { getDatabase, ref, set, get, update } from 'firebase/database';
import BssidArea from '../models/BssidArea'; // Importa o model de BssidArea

class BssidAreaController {
  constructor() {
    this.database = getDatabase(); // Inicializa o banco de dados do Firebase
  }

  // Método para salvar uma BssidArea com duas listas: bssid_100frequentes e bssid_exclusivos
  async salvarBssidArea(bssidArea) {
    const { idArea, bssid_100frequentes, bssid_exclusivos } = bssidArea;

    try {
      const areaRef = ref(this.database, `bssid_area/${idArea}`);
      await set(areaRef, {
        idArea: idArea,
        bssid_100frequentes: bssid_100frequentes,
        bssid_exclusivos: bssid_exclusivos
      });
      console.log(`BssidArea salva/atualizada com sucesso para a área: ${idArea}`);
    } catch (error) {
      console.error('Erro ao salvar BssidArea:', error);
      throw error; // Repropaga o erro
    }
  }

  // Método para adicionar um BSSID à lista de bssid_100frequentes
  async adicionarBssidFrequenteParaArea(idArea, bssid) {
    try {
      const areaRef = ref(this.database, `bssid_area/${idArea}`);
      const snapshot = await get(areaRef);

      if (snapshot.exists()) {
        const bssidArea = snapshot.val();
        const bssidList = Array.isArray(bssidArea.bssid_100frequentes) ? bssidArea.bssid_100frequentes : [];

        if (!bssidList.includes(bssid)) {
          bssidList.push(bssid);
          await update(areaRef, { bssid_100frequentes: bssidList });
          console.log(`BSSID ${bssid} adicionado à lista de frequentes da área ${idArea}`);
        } else {
          console.log(`BSSID ${bssid} já está associado à lista de frequentes da área ${idArea}`);
        }
      } else {
        const novaBssidArea = new BssidArea(idArea, [bssid], []);
        await this.salvarBssidArea(novaBssidArea);
      }
    } catch (error) {
      console.error('Erro ao adicionar BSSID frequente à área:', error);
      throw error; // Repropaga o erro
    }
  }

  // Método para adicionar um BSSID à lista de bssid_exclusivos
  async adicionarBssidExclusivoParaArea(idArea, bssid) {
    try {
      const areaRef = ref(this.database, `bssid_area/${idArea}`);
      const snapshot = await get(areaRef);

      if (snapshot.exists()) {
        const bssidArea = snapshot.val();
        const bssidList = Array.isArray(bssidArea.bssid_exclusivos) ? bssidArea.bssid_exclusivos : [];

        if (!bssidList.includes(bssid)) {
          bssidList.push(bssid);
          await update(areaRef, { bssid_exclusivos: bssidList });
          console.log(`BSSID ${bssid} adicionado à lista de exclusivos da área ${idArea}`);
        } else {
          console.log(`BSSID ${bssid} já está associado à lista de exclusivos da área ${idArea}`);
        }
      } else {
        const novaBssidArea = new BssidArea(idArea, [], [bssid]);
        await this.salvarBssidArea(novaBssidArea);
      }
    } catch (error) {
      console.error('Erro ao adicionar BSSID exclusivo à área:', error);
      throw error; // Repropaga o erro
    }
  }

  // Método para buscar as listas de BSSID de uma área específica
  async buscarBssidPorArea(idArea) {
    try {
      const areaRef = ref(this.database, `bssid_area/${idArea}`);
      const snapshot = await get(areaRef);

      if (snapshot.exists()) {
        const bssidArea = snapshot.val();
        return {
          bssid_100frequentes: Array.isArray(bssidArea.bssid_100frequentes) ? bssidArea.bssid_100frequentes : [],
          bssid_exclusivos: Array.isArray(bssidArea.bssid_exclusivos) ? bssidArea.bssid_exclusivos : []
        };
      } else {
        console.log(`Nenhuma BSSID encontrada para a área: ${idArea}`);
        return {
          bssid_100frequentes: [],
          bssid_exclusivos: []
        };
      }
    } catch (error) {
      console.error('Erro ao buscar BSSID por área:', error);
      throw error; // Repropaga o erro
    }
  }

  // Método para buscar todas as áreas e suas listas de BSSID
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
