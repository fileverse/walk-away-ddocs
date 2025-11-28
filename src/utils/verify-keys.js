import {
  verifyPortalKeysFromContract,
  verifyNewPortalKeysFromContract,
} from './verify-portal-keys-from-contract'

export const verifyLegacyKeys = async (oldBackupKeys) => {
  const {
    portalPublicKey,
    portalPrivateKey,
    memberPublicKey,
    memberPrivateKey,
    portalAddress,
    ownerPrivateKey,
  } = oldBackupKeys
  const keys = {
    portalPublicKey,
    portalPrivateKey,
    memberPublicKey,
    memberPrivateKey,
  }
  const isVerified = await verifyPortalKeysFromContract({
    keys,
    contractAddress: portalAddress,
  })

  return {
    portalAddress,
    ownerPrivateKey,
    legacyKeysVerified: isVerified,
  }
}

export const verifyNewKeys = async (newBackupKeys) => {
  const { portalAddress, appEncryptionKey, appDecryptionKey } = newBackupKeys

  const isVerified = await verifyNewPortalKeysFromContract({
    appEncryptionKey,
    appDecryptionKey,
    contractAddress: portalAddress,
  })
  return {
    portalAddress,
    newKeysVerified: isVerified,
  }
}
