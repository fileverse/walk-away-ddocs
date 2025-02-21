import { signerToSmartAccount, createClient } from './constants'

export const getSmartAccountClientFromAccount = async (signer) => {
  const smartAccount = await signerToSmartAccount(signer)
  return createClient(smartAccount)
}
