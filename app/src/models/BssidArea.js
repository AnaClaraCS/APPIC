class BssidArea {
  constructor(idArea, bssid_100frequentes = [], bssid_exclusivos = []) {
    this.idArea = idArea; // O idArea será reutilizado da entidade Area
    this.bssid_100frequentes = bssid_100frequentes; // Lista de bssid mais frequentes
    this.bssid_exclusivos = bssid_exclusivos; // Lista de bssid exclusivos
  }

  // Método para adicionar um BSSID à lista de frequentes
  adicionarBssidFrequente(bssid) {
    if (!this.bssid_100frequentes.includes(bssid)) {
      this.bssid_100frequentes.push(bssid);
    }
  }

  // Método para adicionar um BSSID à lista de exclusivos
  adicionarBssidExclusivo(bssid) {
    if (!this.bssid_exclusivos.includes(bssid)) {
      this.bssid_exclusivos.push(bssid);
    }
  }

  // Método para remover um BSSID da lista de frequentes
  removerBssidFrequente(bssid) {
    this.bssid_100frequentes = this.bssid_100frequentes.filter(item => item !== bssid);
  }

  // Método para remover um BSSID da lista de exclusivos
  removerBssidExclusivo(bssid) {
    this.bssid_exclusivos = this.bssid_exclusivos.filter(item => item !== bssid);
  }

  // Método para converter para JSON (opcional, útil para salvar no Firebase)
  toJSON() {
    return {
      idArea: this.idArea,
      bssid_100frequentes: this.bssid_100frequentes,
      bssid_exclusivos: this.bssid_exclusivos
    };
  }
}

export default BssidArea;
