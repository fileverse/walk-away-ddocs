import { useCallback, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  validateKey,
  InvalidRecoveryJsonError,
  InvalidSourceError,
} from '../utils/validate-keys'
import { verifyPortalKeysFromContract } from '../utils/verify-portal-keys-from-contract'
import { usePortalProvider } from '../providers/portal-provider'
import { getPortalFileCount } from '../utils/contract-functions'

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

  const verifyFileContentFromReader = (reader) => {
    reader.onload = async (e) => {
      try {
        const fileContent = JSON.parse(decodeURIComponent(e?.target?.result))
        validateKey(fileContent)
        const {
          portalPublicKey,
          portalPrivateKey,
          memberPublicKey,
          memberPrivateKey,
          portalAddress,
          ownerPrivateKey,
          ownerPublicKey,
        } = fileContent
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
        if (!isVerified) {
          setUploadState('incorrect')
          return
        }
        const fileCount = await getPortalFileCount(portalAddress)
        setPortalInformation({
          fileCount,
          portalAddress,
          ownerPrivateKey,
          ownerPublicKey,
          portalPublicKey,
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
      navigate('/' + portalInformation.portalAddress + '/retrieve')
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
