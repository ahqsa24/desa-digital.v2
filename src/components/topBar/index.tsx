import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { paths } from "Consts/path";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router";
import { auth } from "../../firebase/clientApp";
import UserMenu from "./RightContent/UserMenu";

type TopBarProps = {
  title: string | undefined;
  onBack?: () => void;
};

function TopBar(props: TopBarProps) {
  const { title, onBack } = props;
  const navigate = useNavigate();

  const [user] = useAuthState(auth);

  return (
    <Box
      padding="0 16px"
      backgroundColor="#347357"
      position="fixed"
      top="0"
      maxW="360px"
      width="100%"
      height="56px"
      zIndex="999"
      alignContent='center'
    >
      <Flex justify="space-between" align="center">
        {!!onBack && <ArrowBackIcon color='white' fontSize='14pt' cursor="pointer" onClick={onBack} />}
        <Text fontSize="16px" fontWeight="700" color="white">
          {title}
        </Text>
        {user ? (
          <UserMenu user={user} />
        ) : (
          <Button
            fontSize="14px"
            fontWeight="700"
            color="white"
            cursor="pointer"
            onClick={() => navigate(paths.LOGIN_PAGE)}
            variant="link"
          >
            Login
          </Button>
        )}
      </Flex>
    </Box>
  );
}

export default TopBar;
