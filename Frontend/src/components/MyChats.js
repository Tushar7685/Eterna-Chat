import React, { useEffect, useContext } from 'react';
import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text, Heading, Divider, Avatar, Button, useColorModeValue, useColorMode, Image, useBreakpointValue } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import ChatContext from "../Context/chat-context";
import { getSender } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";

const MyChats = ({ fetchAgain }) => {
  const { selectedChat, setSelectedChat, user, chats, setChats } = useContext(ChatContext);
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();

  const fetchChats = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };
      const { data } = await axios.get("http://localhost:5000/api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to load the chats",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    fetchChats();
  }, [fetchAgain]);

  const chatBoxBg = useColorModeValue("gray.800", "gray.900");
  const chatBoxHoverBg = useColorModeValue("gray.700", "gray.700");
  const chatBoxActiveBg = useColorModeValue("teal.600", "teal.500");
  const chatBoxActiveColor = useColorModeValue("white", "gray.200");
  const textColor = useColorModeValue("white", "gray.300");
  const buttonBg = "#9d64ff";
  const buttonBg1 = "#c409bd";
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={4}
      bg={chatBoxBg}
      minWidth="fit-content"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
      boxShadow="lg"
    >
      <Box
        pb={3}
        px={3}
        display="flex"
        w="100%"
        gap="0.7rem"
        justifyContent="space-between"
        alignItems="center"

      >
        <Heading size="md" fontFamily="Work sans" color={textColor}>
          Messages
        </Heading>
        <GroupChatModal>
          <Button
            fontSize={{ base: "12px", md: "14px", lg: "17px" }}
            p={{ base: "10px", md: "12px", lg: "15px" }}
            rightIcon={<AddIcon />}
            bg={buttonBg1}
            color="white"
            _hover={{ bg: buttonBg1 }}
          >
            Create New Group
          </Button>
        </GroupChatModal>
      </Box>
      
      <Divider mb={4} borderColor="gray.600" />
      <Box
        display="flex"
        flexDir="column"
        bg={chatBoxBg}
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
        position="relative"
      >
        {chats && chats.length > 0 ? (
          <Stack overflowY="scroll" spacing={3}>
            {chats.map((chat) => (
              <Box
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? buttonBg : chatBoxHoverBg}
                color={selectedChat === chat ? chatBoxActiveColor : textColor}
                p={3}
                borderRadius="lg"
                boxShadow="md"
                _hover={{ bg: chatBoxHoverBg }}
              >
                <Stack direction="row" alignItems="center">
                  <Avatar
                    size="sm"
                    name={!chat.isGroupChat ? getSender(user, chat.users) : chat.chatName}
                    src={
                      chat.isGroupChat
                        ? "groupicon.png"
                        : chat.users &&
                          chat.users[0] &&
                          chat.users[0].email === user.email
                        ? chat.users[1] && chat.users[1].image
                        : chat.users[0] && chat.users[0].image
                    }
                  />
                  <Text ml={3} fontWeight="bold">
                    {!chat.isGroupChat ? getSender(user, chat.users) : chat.chatName}
                  </Text>
                </Stack>
                {/* Log chat.users */}
                {console.log("Chat Users:", chat.users)}
              </Box>
            ))}
          </Stack>
        ) : (
          isMobile && (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
              width="100%"
              height="100%"
              
                  
            >
              <Image
                src="bgchat.png"
                width="100%"
                height="auto"
                alt="Background Image"
                mb={-6}
          
                
              />
              <Text
                fontSize="ma(1vw,0.9rem)"
                textAlign="center"
                fontFamily="Work sans"
                color="white"
         
              >
                Welcome to the EternaChat!
                <br />
                Click a user or find friends to connect with.
              </Text>
            </Box>
          )
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
