import React, { useEffect } from "react";
import {
  Container,
  Box,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";
import { ChatState } from "../context/chatProvider";
import Login from "../components/Authentation/Login";
import SignUp from "../components/Authentation/SignUp";


const HomePage = () => {
  const {user} = ChatState()
  const navigate = useNavigate()
  useEffect(() => {
    if (user) {
      navigate("/chats")
    }
    
  },[user,navigate])
  return (
    <Container maxW="xl"centerContent>
      <Box
        display={"flex"}
        justifyContent="center"
        bg={"white"}
        w="100%"
        p={1}
        margin={"10px 0 15px 0"}
        borderRadius="5px"
        borderWidth={"1px"}
      >
        <Text  fontFamily="Work sans" fontSize="4xl">
          Hello Chat App
        </Text>
      </Box>
      <Box
        bg="white"
        w={"100%"}
        p={4}
        
        borderRadius="5px"
        borderWidth={"1px"}
      >
        <Tabs variant="soft-rounded" colorScheme="pink">
          <TabList>
            <Tab width={"50%"}>Login</Tab>
            <Tab width={"50%"}>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <SignUp/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;
