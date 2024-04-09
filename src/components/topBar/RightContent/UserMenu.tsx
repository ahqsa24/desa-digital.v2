import { HamburgerIcon } from '@chakra-ui/icons';
import { IconButton, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { paths } from 'Consts/path';
import { User, signOut } from 'firebase/auth';
import React from 'react';
import { useNavigate } from 'react-router';
import { auth } from '../../../firebase/clientApp';

type UserMenuProps = {
    user?: User | null;
};

const UserMenu:React.FC<UserMenuProps> = ({ user }) => {
    const navigate = useNavigate();

    return (
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="Options"
          icon={<HamburgerIcon />}
        />
        <MenuList>
            {user ? (
                <>
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