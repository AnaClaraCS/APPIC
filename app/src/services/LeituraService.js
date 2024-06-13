import WifiManager from 'react-native-wifi-reborn';
import RedeController from '../controllers/redeController.js';
import LeituraController from '../controllers/leituraController.js';
import Rede from '../models/rede.js';

const leituraService = {
  cadastrarLeituras: async (idLocal) => {
    try {
      // Obtém a lista de redes Wi-Fi disponíveis
      const wifiList = await WifiManager.loadWifiList();
      
      // Salva as redes Wi-Fi associadas ao local usando o RedeController
      const redeController = new RedeController();
      const leituraController = new LeituraController();
      let rede;

      await Promise.all(wifiList.map(async (wifi) => {
        try {
          console.log(wifi.BSSID+" - "+wifi.SSID);

          if (wifi.BSSID) {
            rede = new Rede(bssid=wifi.BSSID, nome=wifi.SSID || 'Sem nome');

            if(redeController.obterRede(rede.bssid)){
              rede.bssid = await redeController.atualizarRede(rede.bssid, rede);
            }
            else{
              rede.bssid = await redeController.criarRede(rede);
            }
            console.log(rede);
            
            await leituraController.criarLeitura({
              idLocal: idLocal,
              bssid: rede.bssid,
              rssi: wifi.level
            });
          } else {
            console.log('Wifi sem BSSID', wifi);
          }
        } catch (error) {
          console.log('Erro ao salvar leitura:', error);
        }
      }));

      console.log('Leituras cadastradas com sucesso.');
    } catch (error) {
      console.error('Erro ao cadastrar leituras:', error);
    }
  },
};

export default leituraService;
