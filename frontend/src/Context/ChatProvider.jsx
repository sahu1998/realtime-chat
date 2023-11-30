import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation,  } from "react-router-dom";
export const ChatContext = createContext();
const ChatProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [selectedChat, setSelectedChat] = useState({});
  const [chats, setChats] = useState([]);
  const [notification, setNotification] = useState([]);
  const location = useLocation();
  const history = useNavigate();
  useEffect(() => {
    const userInfo = localStorage.getItem("user");
    if (!userInfo && location.pathname !== "/signup") {
      history("/login");
    } else {
      setUser(JSON.parse(userInfo));
    }
  }, [history]);
  return (
    <ChatContext.Provider
      value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats, notification, setNotification }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => useContext(ChatContext);

export default ChatProvider;
