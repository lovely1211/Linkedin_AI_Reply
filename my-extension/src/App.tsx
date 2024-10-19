import React from 'react';
import './App.css';
import MessageInput from './component/MessageInput'; 

const App: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-center">LinkedIn AI Reply</h1>
      <MessageInput />
    </div>
  );
};

export default App;
