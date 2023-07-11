import Container from "Components/container";
import CardVillage from "Components/card/village";
import { CardContainer, Title, Horizontal } from "./_villageStyle";
import LogoCilimus from "Assets/images/logo-desacilimus.jpg";
import LogoAlamendah from "Assets/images/logo-desaalamendah.jpg";
import LogoSoge from "Assets/images/logo-desasoge.jpg";
import LogoCibodas from "Assets/images/logo-desacibodas.jpg";
import EFishery from "Assets/images/efishery.jpg";
import Encomotion from "Assets/images/encomotion.jpg";
import HeaderAlamendah from "Assets/images/alamendah-header.jpg";
import HeaderCilimus from "Assets/images/cilimus header.jpg";
import { useNavigate } from "react-router-dom";

const data = [
  {
    background: EFishery,
    icon: LogoSoge,
    title: "Desa Soge",
    totalInnovation: 1,
    location: "Jawa Barat",
  },
  {
    background: HeaderAlamendah,
    icon: LogoAlamendah,
    title: "Desa Alamendah",
    totalInnovation: 1,
    location: "Jawa Barat",
  },
  {
    background: Encomotion,
    icon: LogoCibodas,
    title: "Desa Cibodas",
    totalInnovation: 2,
    location: "Jawa Barat",
  },
  {
    background: HeaderCilimus,
    icon: LogoCilimus,
    title: "Desa Cilimus",
    totalInnovation: 2,
    location: "Jawa Barat",
  },
];

function Village() {
  const navigate = useNavigate();
  // const { data, isFetched } = useQuery("villages", getVillages);

  return (
    <Container>
      <Title></Title>
      <CardContainer>
        <Horizontal>
          {/* {data?.map((item: any, idx: number) => (
            <CardVillage
              key={idx}
              {...item}
              onClick={() => navigate(paths.DETAIL_VILLAGE_PAGE)}
            />
          ))} */}
        </Horizontal>
      </CardContainer>
    </Container>
  );
}

export default Village;
