import { createPublicClient, fallback, http } from 'viem'
import { sepolia, gnosis } from 'viem/chains'

const VIEM_CHAIN_MAP = {
  sepolia: sepolia,
  gnosis: gnosis,
}

export const NETWORK_NAME = import.meta.env.VITE_NETWORK_NAME

export const RPC_URL = import.meta.env.VITE_NETWORK_RPC?.split(', ')

export const CHAIN = VIEM_CHAIN_MAP[NETWORK_NAME]

export const transport = fallback(RPC_URL.map((url) => http(url)))

export const publicClient = createPublicClient({
  transport,
  chain: CHAIN,
  batch: {
    multicall: true,
  },
})
export const PROD_DDOC_DOMAIN = 'docs.fileverse.io'
