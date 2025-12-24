import { RetrieveSection } from '../components/retrieve-section'
import { usePortalProvider } from '../providers/portal-provider'
import { DsheetsRetrieveSection } from '../components/dsheets-retrieve-section'

const RetrievePage = () => {
  const { portalInformation } = usePortalProvider()

  if (portalInformation.source.includes('sheets.fileverse.io')) {
    return <DsheetsRetrieveSection />
  }

  return <RetrieveSection />
}

export { RetrievePage }
