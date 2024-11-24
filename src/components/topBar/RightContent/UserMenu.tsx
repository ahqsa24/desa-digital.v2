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
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router";
import { auth, firestore } from "../../../firebase/clientApp";
import profileIcon from "Assets/icons/profile.svg";
import notification from "Assets/icons/bell.svg";
import { collection, doc, getDoc, getFirestore, onSnapshot, query, where } from "firebase/firestore";

type UserMenuProps = {
  user?: User | null;
};

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const navigate = useNavigate();
  const [profileExists, setProfileExists] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
 
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Jika pengguna berhasil login
        const db = getFirestore();

        // Ambil data pengguna dari koleksi "users" berdasarkan UID
        const usersRef = collection(db, "users");
        const userQuery = query(usersRef, where("id", "==", user.uid));
        onSnapshot(userQuery, (snapshot) => {
          if (!snapshot.empty) {
            const userData = snapshot.docs[0].data();
            setUserRole(userData.role); // Set state userRole
            console.log("User role: ", userData.role);
            // Cek koleksi berdasarkan role pengguna
            if (userData.role === "village") {
              const villagesRef = collection(db, "villages");
              const villageQuery = query(
                villagesRef,
                where("id", "==", user.uid)
              );
              onSnapshot(villageQuery, (villageSnapshot) => {
                setProfileExists(!villageSnapshot.empty);
              });
            } else if (userData.role === "innovator") {
              const innovatorsRef = collection(db, "innovators");
              const innovatorQuery = query(
                innovatorsRef,
                where("id", "==", user.uid)
              );
              onSnapshot(innovatorQuery, (innovatorSnapshot) => {
                setProfileExists(!innovatorSnapshot.empty);
              });
            } else {
              setProfileExists(false); // Jika role tidak sesuai, profil dianggap tidak ada
            }
          } else {
            setUserRole(null); // Set role ke null jika data pengguna tidak ditemukan
            setProfileExists(false); // Set profileExists ke false
          }
        });
      } else {
        // Reset state jika pengguna logout
        setUserRole(null);
        setProfileExists(false);
      }
    });

    return () => unsubscribe(); // Bersihkan listener
  }, []);



  const handleProfileClick = () => {
    if (!user) return;

    if (userRole === "village") {
      if (profileExists) {
        navigate(`${paths.DETAIL_VILLAGE_PAGE}/${user.uid}`);
      } else {
        navigate(paths.VILLAGE_FORM);
      }
    } else if (userRole === "innovator") {
      if (profileExists) {
        navigate(`${paths.INNOVATOR_DETAIL}/${user.uid}`);
      } else {
        navigate(paths.INNOVATOR_FORM);
      }
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
