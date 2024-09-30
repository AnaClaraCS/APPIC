// Model para BssidArea
class BssidArea {
    constructor(idArea, lista_bssid = []) {
      this.idArea = idArea; // O idArea será reutilizado da entidade Area
      this.lista_bssid = lista_bssid; // Uma lista de bssid
    }
  
    // Método para adicionar um BSSID à lista
    adicionarBssid(bssid) {
      if (!this.lista_bssid.includes(bssid)) {
        this.lista_bssid.push(bssid);
      }
    }
  
    // Método para remover um BSSID da lista
    removerBssid(bssid) {
      this.lista_bssid = this.lista_bssid.filter(item => item !== bssid);
    }
  
    // Método para converter para JSON (opcional, útil para salvar no Firebase)
    toJSON() {
      return {
        idArea: this.idArea,
        lista_bssid: this.lista_bssid
      };
    }
  }
  
  export default BssidArea;
  