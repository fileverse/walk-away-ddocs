import { createPublicClient, fallback, http } from 'viem'
import { sepolia, gnosis } from 'viem/chains'
import { createSmartAccountClient } from 'permissionless'
import { createPimlicoClient } from 'permissionless/clients/pimlico'
import { toSafeSmartAccount } from 'permissionless/accounts'
import { entryPoint07Address } from 'viem/account-abstraction'

const VIEM_CHAIN_MAP = {
  sepolia: sepolia,
  gnosis: gnosis,
}

// user operation recipt takes long time to resolve hence the long timeout
export const RECEIPT_WAIT_TIMEOUT = 30000 // 30 seconds

export const NETWORK_NAME = import.meta.env.VITE_NETWORK_NAME

export const RPC_URL = import.meta.env.VITE_NETWORK_RPC?.split(', ')
export const UPLOAD_API_URL =
  import.meta.env.VITE_PUBLIC_STORAGE_BACKEND + '/upload/public'

export const CHAIN = VIEM_CHAIN_MAP[NETWORK_NAME]
const PIMLICO_API_KEY = import.meta.env.VITE_PUBLIC_PIMLICO_API_KEY
export const PAYMASTER_URL = `https://api.pimlico.io/v2/${NETWORK_NAME}/rpc?apikey=${PIMLICO_API_KEY}`
export const BUNDLER_URL = `https://api.pimlico.io/v2/${NETWORK_NAME}/rpc?apikey=${PIMLICO_API_KEY}`

export const transport = fallback(RPC_URL.map((url) => http(url)))

export const publicClient = createPublicClient({
  transport,
  chain: CHAIN,
  batch: {
    multicall: true,
  },
})
export const PROD_DDOC_DOMAIN = 'docs.fileverse.io'

export const signerToSmartAccount = async (signer) =>
  await toSafeSmartAccount({
    client: publicClient,
    owners: [signer],
    entryPoint: {
      address: entryPoint07Address,
      version: '0.7',
    },
    version: '1.4.1',
  })

export const pimlicoClient = createPimlicoClient({
  transport: http(PAYMASTER_URL),
  entryPoint: {
    address: entryPoint07Address,
    version: '0.7',
  },
})

export const getSmartAccountClient = async (signer) => {
  const smartAccount = await signerToSmartAccount(signer)

  return createSmartAccountClient({
    account: smartAccount,

    chain: CHAIN,
    paymaster: pimlicoClient,
    bundlerTransport: http(BUNDLER_URL),
    userOperation: {
      estimateFeesPerGas: async () =>
        (await pimlicoClient.getUserOperationGasPrice()).fast,
    },
  })
}

