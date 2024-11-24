import React, { useEffect, useState } from "react";
import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Button,
  Flex,
} from "@chakra-ui/react";
import { paths } from "Consts/path";
import { User, signOut } from "firebase/auth";
import { useNavigate } from "react-router";
import { auth, firestore } from "../../../firebase/clientApp";
import profileIcon from "Assets/icons/profile.svg";
import notification from "Assets/icons/bell.svg";
import { doc, getDoc } from "firebase/firestore";

type UserMenuProps = {
  user?: User | null;
};

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const navigate = useNavigate();
  const [profileExists, setProfileExists] = useState<boolean | null>(null);

  const checkInnovatorProfile = async (userId: string) => {
    const docRef = doc(firestore, "innovators", userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  };

  useEffect(() => {
    const fetchProfileStatus = async () => {
      if (user) {
        const exists = await checkInnovatorProfile(user.uid);
        setProfileExists(exists);
      }
    };
    fetchProfileStatus();
  }, [user]);

  const handleProfileClick = async () => {
    if (!user) return;

    if (profileExists) {
      navigate(`${paths.INNOVATOR_DETAIL}/${user.uid}`);
    } else {
      navigate(paths.INNOVATOR_FORM);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); 
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <Flex justify="center" align="center">
      <Menu>
        <Button
          padding={1}
          as={IconButton}
          aria-label="Options"
          icon={<img src={notification} alt="Bell" width="24" height="24" />}
        />
        <MenuButton
          as={IconButton}
          aria-label="Options"
          icon={<img src={profileIcon} alt="Profile" width="24" height="24" />}
        />

        <MenuList>
          {user ? (
            <>
              <MenuItem onClick={handleProfileClick}>
                {profileExists ? "Profile" : "Isi Profile"}
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
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
    </Flex>
  );
};

export default UserMenu;
