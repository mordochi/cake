import { Address, erc20Abi, formatUnits, getContract } from 'viem';
import { apiCaller } from '../apiCaller';
import { tryExecuteRequest } from '../tryExecute';
import { APYProvider, publicClient, Token } from '../utils';

export default class Ethena implements APYProvider {
  id = 'ethena';
  name = 'Ethena';
  siteUrl = 'https://www.ethena.fi';

  async getAPY(inputToken: Token): Promise<number> {
    const [res] = await tryExecuteRequest(() =>
      apiCaller.get(
        'https://app.ethena.fi/api/yields/protocol-and-staking-yield'
      )
    );
    return res.stakingYield.value / 100;
  }

  async getTVL(): Promise<number> {
    const client = publicClient;
    const usde = getContract({
      address: this.usdeAddr,
      abi: erc20Abi,
      client,
    });
    const decimals = await usde.read.decimals();
    const totalSupply = (await usde.read.totalSupply()) as bigint;
    return Number(formatUnits(totalSupply, decimals));
  }

  private usdeAddr = '0x4c9edd5852cd905f086c759e8383e09bff1e68b3' as Address;
}
