import { FAQ } from '../components/faq'
import { UploadSection } from '../components/upload-section'
import { Footer } from '../components/footer'
import { OpenSource } from '../components/open-source'
const HomePage = () => {
  return (
    <div className="bg-[#F8F9FA]">
      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-8">
        <h1 className="font-bold text-2xl leading-10 text-[#363B3F] mb-2">
          dDocs and dSheets Walkaway
        </h1>
        <p className="font-normal text-base leading-6 text-[#77818A] mb-8">
          Independently recover all documents and spreadsheets tied to your
          accounts in case the main dDocs and/or dSheets apps are down.
        </p>

        {/* Upload Section */}
        <UploadSection />

        <div className="w-full max-w-[912px] text-[#363b3f] text-lg sm:text-xl mb-4 font-bold leading-6 sm:leading-7">
          Your dDocs and dSheets, always accessible
        </div>

        <div className="mb-8">
          <p className="text-[#77818a] text-base font-normal leading-normal">
            Whatever happens to Fileverse,{' '}
            <a
              href="https://ddocs.new"
              target="_blank"
              className="text-[#5C0AFF] hover:underline"
            >
              ddocs.new
            </a>{' '}
            or{' '}
            <a
              href="https://dsheets.new"
              target="_blank"
              className="text-[#5C0AFF] hover:underline"
            >
              dsheets.new
            </a>
            , you should always be in control of your documents and
            spreadsheets. This static page gives you a simple way to directly
            interact with the decentralized networks (Gnosis & IPFS) that ensure
            the storage of your content. Doing so allows you to bypass
            third-parties while downloading your documents and spreadsheets in
            PDFs / .MD / .CSV and decrypting them locally.
          </p>

          <p className="mt-5 text-[#77818a] text-base font-normal leading-normal">
            Unlike big tech platforms that can access your data, censor it, or
            arbitrarily revoke your account, dDocs and dSheets take steps to
            offer you self-sovereignty by default. This{' '}
            <a
              href="https://walkaway.fileverse.eth.limo/"
              target="_blank"
              className="text-[#5C0AFF] hover:underline"
            >
              static page
            </a>{' '}
            is designed to make it easy for you to retrieve your documents and
            spreadsheets end-to-end without depending on centralized servers or
            the team behind Fileverse.
          </p>
          <p className="mt-5 text-[#77818a] text-base font-normal leading-normal">
            Built on Ethereum-aligned infrastructure, this page does not rely on
            Fileverse to function.
          </p>
        </div>

        <OpenSource />

        {/* FAQ Section */}
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}

export { HomePage }
