const mongoose = require('mongoose');

const leituraSchema = new mongoose.Schema({
  BSSID: { type: mongoose.Schema.Types.ObjectId, ref: 'Rede', required: true },
  idLocal: { type: mongoose.Schema.Types.ObjectId, ref: 'Local', required: true },
  rssi: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Leitura = mongoose.model('Leitura', leituraSchema);

module.exports = Leitura;
