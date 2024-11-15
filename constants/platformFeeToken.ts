import { Address } from 'viem';
import {
  arbitrum,
  avalanche,
  base,
  blast,
  bsc,
  mainnet,
  merlin,
  optimism,
  polygon,
  scroll,
} from 'viem/chains';

export interface IPlatformFeeTokenInfo {
  symbol: string;
  decimals: number;
  feeAmount: bigint;
}

const ETH_FEE_AMOUNT: bigint = 60_000_000_000_000n; // decimals: 18
const USD_FEE_AMOUNT_6: bigint = 200_000n; // dicimals: 6
const USD_FEE_AMOUNT_18: bigint = 200_000_000_000_000_000n; // decimals: 18
const POL_FEE_AMOUNT: bigint = 400_000_000_000_000_000n; // decimals: 18
const BTC_FEE_AMOUNT: bigint = 400n; // decimals: 8
const BNB_FEE_AMOUNT: bigint = 35_000n; // decimals: 8
const AVAX_FEE_AMOUNT: bigint = 770_000n; // decimals: 8

const MAINNET_FEE_INFOS: { [key: Address]: IPlatformFeeTokenInfo } = {
  '0x0': { symbol: 'ETH', decimals: 18, feeAmount: ETH_FEE_AMOUNT },
  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48': {
    symbol: 'USDC',
    decimals: 6,
    feeAmount: USD_FEE_AMOUNT_6,
  },
  '0xdAC17F958D2ee523a2206206994597C13D831ec7': {
    symbol: 'USDT',
    decimals: 6,
    feeAmount: USD_FEE_AMOUNT_6,
  },
  '0x6B175474E89094C44Da98b954EedeAC495271d0F': {
    symbol: 'DAI',
    decimals: 18,
    feeAmount: USD_FEE_AMOUNT_18,
  },
  '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2': {
    symbol: 'WETH',
    decimals: 18,
    feeAmount: ETH_FEE_AMOUNT,
  },
  '0x4c9EDD5852cd905f086C759E8383e09bff1E68B3': {
    symbol: 'USDe',
    decimals: 18,
    feeAmount: USD_FEE_AMOUNT_18,
  },
  '0x83F20F44975D03b1b09e64809B757c47f942BEeA': {
    symbol: 'sDAI',
    decimals: 18,
    feeAmount: USD_FEE_AMOUNT_18,
  },
  '0x6c3ea9036406852006290770BEdFcAbA0e23A0e8': {
    symbol: 'PYUSD',
    decimals: 6,
    feeAmount: USD_FEE_AMOUNT_6,
  },
  '0x5f98805A4E8be255a32880FDeC7F6728C6568bA0': {
    symbol: 'LUSD',
    decimals: 18,
    feeAmount: USD_FEE_AMOUNT_18,
  },
  '0xf939E0A03FB07F59A73314E73794Be0E57ac1b4E': {
    symbol: 'crvUSD',
    decimals: 18,
    feeAmount: USD_FEE_AMOUNT_18,
  },
  '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0': {
    symbol: 'wstETH',
    decimals: 18,
    feeAmount: ETH_FEE_AMOUNT,
  },
  '0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee': {
    symbol: 'weETH',
    decimals: 18,
    feeAmount: ETH_FEE_AMOUNT,
  },
  '0xae78736Cd615f374D3085123A210448E74Fc6393': {
    symbol: 'rETH',
    decimals: 18,
    feeAmount: ETH_FEE_AMOUNT,
  },
  '0xBe9895146f7AF43049ca1c1AE358B0541Ea49704': {
    symbol: 'cbETH',
    decimals: 18,
    feeAmount: ETH_FEE_AMOUNT,
  },
  '0xf1C9acDc66974dFB6dEcB12aA385b9cD01190E38': {
    symbol: 'osETH',
    decimals: 18,
    feeAmount: ETH_FEE_AMOUNT,
  },
  '0x4d5F47FA6A74757f35C14fD3a6Ef8E3C9BC514E8': {
    symbol: 'aEthWETH',
    decimals: 18,
    feeAmount: ETH_FEE_AMOUNT,
  },
  '0x0B925eD163218f6662a35e0f0371Ac234f9E9371': {
    symbol: 'aEthwstETH',
    decimals: 18,
    feeAmount: ETH_FEE_AMOUNT,
  },
  '0xBdfa7b7893081B35Fb54027489e2Bc7A38275129': {
    symbol: 'aEthweETH',
    decimals: 18,
    feeAmount: ETH_FEE_AMOUNT,
  },
  '0xCc9EE9483f662091a1de4795249E24aC0aC2630f': {
    symbol: 'aEthrETH',
    decimals: 18,
    feeAmount: ETH_FEE_AMOUNT,
  },
  '0x977b6fc5dE62598B08C85AC8Cf2b745874E8b78c': {
    symbol: 'aEthcbETH',
    decimals: 18,
    feeAmount: ETH_FEE_AMOUNT,
  },
  '0x927709711794F3De5DdBF1D176bEE2D55Ba13c21': {
    symbol: 'aEthosETH',
    decimals: 18,
    feeAmount: ETH_FEE_AMOUNT,
  },
  '0x23878914EFE38d27C4D67Ab83ed1b93A74D4086a': {
    symbol: 'aEthUSDT',
    decimals: 6,
    feeAmount: USD_FEE_AMOUNT_6,
  },
  '0x98C23E9d8f34FEFb1B7BD6a91B7FF122F4e16F5c': {
    symbol: 'aEthUSDC',
    decimals: 6,
    feeAmount: USD_FEE_AMOUNT_6,
  },
  '0x4F5923Fc5FD4a93352581b38B7cD26943012DECF': {
    symbol: 'aEthUSDe',
    decimals: 18,
    feeAmount: USD_FEE_AMOUNT_18,
  },
  '0x018008bfb33d285247A21d44E50697654f754e63': {
    symbol: 'aEthDAI',
    decimals: 18,
    feeAmount: USD_FEE_AMOUNT_18,
  },
  '0x4C612E3B15b96Ff9A6faED838F8d07d479a8dD4c': {
    symbol: 'aEthsDAI',
    decimals: 18,
    feeAmount: USD_FEE_AMOUNT_18,
  },
  '0x0C0d01AbF3e6aDfcA0989eBbA9d6e85dD58EaB1E': {
    symbol: 'aEthPYUSD',
    decimals: 6,
    feeAmount: USD_FEE_AMOUNT_6,
  },
  '0x3Fe6a295459FAe07DF8A0ceCC36F37160FE86AA9': {
    symbol: 'aEthLUSD',
    decimals: 18,
    feeAmount: USD_FEE_AMOUNT_18,
  },
  '0xb82fa9f31612989525992FCfBB09AB22Eff5c85A': {
    symbol: 'aEthcrvUSD',
    decimals: 18,
    feeAmount: USD_FEE_AMOUNT_18,
  },
  '0xA17581A9E3356d9A858b789D68B4d866e593aE94': {
    symbol: 'cWETHv3',
    decimals: 18,
    feeAmount: ETH_FEE_AMOUNT,
  },
  '0xc3d688B66703497DAA19211EEdff47f25384cdc3': {
    symbol: 'cUSDCv3',
    decimals: 6,
    feeAmount: USD_FEE_AMOUNT_6,
  },
  '0xbf5495Efe5DB9ce00f80364C8B423567e58d2110': {
    symbol: 'ezETH',
    decimals: 18,
    feeAmount: ETH_FEE_AMOUNT,
  },
  '0xA35b1B31Ce002FBF2058D22F30f95D405200A15b': {
    symbol: 'ETHx',
    decimals: 18,
    feeAmount: ETH_FEE_AMOUNT,
  },
  '0xf951E335afb289353dc249e82926178EaC7DEd78': {
    symbol: 'swETH',
    decimals: 18,
    feeAmount: ETH_FEE_AMOUNT,
  },
  '0xac3E018457B222d93114458476f3E3416Abbe38F': {
    symbol: 'sfrxETH',
    decimals: 18,
    feeAmount: ETH_FEE_AMOUNT,
  },
  '0x9Ba021B0a9b958B5E75cE9f6dff97C7eE52cb3E6': {
    symbol: 'apxETH',
    decimals: 18,
    feeAmount: ETH_FEE_AMOUNT,
  },
};

