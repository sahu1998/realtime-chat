import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import {
  Avatar,
  Box,
  FormControl,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import ProfileModal from "./miscellaneous/ProfileModal";
import { getSender, getSenderFull } from "../utils/utils";
import ScrollableChat from "./ScrollableChat";
import { getApiHandler, postApiHandler } from "../apiHandler/apiHandler";
import io from "socket.io-client";
import EmojiPicker from "emoji-picker-react";
let socket, selectedChatCompare;
const serverUrl = "http://localhost:8000";
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const toast = useToast();

  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiKeyboard, setShowEmojiKeyboard] = useState(false);
  const fetchMessages = async () => {
    if (!Object.keys(selectedChat).length) return;

    setLoading(true);
    const resp = await getApiHandler(`/message/${selectedChat._id}`);
    console.log("fetch messages: ", resp);
    if (resp?.status === 200) {
      setMessages(resp.data);
    } else {
      toast({
        title: "Error Occured!",
        description: "Failed to load the messages",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
    setLoading(false);
    socket.emit("join chat", selectedChat._id);
  };
  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      // socket.emit("stop typing", selectedChat._id);
      setNewMessage("");
      const resp = await postApiHandler("/message", {
        content: newMessage,
        chatId: selectedChat,
      });
      console.log("send message: ", resp);
      if (resp.status === 200) {
        socket.emit("new message", resp.data);
        setMessages([...messages, resp.data]);
      } else {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };
  const typingHandler = () => {
    // setNewMessage(msg);
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  useEffect(() => {
    if (newMessage) {
    typingHandler();
    }
  }, [newMessage]);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket = io(serverUrl);
    socket.emit("setup", user);
    socket.on("connected", () => {
      setSocketConnected(true);
      console.log("client socket connected...");
    });
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });
  return (
    <>
      {Object.keys(selectedChat).length ? (
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
              icon={<i class="bi bi-arrow-left"></i>}
              onClick={() => setSelectedChat({})}
            />
            {selectedChat?.isGroupChat ? (
              <>{selectedChat.chatName.toUpperCase()}</>
            ) : (
              <>
                  {getSender("name", user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)}>
                  <Avatar
                    size="sm"
                    cursor="pointer"
                    name={getSender("name", user, selectedChat.users)}
                    src={getSender("image", user, selectedChat.users)}
                    my='auto'
                  />
                </ProfileModal>
                {/* <ProfileModal user={getSenderFull(user, selectedChat.users)} /> */}
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl onKeyDown={sendMessage} id="" isRequired mt={3}>
              {
                // isTyping && <div className="loader"></div>
              }
              <InputGroup>
                <InputLeftElement
                  cursor="pointer"
                  color={showEmojiKeyboard ? "blue" : "gray"}
                  onClick={(e) => setShowEmojiKeyboard(!showEmojiKeyboard)}
                >
                  <i class="bi bi-emoji-smile fs-5"></i>
                </InputLeftElement>
                <Input
                  variant="filled"
                  bg="#E0E0E0"
                  placeholder="Type a message"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onClick={(e) => setShowEmojiKeyboard(false)}
                />
                <InputRightElement
                  display={{ base: "flex", md: "none" }}
                  cursor="pointer"
                >
                  <i class="bi bi-send fs-5"></i>
                </InputRightElement>
              </InputGroup>
              {showEmojiKeyboard && (
                <EmojiPicker
                  width="100%"
                  height={300}
                  searchDisabled
                  onEmojiClick={(e) => setNewMessage((prev) => prev + e.emoji)}
                  previewConfig={{ showPreview: false }}
                />
              )}
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
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chat...
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
