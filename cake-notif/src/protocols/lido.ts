import { apiCaller } from '../apiCaller';
import { tryExecuteRequest } from '../tryExecute';
import { APYProvider, Token, aprToApy } from '../utils';

export default class Lido implements APYProvider {
  id = 'lido';
  name = 'LIDO';
  siteUrl = 'https://lido.fi/';

  async getAPY(inputToken: Token) {
    const [res] = await tryExecuteRequest(() =>
      apiCaller.get('https://eth-api.lido.fi/v1/protocol/steth/apr/sma')
    );
    const apr = res.data.smaApr / 100;
    return aprToApy(apr, 365);
  }

  async getTVL() {
    const [res] = await tryExecuteRequest(() =>
      apiCaller.get('https://eth-api.lido.fi/v1/protocol/steth/stats')
    );
    return parseFloat(res.marketCap);
  }
}
