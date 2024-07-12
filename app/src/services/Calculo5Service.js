import LeituraController from '../controllers/leituraController.js';
import LocalController from '../controllers/localController.js';

class KalmanFilter {
  constructor(r, q, a = 1, b = 0, c = 1) {
    this.a = a; // Fator de transição de estado
    this.b = b; // Fator de controle de entrada
    this.c = c; // Fator de observação
    this.r = r; // Variância do ruído do processo
    this.q = q; // Variância do ruído da medição
    this.cov = NaN; // Matriz de covariância inicial
    this.x = NaN; // Valor do estado inicial
  }

  filter(z, u = 0) {
    if (isNaN(this.x)) {
      this.x = (1 / this.c) * z;
      this.cov = (1 / this.c) * this.q * (1 / this.c);
    } else {
      const predX = (this.a * this.x) + (this.b * u);
      const predCov = ((this.a * this.cov) * this.a) + this.r;
      const k = predCov * this.c * (1 / ((this.c * predCov * this.c) + this.q));
      this.x = predX + k * (z - (this.c * predX));
      this.cov = predCov - (k * this.c * predCov);
    }
    return this.x;
  }
}

class CalculoService {
  static async calcularLeiturasFiltradas() {
    const idsLocais = [
      '-O-7V5bo3TimVbKxffY9', '-O-7VJr_1l5izOZKiwJM', '-O-7VQZhovZ5dZ_fZQje',
      '-O-7VSpieitRSQtXTe_5', '-O-7VcPJ86SMEbCQu65t', '-O-7Vf5T4ghYgCnH7IfV',
      '-O-7VisE9jFh5Z5nRNTK', '-O-7VkdxWTCT9AwdxFFO', '-O-7VwZoTXnG4TEe6Xml',
      '-O-7Vyk_or_IAYZDzzc9', '-O-7W1ZAol7aOQ78VhTj', '-O-7W6943hepmdMbBe9a'
    ];

    const idLocalEspecifico = [
      '-O-7WEMIJoIn4JA3mi8y', '-O-7WGq6REke3WWl3Ax_', '-O-7WdNfFFWMWXlrAeXU',
      '-O-7WfX6HRdMoFBMQ8rx', '-O-7Wl_6oZknzeK37Mr9', '-O-7Wnsj9UHijK9bNkYf',
      '-O-7Wt16PbTYJ0ua77ZG', '-O-7WuK1Npu3Ztn7sLHz'
    ];

    const margem = 0;

    // Passo 1: Obter todas as leituras dos locais especificados
    const bancoDados = await this.obterLeiturasPorLocais(idsLocais);

    bancoDados.forEach(leitura => {
      const kalman = new KalmanFilter(0.1, 5); // Valores de R e Q podem ser ajustados conforme necessário
      leitura.rssi = kalman.filter(leitura.rssi);
    });

    let resultadoLocal = 0;

    for (const idLocal of idLocalEspecifico) {
      const leiturasLocalEspecifico = await this.obterLeiturasPorLocal(idLocal);

      leiturasLocalEspecifico.forEach(leitura => {
        const kalman = new KalmanFilter(0.1, 5); // Valores de R e Q podem ser ajustados conforme necessário
        leitura.rssi = kalman.filter(leitura.rssi);
      });

      const contagemPorLocal = this.filtrarContar(leiturasLocalEspecifico, bancoDados, margem);
      const coordenadasPorLocalPonderado = await this.calcularCoordenadasPorLocalPonderado(contagemPorLocal);
      resultadoLocal += await this.verifica(idLocal, coordenadasPorLocalPonderado);
    }

    console.log("Resultado: " + resultadoLocal / idLocalEspecifico.length);
    return resultadoLocal;
  }

  static async obterLeiturasPorLocais(idsLocais) {
    const leituras = [];
    for (const idLocal of idsLocais) {
      const leituraController = new LeituraController();
      const leiturasLocal = await leituraController.obterLeiturasPorLocal(idLocal);
      leituras.push(...leiturasLocal);
    }
    return leituras;
  }

  static async obterLeiturasPorLocal(idLocal) {
    const leituraController = new LeituraController();
    const leiturasLocal = await leituraController.obterLeiturasPorLocal(idLocal);
    return leiturasLocal;
  }

  static async obterTotalLeiturasPorLocal(idLocal) {
    const total = (await this.obterLeiturasPorLocal(idLocal)).length;
    return total;
  }

  static filtrarContar(leiturasLocal, leiturasTodos, margem) {
    const contagemPorLocal = {};
    for (const leituraLocal of leiturasLocal) {
      const { rssi, bssid } = leituraLocal;
      for (const leitura of leiturasTodos) {
        if (leitura.bssid === bssid && Math.abs(leitura.rssi - rssi) <= margem) {
          const similaridade = this.calcularSimilaridadeEuclidiana(leituraLocal, leitura);
          if (!contagemPorLocal[leitura.idLocal]) {
            contagemPorLocal[leitura.idLocal] = { contagem: 0 };
          }
          contagemPorLocal[leitura.idLocal].contagem += similaridade;
        }
      }
    }
    return contagemPorLocal;
  }

  static calcularSimilaridadeEuclidiana(leitura1, leitura2) {
    return 1 / (1 + Math.sqrt(Math.pow(leitura1.rssi - leitura2.rssi, 2)));
  }

  static async verifica(idLocal, coordenadasPorLocalPonderado) {
    const localController = new LocalController();
    const local = await localController.obterLocal(idLocal);
    const { x, y, andar } = coordenadasPorLocalPonderado;

    const distancia = Math.sqrt(Math.pow(local.x - x, 2) + Math.pow(local.y - y, 2));
    console.log(`Objetivo: (${local.x}, ${local.y}, ${local.andar}) - Encontrado: (${x}, ${y}, ${andar})`);
    console.log("Distancia: " + distancia);
    if (Math.round(andar) == local.andar) {
      console.log("Acertou o andar");
    } else {
      console.log("Errou o andar");
    }

    return distancia;
  }

  static async calcularCoordenadasPorLocalPonderado(contagem) {
    const locaisComContagem = Object.entries(contagem).map(([idLocal, { contagem }]) => ({ idLocal, contagem }));
    const locaisMaisFrequentes = locaisComContagem.sort((a, b) => b.contagem - a.contagem).slice(0, 3);

    let somaX = 0;
    let somaY = 0;
    let somaAndar = 0;
    let total = 0;

    const localController = new LocalController();

    for (const localContagem of locaisMaisFrequentes) {
      const local = await localController.obterLocal(localContagem.idLocal);
      const qtd = await this.obterTotalLeiturasPorLocal(local.idLocal);

      somaX += local.x * (localContagem.contagem / qtd);
      somaY += local.y * (localContagem.contagem / qtd);
      somaAndar += local.andar * (localContagem.contagem / qtd);
      total += (localContagem.contagem / qtd);
    }

    const x = total !== 0 ? somaX / total : 0;
    const y = total !== 0 ? somaY / total : 0;
    const andar = total !== 0 ? somaAndar / total : 0;

    return { x, y, andar };
  }
}

export default CalculoService;

