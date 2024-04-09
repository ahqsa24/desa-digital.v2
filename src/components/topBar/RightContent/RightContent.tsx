import { Flex } from "@chakra-ui/react";
import { User } from "firebase/auth";
import React from "react";
import UserMenu from "./UserMenu";

type RightContentProps = {
  user?: User | null;
};

const RightContent: React.FC<RightContentProps> = ({ user }) => {
  return (
    <>
      <Flex justify="center" align="center">
        <UserMenu user={user} />
      </Flex>
    </>
  );
};
export default RightContent;
