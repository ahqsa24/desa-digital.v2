import { Button, Img } from "@chakra-ui/react";
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
  Icon,
  Label,
  Logo,
  Text,
  Text2,
  Text3,
  Title,
} from "./_detailStyle.ts";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase/clientApp";

function DetailInnovation() {
  const navigate = useNavigate();
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
            <Description>Sejak tahun {year}</Description>
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
            <Text>{datainnovator.namaInovator}</Text>
          </div>
        </ActionContainer>
        <div>
          <Text mb={16}>Deskripsi</Text>
          <Description>{data.deskripsi}</Description>
        </div>

        <div>
          <Text mb={16}>Perlu Disiapkan</Text>
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
          <Text mb={16}>Desa yang Menerapkan </Text>
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
