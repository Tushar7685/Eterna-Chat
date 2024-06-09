import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Text,
  IconButton,
  Spinner,
  useToast,
  Input,
  FormControl,
} from "@chakra-ui/react";
import {center, ArrowBackIcon } from "@chakra-ui/icons";
import axios from "axios";
import io from "socket.io-client";
import animationData from "../animations/typing.json";
import ProfileModal from "./miscellaneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import ChatContext from "../Context/chat-context";
import { getSender, getSenderFull } from "../config/ChatLogics";
import "./TypingIndicator.css";


const ENDPOINT = "http://localhost:5000"; // Development

let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);

  const toast = useToast();

  const {
    selectedChat,
    setSelectedChat,
    user,
    notification,
    setNotification,
  } = useContext(ChatContext);

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      setLoading(true);

      const { data } = await axios.get(
        `http://localhost:5000/api/message/${selectedChat._id}`,
        config
      );

      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to load the messages",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);

      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        setNewMessage("");

        const { data } = await axios.post(
          "http://localhost:5000/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );

        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occurred!",
          description: "Failed to send the message",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    return () => {
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;

  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  let lastTypingTimeout; 
  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    console.log("Typing...");
  
    if (!socketConnected) return;
  
    // Clear any existing timeout before setting a new one
    clearTimeout(lastTypingTimeout);
  
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
      console.log("Emitting typing event...");
    }
  
    const lastTypingTime = new Date().getTime();
    const timerLength = 3000;
  
    // Define a separate function for timeout logic
    const handleTypingTimeout = () => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
        console.log("Emitting stop typing event...");
      }
    };
  
    // Set a new timeout using a variable to store it
    lastTypingTimeout = setTimeout(handleTypingTimeout, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
            color="white"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon w={6} h={6} style={{ color: 'black' }} />}
              onClick={() => setSelectedChat("")}
            />
            {messages && !selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal
                  users={getSenderFull(user, selectedChat.users)}
                />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            p={3}
            bg="#2D3748"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
            border="2px solid white"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
              {istyping && (
                <div className="typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              )}
              <Input
                variant="filled"
                bg="#4A5568"
                placeholder="Enter a message..."
                value={newMessage}
                onChange={typingHandler}
                color="white"
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          height="100%"
          width="100%"
          gap="1rem"
        >
          <img src="bgchat.png" style={{ width: '100%', height: 'auto', marginBottom: '-6rem', minWidth:"300px" }} alt="Background Image"></img>
          <Text  fontSize="max(1.5vw,1.3rem)"  pb={2} textAlign="center" fontFamily="Work sans" color="white" mt="-4">
          Welcome to the EternaChat!<br></br> Click a user or find friends to connect with.  </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
