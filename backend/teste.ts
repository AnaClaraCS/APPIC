import firebase from 'firebase/app';
import 'firebase/database';
import Rede from './src/models/rede';
import Local from './src/models/local';
import Leitura from './src/models/leitura';
import RedeController from './src/controllers/redeController';
import LocalController from './src/controllers/localController';
import LeituraController from './src/controllers/leituraController';


async function main() {
    const redeController = new RedeController();
    const localController = new LocalController();
    const leituraController = new LeituraController();

    // Criar uma nova rede
    const novaRede: Rede = {
        bssid: '00:11:22:33:44:55',
        nome: 'Rede de Teste',
    };

    try {
        await redeController.criarRede(novaRede);
        console.log('Rede criada com sucesso!');
    } catch (error) {
        console.error('Erro ao criar rede:', error);
    }

    // Criar um novo local
    const novoLocal: Local = {
        idLocal: "1",
        x: 10,
        y: 20,
        andar: 1,
        descricao: 'Local de Teste'
    };

    try {
        await localController.criarLocal(novoLocal);
        console.log('Local criado com sucesso!');
    } catch (error) {
        console.error('Erro ao criar local:', error);
    }

    // Criar uma nova leitura
    try {
        const novaLeitura = {
            bssid: novaRede.bssid,
            idLocal: novoLocal.idLocal,
            rssi: -70,
        };

        await leituraController.criarLeitura(novaLeitura);
        console.log('Leitura criada com sucesso!');
    } catch (error) {
        console.error('Erro ao criar leitura:', error);
    }
}

main();
