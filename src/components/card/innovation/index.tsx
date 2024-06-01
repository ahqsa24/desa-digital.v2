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
} from "./_cardInnovationStyle";

type CardInnovationProps = {
  images?: string[];
  namaInovasi?: string;
  kategori?: string;
  deskripsi?: string;
  tahunDibuat?: string;
  onClick?: () => void;
};

function CardInnovation(props: CardInnovationProps) {
  const { images, namaInovasi, kategori, deskripsi, tahunDibuat, onClick } = props;

  return (
    <Container onClick={onClick}>
      <Background src={images ? images[0] : undefined} alt={namaInovasi} />
      <Content>
        <Title>{namaInovasi}</Title>
        <Category>{kategori}</Category>
        <Description>{deskripsi}</Description>
        <CompanyContainer>
          {/* Placeholder for future company-related icons or logos */}
          <Icon src={""} alt={namaInovasi} />
        </CompanyContainer>
        <Applied>{tahunDibuat}</Applied>
      </Content>
    </Container>
  );
}

export default CardInnovation;
