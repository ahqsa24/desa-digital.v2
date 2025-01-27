import {
  Container,
  Background,
  CardContent,
  Title,
  Description,
  Logo,
} from "./_cardInnovatorStyle";

import defaultHeader from "@public/images/default-header.svg";
import defaultLogo from "@public/images/default-logo.svg";

type CardInnovatorProps = {
  id: string;
  header: string;
  logo: string;
  namaInovator: string;
  jumlahDesaDampingan: number
  jumlahInovasi: number
  onClick: () => void;
};

function CardInnovator(props: CardInnovatorProps) {
  const {
    header,
    logo,
    namaInovator,
    onClick,
    jumlahDesaDampingan,
    jumlahInovasi
  } = props;
  
  return (
    <Container onClick={onClick}>
      <Background src={header || defaultHeader} alt={namaInovator} />
      <CardContent>
        <Logo src={logo || defaultLogo } alt={logo} />
        <Title>{namaInovator}</Title>
        <Description>{jumlahDesaDampingan} Desa Dampingan</Description>
        <Description>{jumlahInovasi} Inovasi</Description>
      </CardContent>
    </Container>
  );
}

export default CardInnovator;
