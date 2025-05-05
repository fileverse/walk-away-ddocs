import { toUint8Array, fromUint8Array } from 'js-base64'
import tweetnacl from 'tweetnacl'
import hkdf from 'futoin-hkdf'
import argon2 from 'argon2-browser/dist/argon2-bundled.min.js'

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
  archVersion,
  nonce,
  secretKey
) => {
  if (archVersion === ARCH_VERSION)
    return decryptTitleWithFileKey(encryptedTitle, fileKey)
  return getDecrytedString(encryptedTitle, nonce, secretKey)
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

export const encryptFile = async (file) => {
  await setPenumbraWorkerLocation()
  const penumbra = getPenumbra()
  const stream = await file.arrayBuffer()

  const [encrypted] = await penumbra.encrypt(null, {
    stream: new Response(new Uint8Array(stream)).body,
    size: file.size,
  })

  const decryptionInfo = await penumbra.getDecryptionInfo(encrypted)

  const fileBlob = await penumbra.getBlob(encrypted)
  const encryptedFile = new File([fileBlob], file.name)

  return {
    fileKey: {
      key: fromUint8Array(decryptionInfo.key),
      iv: fromUint8Array(decryptionInfo.iv),
      authTag: fromUint8Array(decryptionInfo.authTag),
    },
    encryptedFile,
  }
}

export const getNaclSecretKey = async (ddocId) => {
  const { secretKey } = tweetnacl.box.keyPair()
  const nonce = tweetnacl.randomBytes(tweetnacl.secretbox.nonceLength)

  const derivedKey = await deriveKeyFromAg2Hash(ddocId, nonce)

  const encryptedSecretKey = fromUint8Array(
    tweetnacl.secretbox(secretKey, nonce, derivedKey),
    true
  )

  return { nonce, encryptedSecretKey, secretKey }
}

export const decryptSecretKey = async (docId, nonce, encryptedSecretKey) => {
  const derivedKey = await deriveKeyFromAg2Hash(docId, toUint8Array(nonce))

  return tweetnacl.secretbox.open(
    toUint8Array(encryptedSecretKey),
    toUint8Array(nonce),
    derivedKey
  )
}

export const generateRandomNonce = (length = 24) => {
  return window.crypto.getRandomValues(new Uint8Array(length))
}

export const deriveKeyFromAg2Hash = async (pass, salt) => {
  const key = await argon2.hash({
    pass,
    salt,
    type: 2,
    hashLen: 32,
    time: 2,
    mem: 102400,
    parallelism: 8,
  })

  return hkdf(Buffer.from(key.hash), tweetnacl.secretbox.keyLength, {
    info: Buffer.from('encryptionKey'),
  })
}

export const getNonceAppendedCipherText = (nonce, cipherText) => {
  return (
    fromUint8Array(nonce, true) +
    KEY_SEPARATOR +
    fromUint8Array(cipherText, true)
  )
}

export const importRSAEncryptionKey = (pemContent) => {
  return importKey(pemContent, 'spki', 'RSA', ['encrypt'])
}

export const encryptUsingRSAKey = async (value, serverEncryptionKey) => {
  try {
    const encryptionKey = await importRSAEncryptionKey(serverEncryptionKey)

    const encoded = new TextEncoder().encode(JSON.stringify(value))

    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: 'RSA-OAEP',
      },
      encryptionKey,
      encoded
    )

    const res = fromUint8Array(new Uint8Array(encrypted))

    return res
  } catch (error) {
    console.log(error)
    throw new Error(error?.message)
  }
}
