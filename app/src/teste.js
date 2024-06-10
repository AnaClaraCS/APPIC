
import Rede from './models/rede.js';
import Local from './models/local.js';
import Leitura from './models/leitura.js';
import RedeController from './controllers/redeController.js';
import LocalController from './controllers/localController.js';
import LeituraController from './controllers/leituraController.js';

async function main() {
    const redeController = new RedeController();
    const localController = new LocalController();
    const leituraController = new LeituraController();

    let redeID;
    let localID;
    let leituraID;

    // Criar uma nova rede
    const novaRede = new Rede({
        bssid: '00:11:22:33:44:66',
        nome: 'Rede de Teste app',
    });

    try {
        redeID = await redeController.criarRede(novaRede);
        console.log('Rede criada com sucesso!'+redeID);
    } catch (error) {
        console.error('Erro ao criar rede:', error);
    }

    // Criar um novo local
    const novoLocal = new Local({
        x: 70,
        y: 70,
        andar: 7,
        descricao: 'Local de Teste app'
    });

    try {
        localID = await localController.criarLocal(novoLocal);
        console.log('Local criado com sucesso!'+localID);
    } catch (error) {
        console.error('Erro ao criar local:', error);
    }

    // Criar uma nova leitura
    try {
        console.log(redeID+localID);
        const novaLeitura = new Leitura({
            bssid: redeID,
            idLocal: localID,
            rssi: -77,
        });

        leituraID = await leituraController.criarLeitura(novaLeitura);
        console.log('Leitura criada com sucesso!'+leituraID);
    } catch (error) {
        console.error('Erro ao criar leitura:', error);
    }

    const rede = await redeController.obterRede(redeID);
    console.log(rede);

    const local = await localController.obterLocal(localID);
    console.log(local);

    const leitura = await leituraController.obterLeitura(leituraID);
    console.log(leitura);

}

main();
