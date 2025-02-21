import { createPublicClient, fallback, http } from 'viem'
import { sepolia, gnosis } from 'viem/chains'
import { createSmartAccountClient } from 'permissionless'
import { ENTRYPOINT_ADDRESS_V07 } from 'permissionless'
import {
  createPimlicoBundlerClient,
  createPimlicoPaymasterClient,
} from 'permissionless/clients/pimlico'
import { signerToSafeSmartAccount } from 'permissionless/accounts'

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

export const bundlerClient = createPimlicoBundlerClient({
  transport: http(BUNDLER_URL),
  entryPoint: ENTRYPOINT_ADDRESS_V07,
  chain: CHAIN,
})

export const paymasterClient = createPimlicoPaymasterClient({
  transport: http(PAYMASTER_URL),
  entryPoint: ENTRYPOINT_ADDRESS_V07,
  chain: CHAIN,
})

export const createClient = async (smartAccount) => {
  const client = await createSmartAccountClient({
    account: smartAccount,
    entryPoint: ENTRYPOINT_ADDRESS_V07,
    chain: CHAIN,
    bundlerTransport: http(BUNDLER_URL),
    middleware: {
      sponsorUserOperation: paymasterClient.sponsorUserOperation,
      gasPrice: async () =>
        (await bundlerClient.getUserOperationGasPrice()).fast,
    },
  })

  return client
}

export const signerToSmartAccount = async (signer) =>
  await signerToSafeSmartAccount(publicClient, {
    signer,
    entryPoint: ENTRYPOINT_ADDRESS_V07,
    safeVersion: '1.4.1',
  })
