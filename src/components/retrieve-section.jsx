import React from "react";

const Skeleton = ({ className = "" }) => {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-[#F8F9FA] to-[#E6E6E6] rounded-[4px] ${className}`}
    />
  );
};

const RetrieveSection = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
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
};

export { RetrieveSection };
