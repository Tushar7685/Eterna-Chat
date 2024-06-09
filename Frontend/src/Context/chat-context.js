// Context/chat-context.js
import React, { createContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

const ChatContext = createContext();

const SOCKET_SERVER_URL = "http://localhost:5000";

export const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [typingIndicator, setTypingIndicator] = useState(null);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    newSocket.on('message received', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    newSocket.on('typing', (typingUser) => {
      setTypingIndicator(typingUser);
    });

    newSocket.on('stop typing', () => {
      setTypingIndicator(null);
    });

    return () => newSocket.close();
  }, []);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        typingIndicator,
        setTypingIndicator,
        messages,
        setMessages,
        socket,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
