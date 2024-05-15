const mongoose = require('mongoose');

const redeSchema = new mongoose.Schema({
  BSSID: { type: String, required: true, unique: true },
  nome: { type: String, required: true }
});

const Rede = mongoose.model('Rede', redeSchema);

module.exports = Rede;
