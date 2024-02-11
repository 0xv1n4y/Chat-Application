import { CloseIcon } from "@chakra-ui/icons";
import { Badge, Box } from "@chakra-ui/react";
import React from "react";

const UserBadge = ({ user, handleFunction }) => {
  return (
    <Badge
      px={2}
      py={1}
      m={1}
      mb={2}
      varient="solid"
      font-size={12}
      backgroundColor={"pink"}
      borderRadius={"4px"}
      cursor={"pointer"}
      onClick={handleFunction}
    >
      {user.name}
      <CloseIcon pl={1} />
    </Badge>
  );
};

export default UserBadge;
