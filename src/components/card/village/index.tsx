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
  province?: string;
  district?: string;
  subdistrict?: string;
  village?: string;
  description?: string;
  logo?: string;
  header?: string;
  benefit?: string;
  nomorWhatsApp?: string;
  id?: string;
  nameVillage?: string;
  onClick: () => void;
};

function CardVillage(props: CardVillageProps) {
  const {
    province,
    district,
    subdistrict,
    village,
    description,
    logo,
    header,
    benefit,
    nomorWhatsApp,
    nameVillage,
    onClick,
  } = props;

  return (
    <Container onClick={onClick}>
      <Background src={header} alt='background' />
      <CardContent>
        <Logo src={logo} alt={logo} />
        <ContBadge> <img src="./src/assets/icons/badge-1.svg" alt="badge"/> </ContBadge>
        <Title>{nameVillage}</Title>
        <Description>2 Inovasi diterapkan</Description>
        <Location>
        <img src="./src/assets/icons/location.svg" alt="loc"/>
        <Description>
        {district} </Description> </Location>
        
      </CardContent>
    </Container>
  );
}

export default CardVillage;
