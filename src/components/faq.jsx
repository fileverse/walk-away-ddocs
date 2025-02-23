import { useState } from 'react'
import ChevronIcon from '../assets/chevron-icon'

/** @type {{ question: string, answer: import('react').ReactNode }[]} */
const agentFaqs = [
  {
    question: 'Where can I find my dDocs Backup Keys?',
    answer: (
      <>
        Go to{' '}
        <a
          href="https://ddocs.new"
          target="_blank"
          className="text-[#5C0AFF] hover:underline"
        >
          ddocs.new
        </a>
        , sign in to your account, open the sidebar, click on the Settings icon
        on the bottom left corner. In the settings page, click
        &quot;download&quot; to save your dDocs Backup Keys. Keep those keys
        stored in a secure folder on your local device. Do not lose those keys.
      </>
    ),
  },
  {
    question: 'What can I do on this static page?',
    answer: (
      <>
        This powerful static page lets you retrieve all your dDocs documents as
        PDFs or .MD files, ensuring you always have access to your content—no
        matter what happens to the Fileverse team or Apps. Just upload your
        dDocs Backup Keys to download all your dDocs documents.
      </>
    ),
  },
  {
    question: 'What are the advantages of a static page?',
    answer: (
      <>
        This static page grants you greater agency over your document
        management. A static page minimizes the amount of server-side
        processing, allows you to download the whole page, modify it and use it
        offline in complete privacy. <br />
        <br />
        The static page is also hosted and accessible via any public IPFS
        gateway from which you can download it and in so doing improve the
        censorship-resistance of your documents.
      </>
    ),
  },
  {
    question: 'Why did Fileverse build this page?',
    answer: (
      <>
        We believe in true data ownership and self-sovereignty. Unlike
        traditional platforms that lock you in,{' '}
        <a
          href="https://ddocs.new"
          target="_blank"
          className="text-[#5C0AFF] hover:underline"
        >
          ddocs.new
        </a>{' '}
        ensures you can always access your files & account. This backup page
        guarantees your documents stay in your hands, even if the main app goes
        offline.
      </>
    ),
  },
  {
    question: 'What happens if I don’t download my dDocs Backup Keys?',
    answer: (
      <>
        Without your dDocs Backup Keys, you won’t be able to decrypt and
        retrieve your documents. We highly recommend downloading them in advance
        from your account settings on{' '}
        <a
          href="https://ddocs.new"
          target="_blank"
          className="text-[#5C0AFF] hover:underline"
        >
          ddocs.new
        </a>
        .
      </>
    ),
  },
  {
    question: 'What do I do if I can’t recover my documents?',
    answer: (
      <>
        Please reach out to us at{' '}
        <a
          href="mailto:hello@fileverse.io"
          className="text-[#5C0AFF] hover:underline"
        >
          hello@fileverse.io
        </a>{' '}
        💛
      </>
    ),
  },
]

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <div className="w-[912px] mt-10 text-[#363b3f] text-xl mb-4 font-bold leading-7">
      <div className="text-[#363b3f] text-lg font-semibold leading-normal">
        Frequently Asked Questions
      </div>

      <div className="space-y-4 px-1 mt-4">
        {agentFaqs.map((faq, index) => (
          <div
            key={index}
            className={`border-b border-gray-200 ${
              index === -1 ? 'border-t' : ''
            }`}
          >
            <button
              className="w-full flex justify-between items-center py-4 text-left cursor-pointer"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span className="text-[#363b3f] text-sm font-medium">
                {faq.question}
              </span>
              <div
                className={`transform transition-transform ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              >
                <ChevronIcon />
              </div>
            </button>

            {openIndex === index && (
              <div className="pb-4 text-sm font-normal leading-5 text-[#363B3F]">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export { FAQ }
