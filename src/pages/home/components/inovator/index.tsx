import Container from "Components/container";
import CardInovator from "Components/cardInovator";
import { CardContainer, Title, Vertical } from "./_inovatorStyle";
import { useNavigate } from "react-router-dom";
import AlIttifaq from "Assets/images/alittifaq-logo.jpg";
import Inagri from "Assets/images/inagri-logo.png";
import EFishery from "Assets/images/efishery-logo.jpg";
import Habibi from "Assets/images/habibi-logo.png";
import Aruna from "Assets/images/aruna-logo.jpg";
import ArunaHero from "Assets/images/hero-aruna.jpg";
import AlIttifaqHero from "Assets/images/hero-alittifaq.jpg";
import HabibiGardenHero from "Assets/images/hero-habibigarden.jpg";
import InagriHero from "Assets/images/hero-inagri.jpg";
import { paths } from "Consts/path";

const data = [
  {
    background: `https://asset.kompas.com/crops/xKbxkCjPBXzFRTmqLYwG8ps65nI=/0x0:0x0/750x500/data/photo/2021/11/05/61842538b5611.jpg`,
    icon: EFishery,
    title: "eFishery",
    totalVillage: 3,
    totalInnovation: 2,
  },
  {
    background: AlIttifaqHero,
    icon: AlIttifaq,
    title: "Kopotren Al-Ittifaq",
    totalVillage: 3,
    totalInnovation: 2,
  },
  {
    background: ArunaHero,
    icon: Aruna,
    title: "Aruna",
    totalVillage: 1,
    totalInnovation: 1,
  },
  {
    background: HabibiGardenHero,
    icon: Habibi,
    title: "Habibi Garden",
    totalVillage: 3,
    totalInnovation: 2,
  },
  {
    background: InagriHero,
    icon: Inagri,
    title: "Inagri",
    totalVillage: 3,
    totalInnovation: 2,
  },
];
function Inovator() {
  const navigate = useNavigate();

  return (
    <Container>
      <Title>Inovator Unggulan</Title>
      <CardContainer>
        <Vertical>
          {data.map((item, idx) => (
            <CardInovator
              key={idx}
              {...item}
              onClick={() => navigate(paths.DETAIL_INNOVATOR_PAGE)}
            />
          ))}
        </Vertical>
      </CardContainer>
    </Container>
  );
}

export default Inovator;
