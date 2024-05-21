// firebase.d.ts

import { FirebaseApp } from 'firebase/app';
import { Database } from 'firebase/database';

// Define a estrutura da configuração do Firebase
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

// Declaração de tipo para a função de inicialização do Firebase
declare function initializeApp(config: FirebaseConfig): FirebaseApp;

// Declaração de tipo para o objeto do banco de dados do Firebase
declare function getDatabase(app?: FirebaseApp): Database;
