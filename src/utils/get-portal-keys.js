function isOldBackupKeys(value) {
  return (
    typeof value === 'object' &&
    'portalAddress' in value &&
    'ownerPublicKey' in value &&
    'ownerPrivateKey' in value &&
    'portalPrivateKey' in value &&
    'portalPublicKey' in value &&
    'memberPrivateKey' in value &&
    'memberPublicKey' in value &&
    'source' in value
  )
}

function isNewBackupKeysFormat(value) {
  return (
    typeof value === 'object' &&
    'portalAddress' in value &&
    'ownerPublicKey' in value &&
    'ownerPrivateKey' in value &&
    'portalPublicKey' in value &&
    'source' in value
  )
}

function isNewBackupKeys(value) {
  return (
    typeof value === 'object' &&
    'portalAddress' in value &&
    'ownerDid' in value &&
    'ownerSecret' in value &&
    'appEncryptionKey' in value &&
    'appDecryptionKey' in value &&
    'permissionAddress' in value &&
    'source' in value
  )
}

export function splitBackupKeys(data) {
  let oldBackupKeys = {}
  let newBackupKeys = {}

  //Just old backup keys (before Privacy Upgrade)
  if (
    isOldBackupKeys(data) &&
    data.memberPublicKey !== '' &&
    data.memberPrivateKey !== ''
  ) {
    oldBackupKeys = data
    return { oldBackupKeys, newBackupKeys }
  }

  //Just new backup keys (after Privacy Upgrade and before Walk Away page v2)
  if (
    isNewBackupKeysFormat(data) &&
    data.memberPublicKey === '' &&
    data.memberPrivateKey === ''
  ) {
    newBackupKeys = {
      portalAddress: data.portalAddress,
      appEncryptionKey: data.ownerPublicKey,
      appDecryptionKey: data.ownerPrivateKey,
      source: data.source,
    }
    return { oldBackupKeys, newBackupKeys }
  }

  //Just new backup keys (after Walk Away page v2 and after Privacy Upgrade)
  if (isNewBackupKeys(data)) {
    newBackupKeys = data
    return { oldBackupKeys, newBackupKeys }
  }

  // Mixed backup keys (after Walk Away page v2 and after Privacy Upgrade and has both old and new backup keys)
  if (data && typeof data === 'object') {
    for (const value of Object.values(data)) {
      if (isOldBackupKeys(value)) {
        oldBackupKeys = value
      } else if (isNewBackupKeys(value)) {
        newBackupKeys = value
      }
    }
  }

  return { oldBackupKeys, newBackupKeys }
}
