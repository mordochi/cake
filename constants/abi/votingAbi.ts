const votingAbi = [
  {
    inputs: [{ internalType: 'address', name: '_veBento', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  { inputs: [], name: 'ArrayLengthMismatch', type: 'error' },
  { inputs: [], name: 'ArrayOutOfBounds', type: 'error' },
  { inputs: [], name: 'InvalidInitialization', type: 'error' },
  {
    inputs: [{ internalType: 'uint256', name: 'wTime', type: 'uint256' }],
    name: 'InvalidWTime',
    type: 'error',
  },
  { inputs: [], name: 'NotInitializing', type: 'error' },
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'OwnableInvalidOwner',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'batch', type: 'bytes32' }],
    name: 'VCBatchAlreadyActive',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'batch', type: 'bytes32' }],
    name: 'VCBatchAlreadyAddAndRemoved',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'totalWeight', type: 'uint256' },
      { internalType: 'uint256', name: 'maxWeight', type: 'uint256' },
    ],
    name: 'VCExceededMaxWeight',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'batch', type: 'bytes32' }],
    name: 'VCInactiveBatch',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    name: 'VCZeroVePendle',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'uint128', name: 'bias', type: 'uint128' },
      { internalType: 'uint128', name: 'slope', type: 'uint128' },
    ],
    name: 'VEZeroSlope',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'batch',
        type: 'bytes32',
      },
    ],
    name: 'AddBatch',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'batch',
        type: 'bytes32',
      },
      {
        components: [
          { internalType: 'uint128', name: 'bias', type: 'uint128' },
          { internalType: 'uint128', name: 'slope', type: 'uint128' },
        ],
        indexed: false,
        internalType: 'struct VeBalance',
        name: 'vote',
        type: 'tuple',
      },
    ],
    name: 'BatchVoteChange',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint64',
        name: 'version',
        type: 'uint64',
      },
    ],
    name: 'Initialized',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'batch',
        type: 'bytes32',
      },
    ],
    name: 'RemoveBatch',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'batch',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'uint64',
        name: 'weight',
        type: 'uint64',
      },
      {
        components: [
          { internalType: 'uint128', name: 'bias', type: 'uint128' },
          { internalType: 'uint128', name: 'slope', type: 'uint128' },
        ],
        indexed: false,
        internalType: 'struct VeBalance',
        name: 'vote',
        type: 'tuple',
      },
    ],
    name: 'Vote',
    type: 'event',
  },
  {
    inputs: [],
    name: 'GOVERNANCE_PENDLE_VOTE',
    outputs: [{ internalType: 'uint128', name: '', type: 'uint128' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MAX_LOCK_TIME',
    outputs: [{ internalType: 'uint128', name: '', type: 'uint128' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'WEEK',
    outputs: [{ internalType: 'uint128', name: '', type: 'uint128' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'batch', type: 'bytes32' }],
    name: 'addBatch',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'batch', type: 'bytes32' }],
    name: 'applyBatchSlopeChanges',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'deployedWTime',
    outputs: [{ internalType: 'uint128', name: '', type: 'uint128' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'finalizeEpoch',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getAllActiveBatches',
    outputs: [{ internalType: 'bytes32[]', name: '', type: 'bytes32[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'start', type: 'uint256' },
      { internalType: 'uint256', name: 'end', type: 'uint256' },
    ],
    name: 'getAllRemovedBatches',
    outputs: [
      {
        internalType: 'uint256',
        name: 'lengthOfRemovedBatches',
        type: 'uint256',
      },
      { internalType: 'bytes32[]', name: 'arr', type: 'bytes32[]' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'batch', type: 'bytes32' },
      { internalType: 'uint128[]', name: 'wTimes', type: 'uint128[]' },
    ],
    name: 'getBatchData',
    outputs: [
      {
        internalType: 'uint128',
        name: 'lastSlopeChangeAppliedAt',
        type: 'uint128',
      },
      {
        components: [
          { internalType: 'uint128', name: 'bias', type: 'uint128' },
          { internalType: 'uint128', name: 'slope', type: 'uint128' },
        ],
        internalType: 'struct VeBalance',
        name: 'totalVote',
        type: 'tuple',
      },
      { internalType: 'uint128[]', name: 'slopeChanges', type: 'uint128[]' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'batch', type: 'bytes32' },
      { internalType: 'uint128', name: 'wTime', type: 'uint128' },
    ],
    name: 'getBatchTotalVoteAt',
    outputs: [{ internalType: 'uint128', name: '', type: 'uint128' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32[]', name: 'batches', type: 'bytes32[]' },
      { internalType: 'uint128', name: 'timestamp', type: 'uint128' },
    ],
    name: 'getBatchesVeValueAt',
    outputs: [
      { internalType: 'uint128[]', name: 'veValues', type: 'uint128[]' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'user', type: 'address' },
      { internalType: 'bytes32', name: 'batch', type: 'bytes32' },
    ],
    name: 'getUserBatchVote',
    outputs: [
      {
        components: [
          { internalType: 'uint64', name: 'weight', type: 'uint64' },
          {
            components: [
              { internalType: 'uint128', name: 'bias', type: 'uint128' },
              { internalType: 'uint128', name: 'slope', type: 'uint128' },
            ],
            internalType: 'struct VeBalance',
            name: 'vote',
            type: 'tuple',
          },
        ],
        internalType: 'struct VotingControllerStorageUpg.UserBatchData',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'user', type: 'address' },
      { internalType: 'bytes32[]', name: 'batches', type: 'bytes32[]' },
    ],
    name: 'getUserData',
    outputs: [
      { internalType: 'uint64', name: 'totalVotedWeight', type: 'uint64' },
      {
        components: [
          { internalType: 'uint64', name: 'weight', type: 'uint64' },
          {
            components: [
              { internalType: 'uint128', name: 'bias', type: 'uint128' },
              { internalType: 'uint128', name: 'slope', type: 'uint128' },
            ],
            internalType: 'struct VeBalance',
            name: 'vote',
            type: 'tuple',
          },
        ],
        internalType: 'struct VotingControllerStorageUpg.UserBatchData[]',
        name: 'voteForBatches',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    name: 'getUserLatestVoteTime',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'user', type: 'address' },
      { internalType: 'uint128', name: 'wTime', type: 'uint128' },
    ],
    name: 'getUserVoteTime',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint128', name: 'wTime', type: 'uint128' },
      { internalType: 'bytes32[]', name: 'batches', type: 'bytes32[]' },
    ],
    name: 'getWeekData',
    outputs: [
      { internalType: 'bool', name: 'isEpochFinalized', type: 'bool' },
      { internalType: 'uint128', name: 'totalVotes', type: 'uint128' },
      { internalType: 'uint128[]', name: 'batchVotes', type: 'uint128[]' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'initialOwner', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'ownerHelper',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'batch', type: 'bytes32' }],
    name: 'removeBatch',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_helper', type: 'address' }],
    name: 'setOwnerHelper',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'vePendle',
    outputs: [
      { internalType: 'contract IPVeToken', name: '', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32[]', name: 'batches', type: 'bytes32[]' },
      { internalType: 'uint64[]', name: 'weights', type: 'uint64[]' },
    ],
    name: 'vote',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;
export default votingAbi;
