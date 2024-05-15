const express = require('express');
const router = express.Router();
const leituraController = require('../controllers/leituraController');

// Rota para buscar todas as leituras
router.get('/leituras', leituraController.getAllLeituras);

// Rota para buscar uma leitura específica pelo ID
router.get('/leituras/:id', leituraController.getLeituraById);

// Rota para criar uma nova leitura
router.post('/leituras', leituraController.createLeitura);

// Rota para atualizar uma leitura pelo ID
router.put('/leituras', leituraController.updateLeituraById);

// Rota para deletar uma leitura pelo ID
router.delete('/leituras', leituraController.deleteLeituraById);


module.exports = router;
