import { Badge, Tooltip } from "@chakra-ui/react";
import React from "react";

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    <Badge
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      colorScheme="yellow"
      cursor="pointer"
      onClick={handleFunction}
    >
      {user.name}
      {admin === user._id && <span>Admin</span>}
      <Tooltip label="Remove">
        <span onClick={handleFunction}>
          <i className="bi bi-x-circle ps-1"></i>
        </span>
      </Tooltip>
    </Badge>
  );
};

export default UserBadgeItem;
