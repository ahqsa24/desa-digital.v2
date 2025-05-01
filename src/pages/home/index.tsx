import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Stack,
  Tooltip,
} from "@chakra-ui/react";
import Ads from "Components/ads/Ads";
import BestBanner from "Components/banner/BestBanner";
import Container from "Components/container";
import Dashboard from "Components/dashboard/dashboard";
import Rediness from "Components/rediness/Rediness";
import SearchBarLink from "Components/search/SearchBarLink";
import TopBar from "Components/topBar";
import { paths } from "Consts/path";
import { doc, DocumentData, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { auth, firestore } from "../../firebase/clientApp";
import Hero from "./components/hero";
import Innovator from "./components/innovator";
import Menu from "./components/menu";

function Home() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null); // State untuk menyimpan peran pengguna
  const [userLogin] = useAuthState(auth);
  const [inovator, setInovator] = useState<DocumentData | undefined>();

  useEffect(() => {
    const fetchUserRole = async () => {
      if (userLogin?.uid) {
        const userRef = doc(firestore, "users", userLogin.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserRole(userSnap.data()?.role);
        }
      }
    };
    fetchUserRole();
  }, [userLogin]);

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
  }, [userLogin]);

  const handleAddInnovationClick = () => {
    if (userRole === "innovator" && inovator?.status === "Terverifikasi") {
      navigate(paths.ADD_INNOVATION);
    } else {
      toast.warning(
        "Akun anda belum terdaftar atau terverifikasi sebagai inovator",
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    }
  };

  return (
    <Container page>
      <TopBar title="Desa Digital Indonesia" />
      <Hero
        description="KMS Desa Digital"
        text="Indonesia"
        isAdmin={userRole === "Admin"}
        isInnovator={userRole === "innovator"}
        isVillage={userRole === "village"}
      />
      <Stack direction="column" gap={2}>
        <SearchBarLink placeholderText="Cari Inovasi atau inovator di sini..." />
        <Menu />
        <Flex direction="row" justifyContent="space-between" padding="0 14px">
          <Rediness />
          <Ads />
        </Flex>
        {userRole === "village" && <Dashboard />}
        <BestBanner />
        <Box mt="120px">
          <Innovator />
        </Box>
      </Stack>
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
          borderRadius="8"
        >
          <Button
            borderRadius="50%"
            width="60px"
            height="60px"
            padding="0"
            display="flex"
            alignItems="center"
            justifyContent="center"
            position="fixed"
            zIndex="999"
            bottom="68px"
            marginLeft="267px"
            marginRight="33px"
            marginBottom="1"
            onClick={handleAddInnovationClick}
          >
            <IconButton icon={<AddIcon />} aria-label="Tambah Inovasi" />
          </Button>
        </Tooltip>
      )}
    </Container>
  );
}

export default Home;
