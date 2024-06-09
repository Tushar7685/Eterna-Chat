import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ChatContext from "../../Context/chat-context";
import ProfileModal from "./ProfileModal";
import { useDisclosure } from "@chakra-ui/hooks";
import { Box, Text } from "@chakra-ui/layout";
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/menu";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import { Button } from "@chakra-ui/button";
import { Tooltip } from "@chakra-ui/tooltip";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import axios from "axios";
import { useToast } from "@chakra-ui/toast";
import { Input, Spinner } from "@chakra-ui/react";
import ChatLoading from "../ChatLoading";
import UserListItem from "../userAvatar/UserListItem";
import { getSender } from "../../config/ChatLogics";
import "./NotificationBadge.css"; // Import the CSS file for badge styling


const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const { user, setSelectedChat, chats, setChats, notification, setNotification } = useContext(ChatContext);

  const navigate = useNavigate();
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const logoutHandler = () => {
    localStorage.removeItem("userInformation");
    navigate("/");
  };

  const handleSearch = async() => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: { Authorization: `Bearer ${user.token}`}
      };

      const { data } = await axios.get(`http://localhost:5000/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);

    } catch (error) {

      console.log(error.message);
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChatCreateChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`http://localhost:5000/api/chat`, { userId }, config);

      if (!chats.find((chat) => chat._id === data._id)) setChats([data, ...chats]); 
      setSelectedChat(data);

      setLoadingChat(false);
      onClose();
    } catch (error) {
      console.log(error.message);
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <React.Fragment>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        padding="10px"
        borderWidth="2px"
        bg="gray.900"
        color="white"
        height="3.5rem"
        width="98%"
        margin="5px auto"
        borderRadius="15px"
      >
         <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src="logo.png"
            style={{ width: '6rem', marginRight: '-10px', marginTop: "1rem", cursor: "pointer" }}
            onClick={() => window.location.reload()}
          />
          <Text
            fontSize="2xl"
            fontWeight="bold"
            display={{ base: "none", md: "block" }}
            style={{ cursor: "pointer" }}
            onClick={() => window.location.reload()}
          >
            EternaChat
          </Text>
        </div>
        
  
        <div>
          <Tooltip label="Search Users to chat" hasArrow>
            <Button
              variant="ghost"
              bg="transparent"
              color="white"
              onClick={onOpen}
              _hover={{ background: "#9d64ff" }}
              _active={{ background: "#9d64ff" }}
            >
              <i className="fas fa-search"></i>
              <Text display={{ base: "none", md: "inline" }} px={2} fontWeight="bold">
                Find Friends
              </Text>
            </Button>
          </Tooltip>
          <Menu>
            <MenuButton p={1} className="badge-container">
              <BellIcon fontSize="2xl" m={1} color="white"/>
              {notification.length > 0 && ( // Display the badge if there are notifications
                <span className="badge">{notification.length}</span> // Define badge CSS in NotificationBadge.css
              )}
            </MenuButton>
            <MenuList pl={2}>
              {notification.length === 0 ? (
                <MenuItem color="black">No New Messages</MenuItem>
              ) : (
                notification.map((notif) => (
                  <MenuItem
                    key={notif._id}
                    onClick={() => {
                      setSelectedChat(notif.chat);
                      setNotification(notification.filter((n) => n !== notif));
                    }}
                    color="black"
                  >
                    {notif.chat.isGroupChat
                      ? `New Message in ${notif.chat.chatName}`
                      : `New Message from ${getSender(user, notif.chat.users)}`}
                  </MenuItem>
                ))
              )}
            </MenuList>
          </Menu>
          <Menu>
          <MenuButton
    as={Button}
    bg="transparent"
    rightIcon={<ChevronDownIcon />}
    _hover={{ background: "transparent" }}
    _active={{ background: "transparent" }}
  >
    {user.image ? (
      <Avatar
        size="sm"
        cursor="pointer"
        name={user.name}
        src={user.image}
        borderColor="white"
        borderWidth="2px"
      />
    ) : (
      <Avatar
        size="sm"
        cursor="pointer"
        name={user.name}
        borderColor="white"
        borderWidth="2px"
      />
    )}
  </MenuButton>
            <MenuList  bg="gray.800" borderColor="white" borderWidth="1px" marginTop="5px">
              <ProfileModal users={user}>
                <MenuItem className="my-profile-button" fontWeight="bold" color="white" bg="transparent" _hover={{ background: "transparent" }}>
                  My Profile
                </MenuItem>{" "}
              </ProfileModal>
              <MenuDivider />
              <MenuItem fontWeight="bold" color="white"
                onClick={logoutHandler}
                _hover={{  background: "transparent" }}
              >
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent bg="gray.900" color="white">
          <DrawerHeader borderBottomWidth="1px">Find Friends</DrawerHeader>
          <DrawerBody>
            <Box d="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  handleSearch();
                }}
                color="white"
              />
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChatCreateChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </React.Fragment>
  );
  
};

export default SideDrawer;
