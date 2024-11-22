import { Flex, Icon, Stack, Text, useDisclosure, Box, DrawerCloseButton, Image, Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent, Button as ChakraButton, Link } from "@chakra-ui/react";
import Button from "Components/button";
import CardInnovation from "Components/card/innovation";
import Container from "Components/container";
import TopBar from "Components/topBar/index";
import { paths } from "Consts/path";
import { DocumentData, collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { LuDot } from "react-icons/lu";
import { TbPlant2 } from "react-icons/tb";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import { firestore } from "../../../firebase/clientApp";
import {
  CardContainer,
  Horizontal,
} from "../../../pages/home/components/innovator/_innovatorStyle";
import {
  Background,
  ContentContainer,
  Label,
  Logo,
  Title
} from "./_detailStyle";
import { ChevronRightIcon } from "@chakra-ui/icons"; 
import { FaWhatsapp, FaInstagram, FaGlobe } from "react-icons/fa";

const DetailInnovator: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Ensure TypeScript knows id is a string
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [innovatorData, setInnovatorData] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [innovations, setInnovations] = useState<DocumentData[]>([]);
  const [villages, setVillages] = useState<DocumentData[]>([]); // Add state for villages

  // Fetch innovator data
  useEffect(() => {
    if (!id) {
      setError("Invalid innovator ID.");
      setLoading(false);
      return;
    }

    const fetchInnovatorData = async () => {
      try {
        const innovatorRef = doc(firestore, "innovators", id);
        const innovatorDoc = await getDoc(innovatorRef);
        if (innovatorDoc.exists()) {
          setInnovatorData(innovatorDoc.data());
        } else {
          console.log("Innovator not found");
          setError("Innovator not found.");
        }
      } catch (error) {
        console.error("Error fetching innovator data:", error);
        setError("Error fetching innovator data.");
      } finally {
        setLoading(false);
      }
    };

    fetchInnovatorData();
  }, [id]);
  console.log("data: ", innovatorData);

  // Fetch innovations data
  useEffect(() => {
    const fetchInnovations = async () => {
      try {
        const innovationsRef = collection(firestore, "innovations");
        const q = query(innovationsRef, where("innovatorId", "==", id));
        const innovationsDocs = await getDocs(q);
        const innovationsData = innovationsDocs.docs.map((doc) => ({
          id: doc.id, // Ensure the ID is included
          ...doc.data(),
        }));
        setInnovations(innovationsData);
      } catch (error) {
        console.error("Error fetching innovations data:", error);
        setError("Error fetching innovations data.");
      }
    };

    if (id) {
      fetchInnovations();
    }
  }, [id]);

  // Dummy data untuk Desa Dampingan, nantinya ini akan diganti dengan data dari Firestore
  useEffect(() => {
    const dummyVillages = [
      {
        id: "village1",
        namaDesa: "Desa Puntang",
        inovasiDiterapkan: ["Pakan Otomatis (eFeeder)", "Lapak Ikan (eFisheryFeed)"],
        logo: "https://via.placeholder.com/50"
      },
    ];
    setVillages(dummyVillages);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!innovatorData) {
    return <div>No data available</div>;
  }

  return (
    <Container page>
      <TopBar 
        title="Detail Innovator"  
        onBack={() => navigate(-1)} 
        />
      <Flex position="relative">
        <Background src={innovatorData.header} alt="header" />
        <Logo src={innovatorData.logo} alt="logo" mx={16} my={-40} />
      </Flex>
      <ContentContainer>
        <Stack gap={3}>
          <Title>{innovatorData.namaInovator}</Title>
          <Label>{innovatorData.kategori}</Label>
          <Flex direction="row" gap={3} mt={0} alignItems="center">
            <Icon as={FaWandMagicSparkles} color="#4B5563" />
            <Text fontSize="12px" fontWeight="400" color="#4B5563">
              {innovatorData.jumlahInovasi} Inovasi
            </Text>
            <Icon as={LuDot} color="#4B5563" />
            <Icon as={TbPlant2} color="#4B5563" />
            <Text fontSize="12px" fontWeight="400" color="#4B5563">
              {innovatorData.jumlahDesaDampingan} Desa Dampingan
            </Text>
          </Flex>
        </Stack>
        <Flex>
          <Stack direction="column">
            <Text fontSize="16px" fontWeight="700">
              Tentang
            </Text>
            <Flex direction="row" alignItems="center">
              <Text
                fontSize="12px"
                fontWeight="700"
                color="#4B5563"
                mr={2}
              >
                Model bisnis digital:
              </Text>
              <Text
                fontSize="12px"
                fontWeight="400"
                color="#4B5563"
                flex="1"
              >
                {innovatorData.modelBisnis}
              </Text>
            </Flex>

            <Text fontSize="12px" fontWeight="400" color="#4B5563">
              {innovatorData.deskripsi}
            </Text>
          </Stack>
        </Flex>
        <Flex direction="column">
          <Text fontSize="16px" fontWeight="700">
            Produk Inovasi
          </Text>
          <CardContainer>
            <Horizontal>
              {innovations.map((innovation, idx) => (
                <CardInnovation
                  key={idx}
                  images={innovation.images}
                  namaInovasi={innovation.namaInovasi}
                  kategori={innovation.kategori}
                  deskripsi={innovation.deskripsi}
                  tahunDibuat={innovation.tahunDibuat}
                  innovatorLogo={innovation.innovatorImgURL}
                  innovatorName={innovation.namaInnovator}
                  onClick={() =>
                    navigate(generatePath(paths.DETAIL_INNOVATION_PAGE, { id: innovation.id }))
                  }
                />
              ))}
            </Horizontal>
          </CardContainer>
        </Flex>
        <Flex direction="column">
          <Text fontSize="16px" fontWeight="700" mb={3}>
            Desa Dampingan
          </Text>
          {villages.map((village) => (
            <Box
              key={village.id}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              p={2}
              mb={4}
              cursor="pointer"
              backgroundColor="white"
              borderColor="gray.200"
              onClick={() =>
                navigate(generatePath(paths.DETAIL_VILLAGE_PAGE, { id: village.id }))
              }
            >
              <Flex alignItems="center" mb={3}>
                <Image
                  src={village.logo}
                  alt={`${village.namaDesa} Logo`}
                  boxSize="40px"
                  borderRadius="full"
                  mr={4}
                />
                <Text fontSize="12px" fontWeight="600">{village.namaDesa}</Text>
                <ChevronRightIcon color="gray.500" ml="auto"/>
              </Flex>
              {/* Menambahkan Border Pembatas Di Atas "Inovasi Diterapkan" */}
              <Box borderTop="1px" borderColor="gray.300" pt={3} mt={3}></Box>
              <Text fontSize="12px" fontWeight="400" mb={2} color="#9CA3AF">
                Inovasi diterapkan
              </Text>
              <Flex direction="row" gap={2} flexWrap="wrap">
                {Array.isArray(village.inovasiDiterapkan) &&
                  village.inovasiDiterapkan.map((inovasi, index) => (
                    <Box
                      key={index}
                      px={0}
                      py={0}
                      backgroundColor="gray.100"
                      borderRadius="full"
                      fontSize="12px"
                      display="inline-flex"
                    >
                      {inovasi}
                    </Box>
                  ))}
              </Flex>
            </Box>
          ))}
        </Flex>
        <Button mt={-3} size="m" fullWidth type="submit" onClick={onOpen}>
          Kontak Innovator
        </Button>
      </ContentContainer>
        <Drawer 
          isOpen={isOpen}
          placement='bottom'
          onClose={onClose}
          variant="purple"
        >
          <DrawerOverlay />
          <DrawerContent
            sx={{
              borderTopRadius: "16px", // Radius atas untuk gaya drawer seperti aplikasi mobile
              width: "100%",           // Pastikan drawer memenuhi lebar layar
              maxWidth: "480px",       // Batasi lebar maksimum untuk pengalaman mobile yang baik
              margin: "0 auto",        // Pusatkan drawer pada layar
              bg: "white",             // Warna latar belakang yang bersih
            }}
            >
            <DrawerHeader 
              sx={{
              display: "flex",
              justifyContent: "center",
              color: "#1F2937",
              fontSize: "16px"
              }}
              >Kontak Innovator
            </DrawerHeader>
            <DrawerCloseButton mt={1} />
            <DrawerBody padding="16px">
              <Text mb={4} textAlign="center">
                Terapkan produk inovasi desa digital dengan cara menghubungi innovator melalui saluran di bawah ini:
              </Text>
              <Stack spacing={4}>
                <Flex alignItems="center" p={3} borderWidth="1px" borderRadius="md" cursor="pointer">
                  <Icon as={FaWhatsapp} boxSize={6} color="green.500" mr={4} />
                  <Text flex="1">WhatsApp</Text>
                  <ChevronRightIcon />
                </Flex>
                <Flex alignItems="center" p={3} borderWidth="1px" borderRadius="md" cursor="pointer">
                  <Icon as={FaInstagram} boxSize={6} color="green.500" mr={4} />
                  <Text flex="1">Instagram</Text>
                  <ChevronRightIcon />
                </Flex>
                <Flex alignItems="center" p={3} borderWidth="1px" borderRadius="md" cursor="pointer">
                  <Icon as={FaGlobe} boxSize={6} color="green.500" mr={4} />
                  <Text flex="1">Website</Text>
                  <ChevronRightIcon />
                </Flex>
              </Stack>
            </DrawerBody>
            <DrawerFooter justifyContent="center">
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
    </Container>
  );
};

export default DetailInnovator;