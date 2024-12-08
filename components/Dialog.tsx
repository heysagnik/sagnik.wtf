// components/DialogContent.tsx
import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { VisuallyHidden } from '@radix-ui/themes';

interface DialogContentProps {
  title: string;
  imgSrc: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

const DialogContent: React.FC<DialogContentProps> = ({ title, imgSrc, alt, isOpen, onClose }) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white shadow-[0_0_32px_rgba(0,0,0,0.25)] focus:outline-none data-[state=open]:animate-contentShow">
          <div className="max-h-[85vh] w-[80vw] max-w-[400px] overflow-auto p-6">
            <VisuallyHidden>
            <Dialog.Title className="text-xl font-medium mb-4 text-center font-handwriting">
              {title}
            </Dialog.Title>
            </VisuallyHidden>
            
            {/* Polaroid Effect Container */}
            <div className="relative overflow-hidden mb-4">
              <img 
                src={imgSrc} 
                alt={alt}
                className="object-cover w-full rounded-sm shadow-inner"
              />
            </div>
            {/* Polaroid Caption */}
            <p className="text-center text-gray-600 font-handwriting text-sm mt-2">
              {title}
            </p>

            <Dialog.Close asChild>
              <button
                className="absolute top-2 right-2 inline-flex h-6 w-6 items-center justify-center rounded-full hover:bg-gray-100 focus:outline-none"
                aria-label="Close"
              >
                <Cross2Icon />
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default DialogContent;
