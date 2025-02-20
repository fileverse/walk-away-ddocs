import { isKeysVerified } from './is-keys-verified'
import { getPortalKeysVerifiers } from './contract-functions'

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
