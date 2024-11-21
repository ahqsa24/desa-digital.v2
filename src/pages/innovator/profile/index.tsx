import { Flex, Icon, Stack, Text, useDisclosure } from "@chakra-ui/react";
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
} from "./_innovatorStyles";

const ProfileInnovator: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Ensure TypeScript knows id is a string
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [innovatorData, setInnovatorData] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [innovations, setInnovations] = useState<DocumentData[]>([]);

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
      <TopBar title="Detail Innovator" onBack={() => navigate(-1)} />
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
          <Text fontSize="16px" fontWeight="700">
            Desa Dampingan
          </Text>
        </Flex>
        <Button size="m" fullWidth mb={70} type="submit" onClick={onOpen}>
            Kontak Innovator
        </Button>{" "}
      </ContentContainer>
    </Container>
  );
};

export default ProfileInnovator;