const SCROLL_FEE_INFOS: { [key: Address]: IPlatformFeeTokenInfo } = {
  '0x0': { symbol: 'ETH', decimals: 18, feeAmount: ETH_FEE_AMOUNT },
  '0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4': {
    symbol: 'USDC',
    decimals: 6,
    feeAmount: USD_FEE_AMOUNT_6,
  },
  '0xB2f97c1Bd3bf02f5e74d13f02E3e26F93D77CE44': {
    symbol: 'cUSDCv3',
    decimals: 6,
    feeAmount: USD_FEE_AMOUNT_6,
  },
  '0xAD3d07d431B85B525D81372802504Fa18DBd554c': {
    symbol: 'rSTONE',
    decimals: 18,
    feeAmount: ETH_FEE_AMOUNT,
  },
  '0x1D738a3436A8C49CefFbaB7fbF04B660fb528CbD': {
    symbol: 'aScrUSDC',
    decimals: 6,
    feeAmount: USD_FEE_AMOUNT_6,
  },
  '0xAE1846110F72f2DaaBC75B7cEEe96558289EDfc5': {
    symbol: 'rUSDC',
    decimals: 6,
    feeAmount: USD_FEE_AMOUNT_6,
  },
};

const POLYGON_FEE_INFOS: { [key: Address]: IPlatformFeeTokenInfo } = {
  '0x0': { symbol: 'POL', decimals: 18, feeAmount: POL_FEE_AMOUNT },
  '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174': {
    symbol: 'USDC.e',
    decimals: 6,
    feeAmount: USD_FEE_AMOUNT_6,
  },
  '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359': {
    symbol: 'USDC',
    decimals: 6,
    feeAmount: USD_FEE_AMOUNT_6,
  },
  '0xc2132D05D31c914a87C6611C10748AEb04B58e8F': {
    symbol: 'USDT',
    decimals: 6,
    feeAmount: USD_FEE_AMOUNT_6,
  },
  '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063': {
    symbol: 'DAI',
    decimals: 18,
    feeAmount: USD_FEE_AMOUNT_18,
  },
  '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619': {
    symbol: 'WETH',
    decimals: 18,
    feeAmount: ETH_FEE_AMOUNT,
  },
  '0x03b54A6e9a984069379fae1a4fC4dBAE93B3bCCD': {
    symbol: 'wstETH',
    decimals: 18,
    feeAmount: ETH_FEE_AMOUNT,
  },
  '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270': {
    symbol: 'WMATIC',
    decimals: 18,
    feeAmount: POL_FEE_AMOUNT,
  },
  '0xfa68FB4628DFF1028CFEc22b4162FCcd0d45efb6': {
    symbol: 'MaticX',
    decimals: 18,
    feeAmount: POL_FEE_AMOUNT,
  },
  '0x3A58a54C066FdC0f2D55FC9C89F0415C92eBf3C4': {
    symbol: 'stMATIC',
    decimals: 18,
    feeAmount: POL_FEE_AMOUNT,
  },
  '0x6d80113e533a2C0fe82EaBD35f1875DcEA89Ea97': {
    symbol: 'aPolWMATIC',
    decimals: 18,
    feeAmount: POL_FEE_AMOUNT,
  },
  '0x80cA0d8C38d2e2BcbaB66aA1648Bd1C7160500FE': {
    symbol: 'aPolMATICX',
    decimals: 18,
    feeAmount: POL_FEE_AMOUNT,
  },
  '0xEA1132120ddcDDA2F119e99Fa7A27a0d036F7Ac9': {
    symbol: 'aPolSTMATIC',
    decimals: 18,
    feeAmount: POL_FEE_AMOUNT,
  },
  '0xe50fA9b3c56FfB159cB0FCA61F5c9D750e8128c8': {
    symbol: 'aPolWETH',
    decimals: 18,
    feeAmount: ETH_FEE_AMOUNT,
  },
  '0xf59036CAEBeA7dC4b86638DFA2E3C97dA9FcCd40': {
    symbol: 'aPolwstETH',
    decimals: 18,
    feeAmount: ETH_FEE_AMOUNT,
  },
  '0x6ab707Aca953eDAeFBc4fD23bA73294241490620': {
    symbol: 'aPolUSDT',
    decimals: 6,
    feeAmount: USD_FEE_AMOUNT_6,
  },
  '0xA4D94019934D8333Ef880ABFFbF2FDd611C762BD': {
    symbol: 'aPolUSDCn',
    decimals: 6,
    feeAmount: USD_FEE_AMOUNT_6,
  },
  '0x625E7708f30cA75bfd92586e17077590C60eb4cD': {
    symbol: 'aPolUSDC',
    decimals: 6,
    feeAmount: USD_FEE_AMOUNT_6,
  },
  '0x82E64f49Ed5EC1bC6e43DAD4FC8Af9bb3A2312EE': {
    symbol: 'aPolDAI',
    decimals: 18,
    feeAmount: USD_FEE_AMOUNT_18,
  },
  '0xF25212E676D1F7F89Cd72fFEe66158f541246445': {
    symbol: 'cUSDCev3',
    decimals: 6,
    feeAmount: USD_FEE_AMOUNT_6,
  },
  '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6': {
    symbol: 'WBTC',
    decimals: 8,
    feeAmount: BTC_FEE_AMOUNT,
  },
  '0x90b2f54C6aDDAD41b8f6c4fCCd555197BC0F773B': {
    symbol: 'yvDAI-A',
    decimals: 18,
    feeAmount: USD_FEE_AMOUNT_18,
  },
  '0xA013Fbd4b711f9ded6fB09C1c0d358E2FbC2EAA0': {
    symbol: 'yvUSDC-A',
    decimals: 6,
    feeAmount: USD_FEE_AMOUNT_6,
  },
  '0xBb287E6017d3DEb0e2E65061e8684eab21060123': {
    symbol: 'yvUSDT-A',
    decimals: 6,
    feeAmount: USD_FEE_AMOUNT_6,
  },
  '0x305F25377d0a39091e99B975558b1bdfC3975654': {
    symbol: 'yvWETH-A',
    decimals: 18,
    feeAmount: ETH_FEE_AMOUNT,
  },
};

