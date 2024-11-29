import { useToast } from '@chakra-ui/toast';
import Add from "Assets/icons/add.svg";
import Container from "Components/container";
import { paths } from "Consts/path";
import { getAuth, onAuthStateChanged } from "firebase/auth"; // import firebase auth
import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getFirestore,
  onSnapshot,
  query,
  where
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Hero from "./components/hero";
import Innovator from "./components/innovator";
import Menu from "./components/menu";
import Readiness from "./components/readiness";
import { Box, Button, Flex, IconButton, Text, Tooltip, } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import TopBar from 'Components/topBar';
import { useAuthState } from 'react-firebase-hooks/auth';
import { firestore } from "../../firebase/clientApp";

function Home() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null); // State untuk menyimpan peran pengguna
  const [isInnovator, setIsInnovator] = useState(false); // State untuk mengecek apakah pengguna ada di koleksi innovators
  const [hasLoggedIn, setHasLoggedIn] = useState(false);
  const auth = getAuth(); // Dapatkan instance auth dari Firebase
  const [userLogin] = useAuthState(auth);
  const [userData, setUserData] = useState<DocumentData | undefined>();
  const [inovator, setInovator] = useState<DocumentData | undefined>();

  const toast = useToast();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Jika pengguna berhasil login, cek apakah toast sudah ditampilkan
        if (!localStorage.getItem("hasLoggedIn")) {
          toast({
            title: "Anda berhasil login!",
            status: "success",
            duration: 2500,
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
  
          // Tandai bahwa toast login sudah ditampilkan
          localStorage.setItem("hasLoggedIn", "true");
        }
  
        // Dapatkan token otentikasi dan lakukan query database
        user.getIdToken().then((token) => {
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
        });
      } else {
        setUserRole(null);
        setIsInnovator(false);
        localStorage.removeItem("hasLoggedIn"); // Hapus status login saat logout
      }
    });
  
    return () => unsubscribe();
  }, [auth, toast]);

  useEffect(() => {
    const fetchUser = async () => {
      if (userLogin?.uid) {
        const userRef = doc(firestore, "users", userLogin.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
          if(userSnap.data()?.role === 'innovator') {
            setIsInnovator(true);
          }
        }
      }
    };
    fetchUser();
  })
  
  useEffect(() => {
    const fetchInnovator = async () => {
      if (userLogin?.uid) {
        const innovatorRef = doc(firestore, "innovators", userLogin.uid);
        const innovatorSnap = await getDoc(innovatorRef);
        if (innovatorSnap.exists()) {
          setInovator(innovatorSnap.data());
        }
      }
    };
    fetchInnovator();
  })

  const handleAddInnovationClick = () => {
    if (isInnovator && inovator?.status === "Terverifikasi") {
      navigate(paths.ADD_INNOVATION);
    } else {
      toast({
        title: "Lengkapi Profil terlebih dahulu",
        status: "error",
        duration: 1000,
        isClosable: false,
        position: "top",
      })
    }
  };

  return (
    <Container page>
      <TopBar title="Desa Digital Indonesia" />
      <Hero description='Inovasi Digital' text='Indonesia'/>
      <Menu />
      <Readiness />
      <Box padding='0 14px' mt={4}>
        <Text fontSize='16px' fontWeight='700' mb={2}>
          Innovator Unggulan
        </Text>
        <Innovator />
      </Box>
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
          borderRadius='8'
        >
          <Button 
            borderRadius='50%' 
            width='60px' 
            height='60px' 
            padding='0' 
            display='flex' 
            alignItems='center' 
            justifyContent='center' 
            position='fixed' 
            zIndex='999' 
            bottom='68px' 
            marginLeft='267px' 
            marginRight='33px'
            marginBottom='1'
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
