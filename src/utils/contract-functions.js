import { publicClient } from './constants'

import abi from '../abi.json'

export const getPortalFileCount = async (contractAddress) => {
  const count = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: 'getFileCount',
  })

  return Number(count)
}

export const getContractFile = async (fileId, contractAddress) => {
  const [metadataHash, contentHash] = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: 'files',
    args: [fileId],
  })

  return { metadataHash, contentHash }
}

export const getPortalKeysVerifiers = async (contractAddress) => {
  return await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: 'keyVerifiers',
    args: [0],
  })
}
