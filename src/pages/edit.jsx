import { DdocEditor } from '@fileverse-dev/ddoc'
import { useState, useRef, useEffect } from 'react'
import { usePortalProvider } from '../providers/portal-provider'
import { jsonToFile } from '../utils/json-to-file'
import hkdf from 'futoin-hkdf'
import { privateKeyToAccount } from 'viem/accounts'
import { getSmartAccountClientFromAccount } from '../utils/get-smart-account-from-account'
import { toHex } from 'viem'
import { toUint8Array, isValid } from 'js-base64'
import FileverseIcon from '../assets/fileverse.svg'
import tweetnacl from 'tweetnacl'
import {
  encryptFile,
  decryptSecretKey,
  decryptFile,
  decryptTitle,
} from '../utils/crypto'
import { editFileTransaction } from '../utils/contract-functions'
import {
  generateFileMetadata,
  uploadContentAndMetadataFile,
  getNonceAndCipherText,
} from '../utils/file-utils'
import { getIPFSAsset } from '../utils/ipfs-utils'
import { getContractFile } from '../utils/contract-functions'
import { useSearchParams } from 'react-router-dom'

export const EditPage = () => {
  const style = async () => {
    return await import('@fileverse-dev/ddoc/styles')
  }
  const editorRef = useRef(null)
  const { portalInformation, setPortalInformation } = usePortalProvider()
  const [contentToPublish, setContentToPublish] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [initialContent, setInitalContent] = useState('')

  const [fileData, setFileData] = useState({
    ddocId: '',
    fileId: portalInformation.fileId,
    portalEncryptionKey: portalInformation.portalPublicKey,
    ownerEncryptionKey: portalInformation.ownerPublicKey,
    commentKey: '',
    nonce: null,
    title: '',
    version: '',
    metadata: {},
    shouldEncryptTitle: false,
  })
  const publishDoc = async () => {
    if (!portalInformation.smartAccountClient) return
    try {
      setIsLoading(true)
      const invokerAddress =
        portalInformation.smartAccountClient.account.address

      const contentFile = jsonToFile(
        { file: contentToPublish, source: 'fileverse_document' },
        `${'Untitled'}`
      )
      const { fileKey, encryptedFile } = await encryptFile(contentFile)
      const linkKey = portalInformation.linkKey
      const secretKey = await decryptSecretKey(
        fileData.ddocId,
        fileData.nonce,
        linkKey
      )
      const { commentKey, nonce, version, title, ddocId, metadata } = fileData

      const { portalLock, ownerLock } = metadata

      const fileMetadata = await generateFileMetadata(
        encryptedFile,
        fileKey,
        { portalLock, ownerLock },
        commentKey,
        secretKey,
        nonce,
        invokerAddress,
        version,
        title,
        ddocId,
        fileData.shouldEncryptTitle
      )

      const { contentIpfsHash, metadataIpfsHash } =
        await uploadContentAndMetadataFile({
          contentFile: encryptedFile,
          metadataFile: jsonToFile(
            fileMetadata,
            contentFile.name + '.metadata.json'
          ),
          contractAddress: portalInformation.portalAddress,
          invoker: invokerAddress,
          editSecret: '',
          apiKey: portalInformation.apiKey,
        })

      await editFileTransaction(portalInformation.smartAccountClient, {
        contractAddress: portalInformation.portalAddress,
        contentIpfsHash,
        metadataIpfsHash,
        fileType: 1,
        fileId: portalInformation.fileId,
      })
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadFileData = async () => {
    let attempts = 0
    const maxRetries = 3

    while (attempts < maxRetries) {
      try {
        setIsLoading(true)

        const details = await getContractFile(
          portalInformation.fileId,
          portalInformation.portalAddress
        )

        if (!details.contentHash || !details.metadataHash) {
          throw new Error('metadata or content is empty')
        }

        const response = await getIPFSAsset({ ipfsHash: details.metadataHash })
        const metadata = response?.data

        const secretKey = await decryptSecretKey(
          metadata.ddocId,
          metadata.nonce,
          portalInformation.linkKey
        )

        const { cipherText: lockedFileKey, nonce: fileKeyNonce } =
          getNonceAndCipherText(metadata.linkLock.lockedFileKey, metadata.nonce)

        const fileKey = tweetnacl.secretbox.open(
          toUint8Array(lockedFileKey),
          toUint8Array(fileKeyNonce),
          secretKey
        )

        if (!fileKey) throw new Error('Failed to open file key')

        const decodedFileKey = new TextDecoder().decode(fileKey)
        const { key, iv, authTag } = JSON.parse(decodedFileKey)

        const result = await decryptFile(
          { key, iv, authTag },
          details.contentHash
        )

        const titleInMetadata = metadata?.title

        const shouldEncryptTitle = isValid(titleInMetadata)

        const title = isValid(titleInMetadata)
          ? await decryptTitle(
              titleInMetadata,
              { key, iv, authTag },
              metadata.archVersion
            )
          : titleInMetadata
        const textDecoder = new TextDecoder()

        const { cipherText: lockedChatKey, nonce: chatKeyNonce } =
          getNonceAndCipherText(metadata.linkLock.lockedChatKey, metadata.nonce)

        const commentKey = tweetnacl.secretbox.open(
          toUint8Array(lockedChatKey),
          toUint8Array(chatKeyNonce),
          secretKey
        )

        setInitalContent(result.file)
        setFileData((prev) => ({
          ...prev,
          title,
          ddocId: metadata.ddocId,
          commentKey: JSON.parse(textDecoder.decode(commentKey)),
          nonce: metadata.nonce,
          version: metadata.version,
          metadata,
          shouldEncryptTitle,
        }))

        return // Exit loop if successful
      } catch (error) {
        attempts++
        console.log(`Attempt ${attempts} failed:`, error)
        if (attempts >= maxRetries) {
          console.log('Max retry attempts reached. Failing operation.')
        } else {
          await new Promise((resolve) => setTimeout(resolve, 1000)) // Wait 1 second before retrying
        }
      } finally {
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    if (!portalInformation.smartAccountClient) {
      return
    }
    loadFileData()
  }, [portalInformation])

  const [accountError, setAccountError] = useState('')

  const [formData, setFormData] = useState({
    fileId: '',
    linkKey: '',
    signedMessage: '',
    portalAddress: '',
    apiKey: '',
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
      portalAddress: formData.portalAddress,
      apiKey: formData.apiKey,
    }))
  }

  return (
    <>
      <nav className="flex justify-between items-center px-6 py-3 border-[#E8EBEC]">
        <div className="flex items-center">
          <img src={FileverseIcon} alt="Fileverse" />
        </div>

        <div className="flex items-center gap-1">
          <button
            disabled={isLoading}
            onClick={publishDoc}
            className="px-4 py-2 bg-black text-white rounded-md"
          >
            {isLoading ? 'Loading' : 'Publish'}
          </button>
        </div>
      </nav>
      {portalInformation.smartAccountClient ? (
        <div className="w-full">
          <DdocEditor
            ref={editorRef}
            initialContent={initialContent}
            onChange={(content) => {
              setContentToPublish(content)
            }}
            className={style()}
            zoomLevel="1"
            isPreviewMode={false}
          />
        </div>
      ) : (
        <Form
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          formData={formData}
          accountError={accountError}
        />
      )}
    </>
  )
}

export const Form = ({
  handleSubmit,
  formData,
  handleChange,
  accountError,
}) => {
  const [searchQuery, setSearchQuery] = useSearchParams()
  console.log('happy')
  return (
    <div className="fixed inset-0 flex items-center bg-opacity justify-center bg-black/50 ">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Input details for file</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm font-medium">Portal Address</label>
            <input
              type="text"
              name="portalAddress"
              value={formData.portalAddress}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
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
          <div className="mb-3">
            <label className="block text-sm font-medium">API key</label>
            <input
              type="text"
              name="apiKey"
              value={formData.apiKey}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block  text-sm font-medium">Signed Message</label>
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
