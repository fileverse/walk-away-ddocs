import React, { useState } from 'react';
import { DdocsIcon, PdfIcon, MdIcon } from '../assets/icons';
// import '@fileverse-dev/ddoc/styles';

const Skeleton = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-[#F8F9FA] to-[#E6E6E6] rounded-[4px] ${className}`}
    />
  );
};

const RetrieveSection = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="w-full max-w-[1312px] bg-white rounded-[12px]">
          <div className="flex">
            {/* Left side - Status and file info */}
            <div className="flex flex-col items-start gap-3 border-r border-[#E8EBEC] w-[328px] max-w-[400px] rounded-l-[12px] pt-3 px-4">
              <div className="bg-[#F8F9FA] w-full flex items-center justify-center rounded-[4px] p-2 font-helvetica font-medium text-[14px] leading-[20px] text-[#363B3F]">
                Retrieving your documents
              </div>
              <div className="flex gap-2 items-center justify-center">
                <div>
                  <Skeleton className="h-5 w-5" />
                </div>
                <div className="flex flex-col gap-2">
                  <div>
                    <Skeleton className="h-6 w-[200px]" />
                  </div>
                  <div>
                    <Skeleton className="h-3 w-[100px]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Document list */}
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
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-[1312px] bg-white rounded-[12px]">
        <div className="flex">
          {/* Loaded state left sidebar */}
          <div className="flex flex-col items-start border-r border-gray-200 p-4 h-[calc(100vh-120px)] overflow-y-auto overflow-x-hidden">
            <div className="font-helvetica text-[12px] leading-[16px] font-normal text-[#77818A]">
                Documents: 9
              </div>
            <div className="w-[280px] flex flex-col gap-2">
              {Array(19)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-2 hover:bg-[#F8F9FA] rounded-[4px] cursor-pointer"
                  >
                  <div className="w-5 h-5 bg-[#FFE5B3] rounded-[4px] flex items-center justify-center">
                      <DdocsIcon />
                  </div>
                  <div className="flex-1">
                      <div className="font-helvetica font-medium text-[14px] leading-[20px] text-[#363B3F]">
                        Privacy_document
                      </div>
                      <div className="font-helvetica font-normal text-[12px] leading-[16px] text-[#77818A]">
                        Last edit 11.07.2024 17:30
                      </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Loaded state main content */}
          <div className="flex-1">
            <div className="flex justify-between items-center py-3 px-3 border-b border-gray-200">
              <div className="font-helvetica font-medium text-[14px] leading-[20px] text-[#363B3F]">
                Privacy and Decentralization in the Digital Age
              </div>
              <div className="flex">
                <button className="p-2 hover:bg-[#F8F9FA] rounded-[4px]">
                  <span className="text-[14px] text-[#6C757D]">
                    Download as:
                  </span>
                </button>
                <button className="p-2 hover:bg-[#F8F9FA] rounded-[4px]">
                  <PdfIcon />
                </button>
                <button className="p-2 hover:bg-[#F8F9FA] rounded-[4px]">
                  <MdIcon />
                </button>
              </div>
            </div>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Privacy and Decentralization</h1>
              <p className="mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <h2 className="text-xl font-bold mb-3">Key Points</h2>
              <ul className="list-disc pl-5 mb-4">
                <li>Data Privacy in Web3</li>
                <li>Decentralized Storage Solutions</li>
                <li>User Control and Ownership</li>
              </ul>
              <p className="mb-4">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { RetrieveSection };
