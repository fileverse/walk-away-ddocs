import { NETWORK_NAME, PROD_DDOC_DOMAIN } from './constants'

export const keysInSecretFile = [
  'portalAddress',
  'ownerPublicKey',
  'ownerPrivateKey',
  'portalPublicKey',
  'portalPrivateKey',
  'memberPublicKey',
  'memberPrivateKey',
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

export const validateKey = (keysObject) => {
  if (
    !keysObject.source ||
    (keysObject.source !== PROD_DDOC_DOMAIN && NETWORK_NAME === 'gnosis')
  ) {
    throw new InvalidSourceError('Unsupported Source')
  }
  const keys = Object.keys(keysObject)
  keysInSecretFile.forEach((key) => {
    if (!keys.includes(key) || !keysObject[key]) {
      throw new InvalidRecoveryJsonError('Recovery file is missing keys')
    }
  })
}
