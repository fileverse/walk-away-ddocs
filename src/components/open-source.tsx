import React from 'react'
import { ExternalLinkIcon } from '../assets/icons'

const OpenSource = () => {
  return (
    <div className="min-h-[12rem] h-auto sm:h-48 p-3 sm:p-4 bg-[#fff9ce] rounded-lg flex-col justify-start items-start gap-2 sm:gap-3 inline-flex">
      <div className="self-stretch text-[#363b3f] text-lg sm:text-xl font-bold leading-6 sm:leading-7">
        Open source
      </div>
      <div className="self-stretch text-[#363b3f] text-sm sm:text-base font-normal font-['Helvetica Neue'] leading-normal">
        Don't trust, verify! This static page is open-source, meaning that you
        can check the code, modify it, and even host this page on your own. We
        recommend downloading the page and self-hosting it if you want a
        complete self-sovereign experience with increased privacy and
        censorship-resistance.
      </div>
      <div className="relative group"></div>
      <div className="px-4 py-2 bg-black/50 align-center rounded justify-center items-center gap-3 inline-flex cursor-not-allowed">
        <div className="text-white/50 flex items-center gap-2 text-sm font-medium  leading-tight">
          View code on Github
        </div>
        <ExternalLinkIcon />
      </div>

      {/* Custom Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        Coming very soon
        {/* Tooltip Arrow */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  )
}

export { OpenSource }
