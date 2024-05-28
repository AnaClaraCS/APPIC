import express from 'express';
import LocalController from '../controllers/LocalController';
import Local from '../models/local';

const router = express.Router();
const localController = new LocalController();

// Criar um novo local
router.post('/locais', async (req, res) => {
  try {
    const novoLocal = new Local(req.body);
    await LocalController.criarLocal(novoLocal);
    res.status(201).send({ message: 'Local criado com sucesso!' });
  } catch (error) {
    res.status(500).send({ message: 'Erro ao criar o local', error: error.message });
  }
});

// Obter todos os locais
router.get('/locais', async (req, res) => {
  try {
    const locais = await localController.obterLocais();
    res.status(200).send(locais);
  } catch (error) {
    res.status(500).send({ message: 'Erro ao obter locais', error: error.message });
  }
});

// Obter um local específico pelo ID
router.get('/locais/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const local = await localController.obterLocal(id);
    if (local) {
      res.status(200).send(local);
    } else {
      res.status(404).send({ message: 'Local não encontrado' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Erro ao obter o local', error: error.message });
  }
});

// Atualizar um local
router.put('/locais/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const dadosAtualizados = req.body;
    await localController.atualizarLocal(id, dadosAtualizados);
    res.status(200).send({ message: 'Local atualizado com sucesso!' });
  } catch (error) {
    res.status(500).send({ message: 'Erro ao atualizar o local', error: error.message });
  }
});

// Deletar um local
router.delete('/locais/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await localController.deletarLocal(id);
    res.status(200).send({ message: 'Local deletado com sucesso!' });
  } catch (error) {
    res.status(500).send({ message: 'Erro ao deletar o local', error: error.message });
  }
});

export default router;
