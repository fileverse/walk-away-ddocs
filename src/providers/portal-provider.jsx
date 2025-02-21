import { createContext, useContext, useState } from 'react'

const PortalProviderContext = createContext({
  setPortalInformation: (data) => data,
  portalInformation: {
    fileCount: 0,
    portalAddress: '',
    ownerPrivateKey: '',
  },
})

export const usePortalProvider = () => useContext(PortalProviderContext)

const PortalProvider = ({ children }) => {
  const [portalInformation, setPortalInformation] = useState({
    fileCount: 0,
    portalAddress: '',
    ownerPrivateKey: '',
    smartAccountClient: null,
  })
  return (
    <PortalProviderContext.Provider
      value={{
        setPortalInformation,
        portalInformation,
      }}
    >
      {children}
    </PortalProviderContext.Provider>
  )
}

export default PortalProvider
