import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import { getApiHandler, postApiHandler } from "../../apiHandler/apiHandler";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { getSender } from "../../utils/utils";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const { onClose, onOpen, isOpen } = useDisclosure();
  const notificationBadgeRef = useRef();
  const history = useNavigate();
  const toast = useToast();
  const {
    user,
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();

  const logoutHandler = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authorization")
    history("/login");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-left",
        variant: "subtle",
      });
      return;
    }
    setLoading(true);
    const resp = await getApiHandler(`/user?search=${search}`);
    console.log(resp);
    if (resp.status === 200) {
      setSearchResult(resp.data);
    } else {
      toast({
        title: "Error Occured",
        description: "Failed to load the Search results",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-left",
        variant: "subtle",
      });
    }
    setLoading(false);
    console.log("search resp: ", resp);
  };
  const accessChat = async (userId) => {
    setLoadingChat(true);
    const resp = await postApiHandler("/chat", { userId });
    if (resp.status === 200) {
      setSelectedChat(resp.data);
      if (!chats.find((ch) => ch._id === resp.data._id)) {
        setChats([resp.data, ...chats]);
      }
      onClose();
    } else {
      toast({
        title: "Error Occured",
        description: resp.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
        variant: "subtle",
      });
    }

    setLoadingChat(false);
  };

  useEffect(()=>{
    if(notification.length){
      notificationBadgeRef.current.setAttribute("data-badge", notification.length)
    }else{
      notificationBadgeRef.current.removeAttribute("data-badge")
    }
  }, [notification])
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "white",
          width: "100%",
          padding: "5px 10px",
          borderWidth: "5px",
        }}
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i class="bi bi-search"></i>
            <Text display={{ base: "none", sm: "flex" }} p="15px 4px 0 4px">
              Search User
            </Text>
          </Button>
        </Tooltip>

        <p className="fs-2 mb-0">Talk-A-Tive</p>
        <div className="">
          <Menu>
            <MenuButton p={1} className="badge1" ref={notificationBadgeRef}>
              <i class="bi bi-bell-fill fs-5 m-1"></i>
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length
                ? "No New Messages"
                : notification.map((notif) => (
                    <MenuItem
                      key={notif._id}
                      onClick={() => {
                        setSelectedChat(notif.chat);
                        setNotification(
                          notification.filter((n) => n !== notif)
                        );
                      }}
                    >
                      {notif.chat.isGroupChat
                        ? `New Message in ${notif.chat.chatName}`
                        : `New Message from ${getSender(
                            "name",
                            user,
                            notif.chat.users
                          )}`}
                    </MenuItem>
                  ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<i class="bi bi-chevron-down"></i>}
            >
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.image}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </div>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
