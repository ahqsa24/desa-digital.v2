import { Flex, Text } from "@chakra-ui/react";
import React from "react";
import { Container } from "./_topBarStyle";
import RightContent from "./RightContent/RightContent";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/clientApp";

const TopBar: React.FC = () => {
  const [user, loading, error] = useAuthState(auth)
  return (
    <Container>
      <Flex justify='space-between' align='center'>
        <Text fontSize="18px" fontWeight="700" color="white">
          Desa Digital Indonesia
        </Text>
        <RightContent user={user} />
      </Flex>
    </Container>
  );
};
export default TopBar;
