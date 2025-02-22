import tweetnacl from 'tweetnacl'
import {
  getNonceAppendedCipherText,
  generateRandomNonce,
} from '../utils/crypto'
import { uploadFileRequest } from '../utils/services'
import { toUint8Array } from 'js-base64'
export const jsonToBytes = (json) =>
  new TextEncoder().encode(JSON.stringify(json))

import { encryptUsingRSAKey } from '../utils/crypto'

import { fromUint8Array } from 'js-base64'

export const createFileLock = async (encryptionKey, dataKeyMaterial) => {
  const lockedFileKey = await encryptUsingRSAKey(
    dataKeyMaterial.fileKey,
    encryptionKey
  )

  const lockedChatKey = await encryptUsingRSAKey(
    dataKeyMaterial.fileChatKeyPair,
    encryptionKey
  )

  return {
    lockedChatKey,
    lockedFileKey,
  }
}

export const createLinkLock = async (encryptionKey, dataKeyMaterial) => {
  const fileKeyNonce = generateRandomNonce()
  const encryptedFileKey = tweetnacl.secretbox(
    jsonToBytes(dataKeyMaterial.fileKey),
    fileKeyNonce,
    encryptionKey
  )

  const lockedFileKey = getNonceAppendedCipherText(
    fileKeyNonce,
    encryptedFileKey
  )
  const chatKeyNonce = generateRandomNonce()
  const encryptedChatKey = tweetnacl.secretbox(
    jsonToBytes(dataKeyMaterial.fileChatKeyPair),
    chatKeyNonce,
    encryptionKey
  )
  const lockedChatKey = getNonceAppendedCipherText(
    chatKeyNonce,
    encryptedChatKey
  )
  return {
    lockedFileKey,
    lockedChatKey: lockedChatKey,
  }
}

export const generateFileMetadata = async (
  file,
  fileKey,
  portalSecretKeys,
  commentKey,
  secretKey,
  nonce,
  invokerAddress,
  version,
  title,
  ddocId,
  shouldEncryptTitle
) => {
  const dataKeyMaterial = {
    fileKey,
    fileChatKeyPair: commentKey,
  }

  const portalLock = portalSecretKeys.portalLock

  const ownerLock = portalSecretKeys.ownerLock
  const linkLock = await createLinkLock(secretKey, dataKeyMaterial)
  const titleBytes = new TextEncoder().encode(title)

  return {
    title: shouldEncryptTitle
      ? fromUint8Array(
          tweetnacl.secretbox(titleBytes, toUint8Array(nonce), secretKey),
          true
        )
      : title,
    size: file.size,
    mimeType: 'application/json',
    portalLock,
    ownerLock,
    linkLock,
    ddocId: ddocId,
    nonce,
    owner: invokerAddress,
    version,
    override: true,
  }
}

export const uploadContentAndMetadataFile = async (contentPayload) => {
  const {
    contractAddress,
    invoker,
    contentFile,
    metadataFile,
    editSecret,
    apiKey,
  } = contentPayload

  const contentUploadRequest = {
    editSecret,
    file: contentFile,
    name: contentFile.name,
    contractAddress,
    invoker,
    apiKey,
  }
  const metadataUploadRequest = {
    editSecret,
    file: metadataFile,
    name: metadataFile.name,
    contractAddress,
    invoker,
    apiKey,
  }

  const [contentResponse, metadataResponse] = await Promise.all([
    uploadFileRequest(contentUploadRequest),
    uploadFileRequest(metadataUploadRequest),
  ])

  const contentIpfsHash = contentResponse?.ipfsHash
  const metadataIpfsHash = metadataResponse?.ipfsHash

  return {
    contentIpfsHash,
    metadataIpfsHash,
  }
}

export const KEY_SEPARATOR = '__n__'

export const getNonceAndCipherText = (
  nonceAppendedCipherText,
  defaultNonce
) => {
  if (nonceAppendedCipherText.includes(KEY_SEPARATOR)) {
    const [nonce, cipherText] = nonceAppendedCipherText.split(KEY_SEPARATOR)
    return { nonce, cipherText }
  }
  return { nonce: defaultNonce, cipherText: nonceAppendedCipherText }
}
