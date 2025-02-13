import React, { useCallback, useRef, useState } from "react";
import { FileIcon, CloseIcon, ChevronGreyIcon, RetryIcon } from "../assets/icons";
import { useNavigate } from "react-router-dom";

const UploadSection = () => {
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadState, setUploadState] = useState(null); // 'uploading', 'uploaded', 'failed', 'incorrect'
  const [showKeyHelp, setShowKeyHelp] = useState(false);
  const inputRef = useRef(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      if (droppedFile.name.endsWith('.json')) {
        setUploadState('uploading');
        // Simulate upload progress
        setTimeout(() => {
          setUploadState('uploaded');
        }, 2000);
      } else {
        setUploadState('incorrect');
      }
    }
  }, []);

  const handleChange = useCallback((e) => {
    e.preventDefault();
    const selectedFile = e.target.files[0];
    
    if (selectedFile) {
      setFile(selectedFile);
      if (selectedFile.name.endsWith('.json')) {
        setUploadState('uploading');
        // Simulate upload progress
        setTimeout(() => {
          setUploadState('uploaded');
        }, 2000);
      } else {
        setUploadState('incorrect');
      }
    }
  }, []);

  const onButtonClick = () => {
    inputRef.current.click();
  };

  const handleRetrieveClick = () => {
    if (file && uploadState === 'uploaded') {
      navigate("/retrieve");
    }
  };

  const getStatusDisplay = () => {
    switch (uploadState) {
      case 'uploading':
        return (
          <div className="w-24 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-black animate-progress"></div>
          </div>
        );
      case 'uploaded':
        return (
          <div className="bg-[#DDFBDF] rounded-[4px] font-helvetica text-[12px] leading-[16px] font-normal text-[#177E23] p-1">
            Uploaded
          </div>
        );
      case 'failed':
        return (
          <div className="bg-[#FFE5E5] rounded-[4px] font-helvetica text-[12px] leading-[16px] font-normal text-[#D92D20] p-1">
            Failed to upload
          </div>
        );
      case 'incorrect':
        return (
          <div className="bg-[#FFE5E5] rounded-[4px] font-helvetica text-[12px] leading-[16px] font-normal text-[#D92D20] p-1">
            Incorrect file format
          </div>
        );
      default:
        return null;
    }
  };

  const getActionIcon = () => {
    if (uploadState === 'failed') {
      return (
        <button
          onClick={() => {
            setUploadState('uploading');
            // Retry upload logic here
            setTimeout(() => {
              setUploadState('uploaded');
            }, 2000);
          }}
          className="p-1 text-gray-400 hover:bg-[#F2F4F5] hover:text-gray-600 cursor-pointer rounded-[4px]"
        >
          <RetryIcon/>
        </button>
      );
    }
    
    return (
      <button
        onClick={() => {
          setFile(null);
          setUploadState(null);
        }}
        className="p-1 text-gray-400 hover:bg-[#F2F4F5] hover:text-gray-600 cursor-pointer rounded-[4px]"
      >
        <CloseIcon />
      </button>
    );
  };

  return (
        <div className="mb-8">
          <div className="flex items-start p-2 sm:p-3 bg-[#FFDF0A] rounded-t-xl">
            <p className="font-helvetica font-normal text-sm leading-5 text-[#363B3F]">
              Open source. Check a core code in our{" "}
              <span className="underline"> Github</span>
            </p>
          </div>

      <div className="px-0 py-10 max-w-[960px] bg-white rounded-b-xl">
            <div className="py-0 px-6">
              <h2 className="font-helvetica font-medium text-sm leading-5 text-[#363B3F] mb-4">
                Upload your encryption key
              </h2>

              <div
                className={`border-[2px] border-dashed ${
                  dragActive ? "border-blue-500 bg-blue-50" : "border-[#E8EBEC]"
                } 
                  rounded font-helvetica font-normal text-sm leading-5 text-[#A1AAB1] p-8 text-center mb-4`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept=".json"
                  onChange={handleChange}
                  className="hidden"
                />
                <p className="text-gray-500">
                  Drag & drop .JSON file with your encryption key
                  <br />
                  in this area or{" "}
                  <button
                    onClick={onButtonClick}
                    className="text-blue-500 hover:underline cursor-pointer"
                  >
                    Browse
                  </button>
                </p>
              </div>

              {file && (
                <div className="p-1 mb-4 hover:bg-[#F2F4F5] transition-colors duration-200 rounded-[4px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-gray-600">
                        <FileIcon />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{file.name}</div>
                        <div className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusDisplay()}
                      {getActionIcon()}
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-2">
                <button
                  onClick={() => setShowKeyHelp(!showKeyHelp)}
                  className="font-helvetica font-normal text-[14px] leading-5 text-[#77818A] hover:text-gray-600 underline cursor-pointer flex items-center gap-1"
                >
                  Where i can find encryption key?
                  <ChevronGreyIcon/>
                </button>

                {showKeyHelp && (
                  <div className="mt-2 font-helvetica text-[14px] leading-[20px] text-[#77818A] font-normal">
                    Just open your account settings on dDocs (at top right corner)
                    and download a backup key as .JSON file.
                  </div>
                )}
              </div>
              <button
                className={`p-4 mt-4 w-full rounded font-helvetica font-medium text-[14px] leading-[20px] cursor-pointer
                  ${file && uploadState === 'uploaded'
                    ? "bg-[#FFDF0A] text-black hover:bg-[#EFC703]"
                    : "bg-[#E8EBEC] text-[#A1AAB1]"
                }`}
                disabled={!file || uploadState !== 'uploaded'}
                onClick={handleRetrieveClick}
              >
                Retrieve documents
              </button>
            </div>
          </div>
        </div>
  );
};

export { UploadSection };
