import WifiManager from 'react-native-wifi-reborn';
import RedeController from '../controllers/redeController.js';
import LeituraController from '../controllers/leituraController.js';
import Rede from '../models/rede.js';

const leituraService = {
  cadastrarLeituras: async (idLocal) => {
    if(idLocal == null){
      console.error("idLocal nulo");
      return;
    }
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
            bssid=redeController.codificarBSSID(wifi.BSSID);
            rede = new Rede(bssid=bssid, nome=wifi.SSID || 'Sem nome');

            if(redeController.obterRede(bssid)){
              bssid = await redeController.atualizarRede(bssid, rede);
            }
            else{
              bssid = await redeController.criarRede(rede);
            }
            await leituraController.criarLeitura({
              idLocal: idLocal,
              bssid: bssid,
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
