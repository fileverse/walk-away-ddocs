import { toUint8Array } from 'js-base64'
import tweetnacl from 'tweetnacl'
import { FAILED_IPFS_FETCH_ERROR, fetchFromIPFS, withRetry } from './ipfs-utils'

import * as penumbraLib from '@transcend-io/penumbra'

export const decryptFile = async (decryptionInfo, contentIpfsHash) => {
  const fetchedResponse = await withRetry(
    () => fetchFromIPFS(contentIpfsHash),
    2
  )

  if (!fetchedResponse || !fetchedResponse.body)
    throw new Error(FAILED_IPFS_FETCH_ERROR)

  return penumbraDecryptFile(decryptionInfo, fetchedResponse)
}

export const getPenumbra = () => window?.penumbra || penumbraLib

export const setPenumbraWorkerLocation = async () => {
  const penumbra = getPenumbra()

  if (penumbra) {
    //@ts-ignore
    if (window.penumbraInitialised) return
    await penumbra.setWorkerLocation('/worker.penumbra.js')
    //@ts-ignore
    window.penumbraInitialised = true
  }
}

export const penumbraDecryptFile = async (decryptionInfo, response) => {
  if (!response.body) throw new Error(FAILED_IPFS_FETCH_ERROR)
  const penumbraEncryptedFile = {
    id: 0,
    stream: response.body,
    size: Number(response.headers.get('Content-Length') || 0),
  }

  await setPenumbraWorkerLocation()

  const penumbra = getPenumbra()
  const decryptedFileContent = (
    await penumbra.decrypt(decryptionInfo, penumbraEncryptedFile)
  )[0]

  const contentBlob = await penumbra.getBlob(decryptedFileContent)
  const contentText = await contentBlob.text()

  return JSON.parse(contentText)
}

export const KEY_SEPARATOR = '__n__'

export const ARCH_VERSION = 'v3'

export const toAesKey = async (key) => {
  return await window.crypto.subtle.importKey(
    'raw',
    key,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  )
}

export const decryptTitleWithFileKey = async (encryptedTitle, fileKey) => {
  const key = await toAesKey(toUint8Array(fileKey.key))
  const iv = toUint8Array(fileKey.iv)

  const decryptedTitle = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv,
      tagLength: 128,
    },
    key,
    toUint8Array(encryptedTitle)
  )

  return new TextDecoder().decode(decryptedTitle)
}

export const getDecrytedString = (encryptedString, nonce, secretKey) => {
  const decryptedValue = tweetnacl.secretbox.open(
    toUint8Array(encryptedString),
    toUint8Array(nonce),
    secretKey
  )

  if (decryptedValue) return new TextDecoder().decode(decryptedValue)

  return decryptedValue
}
export const decryptTitle = async (
  encryptedTitle,
  fileKey,
  ownerPrivateKey,
  archVersion
) => {
  if (archVersion === ARCH_VERSION)
    return decryptTitleWithFileKey(encryptedTitle, fileKey)
  return encryptedTitle
}

export const decryptUsingRSAKey = async (cipherText, privateKey) => {
  const rsaPrivateKey = await toRSAPrivateKey(privateKey)
  return await window.crypto.subtle.decrypt(
    { name: 'RSA-OAEP' },
    rsaPrivateKey,
    toUint8Array(cipherText)
  )
}

export const toRSAPrivateKey = async (pemContent) => {
  return await importKey(pemContent, 'pkcs8', 'RSA', ['decrypt'])
}
export const convertStringToTypedArray = (data) => {
  const binaryString = window.atob(data)
  const uint8 = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    uint8[i] = binaryString.charCodeAt(i)
  }
  return uint8
}

export const keyAlgoritms = {
  AES: 'AES-GCM',
  RSA: {
    name: 'RSA-OAEP',
    hash: 'SHA-256',
  },
}

export const importKey = (pemContent, format, keyType, keyUsage) => {
  const uint8Content = convertStringToTypedArray(pemContent)
  return window.crypto.subtle.importKey(
    format,
    uint8Content.buffer,
    keyAlgoritms[keyType],
    false,
    keyUsage
  )
}
