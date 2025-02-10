import * as React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(({ isOpen, onClose, children }, ref) => {
  console.log("Modal isOpen:", isOpen); // Debugging line
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg w-full max-w-md p-6" ref={ref}>
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <span className="text-xl">&times;</span>
        </button>
        {children}
      </div>
    </div>
  );
});

Modal.displayName = "Modal";

export { Modal };