const BLAST_FEE_INFOS: { [key: Address]: IPlatformFeeTokenInfo } = {
  '0x0': { symbol: 'ETH', decimals: 18, feeAmount: ETH_FEE_AMOUNT },
};

const ARBITRUM_FEE_INFOS: { [key: Address]: IPlatformFeeTokenInfo } = {
  '0x0': { symbol: 'ETH', decimals: 18, feeAmount: ETH_FEE_AMOUNT },
  '0x35751007a407ca6FEFfE80b3cB397736D2cf4dbe': {
    symbol: 'weETH',
    decimals: 18,
    feeAmount: ETH_FEE_AMOUNT,
  },
  '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1': {
    symbol: 'WETH',
    decimals: 18,
    feeAmount: ETH_FEE_AMOUNT,
  },
  '0x5979D7b546E38E414F7E9822514be443A4800529': {
    symbol: 'wstETH',
    decimals: 18,
    feeAmount: ETH_FEE_AMOUNT,
  },
  '0xEC70Dcb4A1EFa46b8F2D97C310C9c4790ba5ffA8': {
    symbol: 'rETH',
    decimals: 18,
    feeAmount: ETH_FEE_AMOUNT,
  },
  '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9': {
    symbol: 'USDT',
    decimals: 6,
    feeAmount: USD_FEE_AMOUNT_6,
  },
  '0xaf88d065e77c8cC2239327C5EDb3A432268e5831': {
    symbol: 'USDC',
    decimals: 6,
    feeAmount: USD_FEE_AMOUNT_6,
  },
  '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8': {
    symbol: 'USDC.e',
    decimals: 6,
    feeAmount: USD_FEE_AMOUNT_6,
  },
  '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1': {
    symbol: 'DAI',
    decimals: 18,
    feeAmount: USD_FEE_AMOUNT_18,
  },
  '0x93b346b6BC2548dA6A1E7d98E9a421B42541425b': {
    symbol: 'LUSD',
    decimals: 18,
    feeAmount: USD_FEE_AMOUNT_18,
  },
  '0xe50fA9b3c56FfB159cB0FCA61F5c9D750e8128c8': {
    symbol: 'aArbWETH',
    decimals: 18,
    feeAmount: ETH_FEE_AMOUNT,
  },
  '0x8437d7C167dFB82ED4Cb79CD44B7a32A1dd95c77': {
    symbol: 'aArbweETH',
    decimals: 18,
    feeAmount: ETH_FEE_AMOUNT,
  },
  '0x513c7E3a9c69cA3e22550eF58AC1C0088e918FFf': {
    symbol: 'aArbwstETH',
    decimals: 18,
    feeAmount: ETH_FEE_AMOUNT,
  },
  '0x8Eb270e296023E9D92081fdF967dDd7878724424': {
    symbol: 'aArbrETH',
    decimals: 18,
    feeAmount: ETH_FEE_AMOUNT,
  },
  '0x6ab707Aca953eDAeFBc4fD23bA73294241490620': {
    symbol: 'aArbUSDT',
    decimals: 6,
    feeAmount: USD_FEE_AMOUNT_6,
  },
  '0x724dc807b04555b71ed48a6896b6F41593b8C637': {
    symbol: 'aArbUSDCn',
    decimals: 6,
    feeAmount: USD_FEE_AMOUNT_6,
  },
  '0x625E7708f30cA75bfd92586e17077590C60eb4cD': {
    symbol: 'aArbUSDC',
    decimals: 6,
    feeAmount: USD_FEE_AMOUNT_6,
  },
  '0x82E64f49Ed5EC1bC6e43DAD4FC8Af9bb3A2312EE': {
    symbol: 'aArbDAI',
    decimals: 18,
    feeAmount: USD_FEE_AMOUNT_18,
  },
  '0x8ffDf2DE812095b1D19CB146E4c004587C0A0692': {
    symbol: 'aArbLUSD',
    decimals: 18,
    feeAmount: USD_FEE_AMOUNT_18,
  },
  '0x9c4ec768c28520B50860ea7a15bd7213a9fF58bf': {
    symbol: 'cUSDCv3',
    decimals: 6,
    feeAmount: USD_FEE_AMOUNT_6,
  },
  '0xA5EDBDD9646f8dFF606d7448e414884C7d905dCA': {
    symbol: 'cUSDCev3',
    decimals: 6,
    feeAmount: USD_FEE_AMOUNT_6,
  },
};

