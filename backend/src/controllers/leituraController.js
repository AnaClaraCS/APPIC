import Leitura, { find, findById, findByIdAndUpdate, findByIdAndDelete } from '../models/leitura';

// Função para buscar todas as leituras
export async function getAllLeituras(req, res) {
  try {
    const leituras = await find();
    res.json(leituras);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Função para buscar uma leitura específica pelo ID
export async function getLeituraById(req, res) {
  try {
    const leitura = await findById(req.params.id);
    if (leitura === null) {
      return res.status(404).json({ message: 'Leitura não encontrada' });
    }
    res.json(leitura);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Função para criar uma nova leitura
export async function createLeitura(req, res) {
  const leitura = new Leitura({
    BSSID: req.body.BSSID,
    idLocal: req.body.idLocal,
    rssi: req.body.rssi
  });

  try {
    const newLeitura = await leitura.save();
    res.status(201).json(newLeitura);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Função para atualizar uma leitura existente pelo ID
export async function updateLeituraById(req, res) {
    try {
      const leitura = await findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (leitura === null) {
        return res.status(404).json({ message: 'Leitura não encontrada' });
      }
      res.json(leitura);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

// Função para excluir uma leitura existente pelo ID
export async function deleteLeituraById(req, res) {
    try {
      const leitura = await findByIdAndDelete(req.params.id);
      if (leitura === null) {
        return res.status(404).json({ message: 'Leitura não encontrada' });
      }
      res.json({ message: 'Leitura excluída com sucesso' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  