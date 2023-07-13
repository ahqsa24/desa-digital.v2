import {
  Container,
  Title,
  Category,
  Description,
  Background,
  Content,
  Icon,
  Company,
  CompanyContainer,
  Applied,
} from "./_cardInnovationStyle";

type CardInnovationProps = {
  background?: string;
  logo?: string;
  name?: string;
  category?: string;
  description?: string;
  year?: string;
  // companyName?: string
  // appliedInnovation?: number
  onClick?: () => void;
};

function CardInnovation(props: CardInnovationProps) {
  const { background, logo, name, category, description, year, onClick } =
    props;
  console.log(background);
  return (
    <Container onClick={onClick}>
      <Background src={background} alt={name} />
      <Content>
        <Title>{name}</Title>
        <Category>{category}</Category>
        <Description>{description}</Description>
        <CompanyContainer>
          <Icon src={logo} alt={name} />
          <Company></Company>
        </CompanyContainer>
        <Applied>{year}</Applied>
      </Content>
    </Container>
  );
}

export default CardInnovation;
