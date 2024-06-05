import express from 'express';
import bodyParser from 'body-parser';
import localRoutes from './routes/localRoutes.js';
import redeRoutes from './routes/redeRoutes.js';
import leituraRoutes from './routes/leituraRoutes.js';

const app = express();
const port = process.env.PORT || 3000;

// Middleware para analisar JSON
app.use(bodyParser.json());

// Definindo as rotas
app.use('/api', localRoutes);
app.use('/api', redeRoutes);
app.use('/api', leituraRoutes);

// Rota raiz para verificação
app.get('/', (req, res) => {
  res.send('API está funcionando!');
});

// Inicie o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
