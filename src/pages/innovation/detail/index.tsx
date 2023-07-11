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
  const { background, benefit, category } = innovation || {};
  const { description, name, requirement, date, innovatorId } =
    innovation || {};

  const { data: innovator } = useQuery<any>(
    "innovatorById",
    () => getUserById(innovatorId),
    {
      enabled: !!innovatorId,
    }
  );

  const { innovatorName, logo } = innovator || {};
  const year = new Date(date).getFullYear();

  return (
    <Container page>
      <TopBar title="Detail Inovasi" onBack={() => navigate(-1)} />
      <Img src={background} alt="background" />
      <ContentContainer>
        <div>
          <Title>{name}</Title>
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
              {category}
            </Label>
            <Description>Dibuat tahun {year}</Description>
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
          <Text>{innovatorName}</Text>
        </ActionContainer>
        <div>
          <Text mb={16}>Deskripsi</Text>
          <Description>{description}</Description>
        </div>

        <div>
          <Text mb={16}>Keuntungan</Text>
          <BenefitContainer>
            <Icon mr={4} src={Dot} alt="dot" />
            <Description>{benefit}</Description>
          </BenefitContainer>
        </div>

        <div>
          <Text mb={16}>Perlu Disiapkan</Text>
          <BenefitContainer>
            <Icon src={Check} alt="check" />
            <Description>{requirement}</Description>
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
