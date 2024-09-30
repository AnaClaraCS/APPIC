import LeituraController from '../controllers/leituraController.js';
import LocalController from '../controllers/localController.js';

//Separa os bssid em 3 grupos
class BSSIDService {
  constructor() {
    this.leituraController = new LeituraController();
    this.localController = new LocalController();
  }

  async classificarBSSIDsPorArea() {
    try {
      const leituras = await this.leituraController.obterLeituras();
      const locaisPorId = {};
      const bssidsPorArea = { area1: new Set(), area2: new Set() };

      // Mapeia os idLocais para suas respectivas áreas
      for (let leitura of leituras) {
        const idLocal = leitura.idLocal;
        
        if (!locaisPorId[idLocal]) {
          const local = await this.localController.obterLocal(idLocal);  // Obtém o local associado à leitura
          if (local) {
            locaisPorId[idLocal] = local.idArea; // Mapeia o local à sua área
          }
        }

        const area = locaisPorId[idLocal];
        
        if (area === '-O4GP7W98__nCdgrkI_-') {
          bssidsPorArea.area1.add(leitura.bssid);  // Adiciona o BSSID à área 1
        } else if (area === '-O4kyYrDcPqEVCjpB2uy') {
          bssidsPorArea.area2.add(leitura.bssid);  // Adiciona o BSSID à área 2
        }
      }

      // Classificar os bssids nos três grupos
      const grupo1 = [...bssidsPorArea.area1].filter(bssid => !bssidsPorArea.area2.has(bssid)); // Exclusivos da área 1
      const grupo2 = [...bssidsPorArea.area2].filter(bssid => !bssidsPorArea.area1.has(bssid)); // Exclusivos da área 2
      const grupo3 = [...bssidsPorArea.area1].filter(bssid => bssidsPorArea.area2.has(bssid));  // Presentes em ambas as áreas

      return {
        grupo1,  // BSSIDs exclusivos da área 1
        grupo2,  // BSSIDs exclusivos da área 2
        grupo3   // BSSIDs presentes em ambas as áreas
      };
    } catch (error) {
      console.error('Erro ao classificar BSSIDs por área:', error);
      throw error;
    }
  }
}

export default BSSIDService;
