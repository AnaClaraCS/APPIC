import firebase from 'firebase/app';
import 'firebase/database';
import { getDatabase } from 'firebase/database';

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

export const database = getDatabase();

export default firebase;