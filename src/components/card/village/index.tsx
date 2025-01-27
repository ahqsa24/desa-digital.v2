import {
  Container,
  Background,
  CardContent,
  Title,
  ContBadge,
  Description,
  Logo,
  Location,
} from "./_cardVillageStyle";

type CardVillageProps = {
  provinsi?: string;
  kabupatenKota?: string;
  logo: string;
  header?: string;
  id: string;
  namaDesa: string;
  onClick: () => void;
};

function CardVillage(props: CardVillageProps) {
  const { provinsi, kabupatenKota, logo, header, namaDesa, onClick } = props;

  return (
    <Container onClick={onClick}>
      <Background src={header} alt="background" />
      <CardContent>
        <Logo src={logo} alt={logo} />
        <ContBadge>
          {" "}
          <img src="./src/assets/icons/badge-1.svg" alt="badge" />{" "}
        </ContBadge>
        <Title>{namaDesa}</Title>
        <Description>0 Inovasi diterapkan</Description>
        <Location>
          <img src="./src/assets/icons/location.svg" alt="loc" />
          <Description>
            {kabupatenKota}, {provinsi}{" "}
          </Description>{" "}
        </Location>
      </CardContent>
    </Container>
  );
}

export default CardVillage;
