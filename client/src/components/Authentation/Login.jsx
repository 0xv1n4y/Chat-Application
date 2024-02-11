import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { ChatState } from "../../context/chatProvider";

const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const updateShow = () => {
    setShow(!show);
  };
  const { setUser } = ChatState();
  const submitHandler = async () => {
    
    if (!email || !password) {
      setLoading(true);
      toast({
        title: "Please Fill all the Feilds",
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
        headers: { "Content-Type": "application/json" },
      };
      const { data } = await axios.post(
        "http://localhost:4000/api/user/login",
        { email, password },
        config
      );
      setUser(data)
      localStorage.setItem("userInfo", JSON.stringify(data))
      setLoading(false);
      toast({
        title: `Login Successful ${email}`,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      setLoading(false);
    }
  };
  return (
    <VStack>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={updateShow}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        width="100%"
        colorScheme="blue"
        marginTop={"10px"}
        onClick={submitHandler}
        isLoading={loading}
      >
        Login
      </Button>
      <Button
        width="100%"
        colorScheme="red"
        marginTop={"10px"}
        onClick={() => {
          setEmail("guest@gmail.com");
          setPassword("Guest@4511");
        }}
      >
        Get user Credintails
      </Button>
    </VStack>
  );
};

export default Login;
