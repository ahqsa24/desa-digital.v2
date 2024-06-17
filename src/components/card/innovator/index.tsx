import {
  Container,
  Background,
  CardContent,
  Title,
  Description,
  Logo,
} from "./_cardInnovatorStyle";

type CardInnovatorProps = {
  id: string;
  header: string;
  logo: string;
  innovatorName: string;
  description: string;
  jumlahDesaDampingan: number
  jumlahInovasi: number
  onClick: () => void;
};

function CardInnovator(props: CardInnovatorProps) {
  const {
    header,
    logo,
    innovatorName,
    onClick,
    jumlahDesaDampingan,
    jumlahInovasi
  } = props;
  
  return (
    <Container onClick={onClick}>
      <Background src={header} alt={innovatorName} />
      <CardContent>
        <Logo src={logo} alt={logo} />
        <Title>{innovatorName}</Title>
        <Description>{jumlahDesaDampingan} Desa Dampingan</Description>
        <Description>{jumlahInovasi} Inovasi</Description>
      </CardContent>
    </Container>
  );
}

export default CardInnovator;
