import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Add from "Assets/icons/add.svg";
import Container from "Components/container";
import TopBar from "Components/topBar/TopBar";
import { paths } from "Consts/path";
import { getAuth, onAuthStateChanged } from "firebase/auth"; // import firebase auth
import {
  collection,
  getFirestore,
  onSnapshot,
  query,
  where
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FloatingButton } from "./_homeStyle";
import Hero from "./components/hero";
import Innovator from "./components/innovator";
import Menu from "./components/menu";
import Readiness from "./components/readiness";
import { useToast } from '@chakra-ui/toast';

function Home() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null); // State untuk menyimpan peran pengguna
  const [isInnovator, setIsInnovator] = useState(false); // State untuk mengecek apakah pengguna ada di koleksi innovators
  const auth = getAuth(); // Dapatkan instance auth dari Firebase

  const toast = useToast();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Jika pengguna berhasil login, dapatkan token otentikasi
        user.getIdToken().then((token) => {
          const db = getFirestore();
          const colRef = collection(db, "users");
          const q = query(colRef, where("id", "==", user.uid)); // Filter berdasarkan ID pengguna yang terautentikasi

          // Periksa peran pengguna dalam database Firestore
          onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
              const userData = snapshot.docs[0].data();
              setUserRole(userData.role); // Set peran pengguna ke state
            }
          });

          // Periksa apakah pengguna ada di koleksi innovators
          const innovatorsRef = collection(db, "innovators");
          const qInnovators = query(innovatorsRef, where("id", "==", user.uid)); // Filter berdasarkan ID pengguna yang terautentikasi
          onSnapshot(qInnovators, (snapshot) => {
            if (!snapshot.empty) {
              setIsInnovator(true); // Set isInnovator ke true jika pengguna ada di koleksi innovators
            } else {
              setIsInnovator(false); // Set isInnovator ke false jika pengguna tidak ada di koleksi innovators
            }
          });
        });
      } else {
        setUserRole(null); // Set state menjadi null jika pengguna tidak terautentikasi
        setIsInnovator(false); // Set isInnovator ke false jika pengguna tidak terautentikasi
      }
    });

    return () => unsubscribe();
  }, [auth]);

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
      })
    }
  };

  return (
    <Container page>
      <TopBar />
      <Hero />
      <Menu />
      <Readiness />
      <Innovator />
      {userRole === "innovator" && (
        <FloatingButton onClick={handleAddInnovationClick}>
          <img src={Add} width={20} height={20} alt="add icon" />
        </FloatingButton>
      )}
      <ToastContainer />
    </Container>
  );
}

export default Home;
