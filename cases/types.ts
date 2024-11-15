import { HTMLProps } from 'react';
import { Hex, PublicClient as PublicClientType, Transport } from 'viem';
import { type UseAccountReturnType } from 'wagmi';
import { CHAINS } from '@/utils/generateHttpEndpoint';
import type { Abi, Address } from 'abitype';

export enum InputType {
  Text = 'Text',
  ERC20Amount = 'ERC20 Amount',
  NativeAmount = 'Native Amount',
  Address = 'Address',
}

export enum ActionParamType {
  tokenInput,
  addressInput,
}

export type ActionErc20Token = {
  type: InputType.ERC20Amount;
  tokenAddress: string;
};

export type ActionNativeToken = {
  type: InputType.NativeAmount;
};

export type ActionToken = ActionErc20Token | ActionNativeToken;

export type ActionParam =
  | {
      inputType: ActionParamType.tokenInput;
      token: {
        balance: string;
        decimal: number;
      } & ActionToken;
      userAddress: Address;
    }
  | {
      inputType: ActionParamType.addressInput;
      userAddress: string;
    };

export type ERC20AmountInputOptions = {
  token: Address;
};

export type ReceiverInputOptions = {
  isReceiver: boolean;
};

export type ActionContent = {
  name: string;
  getValue?: (param: ActionParam) => string | Promise<string>;
  hint?: string;
  actionButton?: {
    getValue: (value: string) => string | Promise<string>;
  } & Required<Pick<ActionContent, 'name' | 'getValue'>>;
};

interface BaseInput {
  name: string;
  description: string;
  validate?: (value: string) => void; // throw error if invalid
  options?: unknown;
  actionButtons?: Array<Required<Pick<ActionContent, 'name' | 'getValue'>>>; //action buttons e.g. Max, Half
  actionContent?: ActionContent; // key, value, hint
  isOptional?: boolean; // optional input
  isAllowDeposit?: boolean; // allow deposit
  symbol?: string;
  isDropdown?: boolean;
  isCrossChainZapInAllowed?: boolean;
}

interface RequiredInput extends BaseInput {
  isOptional?: false;
}

export interface OptionalInput extends BaseInput {
  isOptional: true;
  isDefaultVisible?: boolean;
  shortName?: string;
}

type ConfiguredInput = RequiredInput | OptionalInput;

export type TokenInput = {
  inputType: InputType.ERC20Amount | InputType.NativeAmount;
  isBorrowing?: boolean;
  options?: ERC20AmountInputOptions;
} & ConfiguredInput;

type OtherInput = {
  inputType: InputType.Address | InputType.Text;
  options?: ReceiverInputOptions;
} & ConfiguredInput;

export type Input = TokenInput | OtherInput;

export type Inputs = (string | undefined)[];

export type ZapInput = {
  dstAmount: string;
  srcToken: string;
  srcTokenAddress: Address;
  srcAmount: string;
};
export type StakeChainType = (typeof CHAINS)[number];

export type CustomPublicClientType = PublicClientType<
  Transport,
  StakeChainType
>;

export type Context = {
  account: UseAccountReturnType;
  chain: StakeChainType;
  inputs: Inputs;
  zapInputs: (ZapInput | undefined)[];
  /**
   * if the case is opened cross chain zap in,
   * srcChain is the chain where the user is currently executed the transaction
   */
  srcChain?: StakeChainType | undefined;
};

export type TxRenderer = (context: Context) => Promise<Tx[]>;

export type Meta = {
  highlights?: string[];
  tokenSymbols?: string[];
  [key: string]: any;
};

export type Tx = {
  name: string;
  description: string;
  to: Address;
  value: bigint;
  data?: Hex;
  abi: Abi | undefined; // for decoding arguments from data
  meta?: Meta; // for additional information
  gas?: bigint;
};

export type PreviewTx = {
  name: string;
  description: string;
  to: Address;
  meta?: Meta; // for additional information
};

