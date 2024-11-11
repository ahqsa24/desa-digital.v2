import { useToast } from '@chakra-ui/toast';
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
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FloatingButton } from "./_homeStyle";
import Hero from "./components/hero";
import Innovator from "./components/innovator";
import Menu from "./components/menu";
import Readiness from "./components/readiness";
import { Toast } from './_homeStyle';


function Home() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [isInnovator, setIsInnovator] = useState(false);
  const auth = getAuth();
  const toast = useToast();

  useEffect(() => {
    const hasLoggedIn = localStorage.getItem("hasLoggedIn");

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (!hasLoggedIn) {
          toast({
            title: "Anda berhasil login!",
            status: "success",
            duration: 1000,
            isClosable: true,
            position: "top",
            render: () => (
              <Toast>
                Anda berhasil login!
              </Toast>
            ),
          });
          localStorage.setItem("hasLoggedIn", "true");
        }

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
            if (!snapshot.empty) {
              setIsInnovator(true);
            } else {
              setIsInnovator(false);
            }
          });
        });
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
        duration: 1000,
        isClosable: false,
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
