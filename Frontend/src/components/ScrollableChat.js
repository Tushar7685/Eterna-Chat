import React, { useContext, useRef, useEffect } from 'react';
import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import ChatContext from "../Context/chat-context";

const ScrollableChat = ({ messages }) => {
  const chatRef = useRef(null);
  const { user } = useContext(ChatContext);

  useEffect(() => {
    // Scroll to the bottom of the chat when messages change
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  return (
    <div
      ref={chatRef}
      style={{ overflowY: 'scroll', maxHeight: '67vh' }} // Adjust height as needed
    >
      {messages &&
        messages.map((message, i) => (
          <div style={{ display: "flex" }} key={message._id}>
            {(isSameSender(messages, message, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={message.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={message.sender.name}
                  src={message.sender.image}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  message.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(messages, message, i, user._id),
                marginTop: isSameUser(messages, message, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "60%",
              }}
            >
              {message.content}
            </span>
          </div>
        ))}
    </div>
  );
};

export default ScrollableChat;
