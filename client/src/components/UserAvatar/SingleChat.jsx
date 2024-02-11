import React, { useEffect } from "react";
import { ChatState } from "../../context/chatProvider";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderAll } from "../../config/ChatLogic";
import ProfileModal from "../../mainComponents/ProfileModal";
import UpdateUser from "./UpdateUser";
import { useState } from "react";
import axios from "axios";
import "./Styles.css";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import Lottie from "lottie-react";
import animationData from "../../animations/typing.json";

//For Socket Connection

const ENDPOINT = "http://localhost:4000";
var socket, selecteChatCompare;

const SingleChat = ({}) => {
  const {
    user,
    fetchAgain,
    setFetchAgain,
    selectedChat,
    setSelectedChat,
    notfication,
    setNotfication,
  } = ChatState();
  const toast = useToast();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);



  const fetchMessages = async () => {
    if (!selectedChat) return;
    setLoading(true);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:4000/api/message/allmessages/${selectedChat._id}`,
        config
      );

      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Faied To fetch Message",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const sendMessage = async (event) => {
    if (event.key == "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);

      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "http://localhost:4000/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );

        socket.emit("new message", data);
        setMessages([...messages, data]);

        //Append the Current message into messages Array
      } catch (error) {
        toast({
          title: "Faied To send Message",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
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
  }, []);

  useEffect(() => {
    fetchMessages();
    selecteChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message Recived", (newmessageRecived) => {
      if (
        !selecteChatCompare ||
        selecteChatCompare._id !== newmessageRecived.chat._id
      ) {
        //Message Notfication

        if (!notfication.includes(newmessageRecived)) {
        setNotfication([newmessageRecived,...notfication])
      }
      } else {
        setMessages([...messages, newmessageRecived]);
      }
    });
  });

  console.log(notfication)

  
  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    var lastTypingTime = new Date().getTime();
    var timeLimit = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timeLimit && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timeLimit);
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
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderAll(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName}
                <UpdateUser fetchMessages={fetchMessages} />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            pb={3}
            backgroundColor="#E8E8E8"
            height="100%"
            width="100%"
            overflowY="hidden"
            borderRadius="1g"
          >
            {loading ? (
              <Spinner
                size="xl"
                color="red"
                alignSelf="center"
                w={20}
                height={20}
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl isRequired onKeyDown={sendMessage} mt={3}>
              {isTyping ? (
                <div>
                  <Lottie animationData={animationData} style={{height:"70px", width:"70px"}} />
                </div>
              ) : (
                <></>
              )}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a Message"
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize={"3xl"} fontFamily="Work sans" pb={3}>
            Click On a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
