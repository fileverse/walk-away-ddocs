import React, { useEffect } from 'react'

export function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: '#0000007A' }}
        onClick={onClose}
      />

      <div className="relative w-full max-w-xl rounded-xl bg-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E8EBEC] px-6 py-3">
          <h2 className="text-[16px] font-medium text-[#363B3F]">{title}</h2>

          <button
            onClick={onClose}
            className="cursor-pointer w-4 h-4 text-[14px] flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-6">{children}</div>
      </div>
    </div>
  )
}