const BASE_FEE_INFOS: { [key: Address]: IPlatformFeeTokenInfo } = {
  '0x0': { symbol: 'ETH', decimals: 18, feeAmount: ETH_FEE_AMOUNT },
  '0x4200000000000000000000000000000000000006': {
    symbol: 'WETH',
    decimals: 18,
    feeAmount: ETH_FEE_AMOUNT,
  },
  '0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452': {
    symbol: 'wstETH',
    decimals: 18,
    feeAmount: ETH_FEE_AMOUNT,
  },
  '0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22': {
    symbol: 'cbETH',
    decimals: 18,
    feeAmount: ETH_FEE_AMOUNT,
  },
  '0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A': {
    symbol: 'weETH',
    decimals: 18,
    feeAmount: ETH_FEE_AMOUNT,
  },
  '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913': {
    symbol: 'USDC',
    decimals: 6,
    feeAmount: USD_FEE_AMOUNT_6,
  },
  '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA': {
    symbol: 'USDbC',
    decimals: 6,
    feeAmount: USD_FEE_AMOUNT_6,
  },
  '0xD4a0e0b9149BCee3C920d2E00b5dE09138fd8bb7': {
    symbol: 'aBasWETH',
    decimals: 18,
    feeAmount: ETH_FEE_AMOUNT,
  },
  '0x99CBC45ea5bb7eF3a5BC08FB1B7E56bB2442Ef0D': {
    symbol: 'aBaswstETH',
    decimals: 18,
    feeAmount: ETH_FEE_AMOUNT,
  },
  '0xcf3D55c10DB69f28fD1A75Bd73f3D8A2d9c595ad': {
    symbol: 'aBascbETH',
    decimals: 18,
    feeAmount: ETH_FEE_AMOUNT,
  },
  '0x7C307e128efA31F540F2E2d976C995E0B65F51F6': {
    symbol: 'aBasweETH',
    decimals: 18,
    feeAmount: ETH_FEE_AMOUNT,
  },
  '0x4e65fE4DbA92790696d040ac24Aa414708F5c0AB': {
    symbol: 'aBasUSDC',
    decimals: 6,
    feeAmount: USD_FEE_AMOUNT_6,
  },
  '0x0a1d576f3eFeF75b330424287a95A366e8281D54': {
    symbol: 'aBasUSDbC',
    decimals: 6,
    feeAmount: USD_FEE_AMOUNT_6,
  },
  '0x46e6b214b524310239732D51387075E0e70970bf': {
    symbol: 'cWETHv3',
    decimals: 18,
    feeAmount: ETH_FEE_AMOUNT,
  },
  '0x9c4ec768c28520B50860ea7a15bd7213a9fF58bf': {
    symbol: 'cUSDbCv3',
    decimals: 6,
    feeAmount: USD_FEE_AMOUNT_6,
  },
  '0xb125E6687d4313864e53df431d5425969c15Eb2F': {
    symbol: 'cUSDCv3',
    decimals: 6,
    feeAmount: USD_FEE_AMOUNT_6,
  },
};

