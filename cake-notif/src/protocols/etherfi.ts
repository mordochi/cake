import { apiCaller } from '../apiCaller';
import { tryExecuteRequest } from '../tryExecute';
import { APYProvider, Token, aprToApy } from '../utils';

export default class EtherFi implements APYProvider {
  id = 'etherfi';
  name = 'ether.fi';
  siteUrl = 'https://www.ether.fi/';

  async getAPY(inputToken: Token): Promise<number> {
    const [res, err] = await tryExecuteRequest(() =>
      apiCaller.get('/case/api/etherfi/apy')
    );

    if (err) {
      return 0;
    }
    const apr = res.latest_aprs.at(-1) as number;
    // This formula is found from code of https://app.ether.fi/eeth
    return aprToApy(apr / 0.9 / 100 / 100, 365);
  }

  async getTVL(): Promise<number> {
    const [res, err] = await tryExecuteRequest(() =>
      apiCaller.get('/case/api/etherfi/tvl')
    );

    if (err) {
      return 0;
    }
    return res.tvl as number;
  }
}
