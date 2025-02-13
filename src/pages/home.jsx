import React from "react";
import { FAQ } from "../components/faq";
import { UploadSection } from "../components/upload-section";

const HomePage = () => {
  return (
    <div className="">
      {/* Main Content */}
      <main className="max-w-3xl mx-auto p-8">
        <div className="pl-5">
          <h1 className="font-helvetica font-bold text-2xl leading-10 text-[#363B3F] mb-2">
            dDocs: Zero Servers
          </h1>
          <p className="font-helvetica font-normal text-base leading-6 text-[#77818A] mb-8">
            This page allows you to retrieve all your documents created on dDocs
            as PDF’s or .MD files if dDocs will goes down.
          </p>
        </div>

        {/* Upload Section */}
        <UploadSection />

        <div className="pb-2">
          <p className="font-helvetica font-normal text-[16px] leading-6 text-[#77818A] pb-3">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
            quis imperdiet metus. Proin et lorem dolor. Fusce dolor nisi,
            tincidunt sit amet felis in, gravida imperdiet justo. Duis
            pellentesque, elit bibendum imperdiet aliquam, ex velit elementum
            neque, at posuere risus nisi at justo. Phasellus vitae lectus sed
            libero mollis fringilla non eget leo. Nunc dapibus, nisi sit amet
            sagittis euismod, urna elit rutrum massa, sed scelerisque leo ex vel
            dui. 
          </p>
          <p className="font-helvetica font-normal text-[16px] leading-6 text-[#77818A]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
            quis imperdiet metus. Proin et lorem dolor. Fusce dolor nisi,
            tincidunt sit amet felis in, gravida imperdiet justo. Duis
            pellentesque, elit bibendum imperdiet aliquam, ex velit elementum
            neque, at posuere risus nisi at justo. Phasellus vitae lectus sed
            libero mollis fringilla non eget leo. Nunc dapibus, nisi sit amet
            sagittis euismod, urna elit rutrum massa, sed scelerisque leo ex vel
            dui. 
          </p>
        </div>

        {/* FAQ Section */}
        <FAQ />
      </main>
    </div>
  );
};

export { HomePage };