export type Tag = {
  title: string;
  url?: string;
};

export type ActionsArgs = {
  userAddress: string;
  txHash: string;
};

export type ActionsReturn = {
  href: string;
  text: string;
}[];

export enum WalletType {
  AA = 'AA',
  EOA = 'EOA',
}

export interface IHTMLStructure {
  tag: string;
  value?: string;
  props?: HTMLProps<HTMLElement>;
  children?: IHTMLStructure[];
}

interface IBaseAttribute {
  id: string; // For identifying the block
  name: string; // Title of the attribute, which is displayed in the bottom of the block
  note?: string;
  isHighlighted?: boolean; // Whether the block is displayed with the border
}

export interface IStaticAttribute extends IBaseAttribute {
  value: string;
}

export interface IDynamicAttribute extends IBaseAttribute {
  getValue: () => Promise<string>;
}

export interface IListAttribute extends IBaseAttribute {
  items: Array<string>;
}

export interface IContentfulAttribute extends IBaseAttribute {}

export type IAttribute =
  | IStaticAttribute
  | IDynamicAttribute
  | IListAttribute
  | IContentfulAttribute;

export type BatchCase = BatchCaseInContentful & PartialBatchCase;

export type BatchCaseInContentful = {
  id: string;
  name: string;
  description: string;
  details?: any; // NOTE: marked as any for temporary solution
  website: Tag;
  tags?: Tag[];
  curatorTwitter?: {
    name?: string;
    url: string;
    avatarUrl?: string;
  };
  protocols?: string[];
  label?: Partial<Record<'hot' | 'deprecated', string>>;
  benefits?: string[];
};

export type PartialBatchCase = {
  id: string;
  attributes?: IAttribute[];

  networkId: number;
  atomic: boolean;
  renderExpiry?: number; // in seconds

  inputs?: Input[];
  optinalInputMenuNote?: string;
  render: TxRenderer;
  previewTx: PreviewTx[];
  gasSaved?: number;
  setActions?: (args: ActionsArgs) => ActionsReturn;
  supportedWalletTypes: WalletType[];
  getApyValue?: () => Promise<string>;
};

export enum Protocol {
  EtherFi = 'etherFi',
  ArbitrumBridge = 'arbitrumBridge',
  Swell = 'swell',
  Zircuit = 'zircuit',
  Ethena = 'ethena',
  Renzo = 'renzo',
  Penpad = 'penpad',
  SyncSwap = 'syncSwap',
  KyberNetwork = 'kyberNetwork',
  SpaceFI = 'spaceFI',
  Ambient = 'ambient',
  CogFinance = 'cogFinance',
  Yearn = 'yearn',
  Lido = 'lido',
  Genesis = 'genesis',
  EigenPie = 'eigenPie',
  Juice = 'juice',
  KelpDAO = 'kelpDAO',
  Pendle = 'pendle',
  Orbit = 'orbit',
  Aerodrom = 'aerodrom',
  Eigenlayer = 'eigenlayer',
  AAVE = 'aave',
  _1inch = '1inch',
  Gamma = 'gamma',
  Morpho = 'morpho',
  Zora = 'zora',
  AirPuff = 'airpuff',
  Tranchess = 'tranchess',
  Izumi = 'izumi',
  StakeStone = 'stakestone',
  BentoBatch = 'bentoBatch',
  Stargate = 'Stargate',
  Balancer = 'Balancer',
  Aura = 'Aura',
  Solv = 'Solv',
  MerlinSwap = 'MerlinSwap',
  MageFinance = 'MageFinance',
  AvalonFinance = 'AvalonFinance',
  Compound = 'Compound',
  GMX = 'GMX',
  RocketPool = 'Rocket Pool',
  Coinbase = 'Coinbase',
  StakeWise = 'StakeWise',
  Stader = 'Stader',
  FraxFinance = 'Frax Finance ',
  RedactedFinance = 'Redacted finance',
}
