import React, { useState, useContext } from 'react';
import axios from 'axios';
import { ViewIcon, EditIcon,InfoIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  IconButton,
  Text,
  Input,
  Box
} from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/avatar";
import ChatContext from '../../Context/chat-context';

const ProfileModal = ({ users, children }) => {
  const { updateUser, user } = useContext(ChatContext);
  const [profilePicture, setProfilePicture] = useState(users?.image || '');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleProfilePictureChange = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('email', users.email); // Use email to identify the user

    try {
      const response = await axios.post('http://localhost:5000/api/user/updateDisplayPicture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const updatedUser = { ...users, image: response.data.data.image };
      setProfilePicture(updatedUser.image);

      if (user.email === users.email) {
        updateUser(updatedUser);
      }
    } catch (error) {
      console.error('Error uploading the profile picture', error);
    }
  };

  return (
    <React.Fragment>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton d={{ base: "flex" }} icon={<InfoIcon color="black" w={6} h={6} />} onClick={onOpen} />
      )}
      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent h="auto" w="70%" maxW="500px" bg="white" color="black">
          <ModalHeader
            fontSize="37px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
            fontWeight="bold"
          >
            {users?.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            d="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <Avatar 
              size="2xl" 
              name={users?.name} 
              src={profilePicture} 
              borderColor="black" 
              borderWidth="2px" 
              bg="yellow.400" 
              color="black"
            />

            {user.email === users.email && (
              <Box mt={4} d="flex" alignItems="center">
                <Button 
                  leftIcon={<EditIcon />} 
                  onClick={() => document.getElementById('fileInput').click()} 
                  colorScheme="teal" 
                  variant="solid"
                >
                  Upload
                </Button>
                <Input 
                  id="fileInput" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleProfilePictureChange} 
                  style={{ display: 'none' }} 
                />
              </Box>
            )}
            <Text
              fontSize={{ base: "17px", md: "17px" }} 
              fontWeight="bold" 
              fontFamily="Work sans"
              mt={4}
            >
              Email: {users?.email}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} colorScheme='red'>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </React.Fragment>
  );
};

export default ProfileModal;