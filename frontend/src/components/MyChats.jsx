import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import { Avatar, Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import { getApiHandler } from "../apiHandler/apiHandler";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { getSender } from "../utils/utils";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const toast = useToast();
  const fetchChats = async () => {
    const resp = await getApiHandler("/chat");
    if (resp.status === 200) {
      setChats(resp.data);
    } else {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("user")));
    fetchChats();
  }, [fetchAgain]);
  return (
    <Box
      display={{
        base: Object.keys(selectedChat).length ? "none" : "flex",
        md: "flex",
      }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
          >
            <i class="bi bi-plus-lg"></i> New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats.length ? (
          <Stack>
            {chats?.map((chat) => (
              <Box
                onClick={() => {
                  setSelectedChat(chat);
                }}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2Ac" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
                display="flex"
                alignItems="center"
              >
                <Avatar
                  size="sm"
                  // mt={1}
                  me={1}
                  cursor="pointer"
                  name={
                    chat.isGroupChat
                      ? chat.chatName
                      : getSender("name", loggedUser, chat.users)
                  }
                  borderWidth={2}
                  borderColor="black"
                  src={
                    !chat.isGroupChat &&
                    getSender("image", loggedUser, chat.users)
                  }
                />
                <Box display="flex" flexDirection="column">
                  <Text my="auto">
                    {chat.isGroupChat
                      ? chat.chatName
                      : getSender("name", loggedUser, chat.users)}
                  </Text>
                  {chat.latestMessage && (
                    <Text fontSize="xs" my="auto">
                      <b>{chat.latestMessage.sender.name} :</b>
                      {chat.latestMessage.content.length > 50
                        ? chat.latestMessage.content.substring(0, 51) + "..."
                        : chat.latestMessage.content}
                    </Text>
                  )}
                </Box>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
