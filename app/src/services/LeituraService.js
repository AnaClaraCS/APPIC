import WifiManager from 'react-native-wifi-reborn';
import RedeController from '../controllers/redeController.js';
import LeituraController from '../controllers/leituraController.js';

const leituraService = {
  cadastrarLeituras: async (idLocal) => {
    try {
      // Obtém a lista de redes Wi-Fi disponíveis
      const wifiList = await WifiManager.loadWifiList();
      
      // Salva as redes Wi-Fi associadas ao local usando o RedeController
      const redeController = new RedeController();
      const leituraController = new LeituraController();
      let redeBSSID;

      await Promise.all(wifiList.map(async (wifi) => {
        try {
            if (wifi.BSSID && wifi.SSID) {
                const redeBSSID = await redeController.criarRede({
                  bssid: wifi.BSSID,
                  nome: wifi.SSID
                });
                await leituraController.criarLeitura({
                  idLocal: idLocal,
                  bssid: redeBSSID,
                  rssi: wifi.level
                });
              } else {
                console.warn('Wifi entry missing BSSID or SSID', wifi);
              }
        } catch (error) {
          console.error('Erro ao salvar leitura:', error);
        }
      }));

      console.log('Leituras cadastradas com sucesso.');
    } catch (error) {
      console.error('Erro ao cadastrar leituras:', error);
    }
  },
};

export default leituraService;
