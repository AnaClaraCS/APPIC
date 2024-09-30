import LocalController from '../controllers/localController'

class LocalService {
  constructor() {
    this.localController = new LocalController();
  }

  // Função para classificar os locais em dois grupos: locais com "Teste" no nome e os demais
  async classificarLocais() {
    try {
      const locais = await this.localController.obterLocais();

      const locaisTeste = [];
      const locaisBase = [];

      // Percorrer os locais e classificar com base no nome
      locais.forEach((local) => {
        if (local.descricao && local.descricao.includes('Teste')) {
          locaisTeste.push(local); // Adicionar local à lista de locais de teste
        } else {
          locaisBase.push(local); // Adicionar local à lista de locais base
        }
      });

      return { locaisTeste, locaisBase }; // Retorna os dois grupos
    } catch (error) {
      console.error('Erro ao classificar os locais:', error);
      throw error;
    }
  }
}

export default LocalService;
