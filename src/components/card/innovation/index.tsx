import {
  Container,
  Title,
  Category,
  Description,
  Background,
  Content,
  Icon,
  CompanyContainer,
  Applied,
  InnovatorName,
} from "./_cardInnovationStyle";

type CardInnovationProps = {
  images?: string[];
  namaInovasi?: string;
  kategori?: string;
  deskripsi?: string;
  tahunDibuat?: string;
  innovatorLogo?: string;
  innovatorName?: string;
  onClick?: () => void;
};

function CardInnovation(props: CardInnovationProps) {
  const { images, namaInovasi, kategori, deskripsi, tahunDibuat, innovatorLogo, innovatorName, onClick } = props;

  return (
    <Container onClick={onClick}>
      <Background src={images ? images[0] : undefined} alt={namaInovasi} />
      <Content>
        <Title>{namaInovasi}</Title>
        <Category>{kategori}</Category>
        <Description>{deskripsi}</Description>
        <CompanyContainer>
          <Icon src={innovatorLogo || ""} alt={namaInovasi} />
          <InnovatorName>{innovatorName}</InnovatorName>
        </CompanyContainer>
        <Applied>{tahunDibuat}</Applied>
      </Content>
    </Container>
  );
}

export default CardInnovation;
