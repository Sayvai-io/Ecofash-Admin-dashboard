import React from 'react';

type ModalProps = {
    message: string;
    onClose: () => void;
};

const Modal: React.FC<ModalProps> = ({ message, onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-4 shadow-lg">
                <p>{message}</p>
                <button onClick={onClose} className="mt-4 bg-blue-500 text-white rounded px-4 py-2">
                    Close
                </button>
            </div>
        </div>
    );
};

export default Modal;