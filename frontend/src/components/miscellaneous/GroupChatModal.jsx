import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import { getApiHandler, postApiHandler } from "../../apiHandler/apiHandler";
import UserListItem from "../UserAvatar/UserListItem";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";

const GroupChatModal = ({ children }) => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const { user, chats, setChats } = ChatState();

  const handleSearch = async (query) => {
    if (!query) {
      return;
    }
    setLoading(true);

    const resp = await getApiHandler(`/user?search=${query}`);
    if (resp.status === 200) {
      setSearchResult(resp.data);
    } else {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the search results",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    }
    setLoading(false);
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDelete = (userToDelete) => {
    setSelectedUsers(
      selectedUsers.filter((user) => user._id !== userToDelete._id)
    );
  };

  const handleSubmit = async () => {
    if (!groupName || !selectedUsers.length) {
      toast({
        title: "Please fill all the feilds",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    const resp = await postApiHandler("/chat/create-group", {
      chatName: groupName,
      users: selectedUsers.map((u) => u._id),
    });
    if (resp.status === 200) {
      setChats([resp.data, ...chats]);
      onClose();
      toast({
        title: "New group chat created.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    } else {
      toast({
        title: "Failed to create the chat!",
        description: resp.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setSearchResult([]);
      setSelectedUsers([]);
      setGroupName("");
    }
  }, [isOpen]);

  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users eg: John, Sajal, Shivam"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box w="100%" display="flex" flexWrap="wrap">
              {selectedUsers.map((user) => (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleDelete(user)}
                />
              ))}
            </Box>
            {loading ? (
              <div>Loading...</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
