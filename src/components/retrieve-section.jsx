import { useEffect, useState, useRef } from 'react'
import { DdocsIcon, PdfIcon, MdIcon } from '../assets/icons'
import { decryptTitle, decryptUsingRSAKey, decryptFile } from '../utils/crypto'
import { privateKeyToAccount } from 'viem/accounts'
import { getIPFSAsset } from '../utils/ipfs-utils'
import { getContractFile } from '../utils/contract-functions'
import { usePortalProvider } from '../providers/portal-provider'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { PreviewDdocEditor, handleContentPrint } from '@fileverse-dev/ddoc'
import hkdf from 'futoin-hkdf'
import { getSmartAccountClientFromAccount } from '../utils/get-smart-account-from-account'
import { toHex } from 'viem'

const Skeleton = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-[#F8F9FA] to-[#E6E6E6] rounded-[4px] ${className}`}
    />
  )
}

const RetrieveSection = () => {
  const navigate = useNavigate()

  const { portalInformation, setPortalInformation } = usePortalProvider()
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState('')
  const [searchQuery] = useSearchParams()

  const [content, setContent] = useState('')
  const [contentData, setContentData] = useState({
    contentHash: '',
    fileKey: {},
  })

  useEffect(() => {
    if (!portalInformation.ownerPrivateKey) {
      navigate('/')
    }
  }, [portalInformation])

  const fetchContent = async (contentData) => {
    try {
      setIsError('')
      setIsLoading(true)
      const response = await decryptFile(
        contentData.fileKey,
        contentData.contentHash
      )
      setContent(response.file)
    } catch (error) {
      setIsError(error?.message || 'Failed to Fetch content')
    } finally {
      setIsLoading(false)
    }
  }

  const editorRef = useRef(null)

  const exportPdf = () => {
    if (!content || !editorRef.current) return
    handleContentPrint(editorRef.current.getEditor().getHTML())
  }

  const exportMd = () => {
    if (!editorRef.current) return
    editorRef.current.exportContentAsMarkDown(contentData.contentHash + '.md')
  }

  const style = async () => {
    return await import('@fileverse-dev/ddoc/styles')
  }

  useEffect(() => {
    if (!contentData.contentHash) return
    fetchContent(contentData)
  }, [contentData.contentHash])

  const [formData, setFormData] = useState({
    fileId: '',
    linkKey: '',
    signedMessage: '',
  })
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const getSmartAccountClient = async (signedMessage) => {
    const derivedKey = hkdf(Buffer.from(signedMessage), 32, {
      info: Buffer.from('encryptionKey'),
    })
    const privateAccount = privateKeyToAccount(toHex(derivedKey))

    const smartAccountClient =
      await getSmartAccountClientFromAccount(privateAccount)
    return smartAccountClient
  }

  const [accountError, setAccountError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.signedMessage) return
    setAccountError('')
    const smartAccountClient = await getSmartAccountClient(
      formData.signedMessage
    )
    // if (smartAccountClient.account.address !== portalInformation.owner) {
    //   setAccountError(
    //     smartAccountClient.account + ' is not the owner of this account'
    //   )
    //   return
    // }
    setPortalInformation((prev) => ({
      ...prev,
      fileId: formData.fileId,
      smartAccountClient,
      linkKey: formData.linkKey,
    }))
    navigate('/' + portalInformation.portalAddress + '/edit')
  }

  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-[1312px] bg-white rounded-[12px]">
        <div className="flex">
          {/* Loaded state left sidebar */}
          <div className="flex flex-col items-start border-r border-gray-200 p-4 h-[calc(100vh-120px)] overflow-y-auto">
            <div className="font-helvetica text-[12px] leading-[16px] font-normal text-[#77818A]">
              Documents: {portalInformation.fileCount}
            </div>
            <div className="w-[280px] flex flex-col gap-2 pt-2">
              {Array(portalInformation.fileCount)
                .fill(0)
                .map((_, index) => (
                  <DdocFile
                    key={index}
                    fileId={index}
                    contentData={contentData}
                    setContentData={setContentData}
                  />
                ))}
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
                <div className="font-helvetica font-medium text-[14px] leading-[20px] text-[#363B3F]">
                  IPFS hash: {contentData?.contentHash}
                </div>
                <div className="flex">
                  <button className="p-2 hover:bg-[#F8F9FA] rounded-[4px]">
                    <span className="text-[14px] text-[#6C757D]">
                      Download as:
                    </span>
                  </button>
                  <button
                    onClick={exportPdf}
                    className="p-2 hover:bg-[#F8F9FA] rounded-[4px]"
                  >
                    <PdfIcon />
                  </button>
                  <button
                    onClick={exportMd}
                    className="p-2 hover:bg-[#F8F9FA] rounded-[4px]"
                  >
                    <MdIcon />
                  </button>
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
                <div className="p-6 overflow-y-auto h-[calc(100vh-180px)] scrollbar-hide">
                  <PreviewDdocEditor
                    className={`${style()}`}
                    ref={editorRef}
                    initialContent={content}
                    isPreviewMode={true}
                    unFocused
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {searchQuery.get('edit') === 'true' && (
        <Form
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          formData={formData}
          accountError={accountError}
        />
      )}
    </div>
  )
}