const OPTIMISM_FEE_INFOS: { [key: Address]: IPlatformFeeTokenInfo } = {
  '0x0': { symbol: 'ETH', decimals: 18, feeAmount: ETH_FEE_AMOUNT },
  '0x4200000000000000000000000000000000000006': {
    symbol: 'WETH',
    decimals: 18,
    feeAmount: ETH_FEE_AMOUNT,
  },
  '0x1F32b1c2345538c0c6f582fCB022739c4A194Ebb': {
    symbol: 'wstETH',
    decimals: 18,
    feeAmount: ETH_FEE_AMOUNT,
  },
  '0x9Bcef72be871e61ED4fBbc7630889beE758eb81D': {
    symbol: 'rETH',
    decimals: 18,
    feeAmount: ETH_FEE_AMOUNT,
  },
  '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58': {
    symbol: 'USDT',
    decimals: 6,
    feeAmount: USD_FEE_AMOUNT_6,
  },
  '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85': {
    symbol: 'USDC',
    decimals: 6,
    feeAmount: USD_FEE_AMOUNT_6,
  },
  '0x7F5c764cBc14f9669B88837ca1490cCa17c31607': {
    symbol: 'USDC.e',
    decimals: 6,
    feeAmount: USD_FEE_AMOUNT_6,
  },
  '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1': {
    symbol: 'DAI',
    decimals: 18,
    feeAmount: USD_FEE_AMOUNT_18,
  },
  '0xc40F949F8a4e094D1b49a23ea9241D289B7b2819': {
    symbol: 'LUSD',
    decimals: 18,
    feeAmount: USD_FEE_AMOUNT_18,
  },
  '0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9': {
    symbol: 'sUSD',
    decimals: 18,
    feeAmount: USD_FEE_AMOUNT_18,
  },
  '0xe50fA9b3c56FfB159cB0FCA61F5c9D750e8128c8': {
    symbol: 'aOptWETH',
    decimals: 18,
    feeAmount: ETH_FEE_AMOUNT,
  },
  '0xc45A479877e1e9Dfe9FcD4056c699575a1045dAA': {
    symbol: 'aOptwstETH',
    decimals: 18,
    feeAmount: ETH_FEE_AMOUNT,
  },
  '0x724dc807b04555b71ed48a6896b6F41593b8C637': {
    symbol: 'aOptrETH',
    decimals: 18,
    feeAmount: ETH_FEE_AMOUNT,
  },
  '0x6ab707Aca953eDAeFBc4fD23bA73294241490620': {
    symbol: 'aOptUSDT',
    decimals: 6,
    feeAmount: USD_FEE_AMOUNT_6,
  },
  '0x38d693cE1dF5AaDF7bC62595A37D667aD57922e5': {
    symbol: 'aOptUSDCn',
    decimals: 6,
    feeAmount: USD_FEE_AMOUNT_6,
  },
  '0x625E7708f30cA75bfd92586e17077590C60eb4cD': {
    symbol: 'aOptUSDC',
    decimals: 6,
    feeAmount: USD_FEE_AMOUNT_6,
  },
  '0x82E64f49Ed5EC1bC6e43DAD4FC8Af9bb3A2312EE': {
    symbol: 'aOptDAI',
    decimals: 18,
    feeAmount: USD_FEE_AMOUNT_18,
  },
  '0x8Eb270e296023E9D92081fdF967dDd7878724424': {
    symbol: 'aOptLUSD',
    decimals: 18,
    feeAmount: USD_FEE_AMOUNT_18,
  },
  '0x6d80113e533a2C0fe82EaBD35f1875DcEA89Ea97': {
    symbol: 'aOptSUSD',
    decimals: 18,
    feeAmount: USD_FEE_AMOUNT_18,
  },
  '0x2e44e174f7D53F0212823acC11C01A11d58c5bCB': {
    symbol: 'cUSDCv3',
    decimals: 6,
    feeAmount: USD_FEE_AMOUNT_6,
  },
  '0x995E394b8B2437aC8Ce61Ee0bC610D617962B214': {
    symbol: 'cUSDTv3',
    decimals: 6,
    feeAmount: USD_FEE_AMOUNT_6,
  },
};

