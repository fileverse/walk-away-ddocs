import { bytesToHex, sha256 } from 'viem'
import { toUint8Array } from 'js-base64'

export const generateSHA256Hash = async (string) => {
  const utf8 = new TextEncoder().encode(string)
  const hashBuffer = await crypto.subtle.digest('SHA-256', utf8)
  const hashArray = new Uint8Array(hashBuffer)
  const hashInHex = bytesToHex(hashArray)
  return hashInHex
}

export const isKeysVerified = async (keyVerifiers, keys) => {
  const [portalEncHash, portalDecHash, memberEncHash, memberDecHash] =
    await Promise.all([
      generateSHA256Hash(keys.portalPublicKey),
      generateSHA256Hash(keys.portalPrivateKey),
      generateSHA256Hash(keys.memberPublicKey),
      generateSHA256Hash(keys.memberPrivateKey),
    ])
  const computedHashes = [
    portalEncHash,
    portalDecHash,
    memberEncHash,
    memberDecHash,
  ]
  return computedHashes.every((hash, index) => hash === keyVerifiers[index])
}

export const isNewKeysVerified = async (
  appEncryptionKey,
  appDecryptionKey,
  keyVerifiers
) => {
  const [appEncryptionKeySha256, appDecryptionKeySha256] = await Promise.all([
    sha256(toUint8Array(appEncryptionKey)),
    sha256(toUint8Array(appDecryptionKey)),
  ])
  const computedHashes = [appEncryptionKeySha256, appDecryptionKeySha256]
  return computedHashes.every((hash, index) => hash === keyVerifiers[index])
}
