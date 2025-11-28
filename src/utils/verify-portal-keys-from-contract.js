import { isKeysVerified, isNewKeysVerified } from './is-keys-verified'
import {
  getPortalKeysVerifiers,
  getNewPortalKeysVerifiers,
} from './contract-functions'

export const EMPTY_HASH =
  '0x0000000000000000000000000000000000000000000000000000000000000000'

export const verifyPortalKeysFromContract = async ({
  keys,
  contractAddress,
}) => {
  const keyVerifiers = await getPortalKeysVerifiers(contractAddress)

  if (keyVerifiers.some((verifier) => verifier === EMPTY_HASH)) {
    return null
  }
  return isKeysVerified(keyVerifiers, keys)
}

export const verifyNewPortalKeysFromContract = async ({
  appEncryptionKey,
  appDecryptionKey,
  contractAddress,
}) => {
  const keyVerifiers = await getNewPortalKeysVerifiers(contractAddress)
  return isNewKeysVerified(appEncryptionKey, appDecryptionKey, keyVerifiers)
}
