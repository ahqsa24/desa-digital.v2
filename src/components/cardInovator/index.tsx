import { Container, Background, CardContent, Title, Description, Logo } from './_cardInovatorStyle'

type CardInovatorProps = {
  background: string
  icon: string
  title: string
  totalVillage: number
  totalInnovation: number
  onClick: () => void
}

function CardInovator(props: CardInovatorProps) {
  const { background, icon, title, totalVillage, totalInnovation, onClick } = props

  return (
    <Container onClick={onClick}>
      <Background src={background} alt={title} />
      <CardContent>
        <Logo src={icon} alt={title} />
        <Title>{title}</Title>
        <Description>{totalVillage} Desa Dampingan</Description>
        <Description>{totalInnovation} Inovasi</Description>
      </CardContent>
    </Container>
  )
}

export default CardInovator
