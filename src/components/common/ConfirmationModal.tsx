import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDangerous?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  isDangerous = true,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-[#E3E3E0] rounded-sm max-w-md w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-xs ${
                isDangerous
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : 'bg-[#E8F6FA] text-[#0879A3] border border-[#1098C7]/30'
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-[#302B2B]">{title}</h3>
          </div>
          <button
            onClick={onCancel}
            className="text-[#747474] hover:text-[#302B2B] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-[#454141] leading-relaxed">{message}</p>

        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xs bg-[#F7F7F4] hover:bg-[#E3E3E0] border border-[#E3E3E0] text-[#454141] text-xs font-semibold transition-colors cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 rounded-xs text-xs font-bold transition-all cursor-pointer ${
              isDangerous
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs'
                : 'bg-[#1098C7] hover:bg-[#0879A3] text-white shadow-xs'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
