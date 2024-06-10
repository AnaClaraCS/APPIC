// Importa os módulos necessários do Firebase
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, update, remove, push } from 'firebase/database';

// Configurações do Firebase
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

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Exporta as instâncias do Firebase e do banco de dados
export {
    app,
    database,
    getDatabase,
    ref,
    set,
    get,
    update,
    remove,
    push
  };
