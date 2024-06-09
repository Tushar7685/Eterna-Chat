import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Center,
} from "@chakra-ui/react";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userInformation = JSON.parse(localStorage.getItem("userInformation"));

    if (userInformation) navigate("/chats");
  }, [navigate]);

  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        alignItems="center"
        margin="0rem 0 0 0"
        paddingRight={8}
        w="100%"      
      >
        <img src="logo.png" style={{ width: '150px', height: '150px'}} />
        <Text
          color="white"
          fontSize="4xl"
          fontFamily="Work sans"
          fontWeight="bold"
          paddingBottom={7}
        >
          EternaChat
        </Text>
      </Box>
      <Box
        w="100%"
        p={1}
      >
        <Tabs isFitted variant="soft-rounded" colorScheme="teal" position="relative" top="-1.5rem">
          <TabList mb="1em">
            <Tab 
              fontWeight="bold" 
              sx={{ color: "white" }} 
              _selected={{ bg: "white", color: "black", border: "none", outline: "none" }} // Remove border and outline
            >
              Login
            </Tab>
            <Tab 
              fontWeight="bold" 
              sx={{ color: "white" }} 
              _selected={{ bg: "white", color: "black", border: "none", outline: "none" }} // Remove border and outline
            >
              Sign Up
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;
