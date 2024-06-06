import express from 'express';
import RedeController from '../controllers/redeController.js';
import Rede from '../models/rede.js';

const router = express.Router();
const redeController = new RedeController();

// Criar uma nova rede
router.post('/redes', async (req, res) => {
  try {
    const novaRede = new Rede(req.body.bssid, req.body.nome);
    await redeController.criarRede(novaRede);
    res.status(201).send({ message: 'Rede criada com sucesso!' });
  } catch (error) {
    res.status(500).send({ message: 'Erro ao criar a rede', error: error.message });
  }
});

// Obter todas as redes
router.get('/redes', async (req, res) => {
  try {
    const redes = await redeController.obterRedes();
    res.status(200).send(redes);
  } catch (error) {
    res.status(500).send({ message: 'Erro ao obter redes', error: error.message });
  }
});

// Obter uma rede específica pelo BSSID
router.get('/redes/:bssid', async (req, res) => {
  try {
    const bssid = req.params.bssid;
    const rede = await redeController.obterRede(bssid);
    if (rede) {
      res.status(200).send(rede);
    } else {
      res.status(404).send({ message: 'Rede não encontrada' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Erro ao obter a rede', error: error.message });
  }
});

// Atualizar uma rede
router.put('/redes/:bssid', async (req, res) => {
  try {
    const bssid = req.params.bssid;
    const dadosAtualizados = req.body;
    await redeController.atualizarRede(bssid, dadosAtualizados);
    res.status(200).send({ message: 'Rede atualizada com sucesso!' });
  } catch (error) {
    res.status(500).send({ message: 'Erro ao atualizar a rede', error: error.message });
  }
});

// Deletar uma rede
router.delete('/redes/:bssid', async (req, res) => {
  try {
    const bssid = req.params.bssid;
    await redeController.deletarRede(bssid);
    res.status(200).send({ message: 'Rede deletada com sucesso!' });
  } catch (error) {
    res.status(500).send({ message: 'Erro ao deletar a rede', error: error.message });
  }
});

export default router;
