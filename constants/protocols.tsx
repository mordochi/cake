// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import Image, { StaticImageData } from 'next/image';
import { FunctionComponent, SVGProps } from 'react';
import { Protocol } from '@/cases/types';
import _1inchIcon from '@icons/protocol/1inch.svg?url';
import AaveIcon from '@icons/protocol/aave.svg?url';
import AerodromeIcon from '@icons/protocol/aerodrome.svg?url';
import AmbientIcon from '@icons/protocol/ambient.svg?url';
import ArbitrumIcon from '@icons/protocol/arbitrum.svg?url';
import BentoIcon from '@icons/protocol/bento-pt.svg?url';
import CogFinanceIcon from '@icons/protocol/cogFinance.svg?url';
import EigenlayerIcon from '@icons/protocol/eigenlayer.svg?url';
import EigenpieIcon from '@icons/protocol/eigenpie.svg?url';
import EthenaIcon from '@icons/protocol/ethena.svg?url';
import EtherFiIcon from '@icons/protocol/ether-fi.svg?url';
import GammaIcon from '@icons/protocol/gamma.svg?url';
import GenesisIcon from '@icons/protocol/genesis.svg?url';
import JuiceIcon from '@icons/protocol/juice.svg?url';
import KelpDAOIcon from '@icons/protocol/kelp-dao.svg?url';
import KyberNetworkIcon from '@icons/protocol/kyber-network.svg?url';
import LidoIcon from '@icons/protocol/lido.svg?url';
import MorphoIcon from '@icons/protocol/morpho.svg?url';
import OrbitIcon from '@icons/protocol/orbit.svg?url';
import PencilProtocolIcon from '@icons/protocol/pencil-protocol.svg?url';
import PendleIcon from '@icons/protocol/pendle.svg?url';
import RenzoIcon from '@icons/protocol/renzo.svg?url';
import SpaceFiIcon from '@icons/protocol/space-fi.svg?url';
import SwellIcon from '@icons/protocol/swell.svg?url';
import SyncSwapIcon from '@icons/protocol/sync-swap.svg?url';
import YearnIcon from '@icons/protocol/yearn.svg?url';
import ZircuitIcon from '@icons/protocol/zircuit.svg?url';
import ZoraIcon from '@icons/protocol/zora.png';

interface IProtocol {
  id: string;
  icon: FunctionComponent<SVGProps<SVGElement>> | null;
  name: string;
  link: string;
}

/**
 * We are not importing bento icon directly because we cannot resize it with properties width and height
 * It seems it should work when creating with {createElementNS}
 * Ref: https://stackoverflow.com/questions/54401138/svg-not-working-when-inserted-from-javascript
 */
const IconComponent = (iconPath: string | StaticImageData, alt: string) => {
  // eslint-disable-next-line react/display-name
  return (props: SVGProps<SVGElement>) => (
    // @ts-expect-error skip this error
    <Image src={iconPath} alt={alt} {...props} />
  );
};