export { RetrieveSection }

export const DdocFile = ({ fileId, setContentData, contentData }) => {
  const { portalInformation } = usePortalProvider()
  const { ownerPrivateKey, portalAddress } = portalInformation
  const [isDeleted, setIsDeleted] = useState(false)
  const [title, setDocTitle] = useState('')
  const [data, setData] = useState()

  const loadFileDetails = async () => {
    const details = await getContractFile(fileId, portalAddress)

    if (!details.contentHash || !details.metadataHash)
      throw new Error('metadata or content is empty')
    const response = await getIPFSAsset({ ipfsHash: details.metadataHash })
    const metadata = response?.data
    if (metadata?.isDeleted) {
      setIsDeleted(true)
      return
    }

    const encryptedFileKey = metadata.ownerLock.lockedFileKey

    const _fileKey = await decryptUsingRSAKey(encryptedFileKey, ownerPrivateKey)

    if (!_fileKey) throw new Error('Failed to open file key')
    const titleInMetadata = metadata?.title
    const textDecoder = new TextDecoder()
    const fileKey = JSON.parse(textDecoder.decode(_fileKey))
    const title = await decryptTitle(
      titleInMetadata,
      fileKey,
      ownerPrivateKey,
      metadata.archVersion
    )
    setDocTitle(title)

    if (fileId === 0) {
      setContentData({ fileKey, contentHash: details.contentHash })
    }

    setData({ fileKey, contentHash: details.contentHash })
  }
  useEffect(() => {
    loadFileDetails()
  }, [])
  return (
    <div
      onClick={() => {
        if (!data) return
        setContentData(data)
      }}
      className={`flex items-center gap-3 p-2 hover:bg-[#F8F9FA] ${contentData.contentHash === data?.contentHash && 'bg-[#F8F9FA]'} rounded-[4px] cursor-pointer`}
    >
      <div className="w-5 h-5 bg-[#FFE5B3] rounded-[4px] flex items-center justify-center">
        <DdocsIcon />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-helvetica font-medium text-[14px] leading-[20px] text-[#363B3F] truncate">
          {title}
        </div>
      </div>
    </div>
  )
}
export const Form = ({
  handleSubmit,
  formData,
  handleChange,
  accountError,
}) => {
  const [searchQuery, setSearchQuery] = useSearchParams()
  return (
    <div className="fixed inset-0 flex items-center bg-opacity justify-center bg-black/50 ">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Input details for file</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm font-medium">FileId</label>
            <input
              type="text"
              name="fileId"
              value={formData.fileId}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium">Link Key</label>
            <input
              type="text"
              name="linkKey"
              value={formData.linkKey}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Signed Message</label>
            <textarea
              name="signedMessage"
              value={formData.signedMessage}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          {accountError && <p className="text-red-500">{accountError}</p>}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => {
                searchQuery.delete('edit')
                setSearchQuery(searchQuery)
              }}
              className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded-md"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
