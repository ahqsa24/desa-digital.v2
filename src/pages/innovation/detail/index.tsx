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
  Logo,
  Description,
  ChipContainer,
  ContentContainer,
  BenefitContainer,
} from "./_detailStyle.ts";
import { useQuery } from "react-query";
import { getInnovationById } from "Services/innovationServices.ts";
import { getUserById } from "Services/userServices.ts";
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

  const { background, benefit, category } = innovation || {};
  const { description, name, requirement, date, innovatorId } = innovation || {};

  useEffect(() => {
    getDocumentById("innovations", id)
      .then((detailInovasi) => {
        setData(detailInovasi);
      })
      .catch((error) => {
        // Handle error here
      });
  }, [id]);

  const { data: innovator } = useQuery<any>(
    "innovatorById",
    () => getUserById(innovatorId),
    {
      enabled: !!innovatorId,
    }
  );

  const [datainnovator, setDatainnovator] = useState<DocumentData>({});

  useEffect(() => {
    getDocumentById("users", data.innovatorId)
      .then((detailInovasi) => {
        setDatainnovator(detailInovasi);
      })
      .catch((error) => {
        // Handle error here
      });
  }, [data.innovatorId]);

  const { innovatorName, logo } = innovator || {};
  const year = new Date(date).getFullYear();

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
                    category: category,
                  })
                )
              }
            >
              {data.kategori}
            </Label>
            <Description>Dibuat tahun {data.tahunDibuat}</Description>
          </ChipContainer>
        </div>
        <ActionContainer
          onClick={() =>
            navigate(
              generatePath(paths.DETAIL_INNOVATOR_PAGE, { id: innovatorId })
            )
          }
        >
          <Logo src={logo} alt="logo" />
          <Text>{datainnovator.innovatorName}</Text>
        </ActionContainer>
        <div>
          <Text mb={16}>Deskripsi</Text>
          <Description>{data.deskripsi}</Description>
        </div>

        <div>
          <Text mb={16}>Keuntungan</Text>
          <BenefitContainer>
            <Icon mr={4} src={Dot} alt="dot" />
            <Description></Description>
          </BenefitContainer>
        </div>

        <div>
          <Text mb={16}>Perlu Disiapkan</Text>
          <BenefitContainer>
            <Icon src={Check} alt="check" />
            <Description>{data.kebutuhan}</Description>
          </BenefitContainer>
        </div>

        <div>
          <Text mb={16}>Desa yang Menerapkan </Text>
          <ActionContainer onClick={() => navigate(paths.DETAIL_VILLAGE_PAGE)}>
            <Logo src={Soge} alt={Logo} />
            <Text>Desa Soge</Text>
          </ActionContainer>
        </div>
      </ContentContainer>
    </Container>
  );
}

export default DetailInnovation;
