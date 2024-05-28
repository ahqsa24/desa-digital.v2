import { IconButton, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { paths } from 'Consts/path';
import { signOut } from 'firebase/auth';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { CgProfile } from "react-icons/cg";
import { useNavigate } from 'react-router';
import { auth } from '../../../firebase/clientApp';



const UserMenu:React.FC = () => {
    const navigate = useNavigate();
    const [user] = useAuthState(auth);
    return (
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="Options"
          icon={<CgProfile/>}
          fontSize={"24px"}
        />
        <MenuList>
            {user ? (
                <>
                    <MenuItem >Profile</MenuItem>
                    <MenuItem onClick={() => signOut(auth)}>Logout</MenuItem>
                </>
            ) : (
                <>
                    <MenuItem onClick={() => navigate(paths.LOGIN_PAGE)}>Login</MenuItem>
                </>
            )}
          
        </MenuList>
      </Menu>
    );
}
export default UserMenu;