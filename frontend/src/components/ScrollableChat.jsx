import React, { useEffect, useRef } from "react";
import ScrollableFeed from "react-scrollable-feed";
import { ChatState } from "../Context/ChatProvider";
import { Avatar, Tooltip } from "@chakra-ui/react";
import {
  getTime,
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../utils/utils";
const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  const messageAreaRef = useRef();
  console.log({ messages });
  
  useEffect(() => {
    messageAreaRef.current.scrollTo(0, messageAreaRef.current.scrollHeight);
  }, [messages]);
  return (
    <div className="message__area" ref={messageAreaRef}>
      {messages &&
        messages.map((m, i) => (
          <div className="d-flex" key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.image}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                // marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                marginTop: 3,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                // lineHeight: 2,
              }}
            >
              {m.content}
              {/* <br /> */}
              <div style={{ fontSize: "10px" }} className="text-end">{getTime(m.createdAt)}</div>
            </span>
          </div>
        ))}
    </div>
  );
};

export default ScrollableChat;
