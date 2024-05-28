import { Container, Title, Description, Content } from './_cardCategoryStyle'

type CardCategoryProps = {
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
}

function CardCategory(props: CardCategoryProps) {
  const { icon, title, description, onClick } = props;

  return (
    <Container onClick={onClick}>
      <img src={icon} alt={title} width={40} />
      <Content>
        <Title>{title}</Title>
        <Description>{description}</Description>
      </Content>
    </Container>
  );
}

export default CardCategory;
