import React, { useContext } from 'react';
import { Box, useColorModeValue } from "@chakra-ui/react";
import SingleChat from "./SingleChat";
import ChatContext from '../Context/chat-context';

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = useContext(ChatContext);

  const chatBoxBg = useColorModeValue("gray.800", "gray.900");
  const borderColor = useColorModeValue("gray.600", "gray.700");

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg={chatBoxBg}
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      boxShadow="lg"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default Chatbox;
