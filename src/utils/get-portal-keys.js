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

  // Case 1: data itself is a single OldBackupKeys object
  if (isOldBackupKeys(data)) {
    oldBackupKeys = data
    return { oldBackupKeys, newBackupKeys }
  }

  // Case 2: data is a map: randomKey -> backupObject
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
