import React from "react";
import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { paths } from "Consts/path";
import { User, signOut } from "firebase/auth";
import { useNavigate } from "react-router";
import { auth } from "../../../firebase/clientApp";
import profileIcon from "Assets/icons/profile.svg";

type UserMenuProps = {
  user?: User | null;
};

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const navigate = useNavigate();

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Options"
        icon={<img src={profileIcon} alt="Profile" width="24" height="24" />}
      />
      <MenuList>
        {user ? (
          <>
            <MenuItem onClick={() => navigate(paths.INNOVATOR_FORM)}>
              Profile
            </MenuItem>{" "}
            {/* Tambahkan item Profile */}
            <MenuItem onClick={() => signOut(auth)}>Logout</MenuItem>
          </>
        ) : (
          <>
            <MenuItem onClick={() => navigate(paths.LOGIN_PAGE)}>
              Login
            </MenuItem>
          </>
        )}
      </MenuList>
    </Menu>
  );
};
export default UserMenu;
