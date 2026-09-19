import React from 'react';

interface ToastProps {
  message: string | null;
  icon?: string;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, icon = 'info', onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#161c28] border border-[#00f0ff]/50 shadow-[0_0_20px_rgba(0,240,255,0.25)] text-[#dde2f3] font-mono text-xs animate-in fade-in slide-in-from-bottom-2 duration-200">
      <span className="material-symbols-outlined text-[18px] text-[#00f0ff]">{icon}</span>
      <span className="font-sans font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-[#849495] hover:text-[#dde2f3] cursor-pointer"
      >
        <span className="material-symbols-outlined text-[14px]">close</span>
      </button>
    </div>
  );
};