const MERLIN_FEE_INFOS: { [key: Address]: IPlatformFeeTokenInfo } = {
  '0x0': { symbol: 'BTC', decimals: 8, feeAmount: BTC_FEE_AMOUNT },
  '0xF6D226f9Dc15d9bB51182815b320D3fBE324e1bA': {
    symbol: 'WBTC',
    decimals: 8,
    feeAmount: BTC_FEE_AMOUNT,
  },
};

const BCS_FEE_AMOUNT: { [key: Address]: IPlatformFeeTokenInfo } = {
  '0x0': { symbol: 'BNB', decimals: 8, feeAmount: BNB_FEE_AMOUNT },
};

const AVALANCHE_FEE_AMOUNT: { [key: Address]: IPlatformFeeTokenInfo } = {
  '0x0': { symbol: 'AVAX', decimals: 8, feeAmount: AVAX_FEE_AMOUNT },
};

export const PLATFORM_FEE_TOKEN_INFOS: {
  [key: number]: { [key: Address]: IPlatformFeeTokenInfo };
} = {
  [mainnet.id]: MAINNET_FEE_INFOS,
  [scroll.id]: SCROLL_FEE_INFOS,
  [polygon.id]: POLYGON_FEE_INFOS,
  [blast.id]: BLAST_FEE_INFOS,
  [arbitrum.id]: ARBITRUM_FEE_INFOS,
  [base.id]: BASE_FEE_INFOS,
  [optimism.id]: OPTIMISM_FEE_INFOS,
  [merlin.id]: MERLIN_FEE_INFOS,
  [bsc.id]: BCS_FEE_AMOUNT,
  [avalanche.id]: AVALANCHE_FEE_AMOUNT,
};
