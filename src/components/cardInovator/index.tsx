import {
  Container,
  Background,
  CardContent,
  Title,
  Description,
  Logo,
} from "./_cardInovatorStyle";

type CardInovatorProps = {
  background?: string;
  logo?: string;
  inovatorName?: string;
  category?: string;
  targetUser?: string;
  product?: string;
  modelBusiness?: string;
  whatsApp?: string;
  instagram?: string;
  website?: string;
  id?: number;
  description?: string;

  onClick: () => void;
};

function CardInovator(props: CardInovatorProps) {
  const {
    background,
    logo,
    inovatorName,
    category,
    targetUser,
    product,
    modelBusiness,
    whatsApp,
    instagram,
    website,
    onClick,
  } = props;
  console.log(background);
  return (
    <Container onClick={onClick}>
      <Background src={background} alt={inovatorName} />
      <CardContent>
        <Logo src={logo} alt={logo} />
        <Title>{inovatorName}</Title>
        <Description>10 Desa Dampingan</Description>
        <Description>10 Inovasi</Description>
      </CardContent>
    </Container>
  );
}

export default CardInovator;