const PROTOCOLS: Record<string, IProtocol> = {
  [Protocol.EtherFi]: {
    id: Protocol.EtherFi,
    icon: IconComponent(EtherFiIcon, 'Ether.fi'),
    name: 'Ether.fi',
    link: 'https://Ether.fi',
  },
  [Protocol.ArbitrumBridge]: {
    id: Protocol.ArbitrumBridge,
    icon: IconComponent(ArbitrumIcon, 'Arbitrum'),
    name: 'Arbitrum Official Bridge',
    link: 'https://bridge.arbitrum.io/?destinationChain=arbitrum-one&sourceChain=ethereum',
  },
  [Protocol.Swell]: {
    id: Protocol.Swell,
    icon: IconComponent(SwellIcon, 'Swell'),
    name: 'Swell',
    link: 'https://twitter.com/swellnetworkio',
  },
  [Protocol.Zircuit]: {
    id: Protocol.Zircuit,
    icon: IconComponent(ZircuitIcon, 'Zircuit'),
    name: 'Zircuit',
    link: 'https://twitter.com/ZircuitL2',
  },
  [Protocol.Ethena]: {
    id: Protocol.Ethena,
    icon: IconComponent(EthenaIcon, 'Ethena'),
    name: 'Ethena',
    link: 'https://twitter.com/ethena_labs',
  },
  [Protocol.Renzo]: {
    id: Protocol.Renzo,
    icon: IconComponent(RenzoIcon, 'Renzo'),
    name: 'Renzo',
    link: 'https://twitter.com/RenzoProtocol',
  },
  // @todo: rename -> pencil protocol
  [Protocol.Penpad]: {
    id: Protocol.Penpad,
    icon: IconComponent(PencilProtocolIcon, 'Penpad'),
    name: 'Penpad',
    link: 'https://twitter.com/pen_pad',
  },
  [Protocol.SyncSwap]: {
    id: Protocol.SyncSwap,
    icon: IconComponent(SyncSwapIcon, 'SyncSwap'),
    name: 'SyncSwap',
    link: 'https://twitter.com/syncswap',
  },
  [Protocol.KyberNetwork]: {
    id: Protocol.KyberNetwork,
    icon: IconComponent(KyberNetworkIcon, 'KyberNetwork'),
    name: 'KyberNetwork',
    link: 'https://twitter.com/kybernetwork',
  },
  [Protocol.SpaceFI]: {
    id: Protocol.SpaceFI,
    icon: IconComponent(SpaceFiIcon, 'SpaceFI'),
    name: 'SpaceFI',
    link: 'https://twitter.com/spacefi_io',
  },
  [Protocol.Ambient]: {
    id: Protocol.Ambient,
    icon: IconComponent(AmbientIcon, 'Ambient'),
    name: 'Ambient',
    link: 'https://twitter.com/ambient_finance',
  },
  [Protocol.CogFinance]: {
    id: Protocol.CogFinance,
    icon: IconComponent(CogFinanceIcon, 'CogFinance'),
    name: 'CogFinance',
    link: 'https://twitter.com/CogFinance',
  },
  [Protocol.Yearn]: {
    id: Protocol.Yearn,
    icon: IconComponent(YearnIcon, 'Yearn'),
    name: 'Yearn',
    link: 'https://twitter.com/yearnfi',
  },
  [Protocol.Lido]: {
    id: Protocol.Lido,
    icon: IconComponent(LidoIcon, 'Lido'),
    name: 'Lido',
    link: 'https://twitter.com/LidoFinance',
  },
  [Protocol.Genesis]: {
    id: Protocol.Genesis,
    icon: IconComponent(GenesisIcon, 'Genesis'),
    name: 'Genesis',
    link: 'https://twitter.com/Genesis_LRT',
  },
  [Protocol.EigenPie]: {
    id: Protocol.EigenPie,
    icon: IconComponent(EigenpieIcon, 'EigenPie'),
    name: 'EigenPie',
    link: 'https://twitter.com/Eigenpiexyz_io',
  },
  [Protocol.Juice]: {
    id: Protocol.Juice,
    icon: IconComponent(JuiceIcon, 'Juice'),
    name: 'Juice',
    link: 'https://twitter.com/Juice_Finance',
  },
  [Protocol.KelpDAO]: {
    id: Protocol.KelpDAO,
    icon: IconComponent(KelpDAOIcon, 'KelpDAO'),
    name: 'KelpDAO',
    link: 'https://twitter.com/KelpDAO',
  },
  [Protocol.Pendle]: {
    id: Protocol.Pendle,
    icon: IconComponent(PendleIcon, 'Pendle'),
    name: 'Pendle',
    link: 'https://twitter.com/pendle_fi',
  },
  [Protocol.Orbit]: {
    id: Protocol.Orbit,
    icon: IconComponent(OrbitIcon, 'Orbit'),
    name: 'Orbit',
    link: 'https://twitter.com/OrbitLending',
  },
  [Protocol.Aerodrom]: {
    id: Protocol.Aerodrom,
    icon: IconComponent(AerodromeIcon, 'Aerodrom'),
    name: 'Aerodrom',
    link: 'https://twitter.com/aerodromefi',
  },
  [Protocol.Eigenlayer]: {
    id: Protocol.Eigenlayer,
    icon: IconComponent(EigenlayerIcon, 'Eigenlayer'),
    name: 'Eigenlayer',
    link: 'https://twitter.com/eigenlayer',
  },
  [Protocol.AAVE]: {
    id: Protocol.AAVE,
    icon: IconComponent(AaveIcon, 'AAVE'),
    name: 'AAVE',
    link: 'https://twitter.com/aave',
  },
  [Protocol._1inch]: {
    id: Protocol._1inch,
    icon: IconComponent(_1inchIcon, '1inch'),
    name: '1inch',
    link: 'https://app.1inch.io',
  },
  [Protocol.Gamma]: {
    id: Protocol.Gamma,
    icon: IconComponent(GammaIcon, 'Gamma'),
    name: 'Gamma',
    link: 'https://twitter.com/GammaStrategies',
  },
  [Protocol.Morpho]: {
    id: Protocol.Morpho,
    icon: IconComponent(MorphoIcon, 'Morpho'),
    name: 'Morpho',
    link: 'https://x.com/MorphoLabs',
  },
  [Protocol.Zora]: {
    id: Protocol.Zora,
    icon: IconComponent(ZoraIcon, 'Zora'),
    name: 'Zora',
    link: 'https://twitter.com/ourzora',
  },
  [Protocol.AirPuff]: {
    id: Protocol.AirPuff,
    icon: null, // @todo: add icon
    name: 'AirPuff',
    link: 'https://twitter.com/airpuff_io',
  },
  [Protocol.Tranchess]: {
    id: Protocol.Tranchess,
    icon: null, // @todo: add icon
    name: 'Tranchess',
    link: 'https://twitter.com/Tranchess',
  },
  [Protocol.Izumi]: {
    id: Protocol.Izumi,
    icon: null, // @todo: add icon
    name: 'Izumi',
    link: 'https://twitter.com/izumi_Finance',
  },
  [Protocol.StakeStone]: {
    id: Protocol.StakeStone,
    icon: null, // @todo: add icon
    name: 'StakeStone',
    link: 'https://twitter.com/Stake_Stone',
  },
  [Protocol.BentoBatch]: {
    id: Protocol.BentoBatch,
    icon: IconComponent(BentoIcon, 'BentoBatch'),
    name: 'BentoBatch',
    link: 'https://x.com/bentobatch',
  },
  [Protocol.Stargate]: {
    id: Protocol.Stargate,
    icon: null, // @todo: add icon
    name: 'Stargate',
    link: 'https://x.com/StargateFinance',
  },
  [Protocol.Balancer]: {
    id: Protocol.Balancer,
    icon: null, // @todo: add icon
    name: 'Balancer',
    link: 'https://x.com/Balancer',
  },
  [Protocol.Aura]: {
    id: Protocol.Aura,
    icon: null, // @todo: add icon
    name: 'Aura',
    link: 'https://x.com/aurafinance',
  },
  [Protocol.MerlinSwap]: {
    id: Protocol.MerlinSwap,
    icon: null, // @todo: add icon
    name: 'MerlinSwap',
    link: 'https://x.com/merlinswap',
  },
  [Protocol.Solv]: {
    id: Protocol.Solv,
    icon: null, // @todo: add icon
    name: 'Solv Protocol',
    link: 'https://x.com/SolvProtocol',
  },
  [Protocol.MageFinance]: {
    id: Protocol.MageFinance,
    icon: null, // @todo: add icon
    name: 'Mage Finance',
    link: 'https://x.com/Mage_Finance',
  },
  [Protocol.AvalonFinance]: {
    id: Protocol.AvalonFinance,
    icon: null, // @todo: add icon
    name: 'Avalon Finance',
    link: 'https://x.com/avalonfinance_',
  },
  [Protocol.Compound]: {
    id: Protocol.Compound,
    icon: null, //@todo: add icon
    name: 'Compound',
    link: 'https://compound.finance/',
  },
  [Protocol.GMX]: {
    id: Protocol.GMX,
    icon: null, //@todo: add icon
    name: 'GMX',
    link: 'https://twitter.com/GMX_IO',
  },
  [Protocol.RocketPool]: {
    id: Protocol.RocketPool,
    icon: null, //@todo: add icon
    name: 'Rocket Pool',
    link: 'https://x.com/Rocket_Pool',
  },
  [Protocol.Coinbase]: {
    id: Protocol.Coinbase,
    icon: null, //@todo: add icon
    name: 'Coinbase',
    link: 'https://x.com/coinbase',
  },
  [Protocol.StakeWise]: {
    id: Protocol.StakeWise,
    icon: null, //@todo: add icon
    name: 'Stake Wise',
    link: 'https://x.com/stakewise_io',
  },
  [Protocol.Stader]: {
    id: Protocol.Stader,
    icon: null, //@todo: add icon
    name: 'Stader',
    link: 'https://x.com/staderlabs_eth',
  },
  [Protocol.FraxFinance]: {
    id: Protocol.FraxFinance,
    icon: null, //@todo: add icon
    name: 'Frax Finance',
    link: 'https://x.com/fraxfinance',
  },
  [Protocol.RedactedFinance]: {
    id: Protocol.RedactedFinance,
    icon: null, //@todo: add icon
    name: 'Redacted finance',
    link: 'https://x.com/redactedcartel',
  },
};

export default PROTOCOLS;
