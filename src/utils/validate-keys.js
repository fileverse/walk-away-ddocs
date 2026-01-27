import {
  NETWORK_NAME,
  PROD_DDOC_DOMAIN,
  PROD_DSHEETS_DOMAIN,
} from './constants'

export const keysInLegacySecretFile = [
  'portalAddress',
  'ownerPublicKey',
  'ownerPrivateKey',
  'portalPrivateKey',
  'portalPublicKey',
  'memberPrivateKey',
  'memberPublicKey',
  'source',
]

export const keysInNewSecretFile = [
  'portalAddress',
  'appEncryptionKey',
  'appDecryptionKey',
  'source',
]

export class InvalidRecoveryJsonError extends Error {
  constructor(message) {
    super(message)
    this.name = 'InvalidRecoveryJsonError'
  }
}
export class InvalidSourceError extends Error {
  constructor(message) {
    super(message)
    this.name = 'InvalidSourceError'
  }
}

export const validateLegacyKey = (keysObject) => {
  const isGnosis = NETWORK_NAME === 'gnosis'
  const isAllowedSource =
    keysObject.source === PROD_DDOC_DOMAIN ||
    keysObject.source === PROD_DSHEETS_DOMAIN

  if (isGnosis && !isAllowedSource) {
    throw new InvalidSourceError('Unsupported Source')
  }
  const keys = Object.keys(keysObject)
  keysInLegacySecretFile.forEach((key) => {
    if (!keys.includes(key) || !keysObject[key]) {
      throw new InvalidRecoveryJsonError('Recovery file is missing keys')
    }
  })
}

export const validateNewKey = (keysObject) => {
  const isGnosis = NETWORK_NAME === 'gnosis'
  const isAllowedSource =
    keysObject.source === PROD_DDOC_DOMAIN ||
    keysObject.source === PROD_DSHEETS_DOMAIN

  if (isGnosis && !isAllowedSource) {
    throw new InvalidSourceError('Unsupported Source')
  }
  const keys = Object.keys(keysObject)
  keysInNewSecretFile.forEach((key) => {
    if (!keys.includes(key) || !keysObject[key]) {
      throw new InvalidRecoveryJsonError('Recovery file is missing keys')
    }
  })
}

export const validateKey = (legacyKeysObject, newKeysArray) => {
  const oldKeys = Object.keys(legacyKeysObject)
  const newKeysCount = Array.isArray(newKeysArray) ? newKeysArray.length : 0

  if (newKeysCount === 0) {
    validateLegacyKey(legacyKeysObject)
  }
  if (oldKeys.length === 0) {
    // Validate all new keys in the array
    if (Array.isArray(newKeysArray)) {
      newKeysArray.forEach((newKey) => {
        validateNewKey(newKey)
      })
    } else {
      validateNewKey(newKeysArray)
    }
  }
  if (oldKeys.length > 0 && newKeysCount > 0) {
    validateLegacyKey(legacyKeysObject)
    // Validate all new keys in the array
    if (Array.isArray(newKeysArray)) {
      newKeysArray.forEach((newKey) => {
        validateNewKey(newKey)
      })
    } else {
      validateNewKey(newKeysArray)
    }
  }
}
