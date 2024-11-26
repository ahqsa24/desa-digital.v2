import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { paths } from "Consts/path";
import { useAuthState } from "react-firebase-hooks/auth";
import { useLocation, useNavigate } from "react-router";
import { auth } from "../../firebase/clientApp";
import UserMenu from "./RightContent/UserMenu";

type TopBarProps = {
  title: string | undefined;
  onBack?: () => void;
};

function TopBar(props: TopBarProps) {
  const { title, onBack } = props;
  const navigate = useNavigate();
  const location = useLocation();

  const [user] = useAuthState(auth);

  const allowedPaths = [paths.LANDING_PAGE, paths.ADMIN_PAGE];
  const isUserMenuVisible = allowedPaths.includes(location.pathname);

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
      alignContent="center"
    >
      <Flex
        justify={isUserMenuVisible ? `space-between` : `flex-start`}
        align="center"
      >
        {!!onBack && (
          <ArrowBackIcon
            color="white"
            fontSize="14pt"
            cursor="pointer"
            onClick={onBack}
            mt="2px"
          />
        )}
        <Text
          fontSize="16px"
          fontWeight="700"
          color="white"
          ml={isUserMenuVisible ? `0` : `24px`}
          mt="2px"
          lineHeight="56px"
        >
          {title}
        </Text>
        {user
          ? isUserMenuVisible && <UserMenu user={user} />
          : isUserMenuVisible && (
              <Button
                fontSize="14px"
                fontWeight="700"
                color="white"
                cursor="pointer"
                onClick={() => navigate(paths.LOGIN_PAGE)}
                variant="link"
                mt="2px"
              >
                Login
              </Button>
            )}
      </Flex>
    </Box>
  );
}

export default TopBar;