export const PORTAL_ABI = [
  {
    inputs: [
      {
        internalType: 'string',
        name: '_metadataIPFSHash',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_ownerViewDid',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_ownerEditDid',
        type: 'string',
      },
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_trustedForwarder',
        type: 'address',
      },
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'portalEncryptionKeyVerifier',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'portalDecryptionKeyVerifier',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'memberEncryptionKeyVerifier',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'memberDecryptionKeyVerifier',
            type: 'bytes32',
          },
        ],
        internalType: 'struct PortalKeyVerifiers.KeyVerifier',
        name: '_keyVerifier',
        type: 'tuple',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'by',
        type: 'address',
      },
    ],
    name: 'AddedCollaborator',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'fileId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'metadataIPFSHash',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'contentIPFSHash',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'gateIPFSHash',
        type: 'string',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'by',
        type: 'address',
      },
    ],
    name: 'AddedFile',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'fileId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'metadataIPFSHash',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'contentIPFSHash',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'gateIPFSHash',
        type: 'string',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'by',
        type: 'address',
      },
    ],
    name: 'EditedFile',
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
    name: 'OwnershipTransferStarted',
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
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'RegisteredCollaboratorKeys',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'by',
        type: 'address',
      },
    ],
    name: 'RemovedCollaborator',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'RemovedCollaboratorKeys',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'portalEncryptionKeyVerifier',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'portalDecryptionKeyVerifier',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'memberEncryptionKeyVerifier',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'memberDecryptionKeyVerifier',
        type: 'bytes32',
      },
    ],
    name: 'UpdatedKeyVerifiers',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: 'metadataIPFSHash',
        type: 'string',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'by',
        type: 'address',
      },
    ],
    name: 'UpdatedPortalMetadata',
    type: 'event',
  },
  {
    inputs: [],
    name: 'acceptOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'collaborator',
        type: 'address',
      },
    ],
    name: 'addCollaborator',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_metadataIPFSHash',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_contentIPFSHash',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_gateIPFSHash',
        type: 'string',
      },
      {
        internalType: 'enum FileversePortal.FileType',
        name: 'filetype',
        type: 'uint8',
      },
      {
        internalType: 'uint256',
        name: 'version',
        type: 'uint256',
      },
    ],
    name: 'addFile',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'collaboratorKeys',
    outputs: [
      {
        internalType: 'string',
        name: 'viewDid',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'editDid',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'fileId',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: '_metadataIPFSHash',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_contentIPFSHash',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_gateIPFSHash',
        type: 'string',
      },
      {
        internalType: 'enum FileversePortal.FileType',
        name: 'filetype',
        type: 'uint8',
      },
      {
        internalType: 'uint256',
        name: 'version',
        type: 'uint256',
      },
    ],
    name: 'editFile',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'files',
    outputs: [
      {
        internalType: 'string',
        name: 'metadataIPFSHash',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'contentIPFSHash',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'gateIPFSHash',
        type: 'string',
      },
      {
        internalType: 'enum FileversePortal.FileType',
        name: 'fileType',
        type: 'uint8',
      },
      {
        internalType: 'uint256',
        name: 'version',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getCollaboratorCount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getCollaboratorKeysCount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getCollaborators',
    outputs: [
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getFileCount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'isCollaborator',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'forwarder',
        type: 'address',
      },
    ],
    name: 'isTrustedForwarder',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'keyVerifiers',
    outputs: [
      {
        internalType: 'bytes32',
        name: 'portalEncryptionKeyVerifier',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 'portalDecryptionKeyVerifier',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 'memberEncryptionKeyVerifier',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 'memberDecryptionKeyVerifier',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'metadataIPFSHash',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'pendingOwner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'viewDid',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'editDid',
        type: 'string',
      },
    ],
    name: 'registerCollaboratorKeys',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'prevCollaborator',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'collaborator',
        type: 'address',
      },
    ],
    name: 'removeCollaborator',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'removeCollaboratorKeys',
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
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'portalEncryptionKeyVerifier',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 'portalDecryptionKeyVerifier',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 'memberEncryptionKeyVerifier',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 'memberDecryptionKeyVerifier',
        type: 'bytes32',
      },
    ],
    name: 'updateKeyVerifiers',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_metadataIPFSHash',
        type: 'string',
      },
    ],
    name: 'updateMetadata',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

