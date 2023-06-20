import {
  Container,
  Background,
  CardContent,
  Title,
  Description,
  Logo,
} from "./_cardVillageStyle";

type CardVillageProps = {
  background: string;
  icon: string;
  title: string;
  location: string;
  totalInnovation: number;
  onClick: () => void;
};

function CardVillage(props: CardVillageProps) {
  const { background, icon, title, location, totalInnovation, onClick } = props;

  return (
    <Container onClick={onClick}>
      <Background src={background} alt={title} />
      <CardContent>
        <Logo src={icon} alt={title} />
        <Title>{title}</Title>
        <Description>{totalInnovation} Inovasi</Description>
        <Description>{location}</Description>
      </CardContent>
    </Container>
  );
}

export default CardVillage;
