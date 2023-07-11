import {
  Container,
  Background,
  CardContent,
  Title,
  Description,
  Logo,
} from "./_cardInnovatorStyle";

type CardInnovatorProps = {
  background?: string;
  logo?: string;
  innovatorName?: string;
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

function CardInnovator(props: CardInnovatorProps) {
  const {
    background,
    logo,
    innovatorName,
    category,
    targetUser,
    product,
    modelBusiness,
    whatsApp,
    instagram,
    website,
    onClick,
  } = props;
  
  return (
    <Container onClick={onClick}>
      <Background src={background} alt={innovatorName} />
      <CardContent>
        <Logo src={logo} alt={logo} />
        <Title>{innovatorName}</Title>
        <Description>10 Desa Dampingan</Description>
        <Description>10 Inovasi</Description>
      </CardContent>
    </Container>
  );
}

export default CardInnovator;