export const IDENTITY_MODULE_ABI = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'InvalidInitialization',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NotInitializing',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'OwnableInvalidOwner',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'OwnableUnauthorizedAccount',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'identityAddress',
        type: 'address',
      },
    ],
    name: 'AddIdentity',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'identity',
        type: 'address',
      },
    ],
    name: 'AddIdentityGuardians',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'payment',
        type: 'uint256',
      },
    ],
    name: 'ExecutionFailure',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'payment',
        type: 'uint256',
      },
    ],
    name: 'ExecutionSuccess',
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
        indexed: false,
        internalType: 'address',
        name: 'identity',
        type: 'address',
      },
    ],
    name: 'RemoveIdentityGuardian',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'identityAddress',
        type: 'address',
      },
    ],
    name: 'RemoveKeyStoreContract',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'identityAddress',
        type: 'address',
      },
    ],
    name: 'UpdateIdentity',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'identityAddress',
        type: 'address',
      },
    ],
    name: 'UpdateIdentityAccountKey',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'agent',
        type: 'address',
      },
    ],
    name: 'UpdateIdentityAgent',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'identityAddress',
        type: 'address',
      },
    ],
    name: 'UpdateIdentitySaltSigningDid',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'identityAddress',
        type: 'address',
      },
    ],
    name: 'UpdateKeyStoreContract',
    type: 'event',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'bytes',
            name: 'encryptedShard',
            type: 'bytes',
          },
          {
            internalType: 'address',
            name: 'account',
            type: 'address',
          },
          {
            internalType: 'enum IIdentityModule.GuardianType',
            name: 'guardianType',
            type: 'uint8',
          },
        ],
        internalType: 'struct IIdentityModule.Guardian[]',
        name: 'orgGuardians',
        type: 'tuple[]',
      },
    ],
    name: 'addIdentityGuardians',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
      {
        internalType: 'uint256',
        name: 'safeTxGas',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'baseGas',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'gasPrice',
        type: 'uint256',
      },
      {
        internalType: 'address payable',
        name: 'refundReceiver',
        type: 'address',
      },
    ],
    name: 'execTransaction',
    outputs: [
      {
        internalType: 'bool',
        name: 'success',
        type: 'bool',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getIdentityModuleDetail',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'salt',
            type: 'uint256',
          },
          {
            internalType: 'string',
            name: 'signingDid',
            type: 'string',
          },
          {
            internalType: 'bytes',
            name: 'accountPublicKey',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'accountPrivateKey',
            type: 'bytes',
          },
          {
            internalType: 'address',
            name: 'agentAddress',
            type: 'address',
          },
          {
            components: [
              {
                internalType: 'bytes',
                name: 'encryptedShard',
                type: 'bytes',
              },
              {
                internalType: 'address',
                name: 'account',
                type: 'address',
              },
              {
                internalType: 'enum IIdentityModule.GuardianType',
                name: 'guardianType',
                type: 'uint8',
              },
            ],
            internalType: 'struct IIdentityModule.Guardian[]',
            name: 'guardians',
            type: 'tuple[]',
          },
        ],
        internalType: 'struct IIdentityModule.IdentityOutput',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'contractAddress',
        type: 'address[]',
      },
    ],
    name: 'getIdentityModuleKeyStoreDetails',
    outputs: [
      {
        internalType: 'bytes[]',
        name: '',
        type: 'bytes[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getIdentityModulePublicDetails',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'salt',
            type: 'uint256',
          },
          {
            internalType: 'string',
            name: 'signingDid',
            type: 'string',
          },
          {
            internalType: 'bytes',
            name: 'accountPublicKey',
            type: 'bytes',
          },
          {
            internalType: 'address',
            name: 'agentAddress',
            type: 'address',
          },
        ],
        internalType: 'struct IIdentityModule.IdentityPublicDetails',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getKeyStoreAddresses',
    outputs: [
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'forwarderAddress',
        type: 'address',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'salt',
            type: 'uint256',
          },
          {
            internalType: 'string',
            name: 'signingDid',
            type: 'string',
          },
          {
            internalType: 'bytes',
            name: 'accountPublicKey',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'accountPrivateKey',
            type: 'bytes',
          },
          {
            internalType: 'address',
            name: 'agentAddress',
            type: 'address',
          },
        ],
        internalType: 'struct IIdentityModule.IdentityInput',
        name: 'identity',
        type: 'tuple',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'forwarder',
        type: 'address',
      },
    ],
    name: 'isTrustedForwarder',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'keyStoreCount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'guardianEncryptedShard',
        type: 'bytes',
      },
    ],
    name: 'removeIdentityGuardian',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'contractAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'prevContractAddresss',
        type: 'address',
      },
    ],
    name: 'removeKeyStoreContract',
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
    inputs: [
      {
        internalType: 'address',
        name: 'forwarderAddress',
        type: 'address',
      },
    ],
    name: 'setForwarderAddress',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'trustedForwarder',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'salt',
            type: 'uint256',
          },
          {
            internalType: 'string',
            name: 'signingDid',
            type: 'string',
          },
          {
            internalType: 'bytes',
            name: 'accountPublicKey',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'accountPrivateKey',
            type: 'bytes',
          },
          {
            internalType: 'address',
            name: 'agentAddress',
            type: 'address',
          },
        ],
        internalType: 'struct IIdentityModule.IdentityInput',
        name: 'identity',
        type: 'tuple',
      },
    ],
    name: 'updateIdentity',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'accountPublicKey',
        type: 'bytes',
      },
      {
        internalType: 'bytes',
        name: 'accountPrivateKey',
        type: 'bytes',
      },
    ],
    name: 'updateIdentityAccountKey',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'agentAddress',
        type: 'address',
      },
    ],
    name: 'updateIdentityAgent',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'salt',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'signingDid',
        type: 'string',
      },
    ],
    name: 'updateIdentitySaltSigningDid',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'ipfsHash',
        type: 'bytes',
      },
      {
        internalType: 'address',
        name: 'contractAddress',
        type: 'address',
      },
    ],
    name: 'updateKeyStoreContract',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

export const getIdDetails = async (identityModuleAddress, walletAddress) => {
  const response = await publicClient.readContract({
    address: identityModuleAddress,
    abi: IDENTITY_MODULE_ABI,
    functionName: 'getIdentityModuleDetail',
    account: walletAddress,
  })

  const { salt } = response

  return salt
}
