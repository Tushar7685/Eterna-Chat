import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatContext from "./chat-context";

const ChatProvider = (props) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [notification, setNotification] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const userInformation = JSON.parse(localStorage.getItem("userInformation"));
    setUser(userInformation);

    if (!userInformation) navigate("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("userInformation", JSON.stringify(updatedUser)); // Optional: Update local storage
  };

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notification,
        setNotification,
        updateUser, // Include updateUser in the context value
      }}
    >
      {props.children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
