import React, { useRef, useEffect, useState } from 'react';

interface ModalProps {
  isModalOpen: boolean;
  command: string;
  setCommand: React.Dispatch<React.SetStateAction<string>>;
  handleInsert: () => void;
  handleGenerate: () => void;
  closeModal: () => void;
  generatedResponse: string | null;
}

const Modal: React.FC<ModalProps> = ({
  isModalOpen,
  command,
  setCommand,
  handleInsert,
  handleGenerate,
  closeModal,
  generatedResponse, 
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // State for messages (user + system)
  const [messages, setMessages] = useState<{ text: string, type: 'user' | 'response' }[]>([]);

  // Close modal on outside click or escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeModal();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [closeModal]);

  // Focus input when modal is opened
  useEffect(() => {
    if (isModalOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isModalOpen]);

  // Handle generating a message
  const handleGenerateClick = () => {
    if (command.trim()) {
      setMessages([...messages, { text: command, type: 'user' }]);
      setCommand('');
      handleGenerate();
    }
  };

  // Add system-generated response when available
  useEffect(() => {
    if (generatedResponse) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: generatedResponse, type: 'response' }
      ]);
    }
  }, [generatedResponse]);

  return isModalOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">

      <div
        className="bg-white p-4 rounded-2xl shadow-lg w-1/2 transform transition-all duration-300"
        ref={modalRef}
      >
        <div className="p-2 rounded mb-4 overflow-auto" style={{ maxHeight: '300px' }}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message mb-2 ${message.type === 'user' ? 'user-message' : 'response-message'}`}
            >
              <div className={`inline-block p-2 w-2/3 rounded-lg ${message.type === 'user' ? 'bg-gray-200 float-end' : 'bg-blue-100 mt-2'}`}>
                {message.text}
              </div>
            </div>
          ))}
        </div>

        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="Your prompt"
          ref={inputRef}
        />

        <div className="flex justify-end mt-4">

          <button
            onClick={handleInsert}
            className={`border-2 border-gray-500 text-gray-500 font-medium p-2 rounded-lg mx-2 ${generatedResponse ? '' : 'hidden'}`}
          >
            Insert
          </button>

          <button
            onClick={handleGenerateClick}
            className={`bg-blue-500 font-medium text-white p-2 rounded-lg mx-2 ${generatedResponse ? 'hidden' : ''}`}
          >
            Generate
          </button>

          <button
            className={`font-medium text-white p-2 rounded-lg mx-2 ${generatedResponse ? 'bg-blue-500' : 'hidden'}`}
          >
            Regenerate
          </button>

        </div>
      </div>
    </div>
  ) : null;
};

export default Modal;
