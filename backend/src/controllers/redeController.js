import { Router } from 'express';
const router = Router();
import Rede, { find, findByIdAndUpdate, findByIdAndDelete } from '../models/rede';

// CREATE - Criar um novo rede
router.post('/locais', async (req, res) => {
  try {
    const rede = new Rede(req.body);
    await rede.save();
    res.status(201).send(rede);
  } catch (error) {
    res.status(400).send(error);
  }
});

// READ - Obter todos os locais
router.get('/locais', async (req, res) => {
  try {
    const locais = await find();
    res.send(locais);
  } catch (error) {
    res.status(500).send(error);
  }
});

// UPDATE - Atualizar um rede existente
router.patch('/locais/:id', async (req, res) => {
  try {
    const rede = await findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!rede) {
      return res.status(404).send();
    }
    res.send(rede);
  } catch (error) {
    res.status(400).send(error);
  }
});

// DELETE - Excluir um rede
router.delete('/locais/:id', async (req, res) => {
  try {
    const rede = await findByIdAndDelete(req.params.id);
    if (!rede) {
      return res.status(404).send();
    }
    res.send(rede);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
