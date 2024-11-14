import { useToast } from '@chakra-ui/toast';
import { Box, Button, IconButton, Tooltip } from '@chakra-ui/react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getFirestore,
  onSnapshot,
  query,
  where
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AddIcon } from '@chakra-ui/icons';
import Container from "Components/container";
import TopBar from "Components/topBar/TopBar";
import { paths } from "Consts/path";
import Hero from "./components/hero";
import Menu from "./components/menu";
import Readiness from "./components/readiness";

function Home() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [isInnovator, setIsInnovator] = useState(false);
  const auth = getAuth();
  const toast = useToast();

  useEffect(() => {
    const hasLoggedIn = localStorage.getItem("hasLoggedIn");

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (!hasLoggedIn) {
          toast({
            title: "Anda berhasil login!",
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "top",
            render: () => (
              <Box
                color="#16A34A"
                p={2}
                bg="#FFF"
                borderRadius="md"
                fontFamily="Inter"
                fontSize="14px"
                boxShadow="lg"
              >
                Anda berhasil login!
              </Box>
            ),
          });
          localStorage.setItem("hasLoggedIn", "true");
        }

        try {
          const db = getFirestore();
          const colRef = collection(db, "users");
          const q = query(colRef, where("id", "==", user.uid));

          onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
              const userData = snapshot.docs[0].data();
              setUserRole(userData.role);
            }
          });

          const innovatorsRef = collection(db, "innovators");
          const qInnovators = query(innovatorsRef, where("id", "==", user.uid));
          onSnapshot(qInnovators, (snapshot) => {
            setIsInnovator(!snapshot.empty);
          });
        } catch (error) {
          console.error("Error fetching user data or token", error);
        }
      } else {
        setUserRole(null);
        setIsInnovator(false);
        localStorage.removeItem("hasLoggedIn");
      }
    });

    return () => unsubscribe();
  }, [auth, toast]);

  const handleAddInnovationClick = () => {
    if (isInnovator) {
      navigate(paths.ADD_INNOVATION);
    } else {
      toast({
        title: "Lengkapi Profil terlebih dahulu",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <Container page>
      <TopBar />
      <Hero />
      <Menu />
      <Readiness />
      {userRole === "innovator" && (
        <Tooltip
          label="Tambah Inovasi"
          aria-label="Tambah Inovasi Tooltip"
          placement="top"
          hasArrow
          bg="#347357"
          color="white"
          fontSize="12px"
          p={1}
          borderRadius='10'
        >
          <Button 
            borderRadius='50%' 
            width='60px' 
            height='60px' 
            padding='0' 
            display='flex' 
            alignItems='center' 
            justifyContent='center' 
            position='sticky' 
            zIndex='999' 
            bottom='68px' 
            marginLeft='auto' 
            marginRight='33px'
            onClick={handleAddInnovationClick}
          >
            <IconButton icon={<AddIcon />} aria-label="Tambah Inovasi" />
          </Button>
        </Tooltip>
      )}
      <ToastContainer />
    </Container>
  );
}

export default Home;