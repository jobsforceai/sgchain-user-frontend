'use client';

import React from 'react';
import SGCButton from './SGCButton';
import SGCCard from './SGCCard';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
      <SGCCard title={title} className="w-full max-w-md">
        <div className="mb-6">{children}</div>
        {footer ? (
          <div className="flex justify-end gap-4">
            {footer}
          </div>
        ) : onConfirm ? (
          <div className="flex justify-end gap-4">
            <SGCButton onClick={onClose} className="bg-gray-300 hover:bg-gray-400">
              Cancel
            </SGCButton>
            <SGCButton onClick={onConfirm} className="bg-red-500 hover:bg-red-600">
              Confirm
            </SGCButton>
          </div>
        ) : null}
      </SGCCard>
    </div>
  );
};

export default Modal;
