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
  Description,
  Label,
  Logo,
  Title
} from "./_detailStyle";
import { ChevronRightIcon } from "@chakra-ui/icons"; 
import { FaWhatsapp, FaInstagram, FaGlobe } from "react-icons/fa";
import InnovationPreview from "../components/hero/innovations";
import ButtonPengajuan from "../components/hero/ButtonPengajuan"; // Impor tombol

const DetailInnovator: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
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

  const truncateText = (text: string, wordLimit: number) => {
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  };
  
  return (
    <Container page>
      <TopBar 
        title="Profil Inovator"  
        onBack={() => navigate(-1)} 
        />
      <Flex position="relative">
        <Background src={innovatorData.header} alt="header" />
        <Logo src={innovatorData.logo} alt="logo" mx={16} my={-40} />
        <Box
          position="absolute"
          top="130%"
          right="16px"
          transform="translateY(-50%)"
        >
          <ButtonPengajuan
            label="Pengajuan Inovasi" // Teks tombol
            to="/innovator/profile/pengajuanInovasi"
          />
        </Box>
      </Flex>
      <ContentContainer>
        <Stack gap={3} mt={4} >
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
            <Flex direction="column" alignItems="flex-start">
              <Flex
                width="100%"
                flexDirection="row"
                alignItems="flex-start"
                paddingBottom="12px"
              >
                <Box color="#4B5563" fontSize="12px" minWidth="110px">Nomor WhatsApp</Box>
                <Text
                  maxW="200px"
                  whiteSpace="normal"
                  overflowWrap="break-word"
                  fontSize="12px"
                >
                  08126489023
                </Text>
              </Flex>
              <Flex
                width="100%"
                flexDirection="row"
                alignItems="flex-start"
                paddingBottom="12px"
              >
                <Box color="#4B5563" fontSize="12px" minWidth="110px">Link Instagram</Box>
                <Text
                  maxW="222px"
                  whiteSpace="normal"
                  overflowWrap="break-word"
                  fontSize="12px"
                >
                  https://www.instagram.com/desasoge/
                </Text>
              </Flex>
              <Flex
                width="100%"
                flexDirection="row"
                alignItems="flex-start"
                paddingBottom="12px"
              >
                <Box color="#4B5563" fontSize="12px" minWidth="110px">Link Website</Box>
                <Text
                  maxW="222px"
                  whiteSpace="normal"
                  overflowWrap="break-word"
                  fontSize="12px"
                >
                  https://www.instagram.com/desasoge/
                </Text>
              </Flex>
            </Flex>

            <Flex direction="row" alignItems="center" >
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

            <Box fontSize="12px" fontWeight="400" color="#4B5563" >
              {isExpanded ? (
                // Tampilkan teks lengkap jika `isExpanded` true
                <>
                  {innovatorData.deskripsi}
                  {innovatorData.deskripsi.split(" ").length > 20 && ( // Tampilkan "Lebih Sedikit" jika lebih dari 20 kata
                    <Text
                      as="span"
                      fontSize="12px"
                      fontWeight="700"
                      color="#347357"
                      cursor="pointer"
                      textDecoration="underline"
                      onClick={() => setIsExpanded(!isExpanded)} // Toggle state
                    >
                      Lebih Sedikit
                    </Text>
                  )}
                </>
              ) : (
                // Tampilkan teks terpotong jika `isExpanded` false
                <>
                  {truncateText(innovatorData.deskripsi, 20)}
                  {innovatorData.deskripsi.split(" ").length > 20 && ( // Tampilkan "Selengkapnya" jika lebih dari 20 kata
                    <Text
                      as="span"
                      fontSize="12px"
                      fontWeight="700"
                      color="#347357"
                      cursor="pointer"
                      textDecoration="underline"
                      onClick={() => setIsExpanded(!isExpanded)} // Toggle state
                    >
                      {" "}
                      Selengkapnya
                    </Text>
                  )}
                </>
              )}
            </Box>
          </Stack>
        </Flex>
        <Flex direction="column">
          {/* Komponen Produk Inovasi */}
          <InnovationPreview innovations={innovations} innovatorId={id} />
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
          placement="bottom"
          onClose={onClose}
        >
          <DrawerOverlay />
          <DrawerContent
            sx={{
              borderTopRadius: "16px", // Radius untuk tampilan yang smooth
              width: "100%", // Lebar drawer penuh
              maxWidth: "480px", // Batas maksimal untuk mobile
              margin: "0 auto", // Pusatkan drawer
              bg: "white", // Warna latar belakang putih
            }}
          >
            <DrawerHeader
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "16px",
                fontWeight: "700",
                color: "#1F2937",
                padding: "16px",
              }}
            >
              Kontak Innovator
            </DrawerHeader>
            <DrawerCloseButton mt={2} />
            <DrawerBody padding="16px">
              <Text fontSize="12px" fontWeight="400" color="#4B5563" mb={4} textAlign="center">
                Terapkan produk inovasi desa digital dengan cara menghubungi innovator melalui saluran di bawah ini:
              </Text>
              <Stack spacing={4}>
                {/* WhatsApp */}
                <Flex
                  alignItems="center"
                  padding="12px"
                  borderWidth="1px"
                  borderRadius="8px"
                  cursor="pointer"
                  transition="all 0.3s ease"
                  _hover={{
                    bg: "green.50", // Warna saat hover
                  }}
                >
                  <Icon as={FaWhatsapp} boxSize={6} color="green.500" mr={4} />
                  <Text fontSize="14px" fontWeight="500" flex="1" color="#1F2937">
                    WhatsApp
                  </Text>
                  <ChevronRightIcon color="#1F2937" />
                </Flex>

                {/* Instagram */}
                <Flex
                  alignItems="center"
                  padding="12px"
                  borderWidth="1px"
                  borderRadius="8px"
                  cursor="pointer"
                  transition="all 0.3s ease"
                  _hover={{
                    bg: "blue.50", // Warna saat hover
                  }}
                >
                  <Icon as={FaInstagram} boxSize={6} color="blue.500" mr={4} />
                  <Text fontSize="14px" fontWeight="500" flex="1" color="#1F2937">
                    Instagram
                  </Text>
                  <ChevronRightIcon color="#1F2937" />
                </Flex>

                {/* Website */}
                <Flex
                  alignItems="center"
                  padding="12px"
                  borderWidth="1px"
                  borderRadius="8px"
                  cursor="pointer"
                  transition="all 0.3s ease"
                  _hover={{
                    bg: "teal.50", // Warna saat hover
                  }}
                >
                  <Icon as={FaGlobe} boxSize={6} color="teal.500" mr={4} />
                  <Text fontSize="14px" fontWeight="500" flex="1" color="#1F2937">
                    Website
                  </Text>
                  <ChevronRightIcon color="#1F2937" />
                </Flex>
              </Stack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>

    </Container>
  );
};

export default DetailInnovator;