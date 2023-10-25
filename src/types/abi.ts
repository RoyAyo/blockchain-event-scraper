export const _abi = [
    {
      inputs: [
        {
          internalType: "address",
          name: "_owner",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "required",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "balance",
          type: "uint256",
        },
      ],
      name: "InsufficientBalance",
      type: "error",
    },
    {
      inputs: [],
      name: "InvalidAmount",
      type: "error",
    },
    {
      inputs: [],
      name: "NativeAssetTransferFailed",
      type: "error",
    },
    {
      inputs: [],
      name: "NewOwnerMustNotBeSelf",
      type: "error",
    },
    {
      inputs: [],
      name: "NoNullOwner",
      type: "error",
    },
    {
      inputs: [],
      name: "NoPendingOwnershipTransfer",
      type: "error",
    },
    {
      inputs: [],
      name: "NoTransferToNullAddress",
      type: "error",
    },
    {
      inputs: [],
      name: "NotEnoughNativeForFees",
      type: "error",
    },
    {
      inputs: [],
      name: "NotPendingOwner",
      type: "error",
    },
    {
      inputs: [],
      name: "NullAddrIsNotAnERC20Token",
      type: "error",
    },
    {
      inputs: [],
      name: "TransferFailure",
      type: "error",
    },
    {
      inputs: [],
      name: "UnAuthorized",
      type: "error",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "_token",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "_integrator",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "_integratorFee",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "_lifiFee",
          type: "uint256",
        },
      ],
      name: "FeesCollected",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "_token",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "_to",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "_amount",
          type: "uint256",
        },
      ],
      name: "FeesWithdrawn",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "_token",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "_to",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "_amount",
          type: "uint256",
        },
      ],
      name: "LiFiFeesWithdrawn",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "_from",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "_to",
          type: "address",
        },
      ],
      name: "OwnershipTransferRequested",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "address[]",
          name: "tokenAddresses",
          type: "address[]",
        },
      ],
      name: "batchWithdrawIntegratorFees",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address[]",
          name: "tokenAddresses",
          type: "address[]",
        },
      ],
      name: "batchWithdrawLifiFees",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "cancelOwnershipTransfer",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "integratorFee",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "lifiFee",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "integratorAddress",
          type: "address",
        },
      ],
      name: "collectNativeFees",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "tokenAddress",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "integratorFee",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "lifiFee",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "integratorAddress",
          type: "address",
        },
      ],
      name: "collectTokenFees",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "confirmOwnershipTransfer",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "tokenAddress",
          type: "address",
        },
      ],
      name: "getLifiTokenBalance",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "integratorAddress",
          type: "address",
        },
        {
          internalType: "address",
          name: "tokenAddress",
          type: "address",
        },
      ],
      name: "getTokenBalance",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "pendingOwner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_newOwner",
          type: "address",
        },
      ],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "tokenAddress",
          type: "address",
        },
      ],
      name: "withdrawIntegratorFees",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "tokenAddress",
          type: "address",
        },
      ],
      name: "withdrawLifiFees",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
];