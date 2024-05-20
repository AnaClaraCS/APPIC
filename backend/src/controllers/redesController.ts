import { firebase } from '@react-native-firebase/database';
import database from '@react-native-firebase/database';
import Rede from '../models/rede'; 

class RedeController {
  private database: firebase.database.Database;

  constructor() {
    // Inicializa o Firebase
    const firebaseConfig = {
      apiKey: "AIzaSyDW2rmFCEAtOV-EO3nZkFO7Hkgmsq3GiTk",
      authDomain: "applocalizacaocefet.firebaseapp.com",
      databaseURL: "https://applocalizacaocefet-default-rtdb.firebaseio.com",
      projectId: "applocalizacaocefet",
      storageBucket: "applocalizacaocefet.appspot.com",
      messagingSenderId: "1001211467078",
      appId: "1:1001211467078:web:a0c1c108c78cbd88b9c147",
      measurementId: "G-YQELNK3P3S"
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    this.database = firebase.database();
  }

  // Criar uma nova rede
  async criarRede(rede: Rede): Promise<void> {
    await this.database.ref(`redes/${rede.bssid}`).set(rede);
  }

  // Obter todas as redes
  async obterRedes(): Promise<Rede[]> {
    const snapshot = await this.database.ref('redes').once('value');
    const redes: Rede[] = [];
    snapshot.forEach((childSnapshot: firebase.database.DataSnapshot) => {
      const rede: Rede = childSnapshot.val();
      redes.push(rede);
    });
    return redes;
  }

  // Obter uma rede específica pelo BSSID
  async obterRede(bssid: string): Promise<Rede | null> {
    const snapshot = await this.database.ref(`redes/${bssid}`).once('value');
    const rede: Rede = snapshot.val();
    return rede || null;
  }

  // Atualizar uma rede
  async atualizarRede(bssid: string, dadosAtualizados: Partial<Rede>): Promise<void> {
    await this.database.ref(`redes/${bssid}`).update(dadosAtualizados);
  }

  // Deletar uma rede
  async deletarRede(bssid: string): Promise<void> {
    await this.database.ref(`redes/${bssid}`).remove();
  }
}

export default RedeController;
