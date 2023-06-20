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
} from './_cardInnovationStyle'

type CardInnovationProps = {
  background: string
  icon: string
  title: string
  category: string
  description: string
  companyName: string
  appliedInnovation: number
  onClick?: () => void
}

function CardInnovation(props: CardInnovationProps) {
  const { background, icon, title, category, description, companyName, appliedInnovation, onClick } = props

  return (
    <Container onClick={onClick}>
      <Background src={background} alt={title} />
      <Content>
        <Title>{title}</Title>
        <Category>{category}</Category>
        <Description>{description}</Description>
        <CompanyContainer>
          <Icon src={icon} alt={title} />
          <Company>{companyName}</Company>
        </CompanyContainer>
        <Applied>Diterapkan di {appliedInnovation} desa</Applied>
      </Content>
    </Container>
  )
}

export default CardInnovation
