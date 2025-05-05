import { publicClient, PORTAL_ABI, pimlicoClient } from './constants'
import { generatePrivateKey } from 'viem/accounts'
import abi from '../abi.json'
import {
  encodeFunctionData,
  toHex,
  parseEventLogs,
  toBytes,
  hexToBigInt,
} from 'viem'

export const isNullish = (value) => value === null || value === undefined

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

export const getEncodedCallData = async ({ smartAccount, options }) => {
  return await smartAccount.encodeCallData({
    to: options.contractAddress,
    data: encodeFunctionData({
      abi,
      functionName: options.functionName,
      args: options.args,
    }),
    value: BigInt(0),
  })
}

export const editFileTransaction = async (smartAccountClient, args) => {
  console.log({ args })
  const callData = encodeFunctionData({
    abi: PORTAL_ABI,
    functionName: 'editFile',
    args: [
      args.fileId,
      args.metadataIpfsHash,
      args.contentIpfsHash,
      args.gateIpfsHash || '',
      args.fileType,
      args.version || 0,
    ],
  })
  const calls = await smartAccountClient.account.encodeCalls([
    { data: callData, to: args.contractAddress, value: BigInt(0) },
  ])

  const getNonce = () =>
    hexToBigInt(
      toHex(toBytes(generatePrivateKey()).slice(0, 24), {
        size: 32,
      })
    )

  // @ts-ignore
  const txHash = await smartAccountClient.sendUserOperation({
    callData: calls,
    callGasLimit: BigInt(5000000),
    nonce: getNonce(),
  })

  const waitForUserOpReceipt = async (hash, timeout = 60000) => {
    const receipt = await pimlicoClient.waitForUserOperationReceipt({
      hash,
      timeout,
    })

    if (!receipt.success)
      throw new Error(`Failed to execute user operation: ${receipt.reason}`)
    return receipt
  }

  const resolveReceiptAndParseLog = async (hash, eventName) => {
    const receipt = await waitForUserOpReceipt(hash)

    const parsedLog = parseEventLogs({
      abi: PORTAL_ABI,
      eventName,
      logs: receipt.logs,
    })

    return parsedLog
  }

  const parsedLog = await resolveReceiptAndParseLog(txHash, 'EditedFile')
  if (parsedLog.length === 0) throw new Error('No File Edit Event Found!')
  // @ts-ignore
  const onChainFileId = Number(parsedLog[0]?.args?.fileId)
  if (isNullish(onChainFileId)) throw new Error('No File Id Found!')
  return onChainFileId
}
