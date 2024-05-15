const mongoose = require('mongoose');

const localSchema = new mongoose.Schema({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  descrição: { type: String }
});

const Local = mongoose.model('Local', localSchema);

module.exports = Local;
