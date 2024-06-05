class Leitura {
    constructor(idLeitura, bssid, idLocal, rssi, data) {
        this.idLeitura = idLeitura;
        this.bssid = bssid;
        this.idLocal = idLocal;
        this.rssi = rssi;
        this.data = data;
    }
}

exports.default = Leitura;
