import React from "react";

const UploadSection = () => {
  return (
    <div className="mb-8">
      <div className="flex items-start p-2 sm:p-3 bg-[#FFDF0A] rounded-t-xl">
        <p className="font-helvetica font-normal text-sm leading-5 text-[#363B3F]">
          Open source. Check a core code in our Github
        </p>
      </div>

      <div className="px-0 py-10 max-w-[960px] bg-white rounded-b-xl">
        <div className="py-0 px-6">
          <h2 className="font-helvetica font-medium text-sm leading-5 text-[#363B3F] mb-4">
            Upload your encryption key
          </h2>
          <div className="border border-dashed border-[#E8EBEC] rounded font-helvetica font-normal text-sm leading-5 text-[#A1AAB1] p-8 text-center">
            <p className="text-gray-500">
              Drag & drop .JSON file with your encryption key
              <br />
              in this area or <button className="text-blue-500">Browse</button>
            </p>
          </div>
          <div className="font-helvetica font-normal text-[14px] leading-5 text-[#77818A] underline mt-2">
            Where i can find encryption key?
          </div>
          <button className="p-4 mt-4 w-full bg-[#E8EBEC] rounded font-helvetica font-medium text-[14px] leading-[20px] text-[#A1AAB1]">
            Retrieve documents
          </button>
        </div>
      </div>
    </div>
  );
};

export { UploadSection };
