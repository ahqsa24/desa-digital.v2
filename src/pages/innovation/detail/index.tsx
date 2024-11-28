import { Button, Flex, Img,Text } from "@chakra-ui/react";
import { Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Box} from '@chakra-ui/react';
import Check from "Assets/icons/check-circle.svg";
import Container from "Components/container";
import TopBar from "Components/topBar";
import { paths } from "Consts/path.ts";
import { getInnovationById } from "Services/innovationServices.ts";
import { DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { getDocumentById } from "../../../firebase/inovationTable.ts";
import {
  ActionContainer,
  BenefitContainer,
  ChipContainer,
  ContentContainer,
  Description,
  Description2,
  Icon,
  Label,
  Logo,
  Text1,
  Text2,
  Text3,
  Text4,
  Title,
} from "./_detailStyle.ts";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase/clientApp";
import { FaCircle } from 'react-icons/fa';  // Import ikon elips

function DetailInnovation() {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const { id } = useParams();
  const { data: innovation } = useQuery<any>(
    "innovationById",
    () => getInnovationById(id),
    {
      enabled: !!id,
    }
  );

  const [user] = useAuthState(auth); // Get the current logged-in user
  const [data, setData] = useState<DocumentData>({});
  const [datainnovator, setDatainnovator] = useState<DocumentData>({});

  useEffect(() => {
    if (id) {
      getDocumentById("innovations", id)
        .then((detailInovasi) => {
          setData(detailInovasi);
          console.log("Innovation Data:", detailInovasi); // Log the fetched innovation data
        })
        .catch((error) => {
          console.error("Error fetching innovation details:", error);
        });
    }
  }, [id]);

  useEffect(() => {
    if (data.innovatorId) {
      console.log("Fetching innovator with ID:", data.innovatorId); // Log the innovator ID
      getDocumentById("innovators", data.innovatorId)
        .then((detailInnovator) => {
          setDatainnovator(detailInnovator);
          console.log("Innovator Data:", detailInnovator); // Log the fetched innovator data
        })
        .catch((error) => {
          console.error("Error fetching innovator details:", error);
        });
    }
  }, [data.innovatorId]);

  const year = new Date(data.tahunDibuat).getFullYear();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const isUserCreator = user && user.uid === data.innovatorId; // Check if the current user is the creator
  const truncateText = (text: string, wordLimit: number) => {
    if (!text) return '';
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") 
      : text;
  };

  return (
    <Container page>
      <TopBar title="Detail Inovasi" onBack={() => navigate(-1)} />
      {data.images && data.images.length > 1 ? (
        <Slider {...settings}>
          {data.images.map((image: string, index: number) => (
            <Img
              maxWidth="360px"
              maxHeight="248px"
              width="360px"
              height="248px"
              objectFit="cover"
              objectPosition="center"
              key={index}
              src={image}
              alt={`background-${index}`}
            />
          ))}
        </Slider>
      ) : (
        data.images &&
        data.images.length === 1 && (
          <Img
            src={data.images[0]}
            maxWidth="360px"
            maxHeight="248px"
            width="360px"
            height="248px"
            objectFit="cover"
            objectPosition="center"
            alt="background"
          />
        )
      )}
      <ContentContainer>
        <div>
          <Title>{data.namaInovasi}</Title>
          <ChipContainer>
            <Label>
              masih diproduksi
            </Label>
            <Label
              onClick={() =>
                navigate(
                  generatePath(paths.INNOVATION_CATEGORY_PAGE, {
                    category: data.kategori,
                  })
                )
              }
            >
              {data.kategori}
            </Label>
            <Description2>Sejak tahun {year}</Description2>
          </ChipContainer>
        </div>
        <ActionContainer
          onClick={() =>
            navigate(
              generatePath(paths.DETAIL_INNOVATOR_PAGE, {
                id: data.innovatorId,
              })
            )
          }
        >
          <Logo src={datainnovator.logo} alt="logo" />
          <div>
            <Text2>Inovator</Text2>
            <Text1>{datainnovator.namaInovator}</Text1>
          </div>
        </ActionContainer>
        
        <div>
          <Text1 mb={5}>Deskripsi</Text1>
          <Box fontSize="12px" fontWeight="400" color="#4B5563" >
            {isExpanded ? (
              // Tampilkan teks lengkap jika `isExpanded` true
              <>
                {data.deskripsi}
                {data.deskripsi.split(" ").length > 20 && ( 
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
              <>
                {truncateText(data.deskripsi || '', 20)}
                  {data.deskripsi && data.deskripsi.split(" ").length > 20 && ( // Tampilkan "Selengkapnya" jika lebih dari 20 kata
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
        </div>

        <div>
          <Text4 mt={-5} mb={5}>Model Bisnis Digital</Text4>
        </div>

        <div>
          <Text4 mt={-5} mb={5}>Desa yang Menerapkan</Text4>
        </div>

        <div>
          <Text4 mt={-5} mb={5}>Kisaran Harga</Text4>
        </div>

        <div>
          <Text1 mt={-8} mb={10}>Manfaat</Text1>
          <Flex>
          <Accordion allowMultiple>
            <Flex mb="12px">
              <ActionContainer>
                  <AccordionItem border="none">
                  <h2>
                    <AccordionButton border="none">
                      <Flex w="100%" alignItems="center" justifyContent="space-between">
                        <Box display="flex" alignItems="center" w="auto">
                          <FaCircle style={{ marginRight: '10px', color: '#568A73' }} />
                          <Text1 style={{ whiteSpace: 'nowrap' }}> {/* Menggunakan white-space: nowrap */}
                            Manfaat 1: Meningkatkan Kesehatan
                          </Text1>
                        </Box>
                        <AccordionIcon ml={8} color= '#568A73' />
                      </Flex>
                    </AccordionButton>
                  </h2>
                    <AccordionPanel pb={4}>
                      <Description>
                        Penjelasan mengenai manfaat pertama yang sangat penting untuk kesehatan tubuh, terutama dalam meningkatkan daya tahan tubuh dan metabolisme.
                      </Description>
                    </AccordionPanel>
                  </AccordionItem>
              </ActionContainer>
            </Flex>

            <Flex mb="12px">
              <ActionContainer>
                  <AccordionItem border="none">
                  <h2>
                    <AccordionButton border="none">
                      <Flex w="100%" alignItems="center" justifyContent="space-between">
                        <Box display="flex" alignItems="center" w="auto">
                          <FaCircle style={{ marginRight: '10px', color: '#568A73' }} />
                          <Text1 style={{ whiteSpace: 'nowrap' }}> {/* Menggunakan white-space: nowrap */}
                            Manfaat 2: Meningkatkan Kesehatan
                          </Text1>
                        </Box>
                        <AccordionIcon ml={8} color= '#568A73' />
                      </Flex>
                    </AccordionButton>
                  </h2>
                    <AccordionPanel pb={4}>
                      <Description>
                        Penjelasan mengenai manfaat pertama yang sangat penting untuk kesehatan tubuh, terutama dalam meningkatkan daya tahan tubuh dan metabolisme.
                      </Description>
                    </AccordionPanel>
                  </AccordionItem>
              </ActionContainer>
            </Flex>

            <Flex mb="12px">
              <ActionContainer>
                  <AccordionItem border="none">
                  <h2>
                    <AccordionButton border="none">
                      <Flex w="100%" alignItems="center" justifyContent="space-between">
                        <Box display="flex" alignItems="center" w="auto">
                          <FaCircle style={{ marginRight: '10px', color: '#568A73' }} />
                          <Text1 style={{ whiteSpace: 'nowrap' }}> {/* Menggunakan white-space: nowrap */}
                            Manfaat 3: Meningkatkan Kesehatan
                          </Text1>
                        </Box>
                        <AccordionIcon ml={8} color= '#568A73'/>
                      </Flex>
                    </AccordionButton>
                  </h2>
                    <AccordionPanel pb={4}>
                      <Description>
                        Penjelasan mengenai manfaat pertama yang sangat penting untuk kesehatan tubuh, terutama dalam meningkatkan daya tahan tubuh dan metabolisme.
                      </Description>
                    </AccordionPanel>
                  </AccordionItem>
              </ActionContainer>
            </Flex>

          </Accordion>
          </Flex>
        </div>

        <div>
          <Text1 mt={-8} mb={10}>Perlu Disiapkan</Text1>
          {Array.isArray(data.kebutuhan) && data.kebutuhan.length > 0 ? (
            data.kebutuhan.map((item, index) => (
              <BenefitContainer key={index}>
                <Icon src={Check} alt="check" />
                <Description>{item}</Description>
              </BenefitContainer>
            ))
          ) : (
            <Description>No specific needs listed.</Description>
          )}
        </div>

        <div>
          <Text1 mb={16}>Desa yang Menerapkan </Text1>
          <ActionContainer>
            <Text3>Belum tersedia</Text3>
          </ActionContainer>
          {isUserCreator && ( // Conditionally render the Edit button
            <Button
              width="100%"
              marginTop={13}
              marginBottom={3}
              onClick={() =>
                navigate(
                  generatePath(paths.EDIT_INNOVATION_PAGE, {
                    id: data.id,
                  })
                )
              }
            >
              Edit
            </Button>
          )}
        </div>
      </ContentContainer>
    </Container>
  );
}

export default DetailInnovation;
