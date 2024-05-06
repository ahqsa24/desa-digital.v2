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

function Home() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null); // State untuk menyimpan peran pengguna
  const auth = getAuth(); // Dapatkan instance auth dari Firebase

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
        });
      } else {
        setUserRole(null); // Set state menjadi null jika pengguna tidak terautentikasi
      }
    });

    return () => unsubscribe();
  }, [auth]);

  return (
    <Container page>
      <TopBar />
      <Hero />
      <Menu />
      <Readiness />
      <Innovator />
      {userRole === "innovator" && ( // Tampilkan tombol hanya jika pengguna memiliki peran "innovator"
        <FloatingButton onClick={() => navigate(paths.ADD_INNOVATION)}>
          <img src={Add} width={20} height={20} alt="add icon" />
        </FloatingButton>
      )}
    </Container>
  );
}

export default Home;
