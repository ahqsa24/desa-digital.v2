import React from "react";
import TopBar from "Components/topBar";
import Soge from "Assets/images/soge-logo.png";
import Dot from "Assets/icons/dot.svg";
import Check from "Assets/icons/check-circle.svg";
import Container from "Components/container";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import { paths } from "Consts/path.ts";
import {
  Img,
  Label,
  Title,
  ActionContainer,
  Icon,
  Text,
  Text2,
  Logo,
  Description,
  ChipContainer,
  ContentContainer,
  BenefitContainer,
} from "./_detailStyle.ts";
import { useQuery } from "react-query";
import { getInnovationById } from "Services/innovationServices.ts";
import { useEffect, useState } from "react";
import { DocumentData } from "firebase/firestore";
import { getDocumentById } from "../../../firebase/inovationTable.ts";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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

  const [data, setData] = useState<DocumentData>({});
  const [datainnovator, setDatainnovator] = useState<DocumentData>({});

  useEffect(() => {
    if (id) {
      getDocumentById("innovations", id)
        .then((detailInovasi) => {
          setData(detailInovasi);
          console.log("Innovation Data:", detailInovasi);  // Log the fetched innovation data
        })
        .catch((error) => {
          console.error("Error fetching innovation details:", error);
        });
    }
  }, [id]);

  useEffect(() => {
    if (data.innovatorId) {
      console.log("Fetching innovator with ID:", data.innovatorId);  // Log the innovator ID
      getDocumentById("innovators", data.innovatorId)
        .then((detailInnovator) => {
          setDatainnovator(detailInnovator);
          console.log("Innovator Data:", detailInnovator);  // Log the fetched innovator data
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

  return (
    <Container page>
      <TopBar title="Detail Inovasi" onBack={() => navigate(-1)} />
      {data.images && data.images.length > 1 ? (
        <Slider {...settings}>
          {data.images.map((image: string, index: number) => (
            <Img key={index} src={image} alt={`background-${index}`} />
          ))}
        </Slider>
      ) : (
        data.images && data.images.length === 1 && (
          <Img src={data.images[0]} alt={`background-0`} />
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
            <Description>Dibuat tahun {year}</Description>
          </ChipContainer>
        </div>
        <ActionContainer
          onClick={() =>
            navigate(
              generatePath(paths.DETAIL_INNOVATOR_PAGE, { id: data.innovatorId })
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
            <Text>Belum tersedia</Text>
          </ActionContainer>
        </div>
      </ContentContainer>
    </Container>
  );
}

export default DetailInnovation;
