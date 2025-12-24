import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { DsheetsIcon } from '../assets/icons'
import { usePortalProvider } from '../providers/portal-provider'
import {
  fetchNewFileResponse,
  decryptNewFile,
} from '../utils/new-file-decryption'
import { Skeleton } from './retrieve-section'
import { DsheetEditor } from '@fileverse-dev/dsheet'
import { getNewContractFile } from '../utils/contract-functions'
import {
  reconstructGateMetadata,
  decryptTitleWithFileKey,
} from '../utils/new-portal-utils'
import { eciesDecrypt } from '@fileverse/crypto/ecies'
import { toBytes } from '@fileverse/crypto/utils'
import { fromUint8Array } from 'js-base64'
import '@fileverse-dev/fortune-react/lib/index.css'
import { handleExportToXLSX, handleExportToCSV } from '@fileverse-dev/dsheet'

const DsheetsRetrieveSection = () => {
  const navigate = useNavigate()

  const { portalInformation } = usePortalProvider()
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState('')

  const [content, setContent] = useState('')
  const [contentData, setContentData] = useState({
    contentHash: '',
    fileKey: {},
    archVersion: '',
    dsheetId: '',
  })
  const [newActiveFiles, setNewActiveFiles] = useState(new Set())

  const sheetEditorRef = useRef(null)
  const getYdocRef = () => ({ current: window?.ydocRef })

  useEffect(() => {
    if (
      !portalInformation.legacyOwnerPrivateKey &&
      !portalInformation.newOwnerPrivateKey
    ) {
      navigate('/')
    }
  }, [portalInformation])

  const fetchContent = async (contentData) => {
    try {
      setIsError('')
      setIsLoading(true)
      const response = await fetchNewFileResponse(contentData.contentHash)
      const decryptedResult = await decryptNewFile(
        contentData.fileKey,
        response
      )
      setContent(decryptedResult.file)
      setIsLoading(false)
    } catch (error) {
      setIsError(error?.message || 'Failed to Fetch content')
    } finally {
      setIsLoading(false)
    }
    return
  }

  useEffect(() => {
    if (!contentData.contentHash) return
    fetchContent(contentData)
  }, [contentData.contentHash])

  const handleNewActiveFile = (fileId) => {
    setNewActiveFiles((prev) => {
      const newSet = new Set(prev)
      newSet.add(fileId)
      return newSet
    })
  }

  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-[1312px] bg-white rounded-[12px]">
        <div className="flex">
          {/* Loaded state left sidebar */}
          <div className="flex flex-col items-start border-r border-gray-200 p-4 h-[calc(100vh-120px)] overflow-y-auto">
            <div className="w-[280px] flex flex-col gap-2 pt-2">
              {portalInformation.newFileCount > 0 && (
                <>
                  <p>dSheets</p>
                  <div className="text-[12px] leading-[16px] font-normal text-[#77818A]">
                    Documents: {newActiveFiles.size}
                  </div>
                  {Array(portalInformation.newFileCount)
                    .fill(0)
                    .map((_, index) => (
                      <DsheetFile
                        key={index}
                        fileId={index}
                        contentData={contentData}
                        setContentData={setContentData}
                        onActiveFile={() => handleNewActiveFile(index)}
                      />
                    ))}
                  <hr />
                </>
              )}
            </div>
          </div>

          {!content || isLoading ? (
            <div className="flex-1">
              <div className="flex justify-between items-center border-b border-[#E8EBEC] mb-4 p-[16px_24px_16px_16px] h-[60px]">
                <div>
                  <Skeleton className="h-5 w-[150px]" />
                </div>
                <div className="flex gap-2 p-2">
                  <div>
                    <Skeleton className="h-8 w-8" />
                  </div>
                  <div>
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              </div>
              <div className="pt-8 flex flex-col gap-1 items-center">
                <div className="space-y-1">
                  <Skeleton className="w-[480px] h-[40px]" />
                </div>
                {Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <div key={index} className="space-y-1">
                      <Skeleton className="w-[624px] h-[24px]" />
                      <Skeleton className="w-[624px] h-[24px]" />
                      <Skeleton className="w-[624px] h-[24px]" />
                      <Skeleton className="w-[540px] h-[24px]" />
                      <Skeleton className="w-[220px] h-[24px]" />
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div className="flex-1">
              <div className="flex justify-between items-center py-3 px-3 border-b border-gray-200">
                <div className="font-medium text-[14px] leading-[20px] text-[#363B3F]">
                  IPFS hash: {contentData?.contentHash}
                </div>
                <div className="flex gap-2 items-center">
                  <span className="text-[12px] text-[#6C757D]">
                    Download as:
                  </span>
                  <div
                    onClick={() => {
                      const ydocRef = getYdocRef()
                      if (!ydocRef.current) return
                      handleExportToXLSX(
                        sheetEditorRef,
                        ydocRef,
                        contentData.dsheetId
                      )
                    }}
                    className="text-[12px] font-bold px-2 py-1 hover:bg-[#F8F9FA] rounded-[4px] border border-[#E8EBEC] cursor-pointer"
                  >
                    <span>.xlsx</span>
                  </div>
                  <div
                    onClick={() => {
                      const ydocRef = getYdocRef()
                      if (!ydocRef.current) return
                      handleExportToCSV(sheetEditorRef, ydocRef)
                    }}
                    className="text-[12px] font-bold px-2 py-1 hover:bg-[#F8F9FA] rounded-[4px] border border-[#E8EBEC] cursor-pointer"
                  >
                    <span>.csv</span>
                  </div>
                </div>
              </div>
              {isError ? (
                <div className="flex flex-col h-full w-full justify-center items-center">
                  <p>Error occurred</p>
                  <p>
                    {isError} Please{' '}
                    <span
                      className="hover:underline cursor-pointer text-blue-500 "
                      onClick={() => fetchContent(contentData)}
                    >
                      retry
                    </span>
                  </p>
                </div>
              ) : (
                <div>
                  <DsheetEditor
                    isReadOnly={true}
                    dsheetId={contentData.dsheetId}
                    sheetEditorRef={sheetEditorRef}
                    enableIndexeddbSync={true}
                    isAuthorized={false}
                    isNewSheet={false}
                    portalContent={content}
                    commentData={{}}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const DsheetFile = ({
  fileId,
  setContentData,
  contentData,
  onActiveFile,
}) => {
  const { portalInformation } = usePortalProvider()
  const { newPortalAddress } = portalInformation
  const [title, setDocTitle] = useState('')
  const [data, setData] = useState()
  const [hasCalledActiveFile, setHasCalledActiveFile] = useState(false)
  const [localData, setLocalData] = useState({
    fileKey: '',
    contentHash: '',
    archVersion: '',
  })

  const loadFileDetails = async () => {
    try {
      const details = await getNewContractFile(fileId, newPortalAddress)
      const metadataIPFSHash = details[2]
      const contentIPFSHash = details[3]
      const gateIPFSHash = details[4] || ''

      if (!contentIPFSHash || !metadataIPFSHash)
        throw new Error('metadata or content is empty')
      const metadata = await reconstructGateMetadata(
        metadataIPFSHash,
        gateIPFSHash
      )
      if (metadata?.isDeleted) {
        return null // Skip rendering if file is deleted
      }
      const dsheetId = metadata.dsheetId

      const ownerLockedFileKey = metadata.appLock.lockedFileKey

      const fileKeyArray = eciesDecrypt(
        toBytes(portalInformation.newOwnerPrivateKey),
        ownerLockedFileKey
      )

      const fileKey = fromUint8Array(fileKeyArray)

      const title = await decryptTitleWithFileKey(metadata.title, fileKey)

      setDocTitle(title)

      setLocalData({
        fileKey,
        contentHash: contentIPFSHash,
        archVersion: metadata.version,
        dsheetId,
      })

      if (fileId === 0) {
        setContentData({
          fileKey,
          contentHash: contentIPFSHash,
          archVersion: metadata.version,
        })
      }

      setData({ fileKey, contentHash: contentIPFSHash })

      if (!hasCalledActiveFile) {
        onActiveFile()
        setHasCalledActiveFile(true)
      }
    } catch (error) {
      console.error('Error loading file details:', error)
    }
  }

  useEffect(() => {
    loadFileDetails()
  }, [])

  return data ? ( // Only render if data exists (file is not deleted)
    <div
      onClick={() => {
        if (!data) return
        setContentData({
          fileKey: localData.fileKey,
          contentHash: localData.contentHash,
          archVersion: localData.archVersion,
          dsheetId: localData.dsheetId,
        })
      }}
      className={`flex items-center gap-3 p-2 hover:bg-[#F8F9FA] ${contentData.contentHash === data?.contentHash && 'bg-[#F8F9FA]'} rounded-[4px] cursor-pointer`}
    >
      <div className="w-5 h-5 bg-[#FFE5B3] rounded-[4px] flex items-center justify-center">
        <DsheetsIcon />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-[14px] leading-[20px] text-[#363B3F] truncate">
          {title}
        </div>
      </div>
    </div>
  ) : null
}

export { DsheetsRetrieveSection }
