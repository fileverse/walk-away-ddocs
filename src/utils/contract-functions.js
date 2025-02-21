import { publicClient, bundlerClient, RECEIPT_WAIT_TIMEOUT } from './constants'
import { generatePrivateKey } from 'viem/accounts'
import abi from '../abi.json'
import { encodeFunctionData, toHex, parseEventLogs, toBytes } from 'viem'

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
  const callData = await getEncodedCallData({
    smartAccount: smartAccountClient.account,
    options: {
      contractAddress: args.contractAddress,
      contractType: 'Portal',
      functionName: 'editFile',
      args: [
        args.fileId,
        args.metadataIpfsHash,
        args.contentIpfsHash,
        args.gateIpfsHash || '',
        args.fileType,
        args.version || 0,
      ],
    },
  })

  const userOperation = await smartAccountClient.prepareUserOperationRequest({
    userOperation: {
      callData,
      // @ts-ignore
      nonce: toHex(toBytes(generatePrivateKey()).slice(0, 24), {
        size: 32,
      }),
    },
    account: smartAccountClient.account,
  })
  // @ts-ignore
  const txHash = await smartAccountClient.sendUserOperation({ userOperation })

  const { logs } = await bundlerClient.waitForUserOperationReceipt({
    hash: txHash,
    timeout: RECEIPT_WAIT_TIMEOUT,
  })

  const parsedLog = parseEventLogs({
    abi,
    eventName: 'editFile',
    logs,
  })
  if (parsedLog.length === 0) throw new Error('No File Edit Event Found!')
  // @ts-ignore
  const onChainFileId = Number(parsedLog[0]?.args?.fileId)
  if (isNullish(onChainFileId)) throw new Error('No File Id Found!')
  return onChainFileId
}
