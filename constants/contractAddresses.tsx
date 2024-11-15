import { Hex } from 'viem';

const BENTO_ADDRESS_MAPPING: Record<string, Hex> = {
  development: '0xBBF12d3fc51D5AC51BCA052D3d46EA58562853a5',
  release: '0xBBF12d3fc51D5AC51BCA052D3d46EA58562853a5',
  // @todo: add mainnet address
  production: '0xBBF12d3fc51D5AC51BCA052D3d46EA58562853a5',
};

export const BENTO_ADDRESS =
  BENTO_ADDRESS_MAPPING[process.env.NEXT_PUBLIC_APP_ENV || 'development'];

const VESTING_ADDRESS_MAP: Record<string, Hex> = {
  development: '0xa86CCa2a94e1253759DebB66513bE66532057798',
  release: '0xa86CCa2a94e1253759DebB66513bE66532057798',
  // @todo: add mainnet address
  production: '0xa86CCa2a94e1253759DebB66513bE66532057798',
};

export const VESTING_ADDRESS =
  VESTING_ADDRESS_MAP[process.env.NEXT_PUBLIC_APP_ENV || 'development'];

const STAKING_ADDRESS_MAPPING: Record<string, Hex> = {
  development: '0x5640669951615988A904258165f61D14319De8c5',
  release: '0x5640669951615988A904258165f61D14319De8c5',
  // @todo: add mainnet address
  production: '0x5640669951615988A904258165f61D14319De8c5',
};

export const STAKING_ADDRESS =
  STAKING_ADDRESS_MAPPING[process.env.NEXT_PUBLIC_APP_ENV || 'development'];

// $BENTO voting contract
const VOTING_ADDRESS_MAP: Record<string, Hex> = {
  development: '0xB766a5Cf150c4B20B625e7793E2A9BB942b1Fd42',
  release: '0xB766a5Cf150c4B20B625e7793E2A9BB942b1Fd42',
  production: '0x0', // @todo: need add mainnet address
};

export const VOTING_ADDRESS =
  VOTING_ADDRESS_MAP[process.env.NEXT_PUBLIC_APP_ENV || 'development'];
