import express from 'express';
import LeituraController from '../controllers/leituraController';

const router = express.Router();
const leituraController = new LeituraController();

// Criar uma nova leitura
router.post('/leituras', async (req, res) => {
  try {
    await leituraController.criarLeitura(req.body);
    res.status(201).send({ message: 'Leitura criada com sucesso!' });
  } catch (error) {
    res.status(500).send({ message: 'Erro ao criar a leitura', error: error.message });
  }
});

// Obter todas as leituras
router.get('/leituras', async (req, res) => {
  try {
    const leituras = await leituraController.obterLeituras();
    res.status(200).send(leituras);
  } catch (error) {
    res.status(500).send({ message: 'Erro ao obter leituras', error: error.message });
  }
});

// Obter uma leitura específica pelo ID
router.get('/leituras/:idLeitura', async (req, res) => {
  try {
    const idLeitura = req.params.idLeitura;
    const leitura = await leituraController.obterLeitura(idLeitura);
    if (leitura) {
      res.status(200).send(leitura);
    } else {
      res.status(404).send({ message: 'Leitura não encontrada' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Erro ao obter a leitura', error: error.message });
  }
});

// Atualizar uma leitura
router.put('/leituras/:idLeitura', async (req, res) => {
  try {
    const idLeitura = req.params.idLeitura;
    const dadosAtualizados = req.body;
    await leituraController.atualizarLeitura(idLeitura, dadosAtualizados);
    res.status(200).send({ message: 'Leitura atualizada com sucesso!' });
  } catch (error) {
    res.status(500).send({ message: 'Erro ao atualizar a leitura', error: error.message });
  }
});

// Deletar uma leitura
router.delete('/leituras/:idLeitura', async (req, res) => {
  try {
    const idLeitura = req.params.idLeitura;
    await leituraController.deletarLeitura(idLeitura);
    res.status(200).send({ message: 'Leitura deletada com sucesso!' });
  } catch (error) {
    res.status(500).send({ message: 'Erro ao deletar a leitura', error: error.message });
  }
});

export default router;
