import { connect, connection } from 'mongoose';

// Conectar ao MongoDB , &appName=AppICLocalizacao
connect('mongodb+srv://usuariobackend:usuariobackend@appiclocalizacao.4huus1h.mongodb.net/mapeamento?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Verificar a conexão
const db = connection;
db.on('error', console.error.bind(console, 'Erro na conexão com o MongoDB:'));
db.once('open', () => {
  console.log('Conexão com o MongoDB estabelecida com sucesso!');
});

export default db;
