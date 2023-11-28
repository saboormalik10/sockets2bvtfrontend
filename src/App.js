import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000', {});

function App() {
  const [socketId, setSocketId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userId, setuserId] = useState('');
  const [receiverId, setreceiverId] = useState('');
  let hasMounted = false; // useRef to track if the component has mounted

  useEffect(() => {
    // The effect to run on mount
    if(!hasMounted){

      socket.on('connect', () => {
        setSocketId(socket.id);
        console.log('My socket ID:', socket.id);
  
        // Emit the 'create_connection' event with userId and socketId
        socket.emit('create_connection', {
          userId:"6501c190f624d7bca6b54a28",
          socketId: socket.id,
        });
  
        // Set up other event listeners here if needed
      });
  
      // Listen for the 'message' event
      socket.on('message', (data) => {
        console.log({ data });
        let message = { content: data.message, sender: data.sender }
        console.log({ message })
        setMessages((prevMessages) => [...prevMessages, message]);
      });
  
      // Mark the component as mounted after the first render
      hasMounted = true;
    }

    return () => {
      // Cleanup or disconnect logic if needed
      // socket.disconnect();
    };
  }, []); // Empty dependency array to run only once on mount

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      console.log({newMessage})
      // socket.emit('message', {
      //   content: newMessage,
      //   sender: userId,
      //   receiver:receiverId
      // });

      // THIS SHOULD BE HIT ON FRONTEND AFTER LOGIN OR SIGNUP
      socket.emit('create_connection', {
        userId,
        socketId:socketId
      });

      // socket.emit('disconnectEvent', {userId: '65298af75be1580e9c697fae'});

      // socket.disconnect();

      // messages.push({
      //   content: newMessage,
      //   sender: 'User',
      // })
      // setMessages(messages);
      setNewMessage('');
    }
  };

  return (
    <div className="App">
      <div className="message-container">
        {messages.map((message, index) => (
          <div key={index} className="message">
            <strong>{message.sender}:</strong> {message.content}
          </div>
        ))}
      </div>
      <div className="input-container">
      <input
          type="text"
          value={userId}
          onChange={(e) => setuserId(e.target.value)}
          placeholder="Enter your userid..."
        />
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Enter your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
