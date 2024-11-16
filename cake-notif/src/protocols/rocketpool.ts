import { apiCaller } from '../apiCaller';
import { tryExecuteRequest } from '../tryExecute';
import { APYProvider, Token, aprToApy } from '../utils';

export default class RocketPool implements APYProvider {
  id = 'rocketpool';
  name = 'Rocket Pool';
  siteUrl = 'https://rocketpool.net/';

  async getAPY(inputToken: Token): Promise<number> {
    const [res, err] = await tryExecuteRequest(() =>
      apiCaller.get('https://stake.rocketpool.net/api/mainnet/payload')
    );

    if (err) return 0;

    const apr = parseFloat(res.rethAPR) / 100;
    return aprToApy(apr, 365);
  }

  async getTVL(): Promise<number> {
    const [res, err] = await tryExecuteRequest(() =>
      apiCaller.get('https://stake.rocketpool.net/api/mainnet/payload')
    );

    if (err) return 0;
    const totalStaked = parseFloat(res.stats.ethStakingTotal);
    const ethPrice = parseFloat(res.ethPrice);
    return totalStaked * ethPrice;
  }
}
