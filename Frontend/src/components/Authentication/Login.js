import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack, Box } from "@chakra-ui/layout";
import { useState } from "react";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Login = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const handleClick = () => setShow(!show);

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please Fill all the Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: { "Content-type": "application/json" },
      };

      const { data } = await axios.post(
        "http://localhost:5000/api/user/login",
        { email, password },
        config
      );

      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });

      localStorage.setItem("userInformation", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
  };
  const buttonStyle = {
    fontWeight: "bold",
    bgGradient: "linear-gradient(to right, #ec77ab 0%, #7873f5 100%);",
    width: "100%",
    
    _hover: {
      bgGradient: "linear-gradient(45deg, #93a5cf 0%, #e4efe9 100%)",
      transition: "background 0.3s ease",
      color: "black", // Change the text color to black on hover
      border: "none", // Remove the border on hover
    }
  };
  
  

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        maxHeight="50vh"
      >
        <Box
          bg="rgba(255, 255, 255, 0.1)"
          borderRadius="20px"
          boxShadow="lg"
          backdropFilter="blur(10px)"
          border="1px solid rgba(255, 255, 255, 0.3)"
          p={8}
          width="100%"
          maxW="400px"
        >
          <VStack spacing="6">
            <FormControl id="email" isRequired>
              <FormLabel color="white">Email Address</FormLabel>
              <Input
                value={email}
                type="email"
                placeholder="Enter Your Email Address"
                onChange={(e) => setEmail(e.target.value)}
                bg="rgba(255, 255, 255, 0.2)"
                color="white"
                _placeholder={{ color: "white" }}
                _focus={{ boxShadow: "outline" }}
                borderRadius="5px"
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel color="white">Password</FormLabel>
              <InputGroup size="md">
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={show ? "text" : "password"}
                  placeholder="Enter password"
                  bg="rgba(255, 255, 255, 0.2)"
                  color="white"
                  _placeholder={{ color: "white" }}
                  _focus={{ boxShadow: "outline" }}
                  borderRadius="5px"
                />
                <InputRightElement width="4.5rem">
                  <Button
                    colorScheme="teal"
                    h="1.75rem"
                    size="sm"
                    marginRight={2}

                    onClick={handleClick}
                    {...buttonStyle}
                  >
                    {show ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Button
              onClick={submitHandler}
              isLoading={loading}
              {...buttonStyle}
            >
              Login
            </Button>
            <Button
              onClick={() => {
                setEmail("guestuser@gmail.com");
                setPassword("guestuser");
              }}
              {...buttonStyle}
            >
              Guest User Login
            </Button>
          </VStack>
        </Box>
      </Box>
    </motion.div >
  );
};

export default Login;
