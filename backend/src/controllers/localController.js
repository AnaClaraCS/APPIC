import { Router } from 'express';
const router = Router();
import Local, { find, findByIdAndUpdate, findByIdAndDelete } from '../models/local';

// CREATE - Criar um novo local
router.post('/locais', async (req, res) => {
  try {
    const local = new Local(req.body);
    await local.save();
    res.status(201).send(local);
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

// UPDATE - Atualizar um local existente
router.patch('/locais/:id', async (req, res) => {
  try {
    const local = await findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!local) {
      return res.status(404).send();
    }
    res.send(local);
  } catch (error) {
    res.status(400).send(error);
  }
});

// DELETE - Excluir um local
router.delete('/locais/:id', async (req, res) => {
  try {
    const local = await findByIdAndDelete(req.params.id);
    if (!local) {
      return res.status(404).send();
    }
    res.send(local);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
