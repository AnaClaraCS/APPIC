import { getDatabase, ref, set, get, update, remove, push } from 'firebase/database';
//import { getDatabase, ref, set, get, update, remove, push } from '../firebase.js';
import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import ImageResizer from 'react-native-image-resizer';
import ImagePicker from 'react-native-image-crop-picker';
import { database, storage } from '../firebase.js';
import Area from '../models/area.js';
import { deletarLocaisPorArea, obterLocaisPorArea } from './localController.js';
import { Image } from 'react-native'; 

class AreaController {
  constructor() {
    this.database = database;
    this.storage = storage;
  }

  // Upload de imagem e obtenção da URL
  async uploadImagemArea(idArea, uri) {
    try {
      // Obtém as dimensões da imagem sem exibir uma interface para o usuário
      const imageDimensions = await new Promise((resolve, reject) => {
        Image.getSize(uri, (width, height) => {
          resolve({ width, height });
        }, reject);
      });
  
      let { width, height } = imageDimensions;
  
      // Verifica se a imagem precisa ser rotacionada
      let finalUri = uri;
      if (width > height) {
        const rotatedImage = await ImageResizer.createResizedImage(
          uri,
          height,
          width,
          'JPEG',
          100,
          90 // Rotaciona a imagem 90 graus
        );
        finalUri = rotatedImage.uri;
      }
  
      // Faz o upload da imagem rotacionada ou original
      const response = await fetch(finalUri);
      const blob = await response.blob();
      const storageRef = sRef(this.storage, `areas/${idArea}/imagem`);
  
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      throw error;
    }
  }

  // Criar uma nova area
  async criarArea(areaData, file) {
    const idArea = await push(ref(this.database, 'areas')).key;
    const novaArea = new Area(areaData, idArea);
    if (file) {
      const imagem = await this.uploadImagemArea( idArea, file);
      novaArea.imagem = imagem;
    }
    await set(ref(this.database, `areas/${idArea}`), novaArea);
    return idArea;
  }

   // Obter URL da imagem
  async obterImagemArea(idArea) {
    try {
      const storageRef = sRef(this.storage, `areas/${idArea}/imagem`);
      const downloadURL = await getDownloadURL(storageRef);
      console.log(downloadURL);
      return downloadURL;
    } catch (error) {
      console.error('Erro ao obter URL da imagem:', error);
      return null;
    }
  }

  // Obter todas as areas
  async obterAreas() {
    const snapshot = await get(ref(this.database, 'areas'));
    const areas = [];
    snapshot.forEach((childSnapshot) => {
      const area = childSnapshot.val();
      areas.push(area);
    });
    return areas;
  }

  // Obter uma area específico pelo ID
  async obterArea(idArea) {
    const snapshot = await get(ref(this.database, `areas/${idArea}`));
    const area = snapshot.val();
    return area || null;
  }

  // Atualizar uma area
  async atualizarArea(idArea, dadosAtualizados, file) {
    if (file) {
      const imagem = await this.uploadImagemArea(idArea, file);
      dadosAtualizados.imagem = imagem;
    }
    await update(ref(this.database, `areas/${idArea}`), dadosAtualizados);
  }

  // Deletar uma area
  async deletarArea(idArea) {
    await deletarLocaisPorArea(idArea);
    await remove(ref(this.database, `areas/${idArea}`));
  }

  async obterLocais(idArea) {
    try {
      return obterLocaisPorArea(idArea);
    } catch (error) {
      console.error('Erro ao obter locais da área:', error);
      throw error;
    }
  }
}

export default AreaController;
