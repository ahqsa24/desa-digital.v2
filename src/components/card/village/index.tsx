import {
  Container,
  Background,
  CardContent,
  Title,
  Description,
  Logo,
} from "./_cardVillageStyle";

type CardVillageProps = {
  name?: string;
  city?: string;
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
    name,
    city,
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
      <Background src={header} alt={header} />
      <CardContent>
        <Logo src={logo} alt={logo} />
        <Title>{nameVillage}</Title>
        <Description>Inovasi</Description>
        <Description>
          {city},{subdistrict}
        </Description>
      </CardContent>
    </Container>
  );
}

export default CardVillage;
