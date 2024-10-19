import React, { useState, useRef } from 'react';
import AI_Icon from './ai_icon.svg';
import Modal from './Modal';

interface Message {
  text: string;
  type: 'user' | 'response';
}

const MessageInput: React.FC = () => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [command, setCommand] = useState<string>(''); 
  const [generatedResponse, setGeneratedResponse] = useState<string | null>(null); // State for generated response
  const [messages, setMessages] = useState<Message[]>([]); // Messages state to store user and AI messages
  const messageInputRef = useRef<HTMLTextAreaElement | null>(null);
  const handleFocus = () => setIsFocused(true);

  const handleIconClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  // Insert response into textarea
  const handleInsert = () => {
    if (messageInputRef.current && generatedResponse) {
      messageInputRef.current.value = generatedResponse; 
      setGeneratedResponse(null); 
      setIsModalOpen(false); 
    }
  };

  // Handle generating dummy response
  const handleGenerate = () => {
    if (command.trim() !== '') {
      const userMessage = command;  
      const dummyResponse = "Thank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask.";
  
      // Set both the user message and dummy response with a timeout for the response
      setMessages([...messages, { text: userMessage, type: 'user' }]); 
  
      setTimeout(() => {
        setMessages(prevMessages => [
          ...prevMessages,
          { text: dummyResponse, type: 'response' }  
        ]);
        setGeneratedResponse(dummyResponse); 
      }, 1000);
  
      setCommand('');  
    }
  };  

  const closeModal = () => {
    setIsModalOpen(false);
    setCommand(''); 
    setGeneratedResponse(null); 
  };

  return (
    <div className="relative mt-10 items-center justify-center flex">
      
      <div className="relative w-1/2">
        <textarea
          ref={messageInputRef}
          onFocus={handleFocus}
          className="w-full p-2 pr-10 border border-gray-300 rounded"
          placeholder="Type a message..."
        />

        {/* AI Icon shows up when the textarea is focused */}
        {isFocused && (
          <div className="absolute right-2 bottom-4 cursor-pointer" onClick={handleIconClick}>
            <img src={AI_Icon} alt="AI Icon" />
          </div>
        )}
      </div>

      {/* Modal component */}
      {isModalOpen && (
        <Modal
          isModalOpen={isModalOpen}
          command={command}
          setCommand={setCommand}
          handleInsert={handleInsert}
          handleGenerate={handleGenerate}
          closeModal={closeModal}
          generatedResponse={generatedResponse} 
        />
      )}
    </div>
  );
};

export default MessageInput;
