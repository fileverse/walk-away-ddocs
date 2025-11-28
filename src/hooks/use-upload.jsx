import { useCallback, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  validateKey,
  InvalidRecoveryJsonError,
  InvalidSourceError,
} from '../utils/validate-keys'
import { usePortalProvider } from '../providers/portal-provider'
import {
  getLegacyPortalFileCount,
  getNewPortalFileCount,
} from '../utils/contract-functions'
import { splitBackupKeys } from '../utils/get-portal-keys'
import { verifyLegacyKeys, verifyNewKeys } from '../utils/verify-keys'

const useUpload = () => {
  const navigate = useNavigate()
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState(null)
  const [uploadState, setUploadState] = useState(null) // 'uploading', 'uploaded', 'failed', 'incorrect', invalid-source
  const inputRef = useRef(null)
  const { setPortalInformation, portalInformation } = usePortalProvider()

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const verifyKeys = async (oldBackupKeys, newBackupKeys) => {
    let newPortalAddress = null
    let newKeysVerified = false
    let legacyKeysVerified = false
    let legacyPortalAddress = null
    let legacyOwnerPrivateKey = null

    if (Object.keys(oldBackupKeys).length > 0) {
      const {
        portalAddress,
        ownerPrivateKey,
        legacyKeysVerified: legacyKeysVerifiedResult,
      } = await verifyLegacyKeys(oldBackupKeys)
      legacyKeysVerified = legacyKeysVerifiedResult
      legacyPortalAddress = portalAddress
      legacyOwnerPrivateKey = ownerPrivateKey
      if (!legacyKeysVerified) {
        setUploadState('incorrect')
        return
      }
    }

    if (Object.keys(newBackupKeys).length > 0) {
      const { portalAddress, newKeysVerified: newKeysVerifiedResult } =
        await verifyNewKeys(newBackupKeys)
      newPortalAddress = portalAddress
      newKeysVerified = newKeysVerifiedResult

      if (!newKeysVerified) {
        setUploadState('incorrect')
        return
      }
    }

    return {
      legacyPortalAddress,
      legacyOwnerPrivateKey,
      newPortalAddress,
      newKeysVerified,
    }
  }

  const verifyFileContentFromReader = (reader) => {
    reader.onload = async (e) => {
      try {
        let legacyFileCount = 0
        let newFileCount = 0
        const fileContent = JSON.parse(decodeURIComponent(e?.target?.result))
        const { oldBackupKeys, newBackupKeys } = splitBackupKeys(fileContent)

        validateKey(oldBackupKeys, newBackupKeys)

        const { legacyPortalAddress, legacyOwnerPrivateKey, newPortalAddress } =
          await verifyKeys(oldBackupKeys, newBackupKeys)

        if (legacyPortalAddress) {
          legacyFileCount = await getLegacyPortalFileCount(legacyPortalAddress)
        }

        if (newPortalAddress) {
          newFileCount = await getNewPortalFileCount(newPortalAddress)
        }

        setPortalInformation({
          legacyFileCount,
          newFileCount,
          legacyPortalAddress: legacyPortalAddress,
          legacyOwnerPrivateKey: legacyOwnerPrivateKey,
          newPortalAddress: newPortalAddress,
          newOwnerPrivateKey: newBackupKeys.appDecryptionKey,
        })
        setUploadState('uploaded')
      } catch (err) {
        if (err instanceof InvalidRecoveryJsonError) {
          setUploadState('incorrect')
        } else if (err instanceof InvalidSourceError) {
          setUploadState('invalid-source')
        }
      }
    }
  }

  const handleFile = (selectedFile) => {
    if (selectedFile.name.endsWith('.json')) {
      setUploadState('uploading')
      const reader = new FileReader()
      verifyFileContentFromReader(reader)
      reader.readAsText(selectedFile)
    } else {
      setUploadState('incorrect')
    }
  }

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      setFile(droppedFile)
      handleFile(droppedFile)
    }
  }, [])

  const handleChange = useCallback((e) => {
    e.preventDefault()
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      handleFile(selectedFile)
    }
  }, [])

  const onButtonClick = () => {
    inputRef.current.click()
  }

  const handleRetrieveClick = () => {
    if (file && uploadState === 'uploaded') {
      if (portalInformation.legacyPortalAddress) {
        navigate('/' + portalInformation.legacyPortalAddress + '/retrieve')
      } else if (portalInformation.newPortalAddress) {
        navigate('/' + portalInformation.newPortalAddress + '/retrieve')
      }
    }
  }

  return {
    handleChange,
    handleDrag,
    handleDrop,
    onButtonClick,
    handleRetrieveClick,
    dragActive,
    uploadState,
    setUploadState,
    setFile,
    file,
    inputRef,
  }
}

export default useUpload
