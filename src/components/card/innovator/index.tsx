import {
  Container,
  Background,
  CardContent,
  Title,
  Description,
  Logo,
  ContBadge,
} from "./_cardInnovatorStyle";

import defaultHeader from "@public/images/default-header.svg";
import defaultLogo from "@public/images/default-logo.svg";
import badge1 from "@public/icons/badge-1.svg";
import {Flex} from "@chakra-ui/react";


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
        <Logo src={logo || defaultLogo} alt={logo} />
        <ContBadge>
          {" "}
          <img src={badge1} alt="badge" />{" "}
        </ContBadge>
        <Title>{namaInovator}</Title>
        <Flex direction="column" marginTop="auto">
          <Description>{jumlahDesaDampingan} Desa Dampingan</Description>
          <Description>{jumlahInovasi} Inovasi</Description>
        </Flex>
      </CardContent>
    </Container>
  );
}

export default CardInnovator;
