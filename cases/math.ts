export enum Rounding {
  Floor, // Toward negative infinity
  Ceil, // Toward positive infinity
  Trunc, // Toward zero
  Expand, // Away from zero
}

export const UINT256_SIZE = BigInt(2) ** BigInt(256)
export const UINT256_MIN = BigInt(0)
export const UINT256_MAX = UINT256_SIZE - BigInt(1)

export const INT256_SIZE = BigInt(2) ** BigInt(255)
export const INT256_MIN = -INT256_SIZE
export const INT256_MAX = INT256_SIZE - BigInt(1)

export const add = (a: bigint, b: bigint): bigint => uint256(a + b)
export const mul = (a: bigint, b: bigint): bigint => uint256(a * b)
export const sub = (a: bigint, b: bigint): bigint => uint256(a - b)
export const div = (a: bigint, b: bigint): bigint => {
  if (b === 0n) {
    return b
  }
  return uint256(a / b)
}
export const sdiv = (a: bigint, b: bigint): bigint => {
  if (b === 0n) {
    return b
  }
  return int256(a) / int256(b)
}
export const mod = (a: bigint, b: bigint): bigint => {
  if (b === 0n) {
    return 0n
  }
  return a % b
}
export const smod = (a: bigint, b: bigint): bigint => {
  if (b === 0n) {
    return 0n
  }
  return uint256(int256(a) % int256(b))
}
export const addmod = (a: bigint, b: bigint, N: bigint): bigint => mod(a + b, N)
export const mulmod = (a: bigint, b: bigint, N: bigint): bigint => mod(a * b, N)
export const exp = (a: bigint, exp: bigint): bigint => uint256(a ** exp)

export const assert = (condition: boolean, errorMessage: string) => {
  if (!condition) {
    throw new Error(errorMessage)
  }
}

export const mulDiv = (x: bigint, y: bigint, denominator: bigint): bigint => {
  assert(denominator > 0, `denominator should be greater than zero.`)

  let mm = mulmod(x, y, not(0n))
  let prod0 = mul(x, y)
  let prod1 = sub(sub(mm, prod0), lt(mm, prod0))

  if (prod1 == 0n) {
    return div(prod0, denominator)
  }

  assert(prod1 < denominator, `denominator should be greater than prod1`)

  let remainder = mulmod(x, y, denominator)

  prod1 = sub(prod1, gt(remainder, prod0))
  prod0 = sub(prod0, remainder)

  let twos = -denominator & denominator
  denominator = div(denominator, twos)

  prod0 = div(prod0, twos)
  twos = add(div(sub(0n, twos), twos), 1n)

  prod0 |= prod1 * twos

  let inv = (3n * denominator) ^ 2n

  inv *= 2n - denominator * inv
  inv *= 2n - denominator * inv
  inv *= 2n - denominator * inv
  inv *= 2n - denominator * inv
  inv *= 2n - denominator * inv
  inv *= 2n - denominator * inv

  let result = prod0 * inv
  return result
}

export const mulDivDown = (x: bigint, y: bigint, d: bigint): bigint => {
  return div(mul(x, y), d)
}

export const mulDivUp = (x: bigint, y: bigint, d: bigint): bigint => {
  return div(add(mul(x, y), sub(d, 1n)), d)
}

export const mulDivWithRounding = (
  x: bigint,
  y: bigint,
  denominator: bigint,
  rounding: Rounding
): bigint => {
  let result = mulDiv(x, y, denominator)
  if (unsignedRoundsUp(rounding) && (x * y) % denominator > BigInt(0)) {
    result += BigInt(1)
  }
  return result
}

export const unsignedRoundsUp = (rounding: Rounding): boolean => {
  return rounding % 2 === 1
}

// export const signextend = (byteCount: bigint, x: bigint): bigint => x
export const lt = (a: bigint, b: bigint): bigint => (a < b ? 1n : 0n)
export const gt = (a: bigint, b: bigint): bigint => (a > b ? 1n : 0n)
export const slt = (a: bigint, b: bigint): bigint =>
  int256(a) < int256(b) ? 1n : 0n
export const sgt = (a: bigint, b: bigint): bigint =>
  int256(a) > int256(b) ? 1n : 0n
export const eq = (a: bigint, b: bigint): bigint => (a === b ? 1n : 0n)
export const iszero = (a: bigint): bigint => (a === 0n ? 1n : 0n)
export const and = (a: bigint, b: bigint): bigint => a & b

// Additional functions converted to const
export const or = (a: bigint, b: bigint): bigint => a | b
export const xor = (a: bigint, b: bigint): bigint => a ^ b
export const not = (a: bigint): bigint => uint256(~a)
export const byte = (i: number, a: bigint): bigint => {
  const LENGTH: number = 32
  const shifted = shr(8 * (LENGTH - i - 1), a)
  return shifted & 0xffn
}
export const shl = (bits: number, a: bigint): bigint => {
  if (bits > 255) {
    return 0n
  }
  return uint256(a << BigInt(bits))
}
export const shr = (bits: number, a: bigint): bigint =>
  uint256(a >> BigInt(bits))
export const sar = (bits: number, a: bigint): bigint =>
  uint256(int256(a) >> BigInt(bits))

export const unchecked = (
  a: bigint,
  size: bigint,
  min: bigint,
  max: bigint
): bigint => {
  a = a % size
  a = a > max ? a - size : a
  a = a < min ? a + size : a
  return a
}

export const uint256 = (x: bigint): bigint => {
  return unchecked(x, UINT256_SIZE, UINT256_MIN, UINT256_MAX)
}

export const int256 = (x: bigint): bigint => {
  return unchecked(x, UINT256_SIZE, INT256_MIN, INT256_MAX)
}

/// @dev The number of virtual shares has been chosen low enough to prevent overflows, and high enough to ensure
/// high precision computations.
/// @dev Virtual shares can never be redeemed for the assets they are entitled to, but it is assumed the share price
/// stays low enough not to inflate these assets to a significant value.
/// @dev Warning: The assets to which virtual borrow shares are entitled behave like unrealizable bad debt.
export const VIRTUAL_SHARES = 1_000_000n // 1e6

/// @dev A number of virtual assets of 1 enforces a conversion rate between shares and assets when a market is
/// empty.
export const VIRTUAL_ASSETS = 1n

/// @dev Calculates the value of `assets` quoted in shares, rounding down.
export const toSharesDown = (
  assets: bigint,
  totalAssets: bigint,
  totalShares: bigint
): bigint => {
  return mulDivDown(
    assets,
    totalShares + VIRTUAL_SHARES,
    totalAssets + VIRTUAL_ASSETS
  )
}

/// @dev Calculates the value of `shares` quoted in assets, rounding up.
export const toAssetsUp = (
  shares: bigint,
  totalAssets: bigint,
  totalShares: bigint
): bigint => {
  return mulDivUp(
    shares,
    totalAssets + VIRTUAL_ASSETS,
    totalShares + VIRTUAL_SHARES
  )
}
