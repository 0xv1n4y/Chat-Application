import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

const ChatStore = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState()
  const [chats, setChats] = useState([])
  const [fetchAgain, setFetchAgain] = useState(false)
  const [notfication, setNotfication] = useState([])
  const navigate = useNavigate();


  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
    if (!userInfo) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <ChatStore.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        fetchAgain,
        setFetchAgain,
        notfication,
        setNotfication,
      }}
    >
      {children}
    </ChatStore.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatStore);
};

export default ChatProvider;
