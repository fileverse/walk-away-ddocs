import { useState } from "react";
import ChevronIcon from "../assets/chevron-icon";

/** @type {{ question: string, answer: import('react').ReactNode }[]} */
const agentFaqs = [
  {
    question: "Where i can get my encryption key?",
    answer: (
      <>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
      </>
    ),
  },
  {
    question: "What's going on on this page?",
    answer: (
      <>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
      </>
    ),
  },
  {
    question: "What motivated Fileverse to build this search engine?",
    answer: (
      <>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
      </>
    ),
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="w-full py-8 px-3">
      <h2 className="mb-6 font-helvetica font-medium text-[18px] leading-6 text-[#363B3F]">
        Frequently Asked Questions
      </h2>

      <div className="space-y-4 px-2">
        {agentFaqs.map((faq, index) => (
          <div
            key={index}
            className={`border-b border-gray-200 ${
              index === 0 ? "border-t" : ""
            }`}
          >
            <button
              className="w-full flex justify-between items-center py-4 text-left cursor-pointer"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span className="font-helvetica font-medium text-[14px] leading-5 text-[#363B3F]">
                {faq.question}
              </span>
              <div
                className={`transform transition-transform ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              >
                <ChevronIcon />
              </div>
            </button>

            {openIndex === index && (
              <div className="pb-4 font-sans text-sm font-normal leading-5 text-[#363B3F]">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export { FAQ };
