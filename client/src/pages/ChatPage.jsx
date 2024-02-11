import React from "react";
import { ChatState } from "../context/chatProvider";
import SideBar from "../mainComponents/SideBar";

import { Box } from "@chakra-ui/react";
import MyChats from "../components/UserAvatar/MyChats";
import ChatBox from "../components/UserAvatar/ChatBox";

const ChatPage = () => {
  const { user } = ChatState();
  return (
    <div style={{ width: "100%" }}>
      {user && <SideBar />}
      <Box
        style={{
          width: "100%",
          height: "91.5vh",
          display: "flex",
          justifyContent: "space-between",
          padding: "10px",
        }}
      >
        {user && <MyChats />}
        {user && <ChatBox />}
      </Box>
    </div>
  );
};

export default ChatPage;
