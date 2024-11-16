import { CONSTANTS, PushAPI } from '@pushprotocol/restapi';
import { Address } from 'viem';
import Aave from './protocols/aave';
import Ethena from './protocols/ethena';
import EtherFi from './protocols/etherfi';
import Lido from './protocols/lido';
import RocketPool from './protocols/rocketpool';
import SparkLending from './protocols/sparkLending';
import {
  APYProvider,
  NATIVE_TOKEN_ADDRESS,
  Token,
  getTokenInfo,
  walletClient,
} from './utils';
import 'dotenv/config';

interface APYPair {
  protocol: APYProvider;
  tokenAddress: Address;
}

async function main() {
  const aave = new Aave();
  const ethena = new Ethena();
  const etherfi = new EtherFi();
  const lido = new Lido();
  const rocketPool = new RocketPool();
  const sparkLending = new SparkLending();

  const pairs: APYPair[] = [
    {
      protocol: aave,
      tokenAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    },
    {
      protocol: aave,
      tokenAddress: NATIVE_TOKEN_ADDRESS,
    },
    {
      protocol: ethena,
      tokenAddress: '0x4c9EDD5852cd905f086C759E8383e09bff1E68B3',
    },
    {
      protocol: etherfi,
      tokenAddress: NATIVE_TOKEN_ADDRESS,
    },
    {
      protocol: lido,
      tokenAddress: NATIVE_TOKEN_ADDRESS,
    },
    {
      protocol: rocketPool,
      tokenAddress: NATIVE_TOKEN_ADDRESS,
    },
  ];

  let maxAPYPair: APYPair | null = null;
  let maxAPY: number | null = null;
  let maxTokenInfo: Token | null = null;

  for (const pair of pairs) {
    const { protocol, tokenAddress } = pair;
    const tokenInfo = await getTokenInfo(tokenAddress as Address);
    if (!tokenInfo) {
      throw new Error('Token info not found');
    }
    const apy = await protocol.getAPY(tokenInfo);
    console.log(protocol.name, tokenInfo.symbol, apy);

    if (maxAPY === null || apy > maxAPY) {
      maxAPY = apy;
      maxAPYPair = pair;
      maxTokenInfo = tokenInfo;
    }
  }

  console.log(
    'Max APY',
    maxAPYPair?.protocol.name,
    maxTokenInfo?.symbol,
    maxAPY
  );
  console.log(maxTokenInfo);

  const protocolName = maxAPYPair?.protocol.name ?? '';
  const symbol = maxTokenInfo?.symbol ?? '';
  const apy = `${((maxAPY ?? 0) * 100).toFixed(2)}%`;

  console.log(`${protocolName}: ${symbol} - ${apy}`);

  const userCake = await PushAPI.initialize(walletClient, {
    env: CONSTANTS.ENV.PROD,
  });

  const res = await userCake.channel.send(['*'], {
    notification: {
      title: `🔥 ${apy} APY now on ${protocolName}`,
      body: `- APY: ${apy}
- Deposit Asset: ${symbol}
- Strategy Name: f(x) Protocol ${protocolName} ${symbol}
- Protocol: ${protocolName}`,
    },
  });

  console.log(`result: ${res.status}`);
}

main().catch(console.error);
