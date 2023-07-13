import {
  Container,
  Background,
  CardContent,
  Title,
  Description,
  Logo,
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
        <Title>{nameVillage}</Title>
        <Description>10 Inovasi diterapkan</Description>
        <Description>
        {province} </Description>
      </CardContent>
    </Container>
  );
}

export default CardVillage;
