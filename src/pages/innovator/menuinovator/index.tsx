import Container from "Components/container";
import CardInovator from "Components/cardInovator";
import { CardContainer, Title, Horizontal } from "./_inovator";
import AlIttifaq from "Assets/images/alittifaq-logo.jpg";
import Inagri from "Assets/images/inagri-logo.png";
import EFishery from "Assets/images/efishery-logo.jpg";
import Habibi from "Assets/images/habibi-logo.png";
import Aruna from "Assets/images/aruna-logo.jpg";
import ArunaHero from "Assets/images/hero-aruna.jpg";
import AlIttifaqHero from "Assets/images/hero-alittifaq.jpg";
import HabibiGardenHero from "Assets/images/hero-habibigarden.jpg";
import InagriHero from "Assets/images/hero-inagri.jpg";
import { generatePath, useNavigate } from "react-router-dom";
import { paths } from "Consts/path";
import { useQuery } from "react-query";
import { getInnovator } from "Services/innovator";


function MenuInovator() {
  const navigate = useNavigate();
  const { data, isFetched } = useQuery("innovators", getInnovator);

  console.log("tes", data);

  return (
    <Container>
      <Title></Title>
      <CardContainer>
        <Horizontal>
          {isFetched && data?.map((item: any, idx: number) => (
            <CardInovator
              key={idx}
              {...item}
              onClick={() =>
                navigate(
                  generatePath(paths.DETAIL_INNOVATOR_PAGE, { id: item.id })
                )
              }
            />
          ))}
        </Horizontal>
      </CardContainer>
    </Container>
  );
}

export default MenuInovator;
